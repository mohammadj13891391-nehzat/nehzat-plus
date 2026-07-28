import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-math-progress-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="math-widget" dir="rtl">
      <div class="widget-header">
        <span class="widget-icon">📐</span>
        <div>
          <h3 class="widget-title">ریاضیات</h3>
          <p class="widget-subtitle">یادگیری تعاملی</p>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading()">
        <p>در حال بارگذاری...</p>
      </div>

      <div class="error-state" *ngIf="error()">
        <p class="error-message">{{ error() }}</p>
      </div>

      <div class="stat-row" *ngIf="stats && !loading() && !error()">
        <div class="stat-item">
          <span class="stat-value">{{ stats['totalTopics'] || 0 }}</span>
          <span class="stat-label">نظام‌بندی</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats['totalLessons'] || 0 }}</span>
          <span class="stat-label">درس</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats['totalQuestions'] || 0 }}</span>
          <span class="stat-label">سؤال</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats['totalScholars'] || 0 }}</span>
          <span class="stat-label">دانشمند</span>
        </div>
      </div>

      <div class="widget-actions">
        <a class="btn-link" [routerLink]="['/math/topics']">📚 موضوعات</a>
        <a class="btn-link" [routerLink]="['/math/scholars']">🏛️ دانشمندان</a>
        <a class="btn-link" [routerLink]="['/math/progress']">📊 پیشرفت</a>
      </div>
    </div>
  `,
  styles: [`
    .math-widget {
      background: var(--lp-surface);
      border: 1px solid var(--lp-border);
      border-radius: 12px;
      padding: 16px;
      margin: 16px 0;
    }

    .widget-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .widget-icon {
      font-size: 32px;
    }

    .widget-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--lp-text);
    }

    .widget-subtitle {
      margin: 2px 0 0;
      font-size: 13px;
      color: var(--lp-text-muted);
    }

    .loading-state,
    .error-state {
      text-align: center;
      padding: 20px;
      color: var(--lp-text-muted);
    }

    .error-message {
      color: var(--lp-danger);
      font-weight: 500;
    }

    .stat-row {
      display: flex;
      justify-content: space-around;
      margin: 12px 0;
      gap: 8px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--lp-primary);
    }

    .stat-label {
      font-size: 12px;
      color: var(--lp-text-muted);
    }

    .widget-actions {
      display: flex;
      justify-content: space-around;
      padding: 12px 0 4px;
      gap: 8px;
    }

    .btn-link {
      color: var(--lp-primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      padding: 4px 8px;
    }

    .btn-link:hover {
      text-decoration: underline;
    }
  `]
})
export class MathProgressWidgetComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  stats: Record<string, unknown> | null = null;
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getMathDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('خطا در بارگذاری آمار');
        this.loading.set(false);
      }
    });
  }
}
