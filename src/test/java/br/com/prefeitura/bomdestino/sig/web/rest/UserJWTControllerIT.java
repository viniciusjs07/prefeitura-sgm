package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.SystemSGMApp;
import br.com.prefeitura.bomdestino.sig.domain.User;
import br.com.prefeitura.bomdestino.sig.repository.GenericUserRepository;
import br.com.prefeitura.bomdestino.sig.security.jwt.TokenProvider;
import br.com.prefeitura.bomdestino.sig.service.UserService;
import br.com.prefeitura.bomdestino.sig.service.dto.AuthorityDTO;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.ExceptionTranslator;
import br.com.prefeitura.bomdestino.sig.web.rest.vm.LoginVM;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link UserJWTController} REST controller.
 */
@SpringBootTest(classes = SystemSGMApp.class)
public class UserJWTControllerIT {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private AuthenticationManagerBuilder authenticationManager;

    @Autowired
    private GenericUserRepository genericUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc mockMvc;

    @Autowired
    private UserService userService;


    @BeforeEach
    public void setup() {
        UserJWTController userJWTController = new UserJWTController(tokenProvider, authenticationManager, userService);
        this.mockMvc = MockMvcBuilders.standaloneSetup(userJWTController)
                .setControllerAdvice(exceptionTranslator)
                .build();
    }

    @Test
    @Transactional
    public void testAuthorize() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-controller");
        user.setEmail("user-jwt-controller@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));
        user.setFirstName("user-first-name");
        user.setLastName("user-last-name");

        genericUserRepository.saveAndFlush(user);

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-controller");
        login.setPassword("test");
        mockMvc.perform(post("/api/authenticate")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id_token").isString())
                .andExpect(jsonPath("$.id_token").isNotEmpty())
                .andExpect(header().string("Authorization", not(nullValue())))
                .andExpect(header().string("Authorization", not(isEmptyString())));
    }

    @Test
    @Transactional
    public void testAuthorizeWithRememberMe() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-login");
        user.setFirstName("user-first-name");
        user.setLastName("user-last-name");
        user.setEmail("user-jwt-controller-remember-me@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        genericUserRepository.saveAndFlush(user);

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-login");
        login.setPassword("test");
        login.setRememberMe(true);
        mockMvc.perform(post("/api/authenticate")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id_token").isString())
                .andExpect(jsonPath("$.id_token").isNotEmpty())
                .andExpect(header().string("Authorization", not(nullValue())))
                .andExpect(header().string("Authorization", not(isEmptyString())));
    }

    @Test
    public void testAuthorizeFails() throws Exception {
        LoginVM login = new LoginVM();
        login.setUsername("wrong-user");
        login.setPassword("wrong password");
        mockMvc.perform(post("/api/authenticate")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.id_token").doesNotExist())
                .andExpect(header().doesNotExist("Authorization"));
    }

    @Test
    public void testAuthorityDTOEquals() throws Exception {
        TestUtil.equalsVerifier(AuthorityDTO.class);
        AuthorityDTO Authority1 = new AuthorityDTO();
        Authority1.setName("name1");
        AuthorityDTO Authority2 = new AuthorityDTO();
        Authority2.setName(Authority1.getName());
        assertThat(Authority1).isEqualTo(Authority2);
        Authority2.setName("name2");
        assertThat(Authority1).isNotEqualTo(Authority2);
        Authority1.setName(null);
        assertThat(Authority1).isNotEqualTo(Authority2);
    }
}
