import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import type {
  Assessment,
  AssessmentQuestion,
  AssessmentResult,
  Course,
  GenerateWeeklyAssessmentPayload,
  StudentAssessmentHistory,
  UserType
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-assessment-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="assessment-page">
      <header class="page-header">
        <div class="header-content">
          <img src="assets/nehzat.png" alt="لوگو" class="logo" (error)="logoHidden = true" />
          <div>
            <h1>{{ panelTitle }}</h1>
            <p class="subtitle">خوش آمدید {{ username }}</p>
          </div>
        </div>
        <button type="button" class="logout-btn" (click)="logout()">خروج</button>
      </header>

      <div class="content-grid">
        <section class="card generate-card">
          <h2>تولید ارزیابی هفتگی هوشمند</h2>
          <p class="card-desc">بر اساس سابقه، طرح درس و وضعیت فعلی دانش‌آموزان</p>

          <form [formGroup]="generateForm" (ngSubmit)="onGenerate()" class="generate-form">
            <label class="field">
              <span>دوره آموزشی</span>
              <select formControlName="courseId">
                <option [value]="0" disabled>انتخاب دوره...</option>
                <option *ngFor="let c of courses" [value]="c.id">{{ c.title }}</option>
              </select>
            </label>

            <label class="field">
              <span>عنوان ارزیابی</span>
              <input type="text" formControlName="title" placeholder="ارزیابی هفتگی ..." />
            </label>

            <label class="field">
              <span>توضیحات</span>
              <textarea formControlName="description" rows="2" placeholder="توضیحات ارزیابی..."></textarea>
            </label>

            <div class="form-row">
              <label class="field">
                <span>مدت (دقیقه)</span>
                <input type="number" formControlName="durationMinutes" min="10" max="300" />
              </label>
              <label class="field">
                <span>حداکثر نمره</span>
                <input type="number" formControlName="maxScore" min="10" max="500" />
              </label>
            </div>

            <label class="field">
              <span>تاریخ ارزیابی</span>
              <input type="date" formControlName="assessmentDate" />
            </label>

            <button type="submit" class="btn-primary" [disabled]="generating || generateForm.invalid">
              {{ generating ? 'در حال تولید...' : 'تولید ارزیابی هوشمند' }}
            </button>
          </form>
        </section>

        <section class="card assessments-card">
          <h2>ارزیابی‌های ایجاد شده</h2>
          <div *ngIf="loadingAssessments" class="loading">در حال بارگذاری...</div>
          <div *ngIf="!loadingAssessments && assessments.length === 0" class="empty">
            هنوز ارزیابی‌ای ایجاد نشده است.
          </div>
          <div class="assessment-list">
            <div *ngFor="let a of assessments" class="assessment-item" (click)="selectAssessment(a)">
              <div class="assessment-header">
                <h3>{{ a.title }}</h3>
                <span class="badge" [class]="a.status">{{ statusLabel(a.status) }}</span>
              </div>
              <p class="assessment-desc">{{ a.description }}</p>
              <div class="assessment-meta">
                <span>تاریخ: {{ a.assessmentDate | date:'yyyy/MM/dd' }}</span>
                <span>نمره: {{ a.maxScore }}</span>
                <span>مدت: {{ a.durationMinutes }} دقیقه</span>
                <span>سوالات: {{ a.questions?.length ?? 0 }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="card detail-card" *ngIf="selectedAssessment">
          <h2>{{ selectedAssessment.title }} - جزئیات</h2>

          <div class="questions-section" *ngIf="selectedAssessment.questions?.length">
            <h3>سوالات ({{ selectedAssessment.questions!.length }})</h3>
            <div *ngFor="let q of selectedAssessment.questions; let i = index" class="question-item">
              <div class="question-header">
                <span class="q-number">سوال {{ i + 1 }}</span>
                <span class="q-difficulty" [class]="q.difficulty">{{ difficultyLabel(q.difficulty) }}</span>
                <span class="q-points">{{ q.points }} امتیاز</span>
              </div>
              <p class="q-text">{{ q.questionText }}</p>
              <p class="q-topic" *ngIf="q.topic">موضوع: {{ q.topic }}</p>
            </div>
          </div>

          <div class="results-section" *ngIf="selectedAssessment.results?.length">
            <h3>نتایج ({{ selectedAssessment.results!.length }})</h3>
            <div *ngFor="let r of selectedAssessment.results" class="result-item">
              <span>دانش‌آموز: {{ r.studentId }}</span>
              <span>نمره: {{ r.score }}/{{ r.maxPossibleScore }}</span>
              <span>درصد: {{ r.percentage | number:'1.0-1' }}%</span>
              <span class="badge" [class]="r.status">{{ r.status }}</span>
            </div>
          </div>

          <button type="button" class="btn-secondary" (click)="publishAssessment()" *ngIf="selectedAssessment.status === 'draft'">
            انتشار ارزیابی
          </button>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .assessment-page {
      direction: rtl;
      min-height: 100vh;
      padding: 1rem;
      display: grid;
      gap: 1rem;
    }
    .page-header {
      background: linear-gradient(135deg, var(--lp-primary, #1a6b3c) 0%, #0f3d22 100%);
      border-radius: 18px;
      padding: 0.75rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      box-shadow: 0 4px 16px rgba(26, 107, 60, 0.2);
    }
    .header-content { display: flex; align-items: center; gap: 0.75rem; }
    .logo { width: 42px; height: 42px; border-radius: 12px; object-fit: cover; border: 2px solid rgba(255,255,255,0.2); }
    h1 { margin: 0; font-size: 1.1rem; color: #fff; }
    .subtitle { color: rgba(255,255,255,0.8); margin: 0.1rem 0 0; font-size: 0.85rem; }
    .logout-btn {
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 12px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      padding: 0.45rem 0.85rem;
      cursor: pointer;
      font: inherit;
      font-weight: 600;
    }
    .logout-btn:hover { background: rgba(255,255,255,0.18); }
    .content-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    }
    .card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 18px;
      padding: 1.5rem;
      box-shadow: 0 8px 24px rgba(30, 27, 20, 0.06);
    }
    .card h2 { margin: 0 0 0.5rem; color: var(--lp-text, #1e1b14); font-size: 1.1rem; }
    .card-desc { color: var(--lp-muted, #7a7468); font-size: 0.9rem; margin: 0 0 1rem; }
    .generate-form { display: grid; gap: 0.75rem; }
    .field { display: grid; gap: 0.3rem; }
    .field span { font-size: 0.85rem; font-weight: 500; color: var(--lp-text); }
    .field input, .field select, .field textarea {
      border: 1px solid var(--lp-border);
      border-radius: 10px;
      padding: 0.55rem 0.7rem;
      font: inherit;
      background: var(--lp-surface);
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none;
      border-color: var(--lp-gold);
      box-shadow: 0 0 0 3px rgba(184, 148, 46, 0.12);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .btn-primary {
      background: var(--lp-primary);
      color: #fff;
      border: 0;
      border-radius: 12px;
      padding: 0.7rem 1rem;
      cursor: pointer;
      font-weight: 600;
      font: inherit;
    }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-hover); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary {
      background: var(--lp-surface);
      color: var(--lp-text);
      border: 1px solid var(--lp-border);
      border-radius: 12px;
      padding: 0.6rem 1rem;
      cursor: pointer;
      font-weight: 600;
      font: inherit;
      margin-top: 1rem;
    }
    .btn-secondary:hover { background: #f0ece4; }
    .loading, .empty { color: var(--lp-muted); text-align: center; padding: 2rem 0; }
    .assessment-list { display: grid; gap: 0.6rem; margin-top: 0.75rem; }
    .assessment-item {
      border: 1px solid var(--lp-border);
      border-radius: 14px;
      padding: 0.75rem;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .assessment-item:hover {
      border-color: var(--lp-gold);
      box-shadow: 0 4px 12px rgba(30, 27, 20, 0.06);
    }
    .assessment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
    .assessment-header h3 { margin: 0; font-size: 0.95rem; }
    .assessment-desc { color: var(--lp-muted); font-size: 0.85rem; margin: 0 0 0.5rem; }
    .assessment-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.8rem; color: var(--lp-muted); }
    .badge {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-weight: 500;
    }
    .badge.draft { background: #fef3c7; color: #92400e; }
    .badge.published { background: #eaf5ed; color: #065f46; }
    .badge.completed { background: #dbeafe; color: #1e40af; }
    .badge.archived { background: #f0ece4; color: #5b5348; }
    .questions-section, .results-section { margin-top: 1rem; }
    .questions-section h3, .results-section h3 { font-size: 0.95rem; margin: 0 0 0.5rem; }
    .question-item {
      border: 1px solid var(--lp-border);
      border-radius: 12px;
      padding: 0.65rem;
      margin-bottom: 0.5rem;
    }
    .question-header { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.3rem; }
    .q-number { font-weight: 600; font-size: 0.85rem; }
    .q-difficulty {
      font-size: 0.72rem;
      padding: 0.1rem 0.4rem;
      border-radius: 999px;
    }
    .q-difficulty.easy { background: #dcfce7; color: #166534; }
    .q-difficulty.medium { background: #fef3c7; color: #92400e; }
    .q-difficulty.hard { background: #fee2e2; color: #991b1b; }
    .q-points { font-size: 0.8rem; color: var(--lp-muted); margin-right: auto; }
    .q-text { margin: 0.3rem 0; font-size: 0.9rem; }
    .q-topic { margin: 0; font-size: 0.8rem; color: var(--lp-muted); }
    .result-item {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--lp-border);
      font-size: 0.85rem;
    }
    .result-item:last-child { border-bottom: none; }
  `]
})
export class AssessmentPanelComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  username = '';
  logoHidden = false;
  panelTitle = '';
  role: UserType = 'coach';

  courses: Course[] = [];
  assessments: Assessment[] = [];
  selectedAssessment: Assessment | null = null;
  loadingAssessments = false;
  generating = false;

  generateForm: FormGroup = this.fb.group({
    courseId: [0, Validators.required],
    title: ['ارزیابی هفتگی', [Validators.required, Validators.maxLength(200)]],
    description: ['ارزیابی تولید شده بر اساس تحلیل پیشرفت دانش‌آموزان', Validators.maxLength(1000)],
    durationMinutes: [45, [Validators.required, Validators.min(10), Validators.max(300)]],
    maxScore: [100, [Validators.required, Validators.min(10), Validators.max(500)]],
    assessmentDate: [new Date().toISOString().split('T')[0], Validators.required]
  });

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username ?? '';
    this.role = user?.userType ?? 'coach';
    this.panelTitle = this.getPanelTitle();
    this.loadCourses();
    this.loadAssessments();
  }

  getPanelTitle(): string {
    const titles: Record<string, string> = {
      coach: 'پنل ارزیابی هوشمند - مربی',
      branch_manager: 'پنل ارزیابی هوشمند - مسئول شعبه',
      evaluator: 'پنل ارزیابی هوشمند - ارزیاب',
      headquarters: 'پنل ارزیابی هوشمند - ستاد'
    };
    return titles[this.role] ?? 'پنل ارزیابی هوشمند';
  }

  loadCourses(): void {
    this.api.getCourses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (courses) => { this.courses = courses; },
      error: () => { this.courses = []; }
    });
  }

  loadAssessments(): void {
    this.loadingAssessments = true;
    this.api.getAssessments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (assessments) => {
        this.assessments = assessments;
        this.loadingAssessments = false;
      },
      error: () => {
        this.assessments = [];
        this.loadingAssessments = false;
      }
    });
  }

  onGenerate(): void {
    if (this.generateForm.invalid) return;
    this.generating = true;

    const formValue = this.generateForm.value;
    const user = this.authService.getCurrentUser();
    const payload: GenerateWeeklyAssessmentPayload = {
      courseId: Number(formValue.courseId),
      generatedByUserId: 1,
      title: formValue.title,
      description: formValue.description,
      durationMinutes: formValue.durationMinutes,
      maxScore: formValue.maxScore,
      assessmentDate: formValue.assessmentDate,
      criteria: {
        questionCount: 10,
        difficultyDistribution: { easy: 3, medium: 5, hard: 2 }
      }
    };

    this.api.generateWeeklyAssessment(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (assessment) => {
        this.assessments.unshift(assessment);
        this.selectedAssessment = assessment;
        this.generating = false;
      },
      error: () => {
        this.generating = false;
      }
    });
  }

  selectAssessment(assessment: Assessment): void {
    this.selectedAssessment = assessment;
  }

  publishAssessment(): void {
    if (!this.selectedAssessment) return;
    this.api.updateAssessment(this.selectedAssessment.id, { status: 'published' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.selectedAssessment = updated;
          const idx = this.assessments.findIndex((a) => a.id === updated.id);
          if (idx >= 0) this.assessments[idx] = updated;
        }
      });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'پیش‌نویس',
      published: 'منتشر شده',
      completed: 'تکمیل شده',
      archived: 'آرشیو شده'
    };
    return labels[status] ?? status;
  }

  difficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      easy: 'آسان',
      medium: 'متوسط',
      hard: 'سخت'
    };
    return labels[difficulty] ?? difficulty;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}