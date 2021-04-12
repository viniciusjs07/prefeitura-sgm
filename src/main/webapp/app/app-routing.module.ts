import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {errorRoute} from './layouts/error/error.route';

import {UserRouteAccessService} from 'app/core/auth/user-route-access-service';

const LAYOUT_ROUTES = [...errorRoute];

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'admin',
                data: {
                    authorities: [
                        'ROLE_R_PROFILE',
                        'ROLE_RW_PROFILE',
                        'ROLE_R_SERVICE',
                        'ROLE_RW_SERVICE',
                        'ROLE_RW_USER',
                        'ROLE_R_USER',
                        'ROLE_R_SYSTEM',
                        'ROLE_R_CITIZEN',
                        'ROLE_RW_CITIZEN',
                    ],
                },
                canActivate: [UserRouteAccessService],
                loadChildren: () => import('./admin/admin-routing.module').then((mod) => mod.AdminRoutingModule)
            },
            {
                path: 'account',
                data: {},
                loadChildren: () => import('./account/account.module').then((mod) => mod.SGMAdminCoreAccountModule)
            },
            ...LAYOUT_ROUTES
        ])
    ],
    exports: [RouterModule]
})
export class SGMAdminCoreAppRoutingModule {
}
