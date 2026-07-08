import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<p>در حال ورود...</p>`
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const idToken = params['id_token'];
      const refreshToken = params['refresh_token'];
      const returnTo = params['returnTo'];

      console.log('[AuthCallback] received params — has accessToken:', !!accessToken, 'has idToken:', !!idToken, 'returnTo:', returnTo);

      if (accessToken) {
        // Store tokens
        sessionStorage.setItem('otuh2_access_token', accessToken);
        if (idToken) sessionStorage.setItem('otuh2_id_token', idToken);
        if (refreshToken) localStorage.setItem('otuh2_refresh_token', refreshToken);

        console.log('[AuthCallback] tokens stored in sessionStorage');

        // Redirect to original destination or dashboard
        const decodedReturnTo = returnTo ? decodeURIComponent(returnTo) : null;
        console.log('[AuthCallback] decodedReturnTo:', decodedReturnTo);

        if (decodedReturnTo && decodedReturnTo !== '/' && decodedReturnTo !== '/auth/login') {
          console.log('[AuthCallback] navigating to:', decodedReturnTo);
          void this.router.navigateByUrl(decodedReturnTo);
        } else {
          const user = this.authService.getCurrentUser();
          const target = user
            ? this.authService.getDashboardPathForRole(user.userType)
            : '/dashboard';
          console.log('[AuthCallback] fallback — user:', user, 'navigating to:', target);
          void this.router.navigateByUrl(target);
        }
      } else {
        console.warn('[AuthCallback] NO access_token in URL — redirecting to login');
        // No token - redirect to login
        void this.router.navigateByUrl('/auth/login');
      }
    });
  }
}
