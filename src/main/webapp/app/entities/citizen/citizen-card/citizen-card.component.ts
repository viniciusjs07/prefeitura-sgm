import {Service} from '../../../core/service/service.model';
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
    selector: 'sgm-citizen-card',
    templateUrl: './citizen-card.component.html',
    styleUrls: ['./citizen-card.component.scss']
})
export class CitizenCardComponent implements OnInit {

    @Input('service')
    service: Service;

    @Output() public loadAll: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    generateCategoryTooltip() {
        return this.service.category.name;
    }

}
