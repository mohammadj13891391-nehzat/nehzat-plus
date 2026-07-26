import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import type { IssueSurvey, SurveyStatus } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  surveys: IssueSurvey[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    this.loadSurveys();
  }

  private loadSurveys(): void {
    this.loading = true;
    this.api.getIssueSurveys().pipe(takeUntilDestroyed()).subscribe({
      next: (items) => {
        this.surveys = items.filter((s) => s.status === 'active');
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'خطا در دریافت نظرسنجی‌ها';
        this.loading = false;
      },
    });
  }

  statusLabel(status: SurveyStatus): string {
    const labels: Record<SurveyStatus, string> = {
      draft: 'پیش‌نویس',
      active: 'فعال',
      closed: 'بسته',
      archived: 'آرشیو',
    };
    return labels[status] ?? status;
  }

  statusClass(status: SurveyStatus): string {
    return `status-chip status-chip--${status}`;
  }

  takeSurvey(survey: IssueSurvey): void {
    void this.router.navigateByUrl(`/surveys/take/${survey.id}`);
  }
}
