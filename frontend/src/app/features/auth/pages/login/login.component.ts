import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { resolveOtuh2BaseUrl } from '../../../../core/services/api-url.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);

  protected otuh2LoginUrl = '';

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      const target = user
        ? this.authService.getDashboardPathForRole(user.userType)
        : '/dashboard';
      window.location.href = target;
      return;
    }
    this.otuh2LoginUrl = `${resolveOtuh2BaseUrl()}/auth/login?returnUrl=${encodeURIComponent(`${window.location.origin}/auth/callback?returnTo=${encodeURIComponent('/dashboard')}`)}`;
  }

  protected redirectToOtuh2(): void {
    window.location.href = this.otuh2LoginUrl;
  }
}
