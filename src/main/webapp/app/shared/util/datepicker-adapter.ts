/**
 * Angular bootstrap Date adapter
 */
import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
// eslint-disable-next-line no-duplicate-imports
import {Moment} from 'moment';
const moment = require('moment');
@Injectable()
export class NgbDateMomentAdapter extends NgbDateAdapter<Moment> {

    fromModel(date: Moment): NgbDateStruct {
        if (date !== null && moment.isMoment(date) && date.isValid()) {
            return {year: date.year(), month: date.month() + 1, day: date.date()};
        }
        return null;
    }

    toModel(date: NgbDateStruct): Moment {
        return date ? moment(`${date.year} - ${date.month} - ${date.day}`, 'YYYY-MM-DD') : null;
    }

}
