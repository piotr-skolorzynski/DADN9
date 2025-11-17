import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);

  public init(): Observable<null> {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return of(null);
    }

    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);

    return of(null);
  }
}
