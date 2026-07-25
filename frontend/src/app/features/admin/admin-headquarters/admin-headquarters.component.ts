import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HeadquartersSummary, BranchPerformance, CoachPerformance } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-headquarters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" aria-labelledby="admin-hq-title">
      <header class="section-header">
        <h2 id="admin-hq-title" class="section-title">ستاد مرکزی</h2>
      </header>

      <div class="tabs" style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 2px solid var(--lp-border); padding-bottom: 0.25rem">
        <button type="button" class="tab-btn" [class.active]="headquartersTab === 'summary'" (click)="switchHeadquartersTab('summary')">خلاصه آمار</button>
        <button type="button" class="tab-btn" [class.active]="headquartersTab === 'branches'" (click)="switchHeadquartersTab('branches')">عملکرد شعب</button>
        <button type="button" class="tab-btn" [class.active]="headquartersTab === 'coaches'" (click)="switchHeadquartersTab('coaches')">عملکرد مربیان</button>
      </div>

      @if (headquartersTab === 'summary') {
        @if (loadingHeadquarters) {
          <p class="muted">در حال دریافت اطلاعات...</p>
        } @else if (headquartersSummary) {
          <div class="stats-grid">
            <article class="stat-card"><h3>تعداد متربیان</h3><strong>{{ headquartersSummary.totalStudents }}</strong></article>
            <article class="stat-card"><h3>تعداد مربیان</h3><strong>{{ headquartersSummary.totalCoaches }}</strong></article>
            <article class="stat-card"><h3>تعداد مسئولین شعب</h3><strong>{{ headquartersSummary.totalBranchManagers }}</strong></article>
            <article class="stat-card"><h3>تعداد ارزیابان</h3><strong>{{ headquartersSummary.totalEvaluators }}</strong></article>
            <article class="stat-card"><h3>تعداد والدین</h3><strong>{{ headquartersSummary.totalParents }}</strong></article>
            <article class="stat-card"><h3>تعداد دوره‌ها</h3><strong>{{ headquartersSummary.totalCourses }} ({{ headquartersSummary.activeCourses }} فعال)</strong></article>
            <article class="stat-card"><h3>تعداد تکالیف</h3><strong>{{ headquartersSummary.totalAssignments }}</strong></article>
            <article class="stat-card"><h3>تعداد ارسال‌ها</h3><strong>{{ headquartersSummary.totalSubmissions }}</strong></article>
            <article class="stat-card"><h3>تعداد مکاتب</h3><strong>{{ headquartersSummary.totalMadrasahs }}</strong></article>
            <article class="stat-card"><h3>تعداد شعب</h3><strong>{{ headquartersSummary.totalBranches }}</strong></article>
            <article class="stat-card"><h3>میانگین نمرات</h3><strong>{{ headquartersSummary.averageScore }}/۲۰</strong></article>
            <article class="stat-card"><h3>نرخ حضور</h3><strong>{{ headquartersSummary.averageAttendanceRate }}%</strong></article>
          </div>
        } @else {
          <button type="button" class="btn" (click)="loadHeadquartersSummary()">بارگیری خلاصه آمار</button>
        }
      }

      @if (headquartersTab === 'branches') {
        @if (loadingBranchPerformance) {
          <p class="muted">در حال دریافت اطلاعات عملکرد شعب...</p>
        } @else if (branchPerformanceData.length === 0) {
          <p class="muted">اطلاعاتی موجود نیست.</p>
        } @else {
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>شعبه</th><th>استان</th><th>مکتب</th><th>متربیان</th><th>میانگین نمره</th><th>حضور</th><th>دوره‌ها</th><th>ارزیابی‌ها</th><th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                @for (branch of branchPerformanceData; track branch.branchId) {
                  <tr>
                    <td>{{ branch.branchName }}</td>
                    <td>{{ branch.province }}</td>
                    <td>{{ branch.madrasahName }}</td>
                    <td>{{ branch.studentCount }}</td>
                    <td>{{ branch.averageScore }}/۲۰</td>
                    <td>{{ branch.attendanceRate }}%</td>
                    <td>{{ branch.activeCourses }}</td>
                    <td>{{ branch.evaluationCount }} ({{ branch.averageEvaluationScore }})</td>
                    <td>
                      <span class="status-chip" [class.status-chip--active]="branch.status === 'active'" [class.status-chip--inactive]="branch.status !== 'active'">
                        {{ branch.status === 'active' ? 'فعال' : 'غیرفعال' }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }

      @if (headquartersTab === 'coaches') {
        @if (loadingCoachPerformance) {
          <p class="muted">در حال دریافت اطلاعات عملکرد مربیان...</p>
        } @else if (coachPerformanceData.length === 0) {
          <p class="muted">اطلاعاتی موجود نیست.</p>
        } @else {
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>مربی</th><th>تخصص</th><th>دوره‌ها</th><th>متربیان</th><th>میانگین نمره</th><th>ارزیابی‌ها</th><th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                @for (coach of coachPerformanceData; track coach.coachId) {
                  <tr>
                    <td>{{ coach.coachName }}</td>
                    <td>{{ coach.specialization }}</td>
                    <td>{{ coach.assignedCourseCount }}</td>
                    <td>{{ coach.studentCount }}</td>
                    <td>{{ coach.averageStudentScore }}/۲۰</td>
                    <td>{{ coach.evaluationCount }} ({{ coach.averageEvaluationScore }})</td>
                    <td>
                      <span class="status-chip" [class.status-chip--active]="coach.status === 'active'" [class.status-chip--inactive]="coach.status !== 'active'">
                        {{ coach.status === 'active' ? 'فعال' : 'غیرفعال' }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeadquartersComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  headquartersSummary: HeadquartersSummary | null = null;
  loadingHeadquarters = false;
  branchPerformanceData: BranchPerformance[] = [];
  coachPerformanceData: CoachPerformance[] = [];
  loadingBranchPerformance = false;
  loadingCoachPerformance = false;
  headquartersTab: 'summary' | 'branches' | 'coaches' = 'summary';

  errorMessage = '';
  successMessage = '';

  loadHeadquartersSummary(): void {
    this.loadingHeadquarters = true;
    this.api
      .getHeadquartersSummary()
      .pipe(finalize(() => (this.loadingHeadquarters = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          this.headquartersSummary = summary;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت خلاصه ستاد با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  loadBranchPerformance(): void {
    this.loadingBranchPerformance = true;
    this.api
      .getBranchPerformance()
      .pipe(finalize(() => (this.loadingBranchPerformance = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.branchPerformanceData = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت عملکرد شعب با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  loadCoachPerformance(): void {
    this.loadingCoachPerformance = true;
    this.api
      .getCoachPerformance()
      .pipe(finalize(() => (this.loadingCoachPerformance = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.coachPerformanceData = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت عملکرد مربیان با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  switchHeadquartersTab(tab: 'summary' | 'branches' | 'coaches'): void {
    this.headquartersTab = tab;
    if (tab === 'summary' && !this.headquartersSummary) {
      this.loadHeadquartersSummary();
    } else if (tab === 'branches' && this.branchPerformanceData.length === 0) {
      this.loadBranchPerformance();
    } else if (tab === 'coaches' && this.coachPerformanceData.length === 0) {
      this.loadCoachPerformance();
    }
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
  }
}
