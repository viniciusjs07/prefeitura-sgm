package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.SystemSGMApp;
import br.com.prefeitura.bomdestino.sig.domain.AbstractUser;
import br.com.prefeitura.bomdestino.sig.domain.Authority;
import br.com.prefeitura.bomdestino.sig.domain.Profile;
import br.com.prefeitura.bomdestino.sig.domain.User;
import br.com.prefeitura.bomdestino.sig.repository.GenericUserRepository;
import br.com.prefeitura.bomdestino.sig.repository.ProfileRepository;
import br.com.prefeitura.bomdestino.sig.security.AuthoritiesConstants;
import br.com.prefeitura.bomdestino.sig.service.UserService;
import br.com.prefeitura.bomdestino.sig.service.dto.UserDTO;
import br.com.prefeitura.bomdestino.sig.service.mapper.UserMapper;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.ExceptionTranslator;
import br.com.prefeitura.bomdestino.sig.web.rest.vm.ManagedUserVM;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Assert;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static br.com.prefeitura.bomdestino.sig.config.Constants.USERS_BY_EMAIL_CACHE;
import static br.com.prefeitura.bomdestino.sig.config.Constants.USERS_BY_LOGIN_CACHE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link UserResource} REST controller.
 */
@SpringBootTest(classes = SystemSGMApp.class)
public class UserResourceIT {

    private static final String DEFAULT_LOGIN = "johndoe";
    private static final String NEW_LOGIN = "admin.01";
    private static final String NEW_EMAIL = "admin@localhot.com";

    private static final Long DEFAULT_ID = 1L;

    private static final String DEFAULT_PASSWORD = "passjohndoe";
    private static final String UPDATED_PASSWORD = "passjhipster";

    private static final String DEFAULT_EMAIL = "johndoe@localhost";
    private static final String UPDATED_EMAIL = "jhipster@localhost";

    private static final String DEFAULT_FIRSTNAME = "john";
    private static final String UPDATED_FIRSTNAME = "jhipsterFirstName";

    private static final String DEFAULT_LASTNAME = "doe";
    private static final String UPDATED_LASTNAME = "jhipsterLastName";

    private static final String DEFAULT_LANGKEY = "en";
    private static final String UPDATED_LANGKEY = "fr";

    @Autowired
    private GenericUserRepository genericUserRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private CacheManager cacheManager;

    private MockMvc restUserMockMvc;

    private User user;

    private Set<Profile> profilesToDTO = new HashSet<>();

    @BeforeEach
    public void setup() {
        cacheManager.getCache(USERS_BY_LOGIN_CACHE).clear();
        cacheManager.getCache(USERS_BY_EMAIL_CACHE).clear();
        UserResource userResource = new UserResource(this.userService);

        this.restUserMockMvc = MockMvcBuilders.standaloneSetup(userResource)
                .setCustomArgumentResolvers(pageableArgumentResolver)
                .setControllerAdvice(exceptionTranslator)
                .setMessageConverters(jacksonMessageConverter)
                .build();
        this.profilesToDTO = new HashSet<>();
        final Profile profile = new Profile();
        profile.setName("Administrator");
        profile.setId(1l);
        this.profilesToDTO.add(profile);
    }

    @AfterEach
    public void removeUser() {
        Optional<User> defaultUser = this.genericUserRepository.findOneByLogin(DEFAULT_LOGIN);
        defaultUser.ifPresent(value -> {
            this.genericUserRepository.delete(value);
        });

        Optional<User> userNewLogin = this.genericUserRepository.findOneByLogin(NEW_LOGIN);
        userNewLogin.ifPresent(value -> {
            this.genericUserRepository.delete(value);
        });

    }

    /**
     * Create a User.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which has a required relationship to the User entity.
     */
    public static User createEntity() {
        User user = new User();
        user.setLogin(DEFAULT_LOGIN + RandomStringUtils.randomAlphabetic(5));
        user.setPassword(RandomStringUtils.random(30));
        user.setActivated(true);
        user.setEmail(RandomStringUtils.randomAlphabetic(5) + DEFAULT_EMAIL);
        user.setFirstName(DEFAULT_FIRSTNAME);
        user.setLastName(DEFAULT_LASTNAME);
        user.setLangKey(DEFAULT_LANGKEY);
        return user;
    }

    @BeforeEach
    public void initTest() {
        user = createEntity();
        user.setLogin(DEFAULT_LOGIN);
        user.setEmail(DEFAULT_EMAIL);
        this.genericUserRepository.save(this.user);
    }

    @Test
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void createUser() throws Exception {
        int databaseSizeBeforeCreate = genericUserRepository.findAll().size();

        // Create the User
        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setLogin(NEW_LOGIN);
        managedUserVM.setPassword(DEFAULT_PASSWORD);
        managedUserVM.setFirstName(DEFAULT_FIRSTNAME);
        managedUserVM.setLastName(DEFAULT_LASTNAME);
        managedUserVM.setEmail(NEW_EMAIL);
        managedUserVM.setActivated(true);
        managedUserVM.setLangKey(DEFAULT_LANGKEY);
        managedUserVM.setProfiles(profilesToDTO);

        restUserMockMvc.perform(post("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
                .andExpect(status().isCreated());

        // Validate the User in the database
        List<User> userList = genericUserRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate + 1);
        User testUser = userList.get(userList.size() - 1);
        assertThat(testUser.getLogin()).isEqualTo(NEW_LOGIN);
        assertThat(testUser.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(testUser.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(testUser.getEmail()).isEqualTo(NEW_EMAIL);
        assertThat(testUser.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void createUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = genericUserRepository.findAll().size();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setId(1L);
        managedUserVM.setLogin(DEFAULT_LOGIN);
        managedUserVM.setPassword(DEFAULT_PASSWORD);
        managedUserVM.setFirstName(DEFAULT_FIRSTNAME);
        managedUserVM.setLastName(DEFAULT_LASTNAME);
        managedUserVM.setEmail(DEFAULT_EMAIL);
        managedUserVM.setActivated(true);
        managedUserVM.setLangKey(DEFAULT_LANGKEY);
        managedUserVM.setProfiles(profilesToDTO);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserMockMvc.perform(post("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
                .andExpect(status().isBadRequest());

        // Validate the User in the database
        List<User> userList = genericUserRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void createUserWithExistingLogin() throws Exception {
        // Initialize the database
        genericUserRepository.saveAndFlush(user);
        int databaseSizeBeforeCreate = genericUserRepository.findAll().size();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setLogin(DEFAULT_LOGIN);// this login should already be used
        managedUserVM.setPassword(DEFAULT_PASSWORD);
        managedUserVM.setFirstName(DEFAULT_FIRSTNAME);
        managedUserVM.setLastName(DEFAULT_LASTNAME);
        managedUserVM.setEmail("anothermail@localhost");
        managedUserVM.setActivated(true);
        managedUserVM.setLangKey(DEFAULT_LANGKEY);
        managedUserVM.setProfiles(profilesToDTO);

        // Create the User
        restUserMockMvc.perform(post("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
                .andExpect(status().isBadRequest());

        // Validate the User in the database
        List<User> userList = genericUserRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void createUserWithExistingEmail() throws Exception {
        // Initialize the database
        genericUserRepository.saveAndFlush(user);
        int databaseSizeBeforeCreate = genericUserRepository.findAll().size();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setLogin("anotherlogin");
        managedUserVM.setPassword(DEFAULT_PASSWORD);
        managedUserVM.setFirstName(DEFAULT_FIRSTNAME);
        managedUserVM.setLastName(DEFAULT_LASTNAME);
        managedUserVM.setEmail(DEFAULT_EMAIL);// this email should already be used
        managedUserVM.setActivated(true);
        managedUserVM.setLangKey(DEFAULT_LANGKEY);
        managedUserVM.setProfiles(profilesToDTO);

        // Create the User
        restUserMockMvc.perform(post("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
                .andExpect(status().isBadRequest());

        // Validate the User in the database
        List<User> userList = genericUserRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.R_USER, AuthoritiesConstants.RW_USER})
    public void getAllUsers() throws Exception {
        // Initialize the database
        genericUserRepository.saveAndFlush(user);

        // Get all the users
        restUserMockMvc.perform(get("/api/users")
                .accept(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.content.[*].login").value(hasItem(DEFAULT_LOGIN)))
                .andExpect(jsonPath("$.content.[*].firstName").value(hasItem(DEFAULT_FIRSTNAME)))
                .andExpect(jsonPath("$.content.[*].lastName").value(hasItem(DEFAULT_LASTNAME)))
                .andExpect(jsonPath("$.content.[*].email").value(hasItem(DEFAULT_EMAIL)))
                .andExpect(jsonPath("$.content.[*].langKey").value(hasItem(DEFAULT_LANGKEY)));
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin")
    public void getUser() throws Exception {
        // Initialize the database
        genericUserRepository.saveAndFlush(user);

        // Get the user
        restUserMockMvc.perform(get("/api/users/{login}", user.getLogin()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.login").value(user.getLogin()))
                .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRSTNAME))
                .andExpect(jsonPath("$.lastName").value(DEFAULT_LASTNAME))
                .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
                .andExpect(jsonPath("$.langKey").value(DEFAULT_LANGKEY));

    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void getNonExistingUser() throws Exception {
        restUserMockMvc.perform(get("/api/users/unknown"))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void updateUser() throws Exception {
        // Initialize the database
        genericUserRepository.saveAndFlush(user);
        int databaseSizeBeforeUpdate = genericUserRepository.findAll().size();

        // Update the user
        AbstractUser updatedUser = genericUserRepository.findById(user.getId()).get();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setId(updatedUser.getId());
        managedUserVM.setLogin(updatedUser.getLogin());
        managedUserVM.setPassword(UPDATED_PASSWORD);
        managedUserVM.setFirstName(UPDATED_FIRSTNAME);
        managedUserVM.setLastName(UPDATED_LASTNAME);
        managedUserVM.setEmail(UPDATED_EMAIL);
        managedUserVM.setActivated(updatedUser.isActivated());
        managedUserVM.setLangKey(UPDATED_LANGKEY);
        managedUserVM.setCreatedBy(updatedUser.getCreatedBy());
        managedUserVM.setCreatedDate(updatedUser.getCreatedDate());
        managedUserVM.setLastModifiedBy(updatedUser.getLastModifiedBy());
        managedUserVM.setLastModifiedDate(updatedUser.getLastModifiedDate());
        managedUserVM.setProfiles(profilesToDTO);

        restUserMockMvc.perform(put("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
                .andExpect(status().isOk());

        // Validate the User in the database
        List<User> userList = genericUserRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeUpdate);
        AbstractUser testUser = userList.get(userList.size() - 1);
        assertThat(testUser.getFirstName()).isEqualTo(UPDATED_FIRSTNAME);
        assertThat(testUser.getLastName()).isEqualTo(UPDATED_LASTNAME);
        assertThat(testUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUser.getLangKey()).isEqualTo(UPDATED_LANGKEY);
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void updateUserExistingEmail() throws Exception {
        // Initialize the database with 2 users
        genericUserRepository.saveAndFlush(user);

        User anotherUser = new User();
        anotherUser.setLogin("jhipster");
        anotherUser.setPassword(RandomStringUtils.random(30));
        anotherUser.setActivated(true);
        anotherUser.setEmail("jhipster@localhost");
        anotherUser.setFirstName("java");
        anotherUser.setLastName("hipster");
        anotherUser.setLangKey("en");
        genericUserRepository.saveAndFlush(anotherUser);

        // Update the user
        AbstractUser updatedUser = genericUserRepository.findById(user.getId()).get();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setId(updatedUser.getId());
        managedUserVM.setLogin(updatedUser.getLogin());
        managedUserVM.setPassword(updatedUser.getPassword());
        managedUserVM.setFirstName(updatedUser.getFirstName());
        managedUserVM.setLastName(updatedUser.getLastName());
        managedUserVM.setEmail("jhipster@localhost");// this email must not be used by another user
        managedUserVM.setActivated(updatedUser.isActivated());
        managedUserVM.setLangKey(updatedUser.getLangKey());
        managedUserVM.setCreatedBy(updatedUser.getCreatedBy());
        managedUserVM.setCreatedDate(updatedUser.getCreatedDate());
        managedUserVM.setLastModifiedBy(updatedUser.getLastModifiedBy());
        managedUserVM.setLastModifiedDate(updatedUser.getLastModifiedDate());
        managedUserVM.setProfiles(profilesToDTO);

        restUserMockMvc.perform(put("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void updateUserExistingLogin() throws Exception {
        // Initialize the database
        genericUserRepository.saveAndFlush(user);

        User anotherUser = new User();
        anotherUser.setLogin("jhipster");
        anotherUser.setPassword(RandomStringUtils.random(30));
        anotherUser.setActivated(true);
        anotherUser.setEmail("jhipster@localhost");
        anotherUser.setFirstName("java");
        anotherUser.setLastName("hipster");
        anotherUser.setLangKey("en");
        genericUserRepository.saveAndFlush(anotherUser);

        // Update the user
        AbstractUser updatedUser = genericUserRepository.findById(user.getId()).get();

        ManagedUserVM managedUserVM = new ManagedUserVM();
        managedUserVM.setId(updatedUser.getId());
        managedUserVM.setLogin("jhipster");// this login should already be used by anotherUser
        managedUserVM.setPassword(updatedUser.getPassword());
        managedUserVM.setFirstName(updatedUser.getFirstName());
        managedUserVM.setLastName(updatedUser.getLastName());
        managedUserVM.setEmail(updatedUser.getEmail());
        managedUserVM.setActivated(updatedUser.isActivated());
        managedUserVM.setLangKey(updatedUser.getLangKey());
        managedUserVM.setCreatedBy(updatedUser.getCreatedBy());
        managedUserVM.setCreatedDate(updatedUser.getCreatedDate());
        managedUserVM.setLastModifiedBy(updatedUser.getLastModifiedBy());
        managedUserVM.setLastModifiedDate(updatedUser.getLastModifiedDate());
        managedUserVM.setProfiles(profilesToDTO);

        restUserMockMvc.perform(put("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(managedUserVM)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {AuthoritiesConstants.RW_USER})
    public void deleteUser() throws Exception {
        // Initialize the database
        int databaseSizeBeforeDelete = genericUserRepository.findAll().size();

        // Delete the user
        restUserMockMvc.perform(delete("/api/users/{login}/logic", user.getLogin())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        assertThat(cacheManager.getCache(USERS_BY_LOGIN_CACHE).get(user.getLogin())).isNull();

        // Validate the database is empty
        List<User> userList = genericUserRepository.findAll();
        assertThat(userList).hasSize(databaseSizeBeforeDelete);
    }

    @Test
    @Transactional
    public void testUserEquals() throws Exception {
        TestUtil.equalsVerifier(User.class);
        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(user1.getId());
        assertThat(user1).isEqualTo(user2);
        user2.setId(2L);
        assertThat(user1).isNotEqualTo(user2);
        user1.setId(null);
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    public void testUserDTOtoUser() {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(DEFAULT_ID);
        userDTO.setLogin(DEFAULT_LOGIN);
        userDTO.setFirstName(DEFAULT_FIRSTNAME);
        userDTO.setLastName(DEFAULT_LASTNAME);
        userDTO.setEmail(DEFAULT_EMAIL);
        userDTO.setActivated(true);
        userDTO.setLangKey(DEFAULT_LANGKEY);
        userDTO.setCreatedBy(DEFAULT_LOGIN);
        userDTO.setLastModifiedBy(DEFAULT_LOGIN);

        Set<Profile> profiles = new HashSet<>();
        Profile profile = new Profile();
        profile.setName("Administrator");

        profiles.add(profile);
        userDTO.setProfiles(profiles);

        User user = userMapper.userDTOToUser(userDTO);
        assertThat(user.getId()).isEqualTo(DEFAULT_ID);
        assertThat(user.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(user.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(user.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(user.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(user.isActivated()).isEqualTo(true);
        assertThat(user.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
        assertThat(user.getCreatedBy()).isNull();
        assertThat(user.getCreatedDate()).isNotNull();
        assertThat(user.getLastModifiedBy()).isNull();
        assertThat(user.getLastModifiedDate()).isNotNull();
        assertThat(user.getProfiles()).extracting("name").containsExactly("Administrator");
    }

    @Test
    public void testUserToUserDTO() {
        user.setId(DEFAULT_ID);
        user.setCreatedBy(DEFAULT_LOGIN);
        user.setCreatedDate(Instant.now());
        user.setLastModifiedBy(DEFAULT_LOGIN);
        user.setLastModifiedDate(Instant.now());

        Set<Authority> authorities = new HashSet<>();
        Authority authority = new Authority();
        authority.setName(AuthoritiesConstants.RW_USER);
        authorities.add(authority);

        Profile userProfile = new Profile();
        userProfile.setName("User");
        userProfile.setAuthorities(authorities);
        userProfile.setActivated(true);
        userProfile.setDescription("User profile in system");
        userProfile.addAuthority(authority);
        user.addProfile(userProfile);

        UserDTO userDTO = userMapper.userToUserDTO(user);

        assertThat(userDTO.getId()).isEqualTo(DEFAULT_ID);
        assertThat(userDTO.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(userDTO.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(userDTO.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(userDTO.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(userDTO.isActivated()).isEqualTo(true);
        assertThat(userDTO.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
        assertThat(userDTO.getCreatedBy()).isEqualTo(DEFAULT_LOGIN);
        assertThat(userDTO.getCreatedDate()).isEqualTo(user.getCreatedDate());
        assertThat(userDTO.getLastModifiedBy()).isEqualTo(DEFAULT_LOGIN);
        assertThat(userDTO.getLastModifiedDate()).isEqualTo(user.getLastModifiedDate());
        assertThat(userDTO.getProfiles().contains(userProfile)).isEqualTo(true);
        assertThat(userDTO.toString()).isNotNull();
    }


    @Test
    public void testDuplicatedLogin() throws Exception {
        addProfile(this.user);

        final UserDTO userDTO = new UserDTO(this.user);
        userDTO.setId(null);

        restUserMockMvc.perform(post("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDuplicatedEmail() throws Exception {
        addProfile(this.user);

        final UserDTO userDTO = new UserDTO(this.user);
        userDTO.setId(null);
        userDTO.setLogin(userDTO.getLogin() + "-t2");

        restUserMockMvc.perform(post("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUpdatePassword() throws Exception {
        addProfile(this.user);

        final ManagedUserVM userDTO = new ManagedUserVM();
        BeanUtils.copyProperties(this.user, userDTO);
        userDTO.setUpdatePassword(true);
        userDTO.setPassword("newPassword12");

        restUserMockMvc.perform(put("/api/users")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateImage() throws Exception {
        addProfile(this.user);

        final UserDTO userDTO = new UserDTO(this.user);
        userDTO.setImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg");

        restUserMockMvc.perform(put("/api/users/image")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
                .andExpect(status().isOk());
    }

    @Test
    public void testToggleUser() throws Exception {
        addProfile(this.user);

        final UserDTO userDTO = new UserDTO(this.user);

        restUserMockMvc.perform(delete("/api/users/" + user.getLogin() + "/logic")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
                .andExpect(status().isOk());

        Assert.assertEquals(false,
                genericUserRepository.findById(user.getId()).get().isActivated()
        );

        restUserMockMvc.perform(delete("/api/users/" + user.getLogin() + "/logic")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
                .andExpect(status().isOk());

        Assert.assertEquals(true,
                genericUserRepository.findById(user.getId()).get().isActivated()
        );
    }

    @Test
    public void testToggleNotExistentUser() throws Exception {
        addProfile(this.user);

        final UserDTO userDTO = new UserDTO(this.user);

        restUserMockMvc.perform(delete("/api/users/" + user.getLogin() + "-nottexist" + "/logic")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(userDTO)))
                .andExpect(status().isBadRequest());
    }

    private void addProfile(User user) {
        final List<Profile> profiles = profileRepository.findAll();
        user.addProfile(profiles.get(0));
    }

}
