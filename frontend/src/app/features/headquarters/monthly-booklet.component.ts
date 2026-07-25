import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import type {
  MonthlyBooklet,
  CreateMonthlyBookletPayload,
  UpdateMonthlyBookletPayload,
  StudentInfo,
  CurrentUser
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import type { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';

type TabKey = 'list' | 'create' | 'edit';

@Component({
  selector: 'app-monthly-booklet',
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
            <h1>دفترچه‌های ماهانه</h1>
            <p class="muted">مشاهده و مدیریت دفترچه‌های ماهانه دانش‌آموزان</p>
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
          [class.tab-active]="activeTab() === 'list'"
          (click)="activeTab.set('list')"
        >لیست دفترچه‌ها</button>
        @if (canCreate()) {
          <button
            type="button"
            role="tab"
            class="tab"
            [class.tab-active]="activeTab() === 'create'"
            (click)="activeTab.set('create'); resetForm()"
          >ایجاد دفترچه جدید</button>
        }
      </nav>

      <section class="main-content">
        @if (activeTab() === 'list') {
          <div class="card-section">
            <h2>لیست دفترچه‌های ماهانه</h2>
            @if (booklets$ | async; as booklets) {
              @if (booklets.length === 0) {
                <p class="muted">هیچ دفترچه ماهانه‌ای یافت نشد.</p>
              } @else {
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>عنوان</th>
                        <th>دانش‌آموز</th>
                        <th>دوره (ماه/سال)</th>
                        <th>وضعیت</th>
                        <th>ایجادکننده</th>
                        <th>تاریخ ایجاد</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (booklet of booklets; track booklet.id) {
                        <tr>
                          <td data-label="عنوان">{{ booklet.title }}</td>
                          <td data-label="دانش‌آموز">{{ booklet.studentName || '—' }}</td>
                          <td data-label="دوره">{{ getPersianMonthName(booklet.month) }} {{ booklet.year }}</td>
                          <td data-label="وضعیت">
                            <span class="status-badge" [class]="getStatusClass(booklet.status)">
                              {{ getStatusLabel(booklet.status) }}
                            </span>
                          </td>
                          <td data-label="ایجادکننده">{{ booklet.createdByUserName || '—' }}</td>
                          <td data-label="تاریخ ایجاد">{{ formatDate(booklet.createdAt) }}</td>
                          <td data-label="عملیات">
                            <button
                              type="button"
                              class="action-btn edit"
                              (click)="editBooklet(booklet)"
                            >ویرایش</button>
                            <button
                              type="button"
                              class="action-btn delete"
                              (click)="confirmDelete(booklet)"
                            >حذف</button>
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

        @if (activeTab() === 'create' || activeTab() === 'edit') {
          <div class="card-section">
            <h2>{{ activeTab() === 'create' ? 'ایجاد دفترچه ماهانه جدید' : 'ویرایش دفترچه ماهانه' }}</h2>
            <form (ngSubmit)="onSubmit()" class="booklet-form">
              <div class="form-group">
                <label for="studentId">دانش‌آموز *</label>
                <select id="studentId" [(ngModel)]="formData.studentId" name="studentId" required>
                  <option [ngValue]="null">انتخاب دانش‌آموز...</option>
                  @for (student of students(); track student.id) {
                    <option [ngValue]="student.id">{{ student.firstName }} {{ student.lastName }} ({{ student.studentId }})</option>
                  }
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="month">ماه *</label>
                  <select id="month" [(ngModel)]="formData.month" name="month" required>
                    <option [ngValue]="null">انتخاب ماه...</option>
                    @for (m of months; track m.value) {
                      <option [ngValue]="m.value">{{ m.label }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="year">سال *</label>
                  <input
                    type="number"
                    id="year"
                    [(ngModel)]="formData.year"
                    name="year"
                    min="1400"
                    max="1420"
                    required
                    placeholder="مثال: 1403"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="title">عنوان *</label>
                <input
                  type="text"
                  id="title"
                  [(ngModel)]="formData.title"
                  name="title"
                  required
                  maxlength="200"
                  placeholder="عنوان دفترچه..."
                />
              </div>

              <div class="form-group">
                <label for="content">محتوا *</label>
                <textarea
                  id="content"
                  [(ngModel)]="formData.content"
                  name="content"
                  required
                  rows="10"
                  placeholder="محتوا در قالب JSON یا متن ساده..."
                ></textarea>
              </div>

              @if (activeTab() === 'edit') {
                <div class="form-group">
                  <label for="status">وضعیت</label>
                  <select id="status" [(ngModel)]="formData.status" name="status">
                    <option value="draft">پیش‌نویس</option>
                    <option value="published">منتشر شده</option>
                    <option value="archived">بایگانی</option>
                  </select>
                </div>
              }

              <div class="form-actions">
                <button type="submit" class="btn-primary" [disabled]="saving()">
                  {{ saving() ? 'در حال ذخیره...' : (activeTab() === 'create' ? 'ایجاد' : 'به‌روزرسانی') }}
                </button>
                <button type="button" class="btn-secondary" (click)="cancelEdit()">انصراف</button>
              </div>
            </form>
          </div>
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
    .status-badge.draft { background: #fef3c7; color: #92400e; }
    .status-badge.published { background: #dcfce7; color: #166534; }
    .status-badge.archived { background: #f3f4f6; color: #374151; }

    .action-btn {
      padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem;
      font-size: 0.85rem; cursor: pointer; margin-left: 0.5rem;
    }
    .action-btn.edit { background: var(--lp-primary, #2563eb); color: #fff; }
    .action-btn.edit:hover { opacity: 0.9; }
    .action-btn.delete { background: #ef4444; color: #fff; }
    .action-btn.delete:hover { opacity: 0.9; }

    .booklet-form { display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
export class MonthlyBookletComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(LESSON_PLANNER_API) as LessonPlannerApi;
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  logoHidden = false;
  saving = signal(false);

  readonly activeTab = signal<TabKey>('list');
  readonly editingBooklet = signal<MonthlyBooklet | null>(null);

  readonly booklets$ = this.api.getMonthlyBooklets();
  readonly students$ = this.api.getAllStudents();

  // Parse students from getAllStudents()
  students = signal<StudentInfo[]>([]);

  formData: CreateMonthlyBookletPayload & { status?: string } = {
    studentId: 0,
    month: 1,
    year: 1403,
    title: '',
    content: '',
    createdByUserId: 0
  };

  months = [
    { value: 1, label: 'فروردین' },
    { value: 2, label: 'اردیبهشت' },
    { value: 3, label: 'خرداد' },
    { value: 4, label: 'تیر' },
    { value: 5, label: 'مرداد' },
    { value: 6, label: 'شهریور' },
    { value: 7, label: 'مهر' },
    { value: 8, label: 'آبان' },
    { value: 9, label: 'آذر' },
    { value: 10, label: 'دی' },
    { value: 11, label: 'بهمن' },
    { value: 12, label: 'اسفند' }
  ];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }

    // Load students for dropdown
    this.api.getAllStudents().pipe(takeUntilDestroyed()).subscribe(students => {
      this.students.set(students as StudentInfo[]);
    });

    // Set current user as default creator
    if (this.currentUser.studentId) {
      this.formData.createdByUserId = this.currentUser.studentId;
    }
  }

  canCreate(): boolean {
    return ['admin', 'manager', 'coach', 'parent', 'headquarters'].some(role =>
      this.authService.hasRole(role)
    );
  }

  getPersianMonthName(month: number): string {
    const m = this.months.find(x => x.value === month);
    return m?.label || String(month);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'پیش‌نویس',
      published: 'منتشر شده',
      archived: 'بایگانی'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return status;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  editBooklet(booklet: MonthlyBooklet): void {
    this.editingBooklet.set(booklet);
    this.formData = {
      studentId: booklet.studentId,
      month: booklet.month,
      year: booklet.year,
      title: booklet.title,
      content: booklet.content,
      createdByUserId: booklet.createdByUserId || 0,
      status: booklet.status as any
    };
    this.activeTab.set('edit');
  }

  confirmDelete(booklet: MonthlyBooklet): void {
    if (confirm(`آیا از حذف دفترچه "${booklet.title}" اطمینان دارید؟`)) {
      this.deleteBooklet(booklet.id);
    }
  }

  deleteBooklet(id: number): void {
    this.api.deleteMonthlyBooklet(id).pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        // Refresh the list
        this.booklets$.subscribe();
      },
      error: (err) => {
        alert('خطا در حذف: ' + (err.error?.message || err.message));
      }
    });
  }

  onSubmit(): void {
    if (this.saving()) return;
    this.saving.set(true);

    const payload: CreateMonthlyBookletPayload = {
      studentId: this.formData.studentId,
      month: this.formData.month,
      year: this.formData.year,
      title: this.formData.title.trim(),
      content: this.formData.content.trim(),
      createdByUserId: this.formData.createdByUserId
    };

    const request = this.activeTab() === 'edit' && this.editingBooklet()
      ? this.api.updateMonthlyBooklet(this.editingBooklet()!.id, payload)
      : this.api.createMonthlyBooklet(payload);

    request.pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
      },
      error: (err) => {
        this.saving.set(false);
        alert('خطا در ذخیره: ' + (err.error?.message || err.message));
      }
    });
  }

  cancelEdit(): void {
    this.activeTab.set('list');
    this.editingBooklet.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      studentId: 0,
      month: 1,
      year: 1403,
      title: '',
      content: '',
      createdByUserId: this.currentUser?.studentId || 0
    };
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}