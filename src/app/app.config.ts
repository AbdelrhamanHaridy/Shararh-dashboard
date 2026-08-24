import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { MessageService } from 'primeng/api';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    MessageService,
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
  ],
};
