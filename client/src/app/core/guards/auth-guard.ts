import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService, ToastService } from '@core/services';

export const authGuard: CanActivateFn = (_1, _2) => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);

  if (accountService.getCurrentUser()) {
    return true;
  }

  toastService.error('You shall not pass');
  return false;
};
