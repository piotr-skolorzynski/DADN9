import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.html',
})
export class TestErrors {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:5001/api/';

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
      error: error => console.log(error),
    });
  }
}
