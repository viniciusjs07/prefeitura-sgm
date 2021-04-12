package br.com.prefeitura.bomdestino.sig.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    private static final String PREFIX = "ROLE_";

    public static final String ADMIN = PREFIX + "ADMIN";

    public static final String USER = PREFIX + "USER";

    public static final String ANONYMOUS = PREFIX + "ANONYMOUS";

    public static final String IS_AUTHENTICATED_FULLY = "IS_AUTHENTICATED_FULLY";

    // Authorities to Administrative Module

    public static final String RW_USER = PREFIX + "RW_USER";
    public static final String R_USER = PREFIX + "R_USER";
    public static final String RW_PROFILE = PREFIX + "RW_PROFILE";
    public static final String R_PROFILE = PREFIX + "R_PROFILE";
    public static final String RW_SERVICE = PREFIX + "RW_SERVICE";
    public static final String R_SERVICE = PREFIX + "R_SERVICE";
    public static final String R_CITIZEN = PREFIX + "R_CITIZEN";


    // Description of Authorities

    public static final String USER_AUTHORITY_RW_DESCRIPTION = "Permission to write and read access only to users.";

    public static final String USER_AUTHORITY_R_DESCRIPTION = "Read-only access permission for users.";

    public static final String PROFILE_AUTHORITY_RW_DESCRIPTION = "Permission to write and read access only to profiles.";

    public static final String PROFILE_AUTHORITY_R_DESCRIPTION = "Read-only access permission for profiles.";

    public static final String SERVICE_AUTHORITY_RW_DESCRIPTION = "Permission to write and read access only to services.";

    public static final String SERVICE_AUTHORITY_R_DESCRIPTION = "Read-only access permission for services.";

    public static final String CITIZEN_AUTHORITY_R_DESCRIPTION = "Read-only access permission for citizens.";

    // Description of Admin profile

    public static final String ADMIN_PROFILE_DESCRIPTION = "Administrator profile in admin sgm system";


    private AuthoritiesConstants() {
    }
}
