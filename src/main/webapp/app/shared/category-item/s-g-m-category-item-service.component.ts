import {Category} from 'app/core/category/category.model';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'sgm-category-item',
    templateUrl: './s-g-m-category-item-service.component.html',
    styleUrls: ['./s-g-m-category-item-service.component.scss']
})
export class SGMCategoryItemServiceComponent implements OnInit {

    editing = false;
    @Input()
    category: Category;

    @Input()
    parent: Category;

    @Output()
    onSave = new EventEmitter<Category>();

    @Input()
    selected = false;

    @Input()
    reader = false;


    constructor() {
    }

    ngOnInit() {
    }

}
