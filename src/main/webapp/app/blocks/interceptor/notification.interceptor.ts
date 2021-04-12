import {JhiAlertService} from 'ng-jhipster';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {

    constructor(private readonly alertService: JhiAlertService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                const arr = event.headers.keys();
                let alert = null;
                let alertParams = null;
                arr.forEach((entry) => {
                    if (entry.toLowerCase().endsWith('app-alert')) {
                        alert = event.headers.get(entry);
                    } else if (entry.toLowerCase().endsWith('app-params')) {
                        alertParams = event.headers.get(entry);
                    }
                });
                if (alert && typeof alert === 'string') {
                    this.alertService.success(alert, {param: alertParams}, null);
                }
            }
        }));
    }

}
