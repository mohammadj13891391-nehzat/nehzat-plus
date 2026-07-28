import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import type {
  Assessment,
  AssessmentAnalytics,
  CreateEvaluationPayload,
  CurrentUser,
  EvaluationRecord,
  Evaluator
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

type TargetType = 'coach' | 'student' | 'branch';

@Component({
  selector: 'app-evaluator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './evaluator.component.html',
  styleUrls: ['./evaluator.component.scss']
})
export class EvaluatorComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  records: EvaluationRecord[] = [];
  loadingRecords = false;
  creating = false;
  actionLoading = false;

  evaluators: Evaluator[] = [];

  assessments: Assessment[] = [];
  loadingAssessments = false;
  analytics: AssessmentAnalytics | null = null;
  loadingAnalytics = false;

  toast: Toast | null = null;

  evalForm: FormGroup = this.fb.group({
    evaluatorId: [1, [Validators.required, Validators.min(1)]],
    targetType: ['coach' as TargetType, Validators.required],
    targetName: ['', [Validators.required, Validators.maxLength(200)]],
    targetId: [1, [Validators.required, Validators.min(1)]],
    score: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    evaluationDate: [new Date().toISOString().split('T')[0], Validators.required],
    feedback: ['', Validators.maxLength(2000)]
  });

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.authService.hasRole('evaluator')) {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee')
      );
      return;
    }
    this.loadEvaluators();
    this.loadRecords();
    this.loadAssessments();
  }

  loadEvaluators(): void {
    this.api.getEvaluators().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (evaluators) => {
        this.evaluators = evaluators;
        const match = evaluators.find((e) => e.username === this.currentUser?.username);
        if (match) {
          this.evalForm.patchValue({ evaluatorId: match.id });
        }
      },
      error: () => { this.evaluators = []; }
    });
  }

  loadRecords(): void {
    this.loadingRecords = true;
    this.api.getEvaluationRecords().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (records) => {
        this.records = records;
        this.loadingRecords = false;
      },
      error: () => {
        this.records = [];
        this.loadingRecords = false;
      }
    });
  }

  loadAssessments(): void {
    this.loadingAssessments = true;
    this.api.getAssessments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (assessments) => {
        this.assessments = assessments;
        this.loadingAssessments = false;
      },
      error: () => {
        this.assessments = [];
        this.loadingAssessments = false;
      }
    });
  }

  onCreate(): void {
    if (this.evalForm.invalid) return;
    this.creating = true;
    const v = this.evalForm.value;
    const payload: CreateEvaluationPayload = {
      evaluatorId: Number(v.evaluatorId),
      targetType: v.targetType as TargetType,
      targetName: v.targetName,
      targetId: Number(v.targetId),
      score: Number(v.score),
      evaluationDate: v.evaluationDate,
      feedback: v.feedback ?? ''
    };

    this.api.createEvaluation(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (record) => {
        this.records = [record, ...this.records];
        this.creating = false;
        this.evalForm.patchValue({
          targetName: '',
          targetId: 1,
          score: 80,
          feedback: ''
        });
        this.showToast('ارزیابی با موفقیت ثبت شد', 'success');
      },
      error: () => {
        this.creating = false;
        this.showToast('خطا در ثبت ارزیابی', 'error');
      }
    });
  }

  deleteRecord(id: number): void {
    if (this.actionLoading) return;
    if (!confirm('آیا از حذف این ارزیابی اطمینان دارید؟')) return;
    this.actionLoading = true;
    this.api.deleteEvaluation(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.records = this.records.filter((r) => r.id !== id);
        this.actionLoading = false;
        this.showToast('ارزیابی حذف شد', 'success');
      },
      error: () => {
        this.actionLoading = false;
        this.showToast('خطا در حذف ارزیابی', 'error');
      }
    });
  }

  onSelectAssessment(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    if (!id) {
      this.analytics = null;
      return;
    }
    this.loadAnalytics(id);
  }

  loadAnalytics(assessmentId: number): void {
    this.loadingAnalytics = true;
    this.analytics = null;
    this.api.getAssessmentAnalytics(assessmentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.analytics = data;
        this.loadingAnalytics = false;
      },
      error: () => {
        this.analytics = null;
        this.loadingAnalytics = false;
        this.showToast('خطا در بارگذاری تحلیل', 'error');
      }
    });
  }

  targetTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      coach: 'مربی',
      student: 'دانش‌آموز',
      branch: 'شعبه'
    };
    return labels[type] ?? type;
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'پیش‌نویس',
      published: 'منتشر شده',
      completed: 'تکمیل شده',
      archived: 'آرشیو شده'
    };
    return labels[status] ?? status;
  }

  difficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      easy: 'آسان',
      medium: 'متوسط',
      hard: 'سخت'
    };
    return labels[difficulty] ?? difficulty;
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 3000);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}