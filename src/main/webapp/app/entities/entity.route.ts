import {Routes} from "@angular/router";
import {UserRouteAccessService} from "../core/auth/user-route-access-service";
import {serviceRoute} from "./service/serviceRoute";
import {categoryRoute} from "./category/category.route";
import {userManagementRoute} from './user-management/user-management.route';
import {FirstAccessService} from "../core/auth/first-access-service";
import {citizenRoute} from "app/entities/citizen/citizenRoute";

export const entityState: Routes = [{
    path: 'entity',
    data: {
        pageTitle: 'global.menu.entities.main',
    },
    canActivate: [UserRouteAccessService, FirstAccessService],
    children: [
        serviceRoute,
        categoryRoute,
        userManagementRoute,
       citizenRoute]
}];
