package br.com.prefeitura.bomdestino.sig.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "asset_file")
@EqualsAndHashCode(of = { "url" }, callSuper = false)
public class AssetFile extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String url;

    @NotNull
    private boolean activated = true;

    public AssetFile(String url) {
        this.url = url;
    }

}
