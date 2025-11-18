import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '@core/services';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const user = accountService.getCurrentUser();

  if (user) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  return next(req);
};
