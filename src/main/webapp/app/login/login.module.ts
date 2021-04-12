import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LoginComponent} from 'app/login/login.component';
import {LOGIN_ROUTE} from 'app/login/login.route';
import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';

@NgModule({
    imports: [SGMAdminCoreSharedModule, RouterModule.forChild([LOGIN_ROUTE])],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SGMCoreLoginModule {}
