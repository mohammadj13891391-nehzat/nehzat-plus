import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';

import type {
  Branch,
  BranchManager,
  BranchPerformance,
  Coach,
  CoachPerformance,
  CreateStudentPayload,
  CurrentUser,
  Student,
  UpdateStudentPayload
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

type Tab = 'info' | 'performance' | 'coaches' | 'students';

@Component({
  selector: 'app-branch-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
            <h1>پنل مسئول شعبه</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="header-nav">
          <a class="nav-link" routerLink="/branch-manager/spiritual" routerLinkActive="nav-link-active">مسیر معنوی</a>
          <a class="nav-link" routerLink="/branch-manager/competitions" routerLinkActive="nav-link-active">مسابقات</a>
          <a class="nav-link" routerLink="/branch-manager/leagues" routerLinkActive="nav-link-active">لیگ‌ها</a>
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
          [class.tab-active]="activeTab() === 'info'"
          (click)="activeTab.set('info')"
        >
          اطلاعات شعبه
        </button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'performance'"
          (click)="activeTab.set('performance')"
        >
          عملکرد
        </button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'coaches'"
          (click)="activeTab.set('coaches')"
        >
          مربیان
        </button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'students'"
          (click)="activeTab.set('students')"
        >
          دانش‌آموزان
        </button>
      </nav>

      <section class="main-content">
        @if (loading()) {
          <p class="muted">در حال بارگذاری اطلاعات…</p>
        } @else if (errorMessage()) {
          <p class="error-text">{{ errorMessage() }}</p>
        } @else {
          <!-- اطلاعات شعبه -->
          @if (activeTab() === 'info') {
            @if (branch(); as b) {
              <article class="card">
                <h2 class="card-title">مشخصات شعبه</h2>
                <dl class="info-grid">
                  <div class="info-item"><dt>نام شعبه</dt><dd>{{ b.name }}</dd></div>
                  <div class="info-item"><dt>استان</dt><dd>{{ b.province }}</dd></div>
                  <div class="info-item"><dt>شناسه</dt><dd>{{ b.id }}</dd></div>
                  @if (b.description) {
                    <div class="info-item info-item-wide"><dt>توضیحات</dt><dd>{{ b.description }}</dd></div>
                  }
                </dl>
              </article>
            } @else {
              <p class="muted">شعبه‌ای برای شما ثبت نشده است.</p>
            }

            @if (manager(); as m) {
              <article class="card">
                <h2 class="card-title">اطلاعات مسئول شعبه</h2>
                <dl class="info-grid">
                  <div class="info-item"><dt>نام</dt><dd>{{ m.firstName }} {{ m.lastName }}</dd></div>
                  <div class="info-item"><dt>نام کاربری</dt><dd>{{ m.username }}</dd></div>
                  <div class="info-item"><dt>ایمیل</dt><dd>{{ m.email }}</dd></div>
                  <div class="info-item"><dt>تلفن</dt><dd>{{ m.phoneNumber }}</dd></div>
                  <div class="info-item"><dt>جنسیت</dt><dd>{{ genderLabel(m.gender) }}</dd></div>
                  <div class="info-item"><dt>وضعیت</dt><dd>{{ statusLabel(m.status) }}</dd></div>
                </dl>
              </article>
            }
          }

          <!-- عملکرد -->
          @if (activeTab() === 'performance') {
            @if (branchPerformance(); as bp) {
              <article class="card">
                <h2 class="card-title">عملکرد شعبه</h2>
                <div class="metrics-grid">
                  <div class="metric">
                    <span class="metric-value">{{ bp.studentCount }}</span>
                    <span class="metric-label">دانش‌آموزان</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ bp.averageScore | number: '1.0-1' }}</span>
                    <span class="metric-label">میانگین نمره</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ (bp.attendanceRate * 100) | number: '1.0-0' }}٪</span>
                    <span class="metric-label">نرخ حضور</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ bp.activeCourses }}</span>
                    <span class="metric-label">دوره‌های فعال</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ bp.evaluationCount }}</span>
                    <span class="metric-label">ارزیابی‌ها</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ bp.averageEvaluationScore | number: '1.0-1' }}</span>
                    <span class="metric-label">میانگین نمره ارزیابی</span>
                  </div>
                </div>
              </article>
            } @else {
              <p class="muted">داده عملکردی برای شعبه شما موجود نیست.</p>
            }

            <article class="card">
              <h2 class="card-title">عملکرد مربیان</h2>
              @if (coachPerformance().length > 0) {
                <div class="table-wrap">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>مربی</th>
                        <th>تخصص</th>
                        <th>دوره‌ها</th>
                        <th>دانش‌آموزان</th>
                        <th>میانگین نمره</th>
                        <th>ارزیابی‌ها</th>
                        <th>وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (cp of coachPerformance(); track cp.coachId) {
                        <tr>
                          <td>{{ cp.coachName }}</td>
                          <td>{{ cp.specialization }}</td>
                          <td>{{ cp.assignedCourseCount }}</td>
                          <td>{{ cp.studentCount }}</td>
                          <td>{{ cp.averageStudentScore | number: '1.0-1' }}</td>
                          <td>{{ cp.evaluationCount }}</td>
                          <td>{{ statusLabel(cp.status) }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="muted">هیچ داده عملکرد مربی موجود نیست.</p>
              }
            </article>
          }

          <!-- مربیان -->
          @if (activeTab() === 'coaches') {
            <article class="card">
              <h2 class="card-title">فهرست مربیان شعبه</h2>
              @if (coaches().length > 0) {
                <div class="table-wrap">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>نام</th>
                        <th>نام کاربری</th>
                        <th>تخصص</th>
                        <th>ایمیل</th>
                        <th>تلفن</th>
                        <th>دوره‌ها</th>
                        <th>وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (c of coaches(); track c.id) {
                        <tr>
                          <td>{{ c.firstName }} {{ c.lastName }}</td>
                          <td>{{ c.username }}</td>
                          <td>{{ c.specialization }}</td>
                          <td>{{ c.email }}</td>
                          <td>{{ c.phoneNumber }}</td>
                          <td>{{ c.assignedCourseIds.length }}</td>
                          <td>{{ statusLabel(c.status) }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="muted">هیچ مربی‌ای در این شعبه ثبت نشده است.</p>
              }
            </article>
          }

          <!-- دانش‌آموزان -->
          @if (activeTab() === 'students') {
            <article class="card">
              <div class="card-header-row">
                <h2 class="card-title">مدیریت دانش‌آموزان شعبه</h2>
                <button type="button" class="btn-primary" (click)="openCreateForm()">
                  افزودن دانش‌آموز
                </button>
              </div>

              @if (students().length > 0) {
                <div class="table-wrap">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>نام</th>
                        <th>نام کاربری</th>
                        <th>کد دانش‌آموزی</th>
                        <th>ایمیل</th>
                        <th>تلفن</th>
                        <th>وضعیت</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (s of students(); track s.id) {
                        <tr>
                          <td>{{ s.firstName }} {{ s.lastName }}</td>
                          <td>{{ s.username }}</td>
                          <td>{{ s.studentId }}</td>
                          <td>{{ s.email }}</td>
                          <td>{{ s.phoneNumber }}</td>
                          <td>{{ statusLabel(s.status) }}</td>
                          <td>
                            <button type="button" class="btn-link" (click)="openEditForm(s)">ویرایش</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="muted">هیچ دانش‌آموزی در این شعبه ثبت نشده است.</p>
              }
            </article>

            @if (formVisible()) {
              <article class="card form-card">
                <h2 class="card-title">{{ editingId() === null ? 'افزودن دانش‌آموز' : 'ویرایش دانش‌آموز' }}</h2>
                <form (ngSubmit)="submitForm()" class="student-form">
                  <div class="form-row">
                    <label class="form-field">
                      <span>نام</span>
                      <input type="text" name="firstName" [(ngModel)]="formModel.firstName" required />
                    </label>
                    <label class="form-field">
                      <span>نام خانوادگی</span>
                      <input type="text" name="lastName" [(ngModel)]="formModel.lastName" required />
                    </label>
                  </div>
                  <div class="form-row">
                    <label class="form-field">
                      <span>نام کاربری</span>
                      <input type="text" name="username" [(ngModel)]="formModel.username" required />
                    </label>
                    @if (editingId() === null) {
                      <label class="form-field">
                        <span>رمز عبور</span>
                        <input type="password" name="password" [(ngModel)]="formModel.password" required />
                      </label>
                    }
                  </div>
                  <div class="form-row">
                    <label class="form-field">
                      <span>ایمیل</span>
                      <input type="email" name="email" [(ngModel)]="formModel.email" />
                    </label>
                    <label class="form-field">
                      <span>تلفن</span>
                      <input type="text" name="phoneNumber" [(ngModel)]="formModel.phoneNumber" />
                    </label>
                  </div>
                  <div class="form-row">
                    <label class="form-field">
                      <span>کد دانش‌آموزی</span>
                      <input type="text" name="studentId" [(ngModel)]="formModel.studentId" />
                    </label>
                    <label class="form-field">
                      <span>کد ملی</span>
                      <input type="text" name="nationalCode" [(ngModel)]="formModel.nationalCode" />
                    </label>
                  </div>
                  @if (formError()) {
                    <p class="error-text">{{ formError() }}</p>
                  }
                  <div class="form-actions">
                    <button type="submit" class="btn-primary" [disabled]="submitting()">
                      {{ submitting() ? 'در حال ذخیره…' : 'ذخیره' }}
                    </button>
                    <button type="button" class="btn-secondary" (click)="closeForm()" [disabled]="submitting()">انصراف</button>
                  </div>
                </form>
              </article>
            }
          }
        }
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
    .header-nav { display: flex; align-items: center; gap: 0.5rem; }
    .nav-link { color: var(--lp-primary, #2563eb); text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-weight: 500; }
    .nav-link:hover { background: rgba(37, 99, 235, 0.08); }
    .nav-link-active { background: rgba(37, 99, 235, 0.12); font-weight: 700; }

    .tabs { display: flex; gap: 0.25rem; padding: 0 2rem; background: var(--lp-surface, #fff); border-bottom: 1px solid var(--lp-border, #e5e7eb); }
    .tab { background: transparent; border: none; border-bottom: 3px solid transparent; padding: 0.75rem 1.25rem; cursor: pointer; color: var(--lp-muted, #6b7280); font-weight: 500; font-size: 0.95rem; }
    .tab:hover { color: var(--lp-primary, #2563eb); }
    .tab-active { color: var(--lp-primary, #2563eb); border-bottom-color: var(--lp-primary, #2563eb); font-weight: 700; }

    .main-content { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .error-text { color: var(--lp-danger, #dc2626); margin: 0; }

    .card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.75rem; padding: 1.5rem; }
    .card-title { margin: 0 0 1rem; font-size: 1.1rem; color: var(--lp-text, #111827); }
    .card-header-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
    .card-header-row .card-title { margin: 0; }

    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin: 0; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .info-item-wide { grid-column: 1 / -1; }
    .info-item dt { font-size: 0.8rem; color: var(--lp-muted, #6b7280); }
    .info-item dd { margin: 0; font-weight: 600; color: var(--lp-text, #111827); }

    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .metric { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; padding: 1rem; background: var(--lp-bg, #f8f9fa); border-radius: 0.5rem; border: 1px solid var(--lp-border, #e5e7eb); }
    .metric-value { font-size: 1.75rem; font-weight: 700; color: var(--lp-primary, #2563eb); }
    .metric-label { font-size: 0.85rem; color: var(--lp-muted, #6b7280); }

    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .data-table th, .data-table td { padding: 0.65rem 0.75rem; text-align: right; border-bottom: 1px solid var(--lp-border, #e5e7eb); }
    .data-table th { color: var(--lp-muted, #6b7280); font-weight: 600; background: var(--lp-bg, #f8f9fa); }
    .data-table tbody tr:hover { background: var(--lp-bg, #f8f9fa); }

    .btn-primary { background: var(--lp-primary, #2563eb); color: #fff; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; font-weight: 500; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: transparent; color: var(--lp-muted, #6b7280); border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; font-weight: 500; }
    .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-link { background: transparent; color: var(--lp-primary, #2563eb); border: none; cursor: pointer; padding: 0.25rem 0.5rem; font-weight: 500; }

    .form-card { margin-top: 1.5rem; }
    .student-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .form-field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.9rem; color: var(--lp-text, #111827); }
    .form-field input { padding: 0.5rem 0.75rem; border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.5rem; background: var(--lp-surface, #fff); color: var(--lp-text, #111827); }
    .form-field input:focus { outline: none; border-color: var(--lp-primary, #2563eb); }
    .form-actions { display: flex; gap: 0.75rem; }
  `]
})
export class BranchManagerComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(LESSON_PLANNER_API);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  readonly activeTab = signal<Tab>('info');
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly branch = signal<Branch | null>(null);
  readonly manager = signal<BranchManager | null>(null);
  readonly branchPerformance = signal<BranchPerformance | null>(null);
  readonly coachPerformance = signal<CoachPerformance[]>([]);
  readonly coaches = signal<Coach[]>([]);
  readonly students = signal<Student[]>([]);

  readonly formVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly submitting = signal(false);
  readonly formError = signal('');
  formModel: CreateStudentPayload = this.emptyFormModel();

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'branch_manager') {
      void this.router.navigateByUrl(this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee'));
      return;
    }
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      branches: this.api.getBranches().pipe(catchError(() => of([] as Branch[]))),
      managers: this.api.getBranchManagers().pipe(catchError(() => of([] as BranchManager[]))),
      performance: this.api.getBranchPerformance().pipe(catchError(() => of([] as BranchPerformance[]))),
      coachPerf: this.api.getCoachPerformance().pipe(catchError(() => of([] as CoachPerformance[]))),
      coaches: this.api.getCoaches().pipe(catchError(() => of([] as Coach[]))),
      students: this.api.getStudents().pipe(catchError(() => of([] as Student[])))
    }).subscribe({
      next: (data) => {
        const branchId = this.currentUser?.branchId;

        const myBranch = branchId != null
          ? data.branches.find((b) => b.id === branchId) ?? null
          : data.branches[0] ?? null;
        this.branch.set(myBranch);

        const resolvedBranchId = myBranch?.id ?? branchId;
        const myManager = data.managers.find((m) => m.branchId === resolvedBranchId) ?? null;
        this.manager.set(myManager);

        const myPerf = resolvedBranchId != null
          ? data.performance.find((p) => p.branchId === resolvedBranchId) ?? null
          : null;
        this.branchPerformance.set(myPerf);

        this.coachPerformance.set(data.coachPerf);
        this.coaches.set(
          resolvedBranchId != null
            ? data.coaches.filter((c) => c.branchId === resolvedBranchId)
            : data.coaches
        );
        this.students.set(
          resolvedBranchId != null
            ? data.students.filter((s) => s.branchId === resolvedBranchId)
            : data.students
        );

        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('بارگذاری اطلاعات با خطا مواجه شد.');
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  genderLabel(gender: string): string {
    switch (gender) {
      case 'male': return 'پسر';
      case 'female': return 'دختر';
      case 'mixed': return 'مختلط';
      default: return gender;
    }
  }

  statusLabel(status: string): string {
    return status === 'active' ? 'فعال' : 'غیرفعال';
  }

  openCreateForm(): void {
    this.editingId.set(null);
    this.formModel = this.emptyFormModel();
    this.formError.set('');
    this.formVisible.set(true);
  }

  openEditForm(student: Student): void {
    this.editingId.set(student.id);
    this.formModel = {
      username: student.username,
      password: '',
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      studentId: student.studentId,
      nationalCode: '',
      branchId: student.branchId,
      gender: student.gender
    };
    this.formError.set('');
    this.formVisible.set(true);
  }

  closeForm(): void {
    this.formVisible.set(false);
    this.editingId.set(null);
    this.formError.set('');
    this.formModel = this.emptyFormModel();
  }

  submitForm(): void {
    this.formError.set('');
    const branchId = this.branch()?.id ?? this.currentUser?.branchId;
    if (!branchId) {
      this.formError.set('شناسه شعبه مشخص نیست.');
      return;
    }

    this.submitting.set(true);
    const payload: CreateStudentPayload = { ...this.formModel, branchId };

    if (this.editingId() === null) {
      this.api.createStudent(payload).subscribe({
        next: (created) => {
          this.students.update((list) => [...list, created]);
          this.submitting.set(false);
          this.closeForm();
        },
        error: () => {
          this.formError.set('افزودن دانش‌آموز با خطا مواجه شد.');
          this.submitting.set(false);
        }
      });
    } else {
      const id = this.editingId()!;
      const updatePayload: UpdateStudentPayload = { ...payload };
      this.api.updateStudent(id, updatePayload).subscribe({
        next: (updated) => {
          this.students.update((list) => list.map((s) => (s.id === id ? updated : s)));
          this.submitting.set(false);
          this.closeForm();
        },
        error: () => {
          this.formError.set('به‌روزرسانی دانش‌آموز با خطا مواجه شد.');
          this.submitting.set(false);
        }
      });
    }
  }

  private emptyFormModel(): CreateStudentPayload {
    return {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      studentId: '',
      nationalCode: '',
      branchId: this.currentUser?.branchId,
      gender: ''
    };
  }
}