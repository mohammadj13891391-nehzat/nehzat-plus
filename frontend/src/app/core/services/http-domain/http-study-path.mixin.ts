import { Constructor, HttpServiceContext } from './base';
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

export function WithStudyPath<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    // Admin: Study Paths CRUD
    getStudyPaths(): Observable<StudyPath[]> {
      return this.http.get<StudyPath[]>(this.url('/study-path'));
    }

    getStudyPath(id: number): Observable<StudyPath> {
      return this.http.get<StudyPath>(this.url(`/study-path/${id}`));
    }

    createStudyPath(payload: CreateStudyPathRequest): Observable<StudyPath> {
      return this.http.post<StudyPath>(this.url('/study-path'), payload);
    }

    updateStudyPath(id: number, payload: UpdateStudyPathRequest): Observable<StudyPath> {
      return this.http.put<StudyPath>(this.url(`/study-path/${id}`), payload);
    }

    deleteStudyPath(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/study-path/${id}`));
    }

    // Admin: Steps CRUD
    addStep(studyPathId: number, payload: CreateStudyPathStepRequest): Observable<StudyPathStep> {
      return this.http.post<StudyPathStep>(this.url(`/study-path/${studyPathId}/steps`), payload);
    }

    updateStep(stepId: number, payload: UpdateStudyPathStepRequest): Observable<StudyPathStep> {
      return this.http.put<StudyPathStep>(this.url(`/study-path/steps/${stepId}`), payload);
    }

    deleteStep(stepId: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/study-path/steps/${stepId}`));
    }

    reorderSteps(studyPathId: number, payload: ReorderStepsRequest): Observable<ApiMessageResponse> {
      return this.http.post<ApiMessageResponse>(this.url(`/study-path/${studyPathId}/steps/reorder`), payload);
    }

    // Admin: Accommodations
    getAccommodations(): Observable<Accommodation[]> {
      return this.http.get<Accommodation[]>(this.url('/study-path/accommodations'));
    }

    createAccommodation(payload: CreateAccommodationRequest): Observable<Accommodation> {
      return this.http.post<Accommodation>(this.url('/study-path/accommodations'), payload);
    }

    // Admin: Lookup data
    getStudyPathAgeGroups(): Observable<AgeGroup[]> {
      return this.http.get<AgeGroup[]>(this.url('/study-path/lookup/age-groups'));
    }

    getStudyPathSubjectAreas(): Observable<SubjectArea[]> {
      return this.http.get<SubjectArea[]>(this.url('/study-path/lookup/subject-areas'));
    }

    // Student: Enroll + Progress
    getAvailableStudyPaths(): Observable<StudyPath[]> {
      return this.http.get<StudyPath[]>(this.url('/study-path/available'));
    }

    enroll(payload: EnrollRequest): Observable<StudentStudyPath> {
      return this.http.post<StudentStudyPath>(this.url('/study-path/enroll'), payload);
    }

    getMyStudyPaths(): Observable<StudentStudyPath[]> {
      return this.http.get<StudentStudyPath[]>(this.url('/study-path/my-paths'));
    }

    getMyStudyPath(enrollmentId: number): Observable<StudentStudyPath> {
      return this.http.get<StudentStudyPath>(this.url(`/study-path/my-paths/${enrollmentId}`));
    }

    completeStep(payload: CompleteStepRequest): Observable<StudentStudyPath> {
      return this.http.post<StudentStudyPath>(
        this.url(`/study-path/${payload.studyPathId}/steps/${payload.stepId}/complete`),
        {},
      );
    }

    skipStep(payload: SkipStepRequest): Observable<StudentStudyPath> {
      return this.http.post<StudentStudyPath>(
        this.url(`/study-path/${payload.studyPathId}/steps/${payload.stepId}/skip`),
        {},
      );
    }

    // Analytics
    getStudyPathAnalytics(enrollmentId: number): Observable<StudyPathProgressAnalyticsDto> {
      return this.http.get<StudyPathProgressAnalyticsDto>(this.url(`/study-path/my-paths/${enrollmentId}/analytics`));
    }

    getMyOverallProgress(): Observable<StudentOverallProgressDto> {
      return this.http.get<StudentOverallProgressDto>(this.url('/study-path/my-progress'));
    }

    getCoachBranchProgress(branchId: number): Observable<CoachBranchProgressDto> {
      return this.http.get<CoachBranchProgressDto>(this.url(`/study-path/coach/branch/${branchId}/progress`));
    }

    getCoachStudentsProgress(branchId: number): Observable<CoachStudentProgressDto[]> {
      return this.http.get<CoachStudentProgressDto[]>(this.url(`/study-path/coach/branch/${branchId}/students-progress`));
    }
  };
}
