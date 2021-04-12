import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgm-modal-action',
    templateUrl: './modal-action.component.html'
})
export class ModalActionComponent implements OnInit {

    title: string;
    body: string;

    constructor(private readonly activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

    confirm() {
        this.activeModal.close('confirm');
    }

    cancel() {
        this.activeModal.dismiss('cancel');
    }

}
