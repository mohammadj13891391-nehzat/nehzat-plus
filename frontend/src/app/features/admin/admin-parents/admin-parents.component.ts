import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Parent, ParentStudentInfo, CreateParentPayload } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-parents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-parents-title">
      <header class="section-header">
        <h2 id="admin-parents-title" class="section-title">مدیریت والدین</h2>
        <button type="button" class="btn btn-secondary" (click)="startCreateParent()">والد جدید</button>
      </header>

      <div class="split-grid">
        <div>
          <input
            type="text"
            [(ngModel)]="searchParentQuery"
            placeholder="جستجوی والدین..."
            class="search-input"
          />
          @if (loadingParents) {
            <p class="muted">در حال دریافت لیست والدین...</p>
          } @else if (filteredParents.length === 0) {
            <p class="muted">والدی یافت نشد.</p>
          } @else {
            <div class="select-list">
              @for (parent of filteredParents; track parent.id) {
                <button
                  type="button"
                  class="list-item"
                  [class.is-selected]="selectedParentId === parent.id"
                  (click)="selectParent(parent.id)"
                >
                  <div class="list-item-top">
                    <strong>{{ parent.firstName }} {{ parent.lastName }}</strong>
                    <span class="status-chip" [class.status-chip--active]="parent.status === 'active'" [class.status-chip--inactive]="parent.status !== 'active'">
                      {{ parent.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </div>
                  <span class="list-meta">{{ parent.phoneNumber }}</span>
                  <small class="list-meta">{{ parent.email }}</small>
                </button>
              }
            </div>
          }
        </div>

        <form [formGroup]="parentForm" class="editor-form" (ngSubmit)="saveParent()">
          <h3>{{ parentEditMode ? 'ویرایش والد' : 'ایجاد والد جدید' }}</h3>
          <label class="form-field">
            <span class="form-label">کد ملی</span>
            <input #parentNc type="text" formControlName="nationalCode" dir="ltr" class="form-input" (input)="onParentNationalCodeInput(parentNc.value)" />
            @if (!parentEditMode) {
              <small class="form-hint">نام کاربری و رمز عبور به‌طور خودکار کد ملی قرار می‌گیرد</small>
            }
          </label>
          <label>نام کاربری <input type="text" formControlName="username" [readonly]="!parentEditMode" /></label>
          <label>رمز عبور <input type="password" formControlName="password" [placeholder]="parentEditMode ? 'برای تغییر رمز وارد کنید' : ''" /></label>
          <label>نام <input type="text" formControlName="firstName" /></label>
          <label>نام خانوادگی <input type="text" formControlName="lastName" /></label>
          <label>ایمیل <input type="email" formControlName="email" /></label>
          <label>شماره تماس <input type="tel" formControlName="phoneNumber" dir="ltr" /></label>
          <label>آدرس <textarea formControlName="address" rows="2"></textarea></label>
          <label>شناسه فرزندان (جدا شده با کاما) <input type="text" formControlName="studentIds" dir="ltr" placeholder="1,2,3" /></label>
          <div class="row-actions">
            <button type="submit" class="btn" [disabled]="parentForm.invalid || savingParent">
              {{ savingParent ? 'در حال ذخیره...' : parentEditMode ? 'ذخیره تغییرات' : 'ایجاد والد' }}
            </button>
            @if (parentEditMode && selectedParentId !== null) {
              <button type="button" class="btn btn-secondary" [disabled]="savingParent" (click)="deleteParent(selectedParentId)">حذف والد</button>
            }
          </div>
        </form>
      </div>

      @if (parentEditMode && selectedParentId !== null) {
        <div class="student-info-section" style="margin-top: 1.5rem; border-top: 1px solid var(--lp-border); padding-top: 1rem">
          <h4>اطلاعات فرزندان</h4>
          @if (loadingParentStudents) {
            <p class="muted">در حال دریافت اطلاعات فرزندان...</p>
          } @else if (parentStudents.length === 0) {
            <p class="muted">این والد فرزندی ثبت‌نام نشده دارد.</p>
          } @else {
            <div class="branch-list">
              @for (student of parentStudents; track student.studentId + student.courseName) {
                <div class="branch-item">
                  <span class="branch-name">{{ student.studentName }}</span>
                  <span class="list-meta">کد: {{ student.studentCode }}</span>
                  <span class="list-meta">دوره: {{ student.courseName }}</span>
                  @if (student.latestGrade !== undefined) {
                    <span class="status-chip status-chip--active">نمره: {{ student.latestGrade }}</span>
                  }
                  @if (student.attendanceRate !== undefined) {
                    <span class="list-meta">حضور: {{ student.attendanceRate }}%</span>
                  }
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
export class AdminParentsComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  parents: Parent[] = [];
  loadingParents = false;
  savingParent = false;
  searchParentQuery = '';
  parentEditMode = false;
  selectedParentId: number | null = null;
  parentStudents: ParentStudentInfo[] = [];
  loadingParentStudents = false;

  parentForm: FormGroup = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    address: [''],
    nationalCode: [''],
    studentIds: [''],
  });

  errorMessage = '';
  successMessage = '';

  get filteredParents(): Parent[] {
    const q = this.searchParentQuery.trim().toLowerCase();
    if (!q) return this.parents;
    return this.parents.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phoneNumber.includes(q),
    );
  }

  loadParents(): void {
    this.loadingParents = true;
    this.api
      .getParents()
      .pipe(finalize(() => (this.loadingParents = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (parents) => {
          this.parents = parents;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست والدین با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  onParentNationalCodeInput(value: string): void {
    if (this.parentEditMode) return;
    const code = value.trim();
    this.parentForm.patchValue(
      { username: code, password: code },
      { emitEvent: false },
    );
  }

  startCreateParent(): void {
    this.parentEditMode = false;
    this.selectedParentId = null;
    this.parentForm.setValue({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      nationalCode: '',
      studentIds: '',
    });
  }

  selectParent(parentId: number): void {
    const parent = this.parents.find((p) => p.id === parentId);
    if (!parent) return;
    this.selectedParentId = parentId;
    this.parentEditMode = true;
    this.parentForm.setValue({
      username: parent.username,
      password: '',
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phoneNumber: parent.phoneNumber,
      address: parent.address ?? '',
      nationalCode: parent.nationalCode ?? '',
      studentIds: parent.studentIds.join(','),
    });
    this.parentForm.get('password')?.clearValidators();
    this.parentForm.get('password')?.updateValueAndValidity();
    this.loadParentStudents(parentId);
  }

  saveParent(): void {
    if (this.parentForm.invalid) return;
    const raw = this.parentForm.getRawValue();
    const studentIds = raw.studentIds
      .split(',')
      .map((s: string) => Number(s.trim()))
      .filter((n: number) => Number.isFinite(n) && n > 0);
    const payload: CreateParentPayload = {
      username: raw.username.trim(),
      password: raw.password.trim(),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      address: raw.address.trim(),
      nationalCode: raw.nationalCode.trim(),
      studentIds,
    };

    this.savingParent = true;
    const request$ =
      this.parentEditMode && this.selectedParentId !== null
        ? this.api.updateParent(this.selectedParentId, payload)
        : this.api.createParent(payload);

    request$
      .pipe(finalize(() => (this.savingParent = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (parent) => {
          this.selectedParentId = parent.id;
          this.parentEditMode = true;
          this.setSuccess('اطلاعات والد ذخیره شد.');
          this.loadParents();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره اطلاعات والد با خطا مواجه شد.');
        },
      });
  }

  deleteParent(parentId: number): void {
    if (this.savingParent) return;
    this.savingParent = true;
    this.api
      .deleteParent(parentId)
      .pipe(finalize(() => (this.savingParent = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response?.message ?? 'والد با موفقیت حذف شد.');
          if (this.selectedParentId === parentId) {
            this.startCreateParent();
            this.parentStudents = [];
          }
          this.loadParents();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف والد با خطا مواجه شد.');
        },
      });
  }

  loadParentStudents(parentId: number): void {
    this.loadingParentStudents = true;
    this.api
      .getParentStudents(parentId)
      .pipe(finalize(() => (this.loadingParentStudents = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.parentStudents = students;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت اطلاعات فرزندان با خطا مواجه شد.');
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
