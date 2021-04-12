import {Routes} from '@angular/router';

import {ErrorComponent} from './error.component';

export const ERROR_TITLE = 'error.title';
export const errorRoute: Routes = [
    {
        path: 'error',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: ERROR_TITLE
        }
    },
    {
        path: 'accessdenied',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: ERROR_TITLE,
            error403: true
        }
    },
    {
        path: '404',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: ERROR_TITLE,
            error404: true
        }
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];
