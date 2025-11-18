import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { IMember } from '@models/interfaces';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.html',
  imports: [],
})
export class MemberProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected member = signal<IMember | undefined>(undefined);

  public ngOnInit(): void {
    this.initializeMemberData();
  }

  private initializeMemberData(): void {
    this.route.parent?.data
      .pipe(tap(data => this.member.set(data['member'])))
      .subscribe();
  }
}
