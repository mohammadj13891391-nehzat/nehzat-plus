import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ExperimentalSciencesService } from '../../services/experimental-sciences.service';
import { LessonDto, ExpSciQuizDto, ExpSciQuizQuestionDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatProgressBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  template: `
    <div class="quiz-container" dir="rtl">
      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && lesson">
        <div class="header">
          <button mat-icon-button [routerLink]="['/experimental-sciences/topics', lesson.topicId, 'lessons']">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <div>
            <h1>{{ lesson.title }}</h1>
            <p>آزمون</p>
          </div>
        </div>

        <div *ngIf="!quiz" class="empty-state">
          <mat-icon>quiz</mat-icon>
          <p>آزمونی برای این درس تعریف نشده است</p>
        </div>

        <div *ngIf="quiz && !showResult">
          <mat-card class="quiz-info">
            <mat-card-content>
              <div class="quiz-meta">
                <div>
                  <mat-icon>help_outline</mat-icon>
                  <span>{{ questions.length }} سوال</span>
                </div>
                <div>
                  <mat-icon>schedule</mat-icon>
                  <span>{{ quiz.timeLimitMinutes }} دقیقه</span>
                </div>
                <div>
                  <mat-icon>check_circle</mat-icon>
                  <span>نمره قبولی: {{ quiz.passingScore }}%</span>
                </div>
              </div>
              <mat-progress-bar [value]="progressPercent" color="primary"></mat-progress-bar>
              <p class="progress-text">سوال {{ currentIndex + 1 }} از {{ questions.length }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card *ngIf="currentQuestion" class="question-card">
            <mat-card-header>
              <mat-card-title>{{ currentQuestion.questionText }}</mat-card-title>
              <mat-card-subtitle>{{ currentQuestion.points }} امتیاز</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-radio-group [(ngModel)]="selectedAnswer" class="options">
                <mat-radio-button *ngFor="let option of parseOptions(currentQuestion.options); let i = index" 
                                  [value]="i.toString()">
                  {{ option }}
                </mat-radio-button>
              </mat-radio-group>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" 
                      (click)="submitAnswer()"
                      [disabled]="!selectedAnswer">
                {{ currentIndex < questions.length - 1 ? 'سوال بعدی' : 'پایان آزمون' }}
                <mat-icon>chevron_left</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <div *ngIf="showResult">
          <mat-card class="result-card" [class.passed]="isPassed" [class.failed]="!isPassed">
            <mat-card-header>
              <mat-icon mat-card-avatar>{{ isPassed ? 'check_circle' : 'cancel' }}</mat-icon>
              <mat-card-title>{{ isPassed ? 'قبول شدید!' : 'مردود شدید' }}</mat-card-title>
              <mat-card-subtitle>نتیجه آزمون</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="score">
                <span class="score-number">{{ score }}%</span>
                <span>از {{ quiz?.passingScore }}% نیاز است</span>
              </div>
              <div class="stats">
                <div>
                  <mat-icon>check</mat-icon>
                  <span>{{ correctAnswers }} پاسخ صحیح</span>
                </div>
                <div>
                  <mat-icon>close</mat-icon>
                  <span>{{ wrongAnswers }} پاسخ غلط</span>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" (click)="retryQuiz()">
                <mat-icon>refresh</mat-icon>
                تلاش مجدد
              </button>
              <button mat-raised-button [routerLink]="['/experimental-sciences/topics', lesson?.topicId, 'lessons']">
                <mat-icon>arrow_forward</mat-icon>
                بازگشت به درس‌ها
              </button>
            </mat-card-actions>
          </mat-card>

          <div class="answers-review">
            <h2>بررسی پاسخ‌ها</h2>
            <mat-card *ngFor="let question of questions; let i = index" 
                      class="answer-card"
                      [class.correct]="answers[i] === question.correctAnswer"
                      [class.wrong]="answers[i] !== question.correctAnswer">
              <mat-card-header>
                <mat-icon mat-card-avatar>
                  {{ answers[i] === question.correctAnswer ? 'check_circle' : 'cancel' }}
                </mat-icon>
                <mat-card-title>{{ question.questionText }}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>پاسخ شما:</strong> {{ getOptionText(question, answers[i]) }}</p>
                <p *ngIf="answers[i] !== question.correctAnswer">
                  <strong>پاسخ صحیح:</strong> {{ getOptionText(question, question.correctAnswer) }}
                </p>
                <p *ngIf="question.explanation" class="explanation">
                  <mat-icon>info</mat-icon>
                  {{ question.explanation }}
                </p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .header h1 {
      color: var(--lp-primary, #1976d2);
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 4px 0 0;
    }
    .quiz-info {
      margin-bottom: 24px;
    }
    .quiz-meta {
      display: flex;
      gap: 24px;
      margin-bottom: 16px;
    }
    .quiz-meta div {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quiz-meta mat-icon {
      color: var(--lp-primary, #1976d2);
    }
    .progress-text {
      text-align: center;
      margin-top: 8px;
      color: #666;
    }
    .question-card {
      margin-bottom: 24px;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }
    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 16px;
    }
    .result-card {
      text-align: center;
      padding: 24px;
    }
    .result-card.passed {
      background: linear-gradient(135deg, #e8f5e9 0%, #fff 100%);
      border: 2px solid #4caf50;
    }
    .result-card.failed {
      background: linear-gradient(135deg, #ffebee 0%, #fff 100%);
      border: 2px solid #f44336;
    }
    .score {
      margin: 24px 0;
    }
    .score-number {
      font-size: 48px;
      font-weight: bold;
      color: var(--lp-primary, #1976d2);
    }
    .score span {
      display: block;
      color: #666;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 32px;
    }
    .stats div {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .answers-review {
      margin-top: 32px;
    }
    .answers-review h2 {
      margin-bottom: 16px;
    }
    .answer-card {
      margin-bottom: 12px;
    }
    .answer-card.correct {
      border-right: 4px solid #4caf50;
    }
    .answer-card.wrong {
      border-right: 4px solid #f44336;
    }
    .explanation {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      margin-top: 12px;
    }
    .explanation mat-icon {
      color: var(--lp-primary, #1976d2);
    }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: #999;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }
  `]
})
export class QuizComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ExperimentalSciencesService);
  
  lesson: LessonDto | null = null;
  quiz: ExpSciQuizDto | null = null;
  questions: ExpSciQuizQuestionDto[] = [];
  loading = true;
  
  currentIndex = 0;
  selectedAnswer = '';
  answers: string[] = [];
  showResult = false;
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;

  get currentQuestion(): ExpSciQuizQuestionDto | null {
    return this.questions[this.currentIndex] || null;
  }

  get progressPercent(): number {
    return this.questions.length > 0 ? ((this.currentIndex + 1) / this.questions.length) * 100 : 0;
  }

  get isPassed(): boolean {
    return this.quiz ? this.score >= this.quiz.passingScore : false;
  }

  ngOnInit(): void {
    const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    if (lessonId) {
      this.loadData(lessonId);
    }
  }

  loadData(lessonId: number): void {
    this.service.getLesson(lessonId).subscribe(lesson => {
      this.lesson = lesson;
      this.service.getQuizByLesson(lessonId).subscribe({
        next: (quiz) => {
          this.quiz = quiz;
          this.service.getQuizQuestions(quiz.id).subscribe(questions => {
            this.questions = questions;
            this.answers = new Array(questions.length).fill('');
            this.loading = false;
          });
        },
        error: () => {
          this.loading = false;
        }
      });
    });
  }

  parseOptions(options: string): string[] {
    try {
      return JSON.parse(options);
    } catch {
      return options.split(',').map(o => o.trim());
    }
  }

  submitAnswer(): void {
    this.answers[this.currentIndex] = this.selectedAnswer;
    
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.selectedAnswer = '';
    } else {
      this.calculateScore();
      this.showResult = true;
    }
  }

  calculateScore(): void {
    let correct = 0;
    this.questions.forEach((q, i) => {
      if (this.answers[i] === q.correctAnswer) {
        correct++;
      }
    });
    this.correctAnswers = correct;
    this.wrongAnswers = this.questions.length - correct;
    this.score = Math.round((correct / this.questions.length) * 100);
  }

  retryQuiz(): void {
    this.currentIndex = 0;
    this.selectedAnswer = '';
    this.answers = new Array(this.questions.length).fill('');
    this.showResult = false;
    this.score = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
  }

  getOptionText(question: ExpSciQuizQuestionDto, index: string): string {
    const options = this.parseOptions(question.options);
    return options[parseInt(index)] || 'بدون پاسخ';
  }
}
