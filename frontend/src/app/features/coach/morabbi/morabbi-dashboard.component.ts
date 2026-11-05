import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { Ring } from '../../../core/models/lesson-planner.models';
import { MorabbiApiService } from './morabbi-api.service';
import { DashboardData } from './morabbi.models';
import { notificationTypeLabel as notificationTypeLabelFn, roleLabel as roleLabelFn } from './morabbi-labels';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, RouterLink],
  template: `
    <div class="page-header">
      <h1 class="page-title">داشبورد</h1>
      <span class="badge" *ngIf="data()?.user">{{ roleLabel(data()!.user!.role) }}</span>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>

    <div class="grid-2" *ngIf="data()">
      <div class="card">
        <h3 class="card-title">گزارش‌های روزانه</h3>
        <div class="stats">
          <div class="stat">
            <div class="stat-num">{{ data()!.reports.total }}</div>
            <div class="stat-label">کل گزارش‌ها</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ data()!.reports.submitted }}</div>
            <div class="stat-label">ثبت‌شده</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ data()!.reports.approved }}</div>
            <div class="stat-label">تأییدشده</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ data()!.reports.returned }}</div>
            <div class="stat-label">بازگشتی</div>
          </div>
        </div>
        <a routerLink="/coach/reports" class="btn btn-sm">مشاهده گزارش‌ها</a>
      </div>

      <div class="card">
        <h3 class="card-title">طرح‌های درس</h3>
        <div class="stats">
          <div class="stat">
            <div class="stat-num">{{ data()!.lessonPlans.total }}</div>
            <div class="stat-label">کل طرح‌ها</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ data()!.lessonPlans.submitted }}</div>
            <div class="stat-label">ثبت‌شده</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ data()!.lessonPlans.approved }}</div>
            <div class="stat-label">تأییدشده</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ data()!.lessonPlans.returned }}</div>
            <div class="stat-label">بازگشتی</div>
          </div>
        </div>
        <a routerLink="/coach/lesson-plans" class="btn btn-sm">مشاهده طرح‌ها</a>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 16px">
      <div class="card" *ngIf="data()?.user">
        <h3 class="card-title">امتیاز و تشویق</h3>
        <div class="stats">
          <div class="stat">
            <div class="stat-num">{{ data()!.user!.totalPoints }}</div>
            <div class="stat-label">امتیاز کل</div>
          </div>
          <div class="stat">
            <div class="stat-num">{{ data()!.user!.recognitionsCount }}</div>
            <div class="stat-label">تشویق</div>
          </div>
        </div>
        <a routerLink="/coach/recognition" class="btn btn-sm">مشاهده درکتابخانه</a>
      </div>

      <div class="card" *ngIf="auth.canApprove()">
        <h3 class="card-title">درخواست‌های در انتظار</h3>
        <div class="stats">
          <div class="stat">
            <div class="stat-num">{{ data()?.pendingApprovals ?? 0 }}</div>
            <div class="stat-label">کاربر منتظر تأیید</div>
          </div>
        </div>
        <a routerLink="/coach/approvals" class="btn btn-sm">مدیریت تأییدها</a>
      </div>
    </div>

    <div class="card" style="margin-top: 16px">
      <h3 class="card-title">نُهضت — درس‌پلنر</h3>
      <div class="stats">
        <div class="stat">
          <div class="stat-num">{{ rings().length }}</div>
          <div class="stat-label">حلقه‌های من</div>
        </div>
        <div class="stat">
          <div class="stat-num">{{ ringStudentCount() }}</div>
          <div class="stat-label">شاگردان حلقه‌ها</div>
        </div>
      </div>
      <div *ngIf="rings().length > 0" class="nehzat-rings">
        <span class="badge" *ngFor="let r of rings()">{{ r.name }}</span>
      </div>
      <div class="toolbar" style="margin-top: 12px">
        <a routerLink="/coach/rings" class="btn btn-sm">مشاهده حلقه‌ها</a>
        <a routerLink="/coach/students" class="btn btn-secondary btn-sm">شاگردان</a>
      </div>
    </div>

    <div class="card" style="margin-top: 16px" *ngIf="data()">
      <h3 class="card-title">اعلان‌های اخیر</h3>
      <div *ngIf="data()!.recentNotifications.length === 0" class="empty">اعلانی وجود ندارد.</div>
      <table class="lp-table" *ngIf="data()!.recentNotifications.length > 0">
        <thead>
          <tr>
            <th>نوع</th>
            <th>عنوان</th>
            <th>توضیحات</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let n of data()!.recentNotifications">
            <td><span class="badge">{{ notificationTypeLabel(n.type) }}</span></td>
            <td>{{ n.title }}</td>
            <td>{{ n.body || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }
    .stat {
      background: var(--lp-bg);
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .stat-num {
      font-size: 24px;
      font-weight: 700;
      color: var(--lp-primary);
    }
    .stat-label {
      font-size: 12px;
      color: var(--lp-muted);
      margin-top: 4px;
    }
    .nehzat-rings {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
  `
})
export class MorabbiDashboardComponent implements OnInit {
  readonly auth = inject(MorabbiApiService);
  readonly lpApi = inject(LESSON_PLANNER_API) as LessonPlannerApi;
  readonly notificationTypeLabel = notificationTypeLabelFn;
  readonly roleLabel = roleLabelFn;
  readonly data = signal<DashboardData | null>(null);
  readonly error = signal<string | null>(null);
  readonly rings = signal<Ring[]>([]);
  readonly ringStudentCount = signal(0);

  ngOnInit(): void {
    this.auth.getDashboard().subscribe({
      next: (d) => this.data.set(d),
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت داشبورد')
    });
    this.lpApi.getMyRings().subscribe({
      next: (r) => this.rings.set(r ?? []),
      error: () => {}
    });
    this.lpApi.getMyRingStudents().subscribe({
      next: (s) => this.ringStudentCount.set(s?.length ?? 0),
      error: () => {}
    });
  }
}
