import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {HttpTestingController} from '@angular/common/http/testing';
import {NgSelectModule} from '@ng-select/ng-select';
import {SGMAdminCoreTestModule} from "../../test.module";
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {JhiAlertService, JhiLanguageService, JhiEventManager} from 'ng-jhipster';
import {ModalService} from "app/core/modal/modal.service";
import {LoginComponent} from "app/login/login.component";
import {LoginService} from "app/core/login/login.service";
import {of} from 'rxjs';
import {StateStorageService} from "app/core/auth/state-storage.service";
import {SessionStorageService} from 'ngx-webstorage';


describe('Login Component Tests', () => {

    let comp: LoginComponent,
        fixture: ComponentFixture<LoginComponent>,
        httpMock: HttpTestingController,
        activatedRoute: ActivatedRoute,
        service: LoginService,
        toastService: ToastrService,
        alertService: JhiAlertService,
        modalService: ModalService,
        eventManager: JhiEventManager,
        sateStorageService: StateStorageService,
        sessionStorage: SessionStorageService,
        languageService: JhiLanguageService,
        router: Router;

    beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SGMAdminCoreTestModule, NgSelectModule],
                declarations: [LoginComponent]
            })
                .overrideTemplate(LoginComponent, '')
                .compileComponents();


        });

    beforeEach(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(LoginComponent);
        comp = fixture.componentInstance;
        service = fixture.debugElement.injector.get(LoginService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        router = fixture.debugElement.injector.get(Router);
        httpMock = TestBed.get(HttpTestingController);
        toastService = fixture.debugElement.injector.get(ToastrService);
        alertService = fixture.debugElement.injector.get(JhiAlertService);
        modalService = fixture.debugElement.injector.get(ModalService);
        eventManager = fixture.debugElement.injector.get(JhiEventManager);
        sateStorageService = fixture.debugElement.injector.get(StateStorageService);
        sessionStorage = fixture.debugElement.injector.get(SessionStorageService);
        languageService = fixture.debugElement.injector.get(JhiLanguageService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('showPassword should', () => {
        beforeEach(() => {
            comp.isShowPassword = false
        });

        it('show or hide password user', () => {
            expect(comp.eyeIcon).toEqual('eye-slash');
            comp.showPassword();
            expect(comp.eyeIcon).toEqual('eye');
            comp.showPassword();
            expect(comp.eyeIcon).toEqual('eye-slash');
        });

    });

});
