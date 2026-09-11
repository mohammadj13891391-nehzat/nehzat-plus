import { ChangeDetectionStrategy, Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { StudyPathStep, StudentStudyPath } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-study-path-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-path-detail.component.html',
  styleUrls: ['./study-path-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyPathDetailComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  enrollment: StudentStudyPath | null = null;
  error: string | null = null;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = 'کاربر یافت نشد';
      this.loading = false;
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'شناسه مسیر یافت نشد';
      this.loading = false;
      return;
    }

    this.api.getMyStudyPath(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (enrollment) => {
        this.enrollment = enrollment;
        this.loading = false;
      },
      error: () => {
        this.error = 'خطا در بارگذاری جزئیات مسیر';
        this.loading = false;
      },
    });
  }

  get currentStepIndex(): number {
    if (!this.enrollment || !this.enrollment.currentStepId) return 0;
    return this.enrollment.steps?.findIndex((s) => s.id === this.enrollment!.currentStepId) ?? 0;
  }

  isStepCompleted(stepId: number): boolean {
    if (!this.enrollment) return false;
    const idx = this.enrollment.steps?.findIndex((s) => s.id === stepId);
    if (idx === undefined || idx < 0) return false;
    const currentIndex = this.currentStepIndex;
    return idx < currentIndex;
  }

  isStepCurrent(stepId: number): boolean {
    return this.enrollment?.currentStepId === stepId;
  }

  completeStep(): void {
    if (!this.enrollment) return;
    this.api.completeStep({
      studyPathId: this.enrollment.studyPathId,
      stepId: this.enrollment.currentStepId!,
    }).subscribe({
      next: (updated) => {
        this.enrollment = updated;
        this.notify.show('مرحله با موفقیت تکمیل شد!', 'success');
      },
      error: () => {
        this.notify.show('خطا در ثبت تکمیل مرحله', 'error');
      },
    });
  }

  skipStep(): void {
    if (!this.enrollment) return;
    this.api.skipStep({
      studyPathId: this.enrollment.studyPathId,
      stepId: this.enrollment.currentStepId!,
    }).subscribe({
      next: (updated) => {
        this.enrollment = updated;
        this.notify.show('مرحله نادیده گرفته شد', 'success');
      },
      error: () => {
        this.notify.show('خطا در نادیده‌گرفتن مرحله', 'error');
      },
    });
  }
}
