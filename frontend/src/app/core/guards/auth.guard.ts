import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { resolveOtuh2BaseUrl } from '../services/api-url.util';

const CALLBACK_PATH = '/auth/callback';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = authService.isAuthenticated();
  console.log('[authGuard] fired at path:', window.location.pathname, 'isAuthenticated:', isAuth);
  if (isAuth) {
    return true;
  }
  // Redirect-based login: send the browser to EhrazHoviat's hosted login page.
  // OTUH2 authenticates, then redirects back to our /auth/callback with tokens.
  const currentPath = window.location.pathname;
  const returnTo = encodeURIComponent(currentPath);
  const callbackUrl = `${window.location.origin}${CALLBACK_PATH}?returnTo=${returnTo}`;
  const otuh2LoginUrl = `${resolveOtuh2BaseUrl()}/auth/login`;
  const redirectUrl = `${otuh2LoginUrl}?returnUrl=${encodeURIComponent(callbackUrl)}`;
  console.log('[authGuard] redirecting to EhrazHoviat:', redirectUrl);
  window.location.href = redirectUrl;
  return false;
};
