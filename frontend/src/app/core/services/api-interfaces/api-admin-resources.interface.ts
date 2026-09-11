import { Observable } from 'rxjs';

import {
  AdminSystemStatistics,
  AgeGroup,
  ApiMessageResponse,
  Book,
  Branch,
  BranchPerformance,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateBookPayload,
  CreateCurriculumObjectivePayload,
  CreateCurriculumVersionPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  CreateSubjectAreaPayload,
  CreateTeachingMethodPayload,
  CurriculumObjective,
  CurriculumVersion,
  Madrasah,
  MaktabBranch,
  SubjectArea,
  TeachingMethod,
  UpdateBookPayload,
  UpdateCurriculumObjectivePayload,
  UpdateCurriculumVersionPayload,
  UpdateMadrasahPayload,
  UpdateSubjectAreaPayload,
  UpdateTeachingMethodPayload,
} from '../../models/lesson-planner.models';

export abstract class AdminResourcesApi {
  abstract getBranches(): Observable<Branch[]>;
  abstract getMyBranch(): Observable<Branch>;
  abstract getMyBranchPerformance(): Observable<BranchPerformance>;
  abstract createBranch(payload: CreateBranchPayload): Observable<Branch>;
  abstract updateBranch(id: number, payload: UpdateBranchPayload): Observable<Branch>;
  abstract deleteBranch(id: number): Observable<ApiMessageResponse>;

  abstract getSystemStatistics(): Observable<AdminSystemStatistics>;
  abstract getCourseStatistics(courseId: number): Observable<unknown>;

  abstract getMadrasahs(): Observable<Madrasah[]>;
  abstract createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah>;
  abstract updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah>;
  abstract deleteMadrasah(id: number): Observable<ApiMessageResponse>;

  abstract getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]>;
  abstract createMaktabBranch(
    madrasahId: number,
    payload: CreateMaktabBranchPayload,
  ): Observable<MaktabBranch>;
  abstract deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse>;

  abstract getSubjectAreas(): Observable<SubjectArea[]>;
  abstract createSubjectArea(payload: CreateSubjectAreaPayload): Observable<SubjectArea>;
  abstract updateSubjectArea(
    id: number,
    payload: UpdateSubjectAreaPayload,
  ): Observable<SubjectArea>;
  abstract deleteSubjectArea(id: number): Observable<ApiMessageResponse>;

  abstract getTeachingMethods(): Observable<TeachingMethod[]>;
  abstract createTeachingMethod(payload: CreateTeachingMethodPayload): Observable<TeachingMethod>;
  abstract updateTeachingMethod(
    id: number,
    payload: UpdateTeachingMethodPayload,
  ): Observable<TeachingMethod>;
  abstract deleteTeachingMethod(id: number): Observable<ApiMessageResponse>;

  abstract getObjectives(): Observable<CurriculumObjective[]>;
  abstract createObjective(
    payload: CreateCurriculumObjectivePayload,
  ): Observable<CurriculumObjective>;
  abstract updateObjective(
    id: number,
    payload: UpdateCurriculumObjectivePayload,
  ): Observable<CurriculumObjective>;
  abstract deleteObjective(id: number): Observable<ApiMessageResponse>;

  abstract getBooks(): Observable<Book[]>;
  abstract createBook(payload: CreateBookPayload): Observable<Book>;
  abstract updateBook(id: number, payload: UpdateBookPayload): Observable<Book>;
  abstract deleteBook(id: number): Observable<ApiMessageResponse>;

  abstract getAgeGroups(): Observable<AgeGroup[]>;

  abstract getCurriculumVersions(): Observable<CurriculumVersion[]>;
  abstract getCurriculumVersionById(id: number): Observable<CurriculumVersion>;
  abstract getActiveCurriculumVersion(): Observable<CurriculumVersion>;
  abstract createCurriculumVersion(
    payload: CreateCurriculumVersionPayload,
  ): Observable<CurriculumVersion>;
  abstract updateCurriculumVersion(
    id: number,
    payload: UpdateCurriculumVersionPayload,
  ): Observable<CurriculumVersion>;
  abstract deleteCurriculumVersion(id: number): Observable<ApiMessageResponse>;
}
