package br.com.prefeitura.bomdestino.sig.util;

import br.com.prefeitura.bomdestino.sig.domain.*;
import br.com.prefeitura.bomdestino.sig.exception.EntityAlreadyExistsException;
import br.com.prefeitura.bomdestino.sig.repository.*;
import br.com.prefeitura.bomdestino.sig.service.CategoryService;
import br.com.prefeitura.bomdestino.sig.service.dto.CategoryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataBaseInit {

    @Autowired
    private GenericUserRepository genericUserRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private InitObject initObject;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private TenantRepository tenantRepository;

    public void populate(Long tenantId) {
        createTenants();
        createAuthorities();
        createProfiles(tenantId);
        createUsers(tenantId);
        createCategories(tenantId);
    }

    /* Create new tenants */
    public void createTenants() {
        for (Tenant tenant : initObject.getTenantsList()) {
            if (tenantRepository.findByNameIgnoreCase(tenant.getName()) == null) {
                tenantRepository.save(tenant);
            }
        }
    }

    public void createAuthorities() {
        for (Authority authority : this.initObject.getAuthoritiesList()) {
            if (!this.authorityRepository.findByName(authority.getName()).isPresent()) {
                this.authorityRepository.save(authority);
            }
        }
    }

    /* Create new profiles */
    public void createProfiles(Long tenantId) {
        if (tenantId == null) {
            tenantId = tenantRepository.findByNameIgnoreCase(initObject.getTenantEpBrazil()).getId();
        }

        for (Profile profile : this.initObject.getProfilesList(tenantId)) {
            if (this.profileRepository.findByNameAndTenantId(profile.getName(), tenantId) == null) {
                this.profileRepository.save(profile);
            }
        }
    }

    /* Create new users */
    public void createUsers(Long tenantId) {
        if (tenantId == null) {
            tenantId = tenantRepository.findByNameIgnoreCase(initObject.getTenantEpBrazil()).getId();
        }

        for (User user : this.initObject.getUsersList(tenantId)) {
            if (!this.genericUserRepository.findOneByLoginAndTenantId(user.getLogin(), tenantId).isPresent()) {
                this.genericUserRepository.save(user);
            }
        }
    }

    public void createCategories(Long tenantId) {
        if (tenantId == null) {
            tenantId = tenantRepository.findByNameIgnoreCase(initObject.getTenantEpBrazil()).getId();
        }

        for (Category category : this.initObject.getCategoriesList(tenantId)) {
            try {
                this.persistCategory(category);
            } catch (EntityAlreadyExistsException e) {
                // do nothing
            }
        }
    }

    private void persistCategory(Category category) {
        final CategoryDTO dto = new CategoryDTO(category);
        this.categoryService.create(dto);

    }

}
