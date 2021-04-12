package br.com.prefeitura.bomdestino.sig.service.dto;

import br.com.prefeitura.bomdestino.sig.domain.Category;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.beans.BeanUtils;
import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = { "id", "name" }, callSuper = false)
@ToString(of = { "id", "name" })
@JsonIgnoreProperties({"createdDate", "lastModifiedDate"})
public class CategoryDTO extends AbstractDTO {

    private Long id;

    private String name;

    private Integer idFamily;

    public CategoryDTO(Category category) {
        this.name = category.getName();
        this.id = category.getId();
        this.tenantId = category.getTenantId();
        this.idFamily = category.getIdFamily();
        this.activated = category.isActivated();
    }

}
