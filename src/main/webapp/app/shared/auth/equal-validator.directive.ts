import {Attribute, Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
    selector: '[smgAppEqualValidator][formControlName],[smgAppEqualValidator][formControl],[smgAppEqualValidator][ngModel]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: EqualValidatorDirective,
        multi: true
    }]
})
export class EqualValidatorDirective implements Validator {

    constructor(
        @Attribute('smgAppEqualValidator') public smgAppEqualValidator: string,
        @Attribute('reverse') public reverse: string
    ) {
    }

    private get isReverse() {
        if (!this.reverse) {
            return false;
        }
        return this.reverse === 'true';
    }


    validate(control: AbstractControl): { [key: string]: any; } | null {
        const {value} = control;
        const equalValidator = control.root.get(this.smgAppEqualValidator);
        if (!value && equalValidator.value !== '' && this.smgAppEqualValidator === 'password') {
            return {required: true};
        }


        if (equalValidator) {
            if (this.isReverse) {
                if (!value && !equalValidator.value) {
                    equalValidator.setErrors(null);
                } else if (value.length && value === equalValidator.value) {
                    delete equalValidator.errors.jhiAppEqualValidator;
                    delete equalValidator.errors.validateEqual;
                    equalValidator.setErrors(null);
                } else if (value !== equalValidator.value && equalValidator.value !== '') {
                    equalValidator.setErrors({valid: false});
                } else {
                    equalValidator.setErrors({required: true});
                }
            } else {
                if (value !== equalValidator.value && equalValidator.value !== '') {
                    return {valid: false};
                }
            }
        }

        return null;
    }
}
