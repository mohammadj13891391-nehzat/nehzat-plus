import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

const OTUH2_LOGIN_URL = 'http://localhost:4200/auth/login';
const CALLBACK_PATH = '/auth/callback';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = authService.isAuthenticated();
  console.log('[authGuard] fired at path:', window.location.pathname, 'isAuthenticated:', isAuth);
  if (isAuth) {
    return true;
  }
  // Build callback URL — use browser's actual path
  const currentPath = window.location.pathname;
  const returnTo = encodeURIComponent(currentPath);
  const callbackUrl = `${window.location.origin}${CALLBACK_PATH}?returnTo=${returnTo}`;
  const redirectUrl = `${OTUH2_LOGIN_URL}?returnUrl=${encodeURIComponent(callbackUrl)}`;
  console.log('[authGuard] redirecting to EhrazHoviat:', redirectUrl);
  // Encode only the callbackUrl for the returnUrl param
  window.location.href = redirectUrl;
  return false;
};
