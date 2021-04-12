package br.com.prefeitura.bomdestino.sig.service;

import br.com.prefeitura.bomdestino.sig.domain.Authority;
import br.com.prefeitura.bomdestino.sig.domain.Profile;
import br.com.prefeitura.bomdestino.sig.exception.ErrorConstants;
import br.com.prefeitura.bomdestino.sig.exception.NotFoundException;
import br.com.prefeitura.bomdestino.sig.repository.ProfileRepository;
import br.com.prefeitura.bomdestino.sig.security.AuthoritiesConstants;
import br.com.prefeitura.bomdestino.sig.service.dto.ProfileDTO;
import br.com.prefeitura.bomdestino.sig.service.enums.AuditEvents;
import br.com.prefeitura.bomdestino.sig.service.mapper.AuthorityMapper;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.AlertException;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.ProfileAdminCannotBeEditedException;
import com.google.common.base.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static br.com.prefeitura.bomdestino.sig.config.Constants.ADMIN_PROFILE;

/**
 * ProfileModel Service
 */
@Service
public class ProfileService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(ProfileService.class);

    private ProfileRepository profileRepository;

    private AuthorityMapper authorityMapper;

    private final CacheManager cacheManager;

    private final EventPublisherService eventPublisherService;

    public ProfileService(ProfileRepository profileRepository,
                          AuthorityMapper authorityMapper,
                          CacheManager cacheManager,
                          EventPublisherService eventPublisherService) {
        this.profileRepository = profileRepository;
        this.authorityMapper = authorityMapper;
        this.cacheManager = cacheManager;
        this.eventPublisherService = eventPublisherService;
    }

    /**
     * Get all profiles
     *
     * @param pageable
     * @return profiles
     */
    public Page<ProfileDTO> getAllProfiles(Pageable pageable, String search) {
        Page<ProfileDTO> profiles;
        if (Strings.isNullOrEmpty(search)) {
            profiles = this.profileRepository.findAll(pageable).map(ProfileDTO::new);
        } else {
            profiles = this.profileRepository.findAllByNameContainingIgnoreCase(Pageable.unpaged(), search).map(ProfileDTO::new);
        }
        log.debug("Returning profiles: {}", profiles);
        return profiles;
    }

    /**
     * Get specific profile by id
     *
     * @param id
     * @return profile
     */
    public Optional<ProfileDTO> getProfileById(Long id) {
        Optional<ProfileDTO> profileDTO = this.profileRepository.findById(id).map(ProfileDTO::new);
        log.debug("Returning profile: {}", profileDTO);
        return profileDTO;
    }

    /**
     * Create new profile
     *
     * @param profileDTO
     * @return profile created
     */
    public ProfileDTO createProfile(ProfileDTO profileDTO) {
        if (!profileDTO.getName().isEmpty() && profileRepository.findByNameIgnoreCase(profileDTO.getName().trim())
                != null) {
            throw AlertException.profileAlreadyUsedException();
        }
        Profile profile = new Profile();
        profile.setName(profileDTO.getName().trim());
        profile.setDescription(profileDTO.getDescription());
        profile.setActivated(Boolean.TRUE);
        profile.setAuthorities(this.authorityMapper.authorityDTOsToAuthorities(profileDTO.getAuthorities()));
        this.profileRepository.save(profile);
        log.debug("profile created: {}", profile);

        this.eventPublisherService.publishEvent(AuditEvents.PROFILE_CREATED, "message=Perfil " + profile.getName() + " criado", "id=" + profile.getId());
        return new ProfileDTO(profile);
    }

    /**
     * Update basic information (name, description, profiles) for the current profile.
     *
     * @param profileDTO updated profile
     */
    public ProfileDTO updateProfile(ProfileDTO profileDTO) {

        Optional<Profile> profile = profileRepository.findById(profileDTO.getId());
        if (!profile.isPresent()) {
            throw new NotFoundException(ErrorConstants.PROFILE_NOT_FOUND);
        }

        Profile profileFounded = profileRepository.findByNameIgnoreCase(profileDTO.getName().trim());

        if (profileFounded != null && !profileFounded.getId().equals(profileDTO.getId())) {
            throw AlertException.profileAlreadyUsedException();
        }

        final Profile profileToUpdate = profile.get();
        if (ADMIN_PROFILE.equalsIgnoreCase(profileToUpdate.getName())) {
            throw new ProfileAdminCannotBeEditedException(ErrorConstants.PROFILE_CANNOT_BE_UPDATED);
        }

        this.invalidateCache();
        profileToUpdate.setName(profileDTO.getName().trim());
        profileToUpdate.setDescription(profileDTO.getDescription());
        profileToUpdate.setAuthorities(this.authorityMapper.authorityDTOsToAuthorities(profileDTO.getAuthorities()));
        profileToUpdate.setLastModifiedDate(Instant.now());
        log.debug("Changed Information for ProfileModel: {}", profileToUpdate);

        this.eventPublisherService.publishEvent(AuditEvents.PROFILE_UPDATED, "message=Perfil " + profileToUpdate.getName() + " atualizado", "id=" + profileToUpdate.getId());
        return new ProfileDTO(this.profileRepository.save(profileToUpdate));
    }

    private void invalidateCache() {
        for (String nameCache : this.cacheManager.getCacheNames()) {
            this.cacheManager.getCache(nameCache).clear();
        }
    }

    public void addToAdmin(Authority authority) {
        final Profile admin = this.profileRepository.findByName("Administrator");
        admin.getAuthorities().add(authority);
    }
}
