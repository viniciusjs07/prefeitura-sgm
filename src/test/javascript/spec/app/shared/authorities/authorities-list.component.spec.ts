import {SGMAdminCoreTestModule} from './../../../test.module';
import {HttpTestingController} from '@angular/common/http/testing';
import {UserService} from 'app/core/user/user.service';
import {ITEMS_PER_PAGE} from 'app/app.constants';
import {AuthoritiesListComponent} from 'app/shared/authorities-list/authorities-list.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

describe('Authorities List', () => {

    let comp: AuthoritiesListComponent,
        fixture: ComponentFixture<AuthoritiesListComponent>,
        userService: UserService,
        httpMock: HttpTestingController;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [AuthoritiesListComponent],
            imports: [SGMAdminCoreTestModule]
        })
            .overrideTemplate(AuthoritiesListComponent, '')
            .compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthoritiesListComponent);
        comp = fixture.componentInstance;
        userService = fixture.debugElement.injector.get(UserService);
        httpMock = TestBed.get(HttpTestingController);
    });

    describe('onInit', () => {
        it('starts pagination correctly', () => {
            expect(comp.itemsPerPage).toBe(ITEMS_PER_PAGE);
            expect(comp.page).toBe(1);
        });

        it('initalize authorities and load items', () => {
            comp.ngOnInit();

            const content = [{ name: 'ROLE_USER' }];
            const req = httpMock.expectOne({ method: 'GET' });
            req.flush({
                totalElements: 1,
                content
            });

            expect(comp.authorities).toStrictEqual(content);
        });

        it('call onError when API fail to load authorities', () => {
            comp.ngOnInit();

            spyOn(comp, 'onError');

            const req = httpMock.expectOne({ method: 'GET' });
            req.flush({}, { status: 400, statusText: 'Failed on authorities' });

            expect(comp.authorities).toHaveLength(0);
            expect(comp.onError).toHaveBeenCalled();
        });
    });

    describe('loadPage', () => {
        it('should not load when requested with same page', () => {
            comp.ngOnInit();

            spyOn(comp, 'loadAll');

            comp.loadPage(comp.previousPage);

            expect(comp.loadAll).not.toHaveBeenCalled();
        });

        it('should load when requested with a different page', () => {
            comp.ngOnInit();

            spyOn(comp, 'loadAll');

            comp.loadPage(comp.previousPage + 1);

            expect(comp.loadAll).toHaveBeenCalled();
        });
    });

});

