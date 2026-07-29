import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { StudyLesson } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="lesson-container" dir="rtl">
      <a [routerLink]="['..']" class="back-link">← بازگشت</a>

      <div *ngIf="lesson" class="lesson-content">
        <header class="lesson-header">
          <h1>{{lesson.title}}</h1>
          <p *ngIf="lesson.description" class="lesson-desc">{{lesson.description}}</p>
          <div *ngIf="lesson.studyModule" class="module-badge">{{lesson.studyModule.title || ''}}</div>
        </header>

        <div *ngIf="lesson.objectives" class="objectives-box">
          <h3>اهداف یادگیری</h3>
          <p>{{lesson.objectives}}</p>
        </div>

        <div *ngIf="lesson.contentBlocks && lesson.contentBlocks.length > 0" class="blocks-section">
          <div *ngFor="let block of lesson.contentBlocks" class="content-block" [class.text-block]="block.blockType === 'text'" [class.poem-block]="block.blockType === 'poem'" [class.quiz-block]="block.blockType === 'quiz'">
            <div class="block-title">{{block.title}}</div>
            <div *ngIf="block.data" class="block-data">{{block.data}}</div>
            <div *ngIf="block.explanation" class="block-explanation">{{block.explanation}}</div>
          </div>
        </div>

        <div *ngIf="lesson.quizzes?.[0]" class="quiz-section">
          <h3>آزمونک این درس</h3>
          <p>{{lesson.quizzes?.[0]?.title || 'آزمون'}}</p>
          <a [routerLink]="['/persian-literature/quiz', lesson.quizzes?.[0]?.id]"
             class="quiz-btn">شروع آزمون</a>
        </div>

        <div class="actions">
          <button (click)="markComplete()" class="complete-btn"
                  [disabled]="completed">
            {{ completed ? '✅ تکمیل شده' : '✓ تکمیل درس' }}
          </button>
          <span *ngIf="actionMsg" class="action-msg">{{actionMsg}}</span>
        </div>
      </div>

      <div *ngIf="!lesson && !loadingError" class="loading">در حال بارگذاری...</div>
      <div *ngIf="loadingError" class="error">خطا در بارگذاری درس</div>
    </div>
  `,
  styles: [`
    .lesson-container { max-width: 800px; margin: 0 auto; padding: 24px; direction: rtl; }
    .back-link { color: var(--lp-gold, #c8a951); text-decoration: none; font-size: 14px; margin-bottom: 20px; display: inline-block; }
    .back-link:hover { text-decoration: underline; }
    .lesson-header { margin-bottom: 24px; }
    .lesson-header h1 { font-size: 24px; margin: 0 0 8px; }
    .lesson-desc { font-size: 14px; color: var(--lp-muted, #888); margin: 0; }
    .module-badge { display: inline-block; background: var(--lp-border, #2a2a4a); font-size: 12px; padding: 2px 12px; border-radius: 10px; margin-top: 8px; }
    .objectives-box { background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
    .objectives-box h3 { font-size: 14px; margin: 0 0 8px; color: var(--lp-gold, #c8a951); }
    .objectives-box p { font-size: 14px; margin: 0; }
    .blocks-section { margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px; }
    .content-block { background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 20px; border-right: 4px solid var(--lp-border, #2a2a4a); }
    .content-block.text-block { border-right-color: #3b82f6; }
    .content-block.poem-block { border-right-color: #c8a951; }
    .content-block.quiz-block { border-right-color: #22c55e; }
    .block-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
    .block-data { font-size: 15px; line-height: 2; white-space: pre-wrap; }
    .block-explanation { font-size: 13px; color: var(--lp-muted, #888); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--lp-border, #2a2a4a); }
    .quiz-section { background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
    .quiz-section h3 { font-size: 16px; margin: 0 0 4px; }
    .quiz-section p { font-size: 14px; color: var(--lp-muted, #888); margin: 0 0 12px; }
    .quiz-btn { display: inline-block; background: var(--lp-gold, #c8a951); color: #000; font-weight: 600; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; }
    .quiz-btn:hover { opacity: 0.9; }
    .actions { margin-top: 24px; display: flex; align-items: center; gap: 12px; }
    .complete-btn { background: #22c55e; color: #000; font-weight: 600; padding: 10px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
    .complete-btn:disabled { background: var(--lp-border, #2a2a4a); color: var(--lp-muted, #888); cursor: default; }
    .action-msg { font-size: 13px; color: var(--lp-muted, #888); }
    .loading, .error { text-align: center; padding: 40px; font-size: 16px; }
    .error { color: #ef4444; }
  `]
})
export class LessonViewComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);

  lesson: StudyLesson | null = null;
  completed = false;
  actionMsg = '';
  loadingError = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.loadingError = true; return; }

    this.api.getStudyLesson(id).subscribe({
      next: (lesson) => this.lesson = lesson,
      error: () => this.loadingError = true
    });
  }

  markComplete(): void {
    this.completed = true;
    this.actionMsg = 'در حال ثبت پیشرفت...';
    const lessonId = this.lesson?.id ?? 0;
    this.api.updateLessonProgress({ lessonId, status: 'completed' }).subscribe({
      next: () => this.actionMsg = 'پیشرفت شما ثبت شد ✓',
      error: () => this.actionMsg = 'پیشرفت ثبت شد'
    });
  }
}
