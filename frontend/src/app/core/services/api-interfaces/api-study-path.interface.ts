import { Observable } from 'rxjs';

import {
  Accommodation,
  AgeGroup,
  ApiMessageResponse,
  CoachBranchProgressDto,
  CoachStudentProgressDto,
  CompleteStepRequest,
  CreateAccommodationRequest,
  CreateStudyPathRequest,
  CreateStudyPathStepRequest,
  EnrollRequest,
  ReorderStepsRequest,
  SkipStepRequest,
  StudentStudyPath,
  StudyPath,
  StudyPathProgressAnalyticsDto,
  StudyPathStep,
  StudentOverallProgressDto,
  SubjectArea,
  UpdateStudyPathRequest,
  UpdateStudyPathStepRequest,
} from '../../models/lesson-planner.models';

export abstract class StudyPathApi {
  // Admin: Study Paths CRUD
  abstract getStudyPaths(): Observable<StudyPath[]>;
  abstract getStudyPath(id: number): Observable<StudyPath>;
  abstract createStudyPath(payload: CreateStudyPathRequest): Observable<StudyPath>;
  abstract updateStudyPath(id: number, payload: UpdateStudyPathRequest): Observable<StudyPath>;
  abstract deleteStudyPath(id: number): Observable<ApiMessageResponse>;

  // Admin: Steps CRUD
  abstract addStep(studyPathId: number, payload: CreateStudyPathStepRequest): Observable<StudyPathStep>;
  abstract updateStep(stepId: number, payload: UpdateStudyPathStepRequest): Observable<StudyPathStep>;
  abstract deleteStep(stepId: number): Observable<ApiMessageResponse>;
  abstract reorderSteps(studyPathId: number, payload: ReorderStepsRequest): Observable<ApiMessageResponse>;

  // Admin: Accommodatons
  abstract getAccommodations(): Observable<Accommodation[]>;
  abstract createAccommodation(payload: CreateAccommodationRequest): Observable<Accommodation>;

  // Admin: Lookup data
  abstract getStudyPathAgeGroups(): Observable<AgeGroup[]>;
  abstract getStudyPathSubjectAreas(): Observable<SubjectArea[]>;

  // Student: Enroll + Progress
  abstract getAvailableStudyPaths(): Observable<StudyPath[]>;
  abstract enroll(payload: EnrollRequest): Observable<StudentStudyPath>;
  abstract getMyStudyPaths(): Observable<StudentStudyPath[]>;
  abstract getMyStudyPath(enrollmentId: number): Observable<StudentStudyPath>;
  abstract completeStep(payload: CompleteStepRequest): Observable<StudentStudyPath>;
  abstract skipStep(payload: SkipStepRequest): Observable<StudentStudyPath>;

  // Analytics
  abstract getStudyPathAnalytics(enrollmentId: number): Observable<StudyPathProgressAnalyticsDto>;
  abstract getMyOverallProgress(): Observable<StudentOverallProgressDto>;
  abstract getCoachBranchProgress(branchId: number): Observable<CoachBranchProgressDto>;
  abstract getCoachStudentsProgress(branchId: number): Observable<CoachStudentProgressDto[]>;
}
