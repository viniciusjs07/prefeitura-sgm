import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FORM, HIDE_PASSWORD, LOGIN_ROUTER, MAX_SIZE_PASSWORD, PASSWORD_TYPE, SHOW_PASSWORD, TEXT_TYPE } from '../../app.constants';
import { UserService } from '../../core/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoginService } from '../../core/login/login.service';
@Component({
  selector: 'sgm-password-change-modal',
  templateUrl: './password-change-modal.component.html',
  styleUrls: ['./password-change-modal.component.scss'],
})
export class PasswordChangeModalComponent implements OnInit {

  passwordform: FormGroup;
  inputPasswordType: string = PASSWORD_TYPE;
  eyeIcon: string = HIDE_PASSWORD;
  isShowPassword: boolean;

  private readonly passwordValidators = [
    Validators.required,
    Validators.minLength(FORM.MIN_LENGTH_PASSWORD),
    Validators.maxLength(FORM.MAX_LENGTH_PASSWORD),
    Validators.pattern(FORM.PATTERN_PASSWORD),
  ];

  constants = {
    PASSWORD: MAX_SIZE_PASSWORD,
    PATTERN: FORM.PATTERN_PASSWORD
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly toastService: ToastrService,
    private readonly activeModal: NgbActiveModal,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly loginService: LoginService
  ) {
    this.createForm();
  }

  ngOnInit() { }

  changePassword(): void {
    this.userService.changePassword(this.passwordform.value).subscribe((res: any) => {
      this.close();
      this.toastService.success(this.translateService.instant('userManagement.changePassword.success'));
    }, (error) => {
      this.toastService.error(this.translateService.instant(error.error.detail));
    });
  }

  createForm() {
    this.passwordform = this.fb.group({
      newPassword: ['', this.passwordValidators],
      confirmPassword: ['', this.passwordValidators],
    });
  }

  close() {
    this.activeModal.dismiss("cancel");
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
    if (this.isShowPassword) {
      this.inputPasswordType = TEXT_TYPE;
      this.eyeIcon = SHOW_PASSWORD;
    } else {
      this.inputPasswordType = PASSWORD_TYPE;
      this.eyeIcon = HIDE_PASSWORD;
    }
  }

  goToLoginScreen(): void {
    this.close();
    this.loginService.logout();
    this.router.navigate([LOGIN_ROUTER]);
  }
}
