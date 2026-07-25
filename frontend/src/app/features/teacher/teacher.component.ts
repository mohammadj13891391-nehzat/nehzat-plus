import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import type {
  Teacher,
  TeacherDashboardSummary,
  AssignmentGrading,
  AssignmentSubmission,
  CurrentUser
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import type { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';

type TabKey = 'dashboard' | 'courses' | 'gradings' | 'pending';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="role-page">
      <header class="site-header">
        <div class="brand-wrap">
          <img
            src="assets/nehzat.png"
            alt="لوگو سایت"
            class="site-logo"
            [class.hidden]="logoHidden"
            (error)="logoHidden = true"
          />
          <div>
            <h1>پنل استاد</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>

      <nav class="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'dashboard'"
          (click)="activeTab.set('dashboard')"
        >داشبورد</button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'courses'"
          (click)="activeTab.set('courses')"
        >دوره‌های من</button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'gradings'"
          (click)="activeTab.set('gradings')"
        >نمره‌دهی‌ها</button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'pending'"
          (click)="activeTab.set('pending')"
        >منتظر نمره‌دهی</button>
      </nav>

      <section class="main-content">
        @if (activeTab() === 'dashboard') {
          <div class="card-section">
            <h2>خلاصه داشبورد</h2>
            @if (dashboardSummary$ | async; as summary) {
              <div class="summary-grid">
                <div class="stat-card">
                  <div class="stat-icon">📚</div>
                  <div class="stat-info">
                    <span class="stat-value">{{ summary.totalCourses }}</span>
                    <span class="stat-label">دوره‌های فعال</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">👥</div>
                  <div class="stat-info">
                    <span class="stat-value">{{ summary.totalStudents }}</span>
                    <span class="stat-label">دانش‌آموزان</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">⏳</div>
                  <div class="stat-info">
                    <span class="stat-value">{{ summary.pendingGradings }}</span>
                    <span class="stat-label">منتظر نمره‌دهی</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">✅</div>
                  <div class="stat-info">
                    <span class="stat-value">{{ summary.completedGradings }}</span>
                    <span class="stat-label">نمره‌دهی شده</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">📊</div>
                  <div class="stat-info">
                    <span class="stat-value">{{ summary.averageScore | number:'1.1-1' }}</span>
                    <span class="stat-label">میانگین نمره</span>
                  </div>
                </div>
              </div>
            } @else {
              <p class="muted">در حال بارگذاری...</p>
            }
          </div>
        }

        @if (activeTab() === 'courses') {
          <div class="card-section">
            <h2>دوره‌های من</h2>
            @if (courses$ | async; as courses) {
              @if (courses.length === 0) {
                <p class="muted">دوره‌ای به شما تخصیص داده نشده است.</p>
              } @else {
                <div class="courses-grid">
                  @for (course of courses; track course.id) {
                    <div class="course-card">
                      <h4>{{ course.title }}</h4>
                      <p class="muted">کد: {{ course.courseCode }}</p>
                      <p class="muted">{{ course.description }}</p>
                      <div class="course-meta">
                        <span>شروع: {{ course.startDate | date:'yyyy/MM/dd' }}</span>
                        <span>پایان: {{ course.endDate | date:'yyyy/MM/dd' }}</span>
                      </div>
                      <span class="status-badge" [class.active]="course.status === 'active'">
                        {{ course.status === 'active' ? 'فعال' : 'غیرفعال' }}
                      </span>
                    </div>
                  }
                </div>
              }
            } @else {
              <p class="muted">در حال بارگذاری...</p>
            }
          </div>
        }

        @if (activeTab() === 'gradings') {
          <div class="card-section">
            <h2>نمره‌دهی‌های انجام شده</h2>
            @if (gradings$ | async; as gradings) {
              @if (gradings.length === 0) {
                <p class="muted">هنوز نمره‌دهی‌ای انجام نشده است.</p>
              } @else {
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>دانش‌آموز</th>
                        <th>تکلیف</th>
                        <th>نمره روزانه</th>
                        <th>نمره تجمعی</th>
                        <th>وضعیت</th>
                        <th>بازخورد</th>
                        <th>تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (g of gradings; track g.id) {
                        <tr>
                          <td data-label="دانش‌آموز">#{{ g.submissionId }}</td>
                          <td data-label="تکلیف">#{{ g.submission?.assignmentId ?? '-' }}</td>
                          <td data-label="نمره روزانه">{{ g.dailyScore ?? '-' }}</td>
                          <td data-label="نمره تجمعی">{{ g.cumulativeScore ?? '-' }}</td>
                          <td data-label="وضعیت">
                            <span class="status-badge" [class]="getStatusClass(g.status)">
                              {{ getStatusLabel(g.status) }}
                            </span>
                          </td>
                          <td data-label="بازخورد">{{ g.feedback ?? '-' }}</td>
                          <td data-label="تاریخ">{{ g.gradedAt | date:'yyyy/MM/dd HH:mm' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            } @else {
              <p class="muted">در حال بارگذاری...</p>
            }
          </div>
        }

        @if (activeTab() === 'pending') {
          <div class="card-section">
            <h2>ارسال‌های در انتظار نمره‌دهی</h2>
            @if (pendingGradings$ | async; as submissions) {
              @if (submissions.length === 0) {
                <p class="muted">هیچ ارسالی در انتظار نمره‌دهی نیست.</p>
              } @else {
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>دانش‌آموز</th>
                        <th>تکلیف</th>
                        <th>تاریخ ارسال</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (s of submissions; track s.id) {
                        <tr>
                          <td data-label="دانش‌آموز">#{{ s.submissionId }}</td>
                          <td data-label="تکلیف">#{{ s.submission?.assignmentId ?? '-' }}</td>
                          <td data-label="تاریخ">{{ s.submissionDate | date:'yyyy/MM/dd' }}</td>
                          <td data-label="عملیات">
                            <button
                              type="button"
                              class="action-btn grade"
                              (click)="openGradeModal(s)"
                            >نمره‌دهی</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            } @else {
              <p class="muted">در حال بارگذاری...</p>
            }
          </div>
        }
      </section>

      @if (showGradeModal() && selectedSubmission()) {
        <div class="modal-backdrop" (click)="closeGradeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <h5>نمره‌دهی به ارسال</h5>
              <button type="button" class="btn-secondary" (click)="closeGradeModal()">بستن</button>
            </header>
            <div class="modal-body">
              <div class="submission-info">
                <p><strong>دانش‌آموز:</strong> #{{ selectedSubmission()!.studentId }}</p>
                <p><strong>تکلیف:</strong> #{{ selectedSubmission()!.assignmentId }}</p>
                <p><strong>تاریخ ارسال:</strong> {{ selectedSubmission()!.submissionDate | date:'yyyy/MM/dd' }}</p>
              </div>
              <form (ngSubmit)="submitGrade()" class="grade-form">
                <div class="form-group">
                  <label for="dailyScore">نمره روزانه (۰-۱۰۰)</label>
                  <input
                    type="number"
                    id="dailyScore"
                    [(ngModel)]="gradeForm.dailyScore"
                    name="dailyScore"
                    min="0"
                    max="100"
                  />
                </div>
                <div class="form-group">
                  <label for="cumulativeScore">نمره تجمعی (۰-۱۰۰)</label>
                  <input
                    type="number"
                    id="cumulativeScore"
                    [(ngModel)]="gradeForm.cumulativeScore"
                    name="cumulativeScore"
                    min="0"
                    max="100"
                  />
                </div>
                <div class="form-group">
                  <label for="status">وضعیت</label>
                  <select id="status" [(ngModel)]="gradeForm.status" name="status">
                    <option value="graded">نمره‌دهی شده</option>
                    <option value="pending">در انتظار</option>
                    <option value="late">دیرکرد</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="feedback">بازخورد</label>
                  <textarea
                    id="feedback"
                    [(ngModel)]="gradeForm.feedback"
                    name="feedback"
                    rows="4"
                    placeholder="بازخورد استاد..."
                  ></textarea>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn-primary" [disabled]="savingGrade()">
                    {{ savingGrade() ? 'در حال ثبت...' : 'ثبت نمره' }}
                  </button>
                  <button type="button" class="btn-secondary" (click)="closeGradeModal()">انصراف</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    .role-page { direction: rtl; min-height: 100vh; background: var(--lp-bg, #f8f9fa); }
    .site-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem; background: var(--lp-surface, #fff);
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .brand-wrap { display: flex; align-items: center; gap: 1rem; }
    .site-logo { width: 48px; height: 48px; object-fit: contain; }
    .site-logo.hidden { display: none; }
    h1 { margin: 0; font-size: 1.25rem; color: var(--lp-text, #1f2937); }
    .muted { color: var(--lp-muted, #6b7280); margin: 0; }
    .menu-trigger {
      background: var(--lp-primary, #2563eb); color: #fff; border: none;
      border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer;
    }
    .menu-trigger:hover { opacity: 0.9; }

    .tabs {
      display: flex; gap: 0.25rem; padding: 0 2rem;
      background: var(--lp-surface, #fff);
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .tab {
      background: transparent; border: none; border-bottom: 2px solid transparent;
      padding: 0.75rem 1.25rem; cursor: pointer; font-size: 0.95rem;
      color: var(--lp-muted, #6b7280); font-weight: 500;
    }
    .tab:hover { color: var(--lp-text, #1f2937); background: var(--lp-bg, #f8f9fa); }
    .tab-active {
      color: var(--lp-primary, #2563eb); border-bottom-color: var(--lp-primary, #2563eb);
      font-weight: 700;
    }

    .main-content { padding: 2rem; }
    h2 { margin-top: 0; color: var(--lp-text, #1f2937); }

    .card-section { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.5rem; padding: 1.5rem; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .stat-card {
      display: flex; align-items: center; gap: 1rem;
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem; padding: 1.25rem;
    }
    .stat-icon { font-size: 2rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--lp-primary, #2563eb); }
    .stat-label { font-size: 0.85rem; color: var(--lp-muted, #6b7280); }

    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
    .course-card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem; padding: 1.5rem;
    }
    .course-card h4 { margin-top: 0; color: var(--lp-text, #1f2937); }
    .course-meta { display: flex; gap: 1rem; margin: 0.75rem 0; }
    .course-meta span { font-size: 0.85rem; color: var(--lp-muted, #6b7280); }
    .status-badge {
      display: inline-block; padding: 0.25rem 0.75rem;
      border-radius: 9999px; font-size: 0.8rem; font-weight: 500;
    }
    .status-badge.active { background: #dcfce7; color: #166534; }
    .status-badge:not(.active) { background: #fef2f2; color: #991b1b; }

    .table-container { overflow-x: auto; }
    .data-table {
      width: 100%; border-collapse: collapse;
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem; overflow: hidden;
    }
    .data-table th, .data-table td {
      padding: 0.75rem 1rem; text-align: right;
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .data-table th {
      background: var(--lp-bg, #f8f9fa); font-weight: 600;
      color: var(--lp-text, #1f2937); white-space: nowrap;
    }
    .data-table tbody tr:hover { background: var(--lp-bg, #f8f9fa); }
    .status-badge {
      display: inline-block; padding: 0.25rem 0.75rem;
      border-radius: 9999px; font-size: 0.8rem; font-weight: 500;
    }
    .status-badge.graded { background: #dcfce7; color: #166534; }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.late { background: #fef2f2; color: #991b1b; }

    .action-btn {
      padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem;
      font-size: 0.85rem; cursor: pointer; margin-left: 0.5rem;
    }
    .action-btn.grade { background: var(--lp-primary, #2563eb); color: #fff; }
    .action-btn.grade:hover { opacity: 0.9; }

    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-content {
      background: var(--lp-surface, #fff);
      border-radius: 0.75rem; padding: 1.5rem; width: 100%; max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .modal-header h5 { margin: 0; }
    .submission-info {
      background: var(--lp-bg, #f8f9fa); border-radius: 0.5rem; padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .submission-info p { margin: 0.5rem 0; }
    .grade-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 500; color: var(--lp-text, #1f2937); }
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem;
      font-size: 1rem;
      background: var(--lp-surface, #fff);
      color: var(--lp-text, #1f2937);
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--lp-primary, #2563eb);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }
    .form-actions { display: flex; gap: 1rem; padding-top: 1rem; }
    .btn-primary {
      background: var(--lp-primary, #2563eb); color: #fff; border: none;
      border-radius: 0.5rem; padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 600;
    }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary {
      background: var(--lp-bg, #f8f9fa); color: var(--lp-text, #1f2937); border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem; padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 500;
    }
    .btn-secondary:hover { background: var(--lp-border, #e5e7eb); }
  `]
})
export class TeacherComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(LESSON_PLANNER_API) as LessonPlannerApi;
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  logoHidden = false;
  savingGrade = signal(false);

  readonly activeTab = signal<TabKey>('dashboard');
  readonly showGradeModal = signal(false);
  readonly selectedSubmission = signal<AssignmentSubmission | null>(null);

  readonly dashboardSummary$: Observable<TeacherDashboardSummary>;
  readonly courses$: Observable<any[]>;
  gradings$!: Observable<AssignmentGrading[]>;
  pendingGradings$!: Observable<any[]>;

  gradeForm: GradeSubmissionRequest = {
    submissionId: 0,
    teacherId: 0,
    dailyScore: 0,
    cumulativeScore: 0,
    status: 'graded',
    feedback: ''
  };

  constructor() {
    this.dashboardSummary$ = this.api.getTeacherDashboardSummary(0);
    this.courses$ = this.api.getTeacherCourses(0);
    this.gradings$ = this.api.getTeacherGradings(0);
    this.pendingGradings$ = this.api.getPendingGradings(0);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    if (this.currentUser.userType !== 'teacher') {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser.userType ?? 'trainee')
      );
    }
  }

  getStatusClass(status?: string): string {
    return status ?? 'pending';
  }

  getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      graded: 'نمره‌دهی شده',
      pending: 'در انتظار',
      late: 'دیرکرد'
    };
    return labels[status ?? ''] ?? status ?? 'نامشخص';
  }

  openGradeModal(submission: any): void {
    this.selectedSubmission.set(submission);
    this.gradeForm = {
      submissionId: submission.id,
      teacherId: this.currentUser?.studentId ?? 0,
      dailyScore: 0,
      cumulativeScore: 0,
      status: 'graded',
      feedback: ''
    };
    this.showGradeModal.set(true);
  }

  closeGradeModal(): void {
    this.showGradeModal.set(false);
    this.selectedSubmission.set(null);
  }

  submitGrade(): void {
    if (this.savingGrade()) return;
    this.savingGrade.set(true);

    this.api.gradeSubmission(this.gradeForm).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.savingGrade.set(false);
        this.closeGradeModal();
        // Refresh data
        this.gradings$ = this.api.getTeacherGradings(this.currentUser?.studentId ?? 0);
        this.pendingGradings$ = this.api.getPendingGradings(this.currentUser?.studentId ?? 0);
      },
      error: (err) => {
        this.savingGrade.set(false);
        alert('خطا در ثبت نمره: ' + (err.error?.message || err.message));
      }
    });
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}

interface GradeSubmissionRequest {
  submissionId: number;
  teacherId: number;
  dailyScore: number;
  cumulativeScore: number;
  status: string;
  feedback: string;
}