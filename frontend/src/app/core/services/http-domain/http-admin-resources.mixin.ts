import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import {
  AdminSystemStatistics,
  AdminCourseStatistics,
  AgeGroup,
  ApiMessageResponse,
  Book,
  Branch,
  BranchPerformance,
  CoachPerformance,
  CourseEnrollment,
  CourseInviteCode,
  CreateBookPayload,
  CreateBranchPayload,
  CreateCurriculumObjectivePayload,
  CreateCurriculumVersionPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  CreateSubjectAreaPayload,
  CreateTeachingMethodPayload,
  CurriculumObjective,
  CurriculumVersion,
  HeadquartersSummary,
  Madrasah,
  MaktabBranch,
  StudentSkillProgress,
  SubjectArea,
  TeachingMethod,
  UpdateBookPayload,
  UpdateBranchPayload,
  UpdateCurriculumObjectivePayload,
  UpdateCurriculumVersionPayload,
  UpdateMadrasahPayload,
  UpdateSkillProgressPayload,
  UpdateSubjectAreaPayload,
  UpdateTeachingMethodPayload,
} from '../../models/lesson-planner.models';

export function WithAdminResources<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getBranches(): Observable<Branch[]> {
      return this.http.get<Branch[]>(this.url('/admin/branches'));
    }

    getMyBranch(): Observable<Branch> {
      return this.http.get<Branch>(this.url('/branch-manager/branch'));
    }

    getMyBranchPerformance(): Observable<BranchPerformance> {
      return this.http.get<BranchPerformance>(this.url('/branch-manager/branch-performance'));
    }

    getMyCoachPerformance(): Observable<CoachPerformance[]> {
      return this.http.get<CoachPerformance[]>(this.url('/branch-manager/coach-performance'));
    }

    createBranch(payload: CreateBranchPayload): Observable<Branch> {
      return this.http.post<Branch>(this.url('/admin/branches'), payload);
    }

    updateBranch(id: number, payload: UpdateBranchPayload): Observable<Branch> {
      return this.http.put<Branch>(this.url(`/admin/branches/${id}`), payload);
    }

    deleteBranch(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/admin/branches/${id}`));
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

    createMaktabBranch(
      madrasahId: number,
      payload: CreateMaktabBranchPayload,
    ): Observable<MaktabBranch> {
      return this.http.post<MaktabBranch>(
        this.url(`/admin/madrasahs/${madrasahId}/branches`),
        payload,
      );
    }

    deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(
        this.url(`/admin/madrasahs/${madrasahId}/branches/${branchId}`),
      );
    }

    getSubjectAreas(): Observable<SubjectArea[]> {
      return this.http.get<SubjectArea[]>(this.url('/curriculum/subject-areas'));
    }

    createSubjectArea(payload: CreateSubjectAreaPayload): Observable<SubjectArea> {
      return this.http.post<SubjectArea>(this.url('/curriculum/subject-areas'), payload);
    }

    updateSubjectArea(id: number, payload: UpdateSubjectAreaPayload): Observable<SubjectArea> {
      return this.http.put<SubjectArea>(this.url(`/curriculum/subject-areas/${id}`), payload);
    }

    deleteSubjectArea(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/curriculum/subject-areas/${id}`));
    }

    getTeachingMethods(): Observable<TeachingMethod[]> {
      return this.http.get<TeachingMethod[]>(this.url('/curriculum/teaching-methods'));
    }

    createTeachingMethod(payload: CreateTeachingMethodPayload): Observable<TeachingMethod> {
      return this.http.post<TeachingMethod>(this.url('/curriculum/teaching-methods'), payload);
    }

    updateTeachingMethod(
      id: number,
      payload: UpdateTeachingMethodPayload,
    ): Observable<TeachingMethod> {
      return this.http.put<TeachingMethod>(this.url(`/curriculum/teaching-methods/${id}`), payload);
    }

    deleteTeachingMethod(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/curriculum/teaching-methods/${id}`));
    }

    getObjectives(): Observable<CurriculumObjective[]> {
      return this.http.get<CurriculumObjective[]>(this.url('/curriculum/objectives'));
    }

    createObjective(payload: CreateCurriculumObjectivePayload): Observable<CurriculumObjective> {
      return this.http.post<CurriculumObjective>(this.url('/curriculum/objectives'), payload);
    }

    updateObjective(
      id: number,
      payload: UpdateCurriculumObjectivePayload,
    ): Observable<CurriculumObjective> {
      return this.http.put<CurriculumObjective>(this.url(`/curriculum/objectives/${id}`), payload);
    }

    deleteObjective(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/curriculum/objectives/${id}`));
    }

    getBooks(): Observable<Book[]> {
      return this.http.get<Book[]>(this.url('/curriculum/books'));
    }

    createBook(payload: CreateBookPayload): Observable<Book> {
      return this.http.post<Book>(this.url('/curriculum/books'), payload);
    }

    updateBook(id: number, payload: UpdateBookPayload): Observable<Book> {
      return this.http.put<Book>(this.url(`/curriculum/books/${id}`), payload);
    }

    deleteBook(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/curriculum/books/${id}`));
    }

    getAgeGroups(): Observable<AgeGroup[]> {
      return this.http.get<AgeGroup[]>(this.url('/skill-progress/age-groups'));
    }

    getSkillProgressByStudent(studentId: number): Observable<StudentSkillProgress[]> {
      return this.http.get<StudentSkillProgress[]>(
        this.url(`/skill-progress/students/${studentId}`),
      );
    }

    getSkillProgressByRing(ringId: number): Observable<StudentSkillProgress[]> {
      return this.http.get<StudentSkillProgress[]>(this.url(`/skill-progress/rings/${ringId}`));
    }

    updateSkillProgress(
      id: number,
      payload: UpdateSkillProgressPayload,
    ): Observable<StudentSkillProgress> {
      return this.http.put<StudentSkillProgress>(this.url(`/skill-progress/${id}`), payload);
    }

    getCurriculumVersions(): Observable<CurriculumVersion[]> {
      return this.http.get<CurriculumVersion[]>(this.url('/curriculum-versions'));
    }

    getCurriculumVersionById(id: number): Observable<CurriculumVersion> {
      return this.http.get<CurriculumVersion>(this.url(`/api/curriculum-versions/${id}`));
    }

    getActiveCurriculumVersion(): Observable<CurriculumVersion> {
      return this.http.get<CurriculumVersion>(this.url('/api/curriculum-versions/active'));
    }

    createCurriculumVersion(
      payload: CreateCurriculumVersionPayload,
    ): Observable<CurriculumVersion> {
      return this.http.post<CurriculumVersion>(this.url('/curriculum-versions'), payload);
    }

    updateCurriculumVersion(
      id: number,
      payload: UpdateCurriculumVersionPayload,
    ): Observable<CurriculumVersion> {
      return this.http.put<CurriculumVersion>(this.url(`/api/curriculum-versions/${id}`), payload);
    }

    deleteCurriculumVersion(id: number): Observable<ApiMessageResponse> {
      return this.http.delete<ApiMessageResponse>(this.url(`/api/curriculum-versions/${id}`));
    }

    getSystemStatistics(): Observable<AdminSystemStatistics> {
      return this.http.get<AdminSystemStatistics>(this.url('/admin/statistics'));
    }

    getCourseStatistics(courseId: number): Observable<AdminCourseStatistics> {
      return this.http.get<AdminCourseStatistics>(
        this.url(`/admin/courses/${courseId}/statistics`),
      );
    }

    getHeadquartersSummary(): Observable<HeadquartersSummary> {
      return this.http.get<HeadquartersSummary>(this.url('/admin/headquarters/summary'));
    }

    getBranchPerformance(): Observable<BranchPerformance[]> {
      return this.http.get<BranchPerformance[]>(this.url('/admin/headquarters/branch-performance'));
    }

    getCoachPerformance(): Observable<CoachPerformance[]> {
      return this.http.get<CoachPerformance[]>(this.url('/admin/headquarters/coach-performance'));
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
