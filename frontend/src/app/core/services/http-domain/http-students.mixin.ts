import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  ApiMessageResponse,
  AssignmentProgressResponse,
  AssignmentSubmission,
  BiweeklyProgressResponse,
  CourseEnrollment,
  CourseInviteCode,
  CreateStudentPayload,
  Student,
  StudentInfo,
  StudentProgressResponse,
  StudentProgressSummary,
  UpdateStudentPayload,
} from '../../models/lesson-planner.models';

export function WithStudents<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getStudentProgress(studentId: number): Observable<StudentProgressResponse> {
      return this.http.get<StudentProgressResponse>(this.url(`/students/${studentId}/progress`));
    }

    getStudentSubmissions(
      studentId: number,
      assignmentId?: number,
    ): Observable<AssignmentSubmission[]> {
      let params = new HttpParams();
      if (assignmentId !== undefined) {
        params = params.set('assignmentId', String(assignmentId));
      }
      return this.http.get<AssignmentSubmission[]>(this.url(`/students/${studentId}/submissions`), {
        params,
      });
    }

    getAssignmentProgress(
      studentId: number,
      assignmentId: number,
    ): Observable<AssignmentProgressResponse> {
      return this.http.get<AssignmentProgressResponse>(
        this.url(`/students/${studentId}/assignments/${assignmentId}/progress`),
      );
    }

    registerAssignmentListenCompletion(
      studentId: number,
      assignmentId: number,
      instructionAudioVersion?: string,
    ): Observable<AssignmentProgressResponse> {
      return this.http.post<AssignmentProgressResponse>(
        this.url(`/students/${studentId}/assignments/${assignmentId}/progress/listen`),
        {
          instructionAudioVersion,
        },
      );
    }

    submitAssignment(
      studentId: number,
      assignmentId: number,
      payload: FormData,
    ): Observable<AssignmentSubmission> {
      return this.http.post<AssignmentSubmission>(
        this.url(`/students/${studentId}/assignments/${assignmentId}/submit`),
        payload,
      );
    }

    uploadSubmissionFile(
      studentId: number,
      submissionId: number,
      payload: FormData,
    ): Observable<AssignmentSubmission> {
      return this.http.post<AssignmentSubmission>(
        this.url(`/students/${studentId}/submissions/${submissionId}/upload`),
        payload,
      );
    }

    getAllStudents(): Observable<StudentInfo[]> {
      return this.http.get<StudentInfo[]>(this.url('/students'));
    }

    getStudents(): Observable<Student[]> {
      return this.http.get<Student[]>(this.url('/students'));
    }

    getCoachStudents(): Observable<Student[]> {
      return this.http.get<Student[]>(this.url('/students'));
    }

    getMyStudents(): Observable<Student[]> {
      return this.http.get<Student[]>(this.url('/branch-manager/students'));
    }

    createStudent(payload: CreateStudentPayload): Observable<Student> {
      return this.http.post<Student>(this.url('/students'), payload);
    }

    updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student> {
      return this.http.put<Student>(this.url(`/students/${id}`), payload);
    }

    deleteStudent(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/students/${id}`));
    }

    getProgressSummary(studentId: number): Observable<StudentProgressSummary> {
      return this.http.get<StudentProgressSummary>(
        this.url(`/skill-progress/students/${studentId}/summary`),
      );
    }

    syncFromSubmission(submissionId: number): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(
        this.url(`/skill-progress/sync-from-submission/${submissionId}`),
        {},
      );
    }

    getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse> {
      return this.http.get<BiweeklyProgressResponse>(
        this.url(`/students/${studentId}/progress/biweekly`),
      );
    }

    getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]> {
      return this.http.get<CourseEnrollment[]>(this.url(`/admin/courses/${courseId}/enrollments`));
    }

    enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(this.url(`/admin/courses/${courseId}/enroll`), {
        studentId,
      });
    }

    unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(this.url(`/admin/courses/${courseId}/unenroll`), {
        studentId,
      });
    }

    generateCourseInviteCode(courseId: number): Observable<CourseInviteCode> {
      return this.http.post<CourseInviteCode>(
        this.url(`/admin/courses/${courseId}/invite-code`),
        {},
      );
    }
  };
}
