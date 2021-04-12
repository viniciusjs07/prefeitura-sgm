package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.SystemSGMApp;
import br.com.prefeitura.bomdestino.sig.domain.Authority;
import br.com.prefeitura.bomdestino.sig.domain.Profile;
import br.com.prefeitura.bomdestino.sig.repository.AuthorityRepository;
import br.com.prefeitura.bomdestino.sig.repository.ProfileRepository;
import br.com.prefeitura.bomdestino.sig.service.ProfileService;
import br.com.prefeitura.bomdestino.sig.service.dto.ProfileDTO;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.ExceptionTranslator;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static br.com.prefeitura.bomdestino.sig.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProfileResource} REST controller.
 */
@SpringBootTest(classes = SystemSGMApp.class)
public class ProfileResourceIT {

    private static final String PROFILE_NAME_DEFAULT = "Default name";
    private static final String PROFILE_DESCRIPTION_DEFAULT = "Default description";
    private static final String PROFILE_NAME_UPDATED = "Updated name";
    private static final String PROFILE_DESCRIPTION_UPDATED = "Updated description";
    private static final String AUTHORITY_NAME = "Authority name";
    private static final String AUTHORITY_DESCRIPTION = "Default Authority description";

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    private MockMvc restProfileMockMvc;

    private Profile profile;

    private Authority authority;

    @BeforeEach
    public void init() {
        MockitoAnnotations.initMocks(this);
        final ProfileResource profileResource = new ProfileResource(this.profileService);
        this.restProfileMockMvc = MockMvcBuilders.standaloneSetup(profileResource)
                .setCustomArgumentResolvers(pageableArgumentResolver)
                .setControllerAdvice(exceptionTranslator)
                .setConversionService(createFormattingConversionService())
                .setMessageConverters(jacksonMessageConverter).build();
    }

    public Profile createEntity() {
        this.authority = new Authority(AUTHORITY_NAME, AUTHORITY_DESCRIPTION);
        Set<Authority> authorities = new HashSet<>();
        authorities.add(this.authorityRepository.save(authority));
        return new Profile(PROFILE_NAME_DEFAULT, PROFILE_DESCRIPTION_DEFAULT, authorities, true);
    }

    @BeforeEach
    public void initTest() {
        this.profile = createEntity();
    }


    @AfterEach
    public void delete() {
        Profile profile = this.profileRepository.findByName(this.profile.getName());
        if (profile != null) {
            this.profileRepository.delete(profile);
        }

        Optional<Authority> authority = this.authorityRepository.findByName(AUTHORITY_NAME);
        assert authority.isPresent();
        this.authorityRepository.delete(authority.get());
    }

    @Test
    public void createProfile() throws Exception {
        int databaseSizeBeforeCreate = this.profileRepository.findAll().size();

        ProfileDTO profileDTO = new ProfileDTO(this.profile);
        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isOk());

        List<Profile> profileList = this.profileRepository.findAll();
        assertThat(profileList).hasSize(databaseSizeBeforeCreate + 1);
        Profile testProfile = profileList.get(profileList.size() - 1);
        assertThat(testProfile.getName()).isEqualTo(PROFILE_NAME_DEFAULT);
        assertThat(testProfile.getDescription()).isEqualTo(PROFILE_DESCRIPTION_DEFAULT);

    }

    @Test
    public void createExistentProfile() throws Exception {
        int databaseSizeBeforeCreate = this.profileRepository.findAll().size();

        ProfileDTO profileDTO = new ProfileDTO(this.profile);
        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isOk());


        List<Profile> profileList = this.profileRepository.findAll();
        assertThat(profileList).hasSize(databaseSizeBeforeCreate + 1);
        Profile testProfile = profileList.get(profileList.size() - 1);
        assertThat(testProfile.getName()).isEqualTo(PROFILE_NAME_DEFAULT);
        assertThat(testProfile.getDescription()).isEqualTo(PROFILE_DESCRIPTION_DEFAULT);

        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void createProfileWithEmptyNameInvalid() throws Exception {
        ProfileDTO profileDTO = new ProfileDTO(this.profile);
        profileDTO.setName("");
        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void createProfileWithExistentName() throws Exception {

        ProfileDTO profileDTO = new ProfileDTO(this.profile);
        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isOk());

        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void getAllProfiles() throws Exception {
        this.profileRepository.save(this.createEntity());

        this.restProfileMockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.content.[*].name").value(hasItem(PROFILE_NAME_DEFAULT)))
                .andExpect(jsonPath("$.content.[*].description").value(hasItem(PROFILE_DESCRIPTION_DEFAULT)));
    }

    @Test
    public void getProfileById() throws Exception {
        this.profile = this.profileRepository.save(this.createEntity());

        this.restProfileMockMvc.perform(get("/api/profile/{id}", this.profile.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.name").value(PROFILE_NAME_DEFAULT))
                .andExpect(jsonPath("$.description").value(PROFILE_DESCRIPTION_DEFAULT));
    }

    @Test
    public void getInvalidProfileById() throws Exception {
        this.restProfileMockMvc.perform(get("/api/profile/{id}", 500L))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateProfile() throws Exception {
        Profile profileToUpdate = this.profileRepository.save(this.profile);
        int databaseSizeBeforeUpdate = this.profileRepository.findAll().size();

        profileToUpdate.setName(PROFILE_NAME_UPDATED);
        profileToUpdate.setDescription(PROFILE_DESCRIPTION_UPDATED);
        ProfileDTO dto = new ProfileDTO(profileToUpdate);

        this.restProfileMockMvc.perform(put("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(dto)))
                .andExpect(status().isOk());

        List<Profile> profileList = this.profileRepository.findAll();
        assertThat(profileList).hasSize(databaseSizeBeforeUpdate);
        Optional<Profile> prod = this.profileRepository.findById(this.profile.getId());
        assert prod.isPresent();

        assertThat(prod.get().getName()).isEqualTo(PROFILE_NAME_UPDATED);
        assertThat(prod.get().getDescription()).isEqualTo(PROFILE_DESCRIPTION_UPDATED);
    }

    @Test
    public void updateNonExistingProfile() throws Exception {
        ProfileDTO profileDTO = new ProfileDTO(this.createEntity());
        profileDTO.setId(500L);

        this.restProfileMockMvc.perform(put("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateProfileWithExistentName() throws Exception {
        int databaseSizeBeforeCreate = this.profileRepository.findAll().size();
        this.authority = new Authority("ROLE_ADMIN", "Permission of admin");
        Set<Authority> authorities = new HashSet<>();
        authorities.add(this.authorityRepository.save(this.authority));
        this.profile.setAuthorities(authorities);
        ProfileDTO profileDTO = new ProfileDTO(this.profile);
        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isOk());

        List<Profile> profileList = this.profileRepository.findAll();
        assertThat(profileList).hasSize(databaseSizeBeforeCreate + 1);
        Profile testProfile = profileList.get(profileList.size() - 1);
        assertThat(testProfile.getName()).isEqualTo(PROFILE_NAME_DEFAULT);
        assertThat(testProfile.getDescription()).isEqualTo(PROFILE_DESCRIPTION_DEFAULT);

        profileDTO.setName(PROFILE_NAME_UPDATED);
        this.restProfileMockMvc.perform(post("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isOk());

        profileDTO.setId(this.profileRepository.findByName(PROFILE_NAME_DEFAULT).getId());
        this.restProfileMockMvc.perform(put("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(profileDTO)))
                .andExpect(status().isBadRequest());


        Profile profile = this.profileRepository.findByName(PROFILE_NAME_UPDATED);
        assert profile != null;
        this.profileRepository.delete(profile);

        Profile profile1 = this.profileRepository.findByName(PROFILE_NAME_DEFAULT);

        assert profile1 != null;
        this.profileRepository.delete(profile1);

        Optional<Authority> authority = this.authorityRepository.findByName("ROLE_ADMIN");
        assert authority.isPresent();
        this.authorityRepository.delete(authority.get());
    }

    @Test
    public void updateProfileWithSameName() throws Exception {
        Profile profileToUpdate = this.profileRepository.save(profile);
        int databaseSizeBeforeUpdate = this.profileRepository.findAll().size();

        profileToUpdate.setName(PROFILE_NAME_UPDATED);
        profileToUpdate.setDescription(PROFILE_DESCRIPTION_UPDATED);
        ProfileDTO dto = new ProfileDTO(profileToUpdate);

        this.restProfileMockMvc.perform(put("/api/profile")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(dto)))
                .andExpect(status().isOk());

        List<Profile> profileList = this.profileRepository.findAll();
        assertThat(profileList).hasSize(databaseSizeBeforeUpdate);
        Optional<Profile> prod = this.profileRepository.findById(this.profile.getId());
        assert prod.isPresent();

        assertThat(prod.get().getName()).isEqualTo(PROFILE_NAME_UPDATED);
        assertThat(prod.get().getDescription()).isEqualTo(PROFILE_DESCRIPTION_UPDATED);
    }

    @Test
    public void testProfileEquals() {
        Profile Profile1 = new Profile();
        Profile1.setId(1L);
        Profile Profile2 = new Profile();
        Profile2.setId(Profile1.getId());
        assertThat(Profile1).isEqualTo(Profile2);
        Profile2.setId(2L);
        assertThat(Profile1).isNotEqualTo(Profile2);
        Profile1.setId(null);
        assertThat(Profile1).isNotEqualTo(Profile2);
    }

    @Test
    public void testProfileDTOEquals() throws Exception {
        TestUtil.equalsVerifier(ProfileDTO.class);
        ProfileDTO Profile1 = new ProfileDTO();
        Profile1.setId(1L);
        ProfileDTO Profile2 = new ProfileDTO();
        Profile2.setId(Profile1.getId());
        assertThat(Profile1).isEqualTo(Profile2);
        Profile2.setId(2L);
        assertThat(Profile1).isNotEqualTo(Profile2);
        Profile1.setId(null);
        assertThat(Profile1).isNotEqualTo(Profile2);
    }
}


