import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {citizenRoute} from "app/entities/citizen/citizenRoute";
import {CitizenComponent} from "app/entities/citizen/citizen.component";
import {CitizenCardComponent} from "app/entities/citizen/citizen-card/citizen-card.component";
import {CitizenViewComponent} from "app/entities/citizen/view/citizen-view.component";

@NgModule({
    imports: [
        SGMAdminCoreSharedModule,
        NgSelectModule,
        RouterModule.forChild([citizenRoute])
    ],
    declarations: [
        CitizenComponent,
        CitizenCardComponent,
        CitizenViewComponent

    ],
    entryComponents: []
})
export class SGMCitizenModule {
}
