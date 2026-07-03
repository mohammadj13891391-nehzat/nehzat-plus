import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import type { UserType } from '../../../core/models/lesson-planner.models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-role-stub',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="role-page">
      <header class="site-header">
        <div class="brand-wrap">
          <img src="assets/nehzat.png" alt="لوگو سایت" class="site-logo" (error)="logoHidden = true" />
          <div>
            <h1>{{ title }}</h1>
            <p class="muted">خوش آمدید {{ username }}</p>
          </div>
        </div>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>
      <section class="main-content">
        <h2>{{ dashboardLabel }}</h2>
        <p class="muted">این بخش در نسخه بعدی تکمیل می‌شود.</p>
      </section>
    </main>
  `,
  styles: [`
    .role-page { direction: rtl; min-height: 100vh; background: var(--lp-bg, #f8f9fa); }
    .site-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: var(--lp-surface, #fff); border-bottom: 1px solid var(--lp-border, #e5e7eb); }
    .brand-wrap { display: flex; align-items: center; gap: 1rem; }
    .site-logo { width: 48px; height: 48px; object-fit: contain; }
    h1 { margin: 0; font-size: 1.25rem; }
    .muted { color: var(--lp-muted, #6b7280); margin: 0; }
    .menu-trigger { background: var(--lp-primary, #2563eb); color: #fff; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; }
    .main-content { padding: 2rem; }
  `]
})
export class RoleStubComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) role!: UserType;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  logoHidden = false;

  get dashboardLabel(): string {
    const labels: Record<string, string> = {
      branch_manager: 'داشبورد مسئول شعبه',
      coach: 'داشبورد مربی',
      evaluator: 'داشبورد ارزیاب',
      headquarters: 'داشبورد ستاد',
      parent: 'داشبورد والدین'
    };
    return labels[this.role] ?? 'داشبورد';
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username ?? '';
    if (user?.userType !== this.role) {
      void this.router.navigateByUrl(this.authService.getDashboardPathForRole(user?.userType ?? 'trainee'));
    }
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
