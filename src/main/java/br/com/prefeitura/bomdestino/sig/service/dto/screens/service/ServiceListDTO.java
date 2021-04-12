package br.com.prefeitura.bomdestino.sig.service.dto.screens.service;

import br.com.prefeitura.bomdestino.sig.domain.AssetFile;
import br.com.prefeitura.bomdestino.sig.service.dto.AbstractDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.CategoryDTO;
import br.com.prefeitura.bomdestino.sig.service.dto.ServiceDTO;
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
@ToString(of = {"id", "name", "thumbnail", "modelRef", "category"})
@JsonIgnoreProperties({"createdDate", "lastModifiedDate"})
public class ServiceListDTO extends AbstractDTO {

    private Long id;

    @NotNull
    @Size(min = 3, max = 50)
    private String name;

    @Size(max = 2000)
    private String description;

    @NotNull
    @JsonIgnoreProperties({"subCategories"})
    private CategoryDTO category;

    @NotNull
    @Size(min = 3, max = 30)
    private String modelRef;

    @NotNull
    private AssetFile thumbnail;


    public ServiceListDTO(ServiceDTO product) {
        this.id = product.getId();
        this.activated = product.isActivated();
        this.description = product.getDescription();
        this.category = product.getCategory();
        this.name = product.getName();
    }
}
