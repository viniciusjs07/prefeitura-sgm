import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {User} from 'app/core/user/user.model';
import {UserService} from 'app/core/user/user.service';
import {
    ADMIN,
    ADMIN_CANNOT_BE_EDITED,
    ADMIN_PROFILE_CANNOT_BE_EDITED,
    FORM,
    INTERNAL_SERVER_ERROR,
    INTERNAL_SERVER_ERROR_2,
    MAX_SIZE,
    MAX_SIZE_EMAIL,
    MAX_SIZE_LOGIN,
    MAX_SIZE_PASSWORD, OLD_PASSWORD, PASSWORD_NAME,
    PASSWORD_TYPE,
    PATTERN_EMAIL,
    UNAUTHORIZED_ERROR,
} from 'app/app.constants';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {IProfile, Profile} from 'app/core/profile/profile.model';
import {ProfileService} from "app/core/profile/profile.service";
import lodash from 'lodash';
import {LoggedUserService} from "app/core/user/logged-user.service";
import {trim} from "app/shared/util/trim-field";
import {ConnectedInternetService} from "app/core/internet-connection/connected-internet.service";
import {LoadingService} from "app/shared/loading/loading.service";

@Component({
    selector: 'sgm-user-mgmt-update',
    templateUrl: './user-management-form.component.html',
    styleUrls: ['./user-management-form-component.scss']
})
export class UserManagementFormComponent implements OnInit {

    user: User;
    originalUser: User;
    loggedUser: User;

    profiles: IProfile[];

    isSaving: boolean;
    inputPasswordType: string = PASSWORD_TYPE;

    overflowAfter = false;

    constants = {
        NAME_LENGTH: MAX_SIZE,
        LOGIN_LENGTH: MAX_SIZE_LOGIN,
        EMAIL_LENGTH: MAX_SIZE_EMAIL,
        PASSWORD: MAX_SIZE_PASSWORD,
        PATTERN: FORM.PATTERN_PASSWORD
    };

    editForm: FormGroup;

    private readonly passwordValidators = [
        Validators.minLength(FORM.MIN_LENGTH_PASSWORD),
        Validators.maxLength(FORM.MAX_LENGTH_PASSWORD),
        Validators.pattern(FORM.PATTERN_PASSWORD)
    ];

    createEditForm() {
        this.editForm = this.fb.group({
            id: [null],
            login: [{
                value: '',
                disabled: this.user.superUser
            }, [Validators.required, Validators.minLength(FORM.MIN_LENGTH), Validators.maxLength(FORM.MIN_LENGTH_USER), Validators.pattern('^[_.@A-Za-z0-9-]*')]],
            firstName: [{
                value: '',
                disabled: this.user.superUser
            }, [Validators.required, Validators.minLength(FORM.MIN_LENGTH), Validators.maxLength(FORM.MIN_LENGTH_USER), Validators.pattern('.*[^ ].*')]],
            lastName: [{
                value: '',
                disabled: this.user.superUser
            }, [Validators.required, Validators.minLength(FORM.MIN_LENGTH_DEFAULT), Validators.maxLength(FORM.MIN_LENGTH_USER), Validators.pattern('.*[^ ].*')]],
            email: [{
                value: '',
                disabled: this.user.superUser
            }, [Validators.pattern(PATTERN_EMAIL)]],
            password: ['', this.passwordValidators],
            confirmPassword: ['', this.passwordValidators],
            langKey: [],
            profiles: ['', Validators.required]
        });
    }

    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfileService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly toastService: ToastrService,
        private readonly translateService: TranslateService,
        private readonly loggedUserService: LoggedUserService,
        private readonly internetConnection: ConnectedInternetService,
        private readonly loadingService: LoadingService
    ) {
        this.profiles = [];
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        this.route.data.subscribe(({user}) => {
            this.user = user.body ? user.body : user;
            this.originalUser = lodash.cloneDeep(this.user);
            this.createEditForm();
            this.updateForm(this.user);
        }, (error) => {
            this.loadingService.stop();
        });
        this.getProfiles();
        this.loggedUserService.loggedUserCast.subscribe((user: User) => {
            this.loggedUser = user;
        }, (error) => {
            this.loadingService.stop();
        });
    }

    getProfiles(page = 0, profiles = []) {
        this.profileService.query({size: 50, page}).subscribe((response) => {
            const newProfiles = response.body.content.map((json) => new Profile(json.id, json.name, json.description, json.authorities));
            profiles.push(...newProfiles);
            if (response.body.last) {
                this.profiles = profiles;
            } else {
                this.getProfiles(page + 1, profiles);
            }
            this.loadingService.stop();
        }, (error) => {
            this.onErrorRequest(error);
        });
    }


    private onErrorRequest(response) {
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('support.error.internetError'));
        } else {
            const message = response.error.detail;
            if (response.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
                this.toastService.error(this.translateService.instant('support.error.gatewayTimeout'));
            } else if (response.status === 500) {
                this.toastService.error(this.translateService.instant('support.error.gatewayTimeout'));
            } else if (response.error.message !== UNAUTHORIZED_ERROR) {
                this.toastService.error(this.translateService.instant(response.error.detail || response.error.translate));
            } else if (response.status === 401) {
                this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
            }
        }

    }

    updateForm(user: User): void {
        this.editForm.patchValue({
            id: user.id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            langKey: user.langKey,
            profiles: user.profiles
        });

        if (!user.id) {
            const validatorsWithRequired = [Validators.required, ...this.passwordValidators];
            this.editForm.get('password').setValidators(validatorsWithRequired);
            this.editForm.get('confirmPassword').setValidators(validatorsWithRequired);
        }
    }

    previousState() {
        this.router.navigate(['/entity/user']);
    }

    save() {
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
            return;
        }
        this.loadingService.setMessage(this.translateService.instant('global.messages.loadgindData'));
        this.loadingService.start();
        trim('firstName', this.editForm);
        trim('lastName', this.editForm);

        this.prepareUser(this.user);

        if (this.isInvalidForm()) {
            this.toastService.error(this.translateService.instant('userManagement.error.invalidField'));
            return;
        }

        if (lodash.isEqual(this.originalUser, this.user)) {
            this.loadingService.stop();
            this.toastService.info(this.translateService.instant('global.messages.info.noChanges'));
            this.previousState();
        } else {
            this.isSaving = true;
            if (this.user.id !== null) {
                this.userService.update(this.user).subscribe(() => this.onSaveSuccess(), (err) => this.onSaveError(err));
            } else {
                this.userService.create(this.user).subscribe(() => this.onSaveSuccess(), (err) => this.onSaveError(err));
            }
        }
    }

    private prepareUser(user: User): void {
        user.login = this.editForm.get(['login']).value;
        user.firstName = this.editForm.get(['firstName']).value.trim();
        user.lastName = this.editForm.get(['lastName']).value.trim();
        user.email = this.editForm.get(['email']).value || null;
        user.langKey = this.editForm.get(['langKey']).value;
        user.profiles = this.editForm.get(['profiles']).value;

        const newPassword = this.editForm.get(['password']).value || null;
        if (newPassword) {
            user.password = newPassword;
            user.updatePassword = true;
        } else {
            user.password = null;
        }
    }

    private onSaveSuccess() {
        this.loadingService.stop();
        if (this.user.id) {
            this.toastService.success(this.translateService.instant('userManagement.info.saveSuccess'));
            if (lodash.get(this.user, 'id') === lodash.get(this.loggedUser, 'id')) {
                this.loggedUserService.editUser(this.user);
            }
        } else {
            this.toastService.success(this.translateService.instant('userManagement.info.createSuccess'));
        }
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError(err: HttpErrorResponse) {
        this.loadingService.stop();
        if (!this.internetConnection.isInternetConnection) {
            this.toastService.error(this.translateService.instant('userManagement.error.internetError'));
            return;
        }
        const message = err.error.detail;
        this.user = {...this.originalUser};
        this.isSaving = false;
        this.showMessageError(message, err);
    }

    validateUserEmail(email): boolean {
        const splitted = email.value.split("@");
        return splitted[0].trim().length <= 2;
    }

    private showMessageError(message, err: HttpErrorResponse) {
        if (message === ADMIN_CANNOT_BE_EDITED) {
            this.toastService.error(this.translateService.instant(message));
        } else if (message === ADMIN_PROFILE_CANNOT_BE_EDITED) {
            this.toastService.error(this.translateService.instant(message));
        } else if (err.status === 504 || message === INTERNAL_SERVER_ERROR || message === INTERNAL_SERVER_ERROR_2) {
            this.toastService.error(this.translateService.instant('userManagement.error.gatewayTimeout'));
        } else if (err.status === 500) {
            this.toastService.error(this.translateService.instant('userManagement.error.gatewayTimeout'));
        } else if (err.status === 401) {
            this.toastService.error(this.translateService.instant('error.unauthorizedTokenError'));
        } else if (message === PASSWORD_NAME) {
            this.toastService.error(this.translateService.instant(message));
        } else if (message === OLD_PASSWORD) {
            this.toastService.error(this.translateService.instant(message));
        } else if (err.error.message !== UNAUTHORIZED_ERROR) {
            this.toastService.error(this.translateService.instant(err.error.message));
        }
    }

    public checkKey(event: any) {
        const newValue = event.target.value;
        event.target.value = newValue.replace(/( )/ig, '');
        this.editForm.controls['email'].setValue(newValue.replace(/( )/ig, ''));
    }


    setProfiles(data) {
        this.editForm.controls['profiles'].setValue(data);
    }

    isInvalidForm() {
        return this.editForm.invalid;
    }

    disableInput(inputName) {
        if (this.user.login === ADMIN && this.loggedUser.login === ADMIN) {
            this.editForm.controls[inputName].disable();
        } else {
            this.editForm.controls[inputName].enable();
        }
    }

    checkMaxEmail() {
        let email = this.editForm.get('email').value;
        if (email) {
            email = this.editForm.get('email').value.split('@');
            if (email !== null && (email[1] && email[1].length > 255) || (email[0] && email[0].length > 64)) {
                this.overflowAfter = true;
            } else {
                this.overflowAfter = false;
            }
        }

    }

    compareTo(item1, item2) {
        return item1 && item2 ? item1.id === item2.id : item1 === item2;
    }

    removeItemFormArray(formControl: string, entity: any): void {
        this.editForm.get(formControl).setValue(this.editForm.get(formControl).value.filter((item) =>
            item.id !== entity.id));
    }

}
