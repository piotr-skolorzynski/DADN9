import { Component, input, output, signal } from '@angular/core';
import { email, form, required, Field } from '@angular/forms/signals';
import { IRegisterCredentials, IUser } from '@models/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [Field],
})
export class Register {
  public usersFromHome = input.required<IUser[]>();
  public cancelRegister = output<boolean>();

  private readonly emptyRegisterCredentials: IRegisterCredentials = {
    email: '',
    displayName: '',
    password: '',
  };

  protected readonly model = signal<IRegisterCredentials>(
    this.emptyRegisterCredentials
  );

  protected readonly form = form(this.model, schema => {
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
    console.log(this.model());
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }
}
