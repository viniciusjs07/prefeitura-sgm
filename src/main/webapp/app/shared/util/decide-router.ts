import {AccountService} from "app/core/auth/account.service";

export const decideRoute = (account: AccountService) => {
    const authorities = [
        [['ROLE_R_USER', 'ROLE_RW_USER'], '/entity/user'],
        [['ROLE_R_SERVICE', 'ROLE_RW_SERVICE'], '/entity/service'],
        [['ROLE_R_PROFILE', 'ROLE_RW_PROFILE'], 'account/settings'],
        [['ROLE_R_SERVICE', 'ROLE_RW_SERVICE'], '/entity/category'],
        [['ROLE_R_SYSTEM'], '/admin/system'],
        [['ROLE_R_CITIZEN', 'ROLE_RW_CITIZEN'], '/entity/citizen'],
    ];

    for (const [auths, route] of authorities) {
        if (account.hasAnyAuthority(auths)) {
            return route;

        }
    }

    return '/entity/user';
};
