import { Component, signal } from '@angular/core';
import { Field, email, form, required, submit } from '@angular/forms/signals';

interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-nav',
  imports: [Field],
  templateUrl: './nav.html',
})
export class Nav {
  protected readonly model = signal<LoginForm>({
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
    console.log(this.model());
  }
}
