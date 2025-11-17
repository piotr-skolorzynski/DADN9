import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.html',
})
export class TestErrors {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public validationErrors = signal<string[]>([]);

  public get404Error(): void {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }

  public get400Error(): void {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }

  public get500Error(): void {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }

  public get401Error(): void {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }

  public get400ValidationError(): void {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: response => console.log(response),
      error: error => {
        console.log(error);
        this.validationErrors.set(error);
      },
    });
  }
}
