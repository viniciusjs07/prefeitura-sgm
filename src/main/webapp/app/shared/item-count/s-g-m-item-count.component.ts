import {Component, Input} from '@angular/core';
import {JhiConfigService} from 'ng-jhipster';

/**
 * A component that will take care of item count statistics of a pagination.
 */
@Component({
    selector: 'sgm-item-count',
    templateUrl: './s-g-m-item-count.component.html',
    styleUrls: []
})
export class SGMItemCountComponent {

    /**
     *  current page number.
     */
    @Input() page: number;

    /**
     *  Total number of items.
     */
    @Input() total: number;

    /**
     *  Number of items per page.
     */
    @Input() itemsPerPage: number;

    /**
     * True if the generated application use i18n
     */
    i18nEnabled: boolean;

    /**
     * "translate-values" JSON of the template
     */
    i18nValues() {
        const totalPages = Math.ceil(this.total / this.itemsPerPage);
        return {first: this.page, second: totalPages, total: this.total};
    }

    constructor(config: JhiConfigService) {
        this.i18nEnabled = config.CONFIG_OPTIONS.i18nEnabled;
    }

}
