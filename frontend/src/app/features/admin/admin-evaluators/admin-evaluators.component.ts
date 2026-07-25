import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Evaluator, EvaluationRecord, CreateEvaluatorPayload, CreateEvaluationPayload } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-evaluators',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-evaluators-title">
      <header class="section-header">
        <h2 id="admin-evaluators-title" class="section-title">مدیریت ارزیابان</h2>
        <button type="button" class="btn btn-secondary" (click)="startCreateEvaluator()">ارزیاب جدید</button>
      </header>

      <div class="split-grid">
        <div>
          <input type="text" [(ngModel)]="searchEvaluatorQuery" placeholder="جستجوی ارزیابان..." class="search-input" />
          @if (loadingEvaluators) {
            <p class="muted">در حال دریافت لیست ارزیابان...</p>
          } @else if (filteredEvaluators.length === 0) {
            <p class="muted">ارزیابی یافت نشد.</p>
          } @else {
            <div class="select-list">
              @for (evaluator of filteredEvaluators; track evaluator.id) {
                <button type="button" class="list-item" [class.is-selected]="selectedEvaluatorId === evaluator.id" (click)="selectEvaluator(evaluator.id)">
                  <div class="list-item-top">
                    <strong>{{ evaluator.firstName }} {{ evaluator.lastName }}</strong>
                    <span class="status-chip" [class.status-chip--active]="evaluator.status === 'active'" [class.status-chip--inactive]="evaluator.status !== 'active'">
                      {{ evaluator.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </div>
                  <span class="list-meta">{{ evaluator.expertise }}</span>
                  <small class="list-meta">{{ evaluator.phoneNumber }}</small>
                </button>
              }
            </div>
          }
        </div>

        <form [formGroup]="evaluatorForm" class="editor-form" (ngSubmit)="saveEvaluator()">
          <h3>{{ evaluatorEditMode ? 'ویرایش ارزیاب' : 'ایجاد ارزیاب جدید' }}</h3>
          <label class="form-field">
            <span class="form-label">کد ملی</span>
            <input #evaluatorNc type="text" formControlName="nationalCode" dir="ltr" class="form-input" (input)="onEvaluatorNationalCodeInput(evaluatorNc.value)" />
            @if (!evaluatorEditMode) {
              <small class="form-hint">نام کاربری و رمز عبور به‌طور خودکار کد ملی قرار می‌گیرد</small>
            }
          </label>
          <label>نام کاربری <input type="text" formControlName="username" [readonly]="!evaluatorEditMode" /></label>
          <label>رمز عبور <input type="password" formControlName="password" [placeholder]="evaluatorEditMode ? 'برای تغییر رمز وارد کنید' : ''" /></label>
          <label>نام <input type="text" formControlName="firstName" /></label>
          <label>نام خانوادگی <input type="text" formControlName="lastName" /></label>
          <label>ایمیل <input type="email" formControlName="email" /></label>
          <label>شماره تماس <input type="tel" formControlName="phoneNumber" dir="ltr" /></label>
          <label>تخصص <input type="text" formControlName="expertise" /></label>
          <label>شناسه مکاتب اختصاصی (جدا شده با کاما) <input type="text" formControlName="assignedMadrasahIds" dir="ltr" placeholder="1,2,3" /></label>
          <div class="row-actions">
            <button type="submit" class="btn" [disabled]="evaluatorForm.invalid || savingEvaluator">
              {{ savingEvaluator ? 'در حال ذخیره...' : evaluatorEditMode ? 'ذخیره تغییرات' : 'ایجاد ارزیاب' }}
            </button>
            @if (evaluatorEditMode && selectedEvaluatorId !== null) {
              <button type="button" class="btn btn-secondary" [disabled]="savingEvaluator" (click)="deleteEvaluator(selectedEvaluatorId)">حذف ارزیاب</button>
            }
          </div>
        </form>
      </div>

      @if (evaluatorEditMode && selectedEvaluatorId !== null) {
        <div class="evaluation-section" style="margin-top: 1.5rem; border-top: 1px solid var(--lp-border); padding-top: 1rem">
          <h4>ثبت ارزیابی جدید</h4>
          <form [formGroup]="evaluationForm" class="editor-form" (ngSubmit)="saveEvaluation()" style="margin-bottom: 1rem">
            <div class="form-row-inline" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem">
              <label>نام هدف <input type="text" formControlName="targetName" /></label>
              <label>نوع هدف
                <select formControlName="targetType">
                  <option value="coach">مربی</option>
                  <option value="student">متربی</option>
                  <option value="branch">شعبه</option>
                </select>
              </label>
              <label>شناسه هدف <input type="number" formControlName="targetId" min="1" /></label>
              <label>نمره (۰ تا ۲۰) <input type="number" formControlName="score" min="0" max="20" /></label>
              <label>تاریخ <input type="date" formControlName="evaluationDate" /></label>
            </div>
            <label>بازخورد <textarea formControlName="feedback" rows="2"></textarea></label>
            <button type="submit" class="btn" [disabled]="evaluationForm.invalid || savingEvaluation">
              {{ savingEvaluation ? 'در حال ثبت...' : 'ثبت ارزیابی' }}
            </button>
          </form>

          <h4>رکوردهای ارزیابی</h4>
          @if (loadingEvaluationRecords) {
            <p class="muted">در حال دریافت رکوردها...</p>
          } @else if (evaluationRecords.length === 0) {
            <p class="muted">هنوز رکورد ارزیابی ثبت نشده است.</p>
          } @else {
            <div class="branch-list">
              @for (record of evaluationRecords; track record.id) {
                <div class="branch-item">
                  <span class="branch-name">{{ record.targetName }}</span>
                  <span class="list-meta">{{ record.targetType === 'coach' ? 'مربی' : record.targetType === 'student' ? 'متربی' : 'شعبه' }} #{{ record.targetId }}</span>
                  <span class="status-chip status-chip--active">نمره: {{ record.score }}/۲۰</span>
                  <span class="list-meta">{{ record.evaluationDate }}</span>
                  <small class="list-meta">{{ record.feedback }}</small>
                  <button type="button" class="btn-remove" (click)="deleteEvaluation(record.id)" title="حذف رکورد">✕</button>
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEvaluatorsComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  evaluators: Evaluator[] = [];
  loadingEvaluators = false;
  savingEvaluator = false;
  searchEvaluatorQuery = '';
  evaluatorEditMode = false;
  selectedEvaluatorId: number | null = null;
  evaluationRecords: EvaluationRecord[] = [];
  loadingEvaluationRecords = false;
  savingEvaluation = false;

  evaluationForm: FormGroup = this.fb.nonNullable.group({
    evaluatorId: [0, [Validators.required]],
    targetName: ['', [Validators.required]],
    targetType: ['coach' as 'coach' | 'student' | 'branch'],
    targetId: [0, [Validators.required]],
    score: [10, [Validators.required, Validators.min(0), Validators.max(20)]],
    feedback: ['', [Validators.required]],
    evaluationDate: [this.todayIsoDate(), [Validators.required]],
  });

  evaluatorForm: FormGroup = this.fb.nonNullable.group({
    nationalCode: [''],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    expertise: [''],
    assignedMadrasahIds: [''],
  });

  errorMessage = '';
  successMessage = '';

  get filteredEvaluators(): Evaluator[] {
    const q = this.searchEvaluatorQuery.trim().toLowerCase();
    if (!q) return this.evaluators;
    return this.evaluators.filter(
      (e) =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.username.toLowerCase().includes(q) ||
        e.expertise.toLowerCase().includes(q),
    );
  }

  loadEvaluators(): void {
    this.loadingEvaluators = true;
    this.api
      .getEvaluators()
      .pipe(finalize(() => (this.loadingEvaluators = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (evaluators) => {
          this.evaluators = evaluators;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست ارزیابان با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  onEvaluatorNationalCodeInput(value: string): void {
    if (this.evaluatorEditMode) return;
    const code = value.trim();
    this.evaluatorForm.patchValue(
      { username: code, password: code },
      { emitEvent: false },
    );
  }

  startCreateEvaluator(): void {
    this.evaluatorEditMode = false;
    this.selectedEvaluatorId = null;
    this.evaluatorForm.setValue({
      nationalCode: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      expertise: '',
      assignedMadrasahIds: '',
    });
  }

  selectEvaluator(evaluatorId: number): void {
    const evaluator = this.evaluators.find((e) => e.id === evaluatorId);
    if (!evaluator) return;
    this.selectedEvaluatorId = evaluatorId;
    this.evaluatorEditMode = true;
    this.evaluatorForm.setValue({
      nationalCode: evaluator.nationalCode ?? '',
      username: evaluator.username,
      password: '',
      firstName: evaluator.firstName,
      lastName: evaluator.lastName,
      email: evaluator.email,
      phoneNumber: evaluator.phoneNumber,
      expertise: evaluator.expertise,
      assignedMadrasahIds: evaluator.assignedMadrasahIds.join(','),
    });
    this.evaluatorForm.get('password')?.clearValidators();
    this.evaluatorForm.get('password')?.updateValueAndValidity();
    this.evaluationForm.patchValue({ evaluatorId: evaluatorId });
    this.loadEvaluationRecords(evaluatorId);
  }

  saveEvaluator(): void {
    if (this.evaluatorForm.invalid) return;
    const raw = this.evaluatorForm.getRawValue();
    const madrasahIds = raw.assignedMadrasahIds
      .split(',')
      .map((s: string) => Number(s.trim()))
      .filter((n: number) => Number.isFinite(n) && n > 0);
    const payload: CreateEvaluatorPayload = {
      nationalCode: raw.nationalCode.trim(),
      username: raw.username.trim(),
      password: raw.password.trim(),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      expertise: raw.expertise.trim(),
      assignedMadrasahIds: madrasahIds,
    };

    this.savingEvaluator = true;
    const request$ =
      this.evaluatorEditMode && this.selectedEvaluatorId !== null
        ? this.api.updateEvaluator(this.selectedEvaluatorId, payload)
        : this.api.createEvaluator(payload);

    request$
      .pipe(finalize(() => (this.savingEvaluator = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (evaluator) => {
          this.selectedEvaluatorId = evaluator.id;
          this.evaluatorEditMode = true;
          this.setSuccess('اطلاعات ارزیاب ذخیره شد.');
          this.loadEvaluators();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره اطلاعات ارزیاب با خطا مواجه شد.');
        },
      });
  }

  deleteEvaluator(evaluatorId: number): void {
    if (this.savingEvaluator) return;
    this.savingEvaluator = true;
    this.api
      .deleteEvaluator(evaluatorId)
      .pipe(finalize(() => (this.savingEvaluator = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response?.message ?? 'ارزیاب با موفقیت حذف شد.');
          if (this.selectedEvaluatorId === evaluatorId) {
            this.startCreateEvaluator();
            this.evaluationRecords = [];
          }
          this.loadEvaluators();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف ارزیاب با خطا مواجه شد.');
        },
      });
  }

  loadEvaluationRecords(evaluatorId?: number): void {
    this.loadingEvaluationRecords = true;
    this.api
      .getEvaluationRecords(evaluatorId)
      .pipe(finalize(() => (this.loadingEvaluationRecords = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (records) => {
          this.evaluationRecords = records;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت رکوردهای ارزیابی با خطا مواجه شد.');
        },
      });
  }

  saveEvaluation(): void {
    if (this.evaluationForm.invalid) return;
    const raw = this.evaluationForm.getRawValue();
    const payload: CreateEvaluationPayload = {
      evaluatorId: raw.evaluatorId,
      targetName: raw.targetName.trim(),
      targetType: raw.targetType,
      targetId: raw.targetId,
      score: raw.score,
      feedback: raw.feedback.trim(),
      evaluationDate: raw.evaluationDate,
    };

    this.savingEvaluation = true;
    this.api
      .createEvaluation(payload)
      .pipe(finalize(() => (this.savingEvaluation = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('رکورد ارزیابی با موفقیت ثبت شد.');
          this.loadEvaluationRecords(this.selectedEvaluatorId ?? undefined);
          this.evaluationForm.patchValue({
            targetName: '',
            targetId: 0,
            score: 10,
            feedback: '',
            evaluationDate: this.todayIsoDate(),
          });
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ثبت رکورد ارزیابی با خطا مواجه شد.');
        },
      });
  }

  deleteEvaluation(recordId: number): void {
    if (this.savingEvaluation) return;
    this.savingEvaluation = true;
    this.api
      .deleteEvaluation(recordId)
      .pipe(finalize(() => (this.savingEvaluation = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.loadEvaluationRecords(this.selectedEvaluatorId ?? undefined);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف رکورد ارزیابی با خطا مواجه شد.');
        },
      });
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
  }
}
