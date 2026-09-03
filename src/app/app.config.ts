import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DraftsStoreService } from './service/drafts.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      license:
        'eyJpZCI6ImIyODU1ZjJmLTQ4NDUtNGM3Zi1hZWM1LWQzNmFkMGY3YTI1YiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODY2MzMyMzYsImV4cCI6MTgxODE2OTIzNn0.-a4OJXAKKM9q3fC6PJ8TyCMrRDGnoivoORTbFreE1hqvA23uSZDcQn_VeC4nRB45TN0cYqUvOitnY4n_TpVSCA',
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',

          cssVariables: true,

        },
      },
    }),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(),
    provideAppInitializer(() => {
      console.log('provideAppInitializer');
      // return of(true);
      try {
        const service = inject(DraftsStoreService);
        return service.init();
      } catch (err) {
        console.error('Error initializing DraftsStoreService:', err);
        return of(false);
      }
    }),
  ]
};


