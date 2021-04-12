import {TownHallService} from '../../core/service/town-hall.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Route} from '@angular/router';
import {Service} from '../../core/service/service.model';
import {CitizenComponent} from "app/entities/citizen/citizen.component";
import {UserRouteAccessService} from "app/core/auth/user-route-access-service";
import {ServiceFormComponent} from "app/entities/service/service-form.component";
import {CitizenViewComponent} from "app/entities/citizen/view/citizen-view.component";

@Injectable({providedIn: 'root'})
export class CitizenResolve implements Resolve<any> {

    constructor(private readonly service: TownHallService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        const id = route.params.id ? route.params.id : null;
        if (id) {
            return this.service.find(id);
        }
        return new Service();
    }
}

const CITIZEN_ROUTES = [
    {
        path: '',
        component: CitizenComponent,
        data: {
            breadcrumb: 'entity.citizen.title',
            pageTitle: 'entity.citizen.title',
        }
    },
    {
        path: ':id/view',
        component: CitizenViewComponent,
        resolve: {
            service: CitizenResolve
        },
        data: {
            breadcrumb: 'entity.citizen.view',
            pageTitle: 'entity.citizen.view',
        }
    }
];

export const citizenRoute: Route = {
    path: 'citizen',
    data: {
        authorities: ['ROLE_R_SERVICE', 'ROLE_RW_SERVICE', 'ROLE_R_CITIZEN'],
        pageTitle: 'entity.citizen.title',
        breadcrumb: 'entity.citizen.title',
    },
    children: CITIZEN_ROUTES,
    canActivate: [UserRouteAccessService],
};
