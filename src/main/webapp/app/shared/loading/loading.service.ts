import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {


  private readonly isSaving = new BehaviorSubject<boolean>(false);
  isSavingCast = this.isSaving.asObservable();

  private readonly message = new BehaviorSubject<string>('');
  messageCast = this.message.asObservable();

  constructor() { }

  start() {
    this.isSaving.next(true);
  }

  stop() {
    this.isSaving.next(false);
  }

  setMessage(value: string) {
    this.message.next(value);
  }

}
