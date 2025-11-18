import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { MemberService } from '@core/services';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-detailed',
  templateUrl: './member-detailed.html',
  imports: [RouterLink, RouterLinkActive],
})
export class MemberDetailed implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly memberService = inject(MemberService);
  protected member = signal<IMember | null>(null);

  public ngOnInit(): void {
    this.loadMember();
  }

  private loadMember(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const memberId = params.get('id')!;
          if (memberId) {
            return this.memberService.getMember(memberId);
          }

          return of(null);
        }),
        tap((member: IMember | null) => this.member.set(member))
      )
      .subscribe();
  }
}
