import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

import {LoginService} from 'app/core/login/login.service';
import {StateStorageService} from 'app/core/auth/state-storage.service';
import {LOGIN_ROUTER} from "app/app.constants";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

    constructor(
        private readonly loginService: LoginService,
        private readonly stateStorageService: StateStorageService,
        private readonly router: Router,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(() => {
        }, (err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401 && err.url && !err.url.includes('api/authenticate')) {
                this.stateStorageService.storeUrl(window.location.pathname);
                this.loginService.logout();
                this.router.navigate([LOGIN_ROUTER]);
            }
        }));
    }
}
