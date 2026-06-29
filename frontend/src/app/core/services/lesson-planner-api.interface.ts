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
  Coach,
  Course,
  CreateAssignmentPayload,
  CreateCoachPayload,
  CreateCoursePayload,
  CreateDailySeriesPayload,
  PendingUser,
  StudentAssignmentGateState,
  StudentInfo,
  StudentProgressResponse,
  UpdateAttachmentPayload
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

  abstract getSystemStatistics(): Observable<AdminSystemStatistics>;
  abstract getCourseStatistics(courseId: number): Observable<unknown>;
}
