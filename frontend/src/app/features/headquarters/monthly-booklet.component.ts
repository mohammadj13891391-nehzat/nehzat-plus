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
  templateUrl: './monthly-booklet.component.html',
  styleUrls: ['./monthly-booklet.component.scss']
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