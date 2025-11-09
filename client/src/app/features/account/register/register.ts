import { Component, inject, output, signal } from '@angular/core';
import { email, form, required, Field } from '@angular/forms/signals';
import { catchError, of, tap } from 'rxjs';
import { AccountService } from '@core/services';
import { IRegisterCredentials } from '@models/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [Field],
})
export class Register {
  public cancelRegister = output<boolean>();

  private readonly accountService = inject(AccountService);

  private readonly emptyRegisterCredentials: IRegisterCredentials = {
    email: '',
    displayName: '',
    password: '',
  };

  protected readonly creds = signal<IRegisterCredentials>(
    this.emptyRegisterCredentials
  );

  protected readonly form = form(this.creds, schema => {
    required(schema.email, {
      message: 'Your Email is required!',
    });
    required(schema.displayName, {
      message: 'Your Display name is required!',
    });
    required(schema.password, {
      message: 'Your password is required!',
    });
    email(schema.email, {
      message: 'Please enter a valid email address!',
    });
  });

  public register(): void {
    this.accountService
      .register(this.creds())
      .pipe(
        tap(response => {
          console.log(response);
          this.cancel();
        }),
        catchError(error => {
          console.log(error.message);
          return of();
        })
      )
      .subscribe({});
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }
}
