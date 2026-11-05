import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);
import { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { Ring } from '../../../core/models/lesson-planner.models';
import { MorabbiApiService } from './morabbi-api.service';
import { DashboardData, DailyReport } from './morabbi.models';
import { notificationTypeLabel as notificationTypeLabelFn, roleLabel as roleLabelFn } from './morabbi-labels';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, RouterLink, BaseChartDirective],
  template: `
    <div class="page-header">
      <h1 class="page-title">داشبورد</h1>
      <span class="badge" *ngIf="data()?.user">{{ roleLabel(data()!.user!.role) }}</span>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>

    <div class="alert alert-info" *ngIf="auth.pendingOfflineReports() > 0">
      ⏳ {{ auth.pendingOfflineReports() }} گزارش آفلاین در صف ارسال است — پس از برقراری اتصال به‌صورت خودکار ارسال می‌شوند.
    </div>

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

    <div class="card" style="margin-top: 16px" *ngIf="reportTrend()">
      <h3 class="card-title">تحلیل عملکرد — گزارش‌های روزانه</h3>
      <div class="stats">
        <div class="stat" *ngIf="approvalRate() !== null">
          <div class="stat-num">{{ approvalRate() }}٪</div>
          <div class="stat-label">نرخ تأیید</div>
        </div>
        <div class="stat">
          <div class="stat-num">{{ thisMonthCount() }}</div>
          <div class="stat-label">گزارش این ماه</div>
        </div>
      </div>
      <div class="chart-wrap">
        <canvas baseChart [data]="reportTrend()" [options]="chartOptions" type="line"></canvas>
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
    .chart-wrap {
      position: relative;
      height: 220px;
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
  readonly reportTrend = signal<ChartData<'line'> | undefined>(undefined);
  readonly approvalRate = signal<number | null>(null);
  readonly thisMonthCount = signal(0);
  readonly chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} گزارش`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

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
    this.auth.getReports().subscribe({
      next: (reports) => this.buildTrend(reports ?? []),
      error: () => {}
    });
  }

  private buildTrend(reports: DailyReport[]): void {
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('fa-IR', { month: 'short' })
      });
    }
    const counts = new Map<string, number>(months.map((m) => [m.key, 0]));
    const currentKey = months[months.length - 1].key;
    let approved = 0;
    for (const r of reports) {
      if (r.status === 'APPROVED') approved++;
      const d = new Date(r.date || r.createdAt);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
      if (key === currentKey) this.thisMonthCount.set(this.thisMonthCount() + 1);
    }
    this.approvalRate.set(reports.length > 0 ? Math.round((approved / reports.length) * 100) : null);
    this.reportTrend.set({
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: 'تعداد گزارش‌ها',
          data: months.map((m) => counts.get(m.key) ?? 0),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#3b82f6'
        }
      ]
    });
  }
}
