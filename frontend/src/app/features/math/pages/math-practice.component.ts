import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { MathQuestion } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-math-practice',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div dir="rtl" class="container">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری سوالات...</p>
      </div>

      <div *ngIf="!loading && questions.length === 0" class="empty">
        <p>سوالی برای تمرین موجود نیست</p>
        <a [routerLink]="['/math/lessons', lessonId]" class="btn btn-secondary">بازگشت به درس</a>
      </div>

      <div *ngIf="!loading && questions.length > 0" class="practice-container">
        <div class="progress-bar">
          <div class="progress" [style.width.%]="((currentIndex + 1) / questions.length) * 100"></div>
        </div>
        <div class="question-counter">سوال {{ currentIndex + 1 }} از {{ questions.length }}</div>

        <div class="question-card">
          <h2>{{ questions[currentIndex].questionText }}</h2>

          <div class="options">
            <button
              *ngFor="let option of getOptions(questions[currentIndex]); let i = index"
              class="option-btn"
              [class.selected]="selectedOption === option.key"
              [class.correct]="showResult && option.key === questions[currentIndex].correctOption"
              [class.wrong]="showResult && selectedOption === option.key && option.key !== questions[currentIndex].correctOption"
              (click)="selectOption(option.key)"
              [disabled]="showResult"
            >
              <span class="option-label">{{ option.key }}</span>
              <span class="option-text">{{ option.text }}</span>
            </button>
          </div>

          <div *ngIf="showResult" class="result">
            <div *ngIf="selectedOption === questions[currentIndex].correctOption" class="correct-result">
              ✅ پاسخ صحیح!
            </div>
            <div *ngIf="selectedOption !== questions[currentIndex].correctOption" class="wrong-result">
              ❌ پاسخ غلط! پاسخ صحیح: {{ questions[currentIndex].correctOption }}
            </div>
            <div *ngIf="questions[currentIndex].explanation" class="explanation">
              💡 {{ questions[currentIndex].explanation }}
            </div>
          </div>

          <div class="actions">
            <button *ngIf="!showResult" class="btn btn-primary" (click)="submitAnswer()" [disabled]="!selectedOption">
              ثبت پاسخ
            </button>
            <button *ngIf="showResult && currentIndex < questions.length - 1" class="btn btn-primary" (click)="nextQuestion()">
              سوال بعدی
            </button>
            <button *ngIf="showResult && currentIndex === questions.length - 1" class="btn btn-success" (click)="finishPractice()">
              پایان تمرین
            </button>
          </div>
        </div>

        <div class="score-summary" *ngIf="finished">
          <h2>نتیجه تمرین</h2>
          <div class="score">{{ correctCount }} از {{ questions.length }}</div>
          <div class="percentage">{{ Math.round((correctCount / questions.length) * 100) }}%</div>
          <a [routerLink]="['/math/lessons', lessonId]" class="btn btn-primary">بازگشت به درس</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 700px; margin: 0 auto; padding: 24px; }
    .loading, .empty { text-align: center; padding: 48px; color: var(--lp-text-muted); }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--lp-border); border-top-color: var(--lp-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .progress-bar { height: 6px; background: var(--lp-border); border-radius: 3px; margin-bottom: 16px; }
    .progress { height: 100%; background: var(--lp-primary); border-radius: 3px; transition: width 0.3s; }
    .question-counter { text-align: center; color: var(--lp-text-muted); margin-bottom: 24px; }
    .question-card { background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 12px; padding: 32px; }
    .question-card h2 { color: var(--lp-text); margin-bottom: 24px; line-height: 1.6; }
    .options { display: flex; flex-direction: column; gap: 12px; }
    .option-btn { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--lp-surface-light); border: 2px solid var(--lp-border); border-radius: 8px; cursor: pointer; transition: all 0.2s; text-align: right; }
    .option-btn:hover:not(:disabled) { border-color: var(--lp-primary); }
    .option-btn.selected { border-color: var(--lp-primary); background: var(--lp-primary-light); }
    .option-btn.correct { border-color: #2e7d32; background: #e8f5e9; }
    .option-btn.wrong { border-color: #c62828; background: #fce4ec; }
    .option-btn:disabled { cursor: default; }
    .option-label { width: 32px; height: 32px; background: var(--lp-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
    .option-text { color: var(--lp-text); }
    .result { margin-top: 24px; padding: 16px; border-radius: 8px; }
    .correct-result { color: #2e7d32; background: #e8f5e9; padding: 12px; border-radius: 8px; }
    .wrong-result { color: #c62828; background: #fce4ec; padding: 12px; border-radius: 8px; }
    .explanation { margin-top: 12px; color: var(--lp-text-muted); font-style: italic; }
    .actions { margin-top: 24px; text-align: center; }
    .btn { padding: 12px 32px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; font-size: 1rem; transition: background 0.2s; }
    .btn-primary { background: var(--lp-primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-dark); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-success { background: #2e7d32; color: white; }
    .btn-secondary { background: var(--lp-surface); color: var(--lp-text); border: 1px solid var(--lp-border); text-decoration: none; display: inline-block; margin-top: 16px; }
    .score-summary { text-align: center; margin-top: 32px; }
    .score-summary h2 { color: var(--lp-text); margin-bottom: 16px; }
    .score { font-size: 2rem; color: var(--lp-primary); font-weight: bold; }
    .percentage { font-size: 1.5rem; color: var(--lp-text-muted); margin-bottom: 24px; }
  `]
})
export class MathPracticeComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  questions: MathQuestion[] = [];
  lessonId = 0;
  currentIndex = 0;
  selectedOption: string | null = null;
  showResult = false;
  finished = false;
  correctCount = 0;
  loading = true;
  Math = Math;

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.api.getMathQuestions(this.lessonId).subscribe({
      next: (questions) => { this.questions = questions; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getOptions(q: MathQuestion): { key: string; text: string }[] {
    return [
      { key: 'A', text: q.optionA },
      { key: 'B', text: q.optionB },
      { key: 'C', text: q.optionC },
      { key: 'D', text: q.optionD },
    ];
  }

  selectOption(key: string): void {
    if (!this.showResult) this.selectedOption = key;
  }

  submitAnswer(): void {
    if (!this.selectedOption) return;
    this.showResult = true;
    if (this.selectedOption === this.questions[this.currentIndex].correctOption) {
      this.correctCount++;
    }
  }

  nextQuestion(): void {
    this.currentIndex++;
    this.selectedOption = null;
    this.showResult = false;
  }

  finishPractice(): void {
    this.finished = true;
  }
}
