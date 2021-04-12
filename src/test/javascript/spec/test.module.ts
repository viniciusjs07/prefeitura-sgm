import {FormBuilder} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {NgModule} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
    JhiAlertService,
    JhiDataUtils,
    JhiDateUtils,
    JhiEventManager,
    JhiLanguageService,
    JhiParseLinks
} from 'ng-jhipster';

import {MockLanguageHelper, MockLanguageService} from './helpers/mock-language.service';
import {JhiLanguageHelper} from 'app/core/language/language.helper';
import {AccountService} from 'app/core/auth/account.service';
import {MockAccountService} from './helpers/mock-account.service';
import {MockActivatedRoute, MockRouter} from './helpers/mock-route.service';
import {MockActiveModal} from './helpers/mock-active-modal.service';
import {MockEventManager} from './helpers/mock-event-manager.service';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@NgModule({
    providers: [
        DatePipe,
        JhiDataUtils,
        JhiDateUtils,
        JhiParseLinks,
        {
            provide: JhiLanguageService,
            useClass: MockLanguageService
        },
        {
            provide: JhiLanguageHelper,
            useClass: MockLanguageHelper
        },
        {
            provide: JhiEventManager,
            useClass: MockEventManager
        },
        {
            provide: NgbActiveModal,
            useClass: MockActiveModal
        },
        {
            provide: ActivatedRoute,
            useValue: new MockActivatedRoute({ id: 123 })
        },
        {
            provide: Router,
            useClass: MockRouter
        },
        {
            provide: AccountService,
            useClass: MockAccountService
        },
        {
            provide: JhiAlertService,
            useClass: class FakeAlertService {
                clear() { }
                error(...params) { }
            }
        },
        {
            provide: NgbModal,
            useValue: null
        },
        {
            provide: TranslateService,
            useClass: class FakeTranslateService {
                instant(param: string) {
                    return param;
                }
            }
        },
        {
            provide: ToastrService,
            useClass: class FakeToastService {
                error(...params) { }
                info(...params) { }
                success(...params) { }
            }
        },
        {
            provide: LocalStorageService,
            useClass: class FakeLocalStorageService {
                retrive(...params) {

                }
            }
        },

        {
            provide: SessionStorageService,
            useClass: class FakeSessionStorageService {
                retrive(...params) {

                }
            }
        },
        {
            provide: FormBuilder,
            useClass: class FakeFormBuilder {
                group(config) {
                    const obj = Object.keys(config).reduce((obj, key) => {
                        obj[key] = {
                            value: null,
                            setValue(value) {
                                this.value = value;
                            },
                            markAsUntouched() { }
                        };
                        return obj;
                    }, {});

                    return {
                        get(prop) {
                            return obj[prop];
                        }
                    };
                }
            }
        },
    ],
    imports: [
        HttpClientTestingModule
    ]
})
export class SGMAdminCoreTestModule { }
