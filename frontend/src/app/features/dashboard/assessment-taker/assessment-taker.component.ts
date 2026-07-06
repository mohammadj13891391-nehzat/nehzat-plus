import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { Assessment, AssessmentQuestion, AssessmentResult, Course } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

type TakerState = 'list' | 'taking' | 'result';

interface AnswerRecord {
  questionId: number;
  selectedOption: number;
}

@Component({
  selector: 'app-assessment-taker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- HEADER -->
        <header class="modal-header">
          <h5>{{ headerTitle }}</h5>
          <button type="button" class="btn-secondary" (click)="close()">بستن</button>
        </header>

        <!-- STATE: list -->
        @if (state === 'list') {
          <div class="taker-body">
            <p class="section-desc">امتحانات منتشر شده برای درس <strong>{{ course?.title }}</strong></p>
            @if (publishedAssessments.length === 0) {
              <p class="empty-state">هیچ امتحانی برای این درس منتشر نشده است.</p>
            }
            @for (a of publishedAssessments; track a.id) {
              <div class="assessment-row">
                <div class="assessment-row-info">
                  <strong>{{ a.title }}</strong>
                  <span class="meta">{{ a.questions?.length ?? 0 }} سوال | {{ a.durationMinutes }} دقیقه | {{ a.maxScore }} نمره</span>
                </div>
                <button type="button" class="btn-primary btn-sm" (click)="startAssessment(a)" [disabled]="startingId === a.id">
                  {{ startingId === a.id ? 'شروع...' : 'شرکت در امتحان' }}
                </button>
              </div>
            }
          </div>
        }

        <!-- STATE: taking -->
        @if (state === 'taking' && currentAssessment) {
          <div class="taker-body">
            <div class="taking-header">
              <span>{{ currentAssessment.title }}</span>
              <span class="q-counter">سوال {{ currentQuestionIndex + 1 }} از {{ questions.length }}</span>
            </div>

            <div class="question-card">
              <div class="q-header">
                <span class="q-number">سوال {{ currentQuestionIndex + 1 }}</span>
                <span class="q-difficulty" [class]="currentQuestion.difficulty">{{ difficultyLabel(currentQuestion.difficulty) }}</span>
                <span class="q-points">{{ currentQuestion.points }} امتیاز</span>
              </div>
              <p class="q-text">{{ currentQuestion.questionText }}</p>
              @if (currentQuestion.topic) {
                <p class="q-topic">موضوع: {{ currentQuestion.topic }}</p>
              }

              <div class="q-options">
                @for (opt of parsedOptions(currentQuestion); track oi; let oi = $index) {
                  <button
                    type="button"
                    class="q-option-btn"
                    [class.selected]="getAnswerFor(currentQuestion.id) === oi"
                    (click)="selectOption(currentQuestion.id, oi)"
                  >
                    <span class="opt-label">{{ optionLabel(oi) }}</span>
                    <span>{{ opt }}</span>
                  </button>
                }
              </div>
            </div>

            <div class="taking-footer">
              <button type="button" class="btn-secondary" (click)="prevQuestion()" [disabled]="currentQuestionIndex === 0">
                قبلی
              </button>

              <span class="answered-count">{{ answers.length }} از {{ questions.length }} پاسخ داده شده</span>

              @if (currentQuestionIndex < questions.length - 1) {
                <button type="button" class="btn-primary" (click)="nextQuestion()">بعدی</button>
              } @else {
                <button type="button" class="btn-primary btn-submit" (click)="submitAssessment()" [disabled]="submitting">
                  {{ submitting ? 'در حال ارسال...' : 'پایان و ارسال' }}
                </button>
              }
            </div>

            <!-- progress dots -->
            <div class="progress-dots">
              @for (q of questions; track q.id; let qi = $index) {
                <button
                  type="button"
                  class="dot"
                  [class.active]="qi === currentQuestionIndex"
                  [class.answered]="hasAnswer(q.id)"
                  (click)="goToQuestion(qi)"
                ></button>
              }
            </div>
          </div>
        }

        <!-- STATE: result -->
        @if (state === 'result' && result) {
          <div class="taker-body result-body">
            <div class="result-icon" [class.pass]="result.percentage >= 50" [class.fail]="result.percentage < 50">
              @if (result.percentage >= 50) {
                <span>✓</span>
              } @else {
                <span>✗</span>
              }
            </div>
            <h2 class="result-title">{{ result.percentage >= 50 ? 'قبول!' : 'نیاز به تلاش بیشتر' }}</h2>

            <div class="result-stats">
              <div class="stat">
                <span class="stat-value">{{ result.score }}</span>
                <span class="stat-label">نمره</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ result.maxPossibleScore }}</span>
                <span class="stat-label">از</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ result.percentage | number:'1.0-1' }}%</span>
                <span class="stat-label">درصد</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ result.timeSpentMinutes }}</span>
                <span class="stat-label">دقیقه</span>
              </div>
            </div>

            @if (result.feedback) {
              <p class="result-feedback">{{ result.feedback }}</p>
            }

            <button type="button" class="btn-primary" (click)="close()">بازگشت به داشبورد</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 20;
      background: rgba(30,27,20,0.5);
      display: flex; justify-content: center; align-items: center;
      padding: 1rem;
    }
    .modal-content {
      width: min(700px, 100%);
      max-height: 90vh; overflow-y: auto;
      border-radius: 20px;
      border: 1px solid var(--lp-border);
      background: var(--lp-surface);
      padding: 1.25rem;
      box-shadow: 0 20px 40px rgba(30,27,20,0.15);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1rem;
    }
    .modal-header h5 { margin: 0; color: var(--lp-primary); font-size: 1rem; }
    .btn-secondary {
      border: 1px solid var(--lp-border);
      background: var(--lp-surface);
      border-radius: 10px;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
      font: inherit;
      font-size: 0.85rem;
      color: var(--lp-muted);
    }
    .btn-secondary:hover { background: #f0ece4; }
    .btn-primary {
      background: var(--lp-primary);
      color: #fff; border: 0;
      border-radius: 12px;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
      font-weight: 600;
      font: inherit;
    }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-hover); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 10px; }
    .section-desc { color: var(--lp-muted); font-size: 0.9rem; margin: 0 0 0.75rem; }
    .empty-state { color: var(--lp-muted); text-align: center; padding: 2rem 0; }
    .assessment-row {
      display: flex; justify-content: space-between; align-items: center;
      border: 1px solid var(--lp-border);
      border-radius: 14px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .assessment-row-info { display: grid; gap: 0.25rem; }
    .assessment-row-info strong { font-size: 0.95rem; color: var(--lp-text); }
    .meta { font-size: 0.8rem; color: var(--lp-muted); }

    .taking-header {
      display: flex; justify-content: space-between; align-items: center;
      font-weight: 600; font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }
    .q-counter { font-size: 0.85rem; color: var(--lp-muted); font-weight: 400; }
    .question-card {
      border: 1px solid var(--lp-border);
      border-radius: 16px;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }
    .q-header { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .q-number { font-weight: 700; font-size: 0.9rem; }
    .q-difficulty {
      font-size: 0.72rem; padding: 0.1rem 0.4rem; border-radius: 999px;
    }
    .q-difficulty.easy { background: #dcfce7; color: #166534; }
    .q-difficulty.medium { background: #fef3c7; color: #92400e; }
    .q-difficulty.hard { background: #fee2e2; color: #991b1b; }
    .q-points { font-size: 0.8rem; color: var(--lp-muted); margin-right: auto; }
    .q-text { margin: 0.5rem 0; font-size: 0.95rem; line-height: 1.7; }
    .q-topic { font-size: 0.8rem; color: var(--lp-muted); margin: 0 0 0.5rem; }
    .q-options { display: grid; gap: 0.4rem; }
    .q-option-btn {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--lp-border);
      border-radius: 12px;
      background: #faf8f4;
      cursor: pointer;
      text-align: right;
      font: inherit;
      font-size: 0.9rem;
      transition: border-color 0.15s, background 0.15s;
    }
    .q-option-btn:hover { border-color: var(--lp-gold); background: #f5f0e6; }
    .q-option-btn.selected {
      border-color: var(--lp-primary);
      background: #eaf5ed;
    }
    .opt-label {
      font-weight: 700; color: var(--lp-muted);
      min-width: 1.4rem; height: 1.4rem;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: var(--lp-border);
    }
    .q-option-btn.selected .opt-label {
      background: var(--lp-primary);
      color: #fff;
    }
    .taking-footer {
      display: flex; justify-content: space-between; align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .answered-count { font-size: 0.8rem; color: var(--lp-muted); }
    .btn-submit { background: #065f46; }
    .btn-submit:hover:not(:disabled) { background: #047857; }
    .progress-dots {
      display: flex; gap: 0.35rem; justify-content: center; flex-wrap: wrap;
    }
    .dot {
      width: 28px; height: 28px; border-radius: 50%;
      border: 2px solid var(--lp-border);
      background: transparent;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .dot.active { border-color: var(--lp-primary); background: var(--lp-primary); }
    .dot.answered { border-color: #065f46; background: #86b99b; }
    .dot:hover:not(.active) { border-color: var(--lp-gold); }

    .result-body { text-align: center; display: grid; gap: 1rem; padding: 1.5rem 0; }
    .result-icon {
      width: 72px; height: 72px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto;
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
    }
    .result-icon.pass { background: #065f46; }
    .result-icon.fail { background: #991b1b; }
    .result-title { margin: 0; font-size: 1.2rem; color: var(--lp-text); }
    .result-stats {
      display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    }
    .stat {
      display: grid; gap: 0.2rem;
      padding: 0.75rem 1.25rem;
      border: 1px solid var(--lp-border);
      border-radius: 14px;
      min-width: 80px;
    }
    .stat-value { font-size: 1.3rem; font-weight: 700; color: var(--lp-primary); }
    .stat-label { font-size: 0.8rem; color: var(--lp-muted); }
    .result-feedback { font-size: 0.9rem; color: var(--lp-muted); max-width: 400px; margin: 0 auto; }
  `]
})
export class AssessmentTakerComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  @Input() course: Course | null = null;
  @Input() studentId: number | null = null;
  @Output() closed = new EventEmitter<void>();

  state: TakerState = 'list';
  publishedAssessments: Assessment[] = [];
  currentAssessment: Assessment | null = null;
  questions: AssessmentQuestion[] = [];
  currentQuestionIndex = 0;
  answers: AnswerRecord[] = [];
  startingId: number | null = null;
  submitting = false;
  result: AssessmentResult | null = null;

  get headerTitle(): string {
    switch (this.state) {
      case 'list': return 'امتحانات من';
      case 'taking': return 'شرکت در امتحان';
      case 'result': return 'نتیجه امتحان';
    }
  }

  get currentQuestion(): AssessmentQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  ngOnInit(): void {
    this.loadPublished();
  }

  loadPublished(): void {
    if (!this.course) return;
    this.api.getAssessmentsByCourse(this.course.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (assessments) => {
          this.publishedAssessments = assessments.filter((a) => a.status === 'published' && (a.questions?.length ?? 0) > 0);
        },
        error: () => {
          this.publishedAssessments = [];
        }
      });
  }

  startAssessment(assessment: Assessment): void {
    if (!this.studentId) return;
    this.startingId = assessment.id;

    this.api.startAssessment(assessment.id, this.studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.currentAssessment = assessment;
          this.questions = [...(assessment.questions ?? [])].sort((a, b) => a.order - b.order);
          this.currentQuestionIndex = 0;
          this.answers = [];
          this.state = 'taking';
          this.startingId = null;
        },
        error: () => {
          this.notify.show('خطا در شروع امتحان', 'error');
          this.startingId = null;
        }
      });
  }

  selectOption(questionId: number, optionIndex: number): void {
    const existing = this.answers.find((a) => a.questionId === questionId);
    if (existing) {
      existing.selectedOption = optionIndex;
    } else {
      this.answers.push({ questionId, selectedOption: optionIndex });
    }
  }

  getAnswerFor(questionId: number): number | undefined {
    return this.answers.find((a) => a.questionId === questionId)?.selectedOption;
  }

  hasAnswer(questionId: number): boolean {
    return this.answers.some((a) => a.questionId === questionId);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  submitAssessment(): void {
    if (!this.currentAssessment || !this.studentId || this.submitting) return;
    this.submitting = true;

    // Build the answers JSON
    const answersJson = JSON.stringify(this.answers);

    // Simple scoring: 1 point per correct answer
    let score = 0;
    for (const answer of this.answers) {
      const question = this.questions.find((q) => q.id === answer.questionId);
      if (question?.correctAnswerJson) {
        try {
          const correct = JSON.parse(question.correctAnswerJson);
          if (correct.correctOption === answer.selectedOption) {
            score += question.points;
          }
        } catch { /* skip */ }
      }
    }

    const maxPossibleScore = this.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;

    const timeSpentMinutes = Math.max(1, Math.round(
      (Date.now() - this.startTime) / 60000
    ));

    const payload = {
      studentId: this.studentId,
      completedAt: new Date().toISOString(),
      score,
      maxPossibleScore,
      percentage,
      status: percentage >= 50 ? 'completed' : 'failed',
      answersJson,
      timeSpentMinutes
    };

    this.api.submitAssessmentResult(this.currentAssessment.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.result = result;
          this.state = 'result';
          this.submitting = false;
        },
        error: () => {
          this.notify.show('خطا در ارسال پاسخ‌ها', 'error');
          this.submitting = false;
        }
      });
  }

  close(): void {
    this.closed.emit();
  }

  private startTime = Date.now();

  parsedOptions(question: AssessmentQuestion): string[] {
    if (!question.optionsJson) return [];
    try {
      const parsed = JSON.parse(question.optionsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  optionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  difficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      easy: 'آسان',
      medium: 'متوسط',
      hard: 'سخت'
    };
    return labels[difficulty] ?? difficulty;
  }
}
