import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  ILoginCredentials,
  IRegisterCredentials,
  IUser,
} from '@models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:5001/api/';
  private currentUser = signal<IUser | null>(null);

  public getCurrentUser = computed(() => this.currentUser());

  public setCurrentUser(user: IUser | null): void {
    this.currentUser.set(user);
  }

  public register(creds: IRegisterCredentials): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'account/register', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.setCurrentUserInLocalStorage(user);
        }
      })
    );
  }

  public login(creds: ILoginCredentials): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.setCurrentUserInLocalStorage(user);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.setCurrentUser(null);
  }

  private setCurrentUserInLocalStorage(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
