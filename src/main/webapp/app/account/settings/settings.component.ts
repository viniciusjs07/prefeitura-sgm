import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "app/core/auth/account.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'sgm-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    goPageSelect: string;
    profileId: any;

    @ViewChild('profileComponent', {static: false})
    public profileComponent;

    constructor(
        private readonly accountService: AccountService,
        private readonly connectionService: ConnectedInternetService,
        private readonly toastService: ToastrService,
        readonly translateService: TranslateService
    ) {
    }

    ngOnInit() {
        if (!this.connectionService.isInternetConnection) {
            this.toastService.error(this.translateService.instant('category.error.internetError'));
        } else {
            if (this.accountService.hasAnyAuthority(['ROLE_RW_PROFILE', "ROLE_R_PROFILE"])) {
                this.goToProfile();
            }
        }
    }

    goToAuthority() {
        this.goPageSelect = 'authorityPage';
    }

    goToProfile() {
        this.goPageSelect = 'listProfile';
        this.profileId = null;
    }

    goToCreateProfile() {
        this.goPageSelect = 'createProfile';
    }

    goToEditProfile(id) {
        this.profileId = id;
        this.goToCreateProfile();
    }
}
