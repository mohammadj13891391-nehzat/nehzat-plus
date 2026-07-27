import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

const ALLOWED_ROLES = ['parent', 'branch_manager', 'headquarters', 'manager'];

export const serviceSurveyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const user = authService.getCurrentUser();
  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  if (ALLOWED_ROLES.includes(user.userType)) {
    return true;
  }

  const target = authService.getDashboardPathForRole(user.userType);
  return router.createUrlTree([target]);
};
