import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AccountService} from 'app/core/auth/account.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *sgmHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sgmHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
    selector: '[sgmHasAnyAuthority]'
})
export class SGMAnyAuthorityDirective {

    private authorities: string[];

    constructor
    (
        private readonly accountService: AccountService,
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainerRef: ViewContainerRef
    ) {
    }

    @Input()
    set sgmHasAnyAuthority(value: string | string[]) {

        this.authorities = typeof value === 'string' ? [value] : value;
        this.updateView();
        // Get notified each time authentication state changes.
        this.accountService.getAuthenticationState().subscribe(() => this.updateView());
    }

    private updateView(): void {
        const hasAnyAuthority = this.accountService.hasAnyAuthority(this.authorities);
        this.viewContainerRef.clear();
        if (hasAnyAuthority) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }

}
