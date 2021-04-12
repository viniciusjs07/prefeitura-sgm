package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.security.AuthoritiesConstants;
import br.com.prefeitura.bomdestino.sig.service.ProfileService;
import br.com.prefeitura.bomdestino.sig.service.dto.ProfileDTO;
import br.com.prefeitura.bomdestino.sig.security.AuthoritiesConstants;
import br.com.prefeitura.bomdestino.sig.service.dto.ProfileDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * REST controller for managing the user profiles.
 */
@RestController
@RequestMapping("/api")
public class ProfileResource {

    private final Logger log = LoggerFactory.getLogger(ProfileResource.class);

    private ProfileService profileService;

    public ProfileResource(ProfileService profileService) {
        this.profileService = profileService;

    }

    /**
     * GET /profiles : get all profiles.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and with body all profiles
     */
    @GetMapping("/profile")
    @Secured({AuthoritiesConstants.R_PROFILE, AuthoritiesConstants.RW_PROFILE,
            AuthoritiesConstants.RW_USER, AuthoritiesConstants.R_USER})
    public ResponseEntity<Page<ProfileDTO>> getAllProfiles(@SortDefault(sort = "name") Pageable pageable,
                                                           @RequestParam(required = false) String search) {
        log.debug("REST request to get all profiles");
        Page<ProfileDTO> page = profileService.getAllProfiles(pageable, search);
        return ResponseEntity.ok(page);
    }

    /**
     * GET /profiles/:id : get profile by id
     *
     * @param id the profile id
     * @return the ResponseEntity with status 200 (OK) and with body the profile, or with status 404 (Not Found)
     */
    @GetMapping("/profile/{id}")
    @Secured({AuthoritiesConstants.R_PROFILE, AuthoritiesConstants.RW_PROFILE})
    public ResponseEntity<ProfileDTO> getProfileById(@PathVariable Long id) {
        log.debug("REST request to get a profile by id");
        return ResponseUtil.wrapOrNotFound(profileService.getProfileById(id));
    }

    /**
     * POST /profiles : create a new profile
     *
     * @param profileDTO the profile to create
     * @return the ResponseEntity with status 200 (OK) and with body the created profile
     */
    @PostMapping("/profile")
    @Secured(AuthoritiesConstants.RW_PROFILE)
    public ResponseEntity<ProfileDTO> createProfile(@Valid @RequestBody ProfileDTO profileDTO) {
        log.debug("REST request to create a profile");
        ProfileDTO newProfile = profileService.createProfile(profileDTO);
        return new ResponseEntity<>(newProfile, HttpStatus.OK);
    }

    /**
     * PUT /profiles : updates an existing profile
     *
     * @param profileDTO the profile to update
     * @return the ResponseEntity with status 200 (OK) and with body the profile, or with status 404 (Not Found)
     */
    @PutMapping("/profile")
    @Secured(AuthoritiesConstants.RW_PROFILE)
    public ResponseEntity<ProfileDTO> updateProfile(@Valid @RequestBody ProfileDTO profileDTO) {
        log.debug("REST request to update a profile");
        ProfileDTO updatedProfile = profileService.updateProfile(profileDTO);
        return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
    }

}
