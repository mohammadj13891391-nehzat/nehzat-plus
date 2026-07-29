import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { PersLitQuiz, PersLitQuizQuestion, QuizResultDto, QuizOption } from '../../../core/models/lesson-planner.models';

type ParsedOption = QuizOption;

@Component({
  selector: 'app-quiz-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="quiz-container" dir="rtl">
      <a [routerLink]="['..']" class="back-link">← بازگشت</a>

      <div *ngIf="!submitted && quiz" class="quiz-content">
        <header class="quiz-header">
          <h1>{{quiz.title}}</h1>
          <p *ngIf="quiz.description" class="quiz-desc">{{quiz.description}}</p>
          <div class="quiz-meta">
            <span>{{questions.length}} سوال</span>
            <span>{{quiz.passingScore || 0}}% نمره قبولی</span>
          </div>
        </header>

        <div *ngFor="let question of questions; let i = index" class="question-card">
          <div class="question-header">
            <span class="q-number">سوال {{i + 1}}</span>
            <span class="q-points">{{question.points || 1}} امتیاز</span>
          </div>
          <p class="question-text">{{question.questionText}}</p>
          <div class="options">
            <button *ngFor="let option of getParsedOptions(question); let j = index"
                    (click)="selectAnswer(question.id, option.text)"
                    class="option-btn"
                    [class.selected]="answers[question.id] === option.text">
              <span class="option-label">{{getLabel(j)}}</span>
              <span class="option-text">{{option.text}}</span>
            </button>
          </div>
        </div>

        <div class="actions">
          <button (click)="submitQuiz()" class="submit-btn" [disabled]="Object.keys(answers).length !== questions.length">
            ارسال پاسخ‌ها
          </button>
          <span *ngIf="!allAnswered" class="hint">{{questions.length - Object.keys(answers).length}} سوال بی‌پاسخ</span>
        </div>
      </div>

      <div *ngIf="submitted && result" class="result-container">
        <div class="result-card" [class.passed]="result.passed" [class.failed]="!result.passed">
          <div class="result-icon">{{result.passed ? '🎉' : '😔'}}</div>
          <h2>{{result.passed ? 'قبول شدید!' : 'قبول نشدید'}}</h2>
          <div class="score-display">
            <span class="score-value">{{result.score}}</span>
            <span class="score-total">از {{result.totalPoints}}</span>
          </div>
          <p>{{result.percentage}}% درصد</p>
        </div>
        <a [routerLink]="['..']" class="back-to-btn">بازگشت به درس</a>
      </div>

      <div *ngIf="!quiz && !loadingError" class="loading">در حال بارگذاری...</div>
      <div *ngIf="loadingError" class="error">خطا در بارگذاری آزمون</div>
    </div>
  `,
  styles: [`
    .quiz-container { max-width: 700px; margin: 0 auto; padding: 24px; direction: rtl; }
    .back-link { color: var(--lp-gold, #c8a951); text-decoration: none; font-size: 14px; margin-bottom: 20px; display: inline-block; }
    .back-link:hover { text-decoration: underline; }
    .quiz-header { margin-bottom: 24px; }
    .quiz-header h1 { font-size: 22px; margin: 0 0 8px; }
    .quiz-desc { font-size: 14px; color: var(--lp-muted, #888); margin: 0 0 12px; }
    .quiz-meta { display: flex; gap: 16px; font-size: 13px; color: var(--lp-muted, #888); }
    .question-card { background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .q-number { font-size: 13px; font-weight: 600; color: var(--lp-gold, #c8a951); }
    .q-points { font-size: 12px; color: var(--lp-muted, #888); }
    .question-text { font-size: 16px; line-height: 1.8; margin: 0 0 16px; }
    .options { display: flex; flex-direction: column; gap: 8px; }
    .option-btn { display: flex; align-items: center; gap: 12px; background: transparent; border: 1px solid var(--lp-border, #2a2a4a); border-radius: 8px; padding: 12px 16px; cursor: pointer; text-align: right; transition: all 0.2s; color: inherit; font-size: 14px; }
    .option-btn:hover { border-color: var(--lp-gold, #c8a951); }
    .option-btn.selected { border-color: var(--lp-gold, #c8a951); background: rgba(200, 169, 81, 0.1); }
    .option-label { width: 24px; height: 24px; border-radius: 50%; background: var(--lp-border, #2a2a4a); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
    .option-btn.selected .option-label { background: var(--lp-gold, #c8a951); color: #000; }
    .actions { margin-top: 24px; display: flex; align-items: center; gap: 16px; }
    .submit-btn { background: var(--lp-gold, #c8a951); color: #000; font-weight: 700; padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; }
    .submit-btn:disabled { opacity: 0.4; cursor: default; }
    .hint { font-size: 13px; color: var(--lp-muted, #888); }
    .result-container { text-align: center; padding: 40px 0; }
    .result-card { max-width: 400px; margin: 0 auto 24px; background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 16px; padding: 32px; }
    .result-card.passed { border-color: #22c55e; }
    .result-card.failed { border-color: #ef4444; }
    .result-icon { font-size: 64px; margin-bottom: 16px; }
    .result-card h2 { font-size: 20px; margin: 0 0 16px; }
    .score-display { margin-bottom: 12px; }
    .score-value { font-size: 48px; font-weight: 700; color: var(--lp-gold, #c8a951); }
    .score-total { font-size: 18px; color: var(--lp-muted, #888); }
    .result-card p { font-size: 14px; color: var(--lp-muted, #888); margin: 0; }
    .back-to-btn { display: inline-block; background: var(--lp-gold, #c8a951); color: #000; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; }
    .loading, .error { text-align: center; padding: 40px; font-size: 16px; }
    .error { color: #ef4444; }
  `]
})
export class QuizViewComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  protected Object = Object;

  quiz: PersLitQuiz | null = null;
  questions: PersLitQuizQuestion[] = [];
  answers: Record<number, string> = {};
  submitted = false;
  result: QuizResultDto | null = null;
  loadingError = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.loadingError = true; return; }

    this.api.getQuiz(id).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.questions = quiz.questions || [];
      },
      error: () => this.loadingError = true
    });
  }

  getParsedOptions(question: PersLitQuizQuestion): ParsedOption[] {
    return question.options || [];
  }

  getLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  get allAnswered(): boolean {
    return this.questions.length > 0 && Object.keys(this.answers).length === this.questions.length;
  }

  selectAnswer(questionId: number, answer: string): void {
    this.answers[questionId] = answer;
  }

  submitQuiz(): void {
    const answers = Object.entries(this.answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer
    }));

    this.api.submitQuiz({ quizId: this.quiz?.id ?? 0, answers }).subscribe({
      next: (result) => {
        this.result = result;
        this.submitted = true;
      },
      error: () => {
        this.submitted = true;
        this.result = {
          attempt: { id: 0, userEnrollmentId: 0, quizId: this.quiz?.id ?? 0, score: 0, totalPoints: this.questions.length * 10, answers: '[]', isPassed: false, attemptNumber: 1, startedAt: new Date().toISOString(), completedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          passed: false,
          score: 0,
          totalPoints: this.questions.length * 10,
          percentage: 0,
          passedThreshold: 70
        };
      }
    });
  }
}
