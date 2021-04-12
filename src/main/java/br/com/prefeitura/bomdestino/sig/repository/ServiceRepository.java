package br.com.prefeitura.bomdestino.sig.repository;

import br.com.prefeitura.bomdestino.sig.domain.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link Service} entity.
 */
@Repository
@Transactional
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByIdIn(List<Long> ids);


    /**
     * Filtra serviços por:
     * - Nome
     * - Categoria
     * Desconsiderando Word-Case e considerando partes parciais da palavra
     *
     * @param pageable Configuação da paginação
     * @param name     Nome para filtrar serviços
     * @return Resposta da Paginação
     */
    @Query("Select distinct service " +
            "from Service service " +
            "left join service.category category " +
            "where  service.name like %:name%" +
            "       or category.name like %:category% ")
    Page<Service> searchService(Pageable pageable,
                                @Param("name") String name,
                                @Param("category") String category);


    /**
     * Retorna todos os serviços activos ordernados por nome. É usado na listagem de serviços do cidadão
     *
     * @param pageable
     * @return
     */
    @Query("Select distinct service" +
            " from Service service " +
            "where service.activated = true " +
            "order by service.name asc")
    Page<Service> findAllByActivated(Pageable pageable);


    /**
     * Retorna todos os serviços ativos ordernados por nome. Usado na entidade cidadão
     *
     * @param pageable
     * @return
     */
    @Query("Select distinct service " +
            "from Service service " +
            "where service.activated = true and LOWER(service.name) like LOWER(CONCAT('%', :search, '%')) ")
    Page<Service> findProductBySearch(Pageable pageable,
                                      @Param("search") String search);

    Optional<Service> findByNameIgnoreCase(String name);

}
