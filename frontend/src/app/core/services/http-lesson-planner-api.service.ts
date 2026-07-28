import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AdminCourseStatistics,
  AdminSystemStatistics,
  AgeGroup,
  ApiMessageResponse,
  ApproveUserPayload,
  Assessment,
  AssessmentAnalytics,
  AssessmentQuestion,
  AssessmentQuestionPayload,
  AssessmentResult,
  Assignment,
  AssignmentAttachment,
  AssignmentProgressResponse,
  AssignmentSubmission,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  BiweeklyProgressResponse,
  Book,
  Branch,
  BranchManager,
  Coach,
  Course,
  CourseEnrollment,
  CourseInviteCode,
  CreatedUser,
  CreateAssignmentPayload,
  CreateBookPayload,
  CreateBranchManagerPayload,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateCoachPayload,
  CreateCoursePayload,
  CreateCurriculumVersionPayload,
  CreateDailySeriesPayload,
  CreateEvaluationPayload,
  CreateEvaluatorPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  CreateMonthlyBookletPayload,
  CreateParentPayload,
  CreateRingPayload,
  CreateRingBookPayload,
  CreateRingStudentPayload,
  CreateRingTeachingMethodPayload,
  CreateStudentPayload,
  CreateSubjectAreaPayload,
  CreateTeachingMethodPayload,
  CreateCurriculumObjectivePayload,
  CreateUserPayload,
  CurriculumObjective,
  CurriculumVersion,
  EvaluationRecord,
  Evaluator,
  GenerateWeeklyAssessmentPayload,
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
  Madrasah,
  MaktabBranch,
  MonthlyBooklet,
  Parent,
  ParentStudentInfo,
  PendingUser,
  ProgressionResult,
Ring,
  RingStudent,
  Student,
  StudentAssessmentHistory,
  StudentInfo,
  StudentPathHistory,
  StudentProgressResponse,
  StudentProgressSummary,
  StudentSkillProgress,
  RingDashboardDto,
  SubjectArea,
  SubmitAssessmentResultPayload,
  TeachingMethod,
  Teacher,
  TeacherDashboardSummary,
  AssignmentGrading,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  GradeSubmissionPayload,
  UpdateBookPayload,
  UpdateCurriculumObjectivePayload,
  UpdateCurriculumVersionPayload,
  UpdateMadrasahPayload,
  UpdateMonthlyBookletPayload,
  UpdateRingPayload,
  UpdateSkillProgressPayload,
  UpdateStudentPayload,
  UpdateSubjectAreaPayload,
  UpdateTeachingMethodPayload,
  SpiritualPracticeItem,
  SpiritualOccasion,
  SpiritualOccasionDetail,
  DailySpiritualEntry,
  UpsertDailySpiritualEntryPayload,
  UserOccasionProgress,
  MarkOccasionPracticePayload,
  SpiritualPath,
  StudentPathSelection,
  PathRankingPayload,
  FinalizePathPayload,
  AvailablePath,
  Competition,
  CompetitionDetail,
  CompetitionParticipant,
  CompetitionResult,
  CreateCompetitionPayload,
  UpdateCompetitionPayload,
  RegisterParticipantPayload,
  UpdateParticipantScorePayload,
  League,
  LeagueDetail,
  LeagueRanking,
  CreateLeaguePayload,
  UpdateLeaguePayload,
  UpdateLeagueRankingPayload,
  IssueSurvey,
  CreateIssueSurveyPayload,
  UpdateIssueSurveyPayload,
  IssueSurveyQuestion,
  CreateIssueQuestionPayload,
  IssueSurveyResponse,
  SubmitSurveyResponsePayload,
  IssueSurveyComment,
  IssueAction,
  CreateIssueActionPayload,
  IssueItemPool,
  CreateIssueItemPoolPayload,
  IssueDashboardSummary,
  SurveyAnalytics,
  CategoryAnalytics,
  ServiceSurvey,
  CreateServiceSurveyPayload,
  UpdateServiceSurveyPayload,
  ServiceSurveyQuestion,
  CreateServiceQuestionPayload,
  ServiceSurveyResponse,
  SubmitServiceSurveyPayload,
  SubmitServiceAnswerItem,
  ServiceSurveyAnalytics,
  ServiceCategoryAnalytics,
  ServiceQuestionAnalytics,
  ServiceDashboardSummary,
  Surah,
  Ayah,
  TajweedRule,
  RecitationLevel,
  QuranCurriculum,
  QuranStudentProgress,
  PersianLiteraturePoet,
  PersianLiteraturePoem,
  PersianLiteratureAnalysis,
  CreatePersianLiteraturePoetPayload,
  CreatePersianLiteraturePoemPayload,
  CreatePersianLiteratureAnalysisPayload,
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

  createUser(payload: CreateUserPayload): Observable<CreatedUser> {
    return this.http.post<CreatedUser>(this.url('/admin/users'), payload);
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

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.url('/admin/branches'));
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

  deleteCoach(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/coaches/${id}`));
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url('/admin/students'));
  }

  createStudent(payload: CreateStudentPayload): Observable<Student> {
    return this.http.post<Student>(this.url('/admin/students'), payload);
  }

  updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student> {
    return this.http.put<Student>(this.url(`/admin/students/${id}`), payload);
  }

  deleteStudent(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/admin/students/${id}`));
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

  updateTeachingMethod(id: number, payload: UpdateTeachingMethodPayload): Observable<TeachingMethod> {
    return this.http.put<TeachingMethod>(this.url(`/curriculum/teaching-methods/${id}`), payload);
  }

  deleteTeachingMethod(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/curriculum/teaching-methods/${id}`));
  }

  getRings(): Observable<Ring[]> {
    return this.http.get<Ring[]>(this.url('/rings'));
  }

  getRingById(id: number): Observable<Ring> {
    return this.http.get<Ring>(this.url(`/rings/${id}`));
  }

  createRing(payload: CreateRingPayload): Observable<Ring> {
    return this.http.post<Ring>(this.url('/rings'), payload);
  }

  updateRing(id: number, payload: UpdateRingPayload): Observable<Ring> {
    return this.http.put<Ring>(this.url(`/rings/${id}`), payload);
  }

  deleteRing(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/rings/${id}`));
  }

  getRingStudents(ringId: number): Observable<RingStudent[]> {
    return this.http.get<RingStudent[]>(this.url(`/rings/${ringId}/students`));
  }

  addRingStudent(ringId: number, payload: CreateRingStudentPayload): Observable<RingStudent> {
    return this.http.post<RingStudent>(this.url(`/rings/${ringId}/students`), payload);
  }

  removeRingStudent(ringId: number, studentId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/rings/${ringId}/students/${studentId}`));
  }

  addRingBook(ringId: number, payload: CreateRingBookPayload): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url(`/rings/${ringId}/books`), payload);
  }

  removeRingBook(ringId: number, bookId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/rings/${ringId}/books/${bookId}`));
  }

  addRingTeachingMethod(ringId: number, payload: CreateRingTeachingMethodPayload): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url(`/rings/${ringId}/teaching-methods`), payload);
  }

  removeRingTeachingMethod(ringId: number, teachingMethodId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/rings/${ringId}/teaching-methods/${teachingMethodId}`));
  }

  getObjectives(): Observable<CurriculumObjective[]> {
    return this.http.get<CurriculumObjective[]>(this.url('/curriculum/objectives'));
  }

  createObjective(payload: CreateCurriculumObjectivePayload): Observable<CurriculumObjective> {
    return this.http.post<CurriculumObjective>(this.url('/curriculum/objectives'), payload);
  }

  updateObjective(id: number, payload: UpdateCurriculumObjectivePayload): Observable<CurriculumObjective> {
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
    return this.http.get<StudentSkillProgress[]>(this.url(`/skill-progress/students/${studentId}`));
  }

  getSkillProgressByRing(ringId: number): Observable<StudentSkillProgress[]> {
    return this.http.get<StudentSkillProgress[]>(this.url(`/skill-progress/rings/${ringId}`));
  }

  updateSkillProgress(id: number, payload: UpdateSkillProgressPayload): Observable<StudentSkillProgress> {
    return this.http.put<StudentSkillProgress>(this.url(`/skill-progress/${id}`), payload);
  }

  getProgressSummary(studentId: number): Observable<StudentProgressSummary> {
    return this.http.get<StudentProgressSummary>(this.url(`/skill-progress/students/${studentId}/summary`));
  }

  syncFromSubmission(submissionId: number): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.url(`/skill-progress/sync-from-submission/${submissionId}`), {});
  }

  getMyRings(): Observable<Ring[]> {
    return this.http.get<Ring[]>(this.url('/rings/my'));
  }

  getMyRingStudents(): Observable<RingStudent[]> {
    return this.http.get<RingStudent[]>(this.url('/rings/my/students'));
  }

  getRingDashboard(ringId: number): Observable<RingDashboardDto> {
    return this.http.get<RingDashboardDto>(this.url(`/rings/${ringId}/dashboard`));
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

  getHeadquartersSummary(): Observable<HeadquartersSummary> {
    return this.http.get<HeadquartersSummary>(this.url('/admin/headquarters/summary'));
  }

  getBranchPerformance(): Observable<BranchPerformance[]> {
    return this.http.get<BranchPerformance[]>(this.url('/admin/headquarters/branch-performance'));
  }

  getCoachPerformance(): Observable<CoachPerformance[]> {
    return this.http.get<CoachPerformance[]>(this.url('/admin/headquarters/coach-performance'));
  }

  getCourseStatistics(courseId: number): Observable<AdminCourseStatistics> {
    return this.http.get<AdminCourseStatistics>(this.url(`/admin/courses/${courseId}/statistics`));
  }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(this.url('/assessments'));
  }

  getAssessmentById(id: number): Observable<Assessment> {
    return this.http.get<Assessment>(this.url(`/assessments/${id}`));
  }

  getAssessmentsByCourse(courseId: number): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(this.url(`/assessments/course/${courseId}`));
  }

  getAssessmentsByDateRange(courseId: number, startDate: string, endDate: string): Observable<Assessment[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Assessment[]>(this.url(`/assessments/course/${courseId}/date-range`), { params });
  }

  createAssessment(payload: Partial<Assessment>): Observable<Assessment> {
    return this.http.post<Assessment>(this.url('/assessments'), payload);
  }

  updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment> {
    return this.http.put<Assessment>(this.url(`/assessments/${id}`), payload);
  }

  deleteAssessment(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/assessments/${id}`));
  }

  generateWeeklyAssessment(payload: GenerateWeeklyAssessmentPayload): Observable<Assessment> {
    return this.http.post<Assessment>(this.url('/assessments/generate-weekly'), payload);
  }

  getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]> {
    return this.http.get<AssessmentQuestion[]>(this.url(`/assessments/${assessmentId}/questions`));
  }

  createAssessmentQuestion(assessmentId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion> {
    return this.http.post<AssessmentQuestion>(this.url(`/assessments/${assessmentId}/questions`), payload);
  }

  updateAssessmentQuestion(questionId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion> {
    return this.http.put<AssessmentQuestion>(this.url(`/assessments/questions/${questionId}`), payload);
  }

  deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/assessments/questions/${questionId}`));
  }

  submitAssessmentResult(assessmentId: number, payload: SubmitAssessmentResultPayload): Observable<AssessmentResult> {
    return this.http.post<AssessmentResult>(this.url(`/assessments/${assessmentId}/submit`), payload);
  }

  startAssessment(assessmentId: number, studentId: number): Observable<AssessmentResult> {
    return this.http.post<AssessmentResult>(this.url(`/assessments/${assessmentId}/start/${studentId}`), {});
  }

  getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]> {
    return this.http.get<AssessmentResult[]>(this.url(`/assessments/${assessmentId}/results`));
  }

  getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]> {
    return this.http.get<AssessmentResult[]>(this.url(`/assessments/student/${studentId}/results`));
  }

  getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics> {
    return this.http.get<AssessmentAnalytics>(this.url(`/assessments/${assessmentId}/analytics`));
  }

  getStudentAssessmentHistory(studentId: number, courseId: number): Observable<StudentAssessmentHistory> {
    return this.http.get<StudentAssessmentHistory>(this.url(`/assessments/student/${studentId}/course/${courseId}/history`));
  }

  getSpiritualPractices(): Observable<SpiritualPracticeItem[]> {
    return this.http.get<SpiritualPracticeItem[]>(this.url('/spiritual/catalog/practices/all'));
  }

  getSpiritualPracticesForMe(age?: number, gender?: string, role?: string): Observable<SpiritualPracticeItem[]> {
    let params = new HttpParams();
    if (age !== undefined) params = params.set('age', age.toString());
    if (gender) params = params.set('gender', gender);
    if (role) params = params.set('role', role);
    return this.http.get<SpiritualPracticeItem[]>(this.url('/spiritual/catalog/practices'), { params });
  }

  getSpiritualOccasions(): Observable<SpiritualOccasion[]> {
    return this.http.get<SpiritualOccasion[]>(this.url('/spiritual/catalog/occasions'));
  }

  getSpiritualOccasionDetail(occasionId: number): Observable<SpiritualOccasionDetail> {
    return this.http.get<SpiritualOccasionDetail>(this.url(`/spiritual/catalog/occasions/${occasionId}`));
  }

  getDailySpiritualEntry(userId: number, date: string): Observable<DailySpiritualEntry> {
    return this.http.get<DailySpiritualEntry>(this.url(`/spiritual/entries/user/${userId}`), {
      params: new HttpParams().set('date', date)
    });
  }

  upsertDailySpiritualEntry(payload: UpsertDailySpiritualEntryPayload): Observable<DailySpiritualEntry> {
    return this.http.post<DailySpiritualEntry>(this.url('/spiritual/entries'), payload);
  }

  getSpiritualEntryHistory(userId: number, fromDate?: string, toDate?: string): Observable<DailySpiritualEntry[]> {
    let params = new HttpParams();
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);
    return this.http.get<DailySpiritualEntry[]>(this.url(`/spiritual/entries/user/${userId}/history`), { params });
  }

  getSpiritualStreak(userId: number): Observable<{ streak: number }> {
    return this.http.get<{ streak: number }>(this.url(`/spiritual/entries/user/${userId}/streak`));
  }

  getUserOccasionProgress(userId: number, occasionId?: number, hijriYear?: number): Observable<UserOccasionProgress[]> {
    let params = new HttpParams();
    if (occasionId !== undefined) params = params.set('occasionId', occasionId.toString());
    if (hijriYear !== undefined) params = params.set('hijriYear', hijriYear.toString());
    return this.http.get<UserOccasionProgress[]>(this.url(`/spiritual/occasions/progress/user/${userId}`), { params });
  }

  markOccasionPractice(payload: MarkOccasionPracticePayload): Observable<UserOccasionProgress> {
    return this.http.post<UserOccasionProgress>(this.url('/spiritual/occasions/progress/mark'), payload);
  }

  getAvailablePaths(studentId: number): Observable<AvailablePath[]> {
    return this.http.get<AvailablePath[]>(this.url(`/spiritual/path/available/${studentId}`));
  }

  submitPathRanking(studentId: number, payload: PathRankingPayload): Observable<StudentPathSelection> {
    return this.http.post<StudentPathSelection>(this.url(`/spiritual/path/ranking/${studentId}`), payload);
  }

  finalizePath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
    return this.http.post<StudentPathSelection>(this.url('/spiritual/path/finalize'), payload);
  }

  switchFinalizedPath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
    return this.http.post<StudentPathSelection>(this.url('/spiritual/path/switch'), payload);
  }

  getStudentPathSelection(studentId: number): Observable<StudentPathSelection> {
    return this.http.get<StudentPathSelection>(this.url(`/spiritual/path/selection/${studentId}`));
  }

  getStudentPathHistory(studentId: number): Observable<unknown[]> {
    return this.http.get<unknown[]>(this.url(`/spiritual/path/history/${studentId}`));
  }

  // Monthly Booklets
  getMonthlyBooklets(studentId?: number): Observable<MonthlyBooklet[]> {
    let params = new HttpParams();
    if (studentId !== undefined) params = params.set('studentId', studentId.toString());
    return this.http.get<MonthlyBooklet[]>(this.url('/monthly-booklets'), { params });
  }

  getMonthlyBookletById(id: number): Observable<MonthlyBooklet> {
    return this.http.get<MonthlyBooklet>(this.url(`/monthly-booklets/${id}`));
  }

  getMonthlyBookletsByStudent(studentId: number): Observable<MonthlyBooklet[]> {
    return this.http.get<MonthlyBooklet[]>(this.url(`/monthly-booklets/by-student/${studentId}`));
  }

  getMonthlyBookletByPeriod(studentId: number, year: number, month: number): Observable<MonthlyBooklet> {
    return this.http.get<MonthlyBooklet>(this.url(`/monthly-booklets/by-student/${studentId}/${year}/${month}`));
  }

  createMonthlyBooklet(payload: CreateMonthlyBookletPayload): Observable<MonthlyBooklet> {
    return this.http.post<MonthlyBooklet>(this.url('/monthly-booklets'), payload);
  }

  updateMonthlyBooklet(id: number, payload: UpdateMonthlyBookletPayload): Observable<MonthlyBooklet> {
    return this.http.put<MonthlyBooklet>(this.url(`/monthly-booklets/${id}`), payload);
  }

  deleteMonthlyBooklet(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/monthly-booklets/${id}`));
  }

  // Curriculum Versions
  getCurriculumVersions(): Observable<CurriculumVersion[]> {
    return this.http.get<CurriculumVersion[]>(this.url('/curriculum-versions'));
  }

  getCurriculumVersionById(id: number): Observable<CurriculumVersion> {
    return this.http.get<CurriculumVersion>(this.url(`/curriculum-versions/${id}`));
  }

  getActiveCurriculumVersion(): Observable<CurriculumVersion> {
    return this.http.get<CurriculumVersion>(this.url('/curriculum-versions/active'));
  }

  createCurriculumVersion(payload: CreateCurriculumVersionPayload): Observable<CurriculumVersion> {
    return this.http.post<CurriculumVersion>(this.url('/curriculum-versions'), payload);
  }

  updateCurriculumVersion(id: number, payload: UpdateCurriculumVersionPayload): Observable<CurriculumVersion> {
    return this.http.put<CurriculumVersion>(this.url(`/curriculum-versions/${id}`), payload);
  }

  deleteCurriculumVersion(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/curriculum-versions/${id}`));
  }

  // Progression
  checkProgression(studentId: number): Observable<ProgressionResult> {
    return this.http.get<ProgressionResult>(this.url(`/progression/check/${studentId}`));
  }

  checkRingProgression(ringId: number): Observable<ProgressionResult[]> {
    return this.http.get<ProgressionResult[]>(this.url(`/progression/ring/${ringId}`));
  }

  recordProgression(payload: { studentId: number; fromLevel: string; toLevel: string }): Observable<StudentPathHistory> {
    return this.http.post<StudentPathHistory>(this.url('/progression/record'), payload);
  }

  // Biweekly Progress (Phase 4)
  getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse> {
    return this.http.get<BiweeklyProgressResponse>(this.url(`/students/${studentId}/progress/biweekly`));
  }

  // Teacher (Phase 5)
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.url('/teachers'));
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(this.url(`/teachers/${id}`));
  }

  createTeacher(payload: CreateTeacherPayload): Observable<Teacher> {
    return this.http.post<Teacher>(this.url('/teachers'), payload);
  }

  updateTeacher(id: number, payload: UpdateTeacherPayload): Observable<Teacher> {
    return this.http.put<Teacher>(this.url(`/teachers/${id}`), payload);
  }

  deleteTeacher(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/teachers/${id}`));
  }

  getTeachersByCourse(courseId: number): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.url(`/teachers/by-course/${courseId}`));
  }

  getTeacherDashboardSummary(teacherId: number): Observable<TeacherDashboardSummary> {
    return this.http.get<TeacherDashboardSummary>(this.url(`/teachers/dashboard-summary/${teacherId}`));
  }

  getTeacherCourses(teacherId: number): Observable<any[]> {
    return this.http.get<any[]>(this.url(`/teachers/courses/${teacherId}`));
  }

  getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
    return this.http.get<AssignmentGrading[]>(this.url(`/teachers/gradings/${teacherId}`));
  }

  getPendingGradings(teacherId: number): Observable<any[]> {
    return this.http.get<any[]>(this.url(`/teachers/pending-gradings/${teacherId}`));
  }

  gradeSubmission(payload: GradeSubmissionPayload): Observable<AssignmentGrading> {
    return this.http.post<AssignmentGrading>(this.url('/teachers/grade'), payload);
  }
  getCompetitions(): Observable<Competition[]> {
    return this.http.get<Competition[]>(this.url('/competitions'));
  }

  getActiveCompetitions(): Observable<Competition[]> {
    return this.http.get<Competition[]>(this.url('/competitions/active'));
  }

  getCompetitionById(id: number): Observable<CompetitionDetail> {
    return this.http.get<CompetitionDetail>(this.url(`/competitions/${id}`));
  }

  createCompetition(payload: CreateCompetitionPayload): Observable<Competition> {
    return this.http.post<Competition>(this.url('/competitions'), payload);
  }

  updateCompetition(id: number, payload: UpdateCompetitionPayload): Observable<Competition> {
    return this.http.put<Competition>(this.url(`/competitions/${id}`), payload);
  }

  deleteCompetition(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/competitions/${id}`));
  }

  registerParticipant(competitionId: number, payload: RegisterParticipantPayload): Observable<CompetitionParticipant> {
    return this.http.post<CompetitionParticipant>(this.url(`/competitions/${competitionId}/participants`), payload);
  }

  removeParticipant(competitionId: number, studentId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/competitions/${competitionId}/participants/${studentId}`));
  }

  updateParticipantScore(competitionId: number, studentId: number, payload: UpdateParticipantScorePayload): Observable<CompetitionParticipant> {
    return this.http.put<CompetitionParticipant>(this.url(`/competitions/${competitionId}/participants/${studentId}/score`), payload);
  }

  getCompetitionResults(competitionId: number): Observable<CompetitionResult> {
    return this.http.get<CompetitionResult>(this.url(`/competitions/${competitionId}/results`));
  }

  getLeagues(): Observable<League[]> {
    return this.http.get<League[]>(this.url('/leagues'));
  }

  getActiveLeagues(): Observable<League[]> {
    return this.http.get<League[]>(this.url('/leagues/active'));
  }

  getLeagueById(id: number): Observable<LeagueDetail> {
    return this.http.get<LeagueDetail>(this.url(`/leagues/${id}`));
  }

  createLeague(payload: CreateLeaguePayload): Observable<League> {
    return this.http.post<League>(this.url('/leagues'), payload);
  }

  updateLeague(id: number, payload: UpdateLeaguePayload): Observable<League> {
    return this.http.put<League>(this.url(`/leagues/${id}`), payload);
  }

  deleteLeague(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/leagues/${id}`));
  }

  getLeagueRankings(leagueId: number): Observable<LeagueRanking[]> {
    return this.http.get<LeagueRanking[]>(this.url(`/leagues/${leagueId}/rankings`));
  }

  updateLeagueRanking(leagueId: number, payload: UpdateLeagueRankingPayload): Observable<LeagueRanking> {
    return this.http.put<LeagueRanking>(this.url(`/leagues/${leagueId}/rankings`), payload);
  }

  getIssueSurveys(): Observable<IssueSurvey[]> {
    return this.http.get<IssueSurvey[]>(this.url('/issue-surveys'));
  }

  getIssueSurveyById(id: number): Observable<IssueSurvey> {
    return this.http.get<IssueSurvey>(this.url(`/issue-surveys/${id}`));
  }

  createIssueSurvey(payload: CreateIssueSurveyPayload): Observable<IssueSurvey> {
    return this.http.post<IssueSurvey>(this.url('/issue-surveys'), payload);
  }

  updateIssueSurvey(id: number, payload: UpdateIssueSurveyPayload): Observable<IssueSurvey> {
    return this.http.put<IssueSurvey>(this.url(`/issue-surveys/${id}`), payload);
  }

  deleteIssueSurvey(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/issue-surveys/${id}`));
  }

  publishIssueSurvey(id: number): Observable<IssueSurvey> {
    return this.http.post<IssueSurvey>(this.url(`/issue-surveys/${id}/publish`), {});
  }

  closeIssueSurvey(id: number): Observable<IssueSurvey> {
    return this.http.post<IssueSurvey>(this.url(`/issue-surveys/${id}/close`), {});
  }

  duplicateIssueSurvey(id: number): Observable<IssueSurvey> {
    return this.http.post<IssueSurvey>(this.url(`/issue-surveys/${id}/duplicate`), {});
  }

  getIssueSurveyQuestions(surveyId: number): Observable<IssueSurveyQuestion[]> {
    return this.http.get<IssueSurveyQuestion[]>(this.url(`/issue-surveys/${surveyId}/questions`));
  }

  createIssueSurveyQuestion(surveyId: number, payload: CreateIssueQuestionPayload): Observable<IssueSurveyQuestion> {
    return this.http.post<IssueSurveyQuestion>(this.url(`/issue-surveys/${surveyId}/questions`), payload);
  }

  updateIssueSurveyQuestion(surveyId: number, questionId: number, payload: Partial<CreateIssueQuestionPayload>): Observable<IssueSurveyQuestion> {
    return this.http.put<IssueSurveyQuestion>(this.url(`/issue-surveys/${surveyId}/questions/${questionId}`), payload);
  }

  deleteIssueSurveyQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/issue-surveys/${surveyId}/questions/${questionId}`));
  }

  reorderIssueQuestions(surveyId: number, questionIds: number[]): Observable<void> {
    return this.http.post<void>(this.url(`/issue-surveys/${surveyId}/questions/reorder`), questionIds);
  }

  getIssueSurveysForRespond(surveyId: number): Observable<IssueSurvey> {
    return this.http.get<IssueSurvey>(this.url(`/issue-surveys/${surveyId}/respond`));
  }

  submitSurveyResponses(surveyId: number, payload: SubmitSurveyResponsePayload): Observable<IssueSurveyResponse[]> {
    return this.http.post<IssueSurveyResponse[]>(this.url(`/issue-surveys/${surveyId}/respond`), payload);
  }

  getSurveyAnalytics(surveyId: number): Observable<SurveyAnalytics> {
    return this.http.get<SurveyAnalytics>(this.url(`/issue-surveys/${surveyId}/analytics`));
  }

  getSurveyCategoryBreakdown(surveyId: number): Observable<CategoryAnalytics[]> {
    return this.http.get<CategoryAnalytics[]>(this.url(`/issue-surveys/${surveyId}/analytics/categories`));
  }

  getSurveyTrends(): Observable<any[]> {
    return this.http.get<any[]>(this.url('/issue-surveys/analytics/trends'));
  }

  exportSurveyJson(surveyId: number): Observable<any[]> {
    return this.http.get<any[]>(this.url(`/issue-surveys/${surveyId}/export/json`));
  }

  getSurveyComments(surveyId: number): Observable<IssueSurveyComment[]> {
    return this.http.get<IssueSurveyComment[]>(this.url(`/issue-surveys/${surveyId}/comments`));
  }

  addSurveyComment(surveyId: number, payload: { comment: string }): Observable<IssueSurveyComment> {
    return this.http.post<IssueSurveyComment>(this.url(`/issue-surveys/${surveyId}/comments`), payload);
  }

  getSurveyActions(surveyId: number): Observable<IssueAction[]> {
    return this.http.get<IssueAction[]>(this.url(`/issue-surveys/${surveyId}/actions`));
  }

  createSurveyAction(surveyId: number, payload: CreateIssueActionPayload): Observable<IssueAction> {
    return this.http.post<IssueAction>(this.url(`/issue-surveys/${surveyId}/actions`), payload);
  }

  updateIssueAction(id: number, payload: Partial<IssueAction>): Observable<IssueAction> {
    return this.http.put<IssueAction>(this.url(`/issue-actions/${id}`), payload);
  }

  updateIssueActionStatus(id: number, status: string, updatedById: number, note?: string, progressPercent?: number): Observable<IssueAction> {
    let params = new HttpParams().set('status', status).set('updatedById', updatedById);
    if (note) params = params.set('note', note);
    if (progressPercent != null) params = params.set('progressPercent', progressPercent);
    return this.http.patch<IssueAction>(this.url(`/issue-actions/${id}/status`), null, { params });
  }

  getIssueItemPool(category?: string): Observable<IssueItemPool[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    return this.http.get<IssueItemPool[]>(this.url('/issue-item-pool'), { params });
  }

  createIssueItemPool(payload: CreateIssueItemPoolPayload): Observable<IssueItemPool> {
    return this.http.post<IssueItemPool>(this.url('/issue-item-pool'), payload);
  }

  addPoolItemToSurvey(poolItemId: number, surveyId: number, sortOrder?: number): Observable<IssueItemPool> {
    let params = new HttpParams().set('surveyId', surveyId);
    if (sortOrder != null) params = params.set('sortOrder', sortOrder);
    return this.http.post<IssueItemPool>(this.url(`/issue-item-pool/${poolItemId}/use-in-survey`), null, { params });
  }

  getIssueDashboardSummary(): Observable<IssueDashboardSummary> {
    return this.http.get<IssueDashboardSummary>(this.url('/issue-dashboard/summary'));
  }

  getServiceSurveys(targetRole?: string): Observable<ServiceSurvey[]> {
    let params = new HttpParams();
    if (targetRole) params = params.set('targetRole', targetRole);
    return this.http.get<ServiceSurvey[]>(this.url('/service-surveys'), { params });
  }

  getServiceSurveyById(id: number): Observable<ServiceSurvey> {
    return this.http.get<ServiceSurvey>(this.url(`/service-surveys/${id}`));
  }

  createServiceSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey> {
    return this.http.post<ServiceSurvey>(this.url('/service-surveys'), payload);
  }

  updateServiceSurvey(id: number, payload: UpdateServiceSurveyPayload): Observable<ServiceSurvey> {
    return this.http.patch<ServiceSurvey>(this.url(`/service-surveys/${id}`), payload);
  }

  deleteServiceSurvey(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/service-surveys/${id}`));
  }

  publishServiceSurvey(id: number): Observable<ServiceSurvey> {
    return this.http.post<ServiceSurvey>(this.url(`/service-surveys/${id}/publish`), null);
  }

  closeServiceSurvey(id: number): Observable<ServiceSurvey> {
    return this.http.post<ServiceSurvey>(this.url(`/service-surveys/${id}/close`), null);
  }

  getServiceSurveyQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]> {
    return this.http.get<ServiceSurveyQuestion[]>(this.url(`/service-surveys/${surveyId}/questions`));
  }

  createServiceQuestion(surveyId: number, payload: CreateServiceQuestionPayload): Observable<ServiceSurveyQuestion> {
    return this.http.post<ServiceSurveyQuestion>(this.url(`/service-surveys/${surveyId}/questions`), payload);
  }

  deleteServiceQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(this.url(`/service-surveys/${surveyId}/questions/${questionId}`));
  }

  getServiceSurveyResponses(surveyId: number): Observable<ServiceSurveyResponse[]> {
    return this.http.get<ServiceSurveyResponse[]>(this.url(`/service-surveys/${surveyId}/responses`));
  }

  submitServiceSurveyResponse(payload: SubmitServiceSurveyPayload): Observable<ServiceSurveyResponse> {
    return this.http.post<ServiceSurveyResponse>(this.url('/service-survey-responses'), payload);
  }

  getServiceSurveyAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics> {
    return this.http.get<ServiceSurveyAnalytics>(this.url(`/service-surveys/${surveyId}/analytics`));
  }

  getServiceDashboardSummary(): Observable<ServiceDashboardSummary> {
    return this.http.get<ServiceDashboardSummary>(this.url('/service-surveys/dashboard/summary'));
  }

  getSurahs(): Observable<Surah[]> {
    return this.http.get<Surah[]>(this.url('/api/quran/surahs'));
  }

  getSurahById(id: number): Observable<Surah> {
    return this.http.get<Surah>(this.url(`/api/quran/surahs/${id}`));
  }

  getAyahs(surahId: number): Observable<Ayah[]> {
    return this.http.get<Ayah[]>(this.url(`/api/quran/surahs/${surahId}/ayahs`));
  }

  getAyahById(id: number): Observable<Ayah> {
    return this.http.get<Ayah>(this.url(`/api/quran/ayahs/${id}`));
  }

  createSurah(surah: Partial<Surah>): Observable<Surah> {
    return this.http.post<Surah>(this.url('/api/quran/surahs'), surah);
  }

  updateSurah(id: number, surah: Partial<Surah>): Observable<Surah> {
    return this.http.put<Surah>(this.url(`/api/quran/surahs/${id}`), surah);
  }

  deleteSurah(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/quran/surahs/${id}`));
  }

  getAyahsBySurah(surahId: number): Observable<Ayah[]> {
    return this.http.get<Ayah[]>(this.url(`/api/quran/surahs/${surahId}/ayahs`));
  }

  createAyah(ayah: Partial<Ayah>): Observable<Ayah> {
    return this.http.post<Ayah>(this.url('/api/quran/ayahs'), ayah);
  }

  updateAyah(id: number, ayah: Partial<Ayah>): Observable<Ayah> {
    return this.http.put<Ayah>(this.url(`/api/quran/ayahs/${id}`), ayah);
  }

  deleteAyah(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/quran/ayahs/${id}`));
  }

  getTajweedRule(id: number): Observable<TajweedRule> {
    return this.http.get<TajweedRule>(this.url(`/api/quran/tajweed-rules/${id}`));
  }

  createTajweedRule(rule: Partial<TajweedRule>): Observable<TajweedRule> {
    return this.http.post<TajweedRule>(this.url('/api/quran/tajweed-rules'), rule);
  }

  updateTajweedRule(id: number, rule: Partial<TajweedRule>): Observable<TajweedRule> {
    return this.http.put<TajweedRule>(this.url(`/api/quran/tajweed-rules/${id}`), rule);
  }

  deleteTajweedRule(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/quran/tajweed-rules/${id}`));
  }

  getRecitationLevel(id: number): Observable<RecitationLevel> {
    return this.http.get<RecitationLevel>(this.url(`/api/quran/recitation-levels/${id}`));
  }

  createRecitationLevel(level: Partial<RecitationLevel>): Observable<RecitationLevel> {
    return this.http.post<RecitationLevel>(this.url('/api/quran/recitation-levels'), level);
  }

  updateRecitationLevel(id: number, level: Partial<RecitationLevel>): Observable<RecitationLevel> {
    return this.http.put<RecitationLevel>(this.url(`/api/quran/recitation-levels/${id}`), level);
  }

  deleteRecitationLevel(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/quran/recitation-levels/${id}`));
  }

  searchAyahs(query: string): Observable<Ayah[]> {
    let params = new HttpParams().set('query', query);
    return this.http.get<Ayah[]>(this.url('/api/quran/ayahs/search'), { params });
  }

  getTajweedRules(): Observable<TajweedRule[]> {
    return this.http.get<TajweedRule[]>(this.url('/api/quran/tajweed-rules'));
  }

  getRecitationLevels(): Observable<RecitationLevel[]> {
    return this.http.get<RecitationLevel[]>(this.url('/api/quran/recitation-levels'));
  }

  getQuranCurricula(): Observable<QuranCurriculum[]> {
    return this.http.get<QuranCurriculum[]>(this.url('/api/quran/curricula'));
  }

  getQuranCurriculumById(id: number): Observable<QuranCurriculum> {
    return this.http.get<QuranCurriculum>(this.url(`/api/quran/curricula/${id}`));
  }

  createQuranCurriculum(payload: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
    return this.http.post<QuranCurriculum>(this.url('/api/quran/curricula'), payload);
  }

  updateQuranCurriculum(id: number, payload: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
    return this.http.put<QuranCurriculum>(this.url(`/api/quran/curricula/${id}`), payload);
  }

  deleteQuranCurriculum(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/quran/curricula/${id}`));
  }

  getQuranStudentProgress(studentId: number): Observable<QuranStudentProgress> {
    return this.http.get<QuranStudentProgress>(this.url(`/api/quran/students/${studentId}/progress`));
  }

  getQuranLessonPlans(): Observable<any[]> {
    return this.http.get<any[]>(this.url('/api/quran/lesson-plans'));
  }

  getQuranLessonPlanById(id: number): Observable<any> {
    return this.http.get<any>(this.url(`/api/quran/lesson-plans/${id}`));
  }

  createQuranLessonPlan(payload: any): Observable<any> {
    return this.http.post<any>(this.url('/api/quran/lesson-plans'), payload);
  }

  updateQuranLessonPlan(id: number, payload: any): Observable<any> {
    return this.http.put<any>(this.url(`/api/quran/lesson-plans/${id}`), payload);
  }

  deleteQuranLessonPlan(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/quran/lesson-plans/${id}`));
  }

  getQuranProgress(id: number): Observable<QuranStudentProgress> {
    return this.http.get<QuranStudentProgress>(this.url(`/api/quran/progress/${id}`));
  }

  createQuranProgress(progress: Partial<QuranStudentProgress>): Observable<QuranStudentProgress> {
    return this.http.post<QuranStudentProgress>(this.url('/api/quran/progress'), progress);
  }

  getQuranDashboardStats(): Observable<any> {
    return this.http.get<any>(this.url('/api/quran/dashboard/stats'));
  }

  // Persian Literature
  getPoets(difficulty?: string): Observable<PersianLiteraturePoet[]> {
    let params = new HttpParams();
    if (difficulty) params = params.set('difficulty', difficulty);
    return this.http.get<PersianLiteraturePoet[]>(this.url('/persian-literature/poets'), { params });
  }
  getPoetById(id: number): Observable<PersianLiteraturePoet> {
    return this.http.get<PersianLiteraturePoet>(this.url(`/persian-literature/poets/${id}`));
  }
  createPoet(payload: CreatePersianLiteraturePoetPayload): Observable<PersianLiteraturePoet> {
    return this.http.post<PersianLiteraturePoet>(this.url('/persian-literature/poets'), payload);
  }
  updatePoet(id: number, payload: Partial<CreatePersianLiteraturePoetPayload>): Observable<PersianLiteraturePoet> {
    return this.http.put<PersianLiteraturePoet>(this.url(`/persian-literature/poets/${id}`), payload);
  }
  deletePoet(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/persian-literature/poets/${id}`));
  }
  searchPoets(query: string): Observable<PersianLiteraturePoet[]> {
    return this.http.get<PersianLiteraturePoet[]>(this.url('/persian-literature/poets/search'), { params: { q: query } });
  }

  getPoems(poetId?: number, genre?: string, difficulty?: string): Observable<PersianLiteraturePoem[]> {
    let params = new HttpParams();
    if (poetId) params = params.set('poetId', poetId.toString());
    if (genre) params = params.set('genre', genre);
    if (difficulty) params = params.set('difficulty', difficulty);
    return this.http.get<PersianLiteraturePoem[]>(this.url('/persian-literature/poems'), { params });
  }
  getPoemById(id: number): Observable<PersianLiteraturePoem> {
    return this.http.get<PersianLiteraturePoem>(this.url(`/persian-literature/poems/${id}`));
  }
  createPoem(payload: CreatePersianLiteraturePoemPayload): Observable<PersianLiteraturePoem> {
    return this.http.post<PersianLiteraturePoem>(this.url('/persian-literature/poems'), payload);
  }
  updatePoem(id: number, payload: Partial<CreatePersianLiteraturePoemPayload>): Observable<PersianLiteraturePoem> {
    return this.http.put<PersianLiteraturePoem>(this.url(`/persian-literature/poems/${id}`), payload);
  }
  deletePoem(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/persian-literature/poems/${id}`));
  }
  searchPoems(query: string): Observable<PersianLiteraturePoem[]> {
    return this.http.get<PersianLiteraturePoem[]>(this.url('/persian-literature/poems/search'), { params: { q: query } });
  }

  getAnalysesByPoem(poemId: number): Observable<PersianLiteratureAnalysis[]> {
    return this.http.get<PersianLiteratureAnalysis[]>(this.url(`/persian-literature/poems/${poemId}/analyses`));
  }
  getAnalysisById(id: number): Observable<PersianLiteratureAnalysis> {
    return this.http.get<PersianLiteratureAnalysis>(this.url(`/persian-literature/analyses/${id}`));
  }
  createAnalysis(payload: CreatePersianLiteratureAnalysisPayload): Observable<PersianLiteratureAnalysis> {
    return this.http.post<PersianLiteratureAnalysis>(this.url('/persian-literature/analyses'), payload);
  }
  updateAnalysis(id: number, payload: Partial<CreatePersianLiteratureAnalysisPayload>): Observable<PersianLiteratureAnalysis> {
    return this.http.put<PersianLiteratureAnalysis>(this.url(`/persian-literature/analyses/${id}`), payload);
  }
  deleteAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/persian-literature/analyses/${id}`));
  }

  getLiteratureDashboardStats(): Observable<any> {
    return this.http.get<any>(this.url('/persian-literature/dashboard'));
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
