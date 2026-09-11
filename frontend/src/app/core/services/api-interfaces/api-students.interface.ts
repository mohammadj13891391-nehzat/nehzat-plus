import { Observable } from 'rxjs';

import {
  ApiMessageResponse,
  AssignmentSubmission,
  BiweeklyProgressResponse,
  CourseEnrollment,
  CourseInviteCode,
  CreateStudentPayload,
  Student,
  StudentAssignmentGateState,
  StudentInfo,
  StudentProgressResponse,
  StudentProgressSummary,
  UpdateStudentPayload,
} from '../../models/lesson-planner.models';

export abstract class StudentsApi {
  abstract getStudentProgress(studentId: number): Observable<StudentProgressResponse>;
  abstract getStudentSubmissions(
    studentId: number,
    assignmentId?: number,
  ): Observable<AssignmentSubmission[]>;
  abstract getAssignmentProgress(
    studentId: number,
    assignmentId: number,
  ): Observable<StudentAssignmentGateState>;
  abstract registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string,
  ): Observable<StudentAssignmentGateState>;
  abstract submitAssignment(
    studentId: number,
    assignmentId: number,
    payload: FormData,
  ): Observable<AssignmentSubmission>;
  abstract uploadSubmissionFile(
    studentId: number,
    submissionId: number,
    payload: FormData,
  ): Observable<AssignmentSubmission>;

  abstract getAllStudents(): Observable<StudentInfo[]>;
  abstract getStudents(): Observable<Student[]>;
  /** Coach-accessible student list (GET /students — StudentController allows coach). */
  abstract getCoachStudents(): Observable<Student[]>;
  abstract getMyStudents(): Observable<Student[]>;
  abstract createStudent(payload: CreateStudentPayload): Observable<Student>;
  abstract updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student>;
  abstract deleteStudent(id: number): Observable<ApiMessageResponse>;

  abstract getProgressSummary(studentId: number): Observable<StudentProgressSummary>;
  abstract syncFromSubmission(submissionId: number): Observable<ApiMessageResponse>;
  abstract getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse>;

  abstract getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]>;
  abstract enrollStudentInCourse(
    courseId: number,
    studentId: number,
  ): Observable<ApiMessageResponse>;
  abstract unenrollStudentFromCourse(
    courseId: number,
    studentId: number,
  ): Observable<ApiMessageResponse>;
  abstract generateCourseInviteCode(courseId: number): Observable<CourseInviteCode>;
}
