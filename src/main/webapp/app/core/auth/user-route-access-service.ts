import {Injectable, isDevMode} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {AccountService} from 'app/core/auth/account.service';
import {StateStorageService} from './state-storage.service';
import {decideRoute} from "app/shared/util/decide-router";

@Injectable({providedIn: 'root'})
export class UserRouteAccessService implements CanActivate {

    constructor(
        private readonly router: Router,
        private readonly accountService: AccountService,
        private readonly stateStorageService: StateStorageService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // eslint-disable-next-line prefer-destructuring
        const authorities = route.data['authorities'];
        // We need to call the checkLogin / and so the accountService.identity() function, to ensure,
        // that the client has a principal too, if they already logged in by the server.
        // This could happen on a page refresh.
        return this.checkLogin(authorities, state.url);
    }

    checkLogin(authorities: string[], url: string): Observable<boolean> {
        return this.accountService.identity().pipe(map((account) => {
            if (!authorities || authorities.length === 0) {
                return true;
            }
            if (account) {
                const hasAnyAuthority = this.accountService.hasAnyAuthority(authorities);
                if (hasAnyAuthority) {
                    return true;
                }
                if (isDevMode()) {
                    console.error('User has not any of required authorities: ', authorities);
                }
                this.router.navigate(['accessdenied']);
                setTimeout(() => {
                    this.router.navigate([decideRoute(this.accountService)]);
                }, 3000);
                return false;
            }

            this.stateStorageService.storeUrl(url);
            this.router.navigate(['']).then(() => {
                // only show the login dialog, if the user hasn't logged in yet
                if (!account) {
                    this.router.navigate(['/login']);
                }
            });
            return false;
        }));
    }
}
