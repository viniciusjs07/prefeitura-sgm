package br.com.prefeitura.bomdestino.sig.service.dto;

import br.com.prefeitura.bomdestino.sig.domain.Authority;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
public class AuthorityDTO {

    @NotNull
    @Size(max = 50)
    private String name;

    @Size(max = 100)
    private String description;

    public AuthorityDTO(Authority authority) {
        this.name = authority.getName();
        this.description = authority.getDescription();
    }

    public AuthorityDTO(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthorityDTO authorityDTO = (AuthorityDTO) o;
        return !(authorityDTO.getName() == null || getName() == null) && Objects.equals(getName(), authorityDTO.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName());
    }
}
