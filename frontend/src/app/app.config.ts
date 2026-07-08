import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadApiConfig } from './config.loader';
import { provideLessonPlannerApi } from './core/services/lesson-planner-api.token';
import { provideOtuh2Api } from './core/services/otuh2-api.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideLessonPlannerApi(),
    provideOtuh2Api(),
    { provide: APP_INITIALIZER, useFactory: loadApiConfig, multi: true }
  ]
};
