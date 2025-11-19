import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Field, email, form, required } from '@angular/forms/signals';
import { catchError, finalize, of, tap } from 'rxjs';
import { AccountService, ToastService } from '@core/services';
import { ILoginCredentials } from '@models/interfaces';
import { themes } from '@layout/themes';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  imports: [Field, RouterLink, RouterLinkActive],
})
export class Nav implements OnInit {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly emptyCredentials: ILoginCredentials = {
    email: '',
    password: '',
  };

  protected readonly accountService = inject(AccountService);
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
  protected selectedTheme = signal<string>(
    localStorage.getItem('theme') || 'light'
  );
  protected themes = themes;

  public ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  public handleSelectTheme(theme: string): void {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const activeElement = document.activeElement as HTMLDivElement;
    if (activeElement) {
      activeElement.blur();
    }
  }

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
