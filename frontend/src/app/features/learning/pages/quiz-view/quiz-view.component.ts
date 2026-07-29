import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { PersLitQuiz, PersLitQuizQuestion } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-quiz-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="quiz-container" dir="rtl">
      <a class="back-link" (click)="goBack()">← بازگشت به درس</a>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری آزمون...</p>
      </div>

      <div *ngIf="!loading && quiz">
        <div class="quiz-header">
          <h1>{{ quiz.title }}</h1>
          <div class="quiz-meta">
            <span>{{ questions.length }} سوال</span>
            <span>⏱ {{ quiz.timeLimitMinutes }} دقیقه</span>
            <span>📈 نمره قبولی: {{ quiz.passingScore }}%</span>
          </div>
        </div>

        <div *ngIf="!submitted" class="questions-section">
          <div class="question-card" *ngFor="let question of questions; let i = index">
            <div class="q-header">
              <span class="q-number">سوال {{ i + 1 }}</span>
              <span class="q-points">{{ question.points }} امتیاز</span>
            </div>
            <p class="q-text">{{ question.questionText }}</p>
            <div class="options" *ngIf="question.options?.length">
              <label class="option" *ngFor="let opt of question.options; let oi = index"
                     [class.selected]="answers[question.id] === opt.id"
                     [class.correct]="submitted && opt.isCorrect"
                     [class.wrong]="submitted && answers[question.id] === opt.id && !opt.isCorrect">
                <input type="radio" name="q_{{ question.id }}" [value]="opt.id"
                       (change)="selectAnswer(question.id, opt.id)"
                       [disabled]="submitted">
                <span class="opt-label">{{ opt.label }}</span>
                <span class="opt-text">{{ opt.text }}</span>
              </label>
            </div>
          </div>

          <button class="submit-btn" (click)="submitQuiz()" [disabled]="submitting || Object.keys(answers).length === 0">
            {{ submitting ? 'در حال ارسال...' : 'ارسال پاسخ‌ها' }}
          </button>
        </div>

        <div *ngIf="submitted && result" class="result-section">
          <div class="result-card" [class.passed]="result.passed" [class.failed]="!result.passed">
            <div class="result-icon">{{ result.passed ? '🎉' : '😔' }}</div>
            <h2>{{ result.passed ? 'قبول شدید!' : 'نیاز به تلاش بیشتر' }}</h2>
            <div class="result-score">
              <span class="score-value">{{ result.score }}</span>
              <span class="score-total">از {{ result.totalPoints }} امتیاز</span>
            </div>
            <div class="result-bar">
              <div class="result-fill" [style.width.%]="result.percentage"></div>
            </div>
            <p class="result-percent">{{ result.percentage }}%</p>
            <p class="result-msg">{{ result.passed ? 'آفرین! به مرحله بعد بروید.' : 'درس را مرور کنید و دوباره تلاش کنید.' }}</p>
            <button class="retry-quiz-btn" (click)="resetQuiz()">تلاش مجدد</button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !quiz" class="error-state">
        <p>آزمون مورد نظر یافت نشد.</p>
        <a class="back-link" (click)="goBack()">بازگشت</a>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container { padding: 20px; max-width: 700px; margin: 0 auto; direction: rtl; }
    .back-link { color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; cursor: pointer; display: inline-block; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .quiz-header { margin-bottom: 24px; text-align: center; }
    .quiz-header h1 { margin: 0 0 12px; font-size: 24px; color: var(--lp-text, #333); }
    .quiz-meta { display: flex; justify-content: center; gap: 16px; font-size: 13px; color: var(--lp-text-muted, #888); flex-wrap: wrap; }
    .question-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 10px; padding: 20px; margin-bottom: 16px; }
    .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .q-number { font-weight: bold; color: var(--lp-primary, #4a148c); font-size: 14px; }
    .q-points { font-size: 12px; color: var(--lp-text-muted, #888); }
    .q-text { font-size: 15px; line-height: 1.7; color: var(--lp-text, #333); margin-bottom: 16px; }
    .options { display: flex; flex-direction: column; gap: 8px; }
    .option { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid var(--lp-border, #e0e0e0); border-radius: 8px; cursor: pointer; transition: all 0.15s; }
    .option:hover { border-color: var(--lp-primary, #4a148c); background: var(--lp-surface-alt, #f5f5f5); }
    .option.selected { border-color: var(--lp-primary, #4a148c); background: var(--lp-primary-light, #e8eaf6); }
    .option.correct { border-color: #2e7d32; background: #e8f5e9; }
    .option.wrong { border-color: #c62828; background: #fce4ec; }
    .option input { display: none; }
    .opt-label { font-weight: 600; color: var(--lp-primary, #4a148c); margin-left: 4px; }
    .opt-text { font-size: 14px; color: var(--lp-text, #444); }
    .submit-btn { display: block; width: 100%; padding: 12px; background: var(--lp-primary, #4a148c); color: #fff; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 20px; }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .result-section { text-align: center; }
    .result-card { background: var(--lp-surface, #fff); border: 2px solid var(--lp-border, #e0e0e0); border-radius: 16px; padding: 32px 24px; max-width: 400px; margin: 0 auto; }
    .result-card.passed { border-color: #2e7d32; }
    .result-card.failed { border-color: #c62828; }
    .result-icon { font-size: 48px; margin-bottom: 12px; }
    .result-card h2 { margin: 0 0 16px; color: var(--lp-text, #333); }
    .result-score { margin-bottom: 12px; }
    .score-value { font-size: 36px; font-weight: bold; color: var(--lp-primary, #4a148c); }
    .score-total { font-size: 14px; color: var(--lp-text-muted, #888); margin-right: 4px; }
    .result-bar { height: 8px; background: var(--lp-border, #e0e0e0); border-radius: 4px; margin-bottom: 8px; overflow: hidden; }
    .result-fill { height: 100%; background: var(--lp-primary, #4a148c); border-radius: 4px; transition: width 0.5s; }
    .result-percent { font-size: 14px; color: var(--lp-text-muted, #888); margin-bottom: 8px; }
    .result-msg { font-size: 14px; color: var(--lp-text, #555); margin-bottom: 16px; }
    .retry-quiz-btn { padding: 10px 24px; background: var(--lp-accent, #ff6f00); color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
    .error-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class QuizViewComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected Object = Object;
  quiz: PersLitQuiz | null = null;
  questions: PersLitQuizQuestion[] = [];
  loading = true;
  submitted = false;
  submitting = false;
  answers: Record<number, number> = {};
  result: { score: number; totalPoints: number; percentage: number; passed: boolean } | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) this.loadQuiz(id);
    else this.loading = false;
  }

  private loadQuiz(id: number): void {
    this.loading = true;
    this.api.getQuizById(id).subscribe({
      next: (data) => {
        this.quiz = data;
        this.loadQuestions(data.id);
      },
      error: () => { this.loading = false; }
    });
  }

  private loadQuestions(quizId: number): void {
    this.api.getQuizQuestions(quizId).subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectAnswer(questionId: number, optionId: number): void {
    this.answers[questionId] = optionId;
  }

  submitQuiz(): void {
    const quizId = this.quiz?.id;
    if (!quizId) return;
    this.submitting = true;
    this.api.submitQuiz({ quizId, answers: Object.entries(this.answers).map(([qId, optId]) => ({ questionId: Number(qId), answer: String(optId) })) }).subscribe({
      next: (res) => {
        this.submitted = true;
        this.submitting = false;
        this.result = res;
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  resetQuiz(): void {
    this.submitted = false;
    this.answers = {};
    this.result = null;
    const id = Number(this.route.snapshot.params['id']);
    if (id) this.loadQuiz(id);
  }

  goBack(): void {
    window.history.back();
  }
}
