import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[adminGuard] fired at path:', window.location.pathname);

  if (!authService.isAuthenticated()) {
    console.warn('[adminGuard] NOT authenticated → redirecting to /auth/login');
    return router.createUrlTree(['/auth/login']);
  }

  const hasAdmin = authService.hasRole('admin');
  const hasManager = authService.hasRole('manager');
  const hasHQ = authService.hasRole('headquarters');
  const hasBranchMgr = authService.hasRole('branch_manager');
  console.log('[adminGuard] roles — admin:', hasAdmin, 'manager:', hasManager, 'headquarters:', hasHQ, 'branch_manager:', hasBranchMgr);

  if (hasAdmin || hasManager || hasHQ || hasBranchMgr) {
    return true;
  }

  const user = authService.getCurrentUser();
  console.warn('[adminGuard] NO matching role. user:', user);
  const target = user ? authService.getDashboardPathForRole(user.userType) : '/auth/login';
  console.warn('[adminGuard] redirecting to:', target);
  return router.createUrlTree([target]);
};
