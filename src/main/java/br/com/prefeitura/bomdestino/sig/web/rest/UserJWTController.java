package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.domain.User;
import br.com.prefeitura.bomdestino.sig.exception.PasswordRulesException;
import br.com.prefeitura.bomdestino.sig.security.jwt.JWTFilter;
import br.com.prefeitura.bomdestino.sig.security.jwt.TokenProvider;
import br.com.prefeitura.bomdestino.sig.service.UserService;
import br.com.prefeitura.bomdestino.sig.web.rest.vm.LoginVM;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    private  final UserService userService;

    public UserJWTController(TokenProvider tokenProvider, AuthenticationManagerBuilder authenticationManagerBuilder,
                             UserService userService) {
        this.tokenProvider = tokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.userService = userService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {

        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginVM.getUsername().toLowerCase(), loginVM.getPassword());

        Authentication authentication = null;
        try {
            authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        } catch (AuthenticationException authenticationException) {
            User user = this.userService.getUserByLogin(loginVM.getUsername()).get();
            if (!user.getSuperUser()) {
                this.userService.checkUserBlockLogin(loginVM.getUsername());
                user = this.userService.getUserByLogin(loginVM.getUsername()).get();
                if (!user.isActivated()) {
                    throw new PasswordRulesException("userManagement.error.blocked");
                }
            }
            throw authenticationException;
        }
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = this.userService.getUserByLogin(authentication.getName()).get();
        String jwt = tokenProvider.createToken(authentication, loginVM.isRememberMe(), user);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
