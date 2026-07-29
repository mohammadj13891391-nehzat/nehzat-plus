import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';

import { StudyLesson, LessonContentBlock } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lesson-view" dir="rtl">
      <a class="back-link" [routerLink]="['/learning', pathId]">← بازگشت به مسیر یادگیری</a>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && lesson" class="lesson-content">
        <div class="lesson-header">
          <h1>{{ lesson.title }}</h1>
          <p class="lesson-description">{{ lesson.description }}</p>
        </div>

        <div *ngIf="lesson.objectives" class="objectives-section">
          <h2>اهداف یادگیری</h2>
          <p class="objectives-list">{{ lesson.objectives }}</p>
        </div>

        <div *ngIf="contentBlocks.length > 0" class="content-blocks">
          <div
            *ngFor="let block of contentBlocks"
            class="content-block"
            [class]="'block-type-' + block.blockType"
          >
            <h3 *ngIf="block.title" class="block-title">{{ block.title }}</h3>
            <div class="block-content" [innerHTML]="block.content"></div>
          </div>
        </div>

        <div *ngIf="lesson.quizzes?.[0]" class="quiz-cta">
          <a [routerLink]="['/learning', pathId, 'lessons', lesson.id, 'quiz', lesson.quizzes![0].id]" class="btn-quiz">
            شرکت در آزمون این درس
          </a>
        </div>
      </div>

      <div *ngIf="!loading && !lesson" class="empty-state">
        <p>درس مورد نظر یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .lesson-view { padding: 20px; max-width: 800px; margin: 0 auto; }
    .back-link { display: inline-block; margin-bottom: 20px; color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .loading { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .lesson-content { background: var(--lp-surface, #fff); border-radius: 12px; border: 1px solid var(--lp-border, #e0e0e0); overflow: hidden; }
    .lesson-header { padding: 24px; border-bottom: 1px solid var(--lp-border, #e0e0e0); }
    .lesson-header h1 { margin: 0 0 8px; font-size: 24px; color: var(--lp-text, #333); }
    .lesson-description { margin: 0; color: var(--lp-text-muted, #888); font-size: 14px; line-height: 1.6; }
    .objectives-section { padding: 20px 24px; border-bottom: 1px solid var(--lp-border, #e0e0e0); }
    .objectives-section h2 { margin: 0 0 12px; font-size: 18px; color: var(--lp-text, #333); }
    .objectives-list { margin: 0; padding-right: 20px; }
    .objectives-list li { margin-bottom: 8px; color: var(--lp-text, #333); font-size: 14px; line-height: 1.6; }
    .content-blocks { padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
    .content-block { padding: 20px; border-radius: 10px; border: 1px solid var(--lp-border, #e0e0e0); }
    .block-type-text { background: var(--lp-surface-hover, #fafafa); }
    .block-type-video { border-color: #e53935; background: #ffebee; }
    .block-type-image { border-color: #43a047; background: #e8f5e9; }
    .block-type-quote { border-color: #fb8c00; background: #fff3e0; font-style: italic; }
    .block-type-exercise { border-color: #1e88e5; background: #e3f2fd; }
    .block-title { margin: 0 0 12px; font-size: 16px; color: var(--lp-text, #333); }
    .block-content { font-size: 14px; line-height: 1.8; color: var(--lp-text, #333); }
    .quiz-cta { padding: 24px; text-align: center; border-top: 1px solid var(--lp-border, #e0e0e0); }
    .btn-quiz { display: inline-block; background: var(--lp-primary, #4a148c); color: #fff; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background 0.2s; }
    .btn-quiz:hover { background: var(--lp-primary-dark, #6a1b9a); }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class LessonViewComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  pathId: string = '';
  lesson: StudyLesson | null = null;
  contentBlocks: LessonContentBlock[] = [];
  loading = true;

  ngOnInit(): void {
    const pathId = this.route.snapshot.params['pathId'];
    const lessonId = Number(this.route.snapshot.params['lessonId']);
    this.pathId = pathId;
    if (lessonId) {
      this.loadLesson(lessonId);
      this.loadContentBlocks(lessonId);
    }
  }

  private loadLesson(lessonId: number): void {
    this.api.getStudyLesson(lessonId).subscribe({
      next: (data) => {
        this.lesson = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private loadContentBlocks(lessonId: number): void {
    this.api.getContentBlocks(lessonId).subscribe({
      next: (blocks) => {
        this.contentBlocks = blocks.sort((a, b) => a.sortOrder - b.sortOrder);
      },
      error: () => {}
    });
  }
}
