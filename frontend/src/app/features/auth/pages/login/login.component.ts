import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { resolveOtuh2BaseUrl } from '../../../../core/services/api-url.util';

interface RoleOption {
  key: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly useMockAuth = environment.useMockAuth;
  protected otuh2LoginUrl = '';

  protected readonly roles: RoleOption[] = [
    { key: 'admin',        label: 'مدیر',         icon: '⚙️',  description: 'دسترسی کامل مدیریتی' },
    { key: 'trainee',      label: 'دانش‌آموز',    icon: '📚',  description: 'داشبورد روزانه و تکالیف' },
    { key: 'coach',        label: 'مربی',         icon: '🏋️',  description: 'مدیریت دانش‌آموزان' },
    { key: 'parent',       label: 'والدین',        icon: '👨‍👩‍👧', description: 'پیگیری پیشرفت' },
    { key: 'branch_manager', label: 'مدیر شعبه',  icon: '🏢',  description: 'مدیریت شعبه' },
    { key: 'evaluator',    label: 'ارزیاب',       icon: '📋',  description: 'ارزیابی دانش‌آموزان' },
    { key: 'headquarters', label: 'ستاد',         icon: '🏛️',  description: 'داشبورد ستادی' },
  ];

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

  protected loginAs(role: string): void {
    const account = this.devAccountForRole(role);
    this.authService.signinLocal(account.username, account.password).subscribe({
      next: () => {
        const target = this.authService.getDashboardPathForRole(role);
        void this.router.navigateByUrl(target);
      },
      error: () => {
        console.warn(`[LoginComponent] centralized sign-in failed for role=${role}; falling back to mock login`);
        this.authService.mockLogin(role);
        const target = this.authService.getDashboardPathForRole(role);
        void this.router.navigateByUrl(target);
      }
    });
  }

    private devAccountForRole(role: string): { username: string; password: string } {
        switch (role) {
          case 'admin':
          case 'manager':
          case 'headquarters':
          case 'branch_manager':
          case 'parent':
          case 'evaluator':
            return { username: 'test', password: 'password' };
          case 'coach':
            return { username: 'coach', password: 'password123' };
          case 'trainee':
            return { username: 'ali.ahmadi', password: 'password123' };
          default:
            return { username: 'test', password: 'password' };
        }
      }

  protected redirectToOtuh2(): void {
    window.location.href = this.otuh2LoginUrl;
  }
}
