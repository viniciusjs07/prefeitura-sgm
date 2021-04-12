import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {UserRouteAccessService} from "app/core/auth/user-route-access-service";


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'docs',
                loadChildren: () => import('./docs/docs.module').then((mod) => mod.DocsModule),
                data: {
                    authorities: ['ROLE_R_SYSTEM'],
                    breadcrumb: 'global.menu.admin.docs'
                },
                canActivate: [UserRouteAccessService]
            },
        ])
    ]
})
export class AdminRoutingModule {
}
