import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const serviceSurveyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[serviceSurveyGuard] fired at path:', window.location.pathname);

  if (!authService.isAuthenticated()) {
    console.warn('[serviceSurveyGuard] NOT authenticated → redirecting to /auth/login');
    return router.createUrlTree(['/auth/login']);
  }

  const user = authService.getCurrentUser();
  const allowedRoles = ['مدیر مدرسه', 'معاونت فرهنگی/طلایی', 'معاونت اداری/مالی'];

  console.log('[serviceSurveyGuard] user role:', user?.role);

  if (user && allowedRoles.includes(user.role)) {
    console.log('[serviceSurveyGuard] role allowed - permitting access');
    return true;
  }

  console.warn('[serviceSurveyGuard] role not allowed, redirecting to /dashboard');
  const target = user ? authService.getDashboardPathForRole(user.userType) : '/dashboard';
  return router.createUrlTree([target]);
};
