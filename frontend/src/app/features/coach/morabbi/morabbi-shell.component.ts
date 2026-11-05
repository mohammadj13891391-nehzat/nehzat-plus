import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { PushNotificationService } from '../../../core/services/push-notification.service';
import { MorabbiApiService } from './morabbi-api.service';
import { roleLabel } from './morabbi-labels';

@Component({
  selector: 'app-morabbi-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <div class="mb-tab-group">
          <span class="mb-tab-group-label">سامانه مربی</span>
          <div class="mb-tab-group-items">
            <a routerLink="/coach/dashboard" routerLinkActive="active">داشبورد</a>
            <a routerLink="/coach/reports" routerLinkActive="active">گزارش‌های روزانه</a>
            <a routerLink="/coach/lesson-plans" routerLinkActive="active">طرح‌های درس</a>
            <a routerLink="/coach/recognition" routerLinkActive="active">تشویق‌ها و امتیازها</a>
            <a routerLink="/coach/approvals" routerLinkActive="active" *ngIf="morabbi.canApprove()">تأیید کاربران</a>
            <a routerLink="/coach/organization" routerLinkActive="active" *ngIf="morabbi.isAdminManager()">مکتب‌ها و شعب</a>
            <a routerLink="/coach/profile" routerLinkActive="active">پروفایل</a>
          </div>
        </div>
        <div class="mb-tab-group">
          <span class="mb-tab-group-label">نُهضت</span>
          <div class="mb-tab-group-items">
            <a routerLink="/coach/students" routerLinkActive="active">شاگردان</a>
            <a routerLink="/coach/rings" routerLinkActive="active">حلقه‌ها</a>
            <a routerLink="/coach/spiritual" routerLinkActive="active">بخش معنوی</a>
          </div>
        </div>
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
      <nav class="mb-bottomnav" aria-label="ناوبری سریع">
        <a routerLink="/coach/dashboard" routerLinkActive="active">داشبورد</a>
        <a routerLink="/coach/reports" routerLinkActive="active">گزارش‌ها</a>
        <a routerLink="/coach/lesson-plans" routerLinkActive="active">طرح درس</a>
        <a routerLink="/coach/recognition" routerLinkActive="active">تشویق</a>
        <a routerLink="/coach/profile" routerLinkActive="active">پروفایل</a>
      </nav>
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
      gap: 24px;
      flex-wrap: wrap;
      border-bottom: 2px solid var(--lp-border);
      margin-bottom: 18px;
    }
    .mb-tab-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .mb-tab-group-label {
      font-size: 10px;
      font-weight: 700;
      color: var(--lp-text-muted);
      letter-spacing: 0.4px;
      padding-right: 16px;
    }
    .mb-tab-group-items {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .mb-tab-group-items a {
      padding: 10px 16px;
      font-size: 14px;
      color: var(--lp-text-muted);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      text-decoration: none;
      white-space: nowrap;
    }
    .mb-tab-group-items a:hover {
      color: var(--lp-primary);
    }
    .mb-tab-group-items a.active {
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
    .mb-bottomnav {
      display: none;
    }
    @media (max-width: 768px) {
      .morabbi-page {
        padding: 12px 14px 76px;
      }
      .mb-tabs {
        flex-direction: column;
        gap: 10px;
        overflow-x: auto;
      }
      .mb-tab-group {
        flex-direction: row;
        align-items: baseline;
        gap: 10px;
      }
      .mb-tab-group-label {
        padding-right: 0;
        white-space: nowrap;
      }
      .mb-tab-group-items {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 2px;
      }
      .mb-bottomnav {
        display: flex;
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 60;
        background: var(--lp-surface);
        border-top: 1px solid var(--lp-border);
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
      .mb-bottomnav a {
        flex: 1;
        text-align: center;
        padding: 10px 4px 8px;
        font-size: 11px;
        color: var(--lp-text-muted);
        text-decoration: none;
        white-space: nowrap;
      }
      .mb-bottomnav a.active {
        color: var(--lp-primary);
        font-weight: 700;
        box-shadow: inset 0 3px 0 var(--lp-primary);
      }
    }
  `
})
export class MorabbiShellComponent implements OnInit, OnDestroy {
  readonly morabbi = inject(MorabbiApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationHub = inject(NotificationHubService);
  private readonly push = inject(PushNotificationService);

  readonly roleLabelFn = roleLabel;

  ngOnInit(): void {
    this.morabbi.ensureSession(this.auth.getCurrentUser()?.userType).subscribe({
      error: () => {}
    });
    this.notificationHub.connect();
    this.push.register();
  }

  ngOnDestroy(): void {
    this.notificationHub.disconnect();
  }

  retry(): void {
    this.morabbi.logout();
    this.morabbi.ensureSession(this.auth.getCurrentUser()?.userType).subscribe({
      error: () => {}
    });
  }
}
