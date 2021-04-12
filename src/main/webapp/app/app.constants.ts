// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const {VERSION} = process.env;
export const DEBUG_INFO_ENABLED = !!process.env.DEBUG_INFO_ENABLED;
export const {SERVER_API_URL} = {SERVER_API_URL: '', ...process.env};
export const {BUILD_TIMESTAMP} = process.env;
export const {PWA_URL} = {PWA_URL: process.env.PWA_URL || `https://192.168.0.14:4201/#/`};
export const ONLINE = 'online';
export const OFFLINE = 'offline';
export const CONNECTION_STATUS = 'connectionStatus';
export const UNAUTHORIZED_ERROR = 'error.http.401';
export const PASSWORD_NAME = 'userManagement.changePassword.error.userNameInPassword';
export const OLD_PASSWORD = 'userManagement.changePassword.error.oldPassword';

/**
 * Constants of create user
 */
export const PASSWORD_TYPE = 'password';
export const MAX_SIZE = 20;
export const MAX_SIZE_PASSWORD = 30;
export const MAX_SIZE_LOGIN = 20;
export const MAX_SIZE_EMAIL = 320;
export const PATTERN_EMAIL = '^([a-zA-Z0-9_\\.\\+-]){3,64}@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9-]){2,}$';
export const ADMIN_CANNOT_BE_EDITED = 'userManagement.error.adminCannotBeEdited';
export const ADMIN_PROFILE_CANNOT_BE_EDITED = 'userManagement.error.adminProfileCannotBeEdited';
export const ADMIN = 'admin';
export const MAX_DAY_LAST_PASSWORD_UPDATE = 90;

/**
 * Constants of pagination screen
 */
export const ITEMS_PER_PAGE = 20;
export const PAGE_INITIAL = 1;

/**
 * Constants of Login page
 */
export const LOGIN_ROUTER = '/login';
export const TEXT_TYPE = 'text';
export const LOGO_SGM = 'content/images/login/brasao-peq.png';
export const SHOW_PASSWORD = 'eye';
export const HIDE_PASSWORD = 'eye-slash';

/**
 * Constants of toast
 */
export const TIME_OUT = 4000;

/**
 * Wait to search
 */
export const DEBOUNCE_TIME = 500;

/**
 * Constants of profile form
 */
export const MAX_LENGTH_NAME = 200;
export const MAX_LENGTH_DESCRIPTION = 2000;
export const PROFILE_CANNOT_BE_UPDATED = "profiles.messages.cannotUpdatedAdminProfile";
export const PROFILE_ADMIN = "Administrator";

export const SERVICE_ALREADY_ERROR = 'product.error.alreadyProductWithName';

/**
 * Constants of error
 */
export const INTERNAL_SERVER_ERROR = 'Could not open JPA EntityManager for transaction; nested exception is org.hibernate.exception.JDBCConnectionException: Unable to acquire JDBC Connection';
export const INTERNAL_SERVER_ERROR_2 = 'Unable to acquire JDBC Connection; nested exception is org.hibernate.exception.JDBCConnectionException: Unable to acquire JDBC Connection';

/**
 * Constants of form builder
 */
export const FORM = {
    MIN_LENGTH: 3,
    MIN_LENGTH_DEFAULT: 1,
    MIN_LENGTH_PASSWORD: 8,
    MIN_LENGTH_USER: 20,
    MIN_LENGTH_EMAIL: 3,
    MAX_LENGTH_EMAIL: 74,
    MAX_LENGTH_PASSWORD: 30,
    MAX_LENGTH_NAME: 50,
    MAX_LENGTH_MODEL: 30,
    MAX_LENGTH_PROFILE: 20,
    MAX_LENGTH_DESCRIPTION: 2000,
    MAX_LENGTH_DESCRIPTION_TENANT: 100,
    MAX_LENGTH_TERMS_TENANT: 20000,
    PATTERN_PASSWORD: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-@$!%()#;:.*/?&_])(?=[\\S]).{5,}(\\S$)',
};
