import {ActivatedRouteSnapshot, Resolve, Route} from '@angular/router';
import {JhiResolvePagingParams} from 'ng-jhipster';
import {Injectable} from '@angular/core';
import {User} from 'app/core/user/user.model';
import {UserService} from 'app/core/user/user.service';
import {UserManagementComponent} from './user-management.component';
import {UserManagementFormComponent} from './user-management-form.component';
import {UserRouteAccessService} from "app/core/auth/user-route-access-service";

@Injectable({providedIn: 'root'})
export class UserManagementResolve implements Resolve<any> {

    constructor(private readonly service: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        const id = route.params.login ? route.params.login : null;
        if (id) {
            return this.service.find(id);
        }
        return new User();
    }
}

export const userManagementRoute: Route = {
    path: 'user',
    canActivate: [UserRouteAccessService],
    data: {
        authorities: ['ROLE_RW_USER', 'ROLE_R_USER'],
        breadcrumb: 'entity.user.main',
    },
    children: [
        {
            path: '',
            component: UserManagementComponent,
            resolve: {
                pagingParams: JhiResolvePagingParams
            },
            data: {
                pageTitle: 'userManagement.home.title',
                defaultSort: 'id,asc'
            }
        },
        {
            path: 'new',
            component: UserManagementFormComponent,
            resolve: {
                user: UserManagementResolve
            },
            data: {
                pageTitle: 'userManagement.createUser.title',
                breadcrumb: 'userManagement.createUser.title'
            }
        },
        {
            path: ':login/edit',
            component: UserManagementFormComponent,
            resolve: {
                user: UserManagementResolve
            },
            data: {
                pageTitle: 'userManagement.editUser.title',
                breadcrumb: 'userManagement.editUser.title'
            }
        }
    ]
};
