import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Field, email, form, required } from '@angular/forms/signals';
import { catchError, finalize, of, tap } from 'rxjs';
import { AccountService, ToastService } from '@core/services';
import { ILoginCredentials } from '@models/interfaces';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  imports: [Field, RouterLink, RouterLinkActive],
})
export class Nav {
  private readonly router = inject(Router);
  private readonly accountService = inject(AccountService);
  private readonly toastService = inject(ToastService);
  private readonly emptyCredentials: ILoginCredentials = {
    email: '',
    password: '',
  };

  protected currentUser = this.accountService.getCurrentUser;
  protected readonly model = signal<ILoginCredentials>(this.emptyCredentials);
  protected readonly form = form(this.model, schema => {
    required(schema.email, {
      message: 'Your Email is required!',
    });
    required(schema.password, {
      message: 'Your password is required!',
    });
    email(schema.email, {
      message: 'Please enter a valid email address!',
    });
  });

  public login(): void {
    this.accountService
      .login(this.model())
      .pipe(
        tap(_ => {
          this.toastService.success('Logged in successfully');
          this.router.navigateByUrl('/members');
        }),
        catchError(error => {
          this.toastService.error(error.error);

          return of();
        }),
        finalize(() => this.model.set(this.emptyCredentials))
      )
      .subscribe();
  }

  public logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
