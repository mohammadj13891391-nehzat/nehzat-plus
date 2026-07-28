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
  templateUrl: './admin-surveys.component.html',
  styleUrls: ['./admin-surveys.component.scss'],
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
