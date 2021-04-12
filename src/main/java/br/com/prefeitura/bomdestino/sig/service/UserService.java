package br.com.prefeitura.bomdestino.sig.service;

import br.com.prefeitura.bomdestino.sig.config.Constants;
import br.com.prefeitura.bomdestino.sig.domain.AbstractUser;
import br.com.prefeitura.bomdestino.sig.domain.Profile;
import br.com.prefeitura.bomdestino.sig.domain.User;
import br.com.prefeitura.bomdestino.sig.exception.ErrorConstants;
import br.com.prefeitura.bomdestino.sig.exception.PasswordRulesException;
import br.com.prefeitura.bomdestino.sig.repository.AuthorityRepository;
import br.com.prefeitura.bomdestino.sig.repository.GenericUserRepository;
import br.com.prefeitura.bomdestino.sig.repository.ProfileRepository;
import br.com.prefeitura.bomdestino.sig.security.SecurityUtils;
import br.com.prefeitura.bomdestino.sig.service.dto.AuthorityDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.PasswordUpdateDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.UserDTO;
import br.com.prefeitura.bomdestino.sig.service.enums.AuditEvents;
import br.com.prefeitura.bomdestino.sig.service.util.RandomUtil;
import br.com.prefeitura.bomdestino.sig.util.RegexConstant;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.AdminCannotBeEditedException;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.AlertException;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.BadRequestAlertException;
import br.com.prefeitura.bomdestino.sig.web.rest.vm.ManagedUserVM;
import joptsimple.internal.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.audit.listener.AuditApplicationEvent;
import org.springframework.cache.CacheManager;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

import static br.com.prefeitura.bomdestino.sig.config.Constants.*;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService extends AbstractService {

    private static final String EVENT_MESSAGE = "message=Usuário ";
    private static final String LOG_MESSAGE_USER = "Changed Information for User: {}";
    private static final Integer PASSWORD_HISTORY_SIZE_LIMIT = 24;
    private static final String USER_DELETED = "User deleted";

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    @Value("${test}")
    private Boolean isTest;

    private final GenericUserRepository genericUserRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final CacheManager cacheManager;

    private final ProfileRepository profileRepository;

    private final ApplicationEventPublisher applicationEventPublisher;

    public UserService(GenericUserRepository genericUserRepository,
                       PasswordEncoder passwordEncoder,
                       AuthorityRepository authorityRepository,
                       CacheManager cacheManager,
                       ProfileRepository profileRepository,
                       ApplicationEventPublisher applicationEventPublisher) {
        this.genericUserRepository = genericUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
        this.profileRepository = profileRepository;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return this.genericUserRepository.findOneByResetKey(key)
                .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
                .map(user -> {
                    user.setPassword(this.passwordEncoder.encode(newPassword));
                    user.setResetKey(null);
                    user.setResetDate(null);
                    this.clearUserCaches(user);
                    return user;
                });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return this.genericUserRepository.findOneByEmailIgnoreCase(mail)
                .filter(User::isActivated)
                .map(user -> {
                    user.setResetKey(RandomUtil.generateResetKey());
                    user.setResetDate(Instant.now());
                    this.clearUserCaches(user);
                    return user;
                });
    }

    public User createUser(ManagedUserVM userDTO) {
        validateUser(userDTO);
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setOnFirstPassword(true);
        if (!Strings.isNullOrEmpty(userDTO.getEmail())) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = this.passwordEncoder.encode(userDTO.getPassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);

        if (userDTO.getProfiles() != null) {
            Set<Profile> profiles = new HashSet<>();
            for (Profile profileName : userDTO.getProfiles()) {
                profiles.add(this.profileRepository.findByName(profileName.getName()));
            }
            checkPasswordCreationRules(null, userDTO);
            user.setLastPasswordHashes(updatePasswordHistory(user.getLastPasswordHashes(), user.getPassword()));
            user.setProfiles(profiles);
        }

        this.genericUserRepository.save(user);
        this.clearUserCaches(user);
        log.debug("Created Information for User: {}", user);

        this.publishEvent(AuditEvents.USER_CREATED, EVENT_MESSAGE + user.getLogin() + " cadastrado", "id=" + user.getId());
        return user;
    }

    private void validateUser(ManagedUserVM userDTO) {
        if (userDTO.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
        } else if (this.genericUserRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
            throw AlertException.loginAlreadyUsedException();
        } else if (!Objects.isNull(userDTO.getEmail()) && this.genericUserRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        }
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<UserDTO> updateUser(ManagedUserVM userDTO) {
        validateUpdateUser(userDTO);
        return Optional.of(this.genericUserRepository
                .findById(userDTO.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(user -> {
                    this.clearUserCaches(user);
                    user.setLogin(userDTO.getLogin().toLowerCase());
                    user.setFirstName(userDTO.getFirstName());
                    user.setLastName(userDTO.getLastName());
                    if (!Strings.isNullOrEmpty(userDTO.getEmail())) {
                        user.setEmail(userDTO.getEmail().toLowerCase());
                    } else {
                        user.setEmail(null);
                    }
                    user.setActivated(userDTO.isActivated());
                    user.setLangKey(userDTO.getLangKey());
                    Set<Profile> managedAuthorities = user.getProfiles();
                    managedAuthorities.clear();
                    if (userDTO.isUpdatePassword()) {
                        checkPasswordCreationRules(user.getId(), userDTO);
                        String encryptedPassword = this.passwordEncoder.encode(userDTO.getPassword());
                        user.setPassword(encryptedPassword);
                        user.setLastPasswordHashes(updatePasswordHistory(user.getLastPasswordHashes(), userDTO.getPassword()));
                        user.setLastPasswordUpdate(null);
                    }

                    for (Profile profileName : userDTO.getProfiles()) {
                        managedAuthorities.add(this.profileRepository.findByName(profileName.getName()));
                    }
                    user.setProfiles(managedAuthorities);

                    this.genericUserRepository.save(user);
                    this.clearUserCaches(user);
                    log.debug(LOG_MESSAGE_USER, user);

                    publishEvent(AuditEvents.USER_UPDATED, EVENT_MESSAGE + user.getLogin() + " atualizado", "id=" + user.getId());

                    return user;
                })
                .map(UserDTO::new);
    }

    private void validateUpdateUser(ManagedUserVM userDTO) {
        final Optional<User> userWithLogin = genericUserRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
        final Optional<User> userWithId = genericUserRepository.findById(userDTO.getId());
        if (userWithLogin.isPresent() && (!userWithLogin.get().getId().equals(userDTO.getId()))) {
            throw AlertException.loginAlreadyUsedException();
        }

        if (userWithId.isPresent() && userWithId.get().getId().equals(userDTO.getId()) && userWithId.get().getLogin().equals(ADMIN)) {
            if (!userWithId.get().getLogin().equals(userDTO.getLogin())) {
                throw new AdminCannotBeEditedException(ErrorConstants.ADMIN_CANNOT_BE_EDITED);
            }

            if (!userWithId.get().getProfiles().equals(userDTO.getProfiles())) {
                throw new AdminCannotBeEditedException(ErrorConstants.PROFILE_ADMIN_CANNOT_BE_EDITED);
            }
        }
        if (!Objects.isNull(userDTO.getEmail())) {
            final Optional<User> userWithEmail = genericUserRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
            if (userWithEmail.isPresent() && !userWithEmail.get().getId().equals(userDTO.getId())) {
                throw new EmailAlreadyUsedException();
            }
        }
    }

    public void logicalExclusion(String login) {
        Optional<User> optionalUser = this.genericUserRepository.findOneByLogin(login);
        if (!optionalUser.isPresent()) {
            throw new UserNotFoundException("No user found with: " + "User" + login + " not found.");
        }

        optionalUser.get().setActivated(!optionalUser.get().isActivated());
        this.genericUserRepository.save(optionalUser.get());
        this.genericUserRepository.save(optionalUser.get());

        if (optionalUser.get().isActivated()) {
            this.publishEvent(AuditEvents.USER_ACTIVATED, EVENT_MESSAGE + login + " ativado", "id=" + optionalUser.get().getId());
        } else {
            this.publishEvent(AuditEvents.USER_DEACTIVATED, EVENT_MESSAGE + login + " desativado", "id=" + optionalUser.get().getId());
        }

    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(String search, Pageable pageable) {
        if (!Strings.isNullOrEmpty(search)) {
            return this.genericUserRepository.findAllByLoginContainingIgnoreCaseOrFirstNameContainingIgnoreCaseAndBlindingIsFalse(pageable, search, search).map(UserDTO::new);
        }
        return this.genericUserRepository.findAllByLoginNotAndBlindingIsFalse(pageable, Constants.ANONYMOUS_USER).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserByLogin(String login) {
        return this.genericUserRepository.findOneByLogin(login);
    }

    @Transactional(readOnly = true)
    public User getLoggedUser() {
        final Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (!login.isPresent()) {
            throw new UserNotFoundException("No logged user found.");
        }
        final Optional<User> user = getUserByLogin(login.get());
        if (user.isPresent()) return user.get();
        throw new UserNotFoundException("Logged User not found.");
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(this.genericUserRepository::findOneByLogin);
    }

    /**
     * Gets a list of all the authorities.
     *
     * @return a list of all the authorities pageable.
     */
    public Page<AuthorityDTO> getAuthorities(Pageable pageable, boolean isUnPaged) {
        if (isUnPaged) {
            return this.authorityRepository.findAll(Pageable.unpaged()).map(AuthorityDTO::new);
        }
        return this.authorityRepository.findAll(pageable).map(AuthorityDTO::new);
    }


    private void clearUserCaches(AbstractUser user) {
        Objects.requireNonNull(cacheManager.getCache(USERS_BY_LOGIN_CACHE)).evict(user.getLogin());
        if (!Objects.isNull(user.getEmail())) {
            Objects.requireNonNull(cacheManager.getCache(USERS_BY_EMAIL_CACHE)).evict(user.getEmail());
        }
    }

    private void publishEvent(AuditEvents event, String... data) {
        if (Boolean.TRUE.equals(isTest)) return;

        applicationEventPublisher.publishEvent(new AuditApplicationEvent(
                getLoggedUser().getLogin(),
                event.name(),
                data
        ));
    }

    public void changePassword(PasswordUpdateDTO dto) {
        SecurityUtils.getCurrentUserLogin().flatMap(genericUserRepository::findOneByLogin).ifPresent(currentUser -> {
            checkPasswordCreationRules(currentUser, dto);
            String passwordHash = passwordEncoder.encode(dto.getNewPassword());
            currentUser.setPassword(passwordHash);
            currentUser.setLastPasswordHashes(updatePasswordHistory(currentUser.getLastPasswordHashes(), passwordHash));
            currentUser.setLastPasswordUpdate(Instant.now());
            currentUser.setOnFirstPassword(false);
            this.genericUserRepository.save(currentUser);
        });
    }

    private void checkPasswordCreationRules(User user, PasswordUpdateDTO dto) {
        validatePasswordPattern(dto.getNewPassword());
        checkForUsernameInPassword(user.getFirstName() + " " + user.getLastName(), user.getLogin(), dto.getNewPassword());
        checkPasswordUniqueness(user, dto.getNewPassword());
    }

    private void checkPasswordCreationRules(Long userId, UserDTO dto) {
        validatePasswordPattern(dto.getPassword());
        checkForUsernameInPassword(dto.getFirstName() + " " + dto.getLastName(), dto.getLogin(), dto.getPassword());
        if (Objects.nonNull(userId)) {
            genericUserRepository.findById(userId).ifPresent(user -> checkPasswordUniqueness(user, dto.getPassword()));
        }
    }

    private void validatePasswordPattern(String password) {
        if (!Pattern.compile(RegexConstant.PASSWORD_REGEX).matcher(password).find()) {
            throw new PasswordRulesException("userManagement.changePassword.error.pattern");
        }
    }

    private void checkForUsernameInPassword(String userName, String userLogin, String password) {
        for (String namePart : userName.split(" ")) {
            if (namePart.length() > 3) {
                boolean patternFound = Pattern.compile(namePart, Pattern.CASE_INSENSITIVE).matcher(password).find();
                if (patternFound) {
                    throw new PasswordRulesException("userManagement.changePassword.error.userNameInPassword");
                }
            }
        }
        if (userLogin.length() > 3) {
            boolean patternFound = Pattern.compile(userLogin, Pattern.CASE_INSENSITIVE).matcher(password).find();
            if (patternFound) {
                throw new PasswordRulesException("userManagement.changePassword.error.pattern");
            }
        }
    }

    private void checkPasswordUniqueness(User user, String password) {
        user.getLastPasswordHashes().forEach(oldPasswordHash -> {
            if (passwordEncoder.matches(password, oldPasswordHash)) {
                throw new PasswordRulesException("userManagement.changePassword.error.oldPassword");
            }
        });
    }

    private List<String> updatePasswordHistory(List<String> lastPasswordHashes, String newPasswordHash) {
        lastPasswordHashes.add(newPasswordHash);
        int passwordHistorySize = lastPasswordHashes.size();
        if (passwordHistorySize > PASSWORD_HISTORY_SIZE_LIMIT) {
            lastPasswordHashes = lastPasswordHashes
                    .subList(passwordHistorySize - PASSWORD_HISTORY_SIZE_LIMIT, passwordHistorySize);
        }
        return lastPasswordHashes;
    }

    public void checkUserBlockLogin(String login) {
        Optional<User> user = genericUserRepository.findOneByLogin(login);
        if (user.isPresent()) {
            User currentUser = user.get();
            if (currentUser.isActivated()) {
                if (Objects.isNull(currentUser.getLastPasswordError())) {
                    currentUser.setLastPasswordError(Instant.now());
                }
                Date lastPasswordError = Date.from(currentUser.getLastPasswordError());
                long differenceInMillies = Math.abs(lastPasswordError.getTime() - new Date().getTime());
                long differenceInHours = TimeUnit.HOURS.convert(differenceInMillies, TimeUnit.MILLISECONDS);
                if (differenceInHours >= 1) {
                    currentUser.setLastPasswordError(Instant.now());
                    currentUser.setCountErrorsPassword(1);
                } else {
                    if (currentUser.getCountErrorsPassword() >= 4) {
                        currentUser.setActivated(false);
                        currentUser.setCountErrorsPassword(0);
                    } else {
                        currentUser.setCountErrorsPassword(currentUser.getCountErrorsPassword() + 1);
                    }
                }
                this.genericUserRepository.save(currentUser);
            }
        }
    }

    @Transactional
    public void blindingUser(Long id) {
        Optional.of(this.genericUserRepository
                .findById(id))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(user -> {
                    this.clearUserCaches(user);
                    user.setLogin(UUID.randomUUID().toString().substring(0, 19));
                    user.setFirstName(USER_DELETED);
                    user.setLastName(USER_DELETED);
                    user.setEmail(UUID.randomUUID().toString() + "@userdeleted.com");
                    user.setBlinding(true);
                    this.genericUserRepository.save(user);
                    return user;
                })
                .map(UserDTO::new);
    }
}
