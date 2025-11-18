import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { InitService } from '@core/services';
import { errorInterceptor, jwtInterceptor } from '@core/interceptors';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor])),
    provideAppInitializer(async () => {
      const initService = inject(InitService);

      return new Promise<void>(resolve => {
        setTimeout(async () => {
          try {
            return lastValueFrom(initService.init());
          } finally {
            const splash = document.getElementById('init-splash');
            if (splash) {
              splash.remove();
            }
            resolve();
          }
        }, 500);
      });
    }),
  ],
};
