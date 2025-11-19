import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMember, IPhoto } from '@models/interfaces';
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

  public getMember(id: string): Observable<IMember> {
    return this.http.get<IMember>(this.baseUrl + 'members/' + id);
  }

  public getMemberPhotos(id: string): Observable<IPhoto[]> {
    return this.http.get<IPhoto[]>(this.baseUrl + 'members/' + id + '/photos');
  }
}
