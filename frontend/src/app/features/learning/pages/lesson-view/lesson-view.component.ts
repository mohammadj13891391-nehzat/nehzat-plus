import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { StudyLesson } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="lesson-container" dir="rtl">
      <a class="back-link" (click)="goBack()">← بازگشت</a>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && lesson">
        <div class="lesson-header">
          <h1>{{ lesson.title }}</h1>
          <div class="lesson-meta" *ngIf="lesson.module">
            <span>{{ lesson.module.title }}</span>
            <span>⏱ {{ lesson.estimatedMinutes }} دقیقه</span>
            <span>📊 {{ lesson.difficultyLevel }}</span>
          </div>
        </div>

        <div class="lesson-content" *ngIf="lesson.contentBlocks">
          <div class="content-block" *ngFor="let block of lesson.contentBlocks; let i = index">
            <div class="block-header">
              <span class="block-number">{{ i + 1 }}</span>
              <h3>{{ block.title }}</h3>
            </div>
            <div class="block-body" [innerHTML]="block.content"></div>
            <div class="block-media" *ngIf="block.mediaUrl">
              <a [href]="block.mediaUrl" target="_blank" class="media-link">📎 مشاهده منبع</a>
            </div>
          </div>
        </div>

        <div class="lesson-actions">
          <button class="complete-btn" (click)="markComplete()" [disabled]="isCompleted">
            {{ isCompleted ? '✅ این درس تکمیل شده' : '✓ تکمیل درس' }}
          </button>
          <button class="quiz-btn" *ngIf="quizId" (click)="startQuiz()">📝 شرکت در آزمون</button>
        </div>

        <div *ngIf="actionMsg" class="action-msg">{{ actionMsg }}</div>
      </div>

      <div *ngIf="!loading && !lesson" class="error-state">
        <p>درس مورد نظر یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .lesson-container { padding: 20px; max-width: 800px; margin: 0 auto; direction: rtl; }
    .back-link { color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; cursor: pointer; display: inline-block; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .lesson-header { margin-bottom: 24px; }
    .lesson-header h1 { margin: 0 0 8px; font-size: 24px; color: var(--lp-text, #333); }
    .lesson-meta { display: flex; gap: 12px; font-size: 13px; color: var(--lp-text-muted, #888); flex-wrap: wrap; }
    .lesson-content { margin-bottom: 24px; }
    .content-block { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 10px; padding: 20px; margin-bottom: 12px; }
    .block-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .block-number { width: 28px; height: 28px; border-radius: 50%; background: var(--lp-primary, #4a148c); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; }
    .block-header h3 { margin: 0; font-size: 16px; color: var(--lp-text, #333); }
    .block-body { font-size: 14px; line-height: 1.8; color: var(--lp-text, #444); }
    .block-body p { margin: 0 0 8px; }
    .block-media { margin-top: 12px; }
    .media-link { color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 13px; }
    .lesson-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
    .complete-btn, .quiz-btn { padding: 10px 24px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
    .complete-btn { background: var(--lp-primary, #4a148c); color: #fff; }
    .complete-btn:disabled { opacity: 0.6; cursor: not-allowed; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); }
    .quiz-btn { background: var(--lp-accent, #ff6f00); color: #fff; }
    .action-msg { padding: 12px; border-radius: 8px; background: #e8f5e9; color: #2e7d32; font-size: 13px; text-align: center; }
    .error-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class LessonViewComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  lesson: StudyLesson | null = null;
  loading = true;
  isCompleted = false;
  quizId: number | null = null;
  actionMsg = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) this.loadLesson(id);
    else this.loading = false;
  }

  private loadLesson(id: number): void {
    this.loading = true;
    this.api.getLessonById(id).subscribe({
      next: (data) => {
        this.lesson = data;
        this.loading = false;
        if (data.quizzes && data.quizzes.length > 0) {
          this.quizId = data.quizzes[0].id;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  goBack(): void {
    window.history.back();
  }

  markComplete(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!id) return;
    this.api.updateLessonProgress({ lessonId: id, status: 'completed' }).subscribe({
      next: () => {
        this.isCompleted = true;
        this.actionMsg = '✅ پیشرفت ذخیره شد. آفرین!';
        setTimeout(() => this.actionMsg = '', 3000);
      },
      error: () => {
        this.actionMsg = '❌ خطا در ذخیره پیشرفت';
      }
    });
  }

  startQuiz(): void {
    if (this.quizId) {
      this.router.navigate(['/learning/quizzes', this.quizId]);
    }
  }
}
