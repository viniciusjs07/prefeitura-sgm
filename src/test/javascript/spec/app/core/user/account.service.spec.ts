import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {SERVER_API_URL} from 'app/app.constants';
import {AccountService} from 'app/core/auth/account.service';
import {JhiDateUtils, JhiLanguageService} from 'ng-jhipster';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {MockLanguageService} from '../../../helpers/mock-language.service';

describe('Service Tests', () => {

    describe('Account Service', () => {

        let service: AccountService,
            httpMock;

        const AUTH_USER = Object.freeze({ name: 'ROLE_USER' });
        const AUTH_ADMIN = Object.freeze({ name: 'ROLE_ADMIN' });

        beforeEach(() => {

            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
                providers: [
                    JhiDateUtils,
                    {
                        provide: JhiLanguageService,
                        useClass: MockLanguageService
                    }
                ]
            });

            service = TestBed.get(AccountService);
            httpMock = TestBed.get(HttpTestingController);
        
        });

        afterEach(() => {

            httpMock.verify();
        
        });

        describe('Service methods', () => {

            it('should call /account if user is undefined', () => {

                service.identity().subscribe(() => {});
                const req = httpMock.expectOne({ method: 'GET' }),
                    resourceUrl = SERVER_API_URL + 'api/account';

                expect(req.request.url).toEqual(`${resourceUrl}`);
            
            });

            it('should call /account only once', () => {

                service.identity().subscribe(() => service.identity().subscribe(() => {}));
                const req = httpMock.expectOne({ method: 'GET' }),
                    resourceUrl = SERVER_API_URL + 'api/account';

                expect(req.request.url).toEqual(`${resourceUrl}`);
                req.flush({
                    firstName: 'John'
                });
            
            });

            it('should call /account again if user has logged out', () => {

                // Given the user is authenticated
                service.identity().subscribe(() => {});
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush({
                    firstName: 'Unimportant'
                });

                // When I call
                service.identity().subscribe(() => {});

                // Then there is no second request
                httpMock.expectNone({ method: 'GET' });

                // When I log out
                service.authenticate(null);
                // and then call
                service.identity().subscribe(() => {});

                // Then there is a new request
                httpMock.expectOne({ method: 'GET' });
            
            });

            describe('hasAnyAuthority string parameter', () => {

                it('should return false if user is not logged', () => {

                    const hasAuthority = service.hasAnyAuthority('ROLE_USER');
                    expect(hasAuthority).toBeFalsy();
                
                });

                it('should return false if user is logged and has not authority', () => {

                    service.authenticate({
                        authorities: [AUTH_USER]
                    });

                    const hasAuthority = service.hasAnyAuthority('ROLE_ADMIN');

                    expect(hasAuthority).toBeFalsy();
                
                });

                it('should return true if user is logged and has authority', () => {

                    service.authenticate({
                        authorities: [AUTH_USER]
                    });

                    const hasAuthority = service.hasAnyAuthority('ROLE_USER');

                    expect(hasAuthority).toBeTruthy();
                
                });
            
            });

            describe('hasAnyAuthority array parameter', () => {

                it('should return false if user is not logged', () => {

                    const hasAuthority = service.hasAnyAuthority(['ROLE_USER']);
                    expect(hasAuthority).toBeFalsy();
                
                });

                it('should return false if user is logged and has not authority', () => {

                    service.authenticate({
                        authorities: [AUTH_USER]
                    });

                    const hasAuthority = service.hasAnyAuthority(['ROLE_ADMIN']);

                    expect(hasAuthority).toBeFalsy();
                
                });

                it('should return true if user is logged and has authority', () => {

                    service.authenticate({
                        authorities: [AUTH_USER]
                    });

                    const hasAuthority = service.hasAnyAuthority(['ROLE_USER', 'ROLE_ADMIN']);

                    expect(hasAuthority).toBeTruthy();
                
                });
            
            });
        
        });
    
    });

});
