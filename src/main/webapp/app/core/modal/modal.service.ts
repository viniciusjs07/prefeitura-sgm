import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalActionComponent} from 'app/shared/modal/modal-action/modal-action.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(private readonly modalService: NgbModal) {
    }

    /**
     * Show modal
     * @param title
     * @param body
     */
    showModal(title, body) {
        const modalRef = this.modalService.open(ModalActionComponent, {centered: true});
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.body = body;
        return modalRef.result;
    }
}
