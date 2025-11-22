import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { AccountService, MemberService } from '@core/services';
import { IMember, IPhoto } from '@models/interfaces';
import { ImageUpload } from '@shared/index';

@Component({
  selector: 'app-member-photos',
  templateUrl: './member-photos.html',
  imports: [ImageUpload],
})
export class MemberPhotos implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly memberService = inject(MemberService);
  private readonly accountService = inject(AccountService);
  protected isEditMode = this.memberService.isEditMode;
  protected photos = signal<IPhoto[]>([]);
  protected loading = signal(false);

  public ngOnInit(): void {
    this.initializeMemberData();
  }

  public onUploadImage(file: File): void {
    this.loading.set(true);
    this.memberService
      .uploadPhoto(file)
      .pipe(
        tap(photo => {
          this.memberService.setEditMode(false);
          this.loading.set(false);
          this.photos.update(photos => [...photos, photo]);
        }),
        catchError(error => {
          console.log('Error loading image: ', error);
          this.loading.set(false);

          return EMPTY;
        })
      )
      .subscribe();
  }

  public setMainPhoto(photo: IPhoto): void {
    this.memberService
      .setMainPhoto(photo.id)
      .pipe(
        tap(() => {
          const currentUser = this.accountService.getCurrentUser();
          if (currentUser) {
            this.accountService.setCurrentUser({
              ...currentUser,
              imageUrl: photo.url,
            });

            const member = this.memberService.member();
            if (member) {
              this.memberService.setMember({
                ...member,
                imageUrl: photo.url,
              } as IMember);
            }
          }
        })
      )
      .subscribe();
  }

  private initializeMemberData(): void {
    this.route.parent?.data
      .pipe(
        switchMap(data => {
          const memberId = data['member'].id;
          if (memberId) {
            return this.memberService.getMemberPhotos(memberId);
          }

          return EMPTY;
        }),
        tap(photos => this.photos.set(photos))
      )
      .subscribe();
  }
}
