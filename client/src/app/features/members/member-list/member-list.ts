import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MemberService } from '@core/services';

@Component({
  selector: 'app-member-list',
  imports: [],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList {
  private readonly memberService = inject(MemberService);
  protected members = toSignal(this.memberService.getMembers(), {
    initialValue: [],
  });
}
