import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'callback',
    loadComponent: () => {
      console.log('[AUTH_ROUTES] loading callback component');
      return import('./pages/callback/auth-callback.component').then((m) => {
        console.log('[AUTH_ROUTES] callback component LOADED');
        return m.AuthCallbackComponent;
      });
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
