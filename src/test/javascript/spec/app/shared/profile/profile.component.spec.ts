import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpTestingController} from '@angular/common/http/testing';
import {NgSelectModule} from '@ng-select/ng-select';
import {SGMAdminCoreTestModule} from "../../../test.module";
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {JhiAlertService} from 'ng-jhipster';
import {ModalService} from "app/core/modal/modal.service";
import {ProfileComponent} from "app/shared/profile/profile.component";
import {ProfileService} from "app/core/profile/profile.service";
import {Profile} from "app/core/profile/profile.model";
import {PAGE_INITIAL} from "app/app.constants";


describe('Profile Component Tests', () => {

    let comp: ProfileComponent,
        fixture: ComponentFixture<ProfileComponent>,
        httpMock: HttpTestingController,
        activatedRoute: ActivatedRoute,
        service: ProfileService,
        toastService: ToastrService,
        alertService: JhiAlertService,
        modalService: ModalService,
        router: Router;

    let profile;

    beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SGMAdminCoreTestModule, NgSelectModule],
                declarations: [ProfileComponent]
            })
                .overrideTemplate(ProfileComponent, '')
                .compileComponents();

            profile = new Profile(1);
        });

    beforeEach(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(ProfileComponent);
        comp = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ProfileService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        router = fixture.debugElement.injector.get(Router);
        httpMock = TestBed.get(HttpTestingController);
        toastService = fixture.debugElement.injector.get(ToastrService);
        alertService = fixture.debugElement.injector.get(JhiAlertService);
        modalService = fixture.debugElement.injector.get(ModalService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('ngOnInit should', () => {
        it('define component properties and load items', () => {
            spyOn(comp, 'loadAll').and.returnValue(null);
            comp.ngOnInit();
            expect(comp.profiles).toEqual([]);
            expect(comp.authorities).toEqual([]);
        });

        // it('define component properties and load items', (done) => {
        //     const subject = new Subject();
        //     activatedRoute.data = subject.asObservable();
        //     spyOn(comp, 'loadAll').and.returnValue(null);
        //     comp.ngOnInit();
        //     activatedRoute.data.subscribe(() => {
        //         expect(comp.page).toEqual(1);
        //         expect(comp.loadAll).toHaveBeenCalled();
        //         done();
        //     });
        //     subject.next({ pagingParams: { page: 1 } });
        // });

    });

    describe('loadAll should', () => {
        beforeEach(() => {
            comp.itemsPerPage = 15;
            comp.page = 1;
            comp.totalItems = 0;
            comp.profiles = [];
        });

        it('load all items correctly when there are no items', () => {
            spyOn(toastService, 'info');
            comp.loadAll();
            httpMock.expectOne({ method: 'GET' })
                .flush({
                    content: [],
                    totalElements: 0
                });
            expect(toastService.info).toHaveBeenCalled();
            expect(comp.totalItems).toBe(0);
        });


        it('load all items correctly', () => {
            comp.loadAll();
            httpMock.expectOne({ method: 'GET' })
                .flush({
                    content: [],
                    totalElements: 1
                });
            expect(comp.totalItems).toBe(1);
        });


        it('load all items correctly', () => {
            comp.loadAll();
            httpMock.expectOne({ method: 'GET' })
                .flush({
                    content: [profile],
                    totalElements: 1
                });
            expect(comp.totalItems).toBe(1);
            expect(comp.profiles).toStrictEqual([profile])
        });

        it('load all error flow', () => {
            spyOn(toastService, 'error');

            comp.loadAll();

            const mockErrorResponse = { status: 400, statusText: 'Bad Request'};
            const data = 'Invalid request parameters';

            httpMock.expectOne({method: 'GET'}).flush(data, mockErrorResponse);

            expect(comp.totalItems).toBe(0);
            expect(comp.profiles).toStrictEqual([]);
            expect(toastService.error).toHaveBeenCalled();
        });
    });

    describe('loadPage should', () => {
        it('not load when same page is requested', () => {
            spyOn(comp, 'loadAll').and.returnValue(null);
            comp.loadPage(comp.page);
            expect(comp.previousPage).toEqual(comp.page);
        });

        it('load when a different page is requested', () => {
            spyOn(comp, 'loadAll').and.returnValue(null);
            comp.loadPage(comp.page + 1);
            expect(comp.previousPage).toEqual(comp.page + 1);
        });
    });

    describe('setFilter should', () => {
        it('change page to init page', () => {
            spyOn(comp, 'loadAll').and.returnValue(null);
            comp.setFilter('');
            expect(comp.page).toEqual(PAGE_INITIAL);
        });
    });

});
