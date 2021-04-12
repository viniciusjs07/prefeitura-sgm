import {TownHallService} from '../../core/service/town-hall.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Route} from '@angular/router';
import {ServiceComponent} from './service.component';
import {ServiceFormComponent} from './service-form.component';
import {Service} from '../../core/service/service.model';
import {UserRouteAccessService} from "app/core/auth/user-route-access-service";

@Injectable({providedIn: 'root'})
export class ServiceResolve implements Resolve<any> {

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

const SERVICE_ROUTES = [
    {
        path: '',
        component: ServiceComponent,
        data: {
            breadcrumb: '',
            pageTitle: 'product.home.title',
        }
    },
    {
        path: 'new',
        component: ServiceFormComponent,
        resolve: {
            service: ServiceResolve
        },
        data: {
            breadcrumb: 'entity.product.register',
            pageTitle: 'entity.product.register',
        }
    },
    {
        path: ':id/edit',
        component: ServiceFormComponent,
        resolve: {
            service: ServiceResolve
        },
        data: {
            breadcrumb: 'entity.product.edit',
            pageTitle: 'entity.product.edit',
        }
    }
];

export const serviceRoute: Route = {
    path: 'service',
    data: {
        authorities: ['ROLE_R_SERVICE', 'ROLE_RW_SERVICE'],
        pageTitle: 'entity.product.main',
        breadcrumb: 'entity.product.main',
    },
    children: SERVICE_ROUTES,
    canActivate: [UserRouteAccessService],
};
