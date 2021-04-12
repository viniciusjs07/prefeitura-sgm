package br.com.prefeitura.bomdestino.sig.service.dto;

import br.com.prefeitura.bomdestino.sig.config.Constants;
import br.com.prefeitura.bomdestino.sig.domain.Authority;
import br.com.prefeitura.bomdestino.sig.domain.Profile;
import br.com.prefeitura.bomdestino.sig.domain.User;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import static br.com.prefeitura.bomdestino.sig.util.RegexConstant.PASSWORD_REGEX;

/**
 * A DTO representing a user, with his profiles.
 */
@Getter
@Setter
@NoArgsConstructor
public class UserDTO extends AbstractDTO {

    public static final int PASSWORD_MIN_LENGTH = 7;

    private Long id;

    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 3, max = 50)
    private String login;

    @Size(min = 3, max = 50)
    @NotNull
    private String firstName;

    @Size(max = 50)
    @NotNull
    private String lastName;

    @Email
    @Pattern(regexp = ".{3,64}@.{1,255}")
    private String email;

    @Size(min = 2, max = 10)
    private String langKey;

    private String createdBy;

    private String lastModifiedBy;

    @NotNull
    private Set<Profile> profiles = new HashSet<>();

    @NotNull
    private Set<AuthorityDTO> authorities = new HashSet<>();

    private String image;

    @Pattern(regexp = PASSWORD_REGEX, message = "{error.user.password.pattern}")
    @ApiModelProperty(value = "Senha do usuário.", position = 7)
    private String password;

    private Boolean onFirstPassword;

    private Boolean blinding;

    private Boolean superUser;

    private Instant lastPasswordUpdate;

    public UserDTO(User user) {
        this.id = user.getId();
        this.login = user.getLogin();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.activated = user.isActivated();
        this.langKey = user.getLangKey();
        this.createdBy = user.getCreatedBy();
        this.createdDate = user.getCreatedDate();
        this.lastModifiedBy = user.getLastModifiedBy();
        this.lastModifiedDate = user.getLastModifiedDate();
        this.setProfiles(new HashSet<>(user.getProfiles()));
        if (user.getImage() != null) {
            this.image = user.getImage().getUrl();
        }
        for (Profile profile : user.getProfiles()) {
            for (Authority authority : profile.getAuthorities()) {
                this.authorities.add(new AuthorityDTO(authority.getName()));
            }
        }
        this.password = user.getPassword();
        this.onFirstPassword = user.getOnFirstPassword();
        this.blinding = user.getBlinding();
        this.superUser = user.getSuperUser();
        this.lastPasswordUpdate = user.getLastPasswordUpdate();
    }

    public void setProfiles(Set<Profile> profiles) {
        this.profiles = profiles;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "login='" + login + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", activated=" + activated +
                ", langKey='" + langKey + '\'' +
                ", createdBy=" + createdBy +
                ", createdDate=" + createdDate +
                ", lastModifiedBy='" + lastModifiedBy + '\'' +
                ", lastModifiedDate=" + lastModifiedDate +
                ", profiles=" + profiles +
                ", onFirstPassword=" + onFirstPassword +
                ", lastPasswordUpdate=" + lastPasswordUpdate +
                "}";
    }
}
