import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';
import {HOME_ROUTE} from './home.route';
import {HomeComponent} from './home.component';
import {SGMCoreLoginModule} from "app/login/login.module";
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [
        SGMAdminCoreSharedModule,
        RouterModule.forChild([HOME_ROUTE]),
        SGMCoreLoginModule,
        NgSelectModule
    ],
    declarations: [
        HomeComponent
    ]
})
export class SGMAdminCoreHomeModule {
}
