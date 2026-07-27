import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import type {
  TeacherDashboardSummary,
  AssignmentGrading,
  CurrentUser,
  GradeSubmissionRequest
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import type { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';

type TabKey = 'dashboard' | 'courses' | 'gradings' | 'pending';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
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
  readonly selectedGrading = signal<AssignmentGrading | null>(null);

  dashboardSummary$: Observable<TeacherDashboardSummary> = of();
  courses$: Observable<any[]> = of();
  gradings$: Observable<AssignmentGrading[]> = of();
  pendingGradings$: Observable<AssignmentGrading[]> = of();

  gradeForm: GradeSubmissionRequest = {
    submissionId: 0,
    teacherId: 0,
    dailyScore: 0,
    cumulativeScore: 0,
    status: 'graded',
    feedback: ''
  };

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
      return;
    }
    this.loadTab('dashboard');
  }

  switchTab(tab: TabKey): void {
    this.activeTab.set(tab);
    this.loadTab(tab);
  }

  private loadTab(tab: TabKey): void {
    const teacherId = this.currentUser?.studentId ?? 0;
    if (!teacherId) return;

    switch (tab) {
      case 'dashboard':
        this.dashboardSummary$ = this.api.getTeacherDashboardSummary(teacherId).pipe(
          catchError(() => of({ totalCourses: 0, totalStudents: 0, pendingGradings: 0, completedGradings: 0, averageScore: 0 }))
        );
        break;
      case 'courses':
        this.courses$ = this.api.getTeacherCourses(teacherId).pipe(
          catchError(() => of([]))
        );
        break;
      case 'gradings':
        this.gradings$ = this.api.getTeacherGradings(teacherId).pipe(
          catchError(() => of([]))
        );
        break;
      case 'pending':
        this.pendingGradings$ = this.api.getPendingGradings(teacherId).pipe(
          catchError(() => of([]))
        );
        break;
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

  openGradeModal(grading: AssignmentGrading): void {
    this.selectedGrading.set(grading);
    this.gradeForm = {
      submissionId: grading.submissionId,
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
    this.selectedGrading.set(null);
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
        const teacherId = this.currentUser?.studentId ?? 0;
        this.gradings$ = this.api.getTeacherGradings(teacherId);
        this.pendingGradings$ = this.api.getPendingGradings(teacherId);
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
