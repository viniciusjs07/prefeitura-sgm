import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {entityState} from './entity.route';
import {SGMCategoryModule} from './category/category.module';
import {UserManagementModule} from "app/entities/user-management/user-management.module";
import {SGMServiceModule} from "app/entities/service/service.module";
import {SGMCitizenModule} from "app/entities/citizen/citizen.module";

@NgModule({
    imports: [
        RouterModule.forChild(entityState),
        SGMServiceModule,
        SGMCitizenModule,
        SGMCategoryModule,
        UserManagementModule],
    declarations: []
})
export class SGMAdminCoreEntityModule {
}
