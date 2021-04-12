import {Route} from '@angular/router';

import {HomeComponent} from './home.component';
import {UserRouteAccessService} from 'app/core/auth/user-route-access-service';
import { FirstAccessService } from '../core/auth/first-access-service';

export const HOME_ROUTE: Route = {
    path: '',
    component: HomeComponent,
    data: {
        pageTitle: 'home.title',
    },
    canActivate: [UserRouteAccessService, FirstAccessService]
};
