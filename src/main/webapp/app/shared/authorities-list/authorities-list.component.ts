import {Component, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {IAuthority} from 'app/core/authority/authority.model';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from 'app/core/user/user.service';
import {ITEMS_PER_PAGE} from 'app/shared/constants/pagination.constants';
import {INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_2, PAGE_INITIAL, UNAUTHORIZED_ERROR} from 'app/app.constants';
import {LoadingService} from "app/shared/loading/loading.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";

@Component({
    selector: 'sgm-authorities',
    templateUrl: './authorities-list.component.html',
})
export class AuthoritiesListComponent implements OnInit {

    authorities: IAuthority[];
    page = PAGE_INITIAL;
    itemsPerPage = ITEMS_PER_PAGE;
    totalItems: 0;
    previousPage = PAGE_INITIAL;

    constructor(
        private readonly userService: UserService,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly loadingService: LoadingService,
        private readonly internetConnection: ConnectedInternetService
    ) {
    }

    ngOnInit() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('permission.internetError'));
        } else {
            this.authorities = [];
            this.loadAll();
        }
    }

    loadAll() {
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('permission.internetError'));
            this.loadingService.stop();
        }
        this.userService.authorities({
            page: this.page - 1,
            size: this.itemsPerPage
        }).subscribe(
            (res: HttpResponse<IAuthority[]>) =>
                this.onSuccess(res.body),
            (error: HttpResponse<any>) => this.onError(error)
        );
    }

    private onSuccess(data) {
        this.totalItems = data.totalElements;
        this.authorities = data.content;
        this.loadingService.stop();
    }

    onError(response) {
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('permission.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('permission.gatewayTimeout'));
            } else if (response.status === 500) {
                this.toastService.error(this.translateService.instant('permission.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            } else {
                this.toastService.error(this.translateService.instant('permission.serverError'));
            }
        }
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.loadAll();
        }
    }
}
