import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {CategoryService} from './../../core/category/category.service';
import {Component, OnInit} from '@angular/core';
import {Category} from '../../core/category/category.model';
import {LoadingService} from "app/shared/loading/loading.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";
import {INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_2, UNAUTHORIZED_ERROR} from "app/app.constants";

@Component({
    selector: 'sgm-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    categories: Category[] = [];
    selectedCategory: Category;
    selectedSubCategory: Category;
    selectedSubSubCategory: Category;

    constructor(
        private readonly categoryService: CategoryService,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly loadingService: LoadingService,
        private readonly internetConnection: ConnectedInternetService
    ) {
    }

    ngOnInit() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('category.error.internetError'));
        } else {
            this.loadCategories();
        }
    }


    loadCategories(): Observable<any> {
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        const request = this.categoryService.query({onlyActivated: true});
        request.subscribe((categories) => {
            this.categories = categories;
            this.loadingService.stop();
        }, (error) => {
            this.loadingService.stop();
            this.onError(error);
        });
        return request;
    }

    selectCategory(category: Category) {
        if (this.selectedCategory !== category) {
            this.selectedCategory = category;
            this.selectedSubCategory = null;
            this.selectedSubSubCategory = null;
        }
    }

    private onError(response) {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('category.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('category.error.gatewayTimeout'));
            } else if (response.status === 500) {
                this.toastService.error(this.translateService.instant('category.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else {
                this.toastService.error(this.translateService.instant('category.error.onLoad'));
            }
        }
    }
}
