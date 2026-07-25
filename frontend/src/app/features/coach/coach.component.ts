import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import type {
  Assignment,
  AssignmentSubmission,
  CurrentUser,
  Student,
  StudentProgressResponse
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

interface StudentRow {
  student: Student;
  progress: StudentProgressResponse | null;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-coach',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="role-page">
      <header class="site-header">
        <div class="brand-wrap">
          <img
            src="assets/nehzat.png"
            alt="لوگو سایت"
            class="site-logo"
            [hidden]="logoHidden"
            (error)="logoHidden = true"
          />
          <div>
            <h1>پنل مربی</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <nav class="header-nav">
          <a class="nav-link" routerLink="/coach/spiritual" routerLinkActive="nav-link-active">مسیر معنوی</a>
          <a class="nav-link" routerLink="/coach/rings" routerLinkActive="nav-link-active">حلقه‌ها</a>
        </nav>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>

      <section class="main-content">
        <div class="page-title">
          <h2>داشبورد مربی</h2>
          <p class="muted">فهرست دانش‌آموزان و پیشرفت تحصیلی آن‌ها</p>
        </div>

        @if (loading()) {
          <div class="state-box">
            <p class="muted">در حال بارگذاری دانش‌آموزان...</p>
          </div>
        } @else if (error()) {
          <div class="state-box state-error">
            <p>{{ error() }}</p>
            <button type="button" class="retry-btn" (click)="loadStudents()">تلاش مجدد</button>
          </div>
        } @else if (rows().length === 0) {
          <div class="state-box">
            <p class="muted">هیچ دانش‌آموزی یافت نشد.</p>
          </div>
        } @else {
          <div class="summary-strip">
            <div class="summary-pill">
              <span class="pill-value">{{ rows().length }}</span>
              <span class="pill-label">دانش‌آموز</span>
            </div>
            <div class="summary-pill">
              <span class="pill-value">{{ totalAssignments() }}</span>
              <span class="pill-label">تکلیف</span>
            </div>
            <div class="summary-pill">
              <span class="pill-value">{{ totalSubmissions() }}</span>
              <span class="pill-label">ارسال</span>
            </div>
            <div class="summary-pill">
              <span class="pill-value">{{ averageProgress() | number: '1.0-0' }}٪</span>
              <span class="pill-label">میانگین پیشرفت</span>
            </div>
          </div>

          <ul class="student-list">
            @for (row of rows(); track row.student.id) {
              <li class="student-card" [class.expanded]="expandedId() === row.student.id">
                <button
                  type="button"
                  class="student-row"
                  (click)="toggleStudent(row.student.id)"
                  [attr.aria-expanded]="expandedId() === row.student.id"
                >
                  <div class="student-id">
                    <span class="avatar">{{ initials(row.student) }}</span>
                    <div class="student-name">
                      <span class="name">{{ fullName(row.student) }}</span>
                      <span class="sid">{{ row.student.studentId }}</span>
                    </div>
                  </div>

                  <div class="progress-wrap">
                    @if (row.loading) {
                      <span class="muted small">در حال محاسبه پیشرفت...</span>
                    } @else if (row.error) {
                      <span class="muted small">—</span>
                    } @else if (row.progress; as p) {
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          [style.width.%]="progressPercent(p)"
                          [class.low]="progressPercent(p) < 33"
                          [class.mid]="progressPercent(p) >= 33 && progressPercent(p) < 66"
                          [class.high]="progressPercent(p) >= 66"
                        ></div>
                      </div>
                      <span class="progress-text">{{ progressPercent(p) | number: '1.0-0' }}٪</span>
                    } @else {
                      <span class="muted small">بدون داده</span>
                    }
                  </div>

                  <div class="quick-stats">
                    @if (row.progress; as p) {
                      <span class="stat-chip">{{ courseCount(p) }} درس</span>
                      <span class="stat-chip">{{ submissionCount(p) }} ارسال</span>
                    }
                  </div>

                  <span class="chevron" [class.open]="expandedId() === row.student.id">›</span>
                </button>

                @if (expandedId() === row.student.id) {
                  <div class="student-detail">
                    @if (row.loading) {
                      <p class="muted">در حال بارگذاری جزئیات...</p>
                    } @else if (row.error) {
                      <p class="error-text">{{ row.error }}</p>
                    } @else if (row.progress; as p) {
                      @if (p.courses.length === 0) {
                        <p class="muted">دانش‌آموز در هیچ دوره‌ای ثبت‌نام نکرده است.</p>
                      } @else {
                        @for (courseBlock of p.courses; track courseBlock.course.id) {
                          <div class="course-block">
                            <h4 class="course-title">{{ courseBlock.course.title }}</h4>
                            @if (courseBlock.assignments.length === 0) {
                              <p class="muted small">تکلیفی برای این درس ثبت نشده است.</p>
                            } @else {
                              <div class="table-container">
                                <table class="data-table">
                                  <thead>
                                    <tr>
                                      <th>عنوان تکلیف</th>
                                      <th>تاریخ</th>
                                      <th>وضعیت ارسال</th>
                                      <th>نمره</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    @for (assignment of courseBlock.assignments; track assignment.id) {
                                      <tr>
                                        <td>{{ assignment.title }}</td>
                                        <td>{{ assignment.assignmentDate | date: 'shortDate' }}</td>
                                        <td>
                                          @if (findSubmission(p.submissions, assignment.id); as sub) {
                                            <span class="status-badge" [class]="sub.status">
                                              {{ submissionLabel(sub.status) }}
                                            </span>
                                          } @else {
                                            <span class="muted">ارسال نشده</span>
                                          }
                                        </td>
                                        <td>
                                          @if (findSubmission(p.submissions, assignment.id); as sub) {
                                            {{ sub.dailyScore ?? '—' }}
                                          } @else {
                                            —
                                          }
                                        </td>
                                      </tr>
                                    }
                                  </tbody>
                                </table>
                              </div>
                            }
                          </div>
                        }
                      }

                      @if (p.submissions.length > 0) {
                        <div class="submissions-section">
                          <h4>آخرین ارسال‌ها</h4>
                          <ul class="submission-list">
                            @for (sub of p.submissions; track sub.id) {
                              <li class="submission-item">
                                <span class="sub-date">{{ sub.submissionDate | date: 'short' }}</span>
                                <span class="status-badge" [class]="sub.status">
                                  {{ submissionLabel(sub.status) }}
                                </span>
                                @if (sub.dailyScore !== null && sub.dailyScore !== undefined) {
                                  <span class="sub-score">نمره: {{ sub.dailyScore }}</span>
                                }
                                @if (sub.feedback) {
                                  <span class="sub-feedback" title="بازخورد">{{ sub.feedback }}</span>
                                }
                              </li>
                            }
                          </ul>
                        </div>
                      }
                    } @else {
                      <p class="muted">داده‌ای موجود نیست.</p>
                    }
                  </div>
                }
              </li>
            }
          </ul>
        }
      </section>
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
    h1 { margin: 0; font-size: 1.25rem; color: var(--lp-text, #1f2937); }
    h2 { margin: 0 0 0.25rem; font-size: 1.4rem; color: var(--lp-text, #1f2937); }
    .muted { color: var(--lp-muted, #6b7280); margin: 0; }
    .small { font-size: 0.8rem; }
    .menu-trigger {
      background: var(--lp-primary, #2563eb); color: #fff; border: none;
      border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; font-weight: 500;
    }
    .menu-trigger:hover { background: var(--lp-primary-hover, #1d4ed8); }

    .header-nav { display: flex; align-items: center; gap: 0.5rem; }
    .nav-link {
      color: var(--lp-primary, #2563eb); text-decoration: none;
      padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-weight: 500;
    }
    .nav-link:hover { background: rgba(37, 99, 235, 0.08); }
    .nav-link-active { background: rgba(37, 99, 235, 0.12); font-weight: 700; }

    .main-content { padding: 2rem; max-width: 1100px; margin: 0 auto; }
    .page-title { margin-bottom: 1.5rem; }

    .state-box {
      text-align: center; padding: 3rem; background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.75rem;
    }
    .state-error { color: var(--lp-danger, #dc2626); }
    .retry-btn {
      margin-top: 1rem; background: var(--lp-primary, #2563eb); color: #fff;
      border: none; border-radius: 0.5rem; padding: 0.5rem 1.25rem; cursor: pointer;
    }

    .summary-strip {
      display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;
    }
    .summary-pill {
      flex: 1 1 140px; background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.75rem;
      padding: 1rem 1.25rem; text-align: center;
    }
    .pill-value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--lp-primary, #2563eb); }
    .pill-label { font-size: 0.8rem; color: var(--lp-muted, #6b7280); }

    .student-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .student-card {
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem; overflow: hidden;
    }
    .student-card.expanded { border-color: var(--lp-primary, #2563eb); }

    .student-row {
      display: flex; align-items: center; gap: 1rem; width: 100%;
      padding: 1rem 1.25rem; background: transparent; border: none; cursor: pointer;
      text-align: right; font: inherit; color: inherit;
    }
    .student-row:hover { background: var(--lp-bg, #f8f9fa); }

    .student-id { display: flex; align-items: center; gap: 0.75rem; flex: 0 0 auto; min-width: 200px; }
    .avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--lp-primary, #2563eb); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
    }
    .student-name { display: flex; flex-direction: column; }
    .name { font-weight: 600; color: var(--lp-text, #1f2937); }
    .sid { font-size: 0.75rem; color: var(--lp-muted, #6b7280); }

    .progress-wrap { display: flex; align-items: center; gap: 0.75rem; flex: 1 1 auto; min-width: 150px; }
    .progress-bar {
      flex: 1; height: 10px; background: var(--lp-bg, #f1f5f9);
      border-radius: 9999px; overflow: hidden; border: 1px solid var(--lp-border, #e5e7eb);
    }
    .progress-fill { height: 100%; border-radius: 9999px; transition: width 0.3s ease; }
    .progress-fill.low { background: var(--lp-danger, #dc2626); }
    .progress-fill.mid { background: var(--lp-gold, #d97706); }
    .progress-fill.high { background: var(--lp-success, #16a34a); }
    .progress-text { font-size: 0.85rem; font-weight: 600; color: var(--lp-text, #1f2937); min-width: 3rem; }

    .quick-stats { display: flex; gap: 0.5rem; flex: 0 0 auto; }
    .stat-chip {
      background: var(--lp-bg, #f1f5f9); color: var(--lp-muted, #6b7280);
      padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; white-space: nowrap;
    }

    .chevron {
      font-size: 1.5rem; color: var(--lp-muted, #6b7280); transition: transform 0.2s;
      flex-shrink: 0;
    }
    .chevron.open { transform: rotate(90deg); }

    .student-detail {
      padding: 1rem 1.25rem 1.5rem; border-top: 1px solid var(--lp-border, #e5e7eb);
      background: var(--lp-bg, #f8f9fa);
    }
    .error-text { color: var(--lp-danger, #dc2626); }

    .course-block { margin-bottom: 1.5rem; }
    .course-title {
      margin: 0 0 0.5rem; font-size: 1rem; color: var(--lp-text, #1f2937);
      padding-bottom: 0.25rem; border-bottom: 2px solid var(--lp-primary, #2563eb);
    }

    .table-container { overflow-x: auto; }
    .data-table {
      width: 100%; border-collapse: collapse; background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.5rem; overflow: hidden;
    }
    .data-table th, .data-table td {
      padding: 0.6rem 0.85rem; text-align: right;
      border-bottom: 1px solid var(--lp-border, #e5e7eb); font-size: 0.85rem;
    }
    .data-table th { background: var(--lp-bg, #f8f9fa); font-weight: 600; color: var(--lp-text, #1f2937); white-space: nowrap; }
    .data-table tbody tr:hover { background: var(--lp-bg, #f8f9fa); }

    .status-badge {
      display: inline-block; padding: 0.15rem 0.5rem; border-radius: 9999px;
      font-size: 0.72rem; font-weight: 500; white-space: nowrap;
    }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.submitted { background: #dbeafe; color: #1e40af; }
    .status-badge.graded { background: #dcfce7; color: #166534; }
    .status-badge.late { background: #fee2e2; color: #991b1b; }

    .submissions-section { margin-top: 1.5rem; }
    .submissions-section h4 { margin: 0 0 0.5rem; color: var(--lp-text, #1f2937); }
    .submission-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
    .submission-item {
      display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
      background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.82rem;
    }
    .sub-date { color: var(--lp-muted, #6b7280); }
    .sub-score { color: var(--lp-text, #1f2937); font-weight: 600; }
    .sub-feedback { color: var(--lp-muted, #6b7280); font-style: italic; }

    @media (max-width: 768px) {
      .site-header { flex-wrap: wrap; gap: 0.75rem; padding: 1rem; }
      .header-nav { order: 3; width: 100%; justify-content: center; }
      .main-content { padding: 1rem; }
      .student-row { flex-wrap: wrap; }
      .student-id { min-width: 100%; }
      .progress-wrap { min-width: 100%; }
      .quick-stats { width: 100%; }
      .summary-pill { flex: 1 1 45%; }
    }
  `]
})
export class CoachComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  private readonly _rows = signal<StudentRow[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _expandedId = signal<number | null>(null);

  readonly rows = this._rows.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly expandedId = this._expandedId.asReadonly();

  readonly totalAssignments = computed(() =>
    this._rows().reduce((sum, r) => sum + (r.progress ? this.assignmentTotal(r.progress) : 0), 0)
  );
  readonly totalSubmissions = computed(() =>
    this._rows().reduce((sum, r) => sum + (r.progress ? r.progress.submissions.length : 0), 0)
  );
  readonly averageProgress = computed(() => {
    const loaded = this._rows().filter(r => r.progress !== null);
    if (loaded.length === 0) return 0;
    const total = loaded.reduce((sum, r) => sum + this.progressPercent(r.progress!), 0);
    return total / loaded.length;
  });

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'coach') {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee')
      );
      return;
    }
    this.loadStudents();
  }

  loadStudents(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.getStudents().subscribe({
      next: (students) => {
        this._rows.set(students.map(s => ({ student: s, progress: null, loading: false, error: null })));
        this._loading.set(false);
      },
      error: () => {
        this._error.set('بارگذاری فهرست دانش‌آموزان ناموفق بود.');
        this._loading.set(false);
      }
    });
  }

  toggleStudent(studentId: number): void {
    if (this._expandedId() === studentId) {
      this._expandedId.set(null);
      return;
    }
    this._expandedId.set(studentId);
    this.loadProgress(studentId);
  }

  private loadProgress(studentId: number): void {
    const rows = this._rows();
    const idx = rows.findIndex(r => r.student.id === studentId);
    if (idx === -1) return;
    const row = rows[idx];
    if (row.progress !== null || row.loading) return;

    this.updateRow(studentId, { loading: true, error: null });
    this.api.getStudentProgress(studentId).subscribe({
      next: (progress) => {
        this.updateRow(studentId, { progress, loading: false });
      },
      error: () => {
        this.updateRow(studentId, { loading: false, error: 'بارگذاری پیشرفت ناموفق بود.' });
      }
    });
  }

  private updateRow(studentId: number, patch: Partial<StudentRow>): void {
    this._rows.update(rows =>
      rows.map(r => (r.student.id === studentId ? { ...r, ...patch } : r))
    );
  }

  fullName(s: Student): string {
    return `${s.firstName} ${s.lastName}`.trim() || s.studentId;
  }

  initials(s: Student): string {
    const f = s.firstName?.[0] ?? '';
    const l = s.lastName?.[0] ?? '';
    return (f + l).trim() || '?';
  }

  assignmentTotal(p: StudentProgressResponse): number {
    return p.courses.reduce((sum, c) => sum + c.assignments.length, 0);
  }

  progressPercent(p: StudentProgressResponse): number {
    const total = this.assignmentTotal(p);
    if (total === 0) return 0;
    const submitted = p.submissions.filter(
      s => s.status === 'submitted' || s.status === 'graded' || s.isCompleted
    ).length;
    return Math.min(100, Math.round((submitted / total) * 100));
  }

  courseCount(p: StudentProgressResponse): number {
    return p.courses.length;
  }

  submissionCount(p: StudentProgressResponse): number {
    return p.submissions.length;
  }

  findSubmission(submissions: AssignmentSubmission[], assignmentId: number): AssignmentSubmission | undefined {
    return submissions.find(s => s.assignmentId === assignmentId);
  }

  submissionLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'در انتظار',
      submitted: 'ارسال شده',
      graded: 'نمره‌دهی شده',
      late: 'دیرهنگام'
    };
    return labels[status] ?? status;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}