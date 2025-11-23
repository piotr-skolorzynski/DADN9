import { Component, inject, output, signal } from '@angular/core';
import {
  email,
  form,
  required,
  Field,
  minLength,
  maxLength,
  validate,
  customError,
} from '@angular/forms/signals';
import { catchError, of, tap } from 'rxjs';
import { AccountService } from '@core/services';
import { IRegisterCredentials } from '@models/interfaces';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [Field, JsonPipe],
})
export class Register {
  public cancelRegister = output<boolean>();

  private readonly accountService = inject(AccountService);

  private readonly emptyRegisterCredentials: IRegisterCredentials = {
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  };

  protected readonly creds = signal<IRegisterCredentials>(
    this.emptyRegisterCredentials
  );

  protected readonly form = form(this.creds, schema => {
    required(schema.email, {
      message: 'Your Email is required!',
    });
    email(schema.email, {
      message: 'Please enter a valid email address!',
    });
    required(schema.displayName, {
      message: 'Your name is required!',
    });
    required(schema.password, {
      message: 'Your password is required!',
    });
    minLength(schema.password, 4);
    maxLength(schema.password, 8);
    required(schema.confirmPassword, {
      message: 'Please Confirm your password',
    });
    validate(schema.confirmPassword, ctx => {
      const password = ctx.valueOf(schema.password);
      const confirmPassword = ctx.value();

      return password === confirmPassword
        ? undefined
        : customError({
            message: 'Passwords do not match',
            kind: 'passwordMismatch',
          });
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
