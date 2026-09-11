import { Observable } from 'rxjs';

import {
  ApiMessageResponse,
  Assessment,
  AssessmentAnalytics,
  AssessmentQuestion,
  AssessmentQuestionPayload,
  AssessmentResult,
  BranchPerformance,
  CoachPerformance,
  EvaluationRecord,
  GenerateWeeklyAssessmentPayload,
  HeadquartersSummary,
  StudentAssessmentHistory,
  StudentSkillProgress,
  SubmitAssessmentResultPayload,
  UpdateSkillProgressPayload,
} from '../../models/lesson-planner.models';

export abstract class AssessmentsApi {
    abstract getAssessments(): Observable<Assessment[]>;
    abstract getAssessmentById(id: number): Observable<Assessment>;
    abstract getAssessmentsByCourse(courseId: number): Observable<Assessment[]>;
    abstract getAssessmentsByDateRange(
      courseId: number,
      startDate: string,
      endDate: string,
    ): Observable<Assessment[]>;
    abstract createAssessment(payload: Partial<Assessment>): Observable<Assessment>;
    abstract updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment>;
    abstract deleteAssessment(id: number): Observable<ApiMessageResponse>;
    abstract generateWeeklyAssessment(
      payload: GenerateWeeklyAssessmentPayload,
    ): Observable<Assessment>;

    abstract getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]>;
    abstract createAssessmentQuestion(
      assessmentId: number,
      payload: AssessmentQuestionPayload,
    ): Observable<AssessmentQuestion>;
    abstract updateAssessmentQuestion(
      questionId: number,
      payload: AssessmentQuestionPayload,
    ): Observable<AssessmentQuestion>;
    abstract deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse>;

    abstract submitAssessmentResult(
      assessmentId: number,
      payload: SubmitAssessmentResultPayload,
    ): Observable<AssessmentResult>;
    abstract startAssessment(assessmentId: number, studentId: number): Observable<AssessmentResult>;
    abstract getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]>;
    abstract getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]>;
    abstract getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics>;
    abstract getStudentAssessmentHistory(
      studentId: number,
      courseId: number,
    ): Observable<StudentAssessmentHistory>;

    abstract getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]>;

    abstract getHeadquartersSummary(): Observable<HeadquartersSummary>;
    abstract getBranchPerformance(): Observable<BranchPerformance[]>;
    abstract getCoachPerformance(): Observable<CoachPerformance[]>;
    abstract getMyCoachPerformance(): Observable<CoachPerformance[]>;

    abstract getSkillProgressByStudent(studentId: number): Observable<StudentSkillProgress[]>;
    abstract getSkillProgressByRing(ringId: number): Observable<StudentSkillProgress[]>;
    abstract updateSkillProgress(
      id: number,
      payload: UpdateSkillProgressPayload,
    ): Observable<StudentSkillProgress>;
}
