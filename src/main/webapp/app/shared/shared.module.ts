import {NgSelectModule} from '@ng-select/ng-select';
import {NgModule} from '@angular/core';
import {SGMAdminCoreSharedLibsModule} from './shared-libs.module';
import {FindLanguageFromKeyPipe} from './language/find-language-from-key.pipe';
import {SGMAlertComponent} from './alert/alert.component';
import {JhiAlertErrorComponent} from './alert/alert-error.component';
import {SGMAnyAuthorityDirective} from './auth/s-g-m-any-authority.directive';
import {EqualValidatorDirective} from 'app/shared/auth/equal-validator.directive';
import {SGMItemCountComponent} from 'app/shared/item-count';
import {ModalActionComponent} from 'app/shared/modal/modal-action/modal-action.component';
import {AuthoritiesListComponent} from 'app/shared/authorities-list/authorities-list.component';
import {ProfileComponent} from "app/shared/profile/profile.component";
import {ProfileFormComponent} from "app/shared/profile/profile-form/profile-form.component";
import {LoadingComponent} from './loading/loading.component';
import {SGMToggleButtonComponent} from "app/shared/sgm-toggle-button/s-g-m-toggle-button.component";
import {SearchComponent} from "app/shared/search/search.component";
import {ReadOnlyFormDirective} from './readonly-form/readonly-form.directive';
import {SGMCategoryItemServiceComponent} from './category-item/s-g-m-category-item-service.component';
import {QRCodeModule} from 'angularx-qrcode';
import {RangeDatepickerComponent} from './range-datepicker/range-datepicker.component';
import {NgElseDirective} from './ng-else/ng-else.directive';
import {PasswordChangeModalComponent} from './password-change-modal/password-change-modal.component';

@NgModule({
    imports: [
        SGMAdminCoreSharedLibsModule,
        NgSelectModule,
        QRCodeModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        SGMAlertComponent,
        SGMItemCountComponent,
        JhiAlertErrorComponent,
        ModalActionComponent,
        AuthoritiesListComponent,
        ProfileComponent,
        ProfileFormComponent,
        SGMToggleButtonComponent,
        SGMAnyAuthorityDirective,
        EqualValidatorDirective,
        SearchComponent,
        LoadingComponent,
        ReadOnlyFormDirective,
        SGMCategoryItemServiceComponent,
        RangeDatepickerComponent,
        NgElseDirective,
        PasswordChangeModalComponent,
    ],
    entryComponents: [
        ModalActionComponent,
        PasswordChangeModalComponent,
    ],
    exports: [
        SGMAdminCoreSharedLibsModule,
        FindLanguageFromKeyPipe,
        SGMAlertComponent,
        JhiAlertErrorComponent,
        SGMAnyAuthorityDirective,
        EqualValidatorDirective,
        ReadOnlyFormDirective,
        SGMItemCountComponent,
        AuthoritiesListComponent,
        ProfileComponent,
        ProfileFormComponent,
        SGMToggleButtonComponent,
        SearchComponent,
        LoadingComponent,
        SGMCategoryItemServiceComponent,
        RangeDatepickerComponent,
        NgElseDirective,
        PasswordChangeModalComponent,
    ]
})
export class SGMAdminCoreSharedModule {
}
