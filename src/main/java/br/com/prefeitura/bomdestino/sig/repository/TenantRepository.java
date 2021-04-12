package br.com.prefeitura.bomdestino.sig.repository;

import br.com.prefeitura.bomdestino.sig.domain.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link Tenant} entity.
 */
@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    Tenant findByNameIgnoreCase(String name);

}
