import {Route} from '@angular/router';

import {UserRouteAccessService} from 'app/core/auth/user-route-access-service';
import {SettingsComponent} from './settings.component';

export const settingsRoute: Route = {
    path: 'settings',
    component: SettingsComponent,
    data: {
        authorities: ['ROLE_RW_PROFILE', 'ROLE_R_PROFILE',
            'ROLE_R_LINK', 'ROLE_RW_LINK'],
        pageTitle: 'global.menu.account.settings',
        breadcrumb: 'global.menu.account.settings'
    },
    canActivate: [UserRouteAccessService]
};
