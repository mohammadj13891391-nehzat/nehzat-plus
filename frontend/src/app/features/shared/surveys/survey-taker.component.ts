import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import type {
  IssueSurvey,
  IssueSurveyQuestion,
  IssueSurveyResponse,
  SubmitAnswerItem,
  SubmitSurveyResponsePayload,
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-survey-taker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-taker.component.html',
  styleUrls: ['./survey-taker.component.scss'],
})
export class SurveyTakerComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly pageSize = 20;
  survey: IssueSurvey | null = null;
  questions: IssueSurveyQuestion[] = [];
  loading = true;
  errorMessage = '';
  submitting = false;
  successMessage = '';

  currentPage = 0;
  totalPages = 0;
  pagedQuestions: IssueSurveyQuestion[] = [];

  answerForm!: FormGroup;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }

    const surveyId = Number(this.route.snapshot.paramMap.get('id'));
    if (!surveyId || isNaN(surveyId)) {
      this.errorMessage = 'شناسه نظرسنجی نامعتبر است.';
      this.loading = false;
      return;
    }

    this.loadSurvey(surveyId);
  }

  private loadSurvey(surveyId: number): void {
    this.loading = true;
    this.api.getIssueSurveyById(surveyId).pipe(takeUntilDestroyed()).subscribe({
      next: (survey) => {
        this.survey = survey;
        this.questions = (survey.questions ?? []).filter((q) => q.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
        this.totalPages = Math.ceil(this.questions.length / this.pageSize);
        this.currentPage = 0;
        this.buildForm();
        this.showPage();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت نظرسنجی.';
        this.loading = false;
      },
    });
  }

  private buildForm(): void {
    const controls: Record<string, FormGroup> = {};
    for (const q of this.questions) {
      controls[`q_${q.id}`] = this.fb.group({
        score: [null, [Validators.required, Validators.min(1), Validators.max(this.survey?.scoreScaleMax ?? 5)]],
      });
    }
    this.answerForm = this.fb.group(controls);
  }

  private showPage(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedQuestions = this.questions.slice(start, start + this.pageSize);
  }

  getScoreControl(questionId: number) {
    return this.answerForm.get(`q_${questionId}`);
  }

  get scoreLabels() {
    const max = this.survey?.scoreScaleMax ?? 5;
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  scoreLabel(i: number): string {
    switch (i) {
      case 1:
        return 'کاملاً مخالف';
      case 2:
        return 'مخالف';
      case 3:
        return 'خنثی';
      case 4:
        return 'موافق';
      case 5:
        return 'کاملاً موافق';
      default:
        return String(i);
    }
  }

  getProgress(): number {
    if (this.questions.length === 0) return 0;
    return Math.round(((this.currentPage * this.pageSize) / this.questions.length) * 100);
  }

  progressEnd(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.questions.length);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.showPage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.showPage();
    }
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  onSubmit(): void {
    if (this.submitting || !this.survey) return;

    // Validate all answers
    for (const q of this.questions) {
      const ctrl = this.answerForm.get(`q_${q.id}`);
      if (ctrl?.invalid) {
        ctrl?.markAllAsTouched();
        return;
      }
    }

    this.submitting = true;
    const answers: SubmitAnswerItem[] = this.questions.map((q) => {
      const ctrl = this.answerForm.get(`q_${q.id}`);
      return {
        questionId: q.id,
        score: ctrl?.value?.score ?? 0,
      };
    });

    const payload: SubmitSurveyResponsePayload = {
      surveyId: this.survey.id,
      answers,
    };

    this.api.submitSurveyResponses(this.survey!.id, payload).pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'نظرسنجی شما با موفقیت ثبت شد. سپاس از مشارکت شما.';
        this.answerForm.reset();
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'خطا در ثبت پاسخ‌های شما. لطفاً دوباره تلاش کنید.';
      },
    });
  }

  goBack(): void {
    void this.router.navigateByUrl('/surveys');
  }
}
