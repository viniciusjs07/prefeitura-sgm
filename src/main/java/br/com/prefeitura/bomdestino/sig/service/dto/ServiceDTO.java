package br.com.prefeitura.bomdestino.sig.service.dto;

import br.com.prefeitura.bomdestino.sig.domain.Service;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@ToString(of = {"id", "category", "name", "description"})
@JsonIgnoreProperties({"createdDate", "lastModifiedDate"})
public class ServiceDTO extends AbstractDTO {

    private Long id;

    @NotNull
    @JsonIgnoreProperties({"subCategories"})
    private CategoryDTO category;

    @NotNull
    @Size(min = 3, max = 200)
    private String name;

    @Size(max = 2000)
    private String description;

    public ServiceDTO(Service service) {
        this.id = service.getId();
        this.name = service.getName();
        this.description = service.getDescription();
        this.category = new CategoryDTO(service.getCategory());
        this.activated = service.isActivated();
        this.activated = service.isActivated();
    }

}
