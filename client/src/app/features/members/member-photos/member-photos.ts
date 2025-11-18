import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, switchMap, tap } from 'rxjs';
import { IPhoto } from '@models/interfaces';
import { MemberService } from '@core/services';

@Component({
  selector: 'app-member-photos',
  templateUrl: './member-photos.html',
})
export class MemberPhotos {
  private readonly route = inject(ActivatedRoute);
  private readonly memberService = inject(MemberService);
  protected photos = signal<IPhoto[] | undefined>(undefined);

  public get photoMocks(): any {
    return Array.from({ length: 20 }, (_, i) => ({ url: '/user.png' }));
  }

  public ngOnInit(): void {
    this.initializeMemberData();
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
