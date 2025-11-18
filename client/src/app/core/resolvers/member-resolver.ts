import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { MemberService } from '@core/services';
import { IMember } from '@models/interfaces';

export const memberResolver: ResolveFn<IMember> = (route, _) => {
  const router = inject(Router);
  const memberService = inject(MemberService);
  const memberId = route.paramMap.get('id');

  if (!memberId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return memberService.getMember(memberId);
};
