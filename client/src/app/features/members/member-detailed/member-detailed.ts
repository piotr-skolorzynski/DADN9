import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, of, switchMap, tap } from 'rxjs';
import { MemberService } from '@core/services';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-detailed',
  templateUrl: './member-detailed.html',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class MemberDetailed implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly memberService = inject(MemberService);
  protected title = signal<string | undefined>('Profile');
  protected member = signal<IMember | null>(null);

  public ngOnInit(): void {
    this.initializeDetailsTitle();
    this.loadMember();
  }

  private initializeDetailsTitle(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => this.title.set(this.route.firstChild?.snapshot?.title))
      )
      .subscribe();
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
