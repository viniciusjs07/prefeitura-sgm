import {DEBOUNCE_TIME} from 'app/app.constants';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {Subject} from 'rxjs';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'sgm-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @Output()
    public modelChange: EventEmitter<string> = new EventEmitter();

    @Input()
    public placeholder = '';

    private readonly filterStream: Subject<string> = new Subject();
    public filter: string = null;

    textArray: any[] = [];

    constructor() {
    }

    ngOnInit() {
        this.filterStream.asObservable().pipe(debounceTime(DEBOUNCE_TIME)).subscribe((filter: string) => {
            if (filter.trim().length !== 0 || !this.textArray.length) {
                this.filter = filter;
                this.modelChange.emit(filter);
            }
        });
    }

    changeFilter(input) {
        const text = input.target.value.trim();
        this.textArray = input.target.value.split('');
        if (text.length < 3 && text.length > 0) {
            return;
        }
        this.filterStream.next(text);
    }
}
