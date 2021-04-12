package br.com.prefeitura.bomdestino.sig.repository;

import br.com.prefeitura.bomdestino.sig.domain.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

/**
 * ProfileModel repository
 */
@Repository
@Transactional
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Profile findByNameIgnoreCase(String name);

    Profile findByName(String name);

    Profile findByNameAndTenantId(String name, Long tenantId);


    List<Profile> findAllByAuthoritiesContaining(List<String> authorities);

    /**
     * Realiza a filtragem de perfis a partir de seu nome.
     *
     * @param page Configuração da paginação
     * @param name Nome sendo buscado
     * @return Resultados
     */
    Page<Profile> findAllByNameContainingIgnoreCase(Pageable page, String name);
}
