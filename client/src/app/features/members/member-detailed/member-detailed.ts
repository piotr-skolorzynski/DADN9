import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, tap } from 'rxjs';
import { AgePipe } from '@core/pipes';
import { AccountService, MemberService } from '@core/services';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-detailed',
  templateUrl: './member-detailed.html',
  imports: [AgePipe, RouterLink, RouterLinkActive, RouterOutlet],
})
export class MemberDetailed implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountService = inject(AccountService);
  private readonly memberService = inject(MemberService);
  protected isEditMode = this.memberService.isEditMode;
  protected member = signal<IMember | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser = computed(
    () => this.accountService.getCurrentUser()?.id === this.member()?.id
  );

  public ngOnInit(): void {
    this.initializeDetailsTitle();
    this.initializeMemberData();
  }

  public handleEditMode(): void {
    this.memberService.setEditMode(!this.memberService.isEditMode());
  }

  private initializeDetailsTitle(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => this.title.set(this.route.firstChild?.snapshot?.title))
      )
      .subscribe();
  }

  private initializeMemberData(): void {
    this.route.data
      .pipe(tap(data => this.member.set(data['member'])))
      .subscribe();
  }
}
