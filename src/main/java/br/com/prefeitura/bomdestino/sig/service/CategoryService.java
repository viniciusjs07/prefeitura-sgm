package br.com.prefeitura.bomdestino.sig.service;

import br.com.prefeitura.bomdestino.sig.domain.Category;
import br.com.prefeitura.bomdestino.sig.exception.ErrorConstants;
import br.com.prefeitura.bomdestino.sig.exception.NotFoundException;
import br.com.prefeitura.bomdestino.sig.repository.CategoryRepository;
import br.com.prefeitura.bomdestino.sig.service.dto.CategoryDTO;
import br.com.prefeitura.bomdestino.sig.validator.CategoryValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for managing categories.
 */
@Service
@Transactional
public class CategoryService extends AbstractService {

    private CategoryValidator categoryValidator;

    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           CategoryValidator categoryValidator) {
        this.categoryRepository = categoryRepository;
        this.categoryValidator = categoryValidator;
    }

    /**
     * Get all categories
     *
     * @return categories
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAll(boolean onlyActivated) {
        return this.categoryRepository.findAllByActivated(onlyActivated).stream().map(CategoryDTO::new).collect(Collectors.toList());
    }

    /**
     * Create a category
     *
     * @param categoryDTO to save in database
     * @return the saved category DTO
     */
    @Transactional
    public CategoryDTO create(CategoryDTO categoryDTO) {
        Category categoryToSave = new Category(categoryDTO);

        categoryToSave.setActivated(true);

        this.categoryValidator.validateCreate(categoryToSave);

        return new CategoryDTO(this.categoryRepository.save(categoryToSave));
    }

    /**
     * Update a category
     *
     * @param categoryDTO to update in database
     * @return the updated category DTO
     */
    @Transactional
    public CategoryDTO update(CategoryDTO categoryDTO) {
        final Category category = getCategory(categoryDTO.getId());
        category.setName(categoryDTO.getName());
        this.categoryValidator.validateUpdate(category);
        return new CategoryDTO(categoryRepository.save(category));
    }


    @Transactional(readOnly = true)
    public Category getCategory(Long id) {
        Optional<Category> optional = getCategoryOptional(id);
        if (!optional.isPresent()) {
            throw new NotFoundException(ErrorConstants.CATEGORY_NOT_FOUND);
        }
        return optional.get();
    }

    @Transactional(readOnly = true)
    public Optional<Category> getCategoryOptional(Long id) {
        return this.categoryRepository.findById(id);
    }

    /**
     * Method using from app PWA
     *
     * @param pageable
     * @return
     */
    @Transactional(readOnly = true)
    public Page<CategoryDTO> getCategoryAssociate(Pageable pageable) {
        return categoryRepository.findAllAssociate(pageable).map(CategoryDTO::new);
    }


}
