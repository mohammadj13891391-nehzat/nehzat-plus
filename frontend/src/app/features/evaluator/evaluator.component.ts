import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import type {
  Assessment,
  AssessmentAnalytics,
  CreateEvaluationPayload,
  CurrentUser,
  EvaluationRecord,
  Evaluator
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

type TargetType = 'coach' | 'student' | 'branch';

@Component({
  selector: 'app-evaluator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="role-page">
      <!-- Toast -->
      <div class="toast" *ngIf="toast" [class]="'toast-' + toast.type">{{ toast.message }}</div>

      <!-- Header -->
      <header class="site-header">
        <div class="brand-wrap">
          <img src="assets/nehzat.png" alt="لوگو سایت" class="site-logo" [hidden]="logoHidden" (error)="logoHidden = true" />
          <div>
            <h1>پنل ارزیاب</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="header-nav">
          <a class="nav-link" routerLink="/evaluator/spiritual" routerLinkActive="nav-link-active">مسیر معنوی</a>
        </div>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>

      <section class="main-content">
        <h2 class="section-title">داشبورد ارزیاب</h2>

        <div class="content-grid">
          <!-- Section 1: Evaluation Records -->
          <section class="card records-card">
            <div class="card-head">
              <h3>سوابق ارزیابی</h3>
              <button type="button" class="btn-refresh" (click)="loadRecords()" [disabled]="loadingRecords">
                {{ loadingRecords ? 'در حال بارگذاری...' : 'به‌روزرسانی' }}
              </button>
            </div>

            <div class="loading" *ngIf="loadingRecords">در حال بارگذاری سوابق...</div>
            <div class="empty" *ngIf="!loadingRecords && records.length === 0">
              هنوز ارزیابی‌ای ثبت نشده است.
            </div>

            <div class="records-list" *ngIf="!loadingRecords && records.length > 0">
              <div *ngFor="let r of records" class="record-item">
                <div class="record-top">
                  <span class="record-target">{{ r.targetName }}</span>
                  <span class="badge" [class]="r.targetType">{{ targetTypeLabel(r.targetType) }}</span>
                </div>
                <div class="record-meta">
                  <span>ارزیاب: {{ r.evaluatorName || r.evaluatorId }}</span>
                  <span>نمره: {{ r.score }}</span>
                  <span>تاریخ: {{ r.evaluationDate | date:'yyyy/MM/dd' }}</span>
                </div>
                <p class="record-feedback" *ngIf="r.feedback">{{ r.feedback }}</p>
                <button type="button" class="btn-delete-sm" (click)="deleteRecord(r.id)" [disabled]="actionLoading">
                  حذف
                </button>
              </div>
            </div>
          </section>

          <!-- Section 2: Create Evaluation Form -->
          <section class="card create-card">
            <h3>ثبت ارزیابی جدید</h3>

            <form [formGroup]="evalForm" (ngSubmit)="onCreate()" class="eval-form">
              <label class="field">
                <span>ارزیاب</span>
                <select formControlName="evaluatorId" *ngIf="evaluators.length > 0; else evaluatorIdInput">
                  <option *ngFor="let e of evaluators" [value]="e.id">
                    {{ e.firstName }} {{ e.lastName }} ({{ e.username }})
                  </option>
                </select>
                <ng-template #evaluatorIdInput>
                  <input type="number" formControlName="evaluatorId" min="1" placeholder="شناسه ارزیاب" />
                </ng-template>
              </label>

              <label class="field">
                <span>نوع هدف</span>
                <select formControlName="targetType">
                  <option value="coach">مربی</option>
                  <option value="student">دانش‌آموز</option>
                  <option value="branch">شعبه</option>
                </select>
              </label>

              <label class="field">
                <span>نام هدف</span>
                <input type="text" formControlName="targetName" placeholder="نام شخص یا شعبه" />
              </label>

              <label class="field">
                <span>شناسه هدف</span>
                <input type="number" formControlName="targetId" min="1" placeholder="شناسه عددی" />
              </label>

              <div class="form-row">
                <label class="field">
                  <span>نمره</span>
                  <input type="number" formControlName="score" min="0" max="100" placeholder="۰ تا ۱۰۰" />
                </label>
                <label class="field">
                  <span>تاریخ ارزیابی</span>
                  <input type="date" formControlName="evaluationDate" />
                </label>
              </div>

              <label class="field">
                <span>توضیحات / بازخورد</span>
                <textarea formControlName="feedback" rows="3" placeholder="بازخورد ارزیابی..."></textarea>
              </label>

              <button type="submit" class="btn-primary" [disabled]="creating || evalForm.invalid">
                {{ creating ? 'در حال ثبت...' : 'ثبت ارزیابی' }}
              </button>
            </form>
          </section>

          <!-- Section 3: Assessment Analytics -->
          <section class="card analytics-card">
            <h3>تحلیل ارزیابی‌ها</h3>

            <label class="field">
              <span>انتخاب ارزیابی</span>
              <select (change)="onSelectAssessment($event)" [disabled]="loadingAssessments">
                <option [value]="0" disabled>انتخاب ارزیابی...</option>
                <option *ngFor="let a of assessments" [value]="a.id">{{ a.title }}</option>
              </select>
            </label>

            <div class="loading" *ngIf="loadingAssessments">در حال بارگذاری ارزیابی‌ها...</div>
            <div class="empty" *ngIf="!loadingAssessments && assessments.length === 0">
              ارزیابی‌ای برای تحلیل وجود ندارد.
            </div>

            <div class="analytics-content" *ngIf="analytics">
              <div class="analytics-head">
                <h4>{{ analytics.assessment.title }}</h4>
                <span class="badge" [class]="analytics.assessment.status">
                  {{ statusLabel(analytics.assessment.status) }}
                </span>
              </div>

              <div class="analytics-stats">
                <div class="stat-box">
                  <span class="stat-label">تعداد دانش‌آموزان</span>
                  <span class="stat-value">{{ analytics.totalStudents }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">تکمیل شده</span>
                  <span class="stat-value">{{ analytics.completedCount }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">نرخ تکمیل</span>
                  <span class="stat-value">{{ analytics.completionRate | number:'1.0-1' }}٪</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">میانگین نمره</span>
                  <span class="stat-value">{{ analytics.averageScore | number:'1.0-1' }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">نرخ قبولی</span>
                  <span class="stat-value">{{ analytics.passRate | number:'1.0-1' }}٪</span>
                </div>
              </div>

              <div class="question-stats" *ngIf="analytics.questionStats.length > 0">
                <h4>آمار سوالات</h4>
                <div *ngFor="let q of analytics.questionStats; let i = index" class="q-stat-item">
                  <div class="q-stat-top">
                    <span class="q-stat-num">سوال {{ i + 1 }}</span>
                    <span class="q-stat-diff" [class]="q.difficulty">{{ difficultyLabel(q.difficulty) }}</span>
                    <span class="q-stat-points">{{ q.points }} امتیاز</span>
                  </div>
                  <p class="q-stat-text">{{ q.questionText }}</p>
                  <div class="q-stat-bar-wrap">
                    <div class="q-stat-bar" [style.width.%]="q.correctRate"></div>
                    <span class="q-stat-rate">{{ q.correctRate | number:'1.0-1' }}٪ صحیح</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="loading" *ngIf="loadingAnalytics">در حال بارگذاری تحلیل...</div>
          </section>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .role-page {
      direction: rtl;
      min-height: 100vh;
      background: var(--lp-bg, #f8f9fa);
      display: flex;
      flex-direction: column;
    }
    .toast {
      position: fixed;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .toast-success { background: #065f46; color: #fff; }
    .toast-error { background: #991b1b; color: #fff; }

    .site-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: var(--lp-surface, #fff);
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .brand-wrap { display: flex; align-items: center; gap: 1rem; }
    .site-logo { width: 48px; height: 48px; object-fit: contain; }
    h1 { margin: 0; font-size: 1.25rem; color: var(--lp-text, #1e1b14); }
    .muted { color: var(--lp-muted, #6b7280); margin: 0; }
    .menu-trigger {
      background: var(--lp-primary, #1a6b3c);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font: inherit;
      font-weight: 600;
    }
    .menu-trigger:hover { background: var(--lp-primary-hover, #155c32); }
    .header-nav { display: flex; align-items: center; gap: 0.5rem; }
    .nav-link {
      color: var(--lp-primary, #1a6b3c);
      text-decoration: none;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      font-weight: 500;
    }
    .nav-link:hover { background: rgba(26, 107, 60, 0.08); }
    .nav-link-active { background: rgba(26, 107, 60, 0.12); font-weight: 700; }

    .main-content { padding: 2rem; flex: 1; }
    .section-title { margin: 0 0 1.5rem; font-size: 1.15rem; color: var(--lp-text, #1e1b14); }

    .content-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    }

    .card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 18px;
      padding: 1.5rem;
      box-shadow: 0 8px 24px rgba(30, 27, 20, 0.06);
    }
    .card h3 { margin: 0 0 1rem; font-size: 1.05rem; color: var(--lp-text, #1e1b14); }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .card-head h3 { margin: 0; }

    .btn-refresh {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 10px;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      font: inherit;
      font-size: 0.85rem;
      color: var(--lp-text, #1e1b14);
    }
    .btn-refresh:hover:not(:disabled) { border-color: var(--lp-gold, #b8942e); }
    .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

    .loading, .empty {
      color: var(--lp-muted, #7a7468);
      text-align: center;
      padding: 2rem 0;
      font-size: 0.9rem;
    }

    .records-list { display: grid; gap: 0.75rem; }
    .record-item {
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 14px;
      padding: 0.85rem;
    }
    .record-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
    .record-target { font-weight: 600; font-size: 0.95rem; color: var(--lp-text, #1e1b14); }
    .record-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.82rem; color: var(--lp-muted, #7a7468); }
    .record-feedback { margin: 0.4rem 0 0; font-size: 0.85rem; color: var(--lp-text, #1e1b14); }
    .btn-delete-sm {
      margin-top: 0.5rem;
      background: #fee2e2;
      color: #991b1b;
      border: none;
      border-radius: 8px;
      padding: 0.3rem 0.65rem;
      cursor: pointer;
      font: inherit;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .btn-delete-sm:hover:not(:disabled) { background: #fecaca; }
    .btn-delete-sm:disabled { opacity: 0.5; cursor: not-allowed; }

    .badge {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-weight: 500;
    }
    .badge.coach { background: #dbeafe; color: #1e40af; }
    .badge.student { background: #dcfce7; color: #166534; }
    .badge.branch { background: #fef3c7; color: #92400e; }
    .badge.draft { background: #fef3c7; color: #92400e; }
    .badge.published { background: #eaf5ed; color: #065f46; }
    .badge.completed { background: #dbeafe; color: #1e40af; }
    .badge.archived { background: #f0ece4; color: #5b5348; }

    .eval-form { display: grid; gap: 0.75rem; }
    .field { display: grid; gap: 0.3rem; }
    .field span { font-size: 0.85rem; font-weight: 500; color: var(--lp-text, #1e1b14); }
    .field input, .field select, .field textarea {
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 10px;
      padding: 0.55rem 0.7rem;
      font: inherit;
      background: var(--lp-surface, #fff);
      color: var(--lp-text, #1e1b14);
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none;
      border-color: var(--lp-gold, #b8942e);
      box-shadow: 0 0 0 3px rgba(184, 148, 46, 0.12);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

    .btn-primary {
      background: var(--lp-primary, #1a6b3c);
      color: #fff;
      border: 0;
      border-radius: 12px;
      padding: 0.7rem 1rem;
      cursor: pointer;
      font: inherit;
      font-weight: 600;
    }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-hover, #155c32); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .analytics-content { margin-top: 1rem; }
    .analytics-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .analytics-head h4 { margin: 0; font-size: 0.95rem; color: var(--lp-text, #1e1b14); }

    .analytics-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .stat-box {
      background: var(--lp-bg, #f8f9fa);
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 12px;
      padding: 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      text-align: center;
    }
    .stat-label { font-size: 0.78rem; color: var(--lp-muted, #7a7468); }
    .stat-value { font-size: 1.1rem; font-weight: 700; color: var(--lp-text, #1e1b14); }

    .question-stats h4 { font-size: 0.9rem; margin: 0 0 0.5rem; color: var(--lp-text, #1e1b14); }
    .q-stat-item {
      border: 1px solid var(--lp-border, #ddd5c5);
      border-radius: 12px;
      padding: 0.65rem;
      margin-bottom: 0.5rem;
    }
    .q-stat-top { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.3rem; }
    .q-stat-num { font-weight: 600; font-size: 0.85rem; }
    .q-stat-diff { font-size: 0.72rem; padding: 0.1rem 0.4rem; border-radius: 999px; }
    .q-stat-diff.easy { background: #dcfce7; color: #166534; }
    .q-stat-diff.medium { background: #fef3c7; color: #92400e; }
    .q-stat-diff.hard { background: #fee2e2; color: #991b1b; }
    .q-stat-points { font-size: 0.8rem; color: var(--lp-muted, #7a7468); margin-right: auto; }
    .q-stat-text { margin: 0.3rem 0; font-size: 0.88rem; color: var(--lp-text, #1e1b14); }
    .q-stat-bar-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.3rem;
    }
    .q-stat-bar {
      height: 6px;
      border-radius: 999px;
      background: var(--lp-primary, #1a6b3c);
      min-width: 2px;
    }
    .q-stat-rate { font-size: 0.78rem; color: var(--lp-muted, #7a7468); }
  `]
})
export class EvaluatorComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  records: EvaluationRecord[] = [];
  loadingRecords = false;
  creating = false;
  actionLoading = false;

  evaluators: Evaluator[] = [];

  assessments: Assessment[] = [];
  loadingAssessments = false;
  analytics: AssessmentAnalytics | null = null;
  loadingAnalytics = false;

  toast: Toast | null = null;

  evalForm: FormGroup = this.fb.group({
    evaluatorId: [1, [Validators.required, Validators.min(1)]],
    targetType: ['coach' as TargetType, Validators.required],
    targetName: ['', [Validators.required, Validators.maxLength(200)]],
    targetId: [1, [Validators.required, Validators.min(1)]],
    score: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    evaluationDate: [new Date().toISOString().split('T')[0], Validators.required],
    feedback: ['', Validators.maxLength(2000)]
  });

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'evaluator') {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee')
      );
      return;
    }
    this.loadEvaluators();
    this.loadRecords();
    this.loadAssessments();
  }

  loadEvaluators(): void {
    this.api.getEvaluators().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (evaluators) => {
        this.evaluators = evaluators;
        const match = evaluators.find((e) => e.username === this.currentUser?.username);
        if (match) {
          this.evalForm.patchValue({ evaluatorId: match.id });
        }
      },
      error: () => { this.evaluators = []; }
    });
  }

  loadRecords(): void {
    this.loadingRecords = true;
    this.api.getEvaluationRecords().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (records) => {
        this.records = records;
        this.loadingRecords = false;
      },
      error: () => {
        this.records = [];
        this.loadingRecords = false;
      }
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

  onCreate(): void {
    if (this.evalForm.invalid) return;
    this.creating = true;
    const v = this.evalForm.value;
    const payload: CreateEvaluationPayload = {
      evaluatorId: Number(v.evaluatorId),
      targetType: v.targetType as TargetType,
      targetName: v.targetName,
      targetId: Number(v.targetId),
      score: Number(v.score),
      evaluationDate: v.evaluationDate,
      feedback: v.feedback ?? ''
    };

    this.api.createEvaluation(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (record) => {
        this.records = [record, ...this.records];
        this.creating = false;
        this.evalForm.patchValue({
          targetName: '',
          targetId: 1,
          score: 80,
          feedback: ''
        });
        this.showToast('ارزیابی با موفقیت ثبت شد', 'success');
      },
      error: () => {
        this.creating = false;
        this.showToast('خطا در ثبت ارزیابی', 'error');
      }
    });
  }

  deleteRecord(id: number): void {
    if (this.actionLoading) return;
    if (!confirm('آیا از حذف این ارزیابی اطمینان دارید؟')) return;
    this.actionLoading = true;
    this.api.deleteEvaluation(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.records = this.records.filter((r) => r.id !== id);
        this.actionLoading = false;
        this.showToast('ارزیابی حذف شد', 'success');
      },
      error: () => {
        this.actionLoading = false;
        this.showToast('خطا در حذف ارزیابی', 'error');
      }
    });
  }

  onSelectAssessment(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    if (!id) {
      this.analytics = null;
      return;
    }
    this.loadAnalytics(id);
  }

  loadAnalytics(assessmentId: number): void {
    this.loadingAnalytics = true;
    this.analytics = null;
    this.api.getAssessmentAnalytics(assessmentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.analytics = data;
        this.loadingAnalytics = false;
      },
      error: () => {
        this.analytics = null;
        this.loadingAnalytics = false;
        this.showToast('خطا در بارگذاری تحلیل', 'error');
      }
    });
  }

  targetTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      coach: 'مربی',
      student: 'دانش‌آموز',
      branch: 'شعبه'
    };
    return labels[type] ?? type;
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

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 3000);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}