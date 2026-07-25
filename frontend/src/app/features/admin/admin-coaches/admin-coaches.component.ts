import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Coach, CreateCoachPayload } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-coaches',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-coaches-title">
      <header class="section-header">
        <h2 id="admin-coaches-title" class="section-title">
          مدیریت مربیان
          <span class="count-badge">{{ coaches.length }}</span>
        </h2>
        <button type="button" class="btn" (click)="openCoachModal()">مربی جدید</button>
      </header>

      <div class="trainee-search">
        <input
          type="text"
          [(ngModel)]="searchCoachQuery"
          placeholder="جستجوی مربی (نام، نام کاربری، تخصص)..."
          class="search-input"
        />
      </div>

      @if (loadingCoaches) {
        <p class="muted">در حال دریافت لیست مربیان...</p>
      } @else if (coaches.length === 0) {
        <p class="muted">هیچ مربی ثبت نشده است.</p>
      } @else {
        <div class="table-responsive">
          <table class="data-table coach-table">
            <thead>
              <tr>
                <th>نام و نام خانوادگی</th>
                <th>نام کاربری</th>
                <th>ایمیل</th>
                <th>موبایل</th>
                <th>تخصص</th>
                <th>دوره‌ها</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              @for (coach of filteredCoaches; track coach.id) {
                <tr>
                  <td class="coach-name-cell">
                    <strong>{{ coach.firstName }} {{ coach.lastName }}</strong>
                  </td>
                  <td>{{ coach.username }}</td>
                  <td>{{ coach.email }}</td>
                  <td>{{ coach.phoneNumber }}</td>
                  <td>{{ coach.specialization || '—' }}</td>
                  <td>
                    @if (coach.assignedCourseIds.length > 0) {
                      <span class="course-count-badge">{{ coach.assignedCourseIds.length }} دوره</span>
                    } @else {
                      <span class="muted">—</span>
                    }
                  </td>
                  <td>
                    <span class="status-chip" [class.status-chip--active]="coach.status === 'active'" [class.status-chip--inactive]="coach.status !== 'active'">
                      {{ coach.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button type="button" class="icon-btn icon-btn--edit" (click)="openCoachModal(coach)" title="ویرایش">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button type="button" class="icon-btn icon-btn--delete" (click)="deleteCoach(coach.id)" title="حذف">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    @if (showCoachModal) {
      <div class="modal-overlay" (click)="closeCoachModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ coachEditMode ? 'ویرایش مربی' : 'مربی جدید' }}</h3>
            <button type="button" class="modal-close" (click)="closeCoachModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="coachForm" class="modal-body" (ngSubmit)="saveCoach()">
            <div class="form-grid">
              <label class="form-field">
                <span class="form-label">کد ملی</span>
                <input #coachNc type="text" formControlName="nationalCode" placeholder="مثال: 1234567890" class="form-input" (input)="onNationalCodeInput(coachNc.value)" />
                @if (!coachEditMode) {
                  <small class="form-hint">نام کاربری و رمز عبور به‌طور خودکار کد ملی قرار می‌گیرد</small>
                }
              </label>
              <label class="form-field">
                <span class="form-label">نام کاربری *</span>
                <input type="text" formControlName="username" placeholder="مثال: ali.ahmadi" class="form-input" [readonly]="!coachEditMode" />
              </label>
              <label class="form-field">
                <span class="form-label">{{ coachEditMode ? 'رمز عبور (خالی = بدون تغییر)' : 'رمز عبور *' }}</span>
                <input type="password" formControlName="password" [placeholder]="coachEditMode ? 'خالی بگذارید = بدون تغییر' : 'حداقل ۶ کاراکتر'" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">نام *</span>
                <input type="text" formControlName="firstName" placeholder="مثال: علی" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">نام خانوادگی *</span>
                <input type="text" formControlName="lastName" placeholder="مثال: احمدی" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">ایمیل *</span>
                <input type="email" formControlName="email" placeholder="مثال: ali@example.com" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">شماره موبایل *</span>
                <input type="text" formControlName="phoneNumber" placeholder="09123456789" class="form-input" />
              </label>
              <label class="form-field form-field--full">
                <span class="form-label">تخصص</span>
                <input type="text" formControlName="specialization" placeholder="مثال: ریاضیات، علوم قرآنی" class="form-input" />
              </label>
              <label class="form-field form-field--full">
                <span class="form-label">دوره‌های تحت پوشش (شناسه با کاما)</span>
                <input type="text" formControlName="assignedCourseIds" placeholder="مثال: 1,2,3" class="form-input" />
              </label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeCoachModal()">انصراف</button>
              @if (coachEditMode && selectedCoachId !== null) {
                <button type="button" class="btn btn-danger" [disabled]="savingCoach" (click)="deleteCoach(selectedCoachId)">حذف مربی</button>
              }
              <button type="submit" class="btn" [disabled]="coachForm.invalid || savingCoach">
                {{ savingCoach ? 'در حال ذخیره...' : coachEditMode ? 'ذخیره تغییرات' : 'ایجاد مربی' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCoachesComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  coaches: Coach[] = [];
  loadingCoaches = false;
  savingCoach = false;
  showCoachModal = false;
  coachEditMode = false;
  selectedCoachId: number | null = null;
  searchCoachQuery = '';

  coachForm: FormGroup = this.fb.nonNullable.group({
    nationalCode: [''],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    specialization: [''],
    assignedCourseIds: [''],
  });

  errorMessage = '';
  successMessage = '';

  get filteredCoaches(): Coach[] {
    const q = this.searchCoachQuery.trim().toLowerCase();
    if (!q) return this.coaches;
    return this.coaches.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.specialization.toLowerCase().includes(q),
    );
  }

  loadCoaches(): void {
    this.loadingCoaches = true;
    this.api
      .getCoaches()
      .pipe(finalize(() => (this.loadingCoaches = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (coaches) => {
          this.coaches = coaches;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست مربیان با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  openCoachModal(coach?: Coach): void {
    if (coach) {
      this.coachEditMode = true;
      this.selectedCoachId = coach.id;
      this.coachForm.reset({
        nationalCode: coach.nationalCode ?? '',
        username: coach.username,
        password: '',
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email,
        phoneNumber: coach.phoneNumber,
        specialization: coach.specialization,
        assignedCourseIds: coach.assignedCourseIds.join(','),
      });
      this.coachForm.get('password')?.clearValidators();
      this.coachForm.get('password')?.updateValueAndValidity();
    } else {
      this.coachEditMode = false;
      this.selectedCoachId = null;
      this.coachForm.reset({
        nationalCode: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        assignedCourseIds: '',
      });
      this.coachForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.coachForm.get('password')?.updateValueAndValidity();
    }
    this.showCoachModal = true;
  }

  onNationalCodeInput(value: string): void {
    if (this.coachEditMode) return;
    const code = value.trim();
    this.coachForm.patchValue(
      { username: code, password: code },
      { emitEvent: false },
    );
  }

  closeCoachModal(): void {
    this.showCoachModal = false;
    this.coachEditMode = false;
    this.selectedCoachId = null;
  }

  saveCoach(): void {
    if (this.coachForm.invalid) return;
    const raw = this.coachForm.getRawValue();
    const courseIds = raw.assignedCourseIds
      .split(',')
      .map((s: string) => Number(s.trim()))
      .filter((n: number) => Number.isFinite(n) && n > 0);
    const payload: CreateCoachPayload = {
      username: raw.username.trim(),
      password: raw.password.trim(),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      specialization: raw.specialization.trim(),
      nationalCode: raw.nationalCode.trim(),
      assignedCourseIds: courseIds,
    };

    const isEdit = this.coachEditMode && this.selectedCoachId !== null;
    const coachId = this.selectedCoachId;
    this.closeCoachModal();
    this.savingCoach = true;
    const request$ = isEdit
      ? this.api.updateCoach(coachId!, payload)
      : this.api.createCoach(payload);

    request$
      .pipe(finalize(() => (this.savingCoach = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (coach) => {
          if (isEdit) {
            const idx = this.coaches.findIndex((c) => c.id === coach.id);
            if (idx >= 0) {
              this.coaches[idx] = coach;
            } else {
              this.coaches.push(coach);
            }
          } else {
            this.coaches.push(coach);
          }
          this.selectedCoachId = coach.id;
          this.coachEditMode = true;
          this.setSuccess('اطلاعات مربی ذخیره شد.');
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره اطلاعات مربی با خطا مواجه شد.');
        },
      });
  }

  deleteCoach(coachId: number): void {
    if (this.savingCoach) return;
    this.savingCoach = true;
    this.api
      .deleteCoach(coachId)
      .pipe(finalize(() => (this.savingCoach = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response?.message ?? 'مربی با موفقیت حذف شد.');
          this.closeCoachModal();
          this.loadCoaches();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف مربی با خطا مواجه شد.');
        },
      });
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
