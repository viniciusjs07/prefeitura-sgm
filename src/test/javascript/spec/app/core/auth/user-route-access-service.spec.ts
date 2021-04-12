import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed, tick, fakeAsync} from '@angular/core/testing';
import {JhiDateUtils, JhiLanguageService} from 'ng-jhipster';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {MockLanguageService} from '../../../helpers/mock-language.service';
import {UserRouteAccessService} from "app/core/auth/user-route-access-service";
import {MockRouter} from "../../../helpers/mock-route.service";
import {Router} from '@angular/router';
import {AccountService} from "app/core/auth/account.service";
import { of } from 'rxjs';
import has = Reflect.has;

describe('User Access Service', () => {

    let service: UserRouteAccessService,
        serviceAccount: AccountService;

    const AUTH_USER = Object.freeze({ name: 'ROLE_USER' });
    const AUTH_ADMIN = Object.freeze({ name: 'ROLE_ADMIN' });

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxWebstorageModule.forRoot(),
            ],
            providers: [
                JhiDateUtils,
                {
                    provide: JhiLanguageService,
                    useClass: MockLanguageService
                },
                {
                    provide: Router,
                    useClass: MockRouter
                }
            ]
        });
        service = TestBed.get(UserRouteAccessService);
        serviceAccount = TestBed.get(AccountService);
    });

    describe('Service methods', () => {

        describe('checkLogin for url admin/user-management', () => {

            it('should return false', fakeAsync (() => {
                let hasAuthority = true;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_PROFILE',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_USER', "ROLE_R_USER"],'/admin/user-management').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeFalsy();
            }));

            it('should return true', fakeAsync (() => {
                let hasAuthority = false;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_USER',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_USER', "ROLE_R_USER"],'/admin/user-management').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeTruthy();
            }));

        });
        describe('checkLogin for url entity/product', () => {

            it('should return false', fakeAsync (() => {
                let hasAuthority = true;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_PROFILE',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_SERVICE', "ROLE_R_SERVICE"],'/entity/service').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeFalsy();
            }));

            it('should return true', fakeAsync (() => {
                let hasAuthority = false;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_R_SERVICE',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_SERVICE', "ROLE_R_SERVICE"],'/entity/service').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeTruthy();
            }));

        });
        describe('checkLogin for url account/settings', () => {

            it('should return false', fakeAsync (() => {

                let hasAuthority = true;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_USER',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_PROFILE', "ROLE_R_PROFILE"],'account/settings').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeFalsy();
            }));

            it('should return true', fakeAsync (() => {
                let hasAuthority = false;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_PROFILE',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_PROFILE', "ROLE_R_PROFILE"],'account/settings').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeTruthy();
            }));

        });
        describe('checkLogin for url admin/solution', () => {

            it('should return false', fakeAsync (() => {

                let hasAuthority = true;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_USER',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_SOLUTION', "ROLE_R_SOLUTION"],'admin/solution').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeFalsy();
            }));

            it('should return true', fakeAsync (() => {
                let hasAuthority = false;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_SOLUTION',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_SOLUTION', "ROLE_R_SOLUTION"],'admin/solution').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeTruthy();
            }));

        });
        describe('checkLogin for url admin/support', () => {

            it('should return false', fakeAsync (() => {

                let hasAuthority = true;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_RW_USER',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_SUPPORT', "ROLE_R_SUPPORT"],'admin/support').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick(Infinity);
                expect(hasAuthority).toBeFalsy();
            }));

            it('should return true', fakeAsync (() => {
                let hasAuthority = false;

                spyOn(serviceAccount, 'identity').and.returnValue(of({}));

                serviceAccount.authenticate({
                    authorities: [
                        {
                            id: 1,
                            name: 'ROLE_R_SUPPORT',
                            description: 'uma authority',
                            checked: true
                        }
                    ]
                });

                service.checkLogin(['ROLE_RW_SUPPORT', "ROLE_R_SUPPORT"],'admin/support').subscribe((result: any) => {
                    hasAuthority = result;
                }, (error: any) => {
                    fail();
                });
                tick();
                expect(hasAuthority).toBeTruthy();
            }));

        });

    });

});
