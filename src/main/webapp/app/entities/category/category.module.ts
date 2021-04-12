import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SGMAdminCoreSharedModule } from 'app/shared/shared.module';
import { CategoryComponent } from './category.component';
import { categoryRoute } from './category.route';

@NgModule({
    imports: [
        SGMAdminCoreSharedModule,
        RouterModule.forChild([categoryRoute])
    ],
    declarations: [
        CategoryComponent
    ]
})
export class SGMCategoryModule {}
