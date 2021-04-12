import {AccountService} from 'app/core/auth/account.service';
import {AfterViewInit, Attribute, Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import {LanguagesEnum} from "app/core/language/language.model";

@Directive({
    selector: '[sgmReadonly]'
})
export class ReadOnlyFormDirective implements AfterViewInit, OnChanges {

    @Input()
    public currentLang: LanguagesEnum;

    constructor(
        @Attribute('sgmReadonly') public role: string,
        private readonly el: ElementRef,
        private readonly renderer: Renderer2,
        private readonly accountService: AccountService
    ) {
    }

    ngOnChanges(changes): void {
    }

    ngAfterViewInit() {
        this.checkForAuth(this.role);
    }

    private checkForAuth(auth) {
        this.accountService.identity().subscribe((data) => {
            const authorities = data.authorities || [];
            const hasAuth = authorities.map((authority) => authority.name).includes(auth);

            if (!hasAuth) {
                this.disableFields();
            }
        });
    }

    private disableFields() {
        for (let index = 0; this.el.nativeElement[index]; index++) {
            const element = this.el.nativeElement[index];

            const isCancelButton = element.type === 'button';
            const isSubmitButton = element.type === 'submit';
            const isNgSelectInput = element.tagName === 'INPUT' && element.attributes.role && element.attributes.role.value === 'combobox';

            const setAsDisabled = (element) => {
                this.renderer.setAttribute(element, 'disabled', 'true');
                this.renderer.setAttribute(element, 'required', 'false');
                this.renderer.setStyle(element, 'border-left-color', 'lightgray');
            };

            if (!isCancelButton) {
                if (isSubmitButton) {
                    this.renderer.setStyle(element, 'display', 'none');
                } else if (isNgSelectInput) {
                    let parent = element.parentElement;
                    while (parent) {
                        this.renderer.setStyle(parent, 'pointer-events', 'none');
                        if (parent.tagName === 'NG-SELECT') {
                            setAsDisabled(parent);
                            break;
                        }
                        parent = parent.parentElement;
                    }
                } else {
                    setAsDisabled(element);
                }
            }
        }
    }

}
