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
  HadithBook,
  HadithBookDetail,
  HadithChapter,
  HadithChapterDetail,
  HadithItem,
  HadithReviewCard,
  UserHadithProgress,
  SubmitReviewPayload,
  HadithAssessment,
  HadithDashboardStats,
  PersianLiteraturePoet,
  PersianLiteraturePoem,
  PersianLiteratureAnalysis,
  CreatePersianLiteraturePoetPayload,
  CreatePersianLiteraturePoemPayload,
  CreatePersianLiteratureAnalysisPayload,
  ArabicLiteraturePoet,
  ArabicLiteraturePoem,
  ArabicLiteratureAnalysis,
  CreateArabicLiteraturePoetPayload,
  CreateArabicLiteraturePoemPayload,
  CreateArabicLiteratureAnalysisPayload,
  ArabicCourse,
  ArabicLesson,
  ArabicUserProgress,
  CreateArabicCoursePayload,
  UpdateArabicCoursePayload,
  CreateArabicLessonPayload,
  UpdateArabicLessonPayload,
  RecordArabicProgressPayload,
  MathTopic,
  MathLesson,
  MathQuestion,
  MathProgress,
  MathScholar,
  MathContribution,
  CreateMathTopicPayload,
  UpdateMathTopicPayload,
  CreateMathLessonPayload,
  UpdateMathLessonPayload,
  CreateMathQuestionPayload,
  UpdateMathQuestionPayload,
  RecordMathProgressPayload,
  UpdateMathProgressPayload,
  CreateMathScholarPayload,
  UpdateMathScholarPayload,
  CreateMathContributionPayload,
  UpdateMathContributionPayload,
  PhaseDto,
  CreatePhaseRequest,
  UpdatePhaseRequest,
  TopicDto,
  CreateTopicRequest,
  UpdateTopicRequest,
  LessonDto,
  CreateLessonRequest,
  UpdateLessonRequest,
  ExperimentDto,
  CreateExperimentRequest,
  UpdateExperimentRequest,
  ExpSciQuizDto,
  CreateExpSciQuizRequest,
  UpdateExpSciQuizRequest,
  ExpSciQuizQuestionDto,
  CreateExpSciQuizQuestionRequest,
  UpdateExpSciQuizQuestionRequest,
  StudentProgressDto,
  UpdateStudentProgressRequest,
  LearningPath,
  LearningPathTreeDto,
  LearningLevel,
  StudyModule,
  StudyLesson,
  LessonContentBlock,
  PersLitQuiz,
  PersLitQuizQuestion,
  QuizOption,
  UserEnrollment,
  UserLessonProgress,
  UserQuizAttempt,
  CreateLearningPathPayload,
  UpdateLearningPathPayload,
  CreateLearningLevelPayload,
  UpdateLearningLevelPayload,
  CreateStudyModulePayload,
  UpdateStudyModulePayload,
  CreateStudyLessonPayload,
  UpdateStudyLessonPayload,
  CreateContentBlockPayload,
  UpdateContentBlockPayload,
  CreatePersLitQuizPayload,
  UpdatePersLitQuizPayload,
  CreatePersLitQuizQuestionPayload,
  UpdatePersLitQuizQuestionPayload,
  EnrollUserRequest,
  QuizResultDto,
  SubmitQuizRequest,
  LearningDashboardStatsDto,
  UserDashboardDto,
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

  // Hadith
  getHadithBooks(): Observable<HadithBook[]> {
    return this.http.get<HadithBook[]>(this.url('/api/hadith/books'));
  }
  getHadithBookById(id: number): Observable<HadithBookDetail> {
    return this.http.get<HadithBookDetail>(this.url(`/api/hadith/books/${id}`));
  }
  createHadithBook(payload: Partial<HadithBook>): Observable<HadithBook> {
    return this.http.post<HadithBook>(this.url('/api/hadith/books'), payload);
  }
  updateHadithBook(id: number, payload: Partial<HadithBook>): Observable<HadithBook> {
    return this.http.put<HadithBook>(this.url(`/api/hadith/books/${id}`), payload);
  }
  deleteHadithBook(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/hadith/books/${id}`));
  }
  getHadithChaptersByBook(bookId: number): Observable<HadithChapter[]> {
    return this.http.get<HadithChapter[]>(this.url(`/api/hadith/books/${bookId}/chapters`));
  }
  getHadithChapterById(id: number): Observable<HadithChapterDetail> {
    return this.http.get<HadithChapterDetail>(this.url(`/api/hadith/chapters/${id}`));
  }
  createHadithChapter(payload: Partial<HadithChapter>): Observable<HadithChapter> {
    return this.http.post<HadithChapter>(this.url('/api/hadith/chapters'), payload);
  }
  updateHadithChapter(id: number, payload: Partial<HadithChapter>): Observable<HadithChapter> {
    return this.http.put<HadithChapter>(this.url(`/api/hadith/chapters/${id}`), payload);
  }
  deleteHadithChapter(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/hadith/chapters/${id}`));
  }
  getHadithsByChapter(chapterId: number): Observable<HadithItem[]> {
    return this.http.get<HadithItem[]>(this.url(`/api/hadith/chapters/${chapterId}/hadiths`));
  }
  getHadithById(id: number): Observable<HadithItem> {
    return this.http.get<HadithItem>(this.url(`/api/hadith/hadiths/${id}`));
  }
  createHadith(payload: Partial<HadithItem>): Observable<HadithItem> {
    return this.http.post<HadithItem>(this.url('/api/hadith/hadiths'), payload);
  }
  updateHadith(id: number, payload: Partial<HadithItem>): Observable<HadithItem> {
    return this.http.put<HadithItem>(this.url(`/api/hadith/hadiths/${id}`), payload);
  }
  deleteHadith(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/api/hadith/hadiths/${id}`));
  }
  getDueHadithReviews(count: number): Observable<HadithReviewCard[]> {
    let params = new HttpParams().set('count', count.toString());
    return this.http.get<HadithReviewCard[]>(this.url('/api/hadith/reviews/due'), { params });
  }
  submitHadithReview(payload: SubmitReviewPayload): Observable<UserHadithProgress> {
    return this.http.post<UserHadithProgress>(this.url('/api/hadith/reviews'), payload);
  }
  getHadithProgressSummary(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(this.url('/api/hadith/progress/summary'));
  }
  getHadithAssessmentsByChapter(chapterId: number): Observable<HadithAssessment[]> {
    return this.http.get<HadithAssessment[]>(this.url(`/api/hadith/chapters/${chapterId}/assessments`));
  }
  createHadithAssessment(payload: Partial<HadithAssessment>): Observable<HadithAssessment> {
    return this.http.post<HadithAssessment>(this.url('/api/hadith/assessments'), payload);
  }
  getHadithDashboardStats(): Observable<HadithDashboardStats> {
    return this.http.get<HadithDashboardStats>(this.url('/api/hadith/dashboard/stats'));
  }

  getHadithChapters(bookId: number): Observable<HadithChapter[]> {
    return this.http.get<HadithChapter[]>(this.url(`/api/hadith/books/${bookId}/chapters`));
  }
  getHadithReviewStats(studentId: number): Observable<HadithReviewStats> {
    return this.http.get<HadithReviewStats>(this.url(`/api/hadith/reviews/stats/${studentId}`));
  }
  getPendingHadithReviews(studentId: number, limit?: number): Observable<HadithItem[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<HadithItem[]>(this.url(`/api/hadith/reviews/pending/${studentId}`), { params });
  }
  submitHadithStudentReview(studentId: number, payload: SubmitHadithReviewPayload): Observable<HadithReview> {
    return this.http.post<HadithReview>(this.url(`/api/hadith/reviews/${studentId}`), payload);
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

  // ===== Arabic Literature =====

  getArabicPoets(difficulty?: string): Observable<ArabicLiteraturePoet[]> {
    let params = new HttpParams();
    if (difficulty) params = params.set('difficulty', difficulty);
    return this.http.get<ArabicLiteraturePoet[]>(this.url('/arabic-literature/poets'), { params });
  }
  getArabicPoetById(id: number): Observable<ArabicLiteraturePoet> {
    return this.http.get<ArabicLiteraturePoet>(this.url(`/arabic-literature/poets/${id}`));
  }
  createArabicPoet(payload: CreateArabicLiteraturePoetPayload): Observable<ArabicLiteraturePoet> {
    return this.http.post<ArabicLiteraturePoet>(this.url('/arabic-literature/poets'), payload);
  }
  updateArabicPoet(id: number, payload: Partial<CreateArabicLiteraturePoetPayload>): Observable<ArabicLiteraturePoet> {
    return this.http.put<ArabicLiteraturePoet>(this.url(`/arabic-literature/poets/${id}`), payload);
  }
  deleteArabicPoet(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/arabic-literature/poets/${id}`));
  }
  searchArabicPoets(query: string): Observable<ArabicLiteraturePoet[]> {
    return this.http.get<ArabicLiteraturePoet[]>(this.url('/arabic-literature/poets/search'), { params: { q: query } });
  }

  getArabicPoems(poetId?: number, genre?: string, difficulty?: string): Observable<ArabicLiteraturePoem[]> {
    let params = new HttpParams();
    if (poetId) params = params.set('poetId', poetId.toString());
    if (genre) params = params.set('genre', genre);
    if (difficulty) params = params.set('difficulty', difficulty);
    return this.http.get<ArabicLiteraturePoem[]>(this.url('/arabic-literature/poems'), { params });
  }
  getArabicPoemById(id: number): Observable<ArabicLiteraturePoem> {
    return this.http.get<ArabicLiteraturePoem>(this.url(`/arabic-literature/poems/${id}`));
  }
  createArabicPoem(payload: CreateArabicLiteraturePoemPayload): Observable<ArabicLiteraturePoem> {
    return this.http.post<ArabicLiteraturePoem>(this.url('/arabic-literature/poems'), payload);
  }
  updateArabicPoem(id: number, payload: Partial<CreateArabicLiteraturePoemPayload>): Observable<ArabicLiteraturePoem> {
    return this.http.put<ArabicLiteraturePoem>(this.url(`/arabic-literature/poems/${id}`), payload);
  }
  deleteArabicPoem(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/arabic-literature/poems/${id}`));
  }
  searchArabicPoems(query: string): Observable<ArabicLiteraturePoem[]> {
    return this.http.get<ArabicLiteraturePoem[]>(this.url('/arabic-literature/poems/search'), { params: { q: query } });
  }

  getArabicAnalysesByPoem(poemId: number): Observable<ArabicLiteratureAnalysis[]> {
    return this.http.get<ArabicLiteratureAnalysis[]>(this.url(`/arabic-literature/poems/${poemId}/analyses`));
  }
  getArabicAnalysisById(id: number): Observable<ArabicLiteratureAnalysis> {
    return this.http.get<ArabicLiteratureAnalysis>(this.url(`/arabic-literature/analyses/${id}`));
  }
  createArabicAnalysis(payload: CreateArabicLiteratureAnalysisPayload): Observable<ArabicLiteratureAnalysis> {
    return this.http.post<ArabicLiteratureAnalysis>(this.url('/arabic-literature/analyses'), payload);
  }
  updateArabicAnalysis(id: number, payload: Partial<CreateArabicLiteratureAnalysisPayload>): Observable<ArabicLiteratureAnalysis> {
    return this.http.put<ArabicLiteratureAnalysis>(this.url(`/arabic-literature/analyses/${id}`), payload);
  }
  deleteArabicAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/arabic-literature/analyses/${id}`));
  }

  getArabicCourses(): Observable<ArabicCourse[]> {
    return this.http.get<ArabicCourse[]>(this.url('/arabic-literature/courses'));
  }
  getArabicCourseById(id: number): Observable<ArabicCourse> {
    return this.http.get<ArabicCourse>(this.url(`/arabic-literature/courses/${id}`));
  }
  createArabicCourse(payload: CreateArabicCoursePayload): Observable<ArabicCourse> {
    return this.http.post<ArabicCourse>(this.url('/arabic-literature/courses'), payload);
  }
  updateArabicCourse(id: number, payload: UpdateArabicCoursePayload): Observable<ArabicCourse> {
    return this.http.put<ArabicCourse>(this.url(`/arabic-literature/courses/${id}`), payload);
  }
  deleteArabicCourse(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/arabic-literature/courses/${id}`));
  }

  getArabicLessons(courseId: number): Observable<ArabicLesson[]> {
    return this.http.get<ArabicLesson[]>(this.url(`/arabic-literature/courses/${courseId}/lessons`));
  }
  getArabicLessonById(id: number): Observable<ArabicLesson> {
    return this.http.get<ArabicLesson>(this.url(`/arabic-literature/lessons/${id}`));
  }
  createArabicLesson(payload: CreateArabicLessonPayload): Observable<ArabicLesson> {
    return this.http.post<ArabicLesson>(this.url('/arabic-literature/lessons'), payload);
  }
  updateArabicLesson(id: number, payload: UpdateArabicLessonPayload): Observable<ArabicLesson> {
    return this.http.put<ArabicLesson>(this.url(`/arabic-literature/lessons/${id}`), payload);
  }
  deleteArabicLesson(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/arabic-literature/lessons/${id}`));
  }

  getArabicUserProgress(): Observable<ArabicUserProgress[]> {
    return this.http.get<ArabicUserProgress[]>(this.url('/arabic-literature/progress'));
  }
  getArabicCourseProgress(courseId: number): Observable<ArabicUserProgress[]> {
    return this.http.get<ArabicUserProgress[]>(this.url(`/arabic-literature/courses/${courseId}/progress`));
  }
  recordArabicProgress(payload: RecordArabicProgressPayload): Observable<ArabicUserProgress> {
    return this.http.post<ArabicUserProgress>(this.url('/arabic-literature/progress'), payload);
  }

  getArabicDashboardStats(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(this.url('/arabic-literature/dashboard-stats'));
  }

  getLiteratureDashboardStats(): Observable<any> {
    return this.http.get<any>(this.url('/persian-literature/dashboard'));
  }

  getMathTopics(): Observable<MathTopic[]> {
    return this.http.get<MathTopic[]>(this.url('/math/topics'));
  }
  getMathTopicById(id: number): Observable<MathTopic> {
    return this.http.get<MathTopic>(this.url(`/math/topics/${id}`));
  }
  createMathTopic(payload: CreateMathTopicPayload): Observable<MathTopic> {
    return this.http.post<MathTopic>(this.url('/math/topics'), payload);
  }
  updateMathTopic(id: number, payload: UpdateMathTopicPayload): Observable<MathTopic> {
    return this.http.put<MathTopic>(this.url(`/math/topics/${id}`), payload);
  }
  deleteMathTopic(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/math/topics/${id}`));
  }
  searchMathTopics(query: string, maxResults?: number): Observable<MathTopic[]> {
    let params = new HttpParams().set('query', query);
    if (maxResults) params = params.set('maxResults', maxResults.toString());
    return this.http.get<MathTopic[]>(this.url('/math/topics/search'), { params });
  }

  getMathLessons(topicId?: number): Observable<MathLesson[]> {
    let params = new HttpParams();
    if (topicId) params = params.set('topicId', topicId.toString());
    return this.http.get<MathLesson[]>(this.url('/math/lessons'), { params });
  }
  getMathLessonById(id: number): Observable<MathLesson> {
    return this.http.get<MathLesson>(this.url(`/math/lessons/${id}`));
  }
  createMathLesson(payload: CreateMathLessonPayload): Observable<MathLesson> {
    return this.http.post<MathLesson>(this.url('/math/lessons'), payload);
  }
  updateMathLesson(id: number, payload: UpdateMathLessonPayload): Observable<MathLesson> {
    return this.http.put<MathLesson>(this.url(`/math/lessons/${id}`), payload);
  }
  deleteMathLesson(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/math/lessons/${id}`));
  }
  searchMathLessons(query: string, maxResults?: number): Observable<MathLesson[]> {
    let params = new HttpParams().set('query', query);
    if (maxResults) params = params.set('maxResults', maxResults.toString());
    return this.http.get<MathLesson[]>(this.url('/math/lessons/search'), { params });
  }

  getMathQuestions(lessonId?: number): Observable<MathQuestion[]> {
    let params = new HttpParams();
    if (lessonId) params = params.set('lessonId', lessonId.toString());
    return this.http.get<MathQuestion[]>(this.url('/math/questions'), { params });
  }
  getMathQuestionById(id: number): Observable<MathQuestion> {
    return this.http.get<MathQuestion>(this.url(`/math/questions/${id}`));
  }
  createMathQuestion(payload: CreateMathQuestionPayload): Observable<MathQuestion> {
    return this.http.post<MathQuestion>(this.url('/math/questions'), payload);
  }
  updateMathQuestion(id: number, payload: UpdateMathQuestionPayload): Observable<MathQuestion> {
    return this.http.put<MathQuestion>(this.url(`/math/questions/${id}`), payload);
  }
  deleteMathQuestion(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/math/questions/${id}`));
  }

  getMathStudentProgress(studentId: number): Observable<MathProgress[]> {
    return this.http.get<MathProgress[]>(this.url(`/math/progress/${studentId}`));
  }
  getMathStudentLessonProgress(studentId: number, lessonId: number): Observable<MathProgress> {
    return this.http.get<MathProgress>(this.url(`/math/progress/${studentId}/lesson/${lessonId}`));
  }
  recordMathProgress(payload: RecordMathProgressPayload): Observable<MathProgress> {
    return this.http.post<MathProgress>(this.url('/math/progress'), payload);
  }
  updateMathProgress(id: number, payload: UpdateMathProgressPayload): Observable<MathProgress> {
    return this.http.put<MathProgress>(this.url(`/math/progress/${id}`), payload);
  }

  getMathDashboardStats(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(this.url('/math/stats'));
  }

  getMathScholars(): Observable<MathScholar[]> {
    return this.http.get<MathScholar[]>(this.url('/math/scholars'));
  }
  getMathScholarById(id: number): Observable<MathScholar> {
    return this.http.get<MathScholar>(this.url(`/math/scholars/${id}`));
  }
  createMathScholar(payload: CreateMathScholarPayload): Observable<MathScholar> {
    return this.http.post<MathScholar>(this.url('/math/scholars'), payload);
  }
  updateMathScholar(id: number, payload: UpdateMathScholarPayload): Observable<MathScholar> {
    return this.http.put<MathScholar>(this.url(`/math/scholars/${id}`), payload);
  }
  deleteMathScholar(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/math/scholars/${id}`));
  }
  searchMathScholars(query: string, maxResults?: number): Observable<MathScholar[]> {
    let params = new HttpParams().set('query', query);
    if (maxResults) params = params.set('maxResults', maxResults.toString());
    return this.http.get<MathScholar[]>(this.url('/math/scholars/search'), { params });
  }

  getMathContributions(scholarId?: number, topicId?: number): Observable<MathContribution[]> {
    let params = new HttpParams();
    if (scholarId) params = params.set('scholarId', scholarId.toString());
    if (topicId) params = params.set('topicId', topicId.toString());
    return this.http.get<MathContribution[]>(this.url('/math/contributions'), { params });
  }
  getMathContributionById(id: number): Observable<MathContribution> {
    return this.http.get<MathContribution>(this.url(`/math/contributions/${id}`));
  }
  createMathContribution(payload: CreateMathContributionPayload): Observable<MathContribution> {
    return this.http.post<MathContribution>(this.url('/math/contributions'), payload);
  }
  updateMathContribution(id: number, payload: UpdateMathContributionPayload): Observable<MathContribution> {
    return this.http.put<MathContribution>(this.url(`/math/contributions/${id}`), payload);
  }
  deleteMathContribution(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/math/contributions/${id}`));
  }

  getExperimentalSciencesPhases(): Observable<PhaseDto[]> {
    return this.http.get<PhaseDto[]>(this.url('/experimental-sciences/phases'));
  }
  getExperimentalSciencesPhase(id: number): Observable<PhaseDto> {
    return this.http.get<PhaseDto>(this.url(`/experimental-sciences/phases/${id}`));
  }
  createExperimentalSciencesPhase(request: CreatePhaseRequest): Observable<PhaseDto> {
    return this.http.post<PhaseDto>(this.url('/experimental-sciences/phases'), request);
  }
  updateExperimentalSciencesPhase(id: number, request: UpdatePhaseRequest): Observable<void> {
    return this.http.put<void>(this.url(`/experimental-sciences/phases/${id}`), request);
  }
  deleteExperimentalSciencesPhase(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/experimental-sciences/phases/${id}`));
  }

  getExperimentalSciencesTopics(): Observable<TopicDto[]> {
    return this.http.get<TopicDto[]>(this.url('/experimental-sciences/topics'));
  }
  getExperimentalSciencesTopicsByPhase(phaseId: number): Observable<TopicDto[]> {
    return this.http.get<TopicDto[]>(this.url(`/experimental-sciences/phases/${phaseId}/topics`));
  }
  getExperimentalSciencesTopic(id: number): Observable<TopicDto> {
    return this.http.get<TopicDto>(this.url(`/experimental-sciences/topics/${id}`));
  }
  createExperimentalSciencesTopic(request: CreateTopicRequest): Observable<TopicDto> {
    return this.http.post<TopicDto>(this.url('/experimental-sciences/topics'), request);
  }
  updateExperimentalSciencesTopic(id: number, request: UpdateTopicRequest): Observable<void> {
    return this.http.put<void>(this.url(`/experimental-sciences/topics/${id}`), request);
  }
  deleteExperimentalSciencesTopic(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/experimental-sciences/topics/${id}`));
  }

  getExperimentalSciencesLessonsByTopic(topicId: number): Observable<LessonDto[]> {
    return this.http.get<LessonDto[]>(this.url(`/experimental-sciences/topics/${topicId}/lessons`));
  }
  getExperimentalSciencesLesson(id: number): Observable<LessonDto> {
    return this.http.get<LessonDto>(this.url(`/experimental-sciences/lessons/${id}`));
  }
  createExperimentalSciencesLesson(request: CreateLessonRequest): Observable<LessonDto> {
    return this.http.post<LessonDto>(this.url('/experimental-sciences/lessons'), request);
  }
  updateExperimentalSciencesLesson(id: number, request: UpdateLessonRequest): Observable<void> {
    return this.http.put<void>(this.url(`/experimental-sciences/lessons/${id}`), request);
  }
  deleteExperimentalSciencesLesson(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/experimental-sciences/lessons/${id}`));
  }

  getExperimentalSciencesExperimentsByLesson(lessonId: number): Observable<ExperimentDto[]> {
    return this.http.get<ExperimentDto[]>(this.url(`/experimental-sciences/lessons/${lessonId}/experiments`));
  }
  getExperimentalSciencesExperiment(id: number): Observable<ExperimentDto> {
    return this.http.get<ExperimentDto>(this.url(`/experimental-sciences/experiments/${id}`));
  }
  createExperimentalSciencesExperiment(request: CreateExperimentRequest): Observable<ExperimentDto> {
    return this.http.post<ExperimentDto>(this.url('/experimental-sciences/experiments'), request);
  }
  updateExperimentalSciencesExperiment(id: number, request: UpdateExperimentRequest): Observable<void> {
    return this.http.put<void>(this.url(`/experimental-sciences/experiments/${id}`), request);
  }
  deleteExperimentalSciencesExperiment(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/experimental-sciences/experiments/${id}`));
  }

  getExperimentalSciencesQuizByLesson(lessonId: number): Observable<ExpSciQuizDto> {
    return this.http.get<ExpSciQuizDto>(this.url(`/experimental-sciences/lessons/${lessonId}/quiz`));
  }
  getExperimentalSciencesQuiz(id: number): Observable<ExpSciQuizDto> {
    return this.http.get<ExpSciQuizDto>(this.url(`/experimental-sciences/quizzes/${id}`));
  }
  createExperimentalSciencesQuiz(request: CreateExpSciQuizRequest): Observable<ExpSciQuizDto> {
    return this.http.post<ExpSciQuizDto>(this.url('/experimental-sciences/quizzes'), request);
  }
  updateExperimentalSciencesQuiz(id: number, request: UpdateExpSciQuizRequest): Observable<void> {
    return this.http.put<void>(this.url(`/experimental-sciences/quizzes/${id}`), request);
  }
  deleteExperimentalSciencesQuiz(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/experimental-sciences/quizzes/${id}`));
  }

  getExperimentalSciencesQuizQuestions(quizId: number): Observable<ExpSciQuizQuestionDto[]> {
    return this.http.get<ExpSciQuizQuestionDto[]>(this.url(`/experimental-sciences/quizzes/${quizId}/questions`));
  }
  getExperimentalSciencesQuizQuestion(id: number): Observable<ExpSciQuizQuestionDto> {
    return this.http.get<ExpSciQuizQuestionDto>(this.url(`/experimental-sciences/quiz-questions/${id}`));
  }
  createExperimentalSciencesQuizQuestion(request: CreateExpSciQuizQuestionRequest): Observable<ExpSciQuizQuestionDto> {
    return this.http.post<ExpSciQuizQuestionDto>(this.url('/experimental-sciences/quiz-questions'), request);
  }
  updateExperimentalSciencesQuizQuestion(id: number, request: UpdateExpSciQuizQuestionRequest): Observable<void> {
    return this.http.put<void>(this.url(`/experimental-sciences/quiz-questions/${id}`), request);
  }
  deleteExperimentalSciencesQuizQuestion(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/experimental-sciences/quiz-questions/${id}`));
  }

  getExperimentalSciencesStudentProgress(studentId: number): Observable<StudentProgressDto[]> {
    return this.http.get<StudentProgressDto[]>(this.url(`/experimental-sciences/progress/${studentId}`));
  }
  getExperimentalSciencesStudentProgressByTopic(studentId: number, topicId: number): Observable<StudentProgressDto> {
    return this.http.get<StudentProgressDto>(this.url(`/experimental-sciences/progress/${studentId}/topic/${topicId}`));
  }
  updateExperimentalSciencesStudentProgress(studentId: number, topicId: number, request: UpdateStudentProgressRequest): Observable<void> {
    return this.http.put<void>(this.url(`/experimental-sciences/progress/${studentId}/topic/${topicId}`), request);
  }

  getExperimentalSciencesDashboardStats(): Observable<any> {
    return this.http.get<any>(this.url('/experimental-sciences/dashboard-stats'));
  }

  // ===== Persian Literature Learning System =====

  getLearningPaths(): Observable<LearningPath[]> {
    return this.http.get<LearningPath[]>(this.url('/learning/paths'));
  }
  getLearningPath(id: number): Observable<LearningPath> {
    return this.http.get<LearningPath>(this.url(`/learning/paths/${id}`));
  }
  getLearningPathTree(id: number): Observable<LearningPathTreeDto> {
    return this.http.get<LearningPathTreeDto>(this.url(`/learning/paths/${id}/tree`));
  }
  createLearningPath(payload: CreateLearningPathPayload): Observable<LearningPath> {
    return this.http.post<LearningPath>(this.url('/learning/paths'), payload);
  }
  updateLearningPath(id: number, payload: UpdateLearningPathPayload): Observable<LearningPath> {
    return this.http.put<LearningPath>(this.url(`/learning/paths/${id}`), payload);
  }
  deleteLearningPath(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/learning/paths/${id}`));
  }

  getLearningLevels(pathId: number): Observable<LearningLevel[]> {
    return this.http.get<LearningLevel[]>(this.url(`/learning/paths/${pathId}/levels`));
  }
  getLearningLevel(id: number): Observable<LearningLevel> {
    return this.http.get<LearningLevel>(this.url(`/learning/levels/${id}`));
  }
  createLearningLevel(payload: CreateLearningLevelPayload): Observable<LearningLevel> {
    return this.http.post<LearningLevel>(this.url('/learning/levels'), payload);
  }
  updateLearningLevel(id: number, payload: UpdateLearningLevelPayload): Observable<LearningLevel> {
    return this.http.put<LearningLevel>(this.url(`/learning/levels/${id}`), payload);
  }
  deleteLearningLevel(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/learning/levels/${id}`));
  }

  getStudyModules(levelId: number): Observable<StudyModule[]> {
    return this.http.get<StudyModule[]>(this.url(`/learning/levels/${levelId}/modules`));
  }
  getStudyModule(id: number): Observable<StudyModule> {
    return this.http.get<StudyModule>(this.url(`/learning/modules/${id}`));
  }
  createStudyModule(payload: CreateStudyModulePayload): Observable<StudyModule> {
    return this.http.post<StudyModule>(this.url('/learning/modules'), payload);
  }
  updateStudyModule(id: number, payload: UpdateStudyModulePayload): Observable<StudyModule> {
    return this.http.put<StudyModule>(this.url(`/learning/modules/${id}`), payload);
  }
  deleteStudyModule(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/learning/modules/${id}`));
  }

  getStudyLessons(moduleId: number): Observable<StudyLesson[]> {
    return this.http.get<StudyLesson[]>(this.url(`/learning/modules/${moduleId}/lessons`));
  }
  getStudyLesson(id: number): Observable<StudyLesson> {
    return this.http.get<StudyLesson>(this.url(`/learning/lessons/${id}`));
  }
  getLessonById(id: number): Observable<StudyLesson> {
    return this.http.get<StudyLesson>(this.url(`/learning/lessons/${id}`));
  }
  createStudyLesson(payload: CreateStudyLessonPayload): Observable<StudyLesson> {
    return this.http.post<StudyLesson>(this.url('/learning/lessons'), payload);
  }
  updateStudyLesson(id: number, payload: UpdateStudyLessonPayload): Observable<StudyLesson> {
    return this.http.put<StudyLesson>(this.url(`/learning/lessons/${id}`), payload);
  }
  deleteStudyLesson(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/learning/lessons/${id}`));
  }

  getContentBlocks(lessonId: number): Observable<LessonContentBlock[]> {
    return this.http.get<LessonContentBlock[]>(this.url(`/learning/lessons/${lessonId}/content-blocks`));
  }
  createContentBlock(payload: CreateContentBlockPayload): Observable<LessonContentBlock> {
    return this.http.post<LessonContentBlock>(this.url('/learning/content-blocks'), payload);
  }
  updateContentBlock(id: number, payload: UpdateContentBlockPayload): Observable<LessonContentBlock> {
    return this.http.put<LessonContentBlock>(this.url(`/learning/content-blocks/${id}`), payload);
  }
  deleteContentBlock(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/learning/content-blocks/${id}`));
  }

  getQuizzes(lessonId: number): Observable<PersLitQuiz[]> {
    return this.http.get<PersLitQuiz[]>(this.url(`/learning/lessons/${lessonId}/quizzes`));
  }
  getQuiz(id: number): Observable<PersLitQuiz> {
    return this.http.get<PersLitQuiz>(this.url(`/learning/quizzes/${id}`));
  }
  getQuizById(id: number): Observable<PersLitQuiz> {
    return this.http.get<PersLitQuiz>(this.url(`/learning/quizzes/${id}`));
  }
  createQuiz(payload: CreatePersLitQuizPayload): Observable<PersLitQuiz> {
    return this.http.post<PersLitQuiz>(this.url('/learning/quizzes'), payload);
  }
  updateQuiz(id: number, payload: UpdatePersLitQuizPayload): Observable<PersLitQuiz> {
    return this.http.put<PersLitQuiz>(this.url(`/learning/quizzes/${id}`), payload);
  }
  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/learning/quizzes/${id}`));
  }

  getQuizQuestions(quizId: number): Observable<PersLitQuizQuestion[]> {
    return this.http.get<PersLitQuizQuestion[]>(this.url(`/learning/quizzes/${quizId}/questions`));
  }
  createQuizQuestion(payload: CreatePersLitQuizQuestionPayload): Observable<PersLitQuizQuestion> {
    return this.http.post<PersLitQuizQuestion>(this.url('/learning/quiz-questions'), payload);
  }
  updateQuizQuestion(id: number, payload: UpdatePersLitQuizQuestionPayload): Observable<PersLitQuizQuestion> {
    return this.http.put<PersLitQuizQuestion>(this.url(`/learning/quiz-questions/${id}`), payload);
  }
  deleteQuizQuestion(id: number): Observable<void> {
    return this.http.delete<void>(this.url(`/learning/quiz-questions/${id}`));
  }

  enrollUser(payload: EnrollUserRequest): Observable<UserEnrollment> {
    return this.http.post<UserEnrollment>(this.url('/learning/enroll'), payload);
  }
  getUserEnrollments(userId?: number): Observable<UserEnrollment[]> {
    const url = userId ? this.url(`/learning/enrollments/${userId}`) : this.url('/learning/enrollments');
    return this.http.get<UserEnrollment[]>(url);
  }
  getUserDashboard(userId: number, pathId: number): Observable<UserDashboardDto> {
    return this.http.get<UserDashboardDto>(this.url(`/learning/dashboard/${userId}/${pathId}`));
  }
  getLearningDashboardStats(): Observable<LearningDashboardStatsDto> {
    return this.http.get<LearningDashboardStatsDto>(this.url('/learning/dashboard/stats'));
  }

  updateLessonProgress(payload: { lessonId: number; status: string; score?: number }): Observable<UserLessonProgress> {
    return this.http.patch<UserLessonProgress>(this.url(`/learning/progress/${payload.lessonId}`), { status: payload.status, score: payload.score });
  }

  submitQuiz(payload: SubmitQuizRequest): Observable<any> {
    return this.http.post<any>(this.url('/learning/quiz/submit'), payload);
  }
  getUserQuizAttempts(enrollmentId: number): Observable<UserQuizAttempt[]> {
    return this.http.get<UserQuizAttempt[]>(this.url(`/learning/quiz-attempts/${enrollmentId}`));
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
