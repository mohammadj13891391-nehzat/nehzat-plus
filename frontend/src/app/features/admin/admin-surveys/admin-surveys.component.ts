import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import {
  IssueSurvey,
  IssueSurveyQuestion,
  IssueAction,
  SurveyStatus,
  CreateIssueSurveyPayload,
  CreateIssueQuestionPayload,
  CreateIssueActionPayload,
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-surveys',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-surveys-title">
      <header class="section-header">
        <h2 id="admin-surveys-title" class="section-title">مدیریت نظرسنجی‌ها</h2>
        <div class="row-actions">
          <button type="button" class="btn btn-secondary" (click)="loadDashboardSummary()">خلاصه داشبورد</button>
          <button type="button" class="btn btn-primary" (click)="startCreateSurvey()">نظرسنجی جدید</button>
        </div>
      </header>

      @if (errorMessage) {
        <p class="lp-error" role="alert">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p class="lp-success" role="status">{{ successMessage }}</p>
      }

      <!-- Dashboard Summary -->
      @if (dashboardSummary) {
        <div class="survey-stats-grid">
          <div class="stat-card">
            <span class="stat-label">کل نظرسنجی‌ها</span>
            <strong class="stat-value">{{ dashboardSummary.totalSurveys }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">نظرسنجی‌های فعال</span>
            <strong class="stat-value">{{ dashboardSummary.activeSurveys }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">کل پاسخ‌ها</span>
            <strong class="stat-value">{{ dashboardSummary.totalResponses }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">میانگین نمره</span>
            <strong class="stat-value">{{ dashboardSummary.avgScore }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">اقدامات باز</span>
            <strong class="stat-value">{{ dashboardSummary.openActions }}</strong>
          </div>
        </div>
      }

      <div class="split-grid">
        <!-- LEFT: Survey list -->
        <div>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="جستجوی نظرسنجی..."
            class="search-input"
          />
          @if (loadingSurveys) {
            <p class="muted">در حال دریافت نظرسنجی‌ها...</p>
          } @else if (filteredSurveys.length === 0) {
            <p class="muted">نظرسنجی‌ای یافت نشد.</p>
          } @else {
            <div class="select-list">
              @for (survey of filteredSurveys; track survey.id) {
                <button
                  type="button"
                  class="list-item"
                  [class.is-selected]="selectedSurveyId === survey.id"
                  (click)="selectSurvey(survey)"
                >
                  <div class="list-item-top">
                    <strong>{{ survey.title }}</strong>
                    <span
                      class="status-chip"
                      [ngClass]="surveyStatusClass(survey.status)"
                    >
                      {{ surveyStatusLabel(survey.status) }}
                    </span>
                  </div>
                  <span class="list-meta">{{ survey.surveyType }} — {{ survey.targetRole }}</span>
                  <small class="list-meta">{{ survey.questionCount }} سوال · {{ survey.responseCount }} پاسخ</small>
                </button>
              }
            </div>
          }
        </div>

        <!-- RIGHT: Detail panel -->
        <div>
          @if (selectedSurveyId === null) {
            <p class="muted">یک نظرسنجی انتخاب کنید یا نظرسنجی جدید ایجاد کنید.</p>
          } @else {
            <div class="tabs">
              <button type="button" class="tab-btn" [class.active]="detailTab === 'info'" (click)="detailTab = 'info'">اطلاعات</button>
              <button type="button" class="tab-btn" [class.active]="detailTab === 'questions'" (click)="detailTab = 'questions'; loadSurveyQuestions()">سوالات</button>
              <button type="button" class="tab-btn" [class.active]="detailTab === 'actions'" (click)="detailTab = 'actions'; loadSurveyActions()">اقدامات</button>
              <button type="button" class="tab-btn" [class.active]="detailTab === 'analytics'" (click)="detailTab = 'analytics'; loadSurveyAnalytics()">تحلیل</button>
            </div>

            <!-- INFO TAB -->
            @if (detailTab === 'info') {
              <form [formGroup]="surveyForm" class="editor-form" (ngSubmit)="saveSurvey()">
                <h3>{{ surveyEditMode ? 'ویرایش نظرسنجی' : 'ایجاد نظرسنجی' }}</h3>
                <label>عنوان <input type="text" formControlName="title" /></label>
                <label>توضیحات <textarea formControlName="description" rows="3"></textarea></label>
                <label>
                  نوع نظرسنجی
                  <select formControlName="surveyType">
                    <option value="general">عمومی</option>
                    <option value="follow_up">پیگیری</option>
                    <option value="targeted">هدفمند</option>
                  </select>
                </label>
                <label>نقش هدف <input type="text" formControlName="targetRole" placeholder="مثال: manager, student" /></label>
                <label>تاریخ شروع <input type="date" formControlName="startDate" /></label>
                <label>تاریخ پایان <input type="date" formControlName="endDate" /></label>
                <div class="form-row">
                  <label>حداقل نمره <input type="number" formControlName="scoreScaleMin" min="0" max="10" /></label>
                  <label>حداکثر نمره <input type="number" formControlName="scoreScaleMax" min="1" max="10" /></label>
                </div>
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="isAnonymous" />
                  ناشناس
                </label>
                <div class="row-actions">
                  <button type="submit" class="btn" [disabled]="surveyForm.invalid || savingSurvey">
                    {{ savingSurvey ? 'در حال ذخیره...' : (surveyEditMode ? 'ذخیره تغییرات' : 'ایجاد نظرسنجی') }}
                  </button>
                  @if (surveyEditMode && selectedSurveyId !== null) {
                    <button type="button" class="btn btn-danger" [disabled]="savingSurvey" (click)="deleteSurvey()">
                      حذف
                    </button>
                  }
                </div>
              </form>

              <!-- Status actions -->
              @if (surveyEditMode && selectedSurvey !== null && selectedSurvey.status !== 'archived') {
                <div class="status-actions">
                  <h4>عملیات وضعیت</h4>
                  <div class="row-actions">
                    @if (selectedSurvey.status === 'draft') {
                      <button type="button" class="btn btn-success" [disabled]="savingSurvey" (click)="publishSurvey()">انتشار</button>
                    }
                    @if (selectedSurvey.status === 'active') {
                      <button type="button" class="btn btn-secondary" [disabled]="savingSurvey" (click)="closeSurvey()">بستن</button>
                    }
                    <button type="button" class="btn btn-secondary" [disabled]="savingSurvey" (click)="duplicateSurvey()">کپی‌گیری</button>
                    <button type="button" class="btn btn-secondary" [disabled]="savingSurvey" (click)="exportSurveyJson()">خروجی JSON</button>
                  </div>
                </div>
              }
            }

            <!-- QUESTIONS TAB -->
            @if (detailTab === 'questions') {
              <div>
                <h4 style="margin: 0.5rem 0">افزودن سوال جدید</h4>
                <form [formGroup]="questionForm" class="editor-form" (ngSubmit)="addQuestion()">
                  <label>متن سوال <textarea formControlName="questionText" rows="2"></textarea></label>
                  <label>دسته‌بندی <input type="text" formControlName="category" /></label>
                  <label>زیرمجموعه <input type="text" formControlName="subCategory" /></label>
                  <label>مخاطب <input type="text" formControlName="targetAudience" /></label>
                  <label>ترتیب <input type="number" formControlName="sortOrder" min="0" /></label>
                  <div class="row-actions">
                    <button type="submit" class="btn btn-secondary" [disabled]="questionForm.invalid || savingQuestion">
                      {{ savingQuestion ? '...' : 'افزودن سوال' }}
                    </button>
                  </div>
                </form>

                <h4 style="margin: 0.75rem 0 0.5rem">لیست سوالات</h4>
                @if (loadingQuestions) {
                  <p class="muted">در حال دریافت...</p>
                } @else if (surveyQuestions.length === 0) {
                  <p class="muted">سوالی اضافه نشده است.</p>
                } @else {
                  <div class="question-list">
                    @for (q of surveyQuestions; track q.id) {
                      <div class="question-item">
                        <div class="question-header">
                          <span class="question-order">#{{ q.sortOrder }}</span>
                          <span class="question-text">{{ q.questionText }}</span>
                          <button type="button" class="btn-remove" (click)="deleteQuestion(q)" title="حذف">✕</button>
                        </div>
                        <div class="question-meta">
                          <span class="tag">{{ q.category }}</span>
                          @if (q.subCategory) {
                            <span class="tag">{{ q.subCategory }}</span>
                          }
                          @if (q.targetAudience) {
                            <span class="tag">{{ q.targetAudience }}</span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- ACTIONS TAB -->
            @if (detailTab === 'actions') {
              <div>
                <h4 style="margin: 0.5rem 0">افزودن اقدام جدید</h4>
                <form [formGroup]="actionForm" class="editor-form" (ngSubmit)="addAction()">
                  <label>عنوان <input type="text" formControlName="title" /></label>
                  <label>توضیحات <textarea formControlName="description" rows="2"></textarea></label>
                  <label>دسته‌بندی <input type="text" formControlName="category" /></label>
                  <label>
                    اولویت
                    <select formControlName="priority">
                      <option value="critical">بحرانی</option>
                      <option value="high">بالا</option>
                      <option value="medium">متوسط</option>
                      <option value="low">پایین</option>
                    </select>
                  </label>
                  <label>تاریخ هدف <input type="date" formControlName="targetDate" /></label>
                  <label>KPI <input type="text" formControlName="kpiDefinition" placeholder="شاخص عملکرد" /></label>
                  <div class="row-actions">
                    <button type="submit" class="btn btn-secondary" [disabled]="actionForm.invalid || savingAction">
                      {{ savingAction ? '...' : 'افزودن اقدام' }}
                    </button>
                  </div>
                </form>

                <h4 style="margin: 0.75rem 0 0.5rem">لیست اقدامات</h4>
                @if (loadingActions) {
                  <p class="muted">در حال دریافت...</p>
                } @else if (surveyActions.length === 0) {
                  <p class="muted">اقدامی ثبت نشده است.</p>
                } @else {
                  <div class="action-list">
                    @for (action of surveyActions; track action.id) {
                      <div class="action-item">
                        <div class="action-header">
                          <span class="action-title">{{ action.title }}</span>
                          <span class="status-chip" [ngClass]="actionStatusClass(action.status)">
                            {{ actionStatusLabel(action.status) }}
                          </span>
                        </div>
                        <p class="action-desc">{{ action.description }}</p>
                        <div class="action-meta">
                          <span class="tag">{{ action.category }}</span>
                          <span class="tag" [ngClass]="priorityClass(action.priority)">
                            {{ actionPriorityLabel(action.priority) }}
                          </span>
                          @if (action.targetDate) {
                            <span class="list-meta">مهلت: {{ action.targetDate }}</span>
                          }
                        </div>
                        <div class="row-actions" style="margin-top: 0.5rem">
                          <button type="button" class="btn btn-sm btn-secondary" [disabled]="savingAction" (click)="updateActionStatus(action, 'in_progress')">شروع</button>
                          <button type="button" class="btn btn-sm btn-success" [disabled]="savingAction" (click)="updateActionStatus(action, 'completed')">تکمیل</button>
                          <button type="button" class="btn btn-sm btn-danger" [disabled]="savingAction" (click)="updateActionStatus(action, 'cancelled')">لغو</button>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- ANALYTICS TAB -->
            @if (detailTab === 'analytics') {
              <div>
                @if (loadingAnalytics) {
                  <p class="muted">در حال دریافت تحلیل...</p>
                } @else if (analyticsData === null) {
                  <p class="muted">داده‌ای برای تحلیل موجود نیست.</p>
                } @else {
                  <div class="analytics-section">
                    <h4>تحلیل کلی</h4>
                    <div class="survey-stats-grid">
                      <div class="stat-card">
                        <span class="stat-label">تعداد پاسخ‌دهندگان</span>
                        <strong class="stat-value">{{ analyticsData.totalRespondents }}</strong>
                      </div>
                      <div class="stat-card">
                        <span class="stat-label">تعداد سوالات</span>
                        <strong class="stat-value">{{ analyticsData.totalQuestions }}</strong>
                      </div>
                      <div class="stat-card">
                        <span class="stat-label">میانگین کل</span>
                        <strong class="stat-value">{{ analyticsData.overallAverage }}</strong>
                      </div>
                    </div>
                  </div>

                  @if (analyticsData.categoryBreakdown.length > 0) {
                    <div class="analytics-section">
                      <h4>تحلیل بر اساس دسته‌بندی</h4>
                      <div class="analytics-table">
                        <div class="analytics-row analytics-header">
                          <span>دسته‌بندی</span>
                          <span>میانگین نمره</span>
                          <span>تعداد سوال</span>
                          <span>شدت</span>
                        </div>
                        @for (cat of analyticsData.categoryBreakdown; track cat.category) {
                          <div class="analytics-row">
                            <span>{{ cat.category }}</span>
                            <span>{{ cat.averageScore }}</span>
                            <span>{{ cat.questionCount }}</span>
                            <span class="tag" [ngClass]="severityClass(cat.severity)">
                              {{ cat.severity === 'critical' ? 'بحرانی' : cat.severity === 'problem' ? 'مشکل' : 'قابل حل' }}
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                }
              </div>
            }
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .survey-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .stat-card {
        background: var(--lp-surface);
        border: 1px solid var(--lp-border);
        border-radius: 8px;
        padding: 0.75rem;
        text-align: center;
      }
      .stat-label {
        display: block;
        font-size: 0.75rem;
        color: var(--lp-text-secondary);
      }
      .stat-value {
        display: block;
        font-size: 1.25rem;
        color: var(--lp-text);
      }
      .status-actions {
        margin-top: 1rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--lp-border);
      }
      .form-row {
        display: flex;
        gap: 0.5rem;
      }
      .form-row label {
        flex: 1;
      }
      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }
      .question-list,
      .action-list,
      .issue-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .question-item,
      .action-item,
      .issue-item {
        padding: 0.5rem;
        border: 1px solid var(--lp-border);
        border-radius: 6px;
      }
      .question-header,
      .action-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .question-order,
      .action-title {
        font-weight: 600;
        min-width: 2rem;
      }
      .question-text,
      .action-desc {
        flex: 1;
        font-size: 0.875rem;
      }
      .question-meta,
      .action-meta {
        display: flex;
        gap: 0.25rem;
        margin-top: 0.25rem;
        flex-wrap: wrap;
      }
      .tag {
        font-size: 0.7rem;
        padding: 0.1rem 0.4rem;
        background: var(--lp-surface);
        border: 1px solid var(--lp-border);
        border-radius: 4px;
        color: var(--lp-text-secondary);
      }
      .analytics-section {
        margin-bottom: 1rem;
      }
      .analytics-table {
        border: 1px solid var(--lp-border);
        border-radius: 6px;
        overflow: hidden;
      }
      .analytics-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        align-items: center;
      }
      .analytics-header {
        font-weight: 600;
        background: var(--lp-surface);
        border-bottom: 1px solid var(--lp-border);
      }
      .issue-critical {
        border-left: 3px solid var(--lp-danger);
      }
      .issue-strength {
        border-left: 3px solid var(--lp-success);
      }
      .issue-text {
        flex: 1;
        font-size: 0.875rem;
      }
      .issue-score {
        font-size: 0.75rem;
        color: var(--lp-text-secondary);
      }
      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSurveysComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  surveys: IssueSurvey[] = [];
  loadingSurveys = false;
  savingSurvey = false;
  searchQuery = '';
  selectedSurveyId: number | null = null;
  surveyEditMode = false;
  detailTab: 'info' | 'questions' | 'actions' | 'analytics' = 'info';

  surveyForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    surveyType: ['general'],
    targetRole: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isAnonymous: [false],
    scoreScaleMin: [0, Validators.required],
    scoreScaleMax: [5, Validators.required],
  });

  dashboardSummary: any = null;

  // Questions
  surveyQuestions: IssueSurveyQuestion[] = [];
  loadingQuestions = false;
  savingQuestion = false;
  questionForm = this.fb.nonNullable.group({
    questionText: ['', Validators.required],
    category: ['', Validators.required],
    subCategory: [''],
    targetAudience: [''],
    sortOrder: [0, Validators.required],
  });

  // Actions
  surveyActions: IssueAction[] = [];
  loadingActions = false;
  savingAction = false;
  actionForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    priority: ['medium'],
    targetDate: [''],
    kpiDefinition: [''],
  });

  // Analytics
  analyticsData: any = null;
  loadingAnalytics = false;

  errorMessage = '';
  successMessage = '';

  get filteredSurveys(): IssueSurvey[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.surveys;
    return this.surveys.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.surveyType.toLowerCase().includes(q) ||
        s.targetRole.toLowerCase().includes(q),
    );
  }

  get selectedSurvey(): IssueSurvey | null {
    if (this.selectedSurveyId === null) return null;
    return this.surveys.find((s) => s.id === this.selectedSurveyId) ?? null;
  }

  /* ─── Surveys ─── */

  loadSurveys(): void {
    this.loadingSurveys = true;
    this.api
      .getIssueSurveys()
      .pipe(finalize(() => (this.loadingSurveys = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.surveys = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت نظرسنجی‌ها با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  startCreateSurvey(): void {
    this.surveyEditMode = false;
    this.selectedSurveyId = null;
    this.detailTab = 'info';
    this.surveyForm.reset({
      title: '',
      description: '',
      surveyType: 'general',
      targetRole: '',
      startDate: '',
      endDate: '',
      isAnonymous: false,
      scoreScaleMin: 0,
      scoreScaleMax: 5,
    });
  }

  selectSurvey(survey: IssueSurvey): void {
    this.selectedSurveyId = survey.id;
    this.surveyEditMode = true;
    this.detailTab = 'info';
    this.surveyForm.setValue({
      title: survey.title,
      description: survey.description ?? '',
      surveyType: survey.surveyType,
      targetRole: survey.targetRole,
      startDate: survey.startDate,
      endDate: survey.endDate,
      isAnonymous: survey.isAnonymous,
      scoreScaleMin: survey.scoreScaleMin,
      scoreScaleMax: survey.scoreScaleMax,
    });
    this.analyticsData = null;
    this.surveyQuestions = [];
    this.surveyActions = [];
  }

  saveSurvey(): void {
    if (this.surveyForm.invalid) return;
    const raw = this.surveyForm.getRawValue() as unknown as CreateIssueSurveyPayload;
    this.savingSurvey = true;
    const request$ =
      this.surveyEditMode && this.selectedSurveyId !== null
        ? this.api.updateIssueSurvey(this.selectedSurveyId, raw)
        : this.api.createIssueSurvey(raw);
    request$
      .pipe(finalize(() => (this.savingSurvey = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (saved) => {
          this.setSuccess('نظرسنجی ذخیره شد.');
          this.selectedSurveyId = saved.id;
          this.surveyEditMode = true;
          this.loadSurveys();
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('ذخیره نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  deleteSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    if (!confirm('آیا از حذف این نظرسنجی اطمینان دارید؟')) return;
    this.savingSurvey = true;
    this.api
      .deleteIssueSurvey(this.selectedSurveyId)
      .pipe(finalize(() => (this.savingSurvey = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('نظرسنجی حذف شد.');
          this.selectedSurveyId = null;
          this.surveyEditMode = false;
          this.surveyQuestions = [];
          this.surveyActions = [];
          this.analyticsData = null;
          this.loadSurveys();
        },
        error: () => {
          this.setError('حذف نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  publishSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    this.savingSurvey = true;
    this.api
      .publishIssueSurvey(this.selectedSurveyId)
      .pipe(finalize(() => (this.savingSurvey = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('نظرسنجی منتشر شد.');
          this.loadSurveys();
          this.refreshSelectedSurvey();
        },
        error: () => {
          this.setError('انتشار نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  closeSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    this.savingSurvey = true;
    this.api
      .closeIssueSurvey(this.selectedSurveyId)
      .pipe(finalize(() => (this.savingSurvey = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('نظرسنجی بسته شد.');
          this.loadSurveys();
          this.refreshSelectedSurvey();
        },
        error: () => {
          this.setError('بستن نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  duplicateSurvey(): void {
    if (this.selectedSurveyId === null || this.savingSurvey) return;
    this.savingSurvey = true;
    this.api
      .duplicateIssueSurvey(this.selectedSurveyId)
      .pipe(finalize(() => (this.savingSurvey = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('نظرسنجی کپی شد.');
          this.loadSurveys();
        },
        error: () => {
          this.setError('کپی‌گیری نظرسنجی با خطا مواجه شد.');
        },
      });
  }

  exportSurveyJson(): void {
    if (this.selectedSurveyId === null) return;
    this.api
      .exportSurveyJson(this.selectedSurveyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `survey-${this.selectedSurveyId}.json`;
          a.click();
          URL.revokeObjectURL(url);
          this.setSuccess('خروجی JSON دانلود شد.');
        },
        error: () => {
          this.setError('خروجی JSON با خطا مواجه شد.');
        },
      });
  }

  private refreshSelectedSurvey(): void {
    if (this.selectedSurveyId === null) return;
    this.api.getIssueSurveyById(this.selectedSurveyId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (survey) => {
        const idx = this.surveys.findIndex((s) => s.id === survey.id);
        if (idx !== -1) this.surveys[idx] = survey;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  /* ─── Questions ─── */

  loadSurveyQuestions(): void {
    if (this.selectedSurveyId === null) return;
    this.loadingQuestions = true;
    this.api
      .getIssueSurveyQuestions(this.selectedSurveyId)
      .pipe(finalize(() => (this.loadingQuestions = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.surveyQuestions = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت سوالات با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  addQuestion(): void {
    if (this.selectedSurveyId === null || this.questionForm.invalid || this.savingQuestion) return;
    const raw = this.questionForm.getRawValue() as unknown as CreateIssueQuestionPayload;
    this.savingQuestion = true;
    this.api
      .createIssueSurveyQuestion(this.selectedSurveyId, {
        ...raw,
        surveyId: this.selectedSurveyId,
      })
      .pipe(finalize(() => (this.savingQuestion = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('سوال اضافه شد.');
          this.questionForm.reset({ questionText: '', category: '', subCategory: '', targetAudience: '', sortOrder: 0 });
          this.loadSurveyQuestions();
        },
        error: () => {
          this.setError('افزودن سوال با خطا مواجه شد.');
        },
      });
  }

  deleteQuestion(question: IssueSurveyQuestion): void {
    if (this.selectedSurveyId === null || this.savingQuestion) return;
    if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) return;
    this.savingQuestion = true;
    this.api
      .deleteIssueSurveyQuestion(this.selectedSurveyId, question.id)
      .pipe(finalize(() => (this.savingQuestion = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('سوال حذف شد.');
          this.loadSurveyQuestions();
        },
        error: () => {
          this.setError('حذف سوال با خطا مواجه شد.');
        },
      });
  }

  /* ─── Actions ─── */

  loadSurveyActions(): void {
    if (this.selectedSurveyId === null) return;
    this.loadingActions = true;
    this.api
      .getSurveyActions(this.selectedSurveyId)
      .pipe(finalize(() => (this.loadingActions = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.surveyActions = items;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت اقدامات با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  addAction(): void {
    if (this.selectedSurveyId === null || this.actionForm.invalid || this.savingAction) return;
    const raw = this.actionForm.getRawValue() as unknown as CreateIssueActionPayload;
    this.savingAction = true;
    this.api
      .createSurveyAction(this.selectedSurveyId, { ...raw, surveyId: this.selectedSurveyId })
      .pipe(finalize(() => (this.savingAction = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('اقدام اضافه شد.');
          this.actionForm.reset({ title: '', description: '', category: '', priority: 'medium', targetDate: '', kpiDefinition: '' });
          this.loadSurveyActions();
        },
        error: () => {
          this.setError('افزودن اقدام با خطا مواجه شد.');
        },
      });
  }

  updateActionStatus(action: IssueAction, status: string): void {
    if (this.savingAction) return;
    const updatedById = 1; // mock user id
    this.savingAction = true;
    this.api
      .updateIssueActionStatus(action.id, status, updatedById)
      .pipe(finalize(() => (this.savingAction = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('وضعیت اقدام به‌روز شد.');
          this.loadSurveyActions();
        },
        error: () => {
          this.setError('به‌روزرسانی وضعیت با خطا مواجه شد.');
        },
      });
  }

  /* ─── Analytics ─── */

  loadSurveyAnalytics(): void {
    if (this.selectedSurveyId === null) return;
    this.loadingAnalytics = true;
    this.api
      .getSurveyAnalytics(this.selectedSurveyId)
      .pipe(finalize(() => (this.loadingAnalytics = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.analyticsData = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت تحلیل با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  loadDashboardSummary(): void {
    this.api.getIssueDashboardSummary().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.dashboardSummary = data;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  /* ─── Shared ─── */

  surveyStatusClass(status: SurveyStatus): string {
    switch (status) {
      case 'active':
        return 'status-chip--active';
      case 'draft':
        return 'status-chip--draft';
      case 'closed':
        return 'status-chip--closed';
      case 'archived':
        return 'status-chip--archived';
      default:
        return '';
    }
  }

  surveyStatusLabel(status: SurveyStatus): string {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'draft':
        return 'پیش‌نویس';
      case 'closed':
        return 'بسته';
      case 'archived':
        return 'آرشیو';
      default:
        return status;
    }
  }

  actionStatusClass(status: string): string {
    switch (status) {
      case 'proposed':
        return 'status-chip--draft';
      case 'approved':
        return 'status-chip--active';
      case 'in_progress':
        return 'status-chip--active';
      case 'completed':
        return 'status-chip--closed';
      case 'cancelled':
        return 'status-chip--archived';
      default:
        return '';
    }
  }

  actionStatusLabel(status: string): string {
    switch (status) {
      case 'proposed':
        return 'پیشنهاد';
      case 'approved':
        return 'تایید';
      case 'in_progress':
        return 'در حال انجام';
      case 'completed':
        return 'تکمیل';
      case 'cancelled':
        return 'لغو';
      default:
        return status;
    }
  }

  actionPriorityLabel(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'بحرانی';
      case 'high':
        return 'بالا';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'پایین';
      default:
        return priority;
    }
  }

  severityClass(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'status-chip--active';
      case 'problem':
        return 'status-chip--closed';
      default:
        return '';
    }
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'status-chip--active';
      case 'high':
        return 'status-chip--closed';
      default:
        return '';
    }
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
    this.cdr.markForCheck();
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.loadSurveys();
    this.loadDashboardSummary();
  }
}
