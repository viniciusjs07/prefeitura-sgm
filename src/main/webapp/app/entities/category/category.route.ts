import { UserRouteAccessService } from './../../core/auth/user-route-access-service';
import { Route } from '@angular/router';
import { CategoryComponent } from './category.component';

const CATEGORY_ROUTES = [
    {
        path: '',
        component: CategoryComponent,
        data: {
            breadcrumb: ''
        }
    }
];

export const categoryRoute: Route = {
    path: 'category',
    data: {
        pageTitle: 'entity.category.main',
        breadcrumb: 'entity.category.main',
        authorities: ['ROLE_R_SERVICE', 'ROLE_RW_SERVICE'],
    },
    canActivate: [UserRouteAccessService],
    children: CATEGORY_ROUTES
};
