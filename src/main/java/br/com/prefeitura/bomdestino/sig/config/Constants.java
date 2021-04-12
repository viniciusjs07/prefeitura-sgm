package br.com.prefeitura.bomdestino.sig.config;

/**
 * Application constants.
 */
public final class Constants {

    // Regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_.@A-Za-z0-9-]*$";
    
    public static final String SYSTEM_ACCOUNT = "system";
    public static final String DEFAULT_LANGUAGE = "pt-br";
    public static final String ANONYMOUS_USER = "anonymoususer";

    public static final String USERS_BY_LOGIN_CACHE = "usersByLogin";
    public static final String USERS_BY_EMAIL_CACHE = "usersByEmail";
    public static final String ADMIN_PROFILE = "Administrator";
    public static final String ADMIN = "admin";
    public static final String CHANGE_PASSWORD_URL = "/changepassword";

    private Constants() {
    }
}
