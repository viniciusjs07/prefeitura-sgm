import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class CheckTenantInterceptor implements HttpInterceptor {

    constructor(
        private readonly localStorage: LocalStorageService,
        private readonly sessionStorage: SessionStorageService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const xtenantId = this.localStorage.retrieve('tenantid') || this.sessionStorage.retrieve('tenantid');

        if (!request.url.toString().includes('/api/tenants/') && xtenantId !== null) {

            return next.handle(request);
        } else {
            return next.handle(request);
        }


    }
}
