package br.com.prefeitura.bomdestino.sig.web.rest;

import br.com.prefeitura.bomdestino.sig.service.CategoryService;
import br.com.prefeitura.bomdestino.sig.service.dto.CategoryDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Transactional
public class CategoryResource {

    private CategoryService categoryService;

    public CategoryResource(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * GET /categories : get all categories.
     *
     * @return the ResponseEntity with status 200 (OK) and with body all categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAll(@RequestParam(name = "onlyActivated", defaultValue = "true") boolean onlyActivated) {
        List<CategoryDTO> result = this.categoryService.getAll(onlyActivated);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
