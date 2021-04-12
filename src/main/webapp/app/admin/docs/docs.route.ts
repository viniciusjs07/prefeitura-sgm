import {Route} from '@angular/router';

import {SGMDocsComponent} from './docs.component';

export const docsRoute: Route = {
    path: '',
    component: SGMDocsComponent,
    data: {
        pageTitle: 'global.menu.admin.apidocs'
    }
};
