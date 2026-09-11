import { Observable } from 'rxjs';

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

export abstract class AdminUsersApi {
  abstract getPendingUsers(): Observable<PendingUser[]>;
  abstract approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse>;
  abstract rejectUser(userId: number): Observable<ApiMessageResponse>;
  abstract createUser(payload: CreateUserPayload): Observable<CreatedUser>;

  abstract getCoaches(): Observable<Coach[]>;
  abstract getMyCoaches(): Observable<Coach[]>;
  abstract createMyCoach(payload: CreateCoachPayload): Observable<Coach>;
  abstract updateMyCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach>;
  abstract deleteMyCoach(id: number): Observable<ApiMessageResponse>;

  abstract createCoach(payload: CreateCoachPayload): Observable<Coach>;
  abstract updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach>;
  abstract deleteCoach(id: number): Observable<ApiMessageResponse>;

  abstract getBranchManagers(): Observable<BranchManager[]>;
  abstract getMyBranchManagers(): Observable<BranchManager[]>;
  abstract createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager>;
  abstract updateBranchManager(
    id: number,
    payload: Partial<CreateBranchManagerPayload>,
  ): Observable<BranchManager>;
  abstract deleteBranchManager(id: number): Observable<ApiMessageResponse>;

  abstract getParents(): Observable<Parent[]>;
  abstract createParent(payload: CreateParentPayload): Observable<Parent>;
  abstract updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent>;
  abstract deleteParent(id: number): Observable<ApiMessageResponse>;
  abstract getParentStudents(parentId: number): Observable<ParentStudentInfo[]>;

  abstract getEvaluators(): Observable<Evaluator[]>;
  abstract createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator>;
  abstract updateEvaluator(
    id: number,
    payload: Partial<CreateEvaluatorPayload>,
  ): Observable<Evaluator>;
  abstract deleteEvaluator(id: number): Observable<ApiMessageResponse>;

  abstract getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]>;
  abstract createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord>;
  abstract deleteEvaluation(id: number): Observable<ApiMessageResponse>;

  abstract getTeachers(): Observable<Teacher[]>;
  abstract getTeacherById(id: number): Observable<Teacher>;
  abstract createTeacher(payload: CreateTeacherPayload): Observable<Teacher>;
  abstract updateTeacher(id: number, payload: UpdateTeacherPayload): Observable<Teacher>;
  abstract deleteTeacher(id: number): Observable<ApiMessageResponse>;
  abstract getTeachersByCourse(courseId: number): Observable<Teacher[]>;
  abstract getTeacherDashboardSummary(teacherId: number): Observable<TeacherDashboardSummary>;
  abstract getTeacherCourses(teacherId: number): Observable<any[]>;
  abstract getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]>;
  abstract getPendingGradings(teacherId: number): Observable<any[]>;
  abstract gradeSubmission(payload: GradeSubmissionPayload): Observable<AssignmentGrading>;
}
