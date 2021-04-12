import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AccountService} from "app/core/auth/account.service";
import {UserService} from "app/core/user/user.service";
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {IUser, User} from "app/core/user/user.model";
import {LoggedUserService} from "app/core/user/logged-user.service";
import {INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_2, UNAUTHORIZED_ERROR} from "app/app.constants";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";
import {LoadingService} from "app/shared/loading/loading.service";

@Component({
    selector: 'sgm-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

    @Output() public isAuthenticatedUser: EventEmitter<boolean> = new EventEmitter();

    readonly imageFormats = 'image/png, image/jpeg, image/jpg';

    loggedUser: IUser;

    constructor(
        private readonly accountService: AccountService,
        private readonly userService: UserService,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly loggedUserService: LoggedUserService,
        private readonly internetConnection: ConnectedInternetService,
        private readonly loadingService: LoadingService,
    ) {
        accountService.getAuthenticationState().subscribe((user) => {
            this.loggedUser = user;
            this.loggedUserService.editUser(user);
        });
        this.loggedUserService.loggedUserCast.subscribe((user: User) => {
            this.loggedUser = user;
        })
    }

    ngOnInit() {
    }

    isAuthenticated() {
        this.isAuthenticatedUser.emit(this.accountService.isAuthenticated());
        return this.accountService.isAuthenticated();
    }


    saveImage() {
        this.userService.updateImage(this.loggedUser).subscribe((result: any) => {
            this.loadingService.stop();
            this.toastService.success(this.translateService.instant('userManagement.info.saveSuccess'));
        }, (responseError: any) => {
            this.onError(responseError);
        });
    }

    private onError(responseError: any) {
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
        } else {
            const message = responseError.error.detail;
            if (responseError.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('userManagement.error.gatewayTimeout'));
            } else if (responseError.status === 500) {
                this.toastService.error(this.translateService.instant('userManagement.error.gatewayTimeout'));
            } else if (responseError.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(responseError.error.detail || responseError.error.translate));
            } else if (responseError.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            } else {
                this.toastService.error(this.translateService.instant(responseError.error.message));
            }
        }
    }
}
