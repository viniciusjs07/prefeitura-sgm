import {Component, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {JhiAlert, JhiAlertService, JhiEventManager} from 'ng-jhipster';
import {Subscription} from 'rxjs';

@Component({
    selector: 'sgm-alert-error',
    template: `
        <div class="alerts" role="alert">
            <div *ngFor="let alert of alerts" [ngClass]="setClasses(alert)">
                <ngb-alert *ngIf="alert && alert.type && alert.msg" [type]="alert.type" (close)="alert.close(alerts)">
                    <pre [innerHTML]="alert.msg"></pre>
                </ngb-alert>
            </div>
        </div>
    `
})
export class JhiAlertErrorComponent implements OnDestroy {

    alerts: any[];
    cleanHttpErrorListener: Subscription;

    constructor(
        private readonly alertService: JhiAlertService, private readonly eventManager: JhiEventManager,
        translateService: TranslateService
    ) {
        this.alerts = [];
        this.initEventManager(eventManager, translateService)

    }

    initEventManager(eventManager: JhiEventManager, translateService: TranslateService) {
        this.cleanHttpErrorListener = eventManager.subscribe('sgmSystem.httpError', (response) => {
            const httpErrorResponse = response.content;
            switch (httpErrorResponse.status) {
                case 0:
                    this.addErrorAlert('Server not reachable', 'error.server.not.reachable');
                    break;

                case 400: {
                    this.onExceptionError(httpErrorResponse, translateService);
                    break;
                }

                case 404:
                    this.addErrorAlert('Not found', 'error.url.not.found');
                    break;

                default:
                    if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
                        this.addErrorAlert(httpErrorResponse.error.message);
                    } else {
                        this.addErrorAlert(httpErrorResponse.error);
                    }
            }
        });
    }

    private onExceptionError(httpErrorResponse, translateService: TranslateService) {
        const arr = httpErrorResponse.headers.keys();
        let errorHeader = null;
        let entityKey = null;
        arr.forEach((entry) => {
            if (entry.toLowerCase().endsWith('app-error')) {
                errorHeader = httpErrorResponse.headers.get(entry);
            } else if (entry.toLowerCase().endsWith('app-params')) {
                entityKey = httpErrorResponse.headers.get(entry);
            }
        });
        if (errorHeader) {
            const entityName = translateService.instant(`global.menu.entities.${entityKey}`);
            this.addErrorAlert(errorHeader, errorHeader, {entityName});
        } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.fieldErrors) {
            this.showAlertError(httpErrorResponse, translateService);
        } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
            this.addErrorAlert(httpErrorResponse.error.message, httpErrorResponse.error.message, httpErrorResponse.error.params);
        } else {
            this.addErrorAlert(httpErrorResponse.error);
        }
    }

    private showAlertError(httpErrorResponse, translateService: TranslateService) {
        const {fieldErrors} = httpErrorResponse.error;
        for (const field of fieldErrors) {
            const fieldError = field;
            if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                fieldError.message = 'Size';
            }
            const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
            const fieldName = translateService.instant(`sgmSystem.${fieldError.objectName}.${convertedField}`);
            this.addErrorAlert(`Error on field ${fieldName}`, `error.${fieldError.message}`, {fieldName});
        }
    }

    setClasses(alert) {
        return {
            'jhi-toast': alert.toast,
            [alert.position]: true
        };
    }

    ngOnDestroy() {
        if (this.cleanHttpErrorListener !== undefined && this.cleanHttpErrorListener !== null) {
            this.eventManager.destroy(this.cleanHttpErrorListener);
            this.alerts = [];
        }
    }

    addErrorAlert(message, key?, data?) {
        message = key && key !== null ? key : message;

        const newAlert: JhiAlert = {
            type: 'danger',
            msg: message,
            params: data,
            timeout: 5000,
            toast: this.alertService.isToast(),
            scoped: true
        };
        this.alerts.push(this.alertService.addAlert(newAlert, this.alerts));
    }

}
