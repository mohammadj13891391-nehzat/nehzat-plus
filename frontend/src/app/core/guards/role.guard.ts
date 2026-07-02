import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserType } from '../models/lesson-planner.models';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRole: UserType): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();
  if (user?.userType === allowedRole) {
    return true;
  }
  const target = user ? authService.getDashboardPathForRole(user.userType) : '/auth/login';
  return router.createUrlTree([target]);
};
