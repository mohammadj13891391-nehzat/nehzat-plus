import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Course, CreateCoursePayload, ApiMessageResponse } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-courses-title">
      <header class="section-header">
        <h2 id="admin-courses-title" class="section-title">مدیریت دوره‌ها</h2>
        <button type="button" class="btn btn-secondary" (click)="startCreateCourse()">دوره جدید</button>
      </header>

      <div class="split-grid">
        <div>
          <input type="text" [(ngModel)]="searchCourseQuery" placeholder="جستجوی دوره‌ها..." class="search-input" />
          @if (loadingCourses) {
            <p class="muted">در حال دریافت دوره‌ها...</p>
          } @else if (filteredCourses.length === 0) {
            <p class="muted">دوره‌ای یافت نشد.</p>
          } @else {
            <div class="select-list">
              @for (course of filteredCourses; track course.id) {
                <button type="button" class="list-item" [class.is-selected]="selectedCourseId === course.id" (click)="selectCourse(course.id)">
                  <div class="list-item-top">
                    <strong>{{ course.title }}</strong>
                    <span class="status-chip" [class.status-chip--active]="course.status === 'active'" [class.status-chip--inactive]="course.status !== 'active'">
                      {{ course.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </div>
                  <span class="list-meta">{{ course.courseCode }} — {{ course.instructor }}</span>
                </button>
              }
            </div>
          }
        </div>

        <form [formGroup]="courseForm" class="editor-form" (ngSubmit)="saveCourse()">
          <h3>{{ courseEditMode ? 'ویرایش دوره' : 'دوره جدید' }}</h3>

          <label>عنوان <input type="text" formControlName="title" /></label>
          <label>کد دوره <input type="text" formControlName="courseCode" /></label>
          <label>توضیحات <textarea formControlName="description" rows="3"></textarea></label>
          <label>مدرس <input type="text" formControlName="instructor" /></label>
          <label>واحد <input type="number" formControlName="credits" min="0" /></label>
          <label>حداکثر دانشجو <input type="number" formControlName="maxStudents" min="1" /></label>

          <div class="form-row-inline" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem">
            <label>تاریخ شروع <input type="date" formControlName="startDate" /></label>
            <label>تاریخ پایان <input type="date" formControlName="endDate" /></label>
          </div>

          <label>
            وضعیت
            <select formControlName="status">
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="archived">آرشیو</option>
            </select>
          </label>

          <div class="row-actions">
            <button type="submit" class="btn" [disabled]="courseForm.invalid || savingCourse">
              {{ savingCourse ? 'در حال ذخیره...' : courseEditMode ? 'ذخیره تغییرات' : 'ایجاد دوره' }}
            </button>
            @if (courseEditMode && selectedCourseId !== null) {
              <button type="button" class="btn btn-secondary" [disabled]="savingCourse" (click)="deleteCourse(selectedCourseId)">حذف دوره</button>
            }
          </div>
        </form>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCoursesComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  courses: Course[] = [];
  loadingCourses = false;
  savingCourse = false;
  searchCourseQuery = '';
  courseEditMode = false;
  selectedCourseId: number | null = null;

  courseForm: FormGroup = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    courseCode: ['', [Validators.required]],
    description: [''],
    instructor: ['', [Validators.required]],
    credits: [0],
    maxStudents: [30, [Validators.required, Validators.min(1)]],
    startDate: [''],
    endDate: [''],
    status: ['active'],
  });

  errorMessage = '';
  successMessage = '';

  get filteredCourses(): Course[] {
    const q = this.searchCourseQuery.trim().toLowerCase();
    if (!q) return this.courses;
    return this.courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.courseCode.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q),
    );
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.api
      .getCourses()
      .pipe(finalize(() => (this.loadingCourses = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (courses: Course[]) => {
          this.courses = courses;
          this.cdr.markForCheck();
        },
        error: (error: { error: { message: string } }) => {
          this.setError(error?.error?.message ?? 'دریافت دوره‌ها با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  startCreateCourse(): void {
    this.courseEditMode = false;
    this.selectedCourseId = null;
    this.courseForm.reset({
      title: '',
      courseCode: '',
      description: '',
      instructor: '',
      credits: 0,
      maxStudents: 30,
      startDate: '',
      endDate: '',
      status: 'active',
    });
  }

  selectCourse(courseId: number): void {
    const course = this.courses.find((c) => c.id === courseId);
    if (!course) return;
    this.selectedCourseId = courseId;
    this.courseEditMode = true;

    this.courseForm.setValue({
      title: course.title,
      courseCode: course.courseCode,
      description: course.description ?? '',
      instructor: course.instructor,
      credits: course.credits ?? 0,
      maxStudents: course.maxStudents ?? 30,
      startDate: course.startDate ?? '',
      endDate: course.endDate ?? '',
      status: course.status,
    });
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;
    const raw = this.courseForm.getRawValue();
    const payload: CreateCoursePayload = {
      title: raw.title.trim(),
      courseCode: raw.courseCode.trim(),
      description: raw.description.trim() || undefined,
      instructor: raw.instructor.trim(),
      credits: raw.credits || undefined,
      maxStudents: raw.maxStudents,
      startDate: raw.startDate || undefined,
      endDate: raw.endDate || undefined,
      status: raw.status,
    };

    this.savingCourse = true;
    const request$ =
      this.courseEditMode && this.selectedCourseId !== null
        ? this.api.updateCourse(this.selectedCourseId, payload)
        : this.api.createCourse(payload);

    request$
      .pipe(finalize(() => (this.savingCourse = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('دوره ذخیره شد.');
          this.loadCourses();
        },
        error: (error: { error: { message: string } }) => {
          this.setError(error?.error?.message ?? 'ذخیره دوره با خطا مواجه شد.');
        },
      });
  }

  deleteCourse(courseId: number): void {
    if (this.savingCourse) return;
    this.savingCourse = true;
    this.api
      .deleteCourse(courseId)
      .pipe(finalize(() => (this.savingCourse = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ApiMessageResponse) => {
          this.setSuccess(response?.message ?? 'دوره حذف شد.');
          if (this.selectedCourseId === courseId) this.startCreateCourse();
          this.loadCourses();
        },
        error: (error: { error: { message: string } }) => {
          this.setError(error?.error?.message ?? 'حذف دوره با خطا مواجه شد.');
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
