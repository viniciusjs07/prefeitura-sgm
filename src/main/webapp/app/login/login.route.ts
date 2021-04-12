import {Route} from '@angular/router';
import {LoginComponent} from 'app/login/login.component';

export const LOGIN_ROUTE: Route = {
    path: 'login',
    component: LoginComponent,
    data: {
        authorities: [],
        pageTitle: 'login.title'
    }
};
