import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { BranchManager, CreateBranchManagerPayload, Branch } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-branch-managers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-bm-title">
      <header class="section-header">
        <h2 id="admin-bm-title" class="section-title">
          مدیریت مسئولین شعب
          <span class="count-badge">{{ branchManagers.length }}</span>
        </h2>
        <button type="button" class="btn" (click)="openBranchManagerModal()">مسئول جدید</button>
      </header>

      <div class="trainee-search">
        <input
          type="text"
          [(ngModel)]="searchBranchManagerQuery"
          placeholder="جستجوی مسئول (نام، نام کاربری، شعبه، استان)..."
          class="search-input"
        />
      </div>

      @if (loadingBranchManagers) {
        <p class="muted">در حال دریافت لیست مسئولین...</p>
      } @else if (branchManagers.length === 0) {
        <p class="muted">هیچ مسئول شعبه‌ای ثبت نشده است.</p>
      } @else {
        <div class="table-responsive">
          <table class="data-table coach-table">
            <thead>
              <tr>
                <th>نام و نام خانوادگی</th>
                <th>نام کاربری</th>
                <th>ایمیل</th>
                <th>موبایل</th>
                <th>شعبه</th>
                <th>جنسیت</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              @for (bm of filteredBranchManagers; track bm.id) {
                <tr>
                  <td class="coach-name-cell">
                    <strong>{{ bm.firstName }} {{ bm.lastName }}</strong>
                  </td>
                  <td>{{ bm.username }}</td>
                  <td>{{ bm.email }}</td>
                  <td>{{ bm.phoneNumber }}</td>
                  <td>{{ bm.branchName }}</td>
                  <td>{{ bm.gender === 'male' ? 'مردانه' : bm.gender === 'female' ? 'زنانه' : 'مختلط' }}</td>
                  <td>
                    <span class="status-chip" [class.status-chip--active]="bm.status === 'active'" [class.status-chip--inactive]="bm.status !== 'active'">
                      {{ bm.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button type="button" class="icon-btn icon-btn--edit" (click)="openBranchManagerModal(bm)" title="ویرایش">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button type="button" class="icon-btn icon-btn--delete" (click)="deleteBranchManager(bm.id)" title="حذف">
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

    @if (showBranchManagerModal) {
      <div class="modal-overlay" (click)="closeBranchManagerModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ branchManagerEditMode ? 'ویرایش مسئول شعبه' : 'مسئول شعبه جدید' }}</h3>
            <button type="button" class="modal-close" (click)="closeBranchManagerModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="branchManagerForm" class="modal-body" (ngSubmit)="saveBranchManager()">
            <div class="form-grid">
              <label class="form-field">
                <span class="form-label">کد ملی</span>
                <input #bmNc type="text" formControlName="nationalCode" placeholder="مثال: 1234567890" class="form-input" (input)="onBranchManagerNationalCodeInput(bmNc.value)" />
                @if (!branchManagerEditMode) {
                  <small class="form-hint">نام کاربری و رمز عبور به‌طور خودکار کد ملی قرار می‌گیرد</small>
                }
              </label>
              <label class="form-field">
                <span class="form-label">نام کاربری *</span>
                <input type="text" formControlName="username" placeholder="مثال: modir.shobeh" class="form-input" [readonly]="!branchManagerEditMode" />
              </label>
              <label class="form-field">
                <span class="form-label">{{ branchManagerEditMode ? 'رمز عبور (خالی = بدون تغییر)' : 'رمز عبور *' }}</span>
                <input type="password" formControlName="password" [placeholder]="branchManagerEditMode ? 'خالی بگذارید = بدون تغییر' : 'حداقل ۶ کاراکتر'" class="form-input" />
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
              <label class="form-field">
                <span class="form-label">شعبه *</span>
                <select formControlName="branchId" class="form-input">
                  <option [value]="0">انتخاب کنید</option>
                  @for (branch of registeredBranches; track branch.id) {
                    <option [value]="branch.id">{{ branch.name }} ({{ branch.province }})</option>
                  }
                </select>
              </label>
              <label class="form-field">
                <span class="form-label">جنسیت شعبه</span>
                <select formControlName="gender" class="form-input">
                  <option value="male">مردانه</option>
                  <option value="female">زنانه</option>
                  <option value="mixed">مختلط</option>
                </select>
              </label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeBranchManagerModal()">انصراف</button>
              @if (branchManagerEditMode && selectedBranchManagerId !== null) {
                <button type="button" class="btn btn-danger" [disabled]="savingBranchManager" (click)="deleteBranchManager(selectedBranchManagerId)">حذف مسئول</button>
              }
              <button type="submit" class="btn" [disabled]="branchManagerForm.invalid || savingBranchManager">
                {{ savingBranchManager ? 'در حال ذخیره...' : branchManagerEditMode ? 'ذخیره تغییرات' : 'ایجاد مسئول' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBranchManagersComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  branchManagers: BranchManager[] = [];
  loadingBranchManagers = false;
  savingBranchManager = false;
  searchBranchManagerQuery = '';
  showBranchManagerModal = false;
  branchManagerEditMode = false;
  selectedBranchManagerId: number | null = null;

  registeredBranches: Branch[] = [];
  loadingRegisteredBranches = false;

  branchManagerForm: FormGroup = this.fb.nonNullable.group({
    nationalCode: [''],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    branchId: [0, [Validators.required]],
    gender: ['mixed'],
  });

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadRegisteredBranches();
  }

  get filteredBranchManagers(): BranchManager[] {
    const q = this.searchBranchManagerQuery.trim().toLowerCase();
    if (!q) return this.branchManagers;
    return this.branchManagers.filter(
      (bm) =>
        bm.firstName.toLowerCase().includes(q) ||
        bm.lastName.toLowerCase().includes(q) ||
        bm.username.toLowerCase().includes(q) ||
        (bm.branchName ?? '').toLowerCase().includes(q),
    );
  }

  loadBranchManagers(): void {
    this.loadingBranchManagers = true;
    this.api
      .getBranchManagers()
      .pipe(finalize(() => (this.loadingBranchManagers = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (managers) => {
          this.branchManagers = managers;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست مسئولین با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  loadRegisteredBranches(): void {
    this.loadingRegisteredBranches = true;
    this.api
      .getBranches()
      .pipe(finalize(() => (this.loadingRegisteredBranches = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (branches) => {
          this.registeredBranches = branches;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست شعب با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  openBranchManagerModal(bm?: BranchManager): void {
    if (bm) {
      this.branchManagerEditMode = true;
      this.selectedBranchManagerId = bm.id;
      this.branchManagerForm.setValue({
        nationalCode: bm.nationalCode ?? '',
        username: bm.username,
        password: '',
        firstName: bm.firstName,
        lastName: bm.lastName,
        email: bm.email,
        phoneNumber: bm.phoneNumber,
        branchId: bm.branchId,
        gender: bm.gender ?? 'mixed',
      });
      this.branchManagerForm.get('password')?.clearValidators();
      this.branchManagerForm.get('password')?.updateValueAndValidity();
    } else {
      this.branchManagerEditMode = false;
      this.selectedBranchManagerId = null;
      this.branchManagerForm.setValue({
        nationalCode: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        branchId: 0,
        gender: 'mixed',
      });
      this.branchManagerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.branchManagerForm.get('password')?.updateValueAndValidity();
    }
    this.showBranchManagerModal = true;
  }

  onBranchManagerNationalCodeInput(value: string): void {
    if (this.branchManagerEditMode) return;
    const code = value.trim();
    this.branchManagerForm.patchValue(
      { username: code, password: code },
      { emitEvent: false },
    );
  }

  closeBranchManagerModal(): void {
    this.showBranchManagerModal = false;
    this.branchManagerEditMode = false;
    this.selectedBranchManagerId = null;
  }

  saveBranchManager(): void {
    if (this.branchManagerForm.invalid) return;
    const raw = this.branchManagerForm.getRawValue();
    const payload: CreateBranchManagerPayload = {
      username: raw.username.trim(),
      password: raw.password.trim(),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      nationalCode: raw.nationalCode.trim(),
      branchId: raw.branchId,
      gender: raw.gender,
    };

    this.savingBranchManager = true;
    const request$ =
      this.branchManagerEditMode && this.selectedBranchManagerId !== null
        ? this.api.updateBranchManager(this.selectedBranchManagerId, payload)
        : this.api.createBranchManager(payload);

    request$
      .pipe(finalize(() => (this.savingBranchManager = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.closeBranchManagerModal();
          this.setSuccess('اطلاعات مسئول شعبه ذخیره شد.');
          this.loadBranchManagers();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره اطلاعات مسئول شعبه با خطا مواجه شد.');
        },
      });
  }

  deleteBranchManager(id: number): void {
    if (this.savingBranchManager) return;
    this.savingBranchManager = true;
    this.api
      .deleteBranchManager(id)
      .pipe(finalize(() => (this.savingBranchManager = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response?.message ?? 'مسئول شعبه با موفقیت حذف شد.');
          this.closeBranchManagerModal();
          this.loadBranchManagers();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف مسئول شعبه با خطا مواجه شد.');
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
