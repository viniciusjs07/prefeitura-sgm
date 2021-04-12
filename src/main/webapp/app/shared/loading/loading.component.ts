import {Component, OnInit} from '@angular/core';
import {LoadingService} from "app/shared/loading/loading.service";

@Component({
    selector: 'sgm-loading',
    templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {

    isSaving = false;
    message = '';

    constructor(private readonly loadingService: LoadingService) {
        this.loadingService.isSavingCast.subscribe((result: any) => {
            this.isSaving = result;
        });

        this.loadingService.messageCast.subscribe((result: any) => {
            this.message = result;
        });
    }

    ngOnInit() {
    }

}
