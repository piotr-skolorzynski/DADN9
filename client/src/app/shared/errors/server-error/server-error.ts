import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IApiError } from '@models/interfaces';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerError {
  protected error = {} as IApiError;
  protected showDetails = false;

  private readonly router = inject(Router);
  private readonly navigation = this.router.currentNavigation();
  private effect = effect(() => {
    this.error = this.navigation?.extras?.state?.['error'];
  });

  public toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
