import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import type {
  Assignment,
  AssignmentAttachment,
  AssignmentStatus,
  AssignmentType,
  AttachmentKind,
  Coach,
  Course,
  CourseStatus,
  CreateCoachPayload,
  PendingUser,
  StudentInfo,
  StudentProgressResponse
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);

  username = '';
  errorMessage = '';
  successMessage = '';
  activeMenu: string = 'makatib';
  expandedMenus = new Set<string>(['makatib']);
  menuItems = [
    { key: 'trainees', label: 'متربیان' },
    { key: 'teachers', label: 'مربیان' },
    { key: 'courses', label: 'دوره‌ها' },
    { key: 'branch-managers', label: 'مسئولین شعب' },
    { key: 'makatib', label: 'مکاتب تربیتی، آموزشی، مهارتی' },
    { key: 'parents', label: 'والدین' },
    { key: 'evaluators', label: 'ارزیاب' },
    { key: 'headquarters', label: 'ستاد' }
  ] as const;

  stats = {
    pendingUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    totalAttachments: 0,
    activeCourses: 0
  };

  pendingUsers: PendingUser[] = [];
  approvalForms: Record<number, FormGroup> = {};
  loadingPendingUsers = false;
  processingUserIds = new Set<number>();

  courseFilterForm = this.fb.nonNullable.group({
    query: [''],
    status: ['']
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
    maxStudents: [30, [Validators.required, Validators.min(1)]]
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
    instructions: ['']
  });
  dailySeriesForm = this.fb.nonNullable.group({
    startDate: [this.todayIsoDate(), [Validators.required]],
    days: [3, [Validators.required, Validators.min(1)]],
    titlePrefix: ['تکلیف روز'],
    descriptionPrefix: [''],
    type: ['daily'],
    maxScore: [20, [Validators.required, Validators.min(0)]],
    instructions: ['']
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
    displayOrder: [1, [Validators.required, Validators.min(1)]]
  });
  attachments: AssignmentAttachment[] = [];
  attachmentMetaForms: Record<number, FormGroup> = {};
  attachmentReplacementFiles: Record<number, File | null> = {};
  createAttachmentFile: File | null = null;
  loadingAttachments = false;
  creatingAttachment = false;
  updatingAttachmentIds = new Set<number>();

  traineesTab: 'pending' | 'all' = 'pending';
  allStudents: StudentInfo[] = [];
  loadingAllStudents = false;
  searchStudentQuery = '';
  selectedStudentId: number | null = null;
  selectedStudentProgress: StudentProgressResponse | null = null;
  loadingStudentProgress = false;

  get filteredStudents(): StudentInfo[] {
    const q = this.searchStudentQuery.trim().toLowerCase();
    if (!q) return this.allStudents;
    return this.allStudents.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }

  switchTraineesTab(tab: 'pending' | 'all'): void {
    this.traineesTab = tab;
    if (tab === 'all' && this.allStudents.length === 0) {
      this.loadAllStudents();
    }
  }

  loadAllStudents(): void {
    this.loadingAllStudents = true;
    this.api
      .getAllStudents()
      .pipe(finalize(() => (this.loadingAllStudents = false)))
      .subscribe({
        next: (students) => {
          this.allStudents = students;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست متربیان با خطا مواجه شد.');
        }
      });
  }

  selectStudent(studentId: number): void {
    this.selectedStudentId = studentId;
    this.loadingStudentProgress = true;
    this.selectedStudentProgress = null;
    this.api
      .getStudentProgress(studentId)
      .pipe(finalize(() => (this.loadingStudentProgress = false)))
      .subscribe({
        next: (progress) => {
          this.selectedStudentProgress = progress;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت اطلاعات متربی با خطا مواجه شد.');
        }
      });
  }

  coaches: Coach[] = [];
  loadingCoaches = false;
  savingCoach = false;
  coachForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    specialization: [''],
    assignedCourseIds: ['']
  });
  coachEditMode = false;
  selectedCoachId: number | null = null;

  get filteredCoaches(): Coach[] {
    const q = this.searchCoachQuery.trim().toLowerCase();
    if (!q) return this.coaches;
    return this.coaches.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.specialization.toLowerCase().includes(q)
    );
  }
  searchCoachQuery = '';

  loadCoaches(): void {
    this.loadingCoaches = true;
    this.api
      .getCoaches()
      .pipe(finalize(() => (this.loadingCoaches = false)))
      .subscribe({
        next: (coaches) => {
          this.coaches = coaches;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست مربیان با خطا مواجه شد.');
        }
      });
  }

  startCreateCoach(): void {
    this.coachEditMode = false;
    this.selectedCoachId = null;
    this.coachForm.setValue({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      specialization: '',
      assignedCourseIds: ''
    });
  }

  selectCoach(coachId: number): void {
    const coach = this.coaches.find((c) => c.id === coachId);
    if (!coach) return;
    this.selectedCoachId = coachId;
    this.coachEditMode = true;
    this.coachForm.setValue({
      username: coach.username,
      password: '',
      firstName: coach.firstName,
      lastName: coach.lastName,
      email: coach.email,
      phoneNumber: coach.phoneNumber,
      specialization: coach.specialization,
      assignedCourseIds: coach.assignedCourseIds.join(',')
    });
    this.coachForm.get('password')?.clearValidators();
    this.coachForm.get('password')?.updateValueAndValidity();
  }

  saveCoach(): void {
    if (this.coachForm.invalid) return;
    const raw = this.coachForm.getRawValue();
    const courseIds = raw.assignedCourseIds
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
    const payload: CreateCoachPayload = {
      username: raw.username.trim(),
      password: raw.password.trim(),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      specialization: raw.specialization.trim(),
      assignedCourseIds: courseIds
    };

    this.savingCoach = true;
    const request$ =
      this.coachEditMode && this.selectedCoachId !== null
        ? this.api.updateCoach(this.selectedCoachId, payload)
        : this.api.createCoach(payload);

    request$.pipe(finalize(() => (this.savingCoach = false))).subscribe({
      next: (coach) => {
        this.selectedCoachId = coach.id;
        this.coachEditMode = true;
        this.setSuccess('اطلاعات مربی ذخیره شد.');
        this.loadCoaches();
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'ذخیره اطلاعات مربی با خطا مواجه شد.');
      }
    });
  }

  deleteCoach(coachId: number): void {
    if (this.savingCoach) return;
    this.savingCoach = true;
    this.api
      .deleteCoach(coachId)
      .pipe(finalize(() => (this.savingCoach = false)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          if (this.selectedCoachId === coachId) {
            this.startCreateCoach();
          }
          this.loadCoaches();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف مربی با خطا مواجه شد.');
        }
      });
  }

  getCourseNamesForCoach(coach: Coach): string {
    return coach.assignedCourseIds
      .map((id) => this.courses.find((c) => c.id === id)?.title ?? `#${id}`)
      .join('، ') || '—';
  }

  readonly provinces = [
    'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز',
    'ایلام', 'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی',
    'خراسان رضوی', 'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان',
    'سیستان و بلوچستان', 'فارس', 'قزوین', 'قم', 'کردستان',
    'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان',
    'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد'
  ];
  selectedProvince = '';
  newBranchName = '';
  private readonly STORAGE_KEY = 'maktab_branches';

  get branches(): string[] {
    if (!this.activeMenu || !this.selectedProvince) return [];
    const key = `${this.activeMenu}:${this.selectedProvince}`;
    return this.branchData[key] ?? [];
  }

  private branchData: Record<string, string[]> = {};

  constructor() {
    this.username = this.authService.getCurrentUser()?.username ?? 'admin';
    this.loadBranchData();
  }

  private loadBranchData(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.branchData = JSON.parse(saved);
      }
    } catch { /* ignore */ }
  }

  private saveBranchData(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.branchData));
    } catch { /* ignore */ }
  }

  addBranch(): void {
    const name = this.newBranchName.trim();
    if (!name || !this.activeMenu || !this.selectedProvince) return;
    const key = `${this.activeMenu}:${this.selectedProvince}`;
    if (!this.branchData[key]) {
      this.branchData[key] = [];
    }
    if (this.branchData[key].includes(name)) return;
    this.branchData[key].push(name);
    this.newBranchName = '';
    this.saveBranchData();
  }

  removeBranch(branchName: string): void {
    if (!this.activeMenu || !this.selectedProvince) return;
    const key = `${this.activeMenu}:${this.selectedProvince}`;
    this.branchData[key] = (this.branchData[key] ?? []).filter((b) => b !== branchName);
    this.saveBranchData();
  }

  selectProvince(province: string): void {
    this.selectedProvince = province;
  }

  ngOnInit(): void {
    this.refreshAll();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  refreshAll(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loadStatistics();
    this.loadPendingUsers();
    this.loadCourses();
    this.loadCoaches();
  }

  isProcessing(userId: number): boolean {
    return this.processingUserIds.has(userId);
  }

  get selectedCourseTitle(): string {
    if (this.selectedCourseId === null) {
      return 'انتخاب نشده';
    }
    return this.courses.find((item) => item.id === this.selectedCourseId)?.title ?? `#${this.selectedCourseId}`;
  }

  get selectedAssignmentTitle(): string {
    if (this.selectedAssignmentId === null) {
      return 'انتخاب نشده';
    }
    return this.assignments.find((item) => item.id === this.selectedAssignmentId)?.title ?? `#${this.selectedAssignmentId}`;
  }

  courseStatusLabel(status: CourseStatus | undefined): string {
    const normalized = this.normalizeCourseStatus(status);
    if (normalized === 'inactive') {
      return 'غیرفعال';
    }
    if (normalized === 'archived') {
      return 'آرشیو';
    }
    return 'فعال';
  }

  courseStatusClass(status: CourseStatus | undefined): string {
    return `status-chip--${this.normalizeCourseStatus(status)}`;
  }

  assignmentStatusLabel(status: AssignmentStatus | undefined): string {
    const normalized = this.normalizeAssignmentStatus(status);
    if (normalized === 'draft') {
      return 'پیش‌نویس';
    }
    if (normalized === 'closed') {
      return 'بسته';
    }
    return 'منتشر';
  }

  assignmentStatusClass(status: AssignmentStatus | undefined): string {
    return `status-chip--${this.normalizeAssignmentStatus(status)}`;
  }

  assignmentTypeLabel(type: AssignmentType | undefined): string {
    const normalized = this.normalizeAssignmentType(type);
    if (normalized === 'homework') {
      return 'تکلیف';
    }
    if (normalized === 'project') {
      return 'پروژه';
    }
    if (normalized === 'exam') {
      return 'آزمون';
    }
    return 'روزانه';
  }

  approveUser(user: PendingUser): void {
    const form = this.approvalForms[user.id];
    if (!form || form.invalid || this.isProcessing(user.id)) {
      return;
    }
    const courseIds = this.readControlString(form, 'courseIdsInput')
      .split(',')
      .map((item: string) => Number(item.trim()))
      .filter((value: number) => Number.isFinite(value) && value > 0);
    if (courseIds.length === 0) {
      this.setError('حداقل یک شناسه درس معتبر وارد کنید.');
      return;
    }

    this.processingUserIds.add(user.id);
    this.api
      .approveUser(user.id, {
        firstName: this.readControlString(form, 'firstName'),
        lastName: this.readControlString(form, 'lastName'),
        email: this.readControlString(form, 'email'),
        phoneNumber: this.readControlString(form, 'phoneNumber'),
        studentId: this.readControlString(form, 'studentId'),
        courseIds
      })
      .pipe(finalize(() => this.processingUserIds.delete(user.id)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.loadPendingUsers();
          this.loadStatistics();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'تایید کاربر با خطا مواجه شد.');
        }
      });
  }

  rejectUser(user: PendingUser): void {
    if (this.isProcessing(user.id)) {
      return;
    }
    this.processingUserIds.add(user.id);
    this.api
      .rejectUser(user.id)
      .pipe(finalize(() => this.processingUserIds.delete(user.id)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.loadPendingUsers();
          this.loadStatistics();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'رد کاربر با خطا مواجه شد.');
        }
      });
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
      maxStudents: 30
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
        maxStudents: Number(course.maxStudents ?? 30)
      });
    }
    this.startCreateAssignment();
    this.loadAssignments(courseId);
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      return;
    }
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
      maxStudents: Number(raw.maxStudents)
    };

    this.savingCourse = true;
    const request$ =
      this.courseMode === 'edit' && this.selectedCourseId !== null
        ? this.api.updateAdminCourse(this.selectedCourseId, payload)
        : this.api.createAdminCourse(payload);

    request$.pipe(finalize(() => (this.savingCourse = false))).subscribe({
      next: (course) => {
        this.selectedCourseId = course.id;
        this.courseMode = 'edit';
        this.setSuccess(this.courseMode === 'edit' ? 'دوره با موفقیت ذخیره شد.' : 'دوره جدید ایجاد شد.');
        this.loadCourses();
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'ذخیره دوره با خطا مواجه شد.');
      }
    });
  }

  deleteSelectedCourse(): void {
    if (this.selectedCourseId === null || this.savingCourse) {
      return;
    }
    this.savingCourse = true;
    this.api
      .deleteAdminCourse(this.selectedCourseId)
      .pipe(finalize(() => (this.savingCourse = false)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.selectedCourseId = null;
          this.startCreateCourse();
          this.loadCourses();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف دوره با خطا مواجه شد.');
        }
      });
  }

  readonly makatibGirls = [
    { key: 'maktab-roqieh', label: 'مکتب حضرت رقیه علیها السلام (7 سال اول)', level: '7 سال اول' },
    { key: 'maktab-sakineh', label: 'مکتب حضرت سکینه علیها السلام (7 سال دوم)', level: '7 سال دوم' },
    { key: 'maktab-fatemeh', label: 'مکتب حضرت فاطمه بنت الحسین علیها السلام (7 سال سوم)', level: '7 سال سوم' }
  ];
  readonly makatibBoys = [
    { key: 'maktab-ali-asghar', label: 'مکتب حضرت علی اصغر علیه السلام (7 سال اول)', level: '7 سال اول' },
    { key: 'maktab-ghasem', label: 'مکتب حضرت قاسم علیه السلام (7 سال دوم)', level: '7 سال دوم' },
    { key: 'maktab-ali-akbar', label: 'مکتب حضرت علی اکبر علیه السلام (7 سال سوم)', level: '7 سال سوم' }
  ];
  readonly allMakatib = [...this.makatibGirls, ...this.makatibBoys];

  toggleExpand(key: string): void {
    if (this.expandedMenus.has(key)) {
      this.expandedMenus.delete(key);
    } else {
      this.expandedMenus.add(key);
    }
  }

  // Handle makatib click - expand girls/boys sections only when makatib itself is clicked
  toggleMakatibClick(): void {
    this.expandedMenus.add('makatib');
    this.activeMenu = 'makatib';
    // Auto-expand children based on active menu
    if (this.makatibGirls.some(m => m.key === this.activeMenu)) {
      this.expandedMenus.add('makatib-girls');
    } else if (this.makatibBoys.some(m => m.key === this.activeMenu)) {
      this.expandedMenus.add('makatib-boys');
    }
  }

  toggleCourseStatus(course: Course): void {
    const newStatus: CourseStatus = course.status === 'active' ? 'inactive' : 'active';
    this.api
      .updateAdminCourse(course.id, { status: newStatus })
      .subscribe({
        next: () => {
          course.status = newStatus;
          this.loadStatistics();
          this.loadCourses();
          this.setSuccess(`وضعیت دوره "${course.title}" به ${newStatus === 'active' ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'تغییر وضعیت دوره با خطا مواجه شد.');
        }
      });
  }

  startCreateAssignment(): void {
    this.assignmentMode = 'create';
    this.selectedAssignmentId = null;
    this.assignments = this.assignments;
    this.assignmentForm.setValue({
      title: '',
      description: '',
      assignmentDate: this.todayIsoDate(),
      type: 'daily',
      status: 'published',
      maxScore: 20,
      instructions: ''
    });
    this.attachments = [];
    this.attachmentMetaForms = {};
    this.attachmentReplacementFiles = {};
  }

  selectAssignment(assignmentId: number): void {
    this.selectedAssignmentId = assignmentId;
    const assignment = this.assignments.find((item) => item.id === assignmentId);
    if (!assignment) {
      return;
    }
    this.assignmentMode = 'edit';
    this.assignmentForm.setValue({
      title: assignment.title ?? '',
      description: assignment.description ?? '',
      assignmentDate: assignment.assignmentDate ?? this.todayIsoDate(),
      type: this.normalizeAssignmentType(assignment.type),
      status: this.normalizeAssignmentStatus(assignment.status),
      maxScore: Number(assignment.maxScore ?? 20),
      instructions: assignment.instructions ?? ''
    });
    this.loadAttachments(assignmentId);
  }

  saveAssignment(): void {
    if (this.assignmentForm.invalid || this.selectedCourseId === null) {
      return;
    }
    const raw = this.assignmentForm.getRawValue();
    const payload = {
      title: raw.title.trim(),
      description: raw.description.trim(),
      assignmentDate: raw.assignmentDate,
      type: raw.type as AssignmentType,
      status: raw.status as AssignmentStatus,
      maxScore: Number(raw.maxScore),
      instructions: raw.instructions.trim()
    };

    this.savingAssignment = true;
    const request$ =
      this.assignmentMode === 'edit' && this.selectedAssignmentId !== null
        ? this.api.updateAdminAssignment(this.selectedAssignmentId, payload)
        : this.api.createAdminAssignment(this.selectedCourseId, payload);

    request$.pipe(finalize(() => (this.savingAssignment = false))).subscribe({
      next: (assignment) => {
        this.selectedAssignmentId = assignment.id;
        this.assignmentMode = 'edit';
        this.setSuccess('تکلیف با موفقیت ذخیره شد.');
        this.loadAssignments(this.selectedCourseId ?? assignment.courseId);
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'ذخیره تکلیف با خطا مواجه شد.');
      }
    });
  }

  deleteSelectedAssignment(): void {
    if (this.selectedAssignmentId === null || this.savingAssignment) {
      return;
    }
    this.savingAssignment = true;
    this.api
      .deleteAdminAssignment(this.selectedAssignmentId)
      .pipe(finalize(() => (this.savingAssignment = false)))
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
        }
      });
  }

  createDailySeries(): void {
    if (this.dailySeriesForm.invalid || this.selectedCourseId === null) {
      return;
    }
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
        instructions: raw.instructions.trim()
      })
      .pipe(finalize(() => (this.creatingDailySeries = false)))
      .subscribe({
        next: (items) => {
          this.setSuccess(`${items.length} تکلیف روزانه ایجاد شد.`);
          this.loadAssignments(this.selectedCourseId ?? 0);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ایجاد سری روزانه با خطا مواجه شد.');
        }
      });
  }

  onCreateAttachmentFileChange(event: Event): void {
    this.createAttachmentFile = this.extractFile(event);
  }

  createAttachment(): void {
    if (this.selectedAssignmentId === null || this.attachmentCreateForm.invalid) {
      return;
    }
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
      .subscribe({
        next: () => {
          this.setSuccess('پیوست جدید افزوده شد.');
          this.createAttachmentFile = null;
          this.attachmentCreateForm.setValue({
            title: '',
            description: '',
            kind: 'document',
            displayOrder: 1
          });
          this.loadAttachments(this.selectedAssignmentId ?? 0);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'افزودن پیوست با خطا مواجه شد.');
        }
      });
  }

  updateAttachment(attachmentId: number): void {
    const form = this.attachmentMetaForms[attachmentId];
    if (!form || form.invalid || this.updatingAttachmentIds.has(attachmentId)) {
      return;
    }
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .updateAttachment(attachmentId, {
        title: this.readControlString(form, 'title'),
        description: this.readControlString(form, 'description'),
        kind: this.normalizeAttachmentKind(this.readControlString(form, 'kind')),
        displayOrder: Number(this.readControlString(form, 'displayOrder')) || 1
      })
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .subscribe({
        next: () => {
          this.setSuccess('پیوست با موفقیت ویرایش شد.');
          if (this.selectedAssignmentId !== null) {
            this.loadAttachments(this.selectedAssignmentId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ویرایش پیوست با خطا مواجه شد.');
        }
      });
  }

  onReplaceAttachmentFileChange(attachmentId: number, event: Event): void {
    this.attachmentReplacementFiles[attachmentId] = this.extractFile(event);
  }

  replaceAttachmentFile(attachmentId: number): void {
    if (this.updatingAttachmentIds.has(attachmentId)) {
      return;
    }
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
      .subscribe({
        next: () => {
          this.setSuccess('فایل پیوست جایگزین شد.');
          this.attachmentReplacementFiles[attachmentId] = null;
          if (this.selectedAssignmentId !== null) {
            this.loadAttachments(this.selectedAssignmentId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'جایگزینی فایل با خطا مواجه شد.');
        }
      });
  }

  deleteAttachment(attachmentId: number): void {
    if (this.updatingAttachmentIds.has(attachmentId)) {
      return;
    }
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .deleteAttachment(attachmentId)
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          if (this.selectedAssignmentId !== null) {
            this.loadAttachments(this.selectedAssignmentId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف پیوست با خطا مواجه شد.');
        }
      });
  }

  private loadStatistics(): void {
    this.api.getSystemStatistics().subscribe({
      next: (systemStats) => {
        this.stats.totalCourses = systemStats.totalCourses;
        this.stats.totalAssignments = systemStats.totalAssignments;
        this.stats.totalAttachments = systemStats.totalAttachments;
        this.stats.activeCourses = systemStats.activeCourses;
      },
      error: () => {
        // Keep admin UI usable even if statistics endpoint fails.
      }
    });
  }

  private loadPendingUsers(): void {
    this.loadingPendingUsers = true;
    this.api
      .getPendingUsers()
      .pipe(finalize(() => (this.loadingPendingUsers = false)))
      .subscribe({
        next: (users) => {
          this.pendingUsers = users;
          this.ensureApprovalForms(users);
          this.stats.pendingUsers = users.length;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت کاربران در انتظار تایید با خطا مواجه شد.');
        }
      });
  }

  private ensureApprovalForms(users: PendingUser[]): void {
    for (const user of users) {
      if (this.approvalForms[user.id]) {
        continue;
      }
      this.approvalForms[user.id] = this.fb.nonNullable.group({
        firstName: [user.firstName || '', [Validators.required]],
        lastName: [user.lastName || '', [Validators.required]],
        email: [user.email || '', [Validators.required, Validators.email]],
        phoneNumber: [user.phoneNumber || '', [Validators.required, Validators.pattern(/^09\\d{9}$/)]],
        studentId: [`S-${1000 + user.id}`, [Validators.required]],
        courseIdsInput: ['1', [Validators.required]]
      });
    }
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

    request$.pipe(finalize(() => (this.loadingCourses = false))).subscribe({
      next: (courses) => {
        this.courses = query && status ? courses.filter((course) => course.status === status) : courses;
        if (!this.courses.some((course) => course.id === this.selectedCourseId)) {
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
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'دریافت دوره‌ها با خطا مواجه شد.');
      }
    });
  }

  private loadAssignments(courseId: number): void {
    this.loadingAssignments = true;
    this.api
      .getAdminCourseAssignments(courseId)
      .pipe(finalize(() => (this.loadingAssignments = false)))
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
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت تکالیف با خطا مواجه شد.');
        }
      });
  }

  private loadAttachments(assignmentId: number): void {
    this.loadingAttachments = true;
    this.api
      .getAssignmentAttachments(assignmentId)
      .pipe(finalize(() => (this.loadingAttachments = false)))
      .subscribe({
        next: (attachments) => {
          this.attachments = attachments;
          this.ensureAttachmentForms(attachments);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت پیوست‌ها با خطا مواجه شد.');
        }
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
      if (this.attachmentMetaForms[item.id]) {
        continue;
      }
      this.attachmentMetaForms[item.id] = this.fb.nonNullable.group({
        title: [item.title || '', [Validators.required]],
        description: [item.description || ''],
        kind: [item.kind || 'document'],
        displayOrder: [Number(item.displayOrder ?? 1), [Validators.required, Validators.min(1)]]
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
    if (!target?.files || target.files.length === 0) {
      return null;
    }
    return target.files[0];
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private normalizeCourseStatus(status: CourseStatus | undefined): 'active' | 'inactive' | 'archived' {
    if (status === 'inactive' || status === 'archived') {
      return status;
    }
    return 'active';
  }

  private normalizeAssignmentType(type: AssignmentType | undefined): 'daily' | 'homework' | 'project' | 'exam' {
    if (type === 'homework' || type === 'project' || type === 'exam') {
      return type;
    }
    return 'daily';
  }

  private normalizeAssignmentStatus(status: AssignmentStatus | undefined): 'draft' | 'published' | 'closed' {
    if (status === 'draft' || status === 'closed') {
      return status;
    }
    return 'published';
  }

  private normalizeAttachmentKind(kind: string | undefined): AttachmentKind {
    if (kind === 'audio' || kind === 'image' || kind === 'text' || kind === 'other') {
      return kind;
    }
    return 'document';
  }
}
