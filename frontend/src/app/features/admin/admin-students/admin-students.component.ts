import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Student, CreateStudentPayload } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-students-title">
      <header class="section-header">
        <h2 id="admin-students-title" class="section-title">
          مدیریت متربیان
          <span class="count-badge">{{ students.length }}</span>
        </h2>
        <button type="button" class="btn" (click)="openStudentModal()">متربی جدید</button>
      </header>

      <div class="trainee-search">
        <input
          type="text"
          [(ngModel)]="searchStudentQuery"
          placeholder="جستجوی متربی (نام، نام کاربری، کد، ایمیل)..."
          class="search-input"
        />
      </div>

      @if (loadingStudents) {
        <p class="muted">در حال دریافت لیست متربیان...</p>
      } @else if (students.length === 0) {
        <p class="muted">هیچ متربی ثبت نشده است.</p>
      } @else {
        <div class="table-responsive">
          <table class="data-table coach-table">
            <thead>
              <tr>
                <th>نام و نام خانوادگی</th>
                <th>نام کاربری</th>
                <th>ایمیل</th>
                <th>موبایل</th>
                <th>کد متربی</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              @for (student of filteredStudents; track student.id) {
                <tr>
                  <td class="coach-name-cell">
                    <strong>{{ student.firstName }} {{ student.lastName }}</strong>
                  </td>
                  <td>{{ student.username }}</td>
                  <td>{{ student.email }}</td>
                  <td>{{ student.phoneNumber }}</td>
                  <td>{{ student.studentId }}</td>
                  <td>
                    <span class="status-chip" [class.status-chip--active]="student.status === 'active'" [class.status-chip--inactive]="student.status !== 'active'">
                      {{ student.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button type="button" class="icon-btn icon-btn--edit" (click)="openStudentModal(student)" title="ویرایش">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button type="button" class="icon-btn icon-btn--delete" (click)="deleteStudent(student.id)" title="حذف">
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

    @if (showStudentModal) {
      <div class="modal-overlay" (click)="closeStudentModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ studentEditMode ? 'ویرایش متربی' : 'متربی جدید' }}</h3>
            <button type="button" class="modal-close" (click)="closeStudentModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="studentForm" class="modal-body" (ngSubmit)="saveStudent()">
            <div class="form-grid">
              <label class="form-field">
                <span class="form-label">کد ملی</span>
                <input #studentNc type="text" formControlName="nationalCode" placeholder="مثال: 1234567890" class="form-input" (input)="onStudentNationalCodeInput(studentNc.value)" />
                @if (!studentEditMode) {
                  <small class="form-hint">نام کاربری و رمز عبور به‌طور خودکار کد ملی قرار می‌گیرد</small>
                }
              </label>
              <label class="form-field">
                <span class="form-label">نام کاربری *</span>
                <input type="text" formControlName="username" placeholder="مثال: ali.ahmadi" class="form-input" [readonly]="!studentEditMode" />
              </label>
              <label class="form-field">
                <span class="form-label">{{ studentEditMode ? 'رمز عبور (خالی = بدون تغییر)' : 'رمز عبور *' }}</span>
                <input type="password" formControlName="password" [placeholder]="studentEditMode ? 'خالی بگذارید = بدون تغییر' : 'حداقل ۶ کاراکتر'" class="form-input" />
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
                <span class="form-label">کد متربی</span>
                <input type="text" formControlName="studentId" placeholder="مثال: S-1001" class="form-input" />
              </label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeStudentModal()">انصراف</button>
              @if (studentEditMode && selectedStudentId !== null) {
                <button type="button" class="btn btn-danger" [disabled]="savingStudent" (click)="deleteStudent(selectedStudentId)">حذف متربی</button>
              }
              <button type="submit" class="btn" [disabled]="studentForm.invalid || savingStudent">
                {{ savingStudent ? 'در حال ذخیره...' : studentEditMode ? 'ذخیره تغییرات' : 'ایجاد متربی' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminStudentsComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  students: Student[] = [];
  loadingStudents = false;
  savingStudent = false;
  showStudentModal = false;
  studentEditMode = false;
  selectedStudentId: number | null = null;
  searchStudentQuery = '';

  studentForm: FormGroup = this.fb.nonNullable.group({
    nationalCode: [''],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    studentId: [''],
  });

  errorMessage = '';
  successMessage = '';

  get filteredStudents(): Student[] {
    const q = this.searchStudentQuery.trim().toLowerCase();
    if (!q) return this.students;
    return this.students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }

  loadStudents(): void {
    this.loadingStudents = true;
    this.api
      .getStudents()
      .pipe(finalize(() => (this.loadingStudents = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.students = students;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست متربیان با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  openStudentModal(student?: Student): void {
    if (student) {
      this.studentEditMode = true;
      this.selectedStudentId = student.id;
      this.studentForm.reset({
        nationalCode: '',
        username: student.username,
        password: '',
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        studentId: student.studentId,
      });
      this.studentForm.get('password')?.clearValidators();
      this.studentForm.get('password')?.updateValueAndValidity();
    } else {
      this.studentEditMode = false;
      this.selectedStudentId = null;
      this.studentForm.reset({
        nationalCode: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        studentId: '',
      });
      this.studentForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.studentForm.get('password')?.updateValueAndValidity();
    }
    this.showStudentModal = true;
  }

  onStudentNationalCodeInput(value: string): void {
    if (this.studentEditMode) return;
    const code = value.trim();
    this.studentForm.patchValue(
      { username: code, password: code },
      { emitEvent: false },
    );
  }

  closeStudentModal(): void {
    this.showStudentModal = false;
    this.studentEditMode = false;
    this.selectedStudentId = null;
  }

  saveStudent(): void {
    if (this.studentForm.invalid) return;
    const raw = this.studentForm.getRawValue();
    const payload: CreateStudentPayload = {
      username: raw.username.trim(),
      password: raw.password.trim(),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      studentId: raw.studentId.trim() || undefined,
      nationalCode: raw.nationalCode.trim() || undefined,
    };

    const isEdit = this.studentEditMode && this.selectedStudentId !== null;
    const studentId = this.selectedStudentId;
    this.closeStudentModal();
    this.savingStudent = true;
    const request$ = isEdit
      ? this.api.updateStudent(studentId!, payload)
      : this.api.createStudent(payload);

    request$
      .pipe(finalize(() => (this.savingStudent = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          if (isEdit) {
            const idx = this.students.findIndex((s) => s.id === student.id);
            if (idx >= 0) {
              this.students[idx] = student;
            } else {
              this.students.push(student);
            }
          } else {
            this.students.push(student);
          }
          this.selectedStudentId = student.id;
          this.studentEditMode = true;
          this.setSuccess('اطلاعات متربی ذخیره شد.');
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره اطلاعات متربی با خطا مواجه شد.');
        },
      });
  }

  deleteStudent(studentId: number): void {
    if (this.savingStudent) return;
    this.savingStudent = true;
    this.api
      .deleteStudent(studentId)
      .pipe(finalize(() => (this.savingStudent = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response?.message ?? 'متربی با موفقیت حذف شد.');
          this.closeStudentModal();
          this.loadStudents();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف متربی با خطا مواجه شد.');
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
