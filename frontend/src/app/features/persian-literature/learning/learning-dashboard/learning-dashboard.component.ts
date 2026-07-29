import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { LearningPath } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-learning-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="learning-dashboard" dir="rtl">
      <header class="dashboard-header">
        <h1>مسیرهای یادگیری ادبیات فارسی</h1>
        <p class="subtitle">از مقدماتی تا پیشرفته، متناسب با سن و سطح شما</p>
      </header>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading" class="paths-grid">
        <div *ngFor="let path of learningPaths" class="path-card" [style.borderColor]="path.color">
          <div class="path-icon">{{ path.icon }}</div>
          <h2>{{ path.title }}</h2>
          <p class="path-description">{{ path.description }}</p>
          <div class="path-meta">
            <span class="age-badge">{{ path.ageGroup }}</span>
            <span class="level-count">{{ path.levels?.length || 0 }} سطح</span>
          </div>
          <a [routerLink]="['/learning', path.id]" class="btn-start">شروع مسیر</a>
        </div>
      </div>

      <div *ngIf="!loading && learningPaths.length === 0" class="empty-state">
        <p>هنوز هیچ مسیر یادگیری‌ای تعریف نشده است.</p>
      </div>
    </div>
  `,
  styles: [`
    .learning-dashboard { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .dashboard-header { text-align: center; margin-bottom: 3rem; }
    .dashboard-header h1 { font-size: 2rem; color: var(--lp-text-primary, #1a1a2e); margin-bottom: 0.5rem; }
    .subtitle { color: var(--lp-text-secondary, #666); font-size: 1.1rem; }
    .loading { text-align: center; padding: 3rem; color: var(--lp-text-secondary, #666); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .paths-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    .path-card { background: var(--lp-surface, #fff); border-radius: 16px; padding: 2rem; border-top: 4px solid var(--lp-primary, #4a148c); box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; }
    .path-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .path-icon { font-size: 3rem; margin-bottom: 1rem; }
    .path-card h2 { font-size: 1.4rem; color: var(--lp-text-primary, #1a1a2e); margin-bottom: 0.5rem; }
    .path-description { color: var(--lp-text-secondary, #666); line-height: 1.6; margin-bottom: 1rem; }
    .path-meta { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .age-badge { background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
    .level-count { color: var(--lp-text-secondary, #666); font-size: 0.85rem; padding-top: 0.25rem; }
    .btn-start { display: inline-block; background: var(--lp-primary, #4a148c); color: #fff; padding: 0.6rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: background 0.2s; }
    .btn-start:hover { background: var(--lp-primary-dark, #6a1b9a); }
    .empty-state { text-align: center; padding: 3rem; color: var(--lp-text-secondary, #666); }
  `]
})
export class LearningDashboardComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  learningPaths: LearningPath[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.getLearningPaths().subscribe({
      next: (paths) => { this.learningPaths = paths; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
