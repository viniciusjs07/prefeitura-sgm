import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProfileService} from "app/core/profile/profile.service";
import {HttpResponse} from '@angular/common/http';
import {IProfile} from "app/core/profile/profile.model";
import {
    INTERNAL_SERVER_ERROR,
    INTERNAL_SERVER_ERROR_2,
    ITEMS_PER_PAGE,
    PAGE_INITIAL,
    PROFILE_ADMIN, UNAUTHORIZED_ERROR
} from "app/app.constants";
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {IAuthority} from "app/core/authority/authority.model";
import {LoadingService} from "app/shared/loading/loading.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";

@Component({
    selector: 'sgm-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

    profiles: IProfile[];
    authorities: IAuthority[];
    page = PAGE_INITIAL;
    filter = null;
    itemsPerPage = ITEMS_PER_PAGE;
    totalItems = 0;
    previousPage = PAGE_INITIAL;

    @Output() public navigateProfileEdit: EventEmitter<any> = new EventEmitter();

    constructor(
        private readonly profileService: ProfileService,
        private readonly translateService: TranslateService,
        private readonly toastService: ToastrService,
        private readonly loadingService: LoadingService,
        private readonly internetConnection: ConnectedInternetService
    ) {
    }

    ngOnInit() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('profile.error.internetError'));
        } else {
            this.profiles = [];
            this.authorities = [];
            this.loadAll();
        }
    }

    loadAll() {
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('profile.error.internetError'));
            this.loadingService.stop();
        } else {
            this.profileService.query({
                page: this.page - 1,
                size: this.itemsPerPage,
                search: this.filter
            }).subscribe(
                (res: HttpResponse<any>) => this.onSuccess(res.body),
                (error: HttpResponse<any>) => this.onError(error)
            );
        }

    }

    private onSuccess(data) {
        this.totalItems = data.totalElements;
        this.profiles = data.content;
        this.loadingService.stop();
        if (this.profiles.length === 0) {
            this.toastService.info(this.translateService.instant('profiles.messages.noProfilesFound'));
        }
    }

    private onError(response) {
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('profile.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('profile.error.gatewayTimeout'));
            } else if (response.status === 500) {
                this.toastService.error(this.translateService.instant('profile.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            } else {
                this.toastService.error(this.translateService.instant('profile.error.serverError'));
            }
        }
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.loadAll();
        }
    }

    goToEditProfile(id: any) {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('product.error.internetError'));
            return;
        }
        this.navigateProfileEdit.emit(id);
    }

    disableEdit(profile): boolean {
        return profile.name === PROFILE_ADMIN;
    }

    setFilter(filter) {
        this.filter = filter;
        this.page = PAGE_INITIAL;
        this.previousPage = PAGE_INITIAL;
        this.loadAll();
    }
}
