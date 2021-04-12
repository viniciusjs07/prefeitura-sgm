import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import './vendor';
import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';
import {SGMAdminCoreCoreModule} from 'app/core/core.module';
import {SGMAdminCoreAppRoutingModule} from './app-routing.module';
import {SGMAdminCoreHomeModule} from './home/home.module';
import {SGMAdminCoreEntityModule} from './entities/entity.module';
import {SGMMainComponent} from './layouts/main/main.component';
import {ErrorComponent} from './layouts/error/error.component';
import {SGMCoreLoginModule} from 'app/login/login.module';
import {SideMenuComponent} from 'app/shared/side-menu/side-menu.component';
import {ToastrModule} from 'ngx-toastr';
import {TIME_OUT} from 'app/app.constants';
import {BreadcrumbModule} from 'angular-crumbs';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SGMAdminCoreSharedModule,
        SGMAdminCoreCoreModule,
        SGMAdminCoreHomeModule,
        SGMCoreLoginModule,
        SGMAdminCoreEntityModule,
        SGMAdminCoreAppRoutingModule,
        ToastrModule.forRoot({
            timeOut: TIME_OUT,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
        BreadcrumbModule
    ],
    declarations: [SGMMainComponent,
        SideMenuComponent,
        ErrorComponent],
    bootstrap: [SGMMainComponent]
})
export class SGMAdminCoreAppModule {
}
