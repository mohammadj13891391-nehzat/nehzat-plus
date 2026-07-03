import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const user = authService.getCurrentUser();
  if (user?.userType === 'manager' || user?.userType === 'headquarters' || user?.userType === 'branch_manager') {
    return true;
  }
  const target = user ? authService.getDashboardPathForRole(user.userType) : '/auth/login';
  return router.createUrlTree([target]);
};
