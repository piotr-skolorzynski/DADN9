import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMember } from '@models/interfaces';
import { environment } from 'environments/environment';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly accountService = inject(AccountService);
  private readonly baseUrl = environment.apiUrl;

  public getMembers(): Observable<IMember[]> {
    return this.http.get<IMember[]>(
      this.baseUrl + 'members',
      this.getHttpOptions()
    );
  }

  public getMemeber(id: string): Observable<IMember> {
    return this.http.get<IMember>(
      this.baseUrl + 'members/' + id,
      this.getHttpOptions()
    );
  }

  private getHttpOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accountService.getCurrentUser()?.token,
      }),
    };
  }
}
