package br.com.prefeitura.bomdestino.sig.repository;

import br.com.prefeitura.bomdestino.sig.domain.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Spring Data JPA repository for the {@link Category} entity.
 */
@Repository
@Transactional
public interface CategoryRepository extends JpaRepository<Category, Long> {


    List<Category> findByName(@Param("name") String name);

    List<Category> findAllByActivated(boolean activated);

    @Query("select distinct category from Category category " +
            "inner join Service service " +
            "on category.id = service.category.id " +
            "where category.activated = true")
    Page<Category> findAllAssociate(Pageable pageable);
}
