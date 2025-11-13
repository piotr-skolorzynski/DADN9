import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';
import { AccountService } from '@core/services';
import { IUser } from '@models/interfaces';
import { Nav } from './layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [Nav, RouterOutlet],
})
export class App {
  protected readonly router = inject(Router);
  protected readonly title = signal('Dating app');
}
