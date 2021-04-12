package br.com.prefeitura.bomdestino.sig.domain.language;

import br.com.prefeitura.bomdestino.sig.domain.AbstractAuditingEntity;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "language",
        uniqueConstraints= {
                @UniqueConstraint(columnNames={"languageName", "tenant_id"})
        })
@ToString(of = { "id", "languageName" })
@EqualsAndHashCode(of = { "languageName" }, callSuper = false)
public class Language extends AbstractAuditingEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private LanguageName languageName;

    @Column(nullable = false)
    private boolean activated = true;

}
