import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'sgm-toggle-button',
    templateUrl: './s-g-m-toggle-button.component.html',
    styleUrls: ['./s-g-m-toggle-button.component.scss']
})
export class SGMToggleButtonComponent implements OnInit {

    @Input()
    activated: boolean;

    @Input()
    disabledToggle = false;

    @Output() public toggleAction: EventEmitter<any> = new EventEmitter();


    constructor() {
    }

    ngOnInit() {
    }

    action() {
        this.toggleAction.emit();
    }
}
