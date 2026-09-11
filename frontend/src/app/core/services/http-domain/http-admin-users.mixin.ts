import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  ApiMessageResponse,
  ApproveUserPayload,
  AssignmentGrading,
  BranchManager,
  Coach,
  CreatedUser,
  CreateBranchManagerPayload,
  CreateCoachPayload,
  CreateEvaluatorPayload,
  CreateParentPayload,
  CreateTeacherPayload,
  CreateUserPayload,
  Evaluator,
  EvaluationRecord,
  CreateEvaluationPayload,
  GradeSubmissionPayload,
  Parent,
  ParentStudentInfo,
  PendingUser,
  Teacher,
  TeacherDashboardSummary,
  UpdateTeacherPayload,
} from '../../models/lesson-planner.models';

export function WithAdminUsers<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getPendingUsers(): Observable<PendingUser[]> {
      return this.http.get<PendingUser[]>(this.url('/admin/users/pending'));
    }

    approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(
        this.url(`/admin/users/${userId}/approve`),
        payload,
      );
    }

    rejectUser(userId: number): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(this.url(`/admin/users/${userId}/reject`), {});
    }

    createUser(payload: CreateUserPayload): Observable<CreatedUser> {
      return this.http.post<CreatedUser>(this.url('/admin/users'), payload);
    }

    getCoaches(): Observable<Coach[]> {
      return this.http.get<Coach[]>(this.url('/admin/coaches'));
    }

    getMyCoaches(): Observable<Coach[]> {
      return this.http.get<Coach[]>(this.url('/branch-manager/coaches'));
    }

    createMyCoach(payload: CreateCoachPayload): Observable<Coach> {
      return this.http.post<Coach>(this.url('/branch-manager/coaches'), payload);
    }

    updateMyCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
      return this.http.put<Coach>(this.url(`/branch-manager/coaches/${id}`), payload);
    }

    deleteMyCoach(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/branch-manager/coaches/${id}`));
    }

    createCoach(payload: CreateCoachPayload): Observable<Coach> {
      return this.http.post<Coach>(this.url('/admin/coaches'), payload);
    }

    updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
      return this.http.put<Coach>(this.url(`/admin/coaches/${id}`), payload);
    }

    deleteCoach(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/coaches/${id}`));
    }

    getBranchManagers(): Observable<BranchManager[]> {
      return this.http.get<BranchManager[]>(this.url('/admin/branch-managers'));
    }

    getMyBranchManagers(): Observable<BranchManager[]> {
      return this.http.get<BranchManager[]>(this.url('/branch-manager/branch-managers'));
    }

    createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager> {
      return this.http.post<BranchManager>(this.url('/admin/branch-managers'), payload);
    }

    updateBranchManager(
      id: number,
      payload: Partial<CreateBranchManagerPayload>,
    ): Observable<BranchManager> {
      return this.http.put<BranchManager>(this.url(`/admin/branch-managers/${id}`), payload);
    }

    deleteBranchManager(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/branch-managers/${id}`));
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

    getEvaluators(): Observable<Evaluator[]> {
      return this.http.get<Evaluator[]>(this.url('/admin/evaluators'));
    }

    createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator> {
      return this.http.post<Evaluator>(this.url('/admin/evaluators'), payload);
    }

    updateEvaluator(id: number, payload: Partial<CreateEvaluatorPayload>): Observable<Evaluator> {
      return this.http.put<Evaluator>(this.url(`/admin/evaluators/${id}`), payload);
    }

    deleteEvaluator(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/evaluators/${id}`));
    }

    getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]> {
      let params = new HttpParams();
      if (evaluatorId !== undefined) {
        params = params.set('evaluatorId', String(evaluatorId));
      }
      return this.http.get<EvaluationRecord[]>(this.url('/admin/evaluations'), { params });
    }

    createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord> {
      return this.http.post<EvaluationRecord>(this.url('/admin/evaluations'), payload);
    }

    deleteEvaluation(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/evaluations/${id}`));
    }

    getTeachers(): Observable<Teacher[]> {
      return this.http.get<Teacher[]>(this.url('/teachers'));
    }

    getTeacherById(id: number): Observable<Teacher> {
      return this.http.get<Teacher>(this.url(`/api/teachers/${id}`));
    }

    createTeacher(payload: CreateTeacherPayload): Observable<Teacher> {
      return this.http.post<Teacher>(this.url('/teachers'), payload);
    }

    updateTeacher(id: number, payload: UpdateTeacherPayload): Observable<Teacher> {
      return this.http.put<Teacher>(this.url(`/api/teachers/${id}`), payload);
    }

    deleteTeacher(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/api/teachers/${id}`));
    }

    getTeachersByCourse(courseId: number): Observable<Teacher[]> {
      return this.http.get<Teacher[]>(this.url(`/api/teachers/by-course/${courseId}`));
    }

    getTeacherDashboardSummary(teacherId: number): Observable<TeacherDashboardSummary> {
      return this.http.get<TeacherDashboardSummary>(
        this.url(`/api/teachers/dashboard-summary/${teacherId}`),
      );
    }

    getTeacherCourses(teacherId: number): Observable<any[]> {
      return this.http.get<any[]>(this.url(`/api/teachers/courses/${teacherId}`));
    }

    getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
      return this.http.get<AssignmentGrading[]>(this.url(`/api/teachers/gradings/${teacherId}`));
    }

    getPendingGradings(teacherId: number): Observable<any[]> {
      return this.http.get<any[]>(this.url(`/api/teachers/pending-gradings/${teacherId}`));
    }

    gradeSubmission(payload: GradeSubmissionPayload): Observable<AssignmentGrading> {
      return this.http.post<AssignmentGrading>(this.url('/api/teachers/grade'), payload);
    }
  };
}
