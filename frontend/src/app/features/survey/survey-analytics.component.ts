import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { SurveyService } from './survey.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ServiceSurvey, ServiceSurveyAnalytics, ServiceDashboardSummary } from '../../core/models/lesson-planner.models';

@Component({
  selector: 'app-survey-analytics',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-analytics.component.html',
  styleUrls: ['./survey-analytics.component.scss'],
})
export class SurveyAnalyticsComponent {
  private readonly svc = inject(SurveyService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  errorMessage = '';

  userRole = this.auth.getCurrentUser()?.userType || 'headquarters';

  surveys: ServiceSurvey[] = [];
  dashboard: ServiceDashboardSummary | null = null;
  selectedSurvey: ServiceSurvey | null = null;
  analytics: ServiceSurveyAnalytics | null = null;

  ngOnInit(): void {
    this.loadDashboard();
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.loading = true;
    this.svc.getSurveys().pipe(
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
    this.loadAnalytics(survey.id);
  }

  loadAnalytics(surveyId: number): void {
    this.svc.getAnalytics(surveyId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (a) => {
        this.analytics = a;
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت تحلیل';
      },
    });
  }
}
