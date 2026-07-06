import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LessonPlannerApi } from './lesson-planner-api.interface';
import {
  AdminCourseStatistics,
  AdminSystemStatistics,
  ApiMessageResponse,
  ApproveUserPayload,
  Assessment,
  AssessmentAnalytics,
  AssessmentQuestion,
  AssessmentQuestionPayload,
  AssessmentResult,
  Assignment,
  AssignmentAttachment,
  AssignmentProgressResponse,
  AssignmentSubmission,
  AttachmentKind,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  Branch,
  BranchManager,
  Coach,
  Course,
  CourseEnrollment,
  CourseInviteCode,
  CreatedUser,
  CreateAssignmentPayload,
  CreateBranchManagerPayload,
  CreateCoachPayload,
  CreateCoursePayload,
  CreateDailySeriesPayload,
  CreateEvaluationPayload,
  CreateEvaluatorPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  CreateParentPayload,
  CreateStudentPayload,
  CreateUserPayload,
  EvaluationRecord,
  Evaluator,
  GenerateWeeklyAssessmentPayload,
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
  Madrasah,
  MadrasahGender,
  MadrasahGrade,
  MadrasahStatus,
  MaktabBranch,
  Parent,
  ParentStudentInfo,
  PendingUser,
  Student,
  StudentAssessmentHistory,
  StudentInfo,
  StudentProgressResponse,
  SubmitAssessmentResultPayload,
  UpdateMadrasahPayload,
  UpdateStudentPayload,
  UserType
} from '../models/lesson-planner.models';

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createDummyToken(
  username: string,
  userType: UserType,
  studentId?: number,
  branchId?: number
): string {
  const header = JSON.stringify({ alg: 'none', typ: 'JWT' });
  const payload = JSON.stringify({
    sub: username,
    userType,
    studentId,
    branchId,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    iat: Math.floor(Date.now() / 1000)
  });
  const signature = '';
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.${signature}`;
}

@Injectable()
export class MockLessonPlannerApi extends LessonPlannerApi {
  private readonly delayMs = 300;

  private users: Array<{
    id: number;
    username: string;
    password: string;
    userType: UserType;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    imageUrl?: string;
    studentId?: number;
    branchId?: number;
  }> = [
    {
      id: 1,
      username: 'test',
      password: 'password',
      userType: 'manager',
      approvalStatus: 'approved',
      firstName: 'مدیر',
      lastName: 'سیستم',
      email: 'admin@example.com',
      phoneNumber: '09120000000'
    },
    {
      id: 2,
      username: 'ali.ahmadi',
      password: 'password123',
      userType: 'trainee',
      approvalStatus: 'approved',
      firstName: 'علی',
      lastName: 'احمدی',
      email: 'ali@example.com',
      phoneNumber: '09121111111',
      studentId: 1
    },
    {
      id: 3,
      username: 'fateme.mohammadi',
      password: 'password123',
      userType: 'trainee',
      approvalStatus: 'approved',
      firstName: 'فاطمه',
      lastName: 'محمدی',
      email: 'fateme@example.com',
      phoneNumber: '09122222222',
      studentId: 2
    },
    {
      id: 4,
      username: 'mohammad.rezaei',
      password: 'password123',
      userType: 'trainee',
      approvalStatus: 'approved',
      firstName: 'محمد',
      lastName: 'رضایی',
      email: 'mohammad@example.com',
      phoneNumber: '09123333333',
      studentId: 3
    }
  ];

  private students: Student[] = [
    {
      id: 1,
      username: 'ali.ahmadi',
      studentId: 'STD-001',
      firstName: 'علی',
      lastName: 'احمدی',
      email: 'ali@example.com',
      phoneNumber: '09121111111',
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      username: 'fateme.mohammadi',
      studentId: 'STD-002',
      firstName: 'فاطمه',
      lastName: 'محمدی',
      email: 'fateme@example.com',
      phoneNumber: '09122222222',
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 3,
      username: 'mohammad.rezaei',
      studentId: 'STD-003',
      firstName: 'محمد',
      lastName: 'رضایی',
      email: 'mohammad@example.com',
      phoneNumber: '09123333333',
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  private branches: Branch[] = [
    {
      id: 1,
      name: 'شعبه مرکزی',
      province: 'تهران',
      description: 'شعبه اصلی و مرکزی',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  private courses: Course[] = [
    {
      id: 1,
      title: 'قرآن و معارف اسلامی',
      description: 'دوره آموزش قرآن کریم و معارف اسلامی',
      courseCode: 'QUR-101',
      credits: 3,
      instructor: 'استاد محمدی',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      maxStudents: 30,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      title: 'آموزش تجوید',
      description: 'دوره تخصصی تجوید قرآن کریم',
      courseCode: 'TJT-201',
      credits: 2,
      instructor: 'استاد رضایی',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      maxStudents: 20,
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  private assignments: Assignment[] = [];
  private attachments: AssignmentAttachment[] = [];
  private submissions: AssignmentSubmission[] = [];
  private coaches: Coach[] = [];
  private branchManagers: BranchManager[] = [];
  private parents: Parent[] = [];
  private evaluators: Evaluator[] = [];
  private madrasahs: Madrasah[] = [];
  private maktabBranches: MaktabBranch[] = [];
  private evaluations: EvaluationRecord[] = [];
  private assessments: Assessment[] = [];
  private courseEnrollments: Map<number, number[]> = new Map([[1, [1, 2, 3]], [2, [1, 2]]]);
  private inviteCodes: Map<number, CourseInviteCode> = new Map();

  constructor() {
    super();
    this.seedAssignments();
  }

  private seedAssignments(): void {
    const start = new Date('2026-01-01');
    let assignmentId = 1;
    let attachmentId = 1;

    this.courses.forEach((course) => {
      for (let day = 0; day < 36; day++) {
        const date = new Date(start);
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        this.assignments.push({
          id: assignmentId,
          courseId: course.id,
          title: `تکلیف روز ${day + 1} - ${course.title}`,
          description: `تکلیف روزانه شماره ${day + 1} برای دوره ${course.title}`,
          type: 'daily',
          maxScore: 100,
          assignmentDate: dateStr,
          status: 'published',
          instructions: 'لطفاً فایل صوتی تلاوت خود را ضبط و ارسال کنید.',
          requiredListenCount: 1,
          currentListenCount: 0,
          isRecordingUnlocked: true,
          createdAt: '2026-01-01T00:00:00.000Z'
        });

        if (day === 0) {
          this.attachments.push({
            id: attachmentId++,
            assignmentId,
            title: 'فایل راهنمای صوتی',
            description: 'توضیحات تکلیف',
            kind: 'audio',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            displayOrder: 1,
            createdAt: '2026-01-01T00:00:00.000Z'
          });
        }

        assignmentId++;
      }
    });
  }

  private now(): string {
    return new Date().toISOString();
  }

  private nextId<T extends { id: number }>(items: T[] | string): number {
    if (typeof items === 'string') {
      switch (items) {
        case 'assessment':
          return this.assessments.length ? Math.max(...this.assessments.map((a) => a.id)) + 1 : 1;
        case 'question':
          const allQuestions = this.assessments.flatMap((a) => a.questions ?? []);
          return allQuestions.length ? Math.max(...allQuestions.map((q) => q.id)) + 1 : 1;
        case 'result':
          const allResults = this.assessments.flatMap((a) => a.results ?? []);
          return allResults.length ? Math.max(...allResults.map((r) => r.id)) + 1 : 1;
        default:
          return 1;
      }
    }
    return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  }

  private delayed<T>(value: T): Observable<T> {
    return of(value).pipe(delay(this.delayMs));
  }

  private findUserByUsername(username: string) {
    return this.users.find((u) => u.username === username);
  }

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    const user = this.findUserByUsername(payload.username);
    if (!user || user.password !== payload.password) {
      return this.delayed({
        message: 'نام کاربری یا رمز عبور اشتباه است',
        token: '',
        username: '',
        userType: 'trainee' as UserType
      });
    }

    if (user.approvalStatus === 'pending') {
      return this.delayed({
        message: 'حساب کاربری شما در انتظار تایید مدیر سیستم است',
        token: '',
        username: user.username,
        userType: user.userType
      });
    }

    if (user.approvalStatus === 'rejected') {
      return this.delayed({
        message: 'حساب کاربری شما رد شده است. لطفاً با مدیر سیستم تماس بگیرید',
        token: '',
        username: user.username,
        userType: user.userType
      });
    }

    const student = user.studentId ? this.students.find((s) => s.id === user.studentId) : undefined;
    const token = createDummyToken(user.username, user.userType, user.studentId, user.branchId);

    return this.delayed({
      message: 'ورود با موفقیت انجام شد',
      token,
      username: user.username,
      imageUrl: user.imageUrl,
      userType: user.userType,
      studentId: user.studentId,
      studentInfo: student
        ? {
            id: student.id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phoneNumber: student.phoneNumber
          }
        : undefined,
      branchId: user.branchId
    });
  }

  signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse> {
    let data: AuthSignupPayload;
    if (payload instanceof FormData) {
      data = {
        firstName: payload.get('firstName') as string,
        lastName: payload.get('lastName') as string,
        username: payload.get('username') as string,
        email: payload.get('email') as string,
        phoneNumber: payload.get('phoneNumber') as string,
        password: payload.get('password') as string
      };
    } else {
      data = payload;
    }

    if (this.findUserByUsername(data.username)) {
      return this.delayed({
        message: 'نام کاربری قبلاً ثبت شده است',
        status: 'pending'
      });
    }

    this.users.push({
      id: this.nextId(this.users),
      username: data.username,
      password: data.password,
      userType: 'trainee',
      approvalStatus: 'pending',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber
    });

    return this.delayed({
      message: 'ثبت نام با موفقیت انجام شد. در انتظار تایید مدیر سیستم هستید.',
      status: 'pending'
    });
  }

  seedDatabase(): Observable<ApiMessageResponse> {
    this.users = this.users.filter((u) => u.id <= 4);
    this.students = this.students.filter((s) => s.id <= 3);
    this.courses = this.courses.filter((c) => c.id <= 2);
    this.assignments = [];
    this.attachments = [];
    this.submissions = [];
    this.coaches = [];
    this.branchManagers = [];
    this.parents = [];
    this.evaluators = [];
    this.madrasahs = [];
    this.maktabBranches = [];
    this.evaluations = [];
    this.courseEnrollments = new Map([[1, [1, 2, 3]], [2, [1, 2]]]);
    this.inviteCodes = new Map();
    this.seedAssignments();
    return this.delayed({ message: 'پایگاه داده با موفقیت بازنشانی شد' });
  }

  getActiveCourses(): Observable<Course[]> {
    return this.delayed(this.courses.filter((c) => c.status === 'active'));
  }

  getCourses(): Observable<Course[]> {
    return this.delayed([...this.courses]);
  }

  getCourseById(id: number): Observable<Course> {
    const course = this.courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    return this.delayed(course);
  }

  createCourse(payload: CreateCoursePayload): Observable<Course> {
    const course: Course = {
      id: this.nextId(this.courses),
      title: payload.title,
      description: payload.description ?? '',
      courseCode: payload.courseCode,
      credits: payload.credits,
      instructor: payload.instructor ?? '',
      status: payload.status ?? 'active',
      startDate: payload.startDate ?? this.now().split('T')[0],
      endDate: payload.endDate ?? this.now().split('T')[0],
      maxStudents: payload.maxStudents,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.courses.push(course);
    return this.delayed(course);
  }

  updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
    const course = this.courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    Object.assign(course, payload, { updatedAt: this.now() });
    return this.delayed(course);
  }

  deleteCourse(id: number): Observable<ApiMessageResponse> {
    this.courses = this.courses.filter((c) => c.id !== id);
    this.assignments = this.assignments.filter((a) => a.courseId !== id);
    this.courseEnrollments.delete(id);
    return this.delayed({ message: 'دوره با موفقیت حذف شد' });
  }

  getCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.delayed(this.assignments.filter((a) => a.courseId === courseId));
  }

  createCourseAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment> {
    const assignment: Assignment = {
      id: this.nextId(this.assignments),
      courseId,
      title: payload.title ?? 'تکلیف جدید',
      description: payload.description ?? '',
      type: payload.type ?? 'daily',
      maxScore: payload.maxScore ?? 100,
      assignmentDate: payload.assignmentDate ?? this.now().split('T')[0],
      status: payload.status ?? 'published',
      instructions: payload.instructions,
      requiredListenCount: 1,
      currentListenCount: 0,
      isRecordingUnlocked: true,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.assignments.push(assignment);
    return this.delayed(assignment);
  }

  getStudentProgress(studentId: number): Observable<StudentProgressResponse> {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const enrolledCourseIds = Array.from(this.courseEnrollments.entries())
      .filter(([, students]) => students.includes(studentId))
      .map(([courseId]) => courseId);

    const courses = this.courses
      .filter((c) => enrolledCourseIds.includes(c.id))
      .map((course) => ({
        course,
        assignments: this.assignments.filter((a) => a.courseId === course.id)
      }));

    const submissions = this.submissions.filter((s) => s.studentId === studentId);

    return this.delayed({
      student: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber
      },
      courses,
      submissions
    });
  }

  getStudentSubmissions(studentId: number, assignmentId?: number): Observable<AssignmentSubmission[]> {
    let result = this.submissions.filter((s) => s.studentId === studentId);
    if (assignmentId !== undefined) {
      result = result.filter((s) => s.assignmentId === assignmentId);
    }
    return this.delayed(result);
  }

  getAssignmentProgress(studentId: number, assignmentId: number): Observable<AssignmentProgressResponse> {
    const assignment = this.assignments.find((a) => a.id === assignmentId);
    const latest = this.submissions
      .filter((s) => s.studentId === studentId && s.assignmentId === assignmentId)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())[0];

    return this.delayed({
      assignmentId,
      hasSubmission: !!latest,
      latestSubmission: latest ?? null,
      requiredListenCount: assignment?.requiredListenCount ?? 1,
      currentListenCount: latest?.timeSpent ?? 0,
      isRecordingUnlocked: true,
      hasPlayableInstructionAudio: false
    });
  }

  registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string
  ): Observable<AssignmentProgressResponse> {
    const latest = this.submissions.find((s) => s.studentId === studentId && s.assignmentId === assignmentId);
    if (latest) {
      latest.timeSpent = (latest.timeSpent ?? 0) + 1;
    }
    return this.getAssignmentProgress(studentId, assignmentId);
  }

  submitAssignment(studentId: number, assignmentId: number, payload: FormData): Observable<AssignmentSubmission> {
    const submission: AssignmentSubmission = {
      id: this.nextId(this.submissions),
      assignmentId,
      studentId,
      submissionDate: this.now(),
      status: 'submitted',
      dailyScore: 0,
      cumulativeScore: 0,
      isCompleted: true,
      timeSpent: 0,
      notes: payload.get('notes') as string | undefined,
      feedback: ''
    };
    this.submissions.push(submission);
    return this.delayed(submission);
  }

  uploadSubmissionFile(
    studentId: number,
    submissionId: number,
    payload: FormData
  ): Observable<AssignmentSubmission> {
    const submission = this.submissions.find((s) => s.id === submissionId && s.studentId === studentId);
    if (!submission) throw new Error('Submission not found');
    submission.audioFileUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
    return this.delayed(submission);
  }

  getAllStudents(): Observable<StudentInfo[]> {
    return this.delayed(
      this.students.map((s) => ({
        id: s.id,
        studentId: s.studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phoneNumber: s.phoneNumber
      }))
    );
  }

  getPendingUsers(): Observable<PendingUser[]> {
    return this.delayed(
      this.users
        .filter((u) => u.approvalStatus === 'pending')
        .map((u) => ({
          id: u.id,
          username: u.username,
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          email: u.email ?? '',
          phoneNumber: u.phoneNumber ?? '',
          status: 'pending' as const,
          createdAt: this.now()
        }))
    );
  }

  approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const student: Student = {
      id: this.nextId(this.students),
      username: user.username,
      studentId: payload.studentId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      status: 'active',
      createdAt: this.now()
    };
    this.students.push(student);

    user.approvalStatus = 'approved';
    user.studentId = student.id;
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.phoneNumber = payload.phoneNumber;

    payload.courseIds.forEach((courseId) => {
      const list = this.courseEnrollments.get(courseId) ?? [];
      if (!list.includes(student.id)) {
        list.push(student.id);
        this.courseEnrollments.set(courseId, list);
      }
    });

    return this.delayed({ message: 'کاربر با موفقیت تایید شد' });
  }

  rejectUser(userId: number): Observable<ApiMessageResponse> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.approvalStatus = 'rejected';
    return this.delayed({ message: 'کاربر رد شد' });
  }

  createUser(payload: CreateUserPayload): Observable<CreatedUser> {
    const user = {
      id: this.nextId(this.users),
      username: payload.username,
      password: payload.password,
      userType: payload.userType,
      approvalStatus: 'approved' as const,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber
    };
    this.users.push(user);
    return this.delayed({
      id: user.id,
      username: user.username,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber
    });
  }

  getAdminCourses(): Observable<Course[]> {
    return this.getCourses();
  }

  createAdminCourse(payload: CreateCoursePayload): Observable<Course> {
    return this.createCourse(payload);
  }

  updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
    return this.updateCourse(id, payload);
  }

  deleteAdminCourse(id: number): Observable<ApiMessageResponse> {
    return this.deleteCourse(id);
  }

  searchAdminCourses(query: string): Observable<Course[]> {
    const q = query.toLowerCase();
    return this.delayed(
      this.courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.courseCode.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      )
    );
  }

  filterAdminCourses(status: string): Observable<Course[]> {
    return this.delayed(this.courses.filter((c) => c.status === status));
  }

  getAdminCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.getCourseAssignments(courseId);
  }

  getAssignmentById(id: number): Observable<Assignment> {
    const assignment = this.assignments.find((a) => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    return this.delayed(assignment);
  }

  createAdminAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment> {
    return this.createCourseAssignment(courseId, payload);
  }

  updateAdminAssignment(id: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment> {
    const assignment = this.assignments.find((a) => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    Object.assign(assignment, payload, { updatedAt: this.now() });
    return this.delayed(assignment);
  }

  deleteAdminAssignment(id: number): Observable<ApiMessageResponse> {
    this.assignments = this.assignments.filter((a) => a.id !== id);
    this.attachments = this.attachments.filter((a) => a.assignmentId !== id);
    return this.delayed({ message: 'تکلیف با موفقیت حذف شد' });
  }

  createDailyAssignments(courseId: number, payload: CreateDailySeriesPayload): Observable<Assignment[]> {
    const start = new Date(payload.startDate);
    const created: Assignment[] = [];

    for (let day = 0; day < payload.days; day++) {
      const date = new Date(start);
      date.setDate(date.getDate() + day);
      const assignment: Assignment = {
        id: this.nextId(this.assignments),
        courseId,
        title: `${payload.titlePrefix ?? 'تکلیف روزانه'} ${day + 1}`,
        description: `${payload.descriptionPrefix ?? ''} ${day + 1}`.trim(),
        type: payload.type ?? 'daily',
        maxScore: payload.maxScore ?? 100,
        assignmentDate: date.toISOString().split('T')[0],
        status: 'published',
        instructions: payload.instructions,
        requiredListenCount: 1,
        currentListenCount: 0,
        isRecordingUnlocked: true,
        createdAt: this.now(),
        updatedAt: this.now()
      };
      this.assignments.push(assignment);
      created.push(assignment);
    }

    return this.delayed(created);
  }

  getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]> {
    return this.delayed(this.attachments.filter((a) => a.assignmentId === assignmentId));
  }

  createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const file = payload.get('file') as File | null;
    const attachment: AssignmentAttachment = {
      id: this.nextId(this.attachments),
      assignmentId,
      title: (payload.get('title') as string) ?? 'پیوست',
      description: (payload.get('description') as string) ?? undefined,
      kind: (payload.get('kind') as AttachmentKind) ?? 'document',
      url: file ? URL.createObjectURL(file) : '',
      displayOrder: Number(payload.get('displayOrder')) || 1,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.attachments.push(attachment);
    return this.delayed(attachment);
  }

  uploadAttachmentFile(attachmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const attachment = this.attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new Error('Attachment not found');
    const file = payload.get('file') as File | null;
    if (file) {
      attachment.url = URL.createObjectURL(file);
    }
    attachment.updatedAt = this.now();
    return this.delayed(attachment);
  }

  updateAttachment(attachmentId: number, payload: Partial<AssignmentAttachment>): Observable<AssignmentAttachment> {
    const attachment = this.attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new Error('Attachment not found');
    Object.assign(attachment, payload, { updatedAt: this.now() });
    return this.delayed(attachment);
  }

  deleteAttachment(attachmentId: number): Observable<ApiMessageResponse> {
    this.attachments = this.attachments.filter((a) => a.id !== attachmentId);
    return this.delayed({ message: 'پیوست با موفقیت حذف شد' });
  }

  getCoaches(): Observable<Coach[]> {
    return this.delayed([...this.coaches]);
  }

  createCoach(payload: CreateCoachPayload): Observable<Coach> {
    const coach: Coach = {
      id: this.nextId(this.coaches),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      specialization: payload.specialization,
      nationalCode: payload.nationalCode,
      branchId: payload.branchId,
      assignedCourseIds: payload.assignedCourseIds ?? [],
      status: 'active',
      createdAt: this.now()
    };
    this.coaches.push(coach);
    return this.delayed(coach);
  }

  updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
    const coach = this.coaches.find((c) => c.id === id);
    if (!coach) throw new Error('Coach not found');
    Object.assign(coach, payload, { updatedAt: this.now() });
    return this.delayed(coach);
  }

  deleteCoach(id: number): Observable<ApiMessageResponse> {
    this.coaches = this.coaches.filter((c) => c.id !== id);
    return this.delayed({ message: 'مربی با موفقیت حذف شد' });
  }

  getStudents(): Observable<Student[]> {
    return this.delayed([...this.students]);
  }

  createStudent(payload: CreateStudentPayload): Observable<Student> {
    const student: Student = {
      id: this.nextId(this.students),
      username: payload.username,
      studentId: payload.studentId ?? `STD-${String(this.nextId(this.students)).padStart(3, '0')}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      branchId: payload.branchId,
      status: 'active',
      createdAt: this.now()
    };
    this.students.push(student);
    this.users.push({
      id: this.nextId(this.users),
      username: payload.username,
      password: payload.password,
      userType: 'trainee',
      approvalStatus: 'approved',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      studentId: student.id
    });
    return this.delayed(student);
  }

  updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student> {
    const student = this.students.find((s) => s.id === id);
    if (!student) throw new Error('Student not found');
    Object.assign(student, payload, { updatedAt: this.now() });
    return this.delayed(student);
  }

  deleteStudent(id: number): Observable<ApiMessageResponse> {
    this.students = this.students.filter((s) => s.id !== id);
    this.users = this.users.filter((u) => u.studentId !== id);
    return this.delayed({ message: 'دانش‌آموز با موفقیت حذف شد' });
  }

  getBranchManagers(): Observable<BranchManager[]> {
    return this.delayed([...this.branchManagers]);
  }

  createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager> {
    const branch = this.branches.find((b) => b.id === payload.branchId);
    const manager: BranchManager = {
      id: this.nextId(this.branchManagers),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      branchId: payload.branchId,
      branchName: branch?.name,
      gender: payload.gender,
      nationalCode: payload.nationalCode,
      status: 'active',
      createdAt: this.now()
    };
    this.branchManagers.push(manager);
    return this.delayed(manager);
  }

  updateBranchManager(
    id: number,
    payload: Partial<CreateBranchManagerPayload>
  ): Observable<BranchManager> {
    const manager = this.branchManagers.find((m) => m.id === id);
    if (!manager) throw new Error('Branch manager not found');
    Object.assign(manager, payload, { updatedAt: this.now() });
    return this.delayed(manager);
  }

  deleteBranchManager(id: number): Observable<ApiMessageResponse> {
    this.branchManagers = this.branchManagers.filter((m) => m.id !== id);
    return this.delayed({ message: 'مدیر شعبه حذف شد' });
  }

  getBranches(): Observable<Branch[]> {
    return this.delayed([...this.branches]);
  }

  getSystemStatistics(): Observable<AdminSystemStatistics> {
    return this.delayed({
      totalCourses: this.courses.length,
      totalAssignments: this.assignments.length,
      totalAttachments: this.attachments.length,
      activeCourses: this.courses.filter((c) => c.status === 'active').length
    });
  }

  getCourseStatistics(courseId: number): Observable<AdminCourseStatistics> {
    const course = this.courses.find((c) => c.id === courseId);
    if (!course) throw new Error('Course not found');
    return this.delayed({
      course,
      totalAssignments: this.assignments.filter((a) => a.courseId === courseId).length,
      totalAttachments: this.attachments.filter((a) => {
        const assignment = this.assignments.find((asg) => asg.id === a.assignmentId);
        return assignment?.courseId === courseId;
      }).length
    });
  }

  getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]> {
    const studentIds = this.courseEnrollments.get(courseId) ?? [];
    return this.delayed(
      studentIds.map((id) => {
        const student = this.students.find((s) => s.id === id)!;
        return {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentCode: student.studentId,
          enrollmentDate: this.now()
        };
      })
    );
  }

  enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const list = this.courseEnrollments.get(courseId) ?? [];
    if (!list.includes(studentId)) {
      list.push(studentId);
      this.courseEnrollments.set(courseId, list);
    }
    return this.delayed({ message: 'دانش‌آموز در دوره ثبت‌نام شد' });
  }

  unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const list = this.courseEnrollments.get(courseId) ?? [];
    this.courseEnrollments.set(
      courseId,
      list.filter((id) => id !== studentId)
    );
    return this.delayed({ message: 'دانش‌آموز از دوره حذف شد' });
  }

  generateCourseInviteCode(courseId: number): Observable<CourseInviteCode> {
    const code = `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const invite: CourseInviteCode = {
      code,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      courseId
    };
    this.inviteCodes.set(courseId, invite);
    return this.delayed(invite);
  }

  getMadrasahs(): Observable<Madrasah[]> {
    return this.delayed([...this.madrasahs]);
  }

  createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah> {
    const madrasah: Madrasah = {
      id: this.nextId(this.madrasahs),
      name: payload.name,
      key: payload.key,
      label: payload.label,
      level: payload.level,
      gender: payload.gender,
      grade: payload.grade,
      capacity: payload.capacity,
      managerId: payload.managerId,
      status: payload.status ?? 'active',
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.madrasahs.push(madrasah);
    return this.delayed(madrasah);
  }

  updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah> {
    const madrasah = this.madrasahs.find((m) => m.id === id);
    if (!madrasah) throw new Error('Madrasah not found');
    Object.assign(madrasah, payload, { updatedAt: this.now() });
    return this.delayed(madrasah);
  }

  deleteMadrasah(id: number): Observable<ApiMessageResponse> {
    this.madrasahs = this.madrasahs.filter((m) => m.id !== id);
    return this.delayed({ message: 'مدرسه حذف شد' });
  }

  getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]> {
    return this.delayed(this.maktabBranches.filter((b) => b.madrasahId === madrasahId));
  }

  createMaktabBranch(
    madrasahId: number,
    payload: CreateMaktabBranchPayload
  ): Observable<MaktabBranch> {
    const branch: MaktabBranch = {
      id: this.nextId(this.maktabBranches),
      madrasahId,
      province: payload.province,
      name: payload.name,
      address: payload.address ?? '',
      capacity: payload.capacity ?? 0,
      status: payload.status ?? 'active',
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.maktabBranches.push(branch);
    return this.delayed(branch);
  }

  deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse> {
    this.maktabBranches = this.maktabBranches.filter(
      (b) => !(b.madrasahId === madrasahId && b.id === branchId)
    );
    return this.delayed({ message: 'شعبه مکتب حذف شد' });
  }

  getParents(): Observable<Parent[]> {
    return this.delayed([...this.parents]);
  }

  createParent(payload: CreateParentPayload): Observable<Parent> {
    const parent: Parent = {
      id: this.nextId(this.parents),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      address: payload.address ?? '',
      nationalCode: payload.nationalCode ?? '',
      branchId: payload.branchId,
      studentIds: payload.studentIds ?? [],
      status: 'active',
      createdAt: this.now()
    };
    this.parents.push(parent);
    return this.delayed(parent);
  }

  updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent> {
    const parent = this.parents.find((p) => p.id === id);
    if (!parent) throw new Error('Parent not found');
    Object.assign(parent, payload, { updatedAt: this.now() });
    return this.delayed(parent);
  }

  deleteParent(id: number): Observable<ApiMessageResponse> {
    this.parents = this.parents.filter((p) => p.id !== id);
    return this.delayed({ message: 'والد حذف شد' });
  }

  getParentStudents(parentId: number): Observable<ParentStudentInfo[]> {
    const parent = this.parents.find((p) => p.id === parentId);
    if (!parent) throw new Error('Parent not found');
    return this.delayed(
      parent.studentIds.map((studentId) => {
        const student = this.students.find((s) => s.id === studentId)!;
        return {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentCode: student.studentId,
          courseName: 'قرآن و معارف اسلامی',
          latestGrade: 0,
          attendanceRate: 100
        };
      })
    );
  }

  getEvaluators(): Observable<Evaluator[]> {
    return this.delayed([...this.evaluators]);
  }

  createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator> {
    const evaluator: Evaluator = {
      id: this.nextId(this.evaluators),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      expertise: payload.expertise ?? '',
      branchId: payload.branchId,
      assignedMadrasahIds: payload.assignedMadrasahIds ?? [],
      nationalCode: payload.nationalCode,
      status: 'active',
      createdAt: this.now()
    };
    this.evaluators.push(evaluator);
    return this.delayed(evaluator);
  }

  updateEvaluator(id: number, payload: Partial<CreateEvaluatorPayload>): Observable<Evaluator> {
    const evaluator = this.evaluators.find((e) => e.id === id);
    if (!evaluator) throw new Error('Evaluator not found');
    Object.assign(evaluator, payload, { updatedAt: this.now() });
    return this.delayed(evaluator);
  }

  deleteEvaluator(id: number): Observable<ApiMessageResponse> {
    this.evaluators = this.evaluators.filter((e) => e.id !== id);
    return this.delayed({ message: 'ارزیاب حذف شد' });
  }

  getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]> {
    let result = [...this.evaluations];
    if (evaluatorId !== undefined) {
      result = result.filter((e) => e.evaluatorId === evaluatorId);
    }
    return this.delayed(result);
  }

  createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord> {
    const evaluator = this.evaluators.find((e) => e.id === payload.evaluatorId);
    const record: EvaluationRecord = {
      id: this.nextId(this.evaluations),
      evaluatorId: payload.evaluatorId,
      evaluatorName: evaluator ? `${evaluator.firstName} ${evaluator.lastName}` : '',
      targetName: payload.targetName,
      targetType: payload.targetType,
      targetId: payload.targetId,
      score: payload.score,
      feedback: payload.feedback,
      evaluationDate: payload.evaluationDate,
      createdAt: this.now()
    };
    this.evaluations.push(record);
    return this.delayed(record);
  }

  deleteEvaluation(id: number): Observable<ApiMessageResponse> {
    this.evaluations = this.evaluations.filter((e) => e.id !== id);
    return this.delayed({ message: 'ارزیابی حذف شد' });
  }

  getHeadquartersSummary(): Observable<HeadquartersSummary> {
    return this.delayed({
      totalStudents: this.students.length,
      totalCoaches: this.coaches.length,
      totalBranchManagers: this.branchManagers.length,
      totalEvaluators: this.evaluators.length,
      totalParents: this.parents.length,
      totalCourses: this.courses.length,
      activeCourses: this.courses.filter((c) => c.status === 'active').length,
      totalAssignments: this.assignments.length,
      totalSubmissions: this.submissions.length,
      totalMadrasahs: this.madrasahs.length,
      totalBranches: this.maktabBranches.length,
      averageScore: 0,
      averageAttendanceRate: 100,
      lastUpdated: this.now()
    });
  }

  getBranchPerformance(): Observable<BranchPerformance[]> {
    return this.delayed(
      this.branches.map((b) => ({
        branchId: b.id,
        branchName: b.name,
        province: b.province,
        madrasahName: 'مدرسه نمونه',
        studentCount: this.students.length,
        averageScore: 0,
        attendanceRate: 100,
        activeCourses: this.courses.filter((c) => c.status === 'active').length,
        evaluationCount: 0,
        averageEvaluationScore: 0,
        status: 'active' as const
      }))
    );
  }

  getCoachPerformance(): Observable<CoachPerformance[]> {
    return this.delayed(
      this.coaches.map((c) => ({
        coachId: c.id,
        coachName: `${c.firstName} ${c.lastName}`,
        specialization: c.specialization,
        assignedCourseCount: c.assignedCourseIds.length,
        studentCount: this.students.length,
        averageStudentScore: 0,
        evaluationCount: 0,
        averageEvaluationScore: 0,
        status: c.status
      }))
    );
  }

  getAssessments(): Observable<Assessment[]> {
    return this.delayed(this.assessments);
  }

  getAssessmentById(id: number): Observable<Assessment> {
    const assessment = this.assessments.find((a) => a.id === id);
    if (!assessment) {
      return this.delayed(null as unknown as Assessment);
    }
    return this.delayed(assessment);
  }

  getAssessmentsByCourse(courseId: number): Observable<Assessment[]> {
    return this.delayed(this.assessments.filter((a) => a.courseId === courseId));
  }

  getAssessmentsByDateRange(courseId: number, startDate: string, endDate: string): Observable<Assessment[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.delayed(
      this.assessments.filter((a) => {
        const date = new Date(a.assessmentDate);
        return a.courseId === courseId && date >= start && date <= end;
      })
    );
  }

  createAssessment(payload: Partial<Assessment>): Observable<Assessment> {
    const assessment: Assessment = {
      id: this.nextId('assessment'),
      title: payload.title ?? '',
      description: payload.description ?? '',
      type: payload.type ?? 'weekly',
      maxScore: payload.maxScore ?? 100,
      durationMinutes: payload.durationMinutes ?? 60,
      assessmentDate: payload.assessmentDate ?? this.now(),
      status: payload.status ?? 'draft',
      instructions: payload.instructions,
      courseId: payload.courseId ?? 0,
      generatedByUserId: payload.generatedByUserId,
      generationCriteria: payload.generationCriteria,
      questions: [],
      results: [],
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.assessments.push(assessment);
    return this.delayed(assessment);
  }

  updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment> {
    const assessment = this.assessments.find((a) => a.id === id);
    if (!assessment) {
      return this.delayed(null as unknown as Assessment);
    }
    Object.assign(assessment, payload, { updatedAt: this.now() });
    return this.delayed(assessment);
  }

  deleteAssessment(id: number): Observable<ApiMessageResponse> {
    this.assessments = this.assessments.filter((a) => a.id !== id);
    return this.delayed({ message: 'Assessment deleted' });
  }

  generateWeeklyAssessment(payload: GenerateWeeklyAssessmentPayload): Observable<Assessment> {
    const assessment: Assessment = {
      id: this.nextId('assessment'),
      title: payload.title,
      description: payload.description,
      type: 'weekly',
      maxScore: payload.maxScore,
      durationMinutes: payload.durationMinutes,
      assessmentDate: payload.assessmentDate,
      status: 'draft',
      instructions: 'این ارزیابی هفتگی بر اساس پیشرفت شما و محتوای درس‌های هفته قبل تولید شده است.',
      courseId: payload.courseId,
      generatedByUserId: payload.generatedByUserId,
      generationCriteria: JSON.stringify(payload.criteria),
      questions: this.generateMockQuestions(payload.courseId),
      results: [],
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.assessments.push(assessment);
    return this.delayed(assessment);
  }

  getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    return this.delayed(assessment?.questions ?? []);
  }

  createAssessmentQuestion(assessmentId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion> {
    const question: AssessmentQuestion = {
      id: this.nextId('question'),
      type: payload.type,
      questionText: payload.questionText,
      optionsJson: payload.optionsJson,
      correctAnswerJson: payload.correctAnswerJson,
      points: payload.points,
      order: payload.order,
      difficulty: payload.difficulty,
      topic: payload.topic,
      explanation: payload.explanation,
      assessmentId,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (assessment) {
      assessment.questions = assessment.questions ?? [];
      assessment.questions.push(question);
    }
    return this.delayed(question);
  }

  updateAssessmentQuestion(questionId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion> {
    for (const assessment of this.assessments) {
      const question = assessment.questions?.find((q) => q.id === questionId);
      if (question) {
        Object.assign(question, payload, { updatedAt: this.now() });
        return this.delayed(question);
      }
    }
    return this.delayed(null as unknown as AssessmentQuestion);
  }

  deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse> {
    for (const assessment of this.assessments) {
      assessment.questions = assessment.questions?.filter((q) => q.id !== questionId);
    }
    return this.delayed({ message: 'Question deleted' });
  }

  submitAssessmentResult(assessmentId: number, payload: SubmitAssessmentResultPayload): Observable<AssessmentResult> {
    const result: AssessmentResult = {
      id: this.nextId('result'),
      completedAt: payload.completedAt,
      score: payload.score,
      maxPossibleScore: payload.maxPossibleScore,
      percentage: payload.percentage,
      status: payload.status,
      answersJson: payload.answersJson,
      feedback: payload.feedback,
      timeSpentMinutes: payload.timeSpentMinutes,
      assessmentId,
      studentId: payload.studentId,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (assessment) {
      assessment.results = assessment.results ?? [];
      assessment.results.push(result);
    }
    return this.delayed(result);
  }

  getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    return this.delayed(assessment?.results ?? []);
  }

  getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]> {
    const results: AssessmentResult[] = [];
    for (const assessment of this.assessments) {
      const studentResults = assessment.results?.filter((r) => r.studentId === studentId) ?? [];
      results.push(...studentResults);
    }
    return this.delayed(results);
  }

  getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (!assessment) {
      return this.delayed(null as unknown as AssessmentAnalytics);
    }
    const results = assessment.results ?? [];
    const completedResults = results.filter((r) => r.status === 'completed');
    return this.delayed({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        type: assessment.type,
        maxScore: assessment.maxScore,
        assessmentDate: assessment.assessmentDate,
        status: assessment.status
      },
      totalStudents: results.length,
      completedCount: completedResults.length,
      completionRate: results.length > 0 ? (completedResults.length / results.length) * 100 : 0,
      averageScore: completedResults.length > 0
        ? completedResults.reduce((sum, r) => sum + r.percentage, 0) / completedResults.length
        : 0,
      passRate: completedResults.length > 0
        ? (completedResults.filter((r) => r.percentage >= 60).length / completedResults.length) * 100
        : 0,
      questionStats: (assessment.questions ?? []).map((q) => ({
        questionId: q.id,
        questionText: q.questionText,
        topic: q.topic,
        difficulty: q.difficulty,
        points: q.points,
        correctRate: 0
      }))
    });
  }

  getStudentAssessmentHistory(studentId: number, courseId: number): Observable<StudentAssessmentHistory> {
    const student = this.students.find((s) => s.id === studentId);
    const courseAssessments = this.assessments.filter((a) => a.courseId === courseId);
    const history = courseAssessments.map((a) => ({
      assessment: {
        id: a.id,
        title: a.title,
        type: a.type,
        assessmentDate: a.assessmentDate,
        maxScore: a.maxScore,
        status: a.status
      },
      result: a.results?.find((r) => r.studentId === studentId) ?? null
    }));
    const completedResults = history
      .filter((h) => h.result !== null)
      .map((h) => ({ date: h.result!.completedAt, score: h.result!.percentage }));
    return this.delayed({
      student: {
        id: student?.id ?? 0,
        name: student ? `${student.firstName} ${student.lastName}` : '',
        studentId: student?.studentId ?? ''
      },
      history,
      trend: completedResults,
      statistics: {
        totalAssessments: courseAssessments.length,
        completedAssessments: completedResults.length,
        averageScore: completedResults.length > 0
          ? completedResults.reduce((sum, r) => sum + r.score, 0) / completedResults.length
          : 0,
        bestScore: completedResults.length > 0 ? Math.max(...completedResults.map((r) => r.score)) : 0
      }
    });
  }

  private generateMockQuestions(courseId: number): AssessmentQuestion[] {
    const topics = ['مفاهیم پایه', 'حل مسئله', 'درک مطلب', 'اعمال دانش', 'تحلیل'];
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard'];
    return difficulties.map((diff, i) => ({
      id: this.nextId('question'),
      type: 'multiple_choice' as const,
      questionText: `سوال ${i + 1} در مورد ${topics[i % topics.length]}`,
      optionsJson: JSON.stringify(['گزینه صحیح', 'گزینه غلط ۱', 'گزینه غلط ۲', 'گزینه غلط ۳']),
      correctAnswerJson: JSON.stringify({ correctOption: 0 }),
      points: diff === 'easy' ? 8 : diff === 'medium' ? 12 : 15,
      order: i,
      difficulty: diff,
      topic: topics[i % topics.length],
      explanation: 'توضیح پاسخ صحیح',
      assessmentId: 0,
      createdAt: this.now(),
      updatedAt: this.now()
    }));
  }
}
