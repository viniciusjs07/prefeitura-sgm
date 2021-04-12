import {ServiceCardComponent} from './service-card/service-card.component';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {serviceRoute} from './serviceRoute';
import {ServiceComponent} from './service.component';
import {ServiceFormComponent} from './service-form.component';

import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [
        SGMAdminCoreSharedModule,
        NgSelectModule,
        RouterModule.forChild([serviceRoute])
    ],
    declarations: [
        ServiceComponent,
        ServiceFormComponent,
        ServiceCardComponent,
    ],
    entryComponents: []
})
export class SGMServiceModule {
}
