import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { LearningPath } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-learning-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="learning-container" dir="rtl">
      <div class="header-card">
        <h1>آموزش ادبیات فارسی</h1>
        <p class="subtitle">یادگیری گام به گام از مبتدی تا پیشرفته</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && dashboardError" class="error-state">
        <p>{{ dashboardError }}</p>
        <button class="retry-btn" (click)="retry()">تلاش مجدد</button>
      </div>

      <div *ngIf="!loading && !dashboardError">
        <div class="stats-row" *ngIf="dashboardStats">
          <div class="stat-card">
            <span class="stat-value">{{ dashboardStats.totalPaths }}</span>
            <span class="stat-label">مسیرهای یادگیری</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ dashboardStats.completedLessons }}/{{ dashboardStats.totalLessons }}</span>
            <span class="stat-label">درس‌های تکمیل شده</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ dashboardStats.averageScore }}%</span>
            <span class="stat-label">میانگین نمرات</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ dashboardStats.badges }}</span>
            <span class="stat-label">نشان‌ها</span>
          </div>
        </div>

        <h2 class="section-title">مسیرهای یادگیری</h2>
        <div class="path-grid">
          <div class="path-card" *ngFor="let path of paths" [routerLink]="['/learning/paths', path.id]">
            <div class="path-icon" [style.background]="path.color || 'var(--lp-primary, #4a148c)'">
              {{ path.icon || '📚' }}
            </div>
            <h3>{{ path.title }}</h3>
            <p class="path-desc">{{ path.description }}</p>
            <div class="path-meta">
              <span>{{ path.ageRange }}</span>
              <span>{{ path.difficultyLevel }}</span>
              <span>{{ path.estimatedDurationDays }} روز</span>
            </div>
            <div class="path-levels" *ngIf="path.levels">
              <span class="level-indicator" *ngFor="let lv of path.levels" [title]="lv.title">{{ lv.sortOrder }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="paths.length === 0" class="empty-state">
          <p>هنوز مسیر یادگیری‌ای تعریف نشده است.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .learning-container { padding: 20px; max-width: 1100px; margin: 0 auto; direction: rtl; }
    .header-card { margin-bottom: 24px; padding: 32px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-accent, #7b1fa2)); color: #fff; border-radius: 12px; text-align: center; }
    .header-card h1 { margin: 0 0 8px; font-size: 28px; }
    .subtitle { margin: 0; opacity: 0.85; font-size: 14px; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-state { text-align: center; padding: 40px; color: var(--lp-danger, #c62828); }
    .retry-btn { padding: 8px 20px; background: var(--lp-primary, #4a148c); color: #fff; border: none; border-radius: 6px; cursor: pointer; margin-top: 12px; }
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 28px; }
    .stat-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 10px; padding: 16px; text-align: center; }
    .stat-value { display: block; font-size: 24px; font-weight: bold; color: var(--lp-primary, #4a148c); margin-bottom: 4px; }
    .stat-label { font-size: 12px; color: var(--lp-text-muted, #888); }
    .section-title { font-size: 20px; margin: 24px 0 16px; color: var(--lp-text, #333); }
    .path-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .path-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; padding: 20px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .path-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .path-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 12px; }
    .path-card h3 { margin: 0 0 8px; font-size: 18px; color: var(--lp-text, #333); }
    .path-desc { margin: 0 0 12px; font-size: 13px; color: var(--lp-text-muted, #666); line-height: 1.5; }
    .path-meta { display: flex; gap: 12px; flex-wrap: wrap; font-size: 11px; color: var(--lp-text-muted, #888); margin-bottom: 10px; }
    .path-meta span { background: var(--lp-surface-alt, #f5f5f5); padding: 2px 8px; border-radius: 4px; }
    .path-levels { display: flex; gap: 4px; }
    .level-indicator { width: 24px; height: 24px; border-radius: 50%; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class LearningDashboardComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  paths: LearningPath[] = [];
  loading = true;
  dashboardError: string | null = null;
  dashboardStats: { totalPaths: number; completedLessons: number; totalLessons: number; averageScore: number; badges: number } | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  retry(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.dashboardError = null;
    this.api.getLearningPaths().subscribe({
      next: (data) => {
        this.paths = data;
        this.loading = false;
      },
      error: () => {
        this.dashboardError = 'خطا در بارگذاری مسیرهای یادگیری';
        this.loading = false;
      }
    });
    this.api.getLearningDashboardStats().subscribe({
      next: (stats) => { this.dashboardStats = stats; },
      error: () => {}
    });
  }
}
