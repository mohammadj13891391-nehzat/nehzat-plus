import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { SurveyService } from './survey.service';
import { AuthService } from '../../core/services/auth.service';
import {
  ServiceSurvey,
  ServiceSurveyQuestion,
  SubmitServiceSurveyPayload,
  ServiceSurveyResponse,
} from '../../core/models/lesson-planner.models';

@Component({
  selector: 'app-survey-respond',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-respond.component.html',
  styleUrls: ['./survey-respond.component.scss'],
})
export class SurveyRespondComponent {
  private readonly svc = inject(SurveyService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  currentStep = 1;
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  surveys: ServiceSurvey[] = [];
  selectedSurvey: ServiceSurvey | null = null;
  questions: ServiceSurveyQuestion[] = [];

  respondForm = this.fb.nonNullable.group({
    respondentName: ['', Validators.required],
    respondentPhone: ['', Validators.required],
    studentName: [''],
    studentClass: [''],
    branchName: [''],
    comment: [''],
  });

  answers: Record<number, string | number | string[]> = {};

  roleOptions = [
    { value: 'parent', label: 'والدین', icon: '👨‍👩‍👧', description: 'نظرسنجی مربوط به خدمات حمل‌ونقل فرزندان' },
    { value: 'branch_manager', label: 'مسئول شعبه', icon: '🏢', description: 'نظرسنجی مربوط به هماهنگی شعبه' },
    { value: 'headquarters', label: 'ستاد', icon: '🏛️', description: 'نظرسنجی مربوط به سیاست‌گذاری مرکزی' },
    { value: 'manager', label: 'مسئول مالی', icon: '💰', description: 'نظرسنجی مربوط به هزینه‌ها و بودجه' },
  ];

  selectedRole: string | '' = '';

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.loading = true;
    const targetRole = this.selectedRole || this.currentUser?.userType || 'parent';
    this.svc
      .getSurveys(targetRole)
      .pipe(finalize(() => (this.loading = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.surveys = items.filter((s) => s.status === 'active');
        },
        error: () => {
          this.errorMessage = 'خطا در دریافت نظرسنجی‌ها';
        },
      });
  }

  selectSurvey(survey: ServiceSurvey): void {
    this.selectedSurvey = survey;
    this.currentStep = 2;
    this.loadQuestions(survey.id);
  }

  loadQuestions(surveyId: number): void {
    this.svc.getQuestions(surveyId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (qs) => {
        this.questions = qs.filter((q) => q.isActive);
        this.answers = {};
        this.questions.forEach((q) => {
          if (q.questionType === 'radio' || q.questionType === 'rating' || q.questionType === 'select') {
            this.answers[q.id] = '';
          } else if (q.questionType === 'checkbox') {
            this.answers[q.id] = [];
          } else {
            this.answers[q.id] = '';
          }
        });
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت سوالات';
      },
    });
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.loadSurveys();
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  onAnswerChange(questionId: number, value: string | number | string[]): void {
    this.answers[questionId] = value;
  }

  onCheckboxChange(questionId: number, option: string, checked: boolean): void {
    const current = (this.answers[questionId] as string[]) ?? [];
    if (checked) {
      this.answers[questionId] = [...current, option];
    } else {
      this.answers[questionId] = current.filter((o) => o !== option);
    }
  }

  isOptionChecked(questionId: number, option: string): boolean {
    const answer = this.answers[questionId];
    return Array.isArray(answer) && answer.includes(option);
  }

  submit(): void {
    if (!this.selectedSurvey) return;
    this.saving = true;
    this.errorMessage = '';

    const answers = this.questions.map((q) => {
      const answer = this.answers[q.id];
      const item: any = { questionId: q.id };

      if (q.questionType === 'radio' || q.questionType === 'rating' || q.questionType === 'select') {
        item.answerScore = typeof answer === 'number' ? answer : parseFloat(String(answer)) || 0;
        item.answerText = String(answer);
      } else if (q.questionType === 'checkbox') {
        item.answerOptions = Array.isArray(answer) ? answer : [];
        item.answerText = (answer as string[]).join(', ');
      } else {
        item.answerText = String(answer ?? '');
      }

      return item;
    });

    const payload: SubmitServiceSurveyPayload = {
      surveyId: this.selectedSurvey.id,
      answers,
      comment: this.respondForm.value.comment ?? '',
    };

    this.svc
      .submitResponse(payload)
      .pipe(
        finalize(() => (this.saving = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.successMessage = 'نظرسنجی با موفقیت ثبت شد. ممنون از شرکت شما.';
          this.currentStep = 4;
          this.saveLocalResponse(response);
        },
        error: () => {
          this.errorMessage = 'خطا در ثبت پاسخ‌ها. لطفاً دوباره تلاش کنید.';
        },
      });
  }

  private saveLocalResponse(response: ServiceSurveyResponse): void {
    try {
      const key = `service_survey_response_${this.selectedSurvey?.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(response);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // localStorage unavailable
    }
  }

  reset(): void {
    this.currentStep = 1;
    this.selectedSurvey = null;
    this.questions = [];
    this.answers = {};
    this.selectedRole = '';
    this.respondForm.reset({
      respondentName: '',
      respondentPhone: '',
      studentName: '',
      studentClass: '',
      branchName: '',
      comment: '',
    });
    this.errorMessage = '';
    this.successMessage = '';
  }
}
