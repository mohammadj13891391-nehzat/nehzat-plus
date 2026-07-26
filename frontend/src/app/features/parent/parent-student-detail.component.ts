import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type {
  AssignmentSubmission,
  StudentInfo
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { PersianDateInputComponent } from '../shared/persian-date-input/persian-date-input.component';

@Component({
  selector: 'app-parent-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PersianDateInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './parent-student-detail.component.html',
  styleUrls: ['./parent-student-detail.component.scss']
})
export class ParentStudentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _submissions = signal<AssignmentSubmission[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _studentId = signal<number | null>(null);
  private readonly _studentName = signal('');

  readonly _dateFrom = signal<string | null>(null);
  readonly _dateTo = signal<string | null>(null);

  readonly submissions = this._submissions.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly studentId = this._studentId.asReadonly();
  readonly studentName = this._studentName.asReadonly();

  readonly hasActiveFilter = computed(
    () => this._dateFrom() !== null || this._dateTo() !== null
  );

  readonly filteredSubmissions = computed(() => {
    let subs = this._submissions();
    const from = this._dateFrom();
    const to = this._dateTo();

    if (from) {
      subs = subs.filter(s => s.submissionDate >= from);
    }
    if (to) {
      subs = subs.filter(s => s.submissionDate <= to);
    }
    return subs;
  });

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userType !== 'parent') {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(currentUser?.userType ?? 'trainee')
      );
      return;
    }

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = Number(params.get('id'));
        if (!id) {
          this._error.set('شناسه دانش‌آموز نامعتبر است.');
          return;
        }
        this._studentId.set(id);
        this.loadSubmissions(id);
      });
  }

  loadSubmissions(studentId: number): void {
    this._loading.set(true);
    this._error.set(null);
    this._submissions.set([]);

    this.api.getStudentProgress(studentId).subscribe({
      next: (progress) => {
        const s: StudentInfo = progress.student;
        this._studentName.set(`${s.firstName} ${s.lastName}`.trim() || s.studentId);
        this._submissions.set(progress.submissions);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('بارگذاری ارسال‌های دانش‌آموز ناموفق بود.');
        this._loading.set(false);
      }
    });
  }

  onDateFromChange(value: string): void {
    this._dateFrom.set(value || null);
  }

  onDateToChange(value: string): void {
    this._dateTo.set(value || null);
  }

  clearFilter(): void {
    this._dateFrom.set(null);
    this._dateTo.set(null);
  }

  goBack(): void {
    void this.router.navigateByUrl('/parent');
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

  formatDate(dateStr: string): string {
    return dateStr ? new Date(dateStr).toLocaleDateString('fa-IR') : '—';
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
