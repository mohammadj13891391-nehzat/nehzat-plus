import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AdminCourseStatistics,
  AdminSystemStatistics,
  ApiMessageResponse,
  ApproveUserPayload,
  Assignment,
  AssignmentAttachment,
  AssignmentProgressResponse,
  AssignmentSubmission,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  BranchManager,
  Coach,
  CourseEnrollment,
  CourseInviteCode,
  CreateAssignmentPayload,
  CreateBranchManagerPayload,
  CreateCoachPayload,
  CreateCoursePayload,
  CreateDailySeriesPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  CreateParentPayload,
  Course,
  Madrasah,
  MaktabBranch,
  Parent,
  ParentStudentInfo,
  PendingUser,
  StudentInfo,
  StudentProgressResponse,
  UpdateMadrasahPayload
} from '../models/lesson-planner.models';
import { LessonPlannerApi } from './lesson-planner-api.interface';
import { resolveApiBaseUrl } from './api-url.util';

@Injectable()
export class HttpLessonPlannerApi extends LessonPlannerApi {
  private readonly http = inject(HttpClient);

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    return this.http.post<AuthSigninResponse>(this.url('/auth/signin'), payload);
  }

  signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse> {
    return this.http.post<AuthSignupResponse>(this.url('/auth/signup'), this.toSignupBody(payload));
  }

  seedDatabase(): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url('/seeder/seed'), {});
  }

  getActiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.url('/courses/active'));
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.url('/courses'));
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(this.url(`/courses/${id}`));
  }

  createCourse(payload: CreateCoursePayload): Observable<Course> {
    return this.http.post<Course>(this.url('/courses'), payload);
  }

  updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
    return this.http.put<Course>(this.url(`/courses/${id}`), payload);
  }

  deleteCourse(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/courses/${id}`));
  }

  getCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.url(`/courses/${courseId}/assignments`));
  }

  createCourseAssignment(courseId: number, payload: CreateAssignmentPayload): Observable<Assignment> {
    return this.http.post<Assignment>(this.url(`/courses/${courseId}/assignments`), payload);
  }

  getStudentProgress(studentId: number): Observable<StudentProgressResponse> {
    return this.http.get<StudentProgressResponse>(this.url(`/students/${studentId}/progress`));
  }

  getStudentSubmissions(studentId: number, assignmentId?: number): Observable<AssignmentSubmission[]> {
    let params = new HttpParams();
    if (assignmentId !== undefined) {
      params = params.set('assignmentId', String(assignmentId));
    }
    return this.http.get<AssignmentSubmission[]>(this.url(`/students/${studentId}/submissions`), { params });
  }

  getAssignmentProgress(studentId: number, assignmentId: number): Observable<AssignmentProgressResponse> {
    return this.http.get<AssignmentProgressResponse>(this.url(`/students/${studentId}/assignments/${assignmentId}/progress`));
  }

  registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string
  ): Observable<AssignmentProgressResponse> {
    return this.http.post<AssignmentProgressResponse>(
      this.url(`/students/${studentId}/assignments/${assignmentId}/progress/listen`),
      {
        instructionAudioVersion
      }
    );
  }

  submitAssignment(studentId: number, assignmentId: number, payload: FormData): Observable<AssignmentSubmission> {
    return this.http.post<AssignmentSubmission>(
      this.url(`/students/${studentId}/assignments/${assignmentId}/submit`),
      payload
    );
  }

  uploadSubmissionFile(studentId: number, submissionId: number, payload: FormData): Observable<AssignmentSubmission> {
    return this.http.post<AssignmentSubmission>(
      this.url(`/students/${studentId}/submissions/${submissionId}/upload`),
      payload
    );
  }

  getAllStudents(): Observable<StudentInfo[]> {
    return this.http.get<StudentInfo[]>(this.url('/students'));
  }

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(this.url('/admin/users/pending'));
  }

  approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url(`/admin/users/${userId}/approve`), payload);
  }

  rejectUser(userId: number): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url(`/admin/users/${userId}/reject`), {});
  }

  getAdminCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.url('/admin/courses'));
  }

  createAdminCourse(payload: CreateCoursePayload): Observable<Course> {
    return this.http.post<Course>(this.url('/admin/courses'), payload);
  }

  updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
    return this.http.put<Course>(this.url(`/admin/courses/${id}`), payload);
  }

  deleteAdminCourse(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/courses/${id}`));
  }

  searchAdminCourses(query: string): Observable<Course[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Course[]>(this.url('/admin/courses/search'), { params });
  }

  filterAdminCourses(status: string): Observable<Course[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Course[]>(this.url('/admin/courses/filter'), { params });
  }

  getAdminCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.url(`/admin/courses/${courseId}/assignments`));
  }

  getAssignmentById(id: number): Observable<Assignment> {
    return this.http.get<Assignment>(this.url(`/admin/assignments/${id}`));
  }

  createAdminAssignment(courseId: number, payload: CreateAssignmentPayload): Observable<Assignment> {
    return this.http.post<Assignment>(this.url(`/admin/courses/${courseId}/assignments`), payload);
  }

  updateAdminAssignment(id: number, payload: CreateAssignmentPayload): Observable<Assignment> {
    return this.http.put<Assignment>(this.url(`/admin/assignments/${id}`), payload);
  }

  deleteAdminAssignment(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/assignments/${id}`));
  }

  createDailyAssignments(courseId: number, payload: CreateDailySeriesPayload): Observable<Assignment[]> {
    return this.http.post<Assignment[]>(this.url(`/admin/courses/${courseId}/assignments/daily-series`), payload);
  }

  getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]> {
    return this.http.get<AssignmentAttachment[]>(this.url(`/admin/assignments/${assignmentId}/attachments`));
  }

  createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    return this.http.post<AssignmentAttachment>(this.url(`/admin/assignments/${assignmentId}/attachments`), payload);
  }

  uploadAttachmentFile(attachmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    return this.http.post<AssignmentAttachment>(this.url(`/admin/attachments/${attachmentId}/upload`), payload);
  }

  updateAttachment(attachmentId: number, payload: Partial<AssignmentAttachment>): Observable<AssignmentAttachment> {
    return this.http.put<AssignmentAttachment>(this.url(`/admin/attachments/${attachmentId}`), payload);
  }

  deleteAttachment(attachmentId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/attachments/${attachmentId}`));
  }

  getCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(this.url('/admin/coaches'));
  }

  createCoach(payload: CreateCoachPayload): Observable<Coach> {
    return this.http.post<Coach>(this.url('/admin/coaches'), payload);
  }

  updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
    return this.http.put<Coach>(this.url(`/admin/coaches/${id}`), payload);
  }

  getBranchManagers(): Observable<BranchManager[]> {
    return this.http.get<BranchManager[]>(this.url('/admin/branch-managers'));
  }

  createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager> {
    return this.http.post<BranchManager>(this.url('/admin/branch-managers'), payload);
  }

  updateBranchManager(id: number, payload: Partial<CreateBranchManagerPayload>): Observable<BranchManager> {
    return this.http.put<BranchManager>(this.url(`/admin/branch-managers/${id}`), payload);
  }

  deleteBranchManager(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/branch-managers/${id}`));
  }

  deleteCoach(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/coaches/${id}`));
  }

  getSystemStatistics(): Observable<AdminSystemStatistics> {
    return this.http.get<AdminSystemStatistics>(this.url('/admin/statistics'));
  }

  getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]> {
    return this.http.get<CourseEnrollment[]>(this.url(`/admin/courses/${courseId}/enrollments`));
  }

  enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url(`/admin/courses/${courseId}/enroll`), { studentId });
  }

  unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url(`/admin/courses/${courseId}/unenroll`), { studentId });
  }

  generateCourseInviteCode(courseId: number): Observable<CourseInviteCode> {
    return this.http.post<CourseInviteCode>(this.url(`/admin/courses/${courseId}/invite-code`), {});
  }

  getMadrasahs(): Observable<Madrasah[]> {
    return this.http.get<Madrasah[]>(this.url('/admin/madrasahs'));
  }

  createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah> {
    return this.http.post<Madrasah>(this.url('/admin/madrasahs'), payload);
  }

  updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah> {
    return this.http.put<Madrasah>(this.url(`/admin/madrasahs/${id}`), payload);
  }

  deleteMadrasah(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/madrasahs/${id}`));
  }

  getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]> {
    return this.http.get<MaktabBranch[]>(this.url(`/admin/madrasahs/${madrasahId}/branches`));
  }

  createMaktabBranch(madrasahId: number, payload: CreateMaktabBranchPayload): Observable<MaktabBranch> {
    return this.http.post<MaktabBranch>(this.url(`/admin/madrasahs/${madrasahId}/branches`), payload);
  }

  deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/madrasahs/${madrasahId}/branches/${branchId}`));
  }

  getParents(): Observable<Parent[]> {
    return this.http.get<Parent[]>(this.url('/admin/parents'));
  }

  createParent(payload: CreateParentPayload): Observable<Parent> {
    return this.http.post<Parent>(this.url('/admin/parents'), payload);
  }

  updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent> {
    return this.http.put<Parent>(this.url(`/admin/parents/${id}`), payload);
  }

  deleteParent(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/parents/${id}`));
  }

  getParentStudents(parentId: number): Observable<ParentStudentInfo[]> {
    return this.http.get<ParentStudentInfo[]>(this.url(`/admin/parents/${parentId}/students`));
  }

  getCourseStatistics(courseId: number): Observable<AdminCourseStatistics> {
    return this.http.get<AdminCourseStatistics>(this.url(`/admin/courses/${courseId}/statistics`));
  }

  private url(path: string): string {
    return `${resolveApiBaseUrl()}${path}`;
  }

  private toSignupBody(payload: AuthSignupPayload | FormData): FormData | Omit<AuthSignupPayload, 'userImage'> {
    if (payload instanceof FormData) {
      return payload;
    }

    if (!payload.userImage) {
      const { userImage: _unused, ...withoutImage } = payload;
      return withoutImage;
    }

    const formData = new FormData();
    formData.set('firstName', payload.firstName);
    formData.set('lastName', payload.lastName);
    formData.set('username', payload.username);
    formData.set('email', payload.email);
    formData.set('phoneNumber', payload.phoneNumber);
    formData.set('password', payload.password);
    formData.set('userImage', payload.userImage);
    return formData;
  }
}
