import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { MathLesson } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-math-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div dir="rtl" class="container">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && lesson">
        <a [routerLink]="['/math/topics', lesson.mathTopicId, 'lessons']" class="back-link">بازگشت به دروس</a>

        <div class="lesson-header">
          <h1>{{ lesson.title }}</h1>
          <div class="meta">
            <span>⏱ {{ lesson.durationMinutes }} دقیقه</span>
          </div>
        </div>

        <div class="content" [innerHTML]="lesson.content"></div>

        <div class="actions">
          <a [routerLink]="['/math/lessons', lesson.id, 'practice']" class="btn btn-primary">
            شروع تمرین
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .loading { text-align: center; padding: 48px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--lp-border); border-top-color: var(--lp-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .back-link { color: var(--lp-primary); text-decoration: none; font-size: 0.9rem; display: inline-block; margin-bottom: 24px; }
    .back-link:hover { text-decoration: underline; }
    .lesson-header { margin-bottom: 32px; }
    .lesson-header h1 { color: var(--lp-text); margin-bottom: 8px; }
    .meta { color: var(--lp-text-muted); font-size: 0.9rem; }
    .content { color: var(--lp-text); line-height: 1.8; font-size: 1.1rem; background: var(--lp-surface); padding: 32px; border-radius: 12px; border: 1px solid var(--lp-border); }
    .actions { margin-top: 32px; text-align: center; }
    .btn { display: inline-block; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; transition: background 0.2s; }
    .btn-primary { background: var(--lp-primary); color: white; }
    .btn-primary:hover { background: var(--lp-primary-dark); }
  `]
})
export class MathLessonDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  lesson: MathLesson | null = null;
  loading = true;

  ngOnInit(): void {
    const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.api.getMathLessonById(lessonId).subscribe({
      next: (lesson) => { this.lesson = lesson; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
