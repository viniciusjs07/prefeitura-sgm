import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, NavigationError, Router } from '@angular/router';
import { LOGIN_ROUTER } from "app/app.constants";
import { AccountService } from "app/core/auth/account.service";
import { JhiLanguageHelper } from 'app/core/language/language.helper';
import { LoginService } from "app/core/login/login.service";
import { IUser } from './../../core/user/user.model';
@Component({
    selector: 'sgm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class SGMMainComponent implements OnInit {

    isAuthenticatedUser: boolean;
    userLogin: string;
    currentAccount: IUser;


    constructor(
        private readonly jhiLanguageHelper: JhiLanguageHelper,
        private readonly router: Router,
        private readonly loginService: LoginService,
        private readonly accountService: AccountService
    ) {
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'SGM';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
            if (event instanceof NavigationError && event.error.status === 404) {
                this.router.navigate(['/404']);
            }
        });
        this.accountService.getAuthenticationState().subscribe((user)  => {
            if (user) {
                this.userLogin = user.login;
            }
        });
        this.accountService.getCurrentUser().subscribe((user: IUser) => {
            this.currentAccount = user;
        });

    }

    getIsAuthenticatedUser(isAuthentication?) {
        this.isAuthenticatedUser = isAuthentication;
    }

    logout() {
        this.loginService.logout();
        this.router.navigate([LOGIN_ROUTER]);
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }
}
