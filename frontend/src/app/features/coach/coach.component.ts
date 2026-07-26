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
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
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