import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMember } from '@models/interfaces';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getMembers(): Observable<IMember[]> {
    return this.http.get<IMember[]>(this.baseUrl + 'members');
  }

  public getMemeber(id: string): Observable<IMember> {
    return this.http.get<IMember>(this.baseUrl + 'members/' + id);
  }
}
