import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAuthority} from "app/core/authority/authority.model";
import {IProfile, Profile} from "app/core/profile/profile.model";
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {HttpResponse} from '@angular/common/http';
import {ProfileService} from "app/core/profile/profile.service";
import {UserService} from "app/core/user/user.service";
import {
    FORM,
    INTERNAL_SERVER_ERROR,
    INTERNAL_SERVER_ERROR_2,
    PROFILE_CANNOT_BE_UPDATED,
    UNAUTHORIZED_ERROR
} from "app/app.constants";

import lodash from 'lodash';
import {trim} from "app/shared/util/trim-field";
import {AccountService} from "app/core/auth/account.service";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";
import {LoadingService} from "app/shared/loading/loading.service";

@Component({
    selector: 'sgm-profile-form',
    templateUrl: './profile-form.component.html',
    styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

    authorities: IAuthority[];

    profile: IProfile;
    private originalProfile: IProfile;
    isSaving: boolean;

    constants = {
        NAME_LENGTH: FORM.MAX_LENGTH_PROFILE,
        DESCRIPTION_LENGTH: FORM.MAX_LENGTH_NAME
    };

    @Input() profileId: any;

    @Output() public listProfilePage: EventEmitter<any> = new EventEmitter();


    createForm = this.fb.group({
        id: [null],
        name: ['', [Validators.required, Validators.minLength(FORM.MIN_LENGTH), Validators.maxLength(FORM.MAX_LENGTH_PROFILE), Validators.pattern('.*[^ ].*')]],
        description: [null, [Validators.minLength(FORM.MIN_LENGTH_DEFAULT), Validators.maxLength(FORM.MAX_LENGTH_NAME)]],
        authorities: [[], [Validators.required]]
    });

    constructor(
        private readonly fb: FormBuilder,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly profileService: ProfileService,
        private readonly userService: UserService,
        private readonly accountService: AccountService,
        private readonly internetConnection: ConnectedInternetService,
        private readonly loadingService: LoadingService,
    ) {
        this.profile = new Profile();
        this.authorities = [];
    }

    ngOnInit() {
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        this.isSaving = false;
        this.getAuthorities();
        this.initProfile();
        if (this.profileId) {
            this.getProfileById();
        }

    }

    initProfile() {
        if (typeof this.profile.authorities === 'undefined') {
            this.profile.authorities = [];
        }
    }

    getProfileById() {
        this.profileService.find(this.profileId).subscribe((response) => {
            this.profile = response.body;
            this.originalProfile = lodash.cloneDeep(this.profile);

            this.createForm.patchValue({
                id: this.profile.id,
                name: this.profile.name,
                description: this.profile.description,
                authorities: this.profile.authorities,
            });
            this.auxFillAuth();
        });

    }

    save() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('profiles.error.internetError'));
            return;
        }
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        trim('name', this.createForm);
        this.prepareProfile(this.profile);
        if (this.createForm.invalid) {
            this.toastService.error(this.translateService.instant('profiles.create.error.invalidField'));
            this.loadingService.stop();
            return;
        }

        if (this.checkProfile()) {
            this.loadingService.stop();
            this.toastService.info(this.translateService.instant('global.messages.info.noChanges'));
            this.previousState();
        } else {
            this.isSaving = true;
            if (this.profile.id !== null) {
                this.profileService.update(this.profile).subscribe(() => this.onSaveSuccess(), (err) => this.onSaveError(err));
            } else {
                this.profileService.create(this.profile).subscribe(() => this.onSaveSuccess(), (err) => this.onSaveError(err));
            }
        }
    }


    prepareProfile(profile: Profile): void {
        profile.name = this.createForm.get(['name']).value;
        profile.description = this.createForm.get('description').value ? this.createForm.get('description').value.trim() : this.createForm.get('description').value;
        profile.authorities = this.createForm.get(['authorities']).value.map((item) => ({name: item.name}));
    }

    getAuthorities() {
        this.userService.authorities({
            isUnPaged: true
        }).subscribe(
            (res: HttpResponse<IAuthority[]>) =>
                this.onSuccess(res.body),
            (error) => this.onError(error)
        );
    }

    private onSuccess(data) {
        this.loadingService.stop();
        this.authorities = data.content;
    }

    private onSaveSuccess() {
        this.loadingService.stop();
        if (this.profile.id) {
            this.toastService.success(this.translateService.instant('profiles.messages.savesuccess'));
        } else {
            this.toastService.success(this.translateService.instant('profiles.messages.createsuccess'));
        }
        this.isSaving = false;
        this.previousState();
    }


    private onSaveError(response) {
        this.isSaving = false;
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('profiles.error.internetError'));
        } else {
            const message = response.error.detail;
            this.showMessageError(message, response);
        }
    }

    private showMessageError(message, err) {
        if (message === PROFILE_CANNOT_BE_UPDATED) {
            this.toastService.error(this.translateService.instant(message));
        } else if (err.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
            this.toastService.error(this.translateService.instant('profiles.error.gatewayTimeout'));
        } else if (err.status === 500) {
            this.toastService.error(this.translateService.instant('profiles.error.gatewayTimeout'));
        } else if (err.error.message !== UNAUTHORIZED_ERROR) {
            this.toastService.error(this.translateService.instant(err.error.message));
        } else if (err.status === 401) {
            this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
        }
    }

    onError(response) {
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('profiles.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('profiles.error.gatewayTimeout'));
            } else if (response.status === 500) {
                this.toastService.error(this.translateService.instant('profiles.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            } else {
                this.toastService.error(this.translateService.instant('authorities.messages.error'));
            }
        }
    }

    previousState() {
        this.listProfilePage.emit();

    }

    auxFillAuth() {
        for (const authority of this.authorities) {
            for (const authorityProfile of this.profile.authorities) {
                if (authority.name === authorityProfile.name) {
                    authority.checked = true;
                }
            }
        }
    }

    checkProfile(): boolean {
        return lodash.isEqual(this.profile, this.originalProfile);
    }

    disabledBorder(): boolean {
        return !this.accountService.hasAnyAuthority(['ROLE_RW_PROFILE']);

    }

    compareTo(item1, item2) {
        return item1 && item2 ? item1.name === item2.name : item1 === item2;
    }


    removeItemFormArray(formControl: string, entity: any): void {
        this.createForm.get(formControl).setValue(this.createForm.get(formControl).value.filter((item) =>
            item.name !== entity.name));
    }
}
