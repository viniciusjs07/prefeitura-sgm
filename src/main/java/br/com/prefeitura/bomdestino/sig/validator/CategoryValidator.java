package br.com.prefeitura.bomdestino.sig.validator;

import br.com.prefeitura.bomdestino.sig.domain.Category;
import br.com.prefeitura.bomdestino.sig.exception.EntityAlreadyExistsException;
import br.com.prefeitura.bomdestino.sig.exception.ErrorConstants;
import br.com.prefeitura.bomdestino.sig.exception.InvalidParentException;
import br.com.prefeitura.bomdestino.sig.exception.NotFoundException;
import br.com.prefeitura.bomdestino.sig.repository.CategoryRepository;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CategoryValidator {

    private CategoryRepository categoryRepository;

    public CategoryValidator(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public void validateCreate(Category category) {
        validateCategoryName(category);
    }

    private void validateCategoryName(Category updatedCategory) {

        final List<Category> productExistName = this.categoryRepository.findByName(updatedCategory.getName());
        if (productExistName.size() > 0) {
            throw new EntityAlreadyExistsException(ErrorConstants.CATEGORY_NAME_ALREADY_USED);
        }
    }

    /**
     * Valida se o pai da categoria é válido. O nível máximo de profundidade da árvore de sub-categorias permitido
     * é de 3.
     * Também não é permitido que haja uma relação circular entre as categorias.
     *
     * @param category
     */
    private void validateParent(Category category) {
        final int MAX_DEPTH = 3;
        final Set<Long> seen = new HashSet();
        Category currentCategory = category;

        for (int i = 0; i < MAX_DEPTH; i++) {
            if (seen.contains(currentCategory.getId())) {
                throw new InvalidParentException(ErrorConstants.CATEGORY_INVALID_CIRCULAR_PARENT);
            }
            seen.add(currentCategory.getId());
        }

        throw new InvalidParentException(ErrorConstants.CATEGORY_INVALID_PARENT);
    }

    public void validateUpdate(Category category) {
        if (Objects.isNull(category)) {
            throw new NotFoundException(ErrorConstants.CATEGORY_NOT_FOUND);
        }
        validateCategoryName(category);
        validateParent(category);
    }
}
