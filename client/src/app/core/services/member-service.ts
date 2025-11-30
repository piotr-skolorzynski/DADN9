import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  IEditableMember,
  IMember,
  IPaginatedResult,
  IPhoto,
} from '@models/interfaces';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private editMode = signal(false);
  private memberSignal = signal<IMember | null>(null);

  public isEditMode = computed(() => this.editMode());

  public member = computed(() => this.memberSignal());

  public setEditMode(isEdit: boolean): void {
    this.editMode.set(isEdit);
  }

  public setMember(member: IMember): void {
    this.memberSignal.set(member);
  }

  public getMembers(
    pageNumber = 1,
    pageSize = 10
  ): Observable<IPaginatedResult<IMember>> {
    // let params = new HttpParams(); // w angular 21 nie zadziałał poprawnie HttpParams
    // params.append('pageNumber', pageNumber);
    // params.append('pageSize', pageSize);

    const params = { pageNumber, pageSize };

    return this.http.get<IPaginatedResult<IMember>>(this.baseUrl + 'members', {
      params,
    });
  }

  public getMember(id: string): Observable<IMember> {
    return this.http
      .get<IMember>(this.baseUrl + 'members/' + id)
      .pipe(tap(member => this.setMember(member)));
  }

  public getMemberPhotos(id: string): Observable<IPhoto[]> {
    return this.http.get<IPhoto[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  public updateMember(member: IEditableMember): Observable<void> {
    return this.http.put<void>(this.baseUrl + 'members', member);
  }

  public uploadPhoto(file: File): Observable<IPhoto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<IPhoto>(this.baseUrl + 'members/add-photo', formData);
  }

  public setMainPhoto(photoId: number): Observable<void> {
    return this.http.put<void>(
      this.baseUrl + 'members/set-main-photo/' + photoId,
      {}
    );
  }

  public deletePhoto(photoId: number): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl + '/members/delete-photo/' + photoId
    );
  }
}
