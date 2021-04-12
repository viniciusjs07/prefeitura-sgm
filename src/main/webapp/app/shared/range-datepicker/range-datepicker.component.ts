import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sgm-range-datepicker',
  templateUrl: './range-datepicker.component.html',
  styleUrls: ['./range-datepicker.component.scss']
})
export class RangeDatepickerComponent implements OnInit {

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  open = false;

  @Output()
  onSelect = new EventEmitter();

  @Input()
  minDate: Date;

  @Input()
  maxDate: Date;

  @Input()
  openTo: ('right' | 'left') = 'left';

  _minDate: NgbDate;
  _maxDate: NgbDate;

  constructor(private readonly calendar: NgbCalendar) { }

  ngOnInit(): void {
    this._maxDate = new NgbDate(this.maxDate.getFullYear(), this.maxDate.getMonth() + 1, this.maxDate.getDate());
    this._minDate = new NgbDate(this.minDate.getFullYear(), this.minDate.getMonth() + 1, this.minDate.getDate());

    this.toDate = this._maxDate
    const weekAgo = this.calendar.getPrev(this._maxDate, 'm', 3);
    this.fromDate = weekAgo.before(this._minDate) ? this._minDate : weekAgo;
  }

  isInvalid(date: NgbDate) {
    return date.after(this._maxDate) || date.before(this._minDate);
  }

  onDateSelection(date: NgbDate) {
    if (!this.isInvalid(date)) {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        this.toDate = date;
        this.open = false;
        this.onSelect.emit({startDate: this.fromDate, endDate: this.toDate});
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  getDateStr() {
    let str = '';
    if (this.fromDate) {
      str += `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    }

    str += ' - ';

    if (this.toDate) {
      str += `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
    }

    return str;
  }
}
