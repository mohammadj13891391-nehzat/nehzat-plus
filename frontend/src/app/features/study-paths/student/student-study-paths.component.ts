import { ChangeDetectionStrategy, Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { StudyPath, StudentStudyPath } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-study-path-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-study-paths.component.html',
  styleUrls: ['./student-study-paths.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentStudyPathsComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  availablePaths: StudyPath[] = [];
  myEnrollments: StudentStudyPath[] = [];
  error: string | null = null;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.api.getAvailableStudyPaths().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (paths) => {
        this.availablePaths = paths;
        this.loadEnrollments();
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری مسیرهای مطالعاتی';
        this.loading = false;
      },
    });
  }

  private loadEnrollments(): void {
    this.api.getMyStudyPaths().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (enrollments) => {
        this.myEnrollments = enrollments;
        this.loading = false;
      },
      error: () => {
        this.error = 'خطا در بارگذاری ثبت‌نام‌ها';
        this.loading = false;
      },
    });
  }

enroll(pathId: number): void {
    this.api.enroll({ studyPathId: pathId }).subscribe({
      next: (enrollment) => {
        this.notify.show('با موفقیت ثبت‌نام شدید!', 'success');
        void this.router.navigateByUrl(`/study-paths/student/${enrollment.id}`);
      },
      error: () => {
        this.notify.show('ثبت‌نام ناموفق', 'error');
      },
    });
  }

  viewEnrollment(id: number): void {
    void this.router.navigateByUrl(`/study-paths/student/${id}`);
  }

  isEnrolled(pathId: number): StudentStudyPath | undefined {
    return this.myEnrollments.find((e) => e.studyPathId === pathId);
  }

  retry(): void {
    this.loadData();
  }
}
