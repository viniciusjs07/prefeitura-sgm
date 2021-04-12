package br.com.prefeitura.bomdestino.sig.exception;

public class ErrorConstants {

    private ErrorConstants() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Category constants
     */
    public static final String CATEGORY_NOT_FOUND = "Category not found";
    public static final String CATEGORY_NAME_ALREADY_USED = "category.error.duplicatedName";
    public static final String CATEGORY_INVALID_PARENT = "Cannot have this category as parent. Max depth allowed: 10";
    public static final String CATEGORY_INVALID_CIRCULAR_PARENT = "Cannot have a circular relationship on categories.";
    public static final String SERVICE_CANNOT_HAVE_INACTIVE_CATEGORY = "Product cannot have a inactive category.";

    /**
     * Product constants
     */
    public static final String PRODUCT_NOT_FOUND = "Service not found";
    public static final String SERVICE_CANNOT_BE_NULL = "product.error.cannotBeNull";
    public static final String SERVICE_MIN_LENGTH = "product.error.minlength";
    public static final String SERVICE_NAME_ALREADY_USED = "product.error.alreadyProductWithName";
    /**
     * Tenant constants
     */
    public static final String TENANT_NAME_ALREADY_USED = "tenant.error.nameAlreadyUsed";
    public static final String TENANT_NAME_MIN_LENGTH = "tenant.error.minlength";
    public static final String TENANT_NAME_CANNOT_BE_NULL = "tenant.error.nameCannotBeNull";
    public static final String TENANT_LANGUAGE_CANNOT_BE_NULL = "tenant.error.languageCannotBeNull";
    public static final String TENANT_PRIVACY_POLICY_MIN_LENGTH = "tenant.error.privacyPolicyMinlength";
    public static final String TENANT_PRIVACY_POLICY_MAX_LENGTH = "tenant.error.privacyPolicyMaxlength";
    public static final String TENANT_TERMS_SERVICE_MIN_LENGTH = "tenant.error.termsOfServiceMinlength";
    public static final String TENANT_TERMS_SERVICE_MAX_LENGTH = "tenant.error.termsOfServiceMaxlength";

    public static final String CLIENT_REST_ERROR_CREATED = "Could not create elastic search client configuration";
    public static final String ADMIN_CANNOT_BE_EDITED = "userManagement.error.adminCannotBeEdited";
    public static final String PROFILE_ADMIN_CANNOT_BE_EDITED = "userManagement.error.adminProfileCannotBeEdited";
    public static final String PROFILE_NOT_FOUND = "Profile not found";
    public static final String PROFILE_CANNOT_BE_UPDATED = "profiles.messages.cannotUpdatedAdminProfile";

    /**
     * Language Constants
     */
    public static final String LANGUAGE_ALREADY_REGISTERED = "Language already registered";
    public static final String LANGUAGE_NOT_FOUND = "Language not found";
    public static final String NOT_AUTHORIZED_TO_LANGUAGE = "User not authorized to language";
    public static final String ENTITY_MUST_HAVE_DATA = "Entity must have data in at least one language";
    public static final String MUST_HAVE_ONE_ACTIVE_LANGUAGE = "You cannot deactivate all system languages";

}
