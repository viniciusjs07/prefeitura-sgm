import {ModalService} from 'app/core/modal/modal.service';
import {IService, Service} from 'app/core/service/service.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Category, ICategory} from 'app/core/category/category.model';
import {CategoryService} from 'app/core/category/category.service';
import {ToastrService} from 'ngx-toastr';
import {TownHallService} from 'app/core/service/town-hall.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {TranslateService} from '@ngx-translate/core';
import {
    FORM,
    INTERNAL_SERVER_ERROR,
    INTERNAL_SERVER_ERROR_2,
    MAX_LENGTH_DESCRIPTION,
    MAX_LENGTH_NAME,
    SERVICE_ALREADY_ERROR,
    UNAUTHORIZED_ERROR
} from "app/app.constants";
import {HttpEvent, HttpEventType} from '@angular/common/http';


import lodash from 'lodash';
import {LoadingService} from "app/shared/loading/loading.service";
import {trim} from "app/shared/util/trim-field";
import {AccountService} from "app/core/auth/account.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";

@Component({
    selector: 'sgm-service-form',
    templateUrl: './service-form.component.html',
    styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {

    readonly DETAILS = 'Details';

    @ViewChild('InputProducts', {static: false}) input: ElementRef;

    currentState = this.DETAILS;
    isSaving = false;
    categories = [];
    percentDone: any = '0';
    editable = true;

    constants = {
        NAME_LENGTH: MAX_LENGTH_NAME,
        DESCRIPTION_LENGTH: MAX_LENGTH_DESCRIPTION
    };

    serviceForm: FormGroup = this.fb.group({
        id: [null],
        name: ['', [Validators.required, Validators.minLength(FORM.MIN_LENGTH), Validators.maxLength(this.constants.NAME_LENGTH), Validators.pattern('.*[^ ].*')]],
        description: ['', [Validators.minLength(FORM.MIN_LENGTH_DEFAULT), Validators.maxLength(FORM.MAX_LENGTH_DESCRIPTION)]],
        category: ['', [Validators.required, Validators.minLength(FORM.MIN_LENGTH_DEFAULT), Validators.maxLength(FORM.MAX_LENGTH_NAME)]],
    });

    service: IService;
    private originalService: IService;

    selectedCategory: Category;
    selectedSubCategory: Category;
    selectedSubSubCategory: Category;

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
            this.updateForm(service);
            this.loadCategories();
        }, (error) => {
            this.loadingService.stop();
        });
        this.checkEditable();
    }

    loadCategories() {
        this.categoryService.query({onlyActivated: true}).subscribe((categories: ICategory[]) => {
            const productCategory = this.service.category;
            if (productCategory) {
                categories.forEach((category) => {
                    if (category.id === productCategory.id) {
                        this.service.category = category;
                        this.selectCategory(category);
                    }

                    category.subCategories.forEach((subCategory) => {
                        if (subCategory.id === productCategory.id) {
                            this.service.category = subCategory;
                            this.selectCategory(category);
                            this.selectSubCategory(subCategory);
                        }

                        subCategory.subCategories.forEach((subSubCategory) => {
                            if (subSubCategory.id === productCategory.id) {
                                this.service.category = subSubCategory;
                                this.selectCategory(category);
                                this.selectSubCategory(subCategory);
                                this.selectSubSubCategory(subSubCategory);
                            }
                        });
                    });
                });
            }

            this.categories = categories;
            this.loadingService.stop();
        }, (error) => {
            this.onErrorRequest(error);
        });
    }

    private updateForm(iService: IService) {
        this.serviceForm.get('category').setValue(iService.category);
        this.serviceForm.get('name').setValue(iService.name);
        this.serviceForm.get('name').markAsUntouched();
        this.serviceForm.get('description').setValue(iService.description);
    }

    previousState() {
        this.router.navigate(['/entity/service']);
    }

    save(): void {
        this.isSaving = true;
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('product.error.internetError'));
            return;
        }

        trim('name', this.serviceForm);
        trim('description', this.serviceForm);
        if (this.serviceForm.invalid) {
            this.toastService.error(this.translateService.instant('product.error.invalidField'));
            return;
        }
        this.prepareService();

        if (lodash.isEqual(this.originalService, this.service)) {
            this.toastService.info(this.translateService.instant('global.messages.info.noChanges'));
            return this.previousState();
        }
        this.loadingService.start();
        this.service.category.parent = new Category();
        this.service.category.subCategories = [];
        this.saveService().subscribe((event: HttpEvent<any>) => {
            if (event.type === HttpEventType.UploadProgress) {
                this.percentDone = Math.round(100 * event.loaded / event.total);
                this.loadingService.setMessage(this.translateService.instant('global.messages.loading').concat(` ${this.percentDone}%`));
            }

            if (event.type === HttpEventType.Response) {
                this.isSaving = false;
                this.loadingService.stop();
                const message = this.service.id ? 'product.success.onUpdate' : 'product.success.onSave';
                this.toastService.success(this.translateService.instant(message));
                this.previousState();
            }
        }, (response) => {
            this.isSaving = false;
            this.loadingService.stop();
            this.onError(response);
        });

    }

    private onError(response) {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('product.error.internetError'));
        } else {
            const message = response.error.detail;
            this.loadCategories();
            if (message === SERVICE_ALREADY_ERROR) {
                this.toastService.error(this.translateService.instant(message));
            } else if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
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


    private onErrorRequest(response) {
        this.loadingService.stop();
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

    prepareService() {
        this.service.category = this.serviceForm.get('category').value;
        this.service.name = this.serviceForm.get('name').value;
        this.service.description = this.serviceForm.get('description').value;
    }

    saveService() {
        if (this.service.id) {
            return this.townHallService.update(this.service);
        }
        return this.townHallService.create(this.service);
    }

    selectCategory(category) {
        if (this.validateCategorySelect(category)) {
            if (category !== this.selectedCategory) {
                this.selectedSubCategory = null;
                this.selectedSubSubCategory = null;
            }
            this.selectedCategory = category;
            this.serviceForm.get('category').setValue(category);
        }
    }

    selectSubCategory(category) {
        if (this.validateCategorySelect(category)) {
            if (category !== this.selectedSubCategory) {
                this.selectedSubSubCategory = null;
            }
            this.selectedSubCategory = category;
            this.serviceForm.get('category').setValue(category);
        }
    }

    selectSubSubCategory(category) {
        if (this.validateCategorySelect(category)) {
            this.selectedSubSubCategory = category;
            this.serviceForm.get('category').setValue(category);
        }
    }

    private validateCategorySelect(category): boolean {
        const validCategory = category.activated || this.categories.length === 0;
        if (!validCategory) {
            this.toastService.error(this.translateService.instant('product.form.invalidCategory'));
        }
        return validCategory;
    }

    show(state) {
        this.currentState = state;
    }

    isDetails() {
        return this.currentState === this.DETAILS;
    }

    private checkEditable() {
        this.editable = this.accountService.hasAnyAuthority(['ROLE_RW_SERVICE']);
    }
}
