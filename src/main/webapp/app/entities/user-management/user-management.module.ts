import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';
import {UserManagementComponent} from './user-management.component';
import {UserManagementFormComponent} from './user-management-form.component';
import {userManagementRoute} from './user-management.route';

import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [SGMAdminCoreSharedModule, RouterModule.forChild([userManagementRoute]), NgSelectModule],
    declarations: [
        UserManagementComponent,
        UserManagementFormComponent
    ],
    entryComponents: []
})
export class UserManagementModule {
}
