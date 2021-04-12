package br.com.prefeitura.bomdestino.sig.web.rest.generate;

import br.com.prefeitura.bomdestino.sig.domain.Category;
import br.com.prefeitura.bomdestino.sig.service.dto.CategoryDTO;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.HashSet;
import java.util.Set;

public final class CategoryGenerator {

    private static final Set<String> seenNames = new HashSet();

    public static CategoryDTO createCategoryDTO() {
        return new CategoryDTO(createCategory());
    }

    public static Category createCategory() {
        final Category category = new Category();
        category.setName(generateName());
        category.setActivated(true);
        return category;
    }

    public static String generateName() {
        final String name = RandomStringUtils.random(10, true, false);
        if (seenNames.contains(name)) {
            return generateName();
        }
        seenNames.add(name);
        return name;
    }

}
