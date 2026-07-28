import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { MathLesson, MathTopic } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-math-lesson-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div dir="rtl" class="container">
      <div class="header">
        <a routerLink="/math/topics" class="back-link">بازگشت به نظام‌بندی‌ها</a>
        <h1 *ngIf="topic">{{ topic.title }}</h1>
        <p class="subtitle" *ngIf="topic">{{ topic.description }}</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری دروس...</p>
      </div>

      <div *ngIf="!loading && lessons.length === 0" class="empty">
        <p>هنوز درسی تعریف نشده است</p>
      </div>

      <div class="list" *ngIf="!loading && lessons.length > 0">
        <div class="lesson-card" *ngFor="let lesson of lessons" [routerLink]="['/math/lessons', lesson.id]">
          <div class="lesson-number">{{ lesson.displayOrder }}</div>
          <div class="lesson-info">
            <h3>{{ lesson.title }}</h3>
            <p class="summary">{{ lesson.summary }}</p>
            <div class="meta">
              <span class="duration">⏱ {{ lesson.durationMinutes }} دقیقه</span>
              <span class="status" [class.published]="lesson.isPublished">
                {{ lesson.isPublished ? 'منتشر شده' : 'پیش‌نویس' }}
              </span>
            </div>
          </div>
          <div class="arrow">←</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .header { margin-bottom: 32px; }
    .back-link { color: var(--lp-primary); text-decoration: none; font-size: 0.9rem; display: inline-block; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
    .header h1 { color: var(--lp-text); margin-bottom: 8px; }
    .subtitle { color: var(--lp-text-muted); }
    .loading, .empty { text-align: center; padding: 48px; color: var(--lp-text-muted); }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--lp-border); border-top-color: var(--lp-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .list { display: flex; flex-direction: column; gap: 12px; }
    .lesson-card { display: flex; align-items: center; gap: 16px; background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 12px; padding: 20px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .lesson-card:hover { transform: translateX(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .lesson-number { width: 48px; height: 48px; background: var(--lp-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; flex-shrink: 0; }
    .lesson-info { flex: 1; }
    .lesson-info h3 { color: var(--lp-text); margin-bottom: 4px; }
    .summary { color: var(--lp-text-muted); font-size: 0.9rem; margin-bottom: 8px; }
    .meta { display: flex; gap: 16px; font-size: 0.85rem; color: var(--lp-text-muted); }
    .status.published { color: #2e7d32; }
    .arrow { color: var(--lp-text-muted); font-size: 1.2rem; }
  `]
})
export class MathLessonListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  lessons: MathLesson[] = [];
  topic: MathTopic | null = null;
  loading = true;

  ngOnInit(): void {
    const topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    this.api.getMathTopicById(topicId).subscribe({
      next: (topic) => { this.topic = topic; },
      error: () => {}
    });
    this.api.getMathLessons(topicId).subscribe({
      next: (lessons) => { this.lessons = lessons; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
