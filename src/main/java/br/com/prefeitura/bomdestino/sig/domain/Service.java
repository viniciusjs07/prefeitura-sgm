package br.com.prefeitura.bomdestino.sig.domain;

import br.com.prefeitura.bomdestino.sig.service.dto.ServiceDTO;
import lombok.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "service",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"name", "tenant_id"})
        })
@EqualsAndHashCode(of = {"id"}, callSuper = false)
@ToString(of = {"id", "category", "name", "description", "activated"})
public class Service extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 200)
    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull
    @LazyCollection(LazyCollectionOption.FALSE)
    private Category category;

    @NotNull
    @Column(nullable = false)
    private boolean activated = false;



    public Service(ServiceDTO dto, Category category) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.description = dto.getDescription();
        this.category = category;
        this.activated = dto.isActivated();
    }

    public Service(ServiceDTO serviceDTO) {
        this.id = serviceDTO.getId();
        this.activated = serviceDTO.isActivated();
        this.category = new Category(serviceDTO.getCategory());
        this.name = serviceDTO.getName();
        this.description = serviceDTO.getDescription();
    }
}
