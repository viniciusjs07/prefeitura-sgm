import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgJhipsterModule} from 'ng-jhipster';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import { TooltipModule } from 'ng2-tooltip-directive';
import {ChartsModule} from 'ng2-charts';

@NgModule({
    exports: [
        FormsModule,
        CommonModule,
        NgbModule,
        NgJhipsterModule,
        InfiniteScrollModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        TranslateModule,
        ChartsModule,
        TooltipModule
    ]
})
export class SGMAdminCoreSharedLibsModule {}
