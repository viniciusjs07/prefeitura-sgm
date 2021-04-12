package br.com.prefeitura.bomdestino.sig.service.dto;

import br.com.prefeitura.bomdestino.sig.domain.Profile;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProfileDTO extends AbstractDTO {

    private Long id;

    @NotNull
    @Size(min = 3, max = 20)
    private String name;

    @Size(max = 50)
    private String description;

    @NotNull
    private Set<AuthorityDTO> authorities;

    /**
     * Empty constructor
     */
    public ProfileDTO() {
        this.authorities = new HashSet<>();
        this.name = "";
        this.description = "";
    }

    public ProfileDTO(Profile profile) {
        this.id = profile.getId();
        this.name = profile.getName();
        this.description = profile.getDescription();
        this.authorities = profile.getAuthorities().stream()
                .map(AuthorityDTO::new)
                .collect(Collectors.toSet());
        this.activated = profile.isActivated();
        this.createdDate = profile.getCreatedDate();
        this.lastModifiedDate = profile.getLastModifiedDate();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfileDTO profileDTO = (ProfileDTO) o;
        return !(profileDTO.getId() == null || getId() == null) && Objects.equals(getId(), profileDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

}

