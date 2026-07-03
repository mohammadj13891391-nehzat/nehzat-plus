import { Observable } from 'rxjs';

import {
  AdminSystemStatistics,
  ApiMessageResponse,
  ApproveUserPayload,
  Assignment,
  AssignmentAttachment,
  AssignmentSubmission,
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
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
  Madrasah,
  MaktabBranch,
  Parent,
  ParentStudentInfo,
  PendingUser,
  Student,
  StudentAssignmentGateState,
  StudentInfo,
  StudentProgressResponse,
  UpdateAttachmentPayload,
  UpdateMadrasahPayload,
  UpdateStudentPayload
} from '../models/lesson-planner.models';

export abstract class LessonPlannerApi {
  abstract signin(payload: AuthSigninPayload): Observable<AuthSigninResponse>;
  abstract signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse>;

  abstract seedDatabase(): Observable<ApiMessageResponse>;

  abstract getActiveCourses(): Observable<Course[]>;
  abstract getCourses(): Observable<Course[]>;
  abstract getCourseById(id: number): Observable<Course>;
  abstract createCourse(payload: CreateCoursePayload): Observable<Course>;
  abstract updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course>;
  abstract deleteCourse(id: number): Observable<ApiMessageResponse>;
  abstract getCourseAssignments(courseId: number): Observable<Assignment[]>;
  abstract createCourseAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment>;

  abstract getStudentProgress(studentId: number): Observable<StudentProgressResponse>;
  abstract getStudentSubmissions(studentId: number, assignmentId?: number): Observable<AssignmentSubmission[]>;
  abstract getAssignmentProgress(studentId: number, assignmentId: number): Observable<StudentAssignmentGateState>;
  abstract registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string
  ): Observable<StudentAssignmentGateState>;
  abstract submitAssignment(
    studentId: number,
    assignmentId: number,
    payload: FormData
  ): Observable<AssignmentSubmission>;
  abstract uploadSubmissionFile(
    studentId: number,
    submissionId: number,
    payload: FormData
  ): Observable<AssignmentSubmission>;

  abstract getAllStudents(): Observable<StudentInfo[]>;

  abstract getPendingUsers(): Observable<PendingUser[]>;
  abstract approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse>;
  abstract rejectUser(userId: number): Observable<ApiMessageResponse>;
  abstract createUser(payload: CreateUserPayload): Observable<CreatedUser>;

  abstract getAdminCourses(): Observable<Course[]>;
  abstract createAdminCourse(payload: CreateCoursePayload): Observable<Course>;
  abstract updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course>;
  abstract deleteAdminCourse(id: number): Observable<ApiMessageResponse>;
  abstract searchAdminCourses(query: string): Observable<Course[]>;
  abstract filterAdminCourses(status: string): Observable<Course[]>;

  abstract getAdminCourseAssignments(courseId: number): Observable<Assignment[]>;
  abstract getAssignmentById(id: number): Observable<Assignment>;
  abstract createAdminAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment>;
  abstract updateAdminAssignment(id: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment>;
  abstract deleteAdminAssignment(id: number): Observable<ApiMessageResponse>;
  abstract createDailyAssignments(
    courseId: number,
    payload: CreateDailySeriesPayload
  ): Observable<Assignment[]>;

  abstract getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]>;
  abstract createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment>;
  abstract uploadAttachmentFile(attachmentId: number, payload: FormData): Observable<AssignmentAttachment>;
  abstract updateAttachment(
    attachmentId: number,
    payload: UpdateAttachmentPayload
  ): Observable<AssignmentAttachment>;
  abstract deleteAttachment(attachmentId: number): Observable<ApiMessageResponse>;

  abstract getCoaches(): Observable<Coach[]>;
  abstract createCoach(payload: CreateCoachPayload): Observable<Coach>;
  abstract updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach>;
  abstract deleteCoach(id: number): Observable<ApiMessageResponse>;

  abstract getStudents(): Observable<Student[]>;
  abstract createStudent(payload: CreateStudentPayload): Observable<Student>;
  abstract updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student>;
  abstract deleteStudent(id: number): Observable<ApiMessageResponse>;

  abstract getBranchManagers(): Observable<BranchManager[]>;
  abstract createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager>;
  abstract updateBranchManager(id: number, payload: Partial<CreateBranchManagerPayload>): Observable<BranchManager>;
  abstract deleteBranchManager(id: number): Observable<ApiMessageResponse>;

  abstract getBranches(): Observable<Branch[]>;

  abstract getSystemStatistics(): Observable<AdminSystemStatistics>;
  abstract getCourseStatistics(courseId: number): Observable<unknown>;

  abstract getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]>;
  abstract enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse>;
  abstract unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse>;
  abstract generateCourseInviteCode(courseId: number): Observable<CourseInviteCode>;

  abstract getMadrasahs(): Observable<Madrasah[]>;
  abstract createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah>;
  abstract updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah>;
  abstract deleteMadrasah(id: number): Observable<ApiMessageResponse>;

  abstract getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]>;
  abstract createMaktabBranch(madrasahId: number, payload: CreateMaktabBranchPayload): Observable<MaktabBranch>;
  abstract deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse>;

  abstract getParents(): Observable<Parent[]>;
  abstract createParent(payload: CreateParentPayload): Observable<Parent>;
  abstract updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent>;
  abstract deleteParent(id: number): Observable<ApiMessageResponse>;
  abstract getParentStudents(parentId: number): Observable<ParentStudentInfo[]>;

  abstract getEvaluators(): Observable<Evaluator[]>;
  abstract createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator>;
  abstract updateEvaluator(id: number, payload: Partial<CreateEvaluatorPayload>): Observable<Evaluator>;
  abstract deleteEvaluator(id: number): Observable<ApiMessageResponse>;

  abstract getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]>;
  abstract createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord>;
  abstract deleteEvaluation(id: number): Observable<ApiMessageResponse>;

  abstract getHeadquartersSummary(): Observable<HeadquartersSummary>;
  abstract getBranchPerformance(): Observable<BranchPerformance[]>;
  abstract getCoachPerformance(): Observable<CoachPerformance[]>;
}
