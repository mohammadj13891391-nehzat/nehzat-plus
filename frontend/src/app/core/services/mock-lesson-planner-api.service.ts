import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import type {
  AdminCourseStatistics,
  AdminSystemStatistics,
  ApiMessageResponse,
  ApproveUserPayload,
  Assignment,
  AssignmentAttachment,
  StudentAssignmentGateState,
  AssignmentSubmission,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  BranchManager,
  Coach,
  Course,
  CourseEnrollment,
  CourseInviteCode,
  CoursePayload,
  CreateBranchManagerPayload,
  CreateCoachPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  CreateParentPayload,
  DailySeriesPayload,
  Madrasah,
  MadrasahGender,
  MadrasahGrade,
  MadrasahStatus,
  MaktabBranch,
  Parent,
  ParentStudentInfo,
  PendingUser,
  Student,
  StudentCourseProgress,
  StudentInfo,
  StudentProgressResponse,
  UpdateMadrasahPayload,
  UserType
} from '../models/lesson-planner.models';
import { resolveMediaUrl } from './api-url.util';
import { LessonPlannerApi } from './lesson-planner-api.interface';

type StoredUser = {
  id: number;
  username: string;
  password: string;
  userType: UserType;
  status: 'approved' | 'pending' | 'rejected';
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  studentId?: string;
  imageUrl?: string;
};

const DEFAULT_MOCK_COURSE_IDS = [1, 2];

type ListenState = {
  requiredListenCount: number;
  currentListenCount: number;
  isRecordingUnlocked: boolean;
  instructionAudioVersion?: string;
};

type MockStore = {
  users: StoredUser[];
  courses: Course[];
  madrasahs: Madrasah[];
  maktabBranches: MaktabBranch[];
  coaches: Coach[];
  branchManagers: BranchManager[];
  parents: Parent[];
  assignments: Assignment[];
  attachments: AssignmentAttachment[];
  students: Student[];
  studentCourseMap: Record<number, number[]>;
  submissions: AssignmentSubmission[];
  listenState: Record<string, ListenState>;
};

const MOCK_DELAY_MS = 300;
const DEFAULT_REQUIRED_LISTENS = 3;
const LISTEN_STATE_STORAGE_KEY = 'mock-listen-gate-state-v1';

type AssignmentListenState = {
  currentListenCount: number;
  requiredListenCount: number;
  isRecordingUnlocked: boolean;
  instructionAudioVersion?: string;
};

@Injectable()
export class MockLessonPlannerApi extends LessonPlannerApi {
  private readonly store: MockStore = this.createInitialStore();
  private listenStateByKey: Record<string, AssignmentListenState> = this.loadListenState();

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    const user = this.store.users.find((item) => item.username === payload.username);
    if (!user || user.password !== payload.password) {
      return this.fail('نام کاربری یا رمز عبور اشتباه است.');
    }
    if (user.status === 'pending') {
      return this.fail('حساب کاربری شما در انتظار تایید مدیر است.');
    }
    if (user.status === 'rejected') {
      return this.fail('حساب کاربری شما رد شده است. لطفا با مدیر تماس بگیرید.');
    }

    if (user.userType === 'admin') {
      return this.ok({
        message: 'ورود با موفقیت انجام شد.',
        username: user.username,
        userType: 'admin',
        imageUrl: user.imageUrl
      });
    }

    const student = this.ensureStudentProfileForUser(user);
    return this.ok({
      message: 'ورود با موفقیت انجام شد.',
      username: user.username,
      userType: 'student',
      studentId: student?.id,
      imageUrl: user.imageUrl,
      studentInfo: student
        ? {
            id: student.id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phoneNumber: student.phoneNumber
          }
        : undefined
    });
  }

  signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse> {
    const data = this.readSignupPayload(payload);
    if (!data.username || !data.password || !data.email || !data.phoneNumber || !data.firstName || !data.lastName) {
      return this.fail('اطلاعات ثبت نام کامل نیست.');
    }
    const duplicateUser = this.store.users.some((item) => item.username === data.username || item.email === data.email);
    if (duplicateUser) {
      return this.fail('کاربر با این نام کاربری یا ایمیل قبلا ثبت شده است.');
    }

    const nextId = this.store.users.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
    const newUser: StoredUser = {
      id: nextId,
      username: data.username,
      password: data.password,
      userType: 'student',
      status: 'pending',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber
    };
    this.store.users.push(newUser);
    return this.ok({
      message: 'ثبت نام با موفقیت انجام شد. پس از تایید مدیر میتوانید وارد شوید.',
      status: 'pending'
    });
  }

  seedDatabase(): Observable<ApiMessageResponse> {
    return this.ok({ message: 'Mock data already seeded.' });
  }

  getActiveCourses(): Observable<Course[]> {
    const active = this.store.courses.filter((course) => course.status === 'active');
    return this.ok(active.map((course) => ({ ...course })));
  }

  getCourses(): Observable<Course[]> {
    return this.ok(this.store.courses.map((course) => ({ ...course })));
  }

  getCourseById(id: number): Observable<Course> {
    const course = this.store.courses.find((item) => item.id === id);
    if (!course) {
      return this.fail('درس پیدا نشد.');
    }
    return this.ok({ ...course });
  }

  createCourse(payload: CoursePayload): Observable<Course> {
    const now = new Date().toISOString();
    const course: Course = {
      id: this.nextNumericId(this.store.courses),
      title: payload.title,
      description: payload.description ?? '',
      courseCode: payload.courseCode,
      credits: payload.credits ?? 2,
      instructor: payload.instructor ?? 'نامشخص',
      status: payload.status ?? 'active',
      startDate: payload.startDate ?? now.slice(0, 10),
      endDate: payload.endDate ?? now.slice(0, 10),
      maxStudents: payload.maxStudents ?? 30,
      createdAt: now,
      updatedAt: now
    };
    this.store.courses.push(course);
    return this.ok({ ...course });
  }

  updateCourse(id: number, payload: Partial<CoursePayload>): Observable<Course> {
    const index = this.store.courses.findIndex((item) => item.id === id);
    if (index < 0) {
      return this.fail('درس پیدا نشد.');
    }
    const next = {
      ...this.store.courses[index],
      ...payload,
      id,
      updatedAt: new Date().toISOString()
    };
    this.store.courses[index] = next;
    return this.ok({ ...next });
  }

  deleteCourse(id: number): Observable<ApiMessageResponse> {
    this.store.courses = this.store.courses.filter((course) => course.id !== id);
    this.store.assignments = this.store.assignments.filter((assignment) => assignment.courseId !== id);
    this.store.attachments = this.store.attachments.filter(
      (attachment) => !this.store.assignments.some((assignment) => assignment.id === attachment.assignmentId)
    );
    return this.ok({ message: 'درس حذف شد.' });
  }

  getCourseAssignments(courseId: number): Observable<Assignment[]> {
    const assignments = this.store.assignments.filter((assignment) => assignment.courseId === courseId);
    return this.ok(assignments.map((assignment) => this.withAttachments(assignment)));
  }

  createCourseAssignment(courseId: number, payload: Partial<Assignment>): Observable<Assignment> {
    return this.createAdminAssignment(courseId, payload);
  }

  getStudentProgress(studentId: number): Observable<StudentProgressResponse> {
    const student = this.store.students.find((item) => item.id === studentId);
    if (!student) {
      return this.fail('متربی پیدا نشد.');
    }
    const courseIds = this.store.studentCourseMap[studentId] ?? [];
    const courses = this.store.courses.filter((course) => courseIds.includes(course.id));
    const progressCourses: StudentCourseProgress[] = courses.map((course) => ({
      course,
      assignments: this.store.assignments
        .filter((assignment) => assignment.courseId === course.id)
        .map((assignment) => this.withAttachments(assignment))
    }));
    const submissions = this.store.submissions.filter((submission) => submission.studentId === studentId);
    return this.ok({
      student: { ...student },
      courses: progressCourses,
      submissions: submissions.map((submission) => ({ ...submission }))
    });
  }

  getStudentSubmissions(studentId: number, assignmentId?: number): Observable<AssignmentSubmission[]> {
    const items = this.store.submissions.filter(
      (submission) => submission.studentId === studentId && (assignmentId ? submission.assignmentId === assignmentId : true)
    );
    return this.ok(items.map((submission) => ({ ...submission })));
  }

  getAssignmentProgress(studentId: number, assignmentId: number): Observable<StudentAssignmentGateState> {
    const assignment = this.store.assignments.find((item) => item.id === assignmentId);
    const hasPlayableInstructionAudio = this.hasPlayableInstructionAudio(assignmentId);
    const requiredListenCount = assignment?.requiredListenCount ?? DEFAULT_REQUIRED_LISTENS;
    const state = this.getListenState(studentId, assignmentId, assignment?.instructionAudioVersion, requiredListenCount);
    const submissions = this.store.submissions.filter(
      (submission) => submission.studentId === studentId && submission.assignmentId === assignmentId
    );
    const latest = submissions.sort((a, b) => Date.parse(b.submissionDate) - Date.parse(a.submissionDate))[0];
    return this.ok({
      assignmentId,
      hasSubmission: Boolean(latest),
      latestSubmission: latest ? { ...latest } : null,
      requiredListenCount: state.requiredListenCount,
      currentListenCount: state.currentListenCount,
      isRecordingUnlocked: !hasPlayableInstructionAudio || state.isRecordingUnlocked,
      instructionAudioVersion: assignment?.instructionAudioVersion,
      hasPlayableInstructionAudio,
      primaryInstructionAudioUrl: this.getPrimaryInstructionAudioUrl(assignmentId)
    });
  }

  registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string
  ): Observable<StudentAssignmentGateState> {
    const assignment = this.store.assignments.find((item) => item.id === assignmentId);
    const requiredListenCount = assignment?.requiredListenCount ?? DEFAULT_REQUIRED_LISTENS;
    const state = this.getListenState(studentId, assignmentId, instructionAudioVersion, requiredListenCount);
    state.currentListenCount = Math.min(state.currentListenCount + 1, state.requiredListenCount);
    state.isRecordingUnlocked = state.currentListenCount >= state.requiredListenCount;
    if (instructionAudioVersion !== undefined) {
      state.instructionAudioVersion = instructionAudioVersion;
    }
    this.setListenState(studentId, assignmentId, state);

    const submissions = this.store.submissions.filter(
      (submission) => submission.studentId === studentId && submission.assignmentId === assignmentId
    );
    const latest = submissions.sort((a, b) => Date.parse(b.submissionDate) - Date.parse(a.submissionDate))[0];

    return this.ok({
      assignmentId,
      hasSubmission: Boolean(latest),
      latestSubmission: latest ? { ...latest } : null,
      requiredListenCount: state.requiredListenCount,
      currentListenCount: state.currentListenCount,
      isRecordingUnlocked: state.isRecordingUnlocked,
      instructionAudioVersion: state.instructionAudioVersion,
      hasPlayableInstructionAudio: this.hasPlayableInstructionAudio(assignmentId),
      primaryInstructionAudioUrl: this.getPrimaryInstructionAudioUrl(assignmentId)
    });
  }

  submitAssignment(studentId: number, assignmentId: number, payload: FormData): Observable<AssignmentSubmission> {
    const assignment = this.store.assignments.find((item) => item.id === assignmentId);
    const hasPlayableInstructionAudio = this.hasPlayableInstructionAudio(assignmentId);
    if (hasPlayableInstructionAudio) {
      const gateState = this.getListenState(
        studentId,
        assignmentId,
        assignment?.instructionAudioVersion,
        assignment?.requiredListenCount ?? DEFAULT_REQUIRED_LISTENS
      );
      if (!gateState.isRecordingUnlocked) {
        return this.fail('برای شروع ضبط باید فایل راهنما را ۳ بار کامل گوش دهید.');
      }
    }

    const audioFile = payload.get('audioFile');
    const audioName = audioFile instanceof File ? audioFile.name : 'submission-audio.webm';
    const now = new Date().toISOString();
    const submission: AssignmentSubmission = {
      id: this.nextNumericId(this.store.submissions),
      studentId,
      assignmentId,
      submissionDate: now,
      status: 'submitted',
      notes: this.readString(payload, 'notes'),
      feedback: '',
      isCompleted: true,
      timeSpent: Number(this.readString(payload, 'timeSpent') || 0) || undefined,
      audioFileUrl: resolveMediaUrl(`/uploads/mock/${audioName}`) ?? `/uploads/mock/${audioName}`
    };
    this.store.submissions.push(submission);
    return this.ok({ ...submission });
  }

  uploadSubmissionFile(studentId: number, submissionId: number, payload: FormData): Observable<AssignmentSubmission> {
    const submission = this.store.submissions.find(
      (item) => item.id === submissionId && item.studentId === studentId
    );
    if (!submission) {
      return this.fail('تحویل پیدا نشد.');
    }
    const file = payload.get('file');
    if (file instanceof File) {
      submission.documentUrl = resolveMediaUrl(`/uploads/mock/${file.name}`) ?? `/uploads/mock/${file.name}`;
    }
    return this.ok({ ...submission });
  }

  getAllStudents(): Observable<StudentInfo[]> {
    const students = this.store.students.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      phoneNumber: s.phoneNumber ?? ''
    }));
    return this.ok(students);
  }

  getCoaches(): Observable<Coach[]> {
    return this.ok(this.store.coaches.map((c) => ({ ...c })));
  }

  createCoach(payload: CreateCoachPayload): Observable<Coach> {
    const now = new Date().toISOString();
    const coach: Coach = {
      id: this.nextNumericId(this.store.coaches),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      specialization: payload.specialization,
      assignedCourseIds: payload.assignedCourseIds,
      status: 'active',
      createdAt: now
    };
    this.store.coaches.push(coach);
    return this.ok({ ...coach });
  }

  updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
    const index = this.store.coaches.findIndex((c) => c.id === id);
    if (index < 0) {
      return this.fail('مربی پیدا نشد.');
    }
    const next: Coach = {
      ...this.store.coaches[index],
      ...payload,
      id
    };
    this.store.coaches[index] = next;
    return this.ok({ ...next });
  }

  deleteCoach(id: number): Observable<ApiMessageResponse> {
    const index = this.store.coaches.findIndex((c) => c.id === id);
    if (index < 0) {
      return this.fail('مربی پیدا نشد.');
    }
    this.store.coaches.splice(index, 1);
    return this.ok({ message: 'مربی با موفقیت حذف شد.' });
  }

  getMadrasahs(): Observable<Madrasah[]> {
    return this.ok(this.store.madrasahs.map((m) => ({ ...m })));
  }

  createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah> {
    const now = new Date().toISOString();
    const madrasah: Madrasah = {
      id: this.nextNumericId(this.store.madrasahs),
      name: payload.name,
      key: payload.key,
      label: payload.label,
      level: payload.level,
      gender: payload.gender,
      grade: payload.grade,
      capacity: payload.capacity,
      managerId: payload.managerId,
      status: payload.status ?? 'active',
      createdAt: now,
      updatedAt: now
    };
    this.store.madrasahs.push(madrasah);
    return this.ok({ ...madrasah });
  }

  updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah> {
    const index = this.store.madrasahs.findIndex((m) => m.id === id);
    if (index < 0) {
      return this.fail('مکتب پیدا نشد.');
    }
    const next: Madrasah = {
      ...this.store.madrasahs[index],
      ...payload,
      id,
      updatedAt: new Date().toISOString()
    };
    this.store.madrasahs[index] = next;
    return this.ok({ ...next });
  }

  deleteMadrasah(id: number): Observable<ApiMessageResponse> {
    const index = this.store.madrasahs.findIndex((m) => m.id === id);
    if (index < 0) {
      return this.fail('مکتب پیدا نشد.');
    }
    this.store.madrasahs.splice(index, 1);
    this.store.maktabBranches = this.store.maktabBranches.filter((b) => b.madrasahId !== id);
    return this.ok({ message: 'مکتب با موفقیت حذف شد.' });
  }

  getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]> {
    return this.ok(this.store.maktabBranches.filter((b) => b.madrasahId === madrasahId).map((b) => ({ ...b })));
  }

  createMaktabBranch(madrasahId: number, payload: CreateMaktabBranchPayload): Observable<MaktabBranch> {
    const now = new Date().toISOString();
    const branch: MaktabBranch = {
      id: this.nextNumericId(this.store.maktabBranches),
      madrasahId,
      province: payload.province,
      name: payload.name,
      address: payload.address ?? '',
      capacity: payload.capacity ?? 30,
      status: payload.status ?? 'active',
      createdAt: now,
      updatedAt: now
    };
    this.store.maktabBranches.push(branch);
    return this.ok({ ...branch });
  }

  deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse> {
    const index = this.store.maktabBranches.findIndex((b) => b.id === branchId && b.madrasahId === madrasahId);
    if (index < 0) {
      return this.fail('شعبه پیدا نشد.');
    }
    this.store.maktabBranches.splice(index, 1);
    return this.ok({ message: 'شعبه با موفقیت حذف شد.' });
  }

  getParents(): Observable<Parent[]> {
    return this.ok(this.store.parents.map((p) => ({ ...p })));
  }

  createParent(payload: CreateParentPayload): Observable<Parent> {
    const now = new Date().toISOString();
    const parent: Parent = {
      id: this.nextNumericId(this.store.parents),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      address: payload.address ?? '',
      nationalCode: payload.nationalCode ?? '',
      studentIds: payload.studentIds ?? [],
      status: 'active',
      createdAt: now
    };
    this.store.parents.push(parent);
    return this.ok({ ...parent });
  }

  updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent> {
    const index = this.store.parents.findIndex((p) => p.id === id);
    if (index < 0) {
      return this.fail('والد پیدا نشد.');
    }
    const next: Parent = {
      ...this.store.parents[index],
      ...payload,
      id
    };
    this.store.parents[index] = next;
    return this.ok({ ...next });
  }

  deleteParent(id: number): Observable<ApiMessageResponse> {
    const index = this.store.parents.findIndex((p) => p.id === id);
    if (index < 0) {
      return this.fail('والد پیدا نشد.');
    }
    this.store.parents.splice(index, 1);
    return this.ok({ message: 'والد با موفقیت حذف شد.' });
  }

  getParentStudents(parentId: number): Observable<ParentStudentInfo[]> {
    const parent = this.store.parents.find((p) => p.id === parentId);
    if (!parent) {
      return this.fail('والد پیدا نشد.');
    }

    const studentsInfo: ParentStudentInfo[] = [];
    for (const studentId of parent.studentIds) {
      const student = this.store.students.find((s) => s.id === studentId);
      if (!student) continue;

      const studentCourseIds = this.store.studentCourseMap[studentId] ?? [];
      for (const courseId of studentCourseIds) {
        const course = this.store.courses.find((c) => c.id === courseId);
        if (!course) continue;

        const submissions = this.store.submissions.filter(
          (sub) => sub.studentId === studentId && this.store.assignments.some((a) => a.id === sub.assignmentId && a.courseId === courseId)
        );
        const latestGrade = submissions.length > 0
          ? submissions.reduce((latest, sub) => (sub.dailyScore ?? 0) > (latest.dailyScore ?? 0) ? sub : latest, submissions[0]).dailyScore
          : undefined;

        studentsInfo.push({
          studentId,
          studentName: `${student.firstName} ${student.lastName}`,
          studentCode: student.studentId,
          courseName: course.title,
          latestGrade,
          attendanceRate: submissions.length > 0 ? Math.round((submissions.filter((s) => s.isCompleted).length / submissions.length) * 100) : undefined
        });
      }
    }

    return this.ok(studentsInfo);
  }

  getBranchManagers(): Observable<BranchManager[]> {
    return this.ok(this.store.branchManagers.map((bm) => ({ ...bm })));
  }

  createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager> {
    const now = new Date().toISOString();
    const bm: BranchManager = {
      id: this.nextNumericId(this.store.branchManagers),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      assignedBranch: payload.assignedBranch,
      assignedProvince: payload.assignedProvince,
      gender: payload.gender,
      status: 'active',
      createdAt: now
    };
    this.store.branchManagers.push(bm);
    return this.ok({ ...bm });
  }

  updateBranchManager(id: number, payload: Partial<CreateBranchManagerPayload>): Observable<BranchManager> {
    const index = this.store.branchManagers.findIndex((bm) => bm.id === id);
    if (index < 0) {
      return this.fail('مسئول شعبه پیدا نشد.');
    }
    const next: BranchManager = {
      ...this.store.branchManagers[index],
      ...payload,
      id
    };
    this.store.branchManagers[index] = next;
    return this.ok({ ...next });
  }

  deleteBranchManager(id: number): Observable<ApiMessageResponse> {
    const index = this.store.branchManagers.findIndex((bm) => bm.id === id);
    if (index < 0) {
      return this.fail('مسئول شعبه پیدا نشد.');
    }
    this.store.branchManagers.splice(index, 1);
    return this.ok({ message: 'مسئول شعبه با موفقیت حذف شد.' });
  }

  getPendingUsers(): Observable<PendingUser[]> {
    const pending = this.store.users
      .filter((user) => user.status === 'pending')
      .map((user) => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        status: 'pending' as const
      }));
    return this.ok(pending);
  }

  approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse> {
    const user = this.store.users.find((item) => item.id === userId);
    if (!user) {
      return this.fail('کاربر پیدا نشد.');
    }
    user.status = 'approved';
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.phoneNumber = payload.phoneNumber;
    user.studentId = payload.studentId;

    const student: Student = {
      id: this.nextNumericId(this.store.students),
      studentId: payload.studentId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber
    };
    this.store.students.push(student);
    this.store.studentCourseMap[student.id] = payload.courseIds;
    return this.ok({ message: 'کاربر تایید شد.' });
  }

  private ensureStudentProfileForUser(user: StoredUser): Student | undefined {
    if (user.userType !== 'student' || user.status !== 'approved') {
      return undefined;
    }

    let student = this.store.students.find((item) => item.studentId === user.studentId);
    if (student) {
      // Always ensure approved students are mapped to dummy courses.
      this.ensureStudentCourseMap(student.id);
      return student;
    }

    const derivedStudentId = user.studentId || `S-${1000 + user.id}`;
    student = {
      id: this.nextNumericId(this.store.students),
      studentId: derivedStudentId,
      firstName: user.firstName || 'متربی',
      lastName: user.lastName || 'نمونه',
      email: user.email || `${user.username}@example.com`,
      phoneNumber: user.phoneNumber || '09120000000'
    };
    this.store.students.push(student);
    user.studentId = student.studentId;
    this.ensureStudentCourseMap(student.id);
    return student;
  }

  private ensureStudentCourseMap(studentNumericId: number): void {
    const existing = this.store.studentCourseMap[studentNumericId];
    if (existing && existing.length > 0) {
      return;
    }
    this.store.studentCourseMap[studentNumericId] = [...DEFAULT_MOCK_COURSE_IDS];
  }

  rejectUser(userId: number): Observable<ApiMessageResponse> {
    const user = this.store.users.find((item) => item.id === userId);
    if (!user) {
      return this.fail('کاربر پیدا نشد.');
    }
    user.status = 'rejected';
    return this.ok({ message: 'کاربر رد شد.' });
  }

  getAdminCourses(): Observable<Course[]> {
    return this.getCourses();
  }

  createAdminCourse(payload: CoursePayload): Observable<Course> {
    return this.createCourse(payload);
  }

  updateAdminCourse(id: number, payload: Partial<CoursePayload>): Observable<Course> {
    return this.updateCourse(id, payload);
  }

  deleteAdminCourse(id: number): Observable<ApiMessageResponse> {
    return this.deleteCourse(id);
  }

  searchAdminCourses(query: string): Observable<Course[]> {
    const term = query.trim().toLowerCase();
    const items = this.store.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.courseCode.toLowerCase().includes(term) ||
        (course.instructor ?? '').toLowerCase().includes(term)
    );
    return this.ok(items.map((item) => ({ ...item })));
  }

  filterAdminCourses(status: string): Observable<Course[]> {
    if (!status) {
      return this.getCourses();
    }
    return this.ok(this.store.courses.filter((course) => course.status === status).map((item) => ({ ...item })));
  }

  getAdminCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.getCourseAssignments(courseId);
  }

  getAssignmentById(id: number): Observable<Assignment> {
    const assignment = this.store.assignments.find((item) => item.id === id);
    if (!assignment) {
      return this.fail('تکلیف پیدا نشد.');
    }
    return this.ok(this.withAttachments(assignment));
  }

  createAdminAssignment(courseId: number, payload: Partial<Assignment>): Observable<Assignment> {
    const now = new Date().toISOString();
    const assignment: Assignment = {
      id: this.nextNumericId(this.store.assignments),
      courseId,
      title: payload.title ?? 'تکلیف جدید',
      description: payload.description ?? '',
      type: payload.type ?? 'daily',
      maxScore: payload.maxScore ?? 20,
      assignmentDate: payload.assignmentDate ?? now.slice(0, 10),
      status: payload.status ?? 'published',
      instructions: payload.instructions ?? '',
      createdAt: now,
      updatedAt: now
    };
    this.store.assignments.push(assignment);
    return this.ok(this.withAttachments(assignment));
  }

  updateAdminAssignment(id: number, payload: Partial<Assignment>): Observable<Assignment> {
    const index = this.store.assignments.findIndex((item) => item.id === id);
    if (index < 0) {
      return this.fail('تکلیف پیدا نشد.');
    }
    const next = {
      ...this.store.assignments[index],
      ...payload,
      id,
      updatedAt: new Date().toISOString()
    };
    this.store.assignments[index] = next;
    return this.ok(this.withAttachments(next));
  }

  deleteAdminAssignment(id: number): Observable<ApiMessageResponse> {
    this.store.assignments = this.store.assignments.filter((assignment) => assignment.id !== id);
    this.store.attachments = this.store.attachments.filter((attachment) => attachment.assignmentId !== id);
    this.store.submissions = this.store.submissions.filter((submission) => submission.assignmentId !== id);
    return this.ok({ message: 'تکلیف حذف شد.' });
  }

  createDailyAssignments(courseId: number, payload: DailySeriesPayload): Observable<Assignment[]> {
    const startDate = new Date(payload.startDate);
    const series: Assignment[] = [];
    for (let offset = 0; offset < payload.days; offset += 1) {
      const itemDate = new Date(startDate);
      itemDate.setDate(startDate.getDate() + offset);
      const titlePrefix = payload.titlePrefix ?? 'تکلیف روز';
      const assignment = this.createAssignmentSync(courseId, {
        title: `${titlePrefix} ${offset + 1}`,
        description: payload.descriptionPrefix ?? '',
        instructions: payload.instructions ?? '',
        type: payload.type ?? 'daily',
        maxScore: payload.maxScore ?? 20,
        assignmentDate: itemDate.toISOString().slice(0, 10),
        status: 'published'
      });
      series.push(this.withAttachments(assignment));
    }
    return this.ok(series);
  }

  getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]> {
    return this.ok(this.store.attachments.filter((attachment) => attachment.assignmentId === assignmentId).map((item) => ({ ...item })));
  }

  createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const file = payload.get('file');
    const fileName = file instanceof File ? file.name : `attachment-${assignmentId}.bin`;
    const attachment: AssignmentAttachment = {
      id: this.nextNumericId(this.store.attachments),
      assignmentId,
      title: this.readString(payload, 'title') || 'پیوست جدید',
      description: this.readString(payload, 'description'),
      kind: 'document',
      url: resolveMediaUrl(`/uploads/mock/${fileName}`) ?? `/uploads/mock/${fileName}`,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.attachments.push(attachment);
    return this.ok({ ...attachment });
  }

  uploadAttachmentFile(attachmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const attachment = this.store.attachments.find((item) => item.id === attachmentId);
    if (!attachment) {
      return this.fail('پیوست پیدا نشد.');
    }
    const file = payload.get('file');
    const fileName = file instanceof File ? file.name : `attachment-${attachmentId}.bin`;
    attachment.url = resolveMediaUrl(`/uploads/mock/${fileName}`) ?? `/uploads/mock/${fileName}`;
    attachment.updatedAt = new Date().toISOString();
    return this.ok({ ...attachment });
  }

  updateAttachment(attachmentId: number, payload: Partial<AssignmentAttachment>): Observable<AssignmentAttachment> {
    const index = this.store.attachments.findIndex((item) => item.id === attachmentId);
    if (index < 0) {
      return this.fail('پیوست پیدا نشد.');
    }
    const next = {
      ...this.store.attachments[index],
      ...payload,
      id: attachmentId,
      updatedAt: new Date().toISOString()
    };
    this.store.attachments[index] = next;
    return this.ok({ ...next });
  }

  deleteAttachment(attachmentId: number): Observable<ApiMessageResponse> {
    this.store.attachments = this.store.attachments.filter((attachment) => attachment.id !== attachmentId);
    return this.ok({ message: 'پیوست حذف شد.' });
  }

  getSystemStatistics(): Observable<AdminSystemStatistics> {
    const totalAttachments = this.store.attachments.length;
    const totalAssignments = this.store.assignments.length;
    const totalCourses = this.store.courses.length;
    const activeCourses = this.store.courses.filter((item) => item.status === 'active').length;
    return this.ok({
      totalCourses,
      totalAssignments,
      totalAttachments,
      activeCourses
    });
  }

  getCourseStatistics(courseId: number): Observable<AdminCourseStatistics> {
    const course = this.store.courses.find((item) => item.id === courseId);
    if (!course) {
      return this.fail('درس پیدا نشد.');
    }
    const assignments = this.store.assignments.filter((item) => item.courseId === courseId);
    const assignmentIds = new Set(assignments.map((item) => item.id));
    const totalAttachments = this.store.attachments.filter((item) => assignmentIds.has(item.assignmentId)).length;
    return this.ok({
      course: { ...course },
      totalAssignments: assignments.length,
      totalAttachments
    });
  }

  getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]> {
    const enrollments: CourseEnrollment[] = [];
    for (const [studentIdStr, courseIds] of Object.entries(this.store.studentCourseMap)) {
      if (courseIds.includes(courseId)) {
        const studentId = Number(studentIdStr);
        const student = this.store.students.find((s) => s.id === studentId);
        if (student) {
          enrollments.push({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentCode: student.studentId,
            enrollmentDate: new Date().toISOString()
          });
        }
      }
    }
    return this.ok(enrollments);
  }

  enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const existing = this.store.studentCourseMap[studentId] ?? [];
    if (existing.includes(courseId)) {
      return this.ok({ message: 'متربی قبلاً در این دوره ثبت‌نام کرده است.' });
    }
    this.store.studentCourseMap[studentId] = [...existing, courseId];
    return this.ok({ message: 'متربی با موفقیت در دوره ثبت‌نام شد.' });
  }

  unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const existing = this.store.studentCourseMap[studentId];
    if (!existing || !existing.includes(courseId)) {
      return this.fail('متربی در این دوره ثبت‌نام نیست.');
    }
    this.store.studentCourseMap[studentId] = existing.filter((id) => id !== courseId);
    return this.ok({ message: 'متربی از دوره حذف شد.' });
  }

  generateCourseInviteCode(courseId: number): Observable<CourseInviteCode> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    return this.ok({ code, expiresAt, courseId });
  }

  private withAttachments(assignment: Assignment): Assignment {
    const attachments = this.store.attachments
      .filter((attachment) => attachment.assignmentId === assignment.id)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((attachment) => ({ ...attachment }));
    return {
      ...assignment,
      requiredListenCount: assignment.requiredListenCount ?? DEFAULT_REQUIRED_LISTENS,
      currentListenCount: assignment.currentListenCount ?? 0,
      isRecordingUnlocked: assignment.isRecordingUnlocked ?? false,
      primaryInstructionAudioUrl: this.getPrimaryInstructionAudioUrl(assignment.id),
      attachments
    };
  }

  private createAssignmentSync(courseId: number, payload: Partial<Assignment>): Assignment {
    const now = new Date().toISOString();
    const assignment: Assignment = {
      id: this.nextNumericId(this.store.assignments),
      courseId,
      title: payload.title ?? 'تکلیف',
      description: payload.description ?? '',
      type: payload.type ?? 'daily',
      maxScore: payload.maxScore ?? 20,
      assignmentDate: payload.assignmentDate ?? now.slice(0, 10),
      status: payload.status ?? 'published',
      instructions: payload.instructions ?? '',
      requiredListenCount: payload.requiredListenCount ?? DEFAULT_REQUIRED_LISTENS,
      currentListenCount: payload.currentListenCount ?? 0,
      isRecordingUnlocked: payload.isRecordingUnlocked ?? false,
      instructionAudioVersion: payload.instructionAudioVersion ?? 'v1',
      createdAt: now,
      updatedAt: now
    };
    this.store.assignments.push(assignment);
    return assignment;
  }

  private ok<T>(payload: T): Observable<T> {
    return of(payload).pipe(delay(MOCK_DELAY_MS));
  }

  private fail(message: string): Observable<never> {
    return throwError(() => ({
      error: { message }
    }));
  }

  private readSignupPayload(payload: AuthSignupPayload | FormData): AuthSignupPayload {
    if (!(payload instanceof FormData)) {
      return payload;
    }
    return {
      firstName: this.readString(payload, 'firstName'),
      lastName: this.readString(payload, 'lastName'),
      username: this.readString(payload, 'username'),
      email: this.readString(payload, 'email'),
      phoneNumber: this.readString(payload, 'phoneNumber'),
      password: this.readString(payload, 'password')
    };
  }

  private readString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  }

  private nextNumericId<T extends { id: number }>(items: T[]): number {
    const max = items.reduce((highest, item) => Math.max(highest, item.id), 0);
    return max + 1;
  }

  private createInitialStore(): MockStore {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const past = new Date(now);
    past.setDate(now.getDate() - 1);
    const future = new Date(now);
    future.setDate(now.getDate() + 2);

    const courses: Course[] = [
      {
        id: 1,
        title: 'ریاضی پایه',
        description: 'تمرین روزانه مفاهیم ریاضی پایه',
        courseCode: 'MATH-101',
        credits: 2,
        instructor: 'دکتر احمدی',
        status: 'active',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        maxStudents: 40,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 2,
        title: 'علوم تجربی',
        description: 'فعالیت های آزمایشگاهی ساده برای متربیان',
        courseCode: 'SCI-201',
        credits: 2,
        instructor: 'مهندس کریمی',
        status: 'active',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        maxStudents: 35,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 3,
        title: 'تاریخ معاصر',
        description: 'مرور وقایع مهم تاریخ',
        courseCode: 'HIS-110',
        credits: 1,
        instructor: 'خانم صادقی',
        status: 'inactive',
        startDate: '2025-09-01',
        endDate: '2026-02-01',
        maxStudents: 25,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    const assignments: Assignment[] = [
      {
        id: 1,
        courseId: 1,
        title: 'تمرین کسرها',
        description: 'حل تمرین صفحه 12 کتاب ریاضی',
        type: 'daily',
        maxScore: 20,
        assignmentDate: past.toISOString().slice(0, 10),
        status: 'published',
        instructions: 'ابتدا مثال حل شده را بخوانید.',
        requiredListenCount: DEFAULT_REQUIRED_LISTENS,
        currentListenCount: 0,
        isRecordingUnlocked: false,
        instructionAudioVersion: 'math-fractions-v1',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 2,
        courseId: 1,
        title: 'تمرین امروز ریاضی',
        description: 'پاسخ صوتی به سوالات روز',
        type: 'daily',
        maxScore: 20,
        assignmentDate: today,
        status: 'published',
        instructions: 'صدای خود را ضبط کرده و توضیح دهید.',
        requiredListenCount: DEFAULT_REQUIRED_LISTENS,
        currentListenCount: 0,
        isRecordingUnlocked: false,
        instructionAudioVersion: 'math-daily-v1',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 3,
        courseId: 2,
        title: 'گزارش آزمایش آب',
        description: 'مشاهده و ثبت نتایج آزمایش',
        type: 'project',
        maxScore: 25,
        assignmentDate: future.toISOString().slice(0, 10),
        status: 'draft',
        instructions: 'فایل گزارش را تکمیل کنید.',
        requiredListenCount: DEFAULT_REQUIRED_LISTENS,
        currentListenCount: 0,
        isRecordingUnlocked: true,
        instructionAudioVersion: 'science-report-v1',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    const attachments: AssignmentAttachment[] = [
      {
        id: 1,
        assignmentId: 1,
        title: 'نمونه حل تمرین',
        description: 'فایل صوتی توضیح مثال',
        kind: 'audio',
        url: '/uploads/mock/sample-lesson.mp3',
        displayOrder: 1,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 2,
        assignmentId: 2,
        title: 'برگه تمرین',
        description: 'فایل PDF تمرین روز',
        kind: 'document',
        url: '/uploads/mock/daily-sheet.pdf',
        displayOrder: 1,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    const students: Student[] = [
      {
        id: 1,
        studentId: 'S-1001',
        firstName: 'علی',
        lastName: 'رضایی',
        email: 'student@example.com',
        phoneNumber: '09123456789'
      }
    ];

    const users: StoredUser[] = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        userType: 'admin',
        status: 'approved'
      },
      {
        id: 2,
        username: 'student',
        password: 'student123',
        userType: 'student',
        status: 'approved',
        firstName: 'علی',
        lastName: 'رضایی',
        email: 'student@example.com',
        phoneNumber: '09123456789',
        studentId: 'S-1001'
      },
      {
        id: 3,
        username: 'pending.user',
        password: 'student123',
        userType: 'student',
        status: 'pending',
        firstName: 'نگین',
        lastName: 'محمدی',
        email: 'pending@example.com',
        phoneNumber: '09999999999'
      }
    ];

    const submissions: AssignmentSubmission[] = [
      {
        id: 1,
        studentId: 1,
        assignmentId: 1,
        submissionDate: now.toISOString(),
        dailyScore: 18,
        cumulativeScore: 18,
        status: 'graded',
        feedback: 'خوب بود',
        audioFileUrl: '/uploads/mock/student-voice-1.webm',
        notes: 'تمرین انجام شد.',
        isCompleted: true,
        timeSpent: 15
      }
    ];

    const madrasahs: Madrasah[] = [
      {
        id: 1,
        name: 'مکتب حضرت رقیه علیها السلام',
        key: 'maktab-roqieh',
        label: 'مکتب حضرت رقیه علیها السلام (7 سال اول)',
        level: '7 سال اول',
        gender: 'girls',
        grade: 1,
        capacity: 30,
        status: 'active',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 2,
        name: 'مکتب حضرت سکینه علیها السلام',
        key: 'maktab-sakineh',
        label: 'مکتب حضرت سکینه علیها السلام (7 سال دوم)',
        level: '7 سال دوم',
        gender: 'girls',
        grade: 2,
        capacity: 30,
        status: 'active',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 3,
        name: 'مکتب حضرت فاطمه بنت الحسین علیها السلام',
        key: 'maktab-fatemeh',
        label: 'مکتب حضرت فاطمه بنت الحسین علیها السلام (7 سال سوم)',
        level: '7 سال سوم',
        gender: 'girls',
        grade: 3,
        capacity: 30,
        status: 'active',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 4,
        name: 'مکتب حضرت علی اصغر علیه السلام',
        key: 'maktab-ali-asghar',
        label: 'مکتب حضرت علی اصغر علیه السلام (7 سال اول)',
        level: '7 سال اول',
        gender: 'boys',
        grade: 1,
        capacity: 30,
        status: 'active',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 5,
        name: 'مکتب حضرت قاسم علیه السلام',
        key: 'maktab-ghasem',
        label: 'مکتب حضرت قاسم علیه السلام (7 سال دوم)',
        level: '7 سال دوم',
        gender: 'boys',
        grade: 2,
        capacity: 30,
        status: 'active',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: 6,
        name: 'مکتب حضرت علی اکبر علیه السلام',
        key: 'maktab-ali-akbar',
        label: 'مکتب حضرت علی اکبر علیه السلام (7 سال سوم)',
        level: '7 سال سوم',
        gender: 'boys',
        grade: 3,
        capacity: 30,
        status: 'active',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];

    const maktabBranches: MaktabBranch[] = [
      { id: 1, madrasahId: 1, province: 'تهران', name: 'شعبه مرکزی', address: 'تهران، میدان انقلاب', capacity: 50, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 2, madrasahId: 1, province: 'خراسان رضوی', name: 'شعبه امام رضا', address: 'مشهد، حرم مطهر', capacity: 40, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 3, madrasahId: 1, province: 'قم', name: 'شعبه حضرت معصومه', address: 'قم، بلوار جمهوری', capacity: 35, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 4, madrasahId: 2, province: 'تهران', name: 'شعبه سکینه', address: 'تهران، تجریش', capacity: 30, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 5, madrasahId: 2, province: 'اصفهان', name: 'شعبه اصفهان', address: 'اصفهان، چهارباغ', capacity: 25, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 6, madrasahId: 4, province: 'تهران', name: 'شعبه پسرانه مرکزی', address: 'تهران، شهرری', capacity: 45, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 7, madrasahId: 4, province: 'خراسان رضوی', name: 'شعبه پسرانه مشهد', address: 'مشهد، طبرسی', capacity: 40, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 8, madrasahId: 5, province: 'تهران', name: 'شعبه پسرانه قاسم', address: 'تهران، تهرانپارس', capacity: 35, status: 'inactive', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 9, madrasahId: 6, province: 'تهران', name: 'شعبه علی اکبر', address: 'تهران، شمیران', capacity: 30, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() }
    ];

    const branchManagers: BranchManager[] = [
      {
        id: 1,
        username: 'manager.tehran',
        firstName: 'علی',
        lastName: 'مرادی',
        email: 'tehran@example.com',
        phoneNumber: '09121111111',
        assignedBranch: 'شعبه مرکزی',
        assignedProvince: 'تهران',
        gender: 'male',
        status: 'active',
        createdAt: now.toISOString()
      },
      {
        id: 2,
        username: 'manager.mashhad',
        firstName: 'زهرا',
        lastName: 'حسینی',
        email: 'mashhad@example.com',
        phoneNumber: '09122222222',
        assignedBranch: 'شعبه امام رضا',
        assignedProvince: 'خراسان رضوی',
        gender: 'female',
        status: 'active',
        createdAt: now.toISOString()
      },
      {
        id: 3,
        username: 'manager.qom',
        firstName: 'محمد',
        lastName: 'رضایی',
        email: 'qom@example.com',
        phoneNumber: '09123333333',
        assignedBranch: 'شعبه حضرت معصومه',
        assignedProvince: 'قم',
        gender: 'mixed',
        status: 'inactive',
        createdAt: now.toISOString()
      }
    ];

    const coaches: Coach[] = [
      {
        id: 1,
        username: 'dr.ahmadi',
        firstName: 'دکتر',
        lastName: 'احمدی',
        email: 'dr.ahmadi@example.com',
        phoneNumber: '09121111111',
        specialization: 'ریاضیات',
        assignedCourseIds: [1],
        status: 'active',
        createdAt: now.toISOString()
      },
      {
        id: 2,
        username: 'mohandes.karimi',
        firstName: 'مهندس',
        lastName: 'کریمی',
        email: 'mohandes.karimi@example.com',
        phoneNumber: '09122222222',
        specialization: 'علوم تجربی',
        assignedCourseIds: [2],
        status: 'active',
        createdAt: now.toISOString()
      },
      {
        id: 3,
        username: 'sadeghi',
        firstName: 'خانم',
        lastName: 'صادقی',
        email: 'sadeghi@example.com',
        phoneNumber: '09123333333',
        specialization: 'تاریخ و ادبیات',
        assignedCourseIds: [3],
        status: 'inactive',
        createdAt: now.toISOString()
      }
    ];

    const parents: Parent[] = [
      {
        id: 1,
        username: 'ahmadi.parent',
        firstName: 'محمد',
        lastName: 'احمدی',
        email: 'ahmadi.parent@example.com',
        phoneNumber: '09121111111',
        address: 'تهران، خیابان ولیعصر',
        nationalCode: '1234567890',
        studentIds: [1],
        status: 'active',
        createdAt: now.toISOString()
      },
      {
        id: 2,
        username: 'mohammadi.parent',
        firstName: 'علی',
        lastName: 'محمدی',
        email: 'mohammadi.parent@example.com',
        phoneNumber: '09122222222',
        address: 'تهران، خیابان انقلاب',
        nationalCode: '0987654321',
        studentIds: [2, 3],
        status: 'active',
        createdAt: now.toISOString()
      }
    ];

    return {
      users,
      courses,
      madrasahs,
      maktabBranches,
      branchManagers,
      coaches,
      parents,
      assignments,
      attachments,
      students,
      studentCourseMap: { '1': [1, 2] },
      submissions,
      listenState: {}
    };
  }

  private buildStateKey(studentId: number, assignmentId: number): string {
    return `${studentId}:${assignmentId}`;
  }

  private getPrimaryInstructionAudioUrl(assignmentId: number): string | undefined {
    const audioAttachment = this.store.attachments.find(
      (attachment) => attachment.assignmentId === assignmentId && attachment.kind === 'audio' && Boolean(attachment.url)
    );
    if (!audioAttachment) {
      return undefined;
    }
    return resolveMediaUrl(audioAttachment.url) ?? audioAttachment.url;
  }

  private hasPlayableInstructionAudio(assignmentId: number): boolean {
    return Boolean(this.getPrimaryInstructionAudioUrl(assignmentId));
  }

  private getListenState(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion: string | undefined,
    requiredListenCount: number
  ): AssignmentListenState {
    const key = this.buildStateKey(studentId, assignmentId);
    const existing = this.listenStateByKey[key];
    if (
      existing &&
      existing.instructionAudioVersion &&
      instructionAudioVersion &&
      existing.instructionAudioVersion !== instructionAudioVersion
    ) {
      delete this.listenStateByKey[key];
    }

    const current = this.listenStateByKey[key];
    if (current) {
      current.requiredListenCount = requiredListenCount;
      current.isRecordingUnlocked = current.currentListenCount >= requiredListenCount;
      if (instructionAudioVersion !== undefined) {
        current.instructionAudioVersion = instructionAudioVersion;
      }
      this.persistListenState();
      return current;
    }

    const state: AssignmentListenState = {
      currentListenCount: 0,
      requiredListenCount,
      isRecordingUnlocked: false,
      instructionAudioVersion
    };
    this.listenStateByKey[key] = state;
    this.persistListenState();
    return state;
  }

  private setListenState(studentId: number, assignmentId: number, state: AssignmentListenState): void {
    const key = this.buildStateKey(studentId, assignmentId);
    this.listenStateByKey[key] = {
      ...state,
      isRecordingUnlocked: state.currentListenCount >= state.requiredListenCount
    };
    this.persistListenState();
  }

  private loadListenState(): Record<string, AssignmentListenState> {
    try {
      const raw = localStorage.getItem(LISTEN_STATE_STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw) as Record<string, AssignmentListenState>;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private persistListenState(): void {
    localStorage.setItem(LISTEN_STATE_STORAGE_KEY, JSON.stringify(this.listenStateByKey));
  }
}
