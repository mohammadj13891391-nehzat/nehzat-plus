import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { ArabicLesson, ArabicUserProgress } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-arabic-lesson-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="literature-container" dir="rtl">
      <a [routerLink]="['/arabic-literature/courses', lesson?.courseId]" class="back-link">← بازگشت به دوره</a>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && lesson" class="lesson-content">
        <div class="lesson-header">
          <h1>{{ lesson.title }}</h1>
          <div class="lesson-meta">
            <span>{{ lesson.durationMinutes }} دقیقه</span>
            <span *ngIf="lesson.objectives">{{ getObjectiveCount(lesson.objectives) }} هدف یادگیری</span>
          </div>
        </div>

        <div *ngIf="lesson.objectives" class="objectives-box">
          <h3>📌 اهداف یادگیری</h3>
          <ul>
            <li *ngFor="let obj of getObjectives(lesson.objectives)">{{ obj }}</li>
          </ul>
        </div>

        <div *ngIf="lesson.content" class="content-box">
          <h3>📖 محتوای آموزشی</h3>
          <div class="content-text">{{ lesson.content }}</div>
        </div>

        <div *ngIf="lesson.exerciseData" class="exercise-box">
          <h3>✍️ تمرین‌ها</h3>
          <pre>{{ lesson.exerciseData }}</pre>
        </div>

        <div *ngIf="lesson.quizData" class="quiz-box">
          <h3>📝 آزمونک</h3>
          <pre>{{ lesson.quizData }}</pre>
        </div>

        <div class="lesson-actions">
          <button class="btn btn-primary" (click)="markInProgress()" *ngIf="!currentProgress">
            شروع درس
          </button>
          <button class="btn btn-success" (click)="markCompleted()" *ngIf="currentProgress?.status !== 'completed'">
            تکمیل درس
          </button>
          <button class="btn btn-outline" *ngIf="currentProgress?.status === 'completed'" disabled>
            ✓ تکمیل شده
          </button>
        </div>

        <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .literature-container { padding: 20px; max-width: 800px; margin: 0 auto; direction: rtl; }
    .back-link { display: inline-block; margin-bottom: 16px; color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .lesson-header { margin-bottom: 20px; padding: 24px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-primary-dark, #6a1b9a)); color: #fff; border-radius: 12px; }
    .lesson-header h1 { margin: 0 0 8px; font-size: 22px; }
    .lesson-meta { display: flex; gap: 16px; font-size: 13px; opacity: 0.85; }
    .objectives-box, .content-box, .exercise-box, .quiz-box { margin-bottom: 20px; padding: 20px; background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; }
    .objectives-box h3, .content-box h3, .exercise-box h3, .quiz-box h3 { margin: 0 0 12px; font-size: 16px; color: var(--lp-text, #333); }
    .objectives-box ul { margin: 0; padding-right: 20px; }
    .objectives-box li { margin-bottom: 6px; font-size: 14px; color: var(--lp-text, #333); line-height: 1.6; }
    .content-text { font-size: 14px; color: var(--lp-text, #333); line-height: 1.8; white-space: pre-line; }
    .exercise-box pre, .quiz-box pre { margin: 0; font-size: 13px; color: var(--lp-text-muted, #555); white-space: pre-wrap; background: var(--lp-bg, #f9f9f9); padding: 12px; border-radius: 8px; }
    .lesson-actions { display: flex; gap: 12px; margin-top: 24px; justify-content: center; }
    .btn { padding: 12px 32px; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
    .btn:disabled { opacity: 0.6; cursor: default; }
    .btn-primary { background: var(--lp-primary, #4a148c); color: #fff; }
    .btn-success { background: #4caf50; color: #fff; }
    .btn-outline { background: #e8f5e9; color: #2e7d32; }
    .btn:hover:not(:disabled) { opacity: 0.9; }
    .success-message { margin-top: 12px; padding: 12px; background: #e8f5e9; color: #2e7d32; border-radius: 8px; text-align: center; font-size: 14px; }
    .error-message { margin-top: 12px; padding: 12px; background: #fce4ec; color: #c62828; border-radius: 8px; text-align: center; font-size: 14px; }
  `]
})
export class LessonViewComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);

  lesson: ArabicLesson | null = null;
  currentProgress: ArabicUserProgress | null = null;
  loading = true;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadLesson(id);
  }

  private loadLesson(id: number): void {
    this.loading = true;
    this.api.getArabicLessonById(id).subscribe({
      next: (lesson) => {
        this.lesson = lesson;
        this.loadExistingProgress();
      },
      error: () => this.loading = false
    });
  }

  private loadExistingProgress(): void {
    this.api.getArabicUserProgress().subscribe({
      next: (progress) => {
        this.currentProgress = progress.find(p => p.lessonId === this.lesson?.id) ?? null;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getObjectives(objectives: string | undefined): string[] {
    if (!objectives) return [];
    try {
      const parsed = JSON.parse(objectives);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }

  getObjectiveCount(objectives: string | undefined): number {
    return this.getObjectives(objectives).length;
  }

  markInProgress(): void {
    if (!this.lesson) return;
    this.clearMessages();
    this.api.recordArabicProgress({ lessonId: this.lesson.id, status: 'in_progress' }).subscribe({
      next: (progress) => {
        this.currentProgress = progress;
        this.successMessage = 'درس شروع شد.';
      },
      error: () => this.errorMessage = 'خطا در ثبت پیشرفت.'
    });
  }

  markCompleted(): void {
    if (!this.lesson) return;
    this.clearMessages();
    this.api.recordArabicProgress({ lessonId: this.lesson.id, status: 'completed', score: 100 }).subscribe({
      next: (progress) => {
        this.currentProgress = progress;
        this.successMessage = 'درس با موفقیت تکمیل شد! 🎉';
      },
      error: () => this.errorMessage = 'خطا در ثبت پیشرفت.'
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
