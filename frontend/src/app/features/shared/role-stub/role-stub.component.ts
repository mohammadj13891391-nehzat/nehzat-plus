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
    .role-page { direction: rtl; min-height: 100vh; padding: 1rem; display: grid; gap: 1rem; }
    .site-header {
      background: linear-gradient(135deg, var(--lp-primary, #1a6b3c) 0%, #0f3d22 100%);
      border-radius: 18px;
      padding: 0.75rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      color: #fff;
      box-shadow: 0 4px 16px rgba(26, 107, 60, 0.2);
    }
    .brand-wrap { display: flex; align-items: center; gap: 0.75rem; }
    .site-logo {
      width: 42px; height: 42px;
      border-radius: 12px;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,0.2);
    }
    h1 { margin: 0; font-size: 1.1rem; color: #fff; }
    .muted { color: rgba(255,255,255,0.8); margin: 0.1rem 0 0; font-size: 0.85rem; }
    .user-menu { position: relative; }
    .menu-trigger {
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 12px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      padding: 0.45rem 0.85rem;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: background 0.2s;
      font: inherit;
      font-weight: 600;
    }
    .menu-trigger:hover { background: rgba(255,255,255,0.18); }
    .main-content {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 18px;
      padding: 1.5rem;
      box-shadow: 0 8px 24px rgba(30, 27, 20, 0.06);
    }
    .main-content h2 { margin: 0 0 0.5rem; color: var(--lp-text, #1e1b14); }
    .main-content .muted { color: var(--lp-muted, #7a7468); font-size: 0.95rem; }
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
