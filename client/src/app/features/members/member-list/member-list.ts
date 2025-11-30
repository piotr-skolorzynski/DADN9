import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MemberService } from '@core/services';
import { MemberCard } from '../member-card/member-card';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.html',
  imports: [MemberCard],
})
export class MemberList {
  private readonly memberService = inject(MemberService);
  protected paginatedMembers = toSignal(this.memberService.getMembers(), {
    initialValue: null,
  });
}
