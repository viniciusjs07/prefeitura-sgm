package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.config.Constants;
import br.com.prefeitura.bomdestino.sig.domain.User;
import br.com.prefeitura.bomdestino.sig.security.AuthoritiesConstants;
import br.com.prefeitura.bomdestino.sig.service.EmailAlreadyUsedException;
import br.com.prefeitura.bomdestino.sig.service.UserService;
import br.com.prefeitura.bomdestino.sig.service.dto.AuthorityDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.PasswordUpdateDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.UserDTO;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.AlertException;
import br.com.prefeitura.bomdestino.sig.web.rest.errors.BadRequestAlertException;
import br.com.prefeitura.bomdestino.sig.web.rest.vm.ManagedUserVM;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.net.URISyntaxException;
import java.util.Optional;

/**
 * REST controller for managing the users.
 */
@RestController
@RequestMapping("/api")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    private UserService userService;

    public UserResource(UserService userService) {

        this.userService = userService;
    }

    /**
     * {@code POST  /users}  : Creates a new user.
     * <p>
     * Creates a new user if the login and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     *
     * @param userDTO the user to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new user, or with status
     * {@code 400 (Bad Request)} if the login or email is already in use.
     * @throws URISyntaxException       if the Location URI syntax is incorrect.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the login or email is already in use.
     */
    @PostMapping("/users")
    @Secured({AuthoritiesConstants.RW_USER})
    public ResponseEntity<User> createUser(@Valid @RequestBody ManagedUserVM userDTO) {
        log.debug("REST request to save User : {}", userDTO);
        User newUser = userService.createUser(userDTO);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);

    }

    /**
     * {@code PUT /users} : Updates an existing User.
     *
     * @param userDTO the user to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated user.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already in use.
     * @throws AlertException            {@code 400 (Bad Request)} if the login is already in use.
     */
    @PutMapping("/users")
    @Secured({AuthoritiesConstants.RW_USER})
    public ResponseEntity<UserDTO> updateUser(@Valid @RequestBody ManagedUserVM userDTO) {
        log.debug("REST request to update User : {}", userDTO);
        Optional<UserDTO> updatedUser = userService.updateUser(userDTO);
        return ResponseUtil.wrapOrNotFound(updatedUser);
    }
    
    /**
     * {@code GET /users} : get all users.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users")
    @Secured({AuthoritiesConstants.R_USER, AuthoritiesConstants.RW_USER})
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20)
            @SortDefault(sort = "createdDate",
                    direction = Sort.Direction.DESC) Pageable pageable
    ) {
        final Page<UserDTO> page = userService.getAllManagedUsers(search, pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * Gets a list of all roles.
     *
     * @return a string list of all roles.
     */
    @GetMapping("/users/authorities")
    @Secured({AuthoritiesConstants.R_PROFILE, AuthoritiesConstants.RW_PROFILE})
    public ResponseEntity<Page<AuthorityDTO>> getAuthorities(@PageableDefault(size = 20) @SortDefault(sort = "name") Pageable pageable,
                                                             @RequestParam(required = false) boolean isUnPaged) {
        Page<AuthorityDTO> page = userService.getAuthorities(pageable, isUnPaged);
        return ResponseEntity.ok(page);
    }

    /**
     * {@code GET /users/:login} : get the "login" user.
     *
     * @param login the login of the user to find.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the "login" user, or with status
     * {@code 404 (Not Found)}.
     */
    @GetMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String login) {
        log.debug("REST request to get User : {}", login);
        return ResponseUtil.wrapOrNotFound(userService.getUserByLogin(login).map(UserDTO::new));
    }

    /**
     * {@code DELETE /users/:login} : delete logical the "login" User.
     *
     * @param login the login of the user to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/users/{login:" + Constants.LOGIN_REGEX + "}/logic")
    @Secured({AuthoritiesConstants.RW_USER})
    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
        log.debug("REST request to delete User: {}", login);
        userService.logicalExclusion(login);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * {@code DELETE /users/{id}} : delete logical the "id" User.
     *
     * @param id the id of the user to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUserBlinding(@PathVariable Long id) {
        userService.blindingUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/users" + Constants.CHANGE_PASSWORD_URL)
    public ResponseEntity<Void> changeUserPassword(@Valid @NotBlank @RequestBody PasswordUpdateDTO dto) {
        userService.changePassword(dto);
        return ResponseEntity.ok().build();
    }
}
