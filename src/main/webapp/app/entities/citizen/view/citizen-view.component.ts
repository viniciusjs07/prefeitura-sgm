import {ModalService} from 'app/core/modal/modal.service';
import {IService, Service} from 'app/core/service/service.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from 'app/core/category/category.service';
import {ToastrService} from 'ngx-toastr';
import {TownHallService} from 'app/core/service/town-hall.service';
import {FormBuilder} from '@angular/forms';
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {TranslateService} from '@ngx-translate/core';
import {MAX_LENGTH_DESCRIPTION, MAX_LENGTH_NAME} from "app/app.constants";


import lodash from 'lodash';
import {LoadingService} from "app/shared/loading/loading.service";
import {AccountService} from "app/core/auth/account.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";

@Component({
    selector: 'sgm-citizen-view',
    templateUrl: './citizen-view.component.html',
    styleUrls: ['./citizen-view.component.scss']
})
export class CitizenViewComponent implements OnInit {

    readonly DETAILS = 'Details';

    @ViewChild('InputProducts', {static: false}) input: ElementRef;

    currentState = this.DETAILS;
    isSaving = false;
    categories = [];
    editable = true;

    constants = {
        NAME_LENGTH: MAX_LENGTH_NAME,
        DESCRIPTION_LENGTH: MAX_LENGTH_DESCRIPTION
    };

    service: IService;
    private originalService: IService;


    constructor(
        private readonly fb: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly townHallService: TownHallService,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly categoryService: CategoryService,
        private readonly modalService: ModalService,
        private readonly loadingService: LoadingService,
        private readonly accountService: AccountService,
        private readonly internetConnection: ConnectedInternetService
    ) {
    }

    ngOnInit() {
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();

        this.route.data.subscribe(({service}) => {
            this.service = service.body ? service.body : service;
            this.originalService = lodash.cloneDeep(this.service);
            if (!this.service) {
                this.service = new Service();
            }
            console.log('service request ', this.service);
            this.loadingService.stop();
        }, (error) => {
            this.loadingService.stop();
        });
        this.checkEditable();
    }

    previousState() {
        this.router.navigate(['/entity/citizen']);
    }

    show(state) {
        this.currentState = state;
    }

    private checkEditable() {
        this.editable = this.accountService.hasAnyAuthority(['ROLE_RW_SERVICE']);
    }
}
