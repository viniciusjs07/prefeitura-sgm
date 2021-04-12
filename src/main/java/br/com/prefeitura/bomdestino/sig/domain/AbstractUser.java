package br.com.prefeitura.bomdestino.sig.domain;

import br.com.prefeitura.bomdestino.sig.config.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.BatchSize;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "abstract_user",
        uniqueConstraints= {
                @UniqueConstraint(columnNames={"login", "tenant_id"}),
                @UniqueConstraint(columnNames={"email", "tenant_id"}),
        })
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type")
public abstract class AbstractUser extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;

    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 3, max = 20)
    @Column(length = 20, nullable = false)
    private String login;

    @JsonIgnore
    @NotNull
    @Size(min = 8, max = 60)
    @Column(name = "password_hash", length = 60, nullable = false)
    private String password;

    @Size(min = 3, max = 20)
    @NotNull
    @Column(name = "first_name", length = 20)
    private String firstName;

    @Size(min = 1, max = 20)
    @NotNull
    @Column(name = "last_name", length = 20)
    private String lastName;

    @Email
    @Size(min = 3, max = 320)
    @Column(length = 320)
    private String email;

    @NotNull
    @Column(nullable = false)
    private boolean activated = false;

    @Size(min = 2, max = 10)
    @Column(name = "lang_key", length = 10)
    private String langKey;

    @Size(max = 20)
    @Column(name = "activation_key", length = 20)
    @JsonIgnore
    private String activationKey;

    @Size(max = 20)
    @Column(name = "reset_key", length = 20)
    @JsonIgnore
    private String resetKey;

    @Column(name = "reset_date")
    private Instant resetDate = null;

    @JsonIgnore
    @NotNull
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_profile",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "profile_id", referencedColumnName = "id")})
    @BatchSize(size = 20)
    private Set<@NotNull Profile> profiles = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private AssetFile image;

    // Lowercase the login before saving it in database
    public void setLogin(String login) {
        this.login = StringUtils.lowerCase(login, Locale.ENGLISH);
    }

    public void addProfile(Profile profile) {
        this.profiles.add(profile);
    }

    private Instant lastPasswordUpdate;

    @ElementCollection
    private List<String> lastPasswordHashes = new ArrayList<>();

    private Boolean onFirstPassword = true;

    private Instant lastPasswordError;

    private Integer countErrorsPassword = 0;

    @NotNull
    @Column(nullable = false)
    private Boolean blinding = false;

    @NotNull
    @Column(nullable = false)
    private Boolean superUser = false;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AbstractUser)) {
            return false;
        }
        return id != null && id.equals(((AbstractUser) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "AbstractUser{" +
                "login='" + login + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", activated='" + activated + '\'' +
                ", langKey='" + langKey + '\'' +
                ", activationKey='" + activationKey + '\'' +
                ", onFirstPassword='" + onFirstPassword + '\'' +
                ", blinding='" + blinding + '\'' +
                ", superUser='" + superUser + '\'' +
                "}";
    }

    public boolean hasAuthority(final String role) {
        return this.getProfiles()
                .stream()
                .anyMatch(profile ->
                        profile.getAuthorities()
                                .stream()
                                .map(Authority::getName)
                                .anyMatch(name -> name.equals(role))
                );
    }

}
