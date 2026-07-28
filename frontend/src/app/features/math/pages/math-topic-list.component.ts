import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { MathTopic } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-math-topic-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div dir="rtl" class="container">
      <div class="header">
        <h1>ریاضیات</h1>
        <p class="subtitle">انتخاب نظام‌بندی مورد نظر خود را انتخاب کنید</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && topics.length === 0" class="empty">
        <p>هنوز نظام‌بندی تعریف نشده است</p>
      </div>

      <div class="grid" *ngIf="!loading && topics.length > 0">
        <div class="card" *ngFor="let topic of topics" [routerLink]="['/math/topics', topic.id, 'lessons']">
          <div class="card-icon">{{ getTopicIcon(topic.difficultyLevel) }}</div>
          <h3>{{ topic.title }}</h3>
          <p class="description">{{ topic.description }}</p>
          <div class="meta">
            <span class="badge" [class]="'badge-' + getDifficultyClass(topic.difficultyLevel)">
              {{ topic.difficultyLevel }}
            </span>
          </div>
        </div>
      </div>

      <div class="nav-links">
        <a routerLink="/math/scholars" class="nav-link">میراث ریاضی مسلمانان</a>
        <a routerLink="/math/progress" class="nav-link">پیشرفت من</a>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .header { text-align: center; margin-bottom: 32px; }
    .header h1 { font-size: 2rem; color: var(--lp-text); margin-bottom: 8px; }
    .subtitle { color: var(--lp-text-muted); font-size: 1.1rem; }
    .loading, .empty { text-align: center; padding: 48px; color: var(--lp-text-muted); }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--lp-border); border-top-color: var(--lp-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .card { background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 12px; padding: 24px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .card-icon { font-size: 2.5rem; margin-bottom: 12px; }
    .card h3 { color: var(--lp-text); margin-bottom: 8px; font-size: 1.25rem; }
    .description { color: var(--lp-text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px; }
    .meta { display: flex; gap: 8px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
    .badge-beginner { background: #e8f5e9; color: #2e7d32; }
    .badge-intermediate { background: #fff3e0; color: #ef6c00; }
    .badge-advanced { background: #fce4ec; color: #c62828; }
    .nav-links { display: flex; gap: 16px; justify-content: center; margin-top: 32px; }
    .nav-link { color: var(--lp-primary); text-decoration: none; font-weight: 500; padding: 8px 16px; border-radius: 8px; transition: background 0.2s; }
    .nav-link:hover { background: var(--lp-surface-light); }
  `]
})
export class MathTopicListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  topics: MathTopic[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.getMathTopics().subscribe({
      next: (topics) => { this.topics = topics; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getTopicIcon(level: string): string {
    const icons: Record<string, string> = { 'مقدماتی': '🌱', 'ابتدایی': '📐', 'متوسط': '📊', 'پیشرفته': '🧮', 'دانشگاهی': '🎓' };
    return icons[level] || '📚';
  }

  getDifficultyClass(level: string): string {
    const classes: Record<string, string> = { 'مقدماتی': 'beginner', 'ابتدایی': 'beginner', 'متوسط': 'intermediate', 'پیشرفته': 'advanced', 'دانشگاهی': 'advanced' };
    return classes[level] || 'intermediate';
  }
}
