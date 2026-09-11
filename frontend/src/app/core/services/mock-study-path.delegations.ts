import { Observable } from 'rxjs';
import { MockLessonPlannerApiBase, type MockApiCtor } from './mock-lesson-planner-base';
import {
  type CompleteStepRequest,
  type EnrollRequest,
  type SkipStepRequest,
  CoachBranchProgressDto,
  CoachStudentProgressDto,
  StudentOverallProgressDto,
  StudyPathProgressAnalyticsDto,
} from '../models/lesson-planner.models';

/** studyPath delegation mixin: forwards to the injected MockStudyPathService instance. */
export function withStudyPath<T extends MockApiCtor>(Base: T) {
  return class extends Base {
    // Admin: Study Paths CRUD
    getStudyPaths(): Observable<any[]> {
      return this.studyPath.getStudyPaths();
    }

    getStudyPath(id: number): Observable<any> {
      return this.studyPath.getStudyPath(id);
    }

    createStudyPath(payload: any): Observable<any> {
      return this.studyPath.createStudyPath(payload);
    }

    updateStudyPath(id: number, payload: any): Observable<any> {
      return this.studyPath.updateStudyPath(id, payload);
    }

    deleteStudyPath(id: number): Observable<any> {
      return this.studyPath.deleteStudyPath(id);
    }

    // Admin: Steps CRUD
    addStep(studyPathId: number, payload: any): Observable<any> {
      return this.studyPath.addStep(studyPathId, payload);
    }

    updateStep(stepId: number, payload: any): Observable<any> {
      return this.studyPath.updateStep(stepId, payload);
    }

    deleteStep(stepId: number): Observable<any> {
      return this.studyPath.deleteStep(stepId);
    }

    reorderSteps(studyPathId: number, payload: any): Observable<any> {
      return this.studyPath.reorderSteps(studyPathId, payload);
    }

    // Admin: Accommodations
    getAccommodations(): Observable<any[]> {
      return this.studyPath.getAccommodations();
    }

    createAccommodation(payload: any): Observable<any> {
      return this.studyPath.createAccommodation(payload);
    }

    // Admin: Lookup data
    getStudyPathAgeGroups(): Observable<any[]> {
      return this.studyPath.getStudyPathAgeGroups();
    }

    getStudyPathSubjectAreas(): Observable<any[]> {
      return this.studyPath.getStudyPathSubjectAreas();
    }

    // Student: Enroll + Progress
    getAvailableStudyPaths(): Observable<any[]> {
      return this.studyPath.getAvailableStudyPaths();
    }

    enroll(payload: EnrollRequest): Observable<any> {
      return this.studyPath.enroll(payload);
    }

    getMyStudyPaths(): Observable<any[]> {
      return this.studyPath.getMyStudyPaths();
    }

    getMyStudyPath(enrollmentId: number): Observable<any> {
      return this.studyPath.getMyStudyPath(enrollmentId);
    }

    completeStep(payload: CompleteStepRequest): Observable<any> {
      return this.studyPath.completeStep(payload);
    }

    skipStep(payload: SkipStepRequest): Observable<any> {
      return this.studyPath.skipStep(payload);
    }

    // Analytics
    getStudyPathAnalytics(enrollmentId: number): Observable<StudyPathProgressAnalyticsDto> {
      return this.studyPath.getStudyPathAnalytics(enrollmentId);
    }

    getMyOverallProgress(): Observable<StudentOverallProgressDto> {
      return this.studyPath.getMyOverallProgress();
    }

    getCoachBranchProgress(branchId: number): Observable<CoachBranchProgressDto> {
      return this.studyPath.getCoachBranchProgress(branchId);
    }

    getCoachStudentsProgress(branchId: number): Observable<CoachStudentProgressDto[]> {
      return this.studyPath.getCoachStudentsProgress(branchId);
    }
  };
}
