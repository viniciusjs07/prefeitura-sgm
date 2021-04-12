import {Service} from '../../../core/service/service.model';
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {INTERNAL_SERVER_ERROR, LOGO_SGM, UNAUTHORIZED_ERROR} from "app/app.constants";
import {ModalService} from "app/core/modal/modal.service";
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {TownHallService} from "app/core/service/town-hall.service";
import {AccountService} from "app/core/auth/account.service";
import {LoadingService} from "app/shared/loading/loading.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";

@Component({
    selector: 'sgm-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent implements OnInit {

    @Input('service')
    service: Service;

    logo = LOGO_SGM;

    @Output() public loadAll: EventEmitter<any> = new EventEmitter();

    constructor
    (
        private readonly modalService: ModalService,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly productService: TownHallService,
        private readonly accountService: AccountService,
        private readonly connectionService: ConnectedInternetService,
        private readonly loadingService: LoadingService
    ) {
    }

    ngOnInit() {
    }

    promptToggleActivate(product: any) {
        const modalTitle = this.service.activated ? 'product.deactivate' : 'product.activate';
        const modalBody = this.service.activated ? 'product.deactivateBody' : 'product.activateBody';
        const toastMessage = this.service.activated ? 'product.success.onDeactivate' : 'product.success.onActivate';
        const modalRef = this.modalService.showModal(modalTitle, modalBody);
        modalRef.then(() => {
            this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
            this.loadingService.start();
            this.productService.changeStatus(product.id).subscribe(() => {
                this.toastService.success(this.translateService.instant(toastMessage));
                this.loadingService.stop();
                this.loadAll.emit();
            }, (error) => {
                this.loadingService.stop();
                this.onErrorMessage(error);
            })
        });
    }

    private onErrorMessage(response) {
        if (!this.connectionService.isInternetConnection) {
            this.toastService.error(this.translateService.instant('product.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR) {
                this.toastService.error(this.translateService.instant('product.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            } else {
                this.toastService.error(this.translateService.instant('product.error.serverError'));
            }
        }
    }

    toggleDisabled(): boolean {
        return !this.accountService.hasAnyAuthority(['ROLE_RW_SERVICE']);
    }

    generateCategoryTooltip() {
        return this.service.category.name;
    }

}
