import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
})
export class Home {
  protected registerMode = signal(false);

  public showRegister(): void {
    this.registerMode.set(true);
  }
}
