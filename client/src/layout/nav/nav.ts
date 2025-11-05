import { Component, inject, signal } from '@angular/core';
import { Field, email, form, required, submit } from '@angular/forms/signals';
import { ILoginCredentials } from '@models/index';
import { AccountService } from 'app/core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [Field],
  templateUrl: './nav.html',
})
export class Nav {
  private accountService = inject(AccountService);

  protected readonly model = signal<ILoginCredentials>({
    email: '',
    password: '',
  });

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
    this.accountService.login(this.model()).subscribe({
      next: result => console.log(result),
      error: error => console.log(error.message),
    });
  }
}
