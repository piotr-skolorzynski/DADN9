import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '@core/services';
import { IUser } from '@models/interfaces';
import { Nav } from './layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [Nav],
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);

  protected readonly title = signal('Dating app');
  protected members = signal<IUser[]>([]);

  public ngOnInit(): void {
    this.getUSers();
    this.setCurrentUser();
  }

  private getUSers(): void {
    this.http.get<IUser[]>('https://localhost:5001/api/members').subscribe({
      next: response => this.members.set(response),
      error: error => console.log(error),
    });
  }

  private setCurrentUser(): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return;
    }

    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
