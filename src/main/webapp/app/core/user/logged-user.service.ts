import {Injectable} from '@angular/core';
import {User} from "app/core/user/user.model";
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {

  private readonly loggedUser = new BehaviorSubject<User>(null);
  loggedUserCast = this.loggedUser.asObservable();

  constructor() { }

  editUser(newUser) {
    this.loggedUser.next(newUser);
  }

}
