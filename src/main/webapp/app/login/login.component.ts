import {Component, ElementRef, OnInit} from '@angular/core';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {
    HIDE_PASSWORD,
    INTERNAL_SERVER_ERROR,
    LOGO_SGM,
    PASSWORD_TYPE,
    SHOW_PASSWORD,
    TEXT_TYPE
} from 'app/app.constants';
import {LoginService} from 'app/core/login/login.service';
import {StateStorageService} from 'app/core/auth/state-storage.service';
import {JhiLanguageHelper} from 'app/core/language/language.helper';
import {SessionStorageService} from 'ngx-webstorage';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AccountService} from "app/core/auth/account.service";
import {decideRoute} from "app/shared/util/decide-router";
import {AuthServerProvider} from "app/core/auth/auth-jwt.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";

@Component({
    selector: 'sgm-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    isShowPassword: boolean;
    inputPasswordType: string = PASSWORD_TYPE;
    eyeIcon: string = HIDE_PASSWORD;
    timeoutBd;
    slowSystem = false;
    isEnablingFlow = false;

    logoSgm = LOGO_SGM;

    languages: any[];
    language: string;

    loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        rememberMe: ['']
    });

    constructor(
        private readonly eventManager: JhiEventManager,
        private readonly loginService: LoginService,
        private readonly stateStorageService: StateStorageService,
        private readonly elementRef: ElementRef,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
        private readonly languageHelper: JhiLanguageHelper,
        private readonly languageService: JhiLanguageService,
        private readonly sessionStorage: SessionStorageService,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly accountService: AccountService,
        private readonly authService: AuthServerProvider,
        private readonly connectionService: ConnectedInternetService,
    ) {
        this.languages = this.languageHelper.getAll();
        this.languageService.getCurrent().then((selectedLang) => {
            this.language = selectedLang;
        });
    }


    ngOnInit() {
        if (this.authService.getToken()) {
            this.router.navigate([decideRoute(this.accountService)]);
        }
    }

    login() {
        this.isEnablingFlow = true;
        if (!this.connectionService.isInternetConnection) {
            this.toastService.error(this.translateService.instant('login.messages.error.internetError'));
            this.isEnablingFlow = false;
        } else {
            this.timeoutBd = setTimeout(() => {
                this.toastService.error(this.translateService.instant('login.messages.error.gatewayTimeout'));
                this.slowSystem = true;
                this.isEnablingFlow = false;
            }, 6000);
            this.loginService
                .login({
                    username: this.loginForm.get('username').value,
                    password: this.loginForm.get('password').value,
                    rememberMe: this.loginForm.get('rememberMe').value
                })
                .subscribe(
                    () => {
                        this.isEnablingFlow = false;
                        clearTimeout(this.timeoutBd);
                        if (!this.slowSystem) {
                            this.eventManager.broadcast({
                                name: 'authenticationSuccess',
                                content: 'Sending Authentication Success'
                            });
                            this.router.navigate([decideRoute(this.accountService)]);
                        }

                    },
                    (error: any) => {
                        clearTimeout(this.timeoutBd);
                        if (!this.slowSystem) {
                            this.showAlertLoginInvalid(error);
                        }
                        this.isEnablingFlow = false;
                    }
                );
        }

    }


    showPassword() {
        this.isShowPassword = !this.isShowPassword;
        if (this.isShowPassword) {
            this.inputPasswordType = TEXT_TYPE;
            this.eyeIcon = SHOW_PASSWORD;
        } else {
            this.inputPasswordType = PASSWORD_TYPE;
            this.eyeIcon = HIDE_PASSWORD;
        }
    }

    changeLanguage() {
        const langKey = this.onSelectLangKey();
        this.sessionStorage.store('locale', langKey);
        this.languageService.changeLanguage(langKey);
    }

    private onSelectLangKey() {
        if (this.language === "en") {
            return this.languages[0];
        } else if (this.language === "pt-br") {
            return this.languages[1];
        } else {
            return this.languages[2];
        }

    }


    showAlertLoginInvalid(response) {
        if (response.status === 504 || response.error.detail === INTERNAL_SERVER_ERROR) {
            this.toastService.error(this.translateService.instant('login.messages.error.gatewayTimeout'));
        } else if (response.error.detail !== 'userManagement.error.blocked') {
            this.toastService.error(this.translateService.instant('login.messages.error.authentication'));
        } else {
            this.toastService.error(this.translateService.instant(response.error.detail));
        }
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

}
