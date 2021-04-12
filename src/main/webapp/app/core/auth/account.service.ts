import {Injectable} from '@angular/core';
import {JhiLanguageService} from 'ng-jhipster';
import {SessionStorageService} from 'ngx-webstorage';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError, shareReplay, tap} from 'rxjs/operators';

import {SERVER_API_URL} from 'app/app.constants';
import {Account} from 'app/core/user/account.model';
import { IUser } from './../user/user.model';

@Injectable({providedIn: 'root'})
export class AccountService {

    private userIdentity: Account;
    private authenticated = false;
    private readonly authenticationState = new Subject<any>();
    private accountCache$: Observable<Account>;
    private currentUser = new BehaviorSubject({});

    constructor(
        private readonly languageService: JhiLanguageService,
        private readonly sessionStorage: SessionStorageService,
        private readonly http: HttpClient
    ) {
    }

    fetch(): Observable<Account> {
        return this.http.get<Account>(`${SERVER_API_URL}api/account`);
    }

    save(account: Account): Observable<Account> {
        return this.http.post<Account>(`${SERVER_API_URL}api/account`, account);
    }

    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }

    hasAnyAuthority(authorities: string[] | string): boolean {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        if (!Array.isArray(authorities)) {
            authorities = [authorities];
        }

        return this.userIdentity.authorities.some((userAuth) => authorities.includes(userAuth.name));
    }

    identity(force = false): Observable<Account> {
        if (force || !this.authenticated) {
            this.accountCache$ = null;
        }
        if (!this.accountCache$) {
            this.accountCache$ = this.fetch().pipe(
                catchError(() => {
                    return of(null);
                }),
                tap((account) => {
                    if (account) {
                        this.userIdentity = account;
                        this.authenticated = true;
                        // After retrieve the account info, the language will be changed to
                        // the user's preferred language configured in the account setting
                        if (this.userIdentity.langKey) {
                            const langKey = this.sessionStorage.retrieve('locale') || this.userIdentity.langKey;
                            this.languageService.changeLanguage(langKey);
                        }
                    } else {
                        this.userIdentity = null;
                        this.authenticated = false;
                    }
                    this.authenticationState.next(this.userIdentity);
                }),
                shareReplay()
            );
        }
        return this.accountCache$;
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    isIdentityResolved(): boolean {
        return this.userIdentity !== undefined;
    }

    getAuthenticationState(): Observable<any> {
        return this.authenticationState.asObservable();
    }

    getImageUrl(): string {
        return this.isIdentityResolved() ? this.userIdentity.image : null;
    }

    getCurrentUser(): any {
       return this.currentUser;
    }

    setCurrentUser(user: IUser) {
       return this.currentUser.next(user);
    }
}
