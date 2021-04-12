import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';

import {SettingsComponent} from './settings/settings.component';
import {accountState} from './account.route';

@NgModule({
    imports: [SGMAdminCoreSharedModule,
        RouterModule.forChild(accountState)],
    declarations: [
        SettingsComponent
    ]
})
export class SGMAdminCoreAccountModule {
}
