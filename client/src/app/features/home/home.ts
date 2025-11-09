import { Component, input, signal } from '@angular/core';
import { Register } from '@features/account/register/register';
import { IUser } from '@models/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [Register],
})
export class Home {
  public usersFromApp = input.required<IUser[]>();

  protected registerMode = signal(false);

  public showRegister(value = true): void {
    this.registerMode.set(value);
  }
}
