import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRole: string): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  if (authService.hasRole(allowedRole)) {
    return true;
  }

  const user = authService.getCurrentUser();
  const target = user ? authService.getDashboardPathForRole(user.userType) : '/auth/login';
  return router.createUrlTree([target]);
};
