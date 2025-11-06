import { Component, inject, signal } from '@angular/core';
import { Field, email, form, required } from '@angular/forms/signals';
import { catchError, finalize, of, tap } from 'rxjs';
import { AccountService } from '@core/services';
import { ILoginCredentials } from '@models/interfaces';

@Component({
  selector: 'app-nav',
  imports: [Field],
  templateUrl: './nav.html',
})
export class Nav {
  private accountService = inject(AccountService);
  private readonly emptyCredentials = {
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
        tap(result => {
          console.log(result);
        }),
        catchError(error => {
          console.log(error.message);

          return of('login failed');
        }),
        finalize(() => this.model.set(this.emptyCredentials))
      )
      .subscribe();
  }

  public logout(): void {
    this.accountService.logout();
  }
}
