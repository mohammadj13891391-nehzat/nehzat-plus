import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import {
  Ring, RingStudent, RingBook, RingTeachingMethod, CreateRingPayload,
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-rings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-rings-title">
      <header class="section-header">
        <h2 id="admin-rings-title" class="section-title">مدیریت حلقه‌ها</h2>
      </header>

      @if (errorMessage) {
        <p class="lp-error" role="alert">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p class="lp-success" role="status">{{ successMessage }}</p>
      }

      <div class="split-grid">
        <!-- LEFT: Rings list -->
        <div>
          <input type="text" [(ngModel)]="searchQuery" placeholder="جستجوی حلقه..." class="search-input" />
          <button type="button" class="btn btn-secondary" (click)="startCreateRing()" style="margin-bottom: 0.5rem">افزودن حلقه جدید</button>
          @if (loadingRings) {
            <p class="muted">در حال دریافت حلقه‌ها...</p>
          } @else if (filteredRings.length === 0) {
            <p class="muted">حلقه‌ای یافت نشد.</p>
          } @else {
            <div class="select-list">
              @for (ring of filteredRings; track ring.id) {
                <button type="button" class="list-item" [class.is-selected]="selectedRingId === ring.id" (click)="selectRing(ring)">
                  <div class="list-item-top">
                    <strong>{{ ring.name }}</strong>
                    <span class="status-chip" [class.status-chip--active]="ring.status === 'active'" [class.status-chip--inactive]="ring.status !== 'active'">
                      {{ ring.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </div>
                  <span class="list-meta">{{ ring.key }}</span>
                </button>
              }
            </div>
            @if (selectedRingId !== null) {
              <button type="button" class="btn btn-danger" style="margin-top: 0.5rem" (click)="deleteRing(selectedRingId)" [disabled]="savingRing">
                حذف حلقه
              </button>
            }
          }
        </div>

        <!-- RIGHT: Ring detail -->
        <div>
          @if (selectedRingId === null) {
            <p class="muted">یک حلقه را انتخاب کنید</p>
          } @else {
            <div class="tabs" style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 2px solid var(--lp-border); padding-bottom: 0.25rem">
              <button type="button" class="tab-btn" [class.active]="detailTab === 'info'" (click)="detailTab = 'info'">اطلاعات حلقه</button>
              <button type="button" class="tab-btn" [class.active]="detailTab === 'students'" (click)="detailTab = 'students'; loadRingStudents()">دانش‌آموزان</button>
              <button type="button" class="tab-btn" [class.active]="detailTab === 'books-methods'" (click)="detailTab = 'books-methods'">کتاب‌ها و روش‌ها</button>
            </div>

            <!-- INFO TAB -->
            @if (detailTab === 'info') {
              <form [formGroup]="ringForm" class="editor-form" (ngSubmit)="saveRing()">
                <label>کلید یکتا <input type="text" formControlName="key" /></label>
                <label>نام <input type="text" formControlName="name" /></label>
                <label>توضیحات <textarea formControlName="description" rows="2"></textarea></label>
                <label>شناسه مکتب <input type="number" formControlName="madrasahId" min="1" /></label>
                <label>شناسه مربی <input type="number" formControlName="coachId" min="1" /></label>
                <label>شناسه دوره <input type="number" formControlName="courseId" min="1" /></label>
                <label>
                  وضعیت
                  <select formControlName="status">
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                  </select>
                </label>
                <label>
                  جنسیت
                  <select formControlName="gender">
                    <option value="">— بدون محدودیت —</option>
                    <option value="boys">پسرانه</option>
                    <option value="girls">دخترانه</option>
                  </select>
                </label>
                <div class="row-actions">
                  <button type="submit" class="btn" [disabled]="ringForm.invalid || savingRing">
                    {{ savingRing ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
                  </button>
                </div>
              </form>
            }

            <!-- STUDENTS TAB -->
            @if (detailTab === 'students') {
              <div>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem">
                  <input type="number" [(ngModel)]="newStudentId" placeholder="شناسه دانش‌آموز" class="search-input" style="max-width: 150px" />
                  <button type="button" class="btn btn-secondary" [disabled]="!newStudentId || savingRingStudent" (click)="addStudent()">
                    {{ savingRingStudent ? '...' : 'افزودن دانش‌آموز' }}
                  </button>
                </div>

                @if (loadingRingStudents) {
                  <p class="muted">در حال دریافت...</p>
                } @else if (ringStudents.length === 0) {
                  <p class="muted">دانش‌آموزی در این حلقه ثبت نشده است.</p>
                } @else {
                  <div class="branch-list">
                    @for (rs of ringStudents; track rs.id) {
                      <div class="branch-item">
                        <span class="branch-name">دانش‌آموز #{{ rs.studentId }}</span>
                        <span class="list-meta">{{ rs.status === 'active' ? 'فعال' : 'غیرفعال' }}</span>
                        <span class="list-meta" style="font-size: 0.75rem">{{ rs.joinedAt | slice:0:10 }}</span>
                        <button type="button" class="btn-remove" (click)="removeStudent(rs.studentId)" title="حذف دانش‌آموز">✕</button>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- BOOKS & METHODS TAB -->
            @if (detailTab === 'books-methods') {
              <div>
                <h4 style="margin: 0.5rem 0">کتاب‌ها</h4>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem">
                  <input type="number" [(ngModel)]="newBookId" placeholder="شناسه کتاب" class="search-input" style="max-width: 150px" />
                  <button type="button" class="btn btn-secondary" [disabled]="!newBookId || savingRingBook" (click)="addBook()">
                    {{ savingRingBook ? '...' : 'افزودن کتاب' }}
                  </button>
                </div>
                @if (ringBooks.length === 0) {
                  <p class="muted">کتابی به این حلقه اضافه نشده است.</p>
                } @else {
                  <div class="branch-list" style="margin-bottom: 1rem">
                    @for (rb of ringBooks; track rb.id) {
                      <div class="branch-item">
                        <span class="branch-name">کتاب #{{ rb.bookId }}</span>
                        <button type="button" class="btn-remove" (click)="removeBook(rb.bookId)" title="حذف کتاب">✕</button>
                      </div>
                    }
                  </div>
                }

                <h4 style="margin: 0.5rem 0">روش‌های تدریس</h4>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem">
                  <input type="number" [(ngModel)]="newMethodId" placeholder="شناسه روش تدریس" class="search-input" style="max-width: 150px" />
                  <button type="button" class="btn btn-secondary" [disabled]="!newMethodId || savingRingMethod" (click)="addMethod()">
                    {{ savingRingMethod ? '...' : 'افزودن روش تدریس' }}
                  </button>
                </div>
                @if (ringTeachingMethods.length === 0) {
                  <p class="muted">روش تدریسی به این حلقه اضافه نشده است.</p>
                } @else {
                  <div class="branch-list">
                    @for (rtm of ringTeachingMethods; track rtm.id) {
                      <div class="branch-item">
                        <span class="branch-name">روش تدریس #{{ rtm.teachingMethodId }}</span>
                        <button type="button" class="btn-remove" (click)="removeMethod(rtm.teachingMethodId)" title="حذف روش تدریس">✕</button>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRingsComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  rings: Ring[] = [];
  loadingRings = false;
  savingRing = false;
  searchQuery = '';
  selectedRingId: number | null = null;
  ringEditMode = false;
  detailTab: 'info' | 'students' | 'books-methods' = 'info';

  ringForm = this.fb.nonNullable.group({
    key: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    madrasahId: [0, Validators.required],
    coachId: [0],
    courseId: [0],
    status: ['active'],
    gender: [''],
  });

  // Student management
  ringStudents: RingStudent[] = [];
  loadingRingStudents = false;
  savingRingStudent = false;
  newStudentId: number | null = null;

  // Book management
  ringBooks: RingBook[] = [];
  savingRingBook = false;
  newBookId: number | null = null;

  // Teaching method management
  ringTeachingMethods: RingTeachingMethod[] = [];
  savingRingMethod = false;
  newMethodId: number | null = null;

  errorMessage = '';
  successMessage = '';

  get filteredRings(): Ring[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.rings;
    return this.rings.filter((r) => r.name.toLowerCase().includes(q) || r.key.toLowerCase().includes(q));
  }

  loadRings(): void {
    this.loadingRings = true;
    this.api.getRings().pipe(finalize(() => (this.loadingRings = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.rings = items; this.cdr.markForCheck(); },
      error: () => { this.setError('دریافت حلقه‌ها با خطا مواجه شد.'); this.cdr.markForCheck(); },
    });
  }

  startCreateRing(): void {
    this.ringEditMode = false;
    this.selectedRingId = null;
    this.detailTab = 'info';
    this.ringForm.reset({ key: '', name: '', description: '', madrasahId: 0, coachId: 0, courseId: 0, status: 'active', gender: '' });
  }

  selectRing(ring: Ring): void {
    this.selectedRingId = ring.id;
    this.ringEditMode = true;
    this.detailTab = 'info';
    this.ringForm.setValue({
      key: ring.key, name: ring.name, description: ring.description ?? '',
      madrasahId: ring.madrasahId, coachId: ring.coachId ?? 0,
      courseId: ring.courseId ?? 0, status: ring.status, gender: ring.gender ?? '',
    });
    this.loadRingStudents();
    this.refreshRingBooks();
    this.refreshRingMethods();
  }

  saveRing(): void {
    if (this.ringForm.invalid) return;
    const raw = this.ringForm.getRawValue() as unknown as CreateRingPayload;
    this.savingRing = true;
    const request$ = this.ringEditMode && this.selectedRingId !== null
      ? this.api.updateRing(this.selectedRingId, raw)
      : this.api.createRing(raw);
    request$.pipe(finalize(() => (this.savingRing = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('حلقه ذخیره شد.'); this.loadRings(); },
      error: () => { this.setError('ذخیره حلقه با خطا مواجه شد.'); },
    });
  }

  deleteRing(id: number): void {
    if (this.savingRing) return;
    if (!confirm('آیا از حذف این حلقه اطمینان دارید؟')) return;
    this.savingRing = true;
    this.api.deleteRing(id).pipe(finalize(() => (this.savingRing = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.setSuccess('حلقه حذف شد.');
        if (this.selectedRingId === id) {
          this.selectedRingId = null;
          this.ringStudents = [];
          this.ringBooks = [];
          this.ringTeachingMethods = [];
        }
        this.loadRings();
      },
      error: () => { this.setError('حذف حلقه با خطا مواجه شد.'); },
    });
  }

  /* ─── Students ─── */

  loadRingStudents(): void {
    if (this.selectedRingId === null) return;
    this.loadingRingStudents = true;
    this.api.getRingStudents(this.selectedRingId).pipe(finalize(() => (this.loadingRingStudents = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.ringStudents = items; this.cdr.markForCheck(); },
      error: () => { this.setError('دریافت دانش‌آموزان با خطا مواجه شد.'); this.cdr.markForCheck(); },
    });
  }

  addStudent(): void {
    if (this.selectedRingId === null || !this.newStudentId) return;
    this.savingRingStudent = true;
    this.api.addRingStudent(this.selectedRingId, { ringId: this.selectedRingId, studentId: this.newStudentId })
      .pipe(finalize(() => (this.savingRingStudent = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.setSuccess('دانش‌آموز اضافه شد.'); this.newStudentId = null; this.loadRingStudents(); },
        error: () => { this.setError('افزودن دانش‌آموز با خطا مواجه شد.'); },
      });
  }

  removeStudent(studentId: number): void {
    if (this.selectedRingId === null || this.savingRingStudent) return;
    this.savingRingStudent = true;
    this.api.removeRingStudent(this.selectedRingId, studentId)
      .pipe(finalize(() => (this.savingRingStudent = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.setSuccess('دانش‌آموز حذف شد.'); this.loadRingStudents(); },
        error: () => { this.setError('حذف دانش‌آموز با خطا مواجه شد.'); },
      });
  }

  /* ─── Books ─── */

  loadRingBooks(): void {
    if (this.selectedRingId === null) return;
    this.api.getRingStudents(this.selectedRingId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.cdr.markForCheck(); },
      error: () => {},
    });
  }

  addBook(): void {
    if (this.selectedRingId === null || !this.newBookId) return;
    this.savingRingBook = true;
    this.api.addRingBook(this.selectedRingId, { ringId: this.selectedRingId, bookId: this.newBookId })
      .pipe(finalize(() => (this.savingRingBook = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.setSuccess('کتاب اضافه شد.'); this.newBookId = null; this.refreshRingBooks(); },
        error: () => { this.setError('افزودن کتاب با خطا مواجه شد.'); },
      });
  }

  removeBook(bookId: number): void {
    if (this.selectedRingId === null || this.savingRingBook) return;
    this.savingRingBook = true;
    this.api.removeRingBook(this.selectedRingId, bookId)
      .pipe(finalize(() => (this.savingRingBook = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.setSuccess('کتاب حذف شد.'); this.refreshRingBooks(); },
        error: () => { this.setError('حذف کتاب با خطا مواجه شد.'); },
      });
  }

  private refreshRingBooks(): void {
    if (this.selectedRingId === null) return;
    this.api.getRings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (rings) => {
        const ring = rings.find((r) => r.id === this.selectedRingId);
        if (ring) this.ringBooks = ring.ringBooks ?? [];
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  /* ─── Teaching Methods ─── */

  addMethod(): void {
    if (this.selectedRingId === null || !this.newMethodId) return;
    this.savingRingMethod = true;
    this.api.addRingTeachingMethod(this.selectedRingId, { ringId: this.selectedRingId, teachingMethodId: this.newMethodId })
      .pipe(finalize(() => (this.savingRingMethod = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.setSuccess('روش تدریس اضافه شد.'); this.newMethodId = null; this.refreshRingMethods(); },
        error: () => { this.setError('افزودن روش تدریس با خطا مواجه شد.'); },
      });
  }

  removeMethod(teachingMethodId: number): void {
    if (this.selectedRingId === null || this.savingRingMethod) return;
    this.savingRingMethod = true;
    this.api.removeRingTeachingMethod(this.selectedRingId, teachingMethodId)
      .pipe(finalize(() => (this.savingRingMethod = false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.setSuccess('روش تدریس حذف شد.'); this.refreshRingMethods(); },
        error: () => { this.setError('حذف روش تدریس با خطا مواجه شد.'); },
      });
  }

  private refreshRingMethods(): void {
    if (this.selectedRingId === null) return;
    this.api.getRings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (rings) => {
        const ring = rings.find((r) => r.id === this.selectedRingId);
        if (ring) this.ringTeachingMethods = ring.ringTeachingMethods ?? [];
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  /* ─── Shared ─── */

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
}
