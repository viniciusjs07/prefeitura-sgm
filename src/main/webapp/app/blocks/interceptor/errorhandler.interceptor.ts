import {Injectable} from '@angular/core';
import {JhiEventManager} from 'ng-jhipster';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor(private readonly eventManager: JhiEventManager) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(
            () => {
            },
            (err: any) => {
                if (err instanceof HttpErrorResponse && !(err.status === 401 && (err.message === '' || (err.url && err.url.includes('api/account'))))) {
                    this.eventManager.broadcast({name: 'sgmSystem.httpError', content: err});
                }
            }
        ));
    }
}
