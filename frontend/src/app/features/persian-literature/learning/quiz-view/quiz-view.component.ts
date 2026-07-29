import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';

import { LessonPlannerApi } from '../../../../core/services/lesson-planner-api.interface';
import { PersLitQuiz, PersLitQuizQuestion, QuizResultDto, SubmitQuizRequest } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-quiz-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quiz-view" dir="rtl">
      <a class="back-link" [routerLink]="['/learning', pathId, 'lessons', lessonId]">← بازگشت به درس</a>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && !submitted && quiz" class="quiz-content">
        <ng-container *ngIf="quiz.questions as questions">
          <div class="quiz-header">
            <h1>{{ quiz.title }}</h1>
            <p class="quiz-description">{{ quiz.description }}</p>
            <div class="quiz-progress-info">
              <span>سوال {{ currentQuestion + 1 }} از {{ questions.length }}</span>
              <span>نمره قبولی: {{ quiz.passingScore }} از {{ questions.length }}</span>
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="((currentQuestion + 1) / questions.length) * 100"></div>
          </div>

          <div class="question-card" *ngIf="questions.length > 0">
            <div class="question-number">سوال {{ currentQuestion + 1 }}</div>
            <p class="question-text">{{ questions[currentQuestion].questionText }}</p>

            <div class="options-list">
              <div
                *ngFor="let option of questions[currentQuestion].options; let optIdx = index"
                class="option-item"
                [class.selected]="selectedAnswers[currentQuestion] === optIdx"
                (click)="selectOption(currentQuestion, optIdx)"
              >
                <div class="option-radio">
                  <div *ngIf="selectedAnswers[currentQuestion] === optIdx" class="option-dot"></div>
                </div>
                <span class="option-text">{{ option.text }}</span>
              </div>
            </div>
          </div>

          <div class="quiz-navigation">
            <button
              class="btn-nav"
              [disabled]="currentQuestion === 0"
              (click)="prevQuestion()"
            >
              سوال قبلی
            </button>

            <span class="nav-separator"></span>

            <button
              *ngIf="currentQuestion < (questions.length - 1)"
              class="btn-nav btn-primary"
              [disabled]="selectedAnswers[currentQuestion] === undefined"
              (click)="nextQuestion()"
            >
              سوال بعدی
            </button>

            <button
              *ngIf="currentQuestion === (questions.length - 1)"
              class="btn-nav btn-submit"
              [disabled]="selectedAnswers[currentQuestion] === undefined || submitting"
              (click)="submitQuiz()"
            >
              {{ submitting ? 'در حال ارسال...' : 'ارسال پاسخ‌ها' }}
            </button>
          </div>
        </ng-container>
      </div>

      <div *ngIf="!loading && submitted && result" class="result-content">
        <div class="result-card" [class.passed]="result.passed" [class.failed]="!result.passed">
          <div class="result-icon">{{ result.passed ? '✓' : '✗' }}</div>
          <h2>{{ result.passed ? 'قبول شدید!' : 'قبول نشدید' }}</h2>
          <div class="result-score">
            <span class="score-value">{{ result.score }}</span>
            <span class="score-separator">/</span>
            <span class="score-total">{{ result.totalPoints }}</span>
          </div>
          <p class="result-message">
            {{ result.passed ? 'آفرین! شما با موفقیت این آزمون را گذراندید.' : 'متأسفانه نمره قبولی را کسب نکردید. دوباره تلاش کنید.' }}
          </p>
        </div>

        <div class="result-actions">
          <a [routerLink]="['/learning', pathId, 'lessons', lessonId]" class="btn-nav btn-primary">
            بازگشت به درس
          </a>
        </div>
      </div>

      <div *ngIf="!loading && !quiz" class="empty-state">
        <p>آزمون مورد نظر یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .quiz-view { padding: 20px; max-width: 700px; margin: 0 auto; }
    .back-link { display: inline-block; margin-bottom: 20px; color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .loading { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .quiz-content { background: var(--lp-surface, #fff); border-radius: 12px; border: 1px solid var(--lp-border, #e0e0e0); overflow: hidden; }
    .quiz-header { padding: 24px; border-bottom: 1px solid var(--lp-border, #e0e0e0); }
    .quiz-header h1 { margin: 0 0 8px; font-size: 22px; color: var(--lp-text, #333); }
    .quiz-description { margin: 0 0 12px; color: var(--lp-text-muted, #888); font-size: 14px; }
    .quiz-progress-info { display: flex; justify-content: space-between; font-size: 13px; color: var(--lp-text-muted, #888); }
    .progress-bar { height: 6px; background: var(--lp-border, #e0e0e0); }
    .progress-fill { height: 100%; background: var(--lp-primary, #4a148c); transition: width 0.3s ease; border-radius: 0 0 3px 3px; }
    .question-card { padding: 24px; }
    .question-number { font-size: 13px; font-weight: 600; color: var(--lp-primary, #4a148c); margin-bottom: 8px; }
    .question-text { font-size: 16px; color: var(--lp-text, #333); line-height: 1.8; margin-bottom: 20px; }
    .options-list { display: flex; flex-direction: column; gap: 10px; }
    .option-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid var(--lp-border, #e0e0e0); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .option-item:hover { border-color: var(--lp-primary-light, #ce93d8); }
    .option-item.selected { border-color: var(--lp-primary, #4a148c); background: var(--lp-primary-light, #e1bee7); }
    .option-radio { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--lp-border, #e0e0e0); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .option-item.selected .option-radio { border-color: var(--lp-primary, #4a148c); }
    .option-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--lp-primary, #4a148c); }
    .option-text { font-size: 14px; color: var(--lp-text, #333); }
    .quiz-navigation { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 20px 24px; border-top: 1px solid var(--lp-border, #e0e0e0); }
    .btn-nav { padding: 10px 24px; border-radius: 8px; border: 1px solid var(--lp-border, #e0e0e0); background: var(--lp-surface, #fff); color: var(--lp-text, #333); font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .btn-nav:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-nav:not(:disabled):hover { background: var(--lp-surface-hover, #f5f5f5); }
    .btn-primary { background: var(--lp-primary, #4a148c); color: #fff; border-color: var(--lp-primary, #4a148c); }
    .btn-primary:not(:disabled):hover { background: var(--lp-primary-dark, #6a1b9a); }
    .btn-submit { background: #43a047; color: #fff; border-color: #43a047; }
    .btn-submit:not(:disabled):hover { background: #388e3c; }
    .nav-separator { width: 1px; height: 24px; background: var(--lp-border, #e0e0e0); }
    .result-content { padding: 24px 0; }
    .result-card { text-align: center; padding: 40px 24px; background: var(--lp-surface, #fff); border-radius: 12px; border: 1px solid var(--lp-border, #e0e0e0); margin-bottom: 24px; }
    .result-card.passed { border-color: #4caf50; }
    .result-card.failed { border-color: #e53935; }
    .result-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; margin: 0 auto 16px; }
    .passed .result-icon { background: #e8f5e9; color: #2e7d32; }
    .failed .result-icon { background: #ffebee; color: #c62828; }
    .result-card h2 { margin: 0 0 16px; font-size: 22px; color: var(--lp-text, #333); }
    .result-score { display: flex; align-items: baseline; justify-content: center; gap: 4px; margin-bottom: 12px; }
    .score-value { font-size: 48px; font-weight: 700; color: var(--lp-primary, #4a148c); }
    .passed .score-value { color: #2e7d32; }
    .failed .score-value { color: #c62828; }
    .score-separator { font-size: 32px; color: var(--lp-text-muted, #888); }
    .score-total { font-size: 32px; color: var(--lp-text-muted, #888); }
    .result-message { color: var(--lp-text-muted, #888); font-size: 14px; }
    .answers-review { background: var(--lp-surface, #fff); border-radius: 12px; border: 1px solid var(--lp-border, #e0e0e0); padding: 24px; margin-bottom: 24px; }
    .answers-review h3 { margin: 0 0 16px; font-size: 18px; color: var(--lp-text, #333); }
    .answer-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
    .answer-item.correct { background: #e8f5e9; }
    .answer-item.incorrect { background: #ffebee; }
    .answer-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0; }
    .answer-item.correct .answer-icon { background: #4caf50; color: #fff; }
    .answer-item.incorrect .answer-icon { background: #e53935; color: #fff; }
    .answer-detail { flex: 1; }
    .answer-question { margin: 0 0 4px; font-size: 14px; color: var(--lp-text, #333); }
    .answer-selected { margin: 0; font-size: 13px; color: var(--lp-text-muted, #888); }
    .result-actions { text-align: center; padding: 0 24px 24px; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class QuizViewComponent implements OnInit {
  private api: LessonPlannerApi = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  pathId: string = '';
  lessonId: string = '';
  quiz: PersLitQuiz | null = null;
  loading = true;
  submitted = false;
  submitting = false;
  result: QuizResultDto | null = null;
  currentQuestion = 0;
  selectedAnswers: (number | undefined)[] = [];

  ngOnInit(): void {
    const pathId = this.route.snapshot.params['pathId'];
    const lessonId = this.route.snapshot.params['lessonId'];
    const quizId = this.route.snapshot.params['quizId'];
    this.pathId = pathId;
    this.lessonId = lessonId;
    if (quizId) {
      this.loadQuiz(quizId);
    }
  }

  get questions(): PersLitQuizQuestion[] {
    return this.quiz?.questions ?? [];
  }

  private loadQuiz(quizId: string): void {
    this.loading = true;
    this.api.getQuiz(Number(quizId)).subscribe({
      next: (data) => {
        this.quiz = data;
        this.selectedAnswers = (data.questions ?? []).map(() => undefined);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectOption(questionIndex: number, optionIndex: number): void {
    this.selectedAnswers[questionIndex] = optionIndex;
  }

  nextQuestion(): void {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  submitQuiz(): void {
    if (!this.quiz) return;
    this.submitting = true;

    const payload: SubmitQuizRequest = {
      quizId: this.quiz.id,
      answers: this.questions.map((q, i) => ({
        questionId: q.id,
        answer: String(this.selectedAnswers[i] ?? 0)
      }))
    };

    this.api.submitQuiz(payload).subscribe({
      next: (res) => {
        this.result = res;
        this.submitted = true;
        this.submitting = false;
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

}
