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
import { finalize } from 'rxjs';

import { SurveyService } from './survey.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {
  ServiceSurvey,
  ServiceSurveyQuestion,
  ServiceSurveyResponse,
  ServiceSurveyAnalytics,
  ServiceDashboardSummary,
  ServiceSurveyStatus,
} from '../../core/models/lesson-planner.models';

@Component({
  selector: 'app-survey-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-manage.component.html',
  styleUrls: ['./survey-manage.component.scss'],
})
export class SurveyManageComponent {
  private readonly svc = inject(SurveyService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  loadingQuestions = false;
  loadingResponses = false;
  loadingAnalytics = false;

  errorMessage = '';
  successMessage = '';

  userRole = this.auth.getCurrentUser()?.userType || 'branch_manager';

  surveys: ServiceSurvey[] = [];
  selectedSurvey: ServiceSurvey | null = null;
  questions: ServiceSurveyQuestion[] = [];
  responses: ServiceSurveyResponse[] = [];
  analytics: ServiceSurveyAnalytics | null = null;
  dashboard: ServiceDashboardSummary | null = null;

  activeTab: 'surveys' | 'questions' | 'responses' | 'analytics' = 'surveys';

  ngOnInit(): void {
    this.loadDashboard();
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.loading = true;
    this.svc.getSurveys(this.userRole).pipe(
      finalize(() => (this.loading = false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (items) => {
        this.surveys = items;
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت نظرسنجی‌ها';
      },
    });
  }

  loadDashboard(): void {
    this.svc.getDashboardSummary().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (d) => {
        this.dashboard = d;
      },
      error: () => {},
    });
  }

  selectSurvey(survey: ServiceSurvey): void {
    this.selectedSurvey = survey;
    this.activeTab = 'questions';
    this.loadQuestions(survey.id);
  }

  loadQuestions(surveyId: number): void {
    this.loadingQuestions = true;
    this.svc.getQuestions(surveyId).pipe(
      finalize(() => (this.loadingQuestions = false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (qs) => {
        this.questions = qs;
        this.activeTab = 'questions';
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت سوالات';
      },
    });
  }

  loadResponses(surveyId: number): void {
    this.loadingResponses = true;
    this.svc.getResponses(surveyId).pipe(
      finalize(() => (this.loadingResponses = false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (rs) => {
        this.responses = rs;
        this.activeTab = 'responses';
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت پاسخ‌ها';
      },
    });
  }

  loadAnalytics(surveyId: number): void {
    this.loadingAnalytics = true;
    this.svc.getAnalytics(surveyId).pipe(
      finalize(() => (this.loadingAnalytics = false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (a) => {
        this.analytics = a;
        this.activeTab = 'analytics';
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت تحلیل';
      },
    });
  }

  publishSurvey(survey: ServiceSurvey): void {
    this.svc.publishSurvey(survey.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage = 'نظرسنجی منتشر شد.';
        this.loadSurveys();
      },
      error: () => {
        this.errorMessage = 'خطا در انتشار نظرسنجی';
      },
    });
  }

  closeSurvey(survey: ServiceSurvey): void {
    this.svc.closeSurvey(survey.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage = 'نظرسنجی بسته شد.';
        this.loadSurveys();
      },
      error: () => {
        this.errorMessage = 'خطا در بستن نظرسنجی';
      },
    });
  }

  deleteSurvey(survey: ServiceSurvey): void {
    if (!confirm('آیا از حذف این نظرسنجی اطمینان دارید؟')) return;
    this.svc.deleteSurvey(survey.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage = 'نظرسنجی حذف شد.';
        this.loadSurveys();
      },
      error: () => {
        this.errorMessage = 'خطا در حذف نظرسنجی';
      },
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  statusClass(status: ServiceSurveyStatus): string {
    return `status-chip status-chip--${status}`;
  }

  statusLabel(status: ServiceSurveyStatus): string {
    const labels: Record<ServiceSurveyStatus, string> = {
      draft: 'پیش‌نویس',
      active: 'فعال',
      closed: 'بسته',
      archived: 'آرشیو',
    };
    return labels[status] ?? status;
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      parent: 'والدین',
      branch_manager: 'مسئول شعبه',
      headquarters: 'ستاد',
      manager: 'مسئول مالی',
    };
    return labels[role] ?? role;
  }
}
