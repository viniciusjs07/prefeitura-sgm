import {Routes} from '@angular/router';

import {settingsRoute} from './settings/settings.route';

export const accountState: Routes = [
    {
        path: '',
        children: [settingsRoute]
    }
];
