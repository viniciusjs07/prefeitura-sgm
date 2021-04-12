package br.com.prefeitura.bomdestino.sig.domain;

import br.com.prefeitura.bomdestino.sig.service.dto.CategoryDTO;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "category")
@EqualsAndHashCode(of = {"id"}, callSuper = false)
@ToString(of = {"id", "activated", "name"})
public class Category extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private boolean activated;

    @Column()
    private Integer idFamily;

    public Category(CategoryDTO dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.activated = dto.isActivated();
        this.setTenantId(dto.getTenantId());
        this.idFamily = dto.getIdFamily();
    }

}
