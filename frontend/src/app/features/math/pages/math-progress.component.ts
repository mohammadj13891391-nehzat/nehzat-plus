import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { MathProgress, MathTopic } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-math-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div dir="rtl" class="container">
      <div class="header">
        <a routerLink="/math/topics" class="back-link">بازگشت به ریاضیات</a>
        <h1>پیشرفت من</h1>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ progressList.length }}</div>
            <div class="stat-label">تعداد تمرینات</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ completedCount }}</div>
            <div class="stat-label">تکمیل شده</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ averageScore }}</div>
            <div class="stat-label">میانگین امتیاز</div>
          </div>
        </div>

        <div *ngIf="progressList.length === 0" class="empty">
          <p>هنوز تمرینی انجام نداده‌اید</p>
          <a routerLink="/math/topics" class="btn btn-primary">شروع یادگیری</a>
        </div>

        <div class="progress-list" *ngIf="progressList.length > 0">
          <h2>آخرین فعالیت‌ها</h2>
          <div class="progress-item" *ngFor="let p of progressList">
            <div class="status-icon" [class.completed]="p.isCompleted">
              {{ p.isCompleted ? '✅' : '⏳' }}
            </div>
            <div class="item-info">
              <p>درس {{ p.mathLessonId }}</p>
              <p class="date">{{ p.createdAt | date:'yyyy/MM/dd' }}</p>
            </div>
            <div class="score" *ngIf="p.score !== undefined">
              {{ p.score }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .header { margin-bottom: 32px; }
    .back-link { color: var(--lp-primary); text-decoration: none; font-size: 0.9rem; display: inline-block; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
    .header h1 { color: var(--lp-text); }
    .loading { text-align: center; padding: 48px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--lp-border); border-top-color: var(--lp-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 12px; padding: 24px; text-align: center; }
    .stat-value { font-size: 2rem; color: var(--lp-primary); font-weight: bold; }
    .stat-label { color: var(--lp-text-muted); margin-top: 4px; }
    .empty { text-align: center; padding: 48px; color: var(--lp-text-muted); }
    .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 16px; }
    .btn-primary { background: var(--lp-primary); color: white; }
    .progress-list h2 { color: var(--lp-text); margin-bottom: 16px; }
    .progress-item { display: flex; align-items: center; gap: 16px; background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 8px; padding: 16px; margin-bottom: 8px; }
    .status-icon { font-size: 1.5rem; }
    .item-info { flex: 1; }
    .item-info p { color: var(--lp-text); margin: 0; }
    .date { color: var(--lp-text-muted); font-size: 0.85rem; }
    .score { color: var(--lp-primary); font-weight: bold; font-size: 1.2rem; }
  `]
})
export class MathProgressComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  progressList: MathProgress[] = [];
  loading = true;
  completedCount = 0;
  averageScore = 0;

  ngOnInit(): void {
    this.api.getMathStudentProgress(1).subscribe({
      next: (progress) => {
        this.progressList = progress;
        this.completedCount = progress.filter(p => p.isCompleted).length;
        const scored = progress.filter(p => p.score !== undefined);
        this.averageScore = scored.length > 0
          ? Math.round(scored.reduce((sum, p) => sum + (p.score ?? 0), 0) / scored.length)
          : 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
