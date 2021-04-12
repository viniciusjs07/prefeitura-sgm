import {Directive, Input, ViewContainerRef, TemplateRef} from '@angular/core';

@Directive({
    selector: '[sgmNgElse]'
})
export class NgElseDirective {

    @Input() set smgNgElse(condition: boolean) {
        if (!condition) {
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        } else {
            this._viewContainerRef.clear();
        }
    }

    constructor(
        private readonly _viewContainerRef: ViewContainerRef,
        private readonly _templateRef: TemplateRef<any>
    ) {
    }

}
