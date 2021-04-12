import {
    INTERNAL_SERVER_ERROR,
    INTERNAL_SERVER_ERROR_2,
    LOGIN_ROUTER,
    PAGE_INITIAL,
    UNAUTHORIZED_ERROR
} from './../../app.constants';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';

import {ActivatedRoute, Router} from '@angular/router';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {ITEMS_PER_PAGE} from 'app/shared/constants/pagination.constants';
import {AccountService} from 'app/core/auth/account.service';
import {UserService} from 'app/core/user/user.service';
import {User} from 'app/core/user/user.model';


import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ModalService} from "app/core/modal/modal.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";
import {LoadingService} from "app/shared/loading/loading.service";
import {LoginService} from '../../core/login/login.service';
import {IUser} from './../../core/user/user.model';

@Component({
    selector: 'sgm-user-mgmt',
    templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit, OnDestroy {

    currentAccount: any;
    users: User[];
    error: any;
    success: any;
    userListSubscription: Subscription;
    totalItems: any;
    itemsPerPage: any;
    page: any;
    previousPage: any;
    loginUser: any;
    private userFilter: string = null;

    constructor(
        private readonly userService: UserService,
        private readonly alertService: JhiAlertService,
        private readonly accountService: AccountService,
        private readonly parseLinks: JhiParseLinks,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly eventManager: JhiEventManager,
        private readonly modalService: ModalService,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly internetConnection: ConnectedInternetService,
        private readonly loadingService: LoadingService,
        private readonly loginService: LoginService,
        private readonly connectionService: ConnectedInternetService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = PAGE_INITIAL;
        this.previousPage = PAGE_INITIAL;
    }

    ngOnInit() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
        } else {
            this.accountService.identity().subscribe((account) => {
                this.currentAccount = account;
                this.loadAll();
                this.registerChangeInUsers();
            }, () => {
            });
        }
    }

    checkInternet() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
        }
    }


    ngOnDestroy() {
        if (this.userListSubscription) {
            this.eventManager.destroy(this.userListSubscription);
        }
    }

    setFilter(filter) {
        this.userFilter = filter;
        this.page = PAGE_INITIAL;
        this.previousPage = PAGE_INITIAL;
        this.loadAll();
    }

    registerChangeInUsers() {
        this.userListSubscription = this.eventManager.subscribe('userListModification', () => this.loadAll());
    }

    setActive(user, isActivated) {
        user.activated = isActivated;

        this.userService.update(user).subscribe(
            () => {
                this.error = null;
                this.success = 'OK';
                this.loadAll();
            },
            () => {
                this.success = null;
                this.error = 'ERROR';
            }
        );
    }

    loadAll() {
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
            this.loadingService.stop();
        } else {
            this.userService
                .query({
                    page: this.page - 1,
                    size: this.itemsPerPage,
                    search: this.userFilter
                })
                .subscribe((res: HttpResponse<User[]>) => this.onSuccess(res.body), (res: HttpResponse<any>) => this.onError(res));
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

    private onSuccess(data) {
        this.loadingService.stop();
        this.totalItems = data.totalElements;
        this.users = data.content;
        if (this.users.length === 0) {
            this.toastService.info(this.translateService.instant('userManagement.noUserFound'));
        } else {
            this.alertService.clear();
        }
    }

    disableToggle(user): boolean {
        return this.currentAccount.login === user.login || user.superUser || !this.accountService.hasAnyAuthority(['ROLE_RW_USER']);
    }

    disableEdit(user): boolean {
        return this.currentAccount.login !== user.login && user.superUser;
    }

    disableIcons(user): boolean {
        return user.login === 'admin';
    }

    private onError(response) {
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('userManagement.error.gatewayTimeout'));
            } else if (response.status === 500) {
                this.toastService.error(this.translateService.instant('userManagement.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            }
        }
    }

    changeUserStatus(user) {
        this.loginUser = user.login;
        const modalTitle = user.activated ? 'userManagement.deactivate' : 'userManagement.activate';
        const modalBody = user.activated ? 'userManagement.deactivateBody' : 'userManagement.activateBody';
        const toastMessage = user.activated ? 'userManagement.success.onDeactivate' : 'userManagement.success.onActivate';
        const modalRef = this.modalService.showModal(modalTitle, modalBody);
        modalRef.then(() => {
            this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
            this.loadingService.start();
            this.userService.changeStatus(this.loginUser).subscribe(() => {
                this.toastService.success(this.translateService.instant(toastMessage));
                this.loadingService.stop();
                this.loadAll();
            }, (error) => {
                this.loadingService.stop();
                this.onErrorMessage(error);
            })
        });
    }

    onErrorMessage(response) {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR) {
                this.toastService.error(this.translateService.instant('userManagement.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            } else {
                this.toastService.error(this.translateService.instant('userManagement.error.serverError'));
            }
        }
    }

    remove() {
        this.modalService.showModal('userManagement.removeTitle', 'userManagement.removeBody');
    }

    download(user): void {
        const simplifyUser = {name: `${user.firstName} ${user.lastName}`, login: user.login, email: user.email};
        const sJson = JSON.stringify(simplifyUser);
        const element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
        element.setAttribute('download', `${user.login}-data.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
    }

    async blinding(user: IUser): Promise<void> {
        let userId = user.id;
        const modalTitle = 'userManagement.delete.title';
        const modalBody = 'userManagement.delete.body';
        const toastMessage = 'userManagement.delete.success';

        try {
            const modalRef = await this.modalService.showModal(modalTitle, modalBody);
            if (modalRef === 'confirm') {
                this.userService.deleteBlinding(userId).subscribe(() => {
                    this.toastService.success(this.translateService.instant(toastMessage));
                    if (user.login === this.currentAccount.login) {
                        this.goToLoginScreen();
                    } else {
                        this.loadAll();
                    }
                }, () => {
                    if (!this.connectionService.isInternetConnection) {
                        this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
                    } else {
                        this.toastService.error(this.translateService.instant('userManagement.error.serverError'));
                    }
                })
            }
        } catch (exception) {
            this.loadAll()
        }
    }

    goToLoginScreen(): void {
        this.loginService.logout();
        this.router.navigate([LOGIN_ROUTER]);
    }

}
