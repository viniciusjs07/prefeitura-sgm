import {INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_2, PAGE_INITIAL, UNAUTHORIZED_ERROR} from './../../app.constants';
import {ToastrService} from 'ngx-toastr';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {IService} from 'app/core/service/service.model';
import {TownHallService} from '../../core/service/town-hall.service';
import {Component, OnInit} from "@angular/core";
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from "app/shared/loading/loading.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";

@Component({
    selector: 'sgm-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

    services: IService[] = [];

    totalItems: any;
    itemsPerPage: any;
    page: any;
    previousPage: any;

    filter: string = null;

    constructor(
        private readonly townHallService: TownHallService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly router: Router,
        private readonly loadingService: LoadingService,
        private readonly internetConnection: ConnectedInternetService
    ) {
    }

    ngOnInit() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('category.error.internetError'));
        } else {
            this.itemsPerPage = 15;
            this.page = PAGE_INITIAL;
            this.previousPage = PAGE_INITIAL;
            this.loadAll();
        }
    }

    checkInternet() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('product.error.internetError'));
        }
    }

    loadAll() {
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('product.error.internetError'));
            this.loadingService.stop();
        } else {
            this.townHallService.query({
                page: this.page - 1,
                size: this.itemsPerPage,
                search: this.filter
            }).subscribe((res: HttpResponse<any>) => {
                this.totalItems = res.body.totalElements;
                this.services = this.townHallService.getService(res);
                this.loadingService.stop();
                if (this.services.length === 0) {
                    this.toastService.info(this.translateService.instant('product.error.noProductsFound'));
                }

            }, (error) => {
                this.loadingService.stop();
                this.onError(error);
            });
        }
    }


    onError(response) {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('product.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('product.error.gatewayTimeout'));
            } else if (response.status === 500) {
                this.toastService.error(this.translateService.instant('product.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            }
        }
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['./'], {
            relativeTo: this.activatedRoute.parent,
            queryParams: {
                page: this.page
            }
        });
        this.loadAll();
    }

    setFilter(filter: string) {
        this.filter = filter;
        this.page = PAGE_INITIAL;
        this.previousPage = PAGE_INITIAL;
        this.loadAll();
    }

}
