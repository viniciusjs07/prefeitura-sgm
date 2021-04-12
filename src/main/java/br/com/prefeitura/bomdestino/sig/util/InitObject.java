package br.com.prefeitura.bomdestino.sig.util;

import br.com.prefeitura.bomdestino.sig.domain.*;
import br.com.prefeitura.bomdestino.sig.repository.AuthorityRepository;
import br.com.prefeitura.bomdestino.sig.repository.ProfileRepository;
import br.com.prefeitura.bomdestino.sig.security.AuthoritiesConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InitObject {

    // Portuguese
    private static final String PROFILE_ADMIN = "Administrator";
    private static final String TENANT_DEFAULT = "default";
    private static final String PRIVACY_POLICY_EBR = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. " +
            "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    private static final String TERMS_OF_USE = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. " +
            "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";


    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private List<Authority> authorities;
    private List<Profile> profiles;
    private List<User> users;
    private List<Tenant> tenants;

    public InitObject() {
        this.authorities = new ArrayList<>();
        this.profiles = new ArrayList<>();
        this.users = new ArrayList<>();
        this.tenants = new ArrayList<>();
    }

    public List<Authority> getAuthoritiesList() {
        this.authorities = new ArrayList<>();
        authorities.add(new Authority(AuthoritiesConstants.RW_USER, AuthoritiesConstants.USER_AUTHORITY_RW_DESCRIPTION));
        authorities.add(new Authority(AuthoritiesConstants.R_USER, AuthoritiesConstants.USER_AUTHORITY_R_DESCRIPTION));
        authorities.add(new Authority(AuthoritiesConstants.RW_PROFILE, AuthoritiesConstants.PROFILE_AUTHORITY_RW_DESCRIPTION));
        authorities.add(new Authority(AuthoritiesConstants.R_PROFILE, AuthoritiesConstants.PROFILE_AUTHORITY_R_DESCRIPTION));
        authorities.add(new Authority(AuthoritiesConstants.R_SERVICE, AuthoritiesConstants.SERVICE_AUTHORITY_R_DESCRIPTION));
        authorities.add(new Authority(AuthoritiesConstants.RW_SERVICE, AuthoritiesConstants.SERVICE_AUTHORITY_RW_DESCRIPTION));
        authorities.add(new Authority(AuthoritiesConstants.R_CITIZEN, AuthoritiesConstants.CITIZEN_AUTHORITY_R_DESCRIPTION));
        return authorities;
    }

    public List<Profile> getProfilesList(Long tenantId) {
        this.profiles = new ArrayList<>();
        Set<Authority> authoritiesAdmin = new HashSet<>(this.authorityRepository.findAll());
        Profile admin = new Profile(PROFILE_ADMIN, AuthoritiesConstants.ADMIN_PROFILE_DESCRIPTION, authoritiesAdmin, true);
        admin.setTenantId(tenantId);
        profiles.add(admin);
        return profiles;
    }

    public List<User> getUsersList(Long tenantId) {
        this.users = new ArrayList<>();
        Profile profileAdmin = profileRepository.findByNameAndTenantId(PROFILE_ADMIN, tenantId);

        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("Admin");
        admin.addProfile(profileAdmin);
        admin.setActivated(true);
        admin.setLangKey("pt-br");
        admin.setPassword("admin@admin");
        admin.setLogin("admin");
        admin.setTenantId(tenantId);
        admin.setPassword(this.passwordEncoder.encode("admin@admin"));
        admin.setSuperUser(true);
        users.add(admin);
        return users;
    }

    public List<Category> getCategoriesList(Long tenantId) {
        final Category admin = createCategory("Administração", tenantId, null);
        final Category financial = createCategory("Financeiro", tenantId, null);
        final Category permit = createCategory("Alvará e licença", tenantId, null);
        final Category collection = createCategory("Arrecadação", tenantId, null);
        final Category assistance = createCategory("Assistência ao idoso", tenantId, null);
        final Category socialAssistance = createCategory("Assistência social", tenantId, null);
        final Category attendance = createCategory("Atendimento básico", tenantId, null);
        final Category biodiversity = createCategory("Biodiversidade", tenantId, null);
        final Category citizenship = createCategory("Cidadania", tenantId, null);
        final Category construct = createCategory("Construções e Obras", tenantId, null);
        final Category culture = createCategory("Cultura", tenantId, null);
        final Category civilDefense = createCategory("Defesa civil", tenantId, null);
        final Category humanRights = createCategory("Direitos humanos", tenantId, null);
        final Category personalDocumentation = createCategory("Documentação pessoal", tenantId, null);
        final Category education = createCategory("Educação", tenantId, null);
        final Category energy = createCategory("Energia", tenantId, null);
        final Category sport = createCategory("Esporte e lazer", tenantId, null);
        final Category housing = createCategory("Habitação", tenantId, null);
        final Category health = createCategory("Saúde", tenantId, null);
        final Category transport = createCategory("Transporte", tenantId, null);
        final Category taxation = createCategory("Tributação", tenantId, null);
        final Category tourism = createCategory("Turismo", tenantId, null);
        final Category urbanism = createCategory("Urbanismo", tenantId, null);
        final Category healthSurveillance = createCategory("Vigilância Sanitária", tenantId, null);

        return Arrays.asList(
                admin,
                financial,
                permit,
                collection,
                assistance,
                socialAssistance,
                attendance,
                biodiversity,
                citizenship,
                construct,
                culture,
                civilDefense,
                humanRights,
                personalDocumentation,
                education,
                energy,
                sport,
                housing,
                health,
                transport,
                taxation,
                tourism,
                urbanism,
                healthSurveillance
        );
    }

    private Category createCategory(String name, Long tenantId, Integer idFamily) {
        final Category category = new Category();
        category.setTenantId(tenantId);
        category.setName(name);
        category.setActivated(true);
        category.setIdFamily(idFamily);
        return category;
    }

    public List<Tenant> getTenantsList() {
        Tenant tenant = new Tenant();
        tenant.setName(TENANT_DEFAULT);
        tenant.setLanguage("pt-br");
        tenant.setActivated(true);
        tenant.setPrivacyPolicy(PRIVACY_POLICY_EBR);
        tenant.setTermsOfService(TERMS_OF_USE);
        tenants.add(tenant);
        return tenants;
    }


    public String getTenantEpBrazil() {
        return TENANT_DEFAULT;
    }

}
