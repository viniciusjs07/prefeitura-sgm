import {Injectable} from '@angular/core';
import {fromEvent} from 'rxjs';
import {CONNECTION_STATUS, OFFLINE, ONLINE} from 'app/app.constants';
import {JhiEventManager} from 'ng-jhipster';

@Injectable({
    providedIn: 'root'
})
export class ConnectedInternetService {
    isOnline: boolean;

    constructor(private readonly jhiEvent: JhiEventManager) {
        this.detectInternet();
    }

    detectInternet() {
        this.isOnline = window.navigator.onLine;
        fromEvent(window, ONLINE).subscribe(() => {
            this.isOnline = true;
            this.jhiEvent.broadcast({name: CONNECTION_STATUS, content: ONLINE});
        });

        fromEvent(window, OFFLINE).subscribe(() => {
            this.isOnline = false;
            this.jhiEvent.broadcast({name: CONNECTION_STATUS, content: OFFLINE});
        });
    }

    get isInternetConnection(): boolean {
        return this.isOnline;
    }
}
