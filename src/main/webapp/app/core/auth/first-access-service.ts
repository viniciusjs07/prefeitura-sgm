import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'app/core/auth/account.service';
import { Observable, of } from 'rxjs';
import { PasswordChangeModalComponent } from '../../shared/password-change-modal/password-change-modal.component';
import { MAX_DAY_LAST_PASSWORD_UPDATE } from '../../app.constants';

@Injectable({providedIn: 'root'})
export class FirstAccessService implements CanActivate {

    constructor(
        private readonly accountService: AccountService,
        private readonly ngbModal: NgbModal
    ) {
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.accountService.identity(true).subscribe((data: any) => {
            if (data) {
               const lastPasswordUpdate = new Date(data.lastPasswordUpdate);
               const Difference_In_Time = new Date().getTime() - lastPasswordUpdate.getTime();
               const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

               if (data.onFirstPassword || Difference_In_Days > MAX_DAY_LAST_PASSWORD_UPDATE) {
                  this.ngbModal.open(PasswordChangeModalComponent, { centered: true, backdrop: 'static',
                   keyboard: false });
               }
                  this.accountService.setCurrentUser(data);
               }
        });

        return of(true);
    }
}
