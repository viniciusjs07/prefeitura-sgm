import {Injectable} from '@angular/core';
import {flatMap} from 'rxjs/operators';
import {AccountService} from 'app/core/auth/account.service';
import {AuthServerProvider} from 'app/core/auth/auth-jwt.service';

@Injectable({providedIn: 'root'})
export class LoginService {

    constructor(
        private readonly accountService: AccountService,
        private readonly authServerProvider: AuthServerProvider
    ) {
    }

    login(credentials) {
        return this.authServerProvider.login(credentials).pipe(flatMap(() => this.accountService.identity(true)));
    }

    logout() {
        this.authServerProvider.logout().subscribe(() => {
        }, () => {
        }, () => this.accountService.authenticate(null));
    }
}
