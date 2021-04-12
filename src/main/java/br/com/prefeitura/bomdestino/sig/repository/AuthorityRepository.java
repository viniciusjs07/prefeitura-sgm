package br.com.prefeitura.bomdestino.sig.repository;

import br.com.prefeitura.bomdestino.sig.domain.Authority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
@Repository
@Transactional
public interface AuthorityRepository extends JpaRepository<Authority, String> {

    Optional<Authority> findByName(String name);

    @Query("Select distinct authority " +
            "from Authority authority " +
            "where LOWER(authority.name) like LOWER(CONCAT('%', :search, '%')) ")
    Page<Authority> findAuthoritiesByName(Pageable pageable,
                                          @Param("search") String search);

}
