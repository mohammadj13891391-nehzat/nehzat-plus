import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MorabbiApiService } from './morabbi-api.service';
import { roleLabel } from './morabbi-labels';

@Component({
  selector: 'app-morabbi-shell',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="morabbi-page morabbi-scope">
      <header class="mb-header">
        <div class="mb-brand">
          <span class="mb-brand-title">سامانه مربی</span>
          <span class="mb-brand-sub">تربیت و ارزیابی مربیان</span>
        </div>
        <div class="mb-user" *ngIf="morabbi.user()">
          <div class="mb-user-name">{{ morabbi.user()!.name }}</div>
          <div class="mb-user-role">{{ roleLabelFn(morabbi.user()!.role) }}</div>
        </div>
      </header>
      <nav class="mb-tabs">
        <a routerLink="/coach/dashboard" routerLinkActive="active">داشبورد</a>
        <a routerLink="/coach/reports" routerLinkActive="active">گزارش‌های روزانه</a>
        <a routerLink="/coach/lesson-plans" routerLinkActive="active">طرح‌های درس</a>
        <a routerLink="/coach/recognition" routerLinkActive="active">تشویق‌ها و امتیازها</a>
        <a routerLink="/coach/approvals" routerLinkActive="active" *ngIf="morabbi.canApprove()">تأیید کاربران</a>
        <a routerLink="/coach/organization" routerLinkActive="active" *ngIf="morabbi.isAdminManager()">مکتب‌ها و شعب</a>
        <a routerLink="/coach/profile" routerLinkActive="active">پروفایل</a>
        <a routerLink="/coach/students" routerLinkActive="active">شاگردان (لسن‌پلنر)</a>
      </nav>
      <div class="mb-body">
        @if (!morabbi.sessionReady()) {
          <div class="mb-loading">در حال اتصال به سامانه مربی...</div>
        } @else if (morabbi.sessionError()) {
          <div class="mb-error card">
            <p>{{ morabbi.sessionError() }}</p>
            <button class="btn btn-sm" (click)="retry()">تلاش مجدد</button>
          </div>
        } @else {
          <router-outlet />
        }
      </div>
    </div>
  `,
  styles: `
    .morabbi-page {
      padding: 18px 26px 40px;
    }
    .mb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .mb-brand-title {
      display: block;
      font-size: 22px;
      font-weight: 700;
      color: var(--lp-primary);
    }
    .mb-brand-sub {
      font-size: 12px;
      color: var(--lp-text-muted);
    }
    .mb-user {
      text-align: left;
      background: var(--lp-surface);
      border: 1px solid var(--lp-border);
      border-radius: 10px;
      padding: 8px 14px;
    }
    .mb-user-name {
      font-size: 13px;
      font-weight: 600;
    }
    .mb-user-role {
      font-size: 11px;
      color: var(--lp-text-muted);
    }
    .mb-tabs {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      border-bottom: 2px solid var(--lp-border);
      margin-bottom: 18px;
    }
    .mb-tabs a {
      padding: 10px 16px;
      font-size: 14px;
      color: var(--lp-text-muted);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      text-decoration: none;
    }
    .mb-tabs a:hover {
      color: var(--lp-primary);
    }
    .mb-tabs a.active {
      color: var(--lp-primary);
      font-weight: 600;
      border-bottom-color: var(--lp-primary);
    }
    .mb-loading,
    .mb-error {
      padding: 40px;
      text-align: center;
      color: var(--lp-text-muted);
    }
  `
})
export class MorabbiShellComponent implements OnInit {
  readonly morabbi = inject(MorabbiApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly roleLabelFn = roleLabel;

  ngOnInit(): void {
    this.morabbi.ensureSession(this.auth.getCurrentUser()?.userType).subscribe({
      error: () => {}
    });
  }

  retry(): void {
    this.morabbi.logout();
    this.morabbi.ensureSession(this.auth.getCurrentUser()?.userType).subscribe({
      error: () => {}
    });
  }
}
