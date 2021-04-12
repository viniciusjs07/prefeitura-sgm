import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SGMAdminCoreSharedModule} from 'app/shared/shared.module';

import {SGMDocsComponent} from './docs.component';

import {docsRoute} from './docs.route';

@NgModule({
    imports: [SGMAdminCoreSharedModule, RouterModule.forChild([docsRoute])],
    declarations: [SGMDocsComponent]
})
export class DocsModule {
}
