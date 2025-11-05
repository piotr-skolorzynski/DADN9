import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppUser, ILoginCredentials } from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:5001/api/';

  public login(creds: ILoginCredentials): Observable<IAppUser> {
    return this.http.post<IAppUser>(this.baseUrl + 'account/login', creds);
  }
}
