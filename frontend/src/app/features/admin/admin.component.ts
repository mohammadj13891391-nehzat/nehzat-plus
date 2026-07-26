import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import type {
  Assignment,
  AssignmentAttachment,
  AssignmentStatus,
  AssignmentType,
  AttachmentKind,
  Branch,
  Course,
  CourseEnrollment,
  CourseInviteCode,
  CourseStatus,
  CreateMadrasahPayload,
  Madrasah,
  MaktabBranch,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { PersianDateInputComponent } from '../shared/persian-date-input/persian-date-input.component';

import { AdminStudentsComponent } from './admin-students/admin-students.component';
import { AdminCoachesComponent } from './admin-coaches/admin-coaches.component';
import { AdminBranchManagersComponent } from './admin-branch-managers/admin-branch-managers.component';
import { AdminParentsComponent } from './admin-parents/admin-parents.component';
import { AdminEvaluatorsComponent } from './admin-evaluators/admin-evaluators.component';
import { AdminHeadquartersComponent } from './admin-headquarters/admin-headquarters.component';
import { AdminMakatibComponent } from './admin-makatib/admin-makatib.component';
import { AdminCurriculumComponent } from './admin-curriculum/admin-curriculum.component';
import { AdminRingsComponent } from './admin-rings/admin-rings.component';
import { AdminSurveysComponent } from './admin-surveys/admin-surveys.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PersianDateInputComponent,
    AdminStudentsComponent,
    AdminCoachesComponent,
    AdminBranchManagersComponent,
    AdminParentsComponent,
    AdminEvaluatorsComponent,
    AdminHeadquartersComponent,
    AdminMakatibComponent,
    AdminCurriculumComponent,
    AdminRingsComponent,
    AdminSurveysComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly api = inject(LESSON_PLANNER_API);
  readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  username = '';
  errorMessage = '';
  successMessage = '';
  activeMenu: string = 'makatib';
  expandedMenus = new Set<string>(['makatib']);
  menuItems = [
    { key: 'trainees', label: 'متربیان', roles: ['manager', 'headquarters'] },
    { key: 'teachers', label: 'مربیان', roles: ['manager', 'headquarters'] },
    { key: 'courses', label: 'دوره‌ها', roles: ['manager', 'headquarters'] },
    { key: 'branch-managers', label: 'مسئولین شعب', roles: ['manager', 'headquarters'] },
    { key: 'makatib', label: 'مکاتب تربیتی، آموزشی، مهارتی', roles: ['manager', 'headquarters'] },
    { key: 'curriculum', label: 'برنامه درسی', roles: ['manager', 'headquarters'] },
    { key: 'rings', label: 'حلقه‌ها', roles: ['manager', 'headquarters'] },
    { key: 'parents', label: 'والدین', roles: ['manager', 'headquarters'] },
    { key: 'evaluators', label: 'ارزیاب', roles: ['manager', 'headquarters'] },
    { key: 'headquarters', label: 'ستاد', roles: ['manager', 'headquarters'] },
    { key: 'spiritual', label: 'مسیر معنوی', roles: ['manager', 'headquarters'] },
    { key: 'surveys', label: 'نظرسنجی‌ها', roles: ['manager', 'headquarters'] },
  ] as const;

  registeredBranches: Branch[] = [];

  get visibleMenuItems() {
    const currentUser = this.authService.getCurrentUser();
    const userType = currentUser?.userType ?? 'trainee';
    return this.menuItems.filter((item) => (item.roles as readonly string[]).includes(userType));
  }

  get isBranchManager(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.userType === 'branch_manager';
  }

  get currentUserBranchId(): number | undefined {
    return this.authService.getCurrentUser()?.branchId;
  }

  stats = {
    pendingUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    totalAttachments: 0,
    activeCourses: 0,
  };

  /* ──────────────────────────────────────
   * Courses / Assignments / Attachments
   * (kept inline — not yet extracted)
   * ────────────────────────────────────── */

  courseFilterForm = this.fb.nonNullable.group({
    query: [''],
    status: [''],
  });
  courseForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    courseCode: ['', [Validators.required]],
    description: [''],
    instructor: ['', [Validators.required]],
    status: ['active'],
    startDate: [this.todayIsoDate(), [Validators.required]],
    endDate: [this.todayIsoDate(), [Validators.required]],
    credits: [2, [Validators.required, Validators.min(1)]],
    maxStudents: [30, [Validators.required, Validators.min(1)]],
  });
  courses: Course[] = [];
  selectedCourseId: number | null = null;
  loadingCourses = false;
  savingCourse = false;
  courseMode: 'create' | 'edit' = 'create';

  assignmentForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    assignmentDate: [this.todayIsoDate(), [Validators.required]],
    type: ['daily'],
    status: ['published'],
    maxScore: [20, [Validators.required, Validators.min(0)]],
    instructions: [''],
  });
  dailySeriesForm = this.fb.nonNullable.group({
    startDate: [this.todayIsoDate(), [Validators.required]],
    days: [3, [Validators.required, Validators.min(1)]],
    titlePrefix: ['تکلیف روز'],
    descriptionPrefix: [''],
    type: ['daily'],
    maxScore: [20, [Validators.required, Validators.min(0)]],
    instructions: [''],
  });
  assignments: Assignment[] = [];
  selectedAssignmentId: number | null = null;
  assignmentMode: 'create' | 'edit' = 'create';
  loadingAssignments = false;
  savingAssignment = false;
  creatingDailySeries = false;

  attachmentCreateForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    kind: ['document'],
    displayOrder: [1, [Validators.required, Validators.min(1)]],
  });
  attachments: AssignmentAttachment[] = [];
  attachmentMetaForms: Record<number, FormGroup> = {};
  attachmentReplacementFiles: Record<number, File | null> = {};
  createAttachmentFile: File | null = null;
  loadingAttachments = false;
  creatingAttachment = false;
  updatingAttachmentIds = new Set<number>();

  courseEnrollments: CourseEnrollment[] = [];
  loadingEnrollments = false;
  enrollStudentId = 0;
  enrollingStudent = false;
  courseInviteCode: CourseInviteCode | null = null;
  generatingInviteCode = false;

  /* ──────────────────────────────────────
   * Madrasah sidebar (loaded from API)
   * ────────────────────────────────────── */

  madrasahs: Madrasah[] = [];

  get makatibGirls(): Madrasah[] {
    return this.madrasahs.filter((m) => m.gender === 'girls');
  }

  get makatibBoys(): Madrasah[] {
    return this.madrasahs.filter((m) => m.gender === 'boys');
  }

  get allMakatib(): Madrasah[] {
    return this.madrasahs;
  }

  readonly provinces = [
    'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
    'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
    'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
    'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
    'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
  ];

  constructor() {
    this.username = this.authService.getCurrentUser()?.username ?? 'admin';
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (
      user?.userType !== 'manager' &&
      user?.userType !== 'headquarters' &&
      user?.userType !== 'branch_manager'
    ) {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(user?.userType ?? 'trainee'),
      );
      return;
    }

    this.loadBranchesList();
    this.loadMadrasahsForSidebar();

    if (this.isBranchManager) {
      this.activeMenu = 'trainees';
    }

    this.loadStatistics();
  }

  /* ──────────────────────────────────────
   * Sidebar helpers
   * ────────────────────────────────────── */

  toggleExpand(key: string): void {
    if (this.expandedMenus.has(key)) {
      this.expandedMenus.delete(key);
    } else {
      this.expandedMenus.add(key);
    }
  }

  onMadrasahSidebarClick(madrasah: Madrasah): void {
    this.activeMenu = madrasah.key;
    if (madrasah.gender === 'girls') {
      this.expandedMenus.add('makatib-girls');
    } else {
      this.expandedMenus.add('makatib-boys');
    }
  }

  /** Load madrasahs for the sidebar navigation tree. */
  loadMadrasahsForSidebar(): void {
    this.api
      .getMadrasahs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (madrasahs) => {
          this.madrasahs = madrasahs;
          this.cdr.markForCheck();
        },
        error: () => {},
      });
  }

  /** Load branches for the sidebar branch-manager form (kept in shell for now). */
  loadBranchesList(): void {
    this.api
      .getBranches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (branches) => {
          this.registeredBranches = branches;
          this.cdr.markForCheck();
        },
        error: () => {},
      });
  }

  /* ──────────────────────────────────────
   * Courses
   * ────────────────────────────────────── */

  get selectedCourseTitle(): string {
    if (this.selectedCourseId === null) return 'انتخاب نشده';
    return (
      this.courses.find((item) => item.id === this.selectedCourseId)?.title ??
      `#${this.selectedCourseId}`
    );
  }

  get selectedAssignmentTitle(): string {
    if (this.selectedAssignmentId === null) return 'انتخاب نشده';
    return (
      this.assignments.find((item) => item.id === this.selectedAssignmentId)?.title ??
      `#${this.selectedAssignmentId}`
    );
  }

  get courseStatLabels(): Record<string, string> {
    const course = this.courses.find((c) => c.id === this.selectedCourseId);
    if (!course) return {};
    return {
      وضعیت: course.status === 'active' ? 'فعال' : course.status === 'inactive' ? 'غیرفعال' : 'آرشیو',
      مدرس: course.instructor,
      کد: course.courseCode,
      تکالیف: String(this.assignments.length),
      متربیان: String(this.courseEnrollments.length),
      ظرفیت: `${this.courseEnrollments.length} / ${course.maxStudents ?? '—'}`,
    };
  }

  applyCourseFilters(): void {
    this.loadCourses();
  }

  resetCourseFilters(): void {
    this.courseFilterForm.setValue({ query: '', status: '' });
    this.loadCourses();
  }

  startCreateCourse(): void {
    this.courseMode = 'create';
    this.courseForm.setValue({
      title: '',
      courseCode: '',
      description: '',
      instructor: '',
      status: 'active',
      startDate: this.todayIsoDate(),
      endDate: this.todayIsoDate(),
      credits: 2,
      maxStudents: 30,
    });
  }

  selectCourse(courseId: number): void {
    this.selectedCourseId = courseId;
    const course = this.courses.find((item) => item.id === courseId);
    if (course) {
      this.courseMode = 'edit';
      this.courseForm.setValue({
        title: course.title ?? '',
        courseCode: course.courseCode ?? '',
        description: course.description ?? '',
        instructor: course.instructor ?? '',
        status: this.normalizeCourseStatus(course.status),
        startDate: course.startDate ?? this.todayIsoDate(),
        endDate: course.endDate ?? this.todayIsoDate(),
        credits: Number(course.credits ?? 2),
        maxStudents: Number(course.maxStudents ?? 30),
      });
    }
    this.startCreateAssignment();
    this.loadAssignments(courseId);
    this.loadCourseEnrollments();
    this.courseInviteCode = null;
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;
    const raw = this.courseForm.getRawValue();
    const payload = {
      title: raw.title.trim(),
      courseCode: raw.courseCode.trim(),
      description: raw.description.trim(),
      instructor: raw.instructor.trim(),
      status: raw.status as CourseStatus,
      startDate: raw.startDate,
      endDate: raw.endDate,
      credits: Number(raw.credits),
      maxStudents: Number(raw.maxStudents),
    };

    this.savingCourse = true;
    const request$ =
      this.courseMode === 'edit' && this.selectedCourseId !== null
        ? this.api.updateAdminCourse(this.selectedCourseId, payload)
        : this.api.createAdminCourse(payload);

    request$
      .pipe(finalize(() => (this.savingCourse = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (course) => {
          this.selectedCourseId = course.id;
          this.courseMode = 'edit';
          this.setSuccess('دوره با موفقیت ذخیره شد.');
          this.loadCourses();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره دوره با خطا مواجه شد.');
        },
      });
  }

  deleteSelectedCourse(): void {
    if (this.selectedCourseId === null || this.savingCourse) return;
    this.savingCourse = true;
    this.api
      .deleteAdminCourse(this.selectedCourseId)
      .pipe(finalize(() => (this.savingCourse = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.selectedCourseId = null;
          this.startCreateCourse();
          this.loadCourses();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف دوره با خطا مواجه شد.');
        },
      });
  }

  courseStatusLabel(status: CourseStatus | undefined): string {
    const n = this.normalizeCourseStatus(status);
    return n === 'inactive' ? 'غیرفعال' : n === 'archived' ? 'آرشیو' : 'فعال';
  }

  courseStatusClass(status: CourseStatus | undefined): string {
    return `status-chip--${this.normalizeCourseStatus(status)}`;
  }

  toggleCourseStatus(course: Course): void {
    if (this.savingCourse) return;
    this.savingCourse = true;
    const newStatus: CourseStatus = course.status === 'active' ? 'inactive' : 'active';
    this.api
      .updateAdminCourse(course.id, { status: newStatus })
      .pipe(finalize(() => (this.savingCourse = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          course.status = newStatus;
          this.stats.activeCourses += newStatus === 'active' ? 1 : -1;
          this.setSuccess(`وضعیت دوره "${course.title}" به ${newStatus === 'active' ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'تغییر وضعیت دوره با خطا مواجه شد.');
        },
      });
  }

  /* ──────────────────────────────────────
   * Course Enrollments
   * ────────────────────────────────────── */

  loadCourseEnrollments(): void {
    if (this.selectedCourseId === null) return;
    this.loadingEnrollments = true;
    this.courseEnrollments = [];
    this.api
      .getCourseEnrollments(this.selectedCourseId)
      .pipe(finalize(() => (this.loadingEnrollments = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (enrollments) => {
          this.courseEnrollments = enrollments;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست متربیان دوره با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  enrollStudentInCourse(): void {
    if (this.selectedCourseId === null || !this.enrollStudentId) return;
    this.enrollingStudent = true;
    this.api
      .enrollStudentInCourse(this.selectedCourseId, this.enrollStudentId)
      .pipe(finalize(() => (this.enrollingStudent = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.enrollStudentId = 0;
          this.loadCourseEnrollments();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ثبت‌نام متربی با خطا مواجه شد.');
        },
      });
  }

  unenrollStudent(studentId: number): void {
    if (this.selectedCourseId === null) return;
    this.api
      .unenrollStudentFromCourse(this.selectedCourseId, studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.loadCourseEnrollments();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف متربی از دوره با خطا مواجه شد.');
        },
      });
  }

  generateInviteCode(): void {
    if (this.selectedCourseId === null) return;
    this.generatingInviteCode = true;
    this.api
      .generateCourseInviteCode(this.selectedCourseId)
      .pipe(finalize(() => (this.generatingInviteCode = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (inviteCode) => {
          this.courseInviteCode = inviteCode;
          this.setSuccess('کد دعوت با موفقیت تولید شد.');
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'تولید کد دعوت با خطا مواجه شد.');
        },
      });
  }

  copyInviteCode(code: string): void {
    navigator.clipboard.writeText(code).catch(() => {});
    this.setSuccess('کد دعوت کپی شد.');
  }

  /* ──────────────────────────────────────
   * Assignments
   * ────────────────────────────────────── */

  startCreateAssignment(): void {
    this.assignmentMode = 'create';
    this.selectedAssignmentId = null;
    this.assignmentForm.setValue({
      title: '',
      description: '',
      assignmentDate: this.todayIsoDate(),
      type: 'daily',
      status: 'published',
      maxScore: 20,
      instructions: '',
    });
    this.attachments = [];
    this.attachmentMetaForms = {};
    this.attachmentReplacementFiles = {};
  }

  selectAssignment(assignmentId: number): void {
    this.selectedAssignmentId = assignmentId;
    const assignment = this.assignments.find((item) => item.id === assignmentId);
    if (!assignment) return;
    this.assignmentMode = 'edit';
    this.assignmentForm.setValue({
      title: assignment.title ?? '',
      description: assignment.description ?? '',
      assignmentDate: assignment.assignmentDate ?? this.todayIsoDate(),
      type: this.normalizeAssignmentType(assignment.type),
      status: this.normalizeAssignmentStatus(assignment.status),
      maxScore: Number(assignment.maxScore ?? 20),
      instructions: assignment.instructions ?? '',
    });
    this.loadAttachments(assignmentId);
  }

  saveAssignment(): void {
    if (this.assignmentForm.invalid || this.selectedCourseId === null) return;
    const raw = this.assignmentForm.getRawValue();
    const payload = {
      title: raw.title.trim(),
      description: raw.description.trim(),
      assignmentDate: raw.assignmentDate,
      type: raw.type as AssignmentType,
      status: raw.status as AssignmentStatus,
      maxScore: Number(raw.maxScore),
      instructions: raw.instructions.trim(),
    };

    this.savingAssignment = true;
    const request$ =
      this.assignmentMode === 'edit' && this.selectedAssignmentId !== null
        ? this.api.updateAdminAssignment(this.selectedAssignmentId, payload)
        : this.api.createAdminAssignment(this.selectedCourseId, payload);

    request$
      .pipe(finalize(() => (this.savingAssignment = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (assignment) => {
          this.selectedAssignmentId = assignment.id;
          this.assignmentMode = 'edit';
          this.setSuccess('تکلیف با موفقیت ذخیره شد.');
          this.loadAssignments(this.selectedCourseId ?? assignment.courseId);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره تکلیف با خطا مواجه شد.');
        },
      });
  }

  deleteSelectedAssignment(): void {
    if (this.selectedAssignmentId === null || this.savingAssignment) return;
    this.savingAssignment = true;
    this.api
      .deleteAdminAssignment(this.selectedAssignmentId)
      .pipe(finalize(() => (this.savingAssignment = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.startCreateAssignment();
          if (this.selectedCourseId !== null) {
            this.loadAssignments(this.selectedCourseId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف تکلیف با خطا مواجه شد.');
        },
      });
  }

  createDailySeries(): void {
    if (this.dailySeriesForm.invalid || this.selectedCourseId === null) return;
    const raw = this.dailySeriesForm.getRawValue();
    this.creatingDailySeries = true;
    this.api
      .createDailyAssignments(this.selectedCourseId, {
        startDate: raw.startDate,
        days: Number(raw.days),
        titlePrefix: raw.titlePrefix.trim(),
        descriptionPrefix: raw.descriptionPrefix.trim(),
        type: raw.type as AssignmentType,
        maxScore: Number(raw.maxScore),
        instructions: raw.instructions.trim(),
      })
      .pipe(finalize(() => (this.creatingDailySeries = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.setSuccess(`${items.length} تکلیف روزانه ایجاد شد.`);
          this.loadAssignments(this.selectedCourseId ?? 0);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ایجاد سری روزانه با خطا مواجه شد.');
        },
      });
  }

  assignmentStatusLabel(status: AssignmentStatus | undefined): string {
    const n = this.normalizeAssignmentStatus(status);
    return n === 'draft' ? 'پیش‌نویس' : n === 'closed' ? 'بسته' : 'منتشر';
  }

  assignmentStatusClass(status: AssignmentStatus | undefined): string {
    return `status-chip--${this.normalizeAssignmentStatus(status)}`;
  }

  assignmentTypeLabel(type: AssignmentType | undefined): string {
    const n = this.normalizeAssignmentType(type);
    return n === 'homework' ? 'تکلیف' : n === 'project' ? 'پروژه' : n === 'exam' ? 'آزمون' : 'روزانه';
  }

  /* ──────────────────────────────────────
   * Attachments
   * ────────────────────────────────────── */

  onCreateAttachmentFileChange(event: Event): void {
    this.createAttachmentFile = this.extractFile(event);
  }

  createAttachment(): void {
    if (this.selectedAssignmentId === null || this.attachmentCreateForm.invalid) return;
    if (!this.createAttachmentFile) {
      this.setError('برای افزودن پیوست باید فایل انتخاب کنید.');
      return;
    }
    const raw = this.attachmentCreateForm.getRawValue();
    const payload = new FormData();
    payload.set('file', this.createAttachmentFile);
    payload.set('title', raw.title.trim());
    payload.set('description', raw.description.trim());
    payload.set('kind', raw.kind);
    payload.set('displayOrder', String(raw.displayOrder));

    this.creatingAttachment = true;
    this.api
      .createAttachment(this.selectedAssignmentId, payload)
      .pipe(finalize(() => (this.creatingAttachment = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('پیوست جدید افزوده شد.');
          this.createAttachmentFile = null;
          this.attachmentCreateForm.reset({ title: '', description: '', kind: 'document', displayOrder: 1 });
          this.loadAttachments(this.selectedAssignmentId ?? 0);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'افزودن پیوست با خطا مواجه شد.');
        },
      });
  }

  updateAttachment(attachmentId: number): void {
    const form = this.attachmentMetaForms[attachmentId];
    if (!form || form.invalid || this.updatingAttachmentIds.has(attachmentId)) return;
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .updateAttachment(attachmentId, {
        title: this.readControlString(form, 'title'),
        description: this.readControlString(form, 'description'),
        kind: this.normalizeAttachmentKind(this.readControlString(form, 'kind')),
        displayOrder: Number(this.readControlString(form, 'displayOrder')) || 1,
      })
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('پیوست با موفقیت ویرایش شد.');
          if (this.selectedAssignmentId !== null) this.loadAttachments(this.selectedAssignmentId);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ویرایش پیوست با خطا مواجه شد.');
        },
      });
  }

  onReplaceAttachmentFileChange(attachmentId: number, event: Event): void {
    this.attachmentReplacementFiles[attachmentId] = this.extractFile(event);
  }

  replaceAttachmentFile(attachmentId: number): void {
    if (this.updatingAttachmentIds.has(attachmentId)) return;
    const file = this.attachmentReplacementFiles[attachmentId];
    if (!file) {
      this.setError('برای جایگزینی باید فایل جدید انتخاب شود.');
      return;
    }
    const payload = new FormData();
    payload.set('file', file);
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .uploadAttachmentFile(attachmentId, payload)
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('فایل پیوست جایگزین شد.');
          this.attachmentReplacementFiles[attachmentId] = null;
          if (this.selectedAssignmentId !== null) this.loadAttachments(this.selectedAssignmentId);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'جایگزینی فایل با خطا مواجه شد.');
        },
      });
  }

  deleteAttachment(attachmentId: number): void {
    if (this.updatingAttachmentIds.has(attachmentId)) return;
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .deleteAttachment(attachmentId)
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          if (this.selectedAssignmentId !== null) this.loadAttachments(this.selectedAssignmentId);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف پیوست با خطا مواجه شد.');
        },
      });
  }

  loadAttachments(assignmentId: number): void {
    this.loadingAttachments = true;
    this.api
      .getAssignmentAttachments(assignmentId)
      .pipe(finalize(() => (this.loadingAttachments = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (attachments) => {
          this.attachments = attachments;
          this.ensureAttachmentForms(attachments);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت پیوست‌ها با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  /* ──────────────────────────────────────
   * Logout / refresh
   * ────────────────────────────────────── */

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  navigateToSpiritual(): void {
    void this.router.navigate(['/admin/spiritual']);
  }

  /* ──────────────────────────────────────
   * Private
   * ────────────────────────────────────── */

  private loadStatistics(): void {
    this.api
      .getSystemStatistics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (systemStats) => {
          this.stats.totalCourses = systemStats.totalCourses;
          this.stats.totalAssignments = systemStats.totalAssignments;
          this.stats.totalAttachments = systemStats.totalAttachments;
          this.stats.activeCourses = systemStats.activeCourses;
          this.cdr.markForCheck();
        },
        error: () => {},
      });
  }

  private loadCourses(): void {
    const filters = this.courseFilterForm.getRawValue();
    const query = filters.query.trim();
    const status = filters.status.trim();
    this.loadingCourses = true;

    let request$;
    if (query) {
      request$ = this.api.searchAdminCourses(query);
    } else if (status) {
      request$ = this.api.filterAdminCourses(status);
    } else {
      request$ = this.api.getAdminCourses();
    }

    request$
      .pipe(finalize(() => (this.loadingCourses = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (courses) => {
          this.courses = query && status ? courses.filter((c) => c.status === status) : courses;
          if (!this.courses.some((c) => c.id === this.selectedCourseId)) {
            this.selectedCourseId = this.courses[0]?.id ?? null;
          }
          if (this.selectedCourseId !== null) {
            this.selectCourse(this.selectedCourseId);
          } else {
            this.assignments = [];
            this.attachments = [];
            this.selectedAssignmentId = null;
            this.startCreateCourse();
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت دوره‌ها با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  private loadAssignments(courseId: number): void {
    this.loadingAssignments = true;
    this.api
      .getAdminCourseAssignments(courseId)
      .pipe(finalize(() => (this.loadingAssignments = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (assignments) => {
          this.assignments = assignments;
          if (!this.assignments.some((item) => item.id === this.selectedAssignmentId)) {
            this.selectedAssignmentId = this.assignments[0]?.id ?? null;
          }
          if (this.selectedAssignmentId !== null) {
            this.selectAssignment(this.selectedAssignmentId);
          } else {
            this.attachments = [];
            this.attachmentMetaForms = {};
            this.attachmentReplacementFiles = {};
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت تکالیف با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  private ensureAttachmentForms(attachments: AssignmentAttachment[]): void {
    const ids = new Set(attachments.map((item) => item.id));
    for (const [idKey] of Object.entries(this.attachmentMetaForms)) {
      const id = Number(idKey);
      if (!ids.has(id)) {
        delete this.attachmentMetaForms[id];
        delete this.attachmentReplacementFiles[id];
      }
    }
    for (const item of attachments) {
      if (this.attachmentMetaForms[item.id]) continue;
      this.attachmentMetaForms[item.id] = this.fb.nonNullable.group({
        title: [item.title || '', [Validators.required]],
        description: [item.description || ''],
        kind: [item.kind || 'document'],
        displayOrder: [Number(item.displayOrder ?? 1), [Validators.required, Validators.min(1)]],
      });
      this.attachmentReplacementFiles[item.id] = null;
    }
  }

  private readControlString(form: FormGroup, key: string): string {
    const raw = form.get(key)?.value;
    return typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
  }

  private extractFile(event: Event): File | null {
    const target = event.target as HTMLInputElement | null;
    if (!target?.files || target.files.length === 0) return null;
    return target.files[0];
  }

  setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
  }

  setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private normalizeCourseStatus(status: CourseStatus | undefined): 'active' | 'inactive' | 'archived' {
    if (status === 'inactive' || status === 'archived') return status;
    return 'active';
  }

  private normalizeAssignmentType(type: AssignmentType | undefined): 'daily' | 'homework' | 'project' | 'exam' {
    if (type === 'homework' || type === 'project' || type === 'exam') return type;
    return 'daily';
  }

  private normalizeAssignmentStatus(status: AssignmentStatus | undefined): 'draft' | 'published' | 'closed' {
    if (status === 'draft' || status === 'closed') return status;
    return 'published';
  }

  private normalizeAttachmentKind(kind: string | undefined): AttachmentKind {
    if (kind === 'audio' || kind === 'image' || kind === 'text' || kind === 'other') return kind;
    return 'document';
  }
}
