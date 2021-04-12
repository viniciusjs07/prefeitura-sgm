package br.com.prefeitura.bomdestino.sig.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;

@Data
@Entity
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Table(name = "tenant")
public class Tenant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 80, min = 2)
    private String name;

    @NotBlank
    private String language;

    @Size(max = 200)
    private String description;

    @NotNull
    @Column(nullable = false)
    private boolean activated;

    @NotNull
    @Lob
    @Column(name="privacyPolicy", length=20000)
    private String privacyPolicy;

    @NotNull
    @Lob
    @Column(name="termsOfService", length=20000)
    private String termsOfService;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private Instant createdDate = Instant.now();

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private Instant lastModifiedDate = Instant.now();

}

