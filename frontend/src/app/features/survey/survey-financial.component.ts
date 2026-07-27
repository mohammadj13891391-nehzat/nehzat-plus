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
import {
  ServiceSurvey,
  ServiceDashboardSummary,
  ServiceSurveyStatus,
} from '../../core/models/lesson-planner.models';

@Component({
  selector: 'app-survey-financial',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-financial.component.html',
  styleUrls: ['./survey-financial.component.scss'],
})
export class SurveyFinancialComponent {
  private readonly svc = inject(SurveyService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  errorMessage = '';

  userRole = this.auth.getCurrentUser()?.userType || 'manager';

  surveys: ServiceSurvey[] = [];
  dashboard: ServiceDashboardSummary | null = null;

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
        this.errorMessage = 'خطا در دریافت اطلاعات مالی';
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

  getTotalResponses(): number {
    return this.surveys.reduce((sum, s) => sum + s.responseCount, 0);
  }

  getTotalQuestions(): number {
    return this.surveys.reduce((sum, s) => sum + s.questionCount, 0);
  }

  getTotalCostEstimate(): number {
    return this.surveys.reduce((sum, s) => sum + (s.responseCount * 5000), 0);
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
}
