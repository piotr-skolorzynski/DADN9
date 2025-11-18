import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, tap } from 'rxjs';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-detailed',
  templateUrl: './member-detailed.html',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class MemberDetailed implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected member = signal<IMember | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');

  public ngOnInit(): void {
    this.initializeDetailsTitle();
    this.initializeMemberData();
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
