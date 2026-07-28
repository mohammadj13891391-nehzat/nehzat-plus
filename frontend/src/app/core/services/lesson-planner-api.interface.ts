import { Observable } from 'rxjs';

import {
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
  CreateDailySeriesPayload,
  CreateEvaluationPayload,
  CreateEvaluatorPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
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
  CreateCurriculumVersionPayload,
  UpdateCurriculumVersionPayload,
  EvaluationRecord,
  Evaluator,
  GenerateWeeklyAssessmentPayload,
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
  Madrasah,
  MaktabBranch,
  MonthlyBooklet,
  CreateMonthlyBookletPayload,
  UpdateMonthlyBookletPayload,
  Parent,
  ParentStudentInfo,
  PendingUser,
  ProgressionResult,
  Ring,
  RingStudent,
  Student,
  StudentAssessmentHistory,
  StudentAssignmentGateState,
  StudentInfo,
  StudentProgressResponse,
  StudentProgressSummary,
  StudentSkillProgress,
  RingDashboardDto,
  SubjectArea,
  SubmitAssessmentResultPayload,
  TeachingMethod,
  UpdateAttachmentPayload,
  UpdateMadrasahPayload,
  UpdateStudentPayload,
  UpdateSubjectAreaPayload,
  UpdateTeachingMethodPayload,
  UpdateCurriculumObjectivePayload,
  UpdateBookPayload,
  UpdateRingPayload,
  UpdateSkillProgressPayload,
  SpiritualPracticeItem,
  SpiritualOccasion,
  SpiritualOccasionDetail,
  DailySpiritualEntry,
  UpsertDailySpiritualEntryPayload,
  UserOccasionProgress,
  MarkOccasionPracticePayload,
  SpiritualPath,
  StudentPathSelection,
  StudentPathHistory,
  PathRankingPayload,
  FinalizePathPayload,
  AvailablePath,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  GradeSubmissionPayload,
  TeacherDashboardSummary,
  Teacher,
  AssignmentGrading,
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
  SurveyAnalytics,
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

export abstract class LessonPlannerApi {
  abstract signin(payload: AuthSigninPayload): Observable<AuthSigninResponse>;
  abstract signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse>;

  abstract seedDatabase(): Observable<ApiMessageResponse>;

  abstract getActiveCourses(): Observable<Course[]>;
  abstract getCourses(): Observable<Course[]>;
  abstract getCourseById(id: number): Observable<Course>;
  abstract createCourse(payload: CreateCoursePayload): Observable<Course>;
  abstract updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course>;
  abstract deleteCourse(id: number): Observable<ApiMessageResponse>;
  abstract getCourseAssignments(courseId: number): Observable<Assignment[]>;
  abstract createCourseAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment>;

  abstract getStudentProgress(studentId: number): Observable<StudentProgressResponse>;
  abstract getStudentSubmissions(studentId: number, assignmentId?: number): Observable<AssignmentSubmission[]>;
  abstract getAssignmentProgress(studentId: number, assignmentId: number): Observable<StudentAssignmentGateState>;
  abstract registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string
  ): Observable<StudentAssignmentGateState>;
  abstract submitAssignment(
    studentId: number,
    assignmentId: number,
    payload: FormData
  ): Observable<AssignmentSubmission>;
  abstract uploadSubmissionFile(
    studentId: number,
    submissionId: number,
    payload: FormData
  ): Observable<AssignmentSubmission>;

  abstract getAllStudents(): Observable<StudentInfo[]>;

  abstract getPendingUsers(): Observable<PendingUser[]>;
  abstract approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse>;
  abstract rejectUser(userId: number): Observable<ApiMessageResponse>;
  abstract createUser(payload: CreateUserPayload): Observable<CreatedUser>;

  abstract getAdminCourses(): Observable<Course[]>;
  abstract createAdminCourse(payload: CreateCoursePayload): Observable<Course>;
  abstract updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course>;
  abstract deleteAdminCourse(id: number): Observable<ApiMessageResponse>;
  abstract searchAdminCourses(query: string): Observable<Course[]>;
  abstract filterAdminCourses(status: string): Observable<Course[]>;

  abstract getAdminCourseAssignments(courseId: number): Observable<Assignment[]>;
  abstract getAssignmentById(id: number): Observable<Assignment>;
  abstract createAdminAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment>;
  abstract updateAdminAssignment(id: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment>;
  abstract deleteAdminAssignment(id: number): Observable<ApiMessageResponse>;
  abstract createDailyAssignments(
    courseId: number,
    payload: CreateDailySeriesPayload
  ): Observable<Assignment[]>;

  abstract getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]>;
  abstract createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment>;
  abstract uploadAttachmentFile(attachmentId: number, payload: FormData): Observable<AssignmentAttachment>;
  abstract updateAttachment(
    attachmentId: number,
    payload: UpdateAttachmentPayload
  ): Observable<AssignmentAttachment>;
  abstract deleteAttachment(attachmentId: number): Observable<ApiMessageResponse>;

  abstract getCoaches(): Observable<Coach[]>;
  abstract createCoach(payload: CreateCoachPayload): Observable<Coach>;
  abstract updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach>;
  abstract deleteCoach(id: number): Observable<ApiMessageResponse>;

  abstract getStudents(): Observable<Student[]>;
  abstract createStudent(payload: CreateStudentPayload): Observable<Student>;
  abstract updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student>;
  abstract deleteStudent(id: number): Observable<ApiMessageResponse>;

  abstract getBranchManagers(): Observable<BranchManager[]>;
  abstract createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager>;
  abstract updateBranchManager(id: number, payload: Partial<CreateBranchManagerPayload>): Observable<BranchManager>;
  abstract deleteBranchManager(id: number): Observable<ApiMessageResponse>;

  abstract getBranches(): Observable<Branch[]>;
  abstract createBranch(payload: CreateBranchPayload): Observable<Branch>;
  abstract updateBranch(id: number, payload: UpdateBranchPayload): Observable<Branch>;
  abstract deleteBranch(id: number): Observable<ApiMessageResponse>;

  abstract getSystemStatistics(): Observable<AdminSystemStatistics>;
  abstract getCourseStatistics(courseId: number): Observable<unknown>;

  abstract getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]>;
  abstract enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse>;
  abstract unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse>;
  abstract generateCourseInviteCode(courseId: number): Observable<CourseInviteCode>;

  abstract getMadrasahs(): Observable<Madrasah[]>;
  abstract createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah>;
  abstract updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah>;
  abstract deleteMadrasah(id: number): Observable<ApiMessageResponse>;

  abstract getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]>;
  abstract createMaktabBranch(madrasahId: number, payload: CreateMaktabBranchPayload): Observable<MaktabBranch>;
  abstract deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse>;

  abstract getSubjectAreas(): Observable<SubjectArea[]>;
  abstract createSubjectArea(payload: CreateSubjectAreaPayload): Observable<SubjectArea>;
  abstract updateSubjectArea(id: number, payload: UpdateSubjectAreaPayload): Observable<SubjectArea>;
  abstract deleteSubjectArea(id: number): Observable<ApiMessageResponse>;

  abstract getTeachingMethods(): Observable<TeachingMethod[]>;
  abstract createTeachingMethod(payload: CreateTeachingMethodPayload): Observable<TeachingMethod>;
  abstract updateTeachingMethod(id: number, payload: UpdateTeachingMethodPayload): Observable<TeachingMethod>;
  abstract deleteTeachingMethod(id: number): Observable<ApiMessageResponse>;

  abstract getRings(): Observable<Ring[]>;
  abstract getRingById(id: number): Observable<Ring>;
  abstract createRing(payload: CreateRingPayload): Observable<Ring>;
  abstract updateRing(id: number, payload: UpdateRingPayload): Observable<Ring>;
  abstract deleteRing(id: number): Observable<ApiMessageResponse>;

  // Coach-specific ring endpoints
  abstract getMyRings(): Observable<Ring[]>;
  abstract getMyRingStudents(): Observable<RingStudent[]>;
  abstract getRingDashboard(ringId: number): Observable<RingDashboardDto>;

  abstract getRingStudents(ringId: number): Observable<RingStudent[]>;
  abstract addRingStudent(ringId: number, payload: CreateRingStudentPayload): Observable<RingStudent>;
  abstract removeRingStudent(ringId: number, studentId: number): Observable<ApiMessageResponse>;

  abstract addRingBook(ringId: number, payload: CreateRingBookPayload): Observable<ApiMessageResponse>;
  abstract removeRingBook(ringId: number, bookId: number): Observable<ApiMessageResponse>;

  abstract addRingTeachingMethod(ringId: number, payload: CreateRingTeachingMethodPayload): Observable<ApiMessageResponse>;
  abstract removeRingTeachingMethod(ringId: number, teachingMethodId: number): Observable<ApiMessageResponse>;

  abstract getObjectives(): Observable<CurriculumObjective[]>;
  abstract createObjective(payload: CreateCurriculumObjectivePayload): Observable<CurriculumObjective>;
  abstract updateObjective(id: number, payload: UpdateCurriculumObjectivePayload): Observable<CurriculumObjective>;
  abstract deleteObjective(id: number): Observable<ApiMessageResponse>;

  abstract getBooks(): Observable<Book[]>;
  abstract createBook(payload: CreateBookPayload): Observable<Book>;
  abstract updateBook(id: number, payload: UpdateBookPayload): Observable<Book>;
  abstract deleteBook(id: number): Observable<ApiMessageResponse>;

  abstract getAgeGroups(): Observable<AgeGroup[]>;
  abstract getSkillProgressByStudent(studentId: number): Observable<StudentSkillProgress[]>;
  abstract getSkillProgressByRing(ringId: number): Observable<StudentSkillProgress[]>;
  abstract updateSkillProgress(id: number, payload: UpdateSkillProgressPayload): Observable<StudentSkillProgress>;

  abstract getParents(): Observable<Parent[]>;
  abstract createParent(payload: CreateParentPayload): Observable<Parent>;
  abstract updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent>;
  abstract deleteParent(id: number): Observable<ApiMessageResponse>;
  abstract getParentStudents(parentId: number): Observable<ParentStudentInfo[]>;

  abstract getEvaluators(): Observable<Evaluator[]>;
  abstract createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator>;
  abstract updateEvaluator(id: number, payload: Partial<CreateEvaluatorPayload>): Observable<Evaluator>;
  abstract deleteEvaluator(id: number): Observable<ApiMessageResponse>;

  abstract getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]>;
  abstract createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord>;
  abstract deleteEvaluation(id: number): Observable<ApiMessageResponse>;

  abstract getHeadquartersSummary(): Observable<HeadquartersSummary>;
  abstract getBranchPerformance(): Observable<BranchPerformance[]>;
  abstract getCoachPerformance(): Observable<CoachPerformance[]>;

  abstract getAssessments(): Observable<Assessment[]>;
  abstract getAssessmentById(id: number): Observable<Assessment>;
  abstract getAssessmentsByCourse(courseId: number): Observable<Assessment[]>;
  abstract getAssessmentsByDateRange(courseId: number, startDate: string, endDate: string): Observable<Assessment[]>;
  abstract createAssessment(payload: Partial<Assessment>): Observable<Assessment>;
  abstract updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment>;
  abstract deleteAssessment(id: number): Observable<ApiMessageResponse>;
  abstract generateWeeklyAssessment(payload: GenerateWeeklyAssessmentPayload): Observable<Assessment>;

  abstract getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]>;
  abstract createAssessmentQuestion(assessmentId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion>;
  abstract updateAssessmentQuestion(questionId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion>;
  abstract deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse>;

  abstract submitAssessmentResult(assessmentId: number, payload: SubmitAssessmentResultPayload): Observable<AssessmentResult>;
  abstract startAssessment(assessmentId: number, studentId: number): Observable<AssessmentResult>;
  abstract getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]>;
  abstract getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]>;
  abstract getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics>;
  abstract getStudentAssessmentHistory(studentId: number, courseId: number): Observable<StudentAssessmentHistory>;

  abstract getProgressSummary(studentId: number): Observable<StudentProgressSummary>;
  abstract syncFromSubmission(submissionId: number): Observable<ApiMessageResponse>;

  // Spiritual Practice & Path
  abstract getSpiritualPractices(): Observable<SpiritualPracticeItem[]>;
  abstract getSpiritualPracticesForMe(age?: number, gender?: string, role?: string): Observable<SpiritualPracticeItem[]>;
  abstract getSpiritualOccasions(): Observable<SpiritualOccasion[]>;
  abstract getSpiritualOccasionDetail(occasionId: number): Observable<SpiritualOccasionDetail>;
  abstract getDailySpiritualEntry(userId: number, date: string): Observable<DailySpiritualEntry>;
  abstract upsertDailySpiritualEntry(payload: UpsertDailySpiritualEntryPayload): Observable<DailySpiritualEntry>;
  abstract getSpiritualEntryHistory(userId: number, fromDate?: string, toDate?: string): Observable<DailySpiritualEntry[]>;
  abstract getSpiritualStreak(userId: number): Observable<{ streak: number }>;
  abstract getUserOccasionProgress(userId: number, occasionId?: number, hijriYear?: number): Observable<UserOccasionProgress[]>;
  abstract markOccasionPractice(payload: MarkOccasionPracticePayload): Observable<UserOccasionProgress>;
  abstract getAvailablePaths(studentId: number): Observable<AvailablePath[]>;
  abstract submitPathRanking(studentId: number, payload: PathRankingPayload): Observable<StudentPathSelection>;
  abstract finalizePath(payload: FinalizePathPayload): Observable<StudentPathSelection>;
  abstract switchFinalizedPath(payload: FinalizePathPayload): Observable<StudentPathSelection>;
  abstract getStudentPathSelection(studentId: number): Observable<StudentPathSelection>;
  abstract getStudentPathHistory(studentId: number): Observable<unknown[]>;

  // Monthly Booklets (Phase 3.6)
  abstract getMonthlyBooklets(studentId?: number): Observable<MonthlyBooklet[]>;
  abstract getMonthlyBookletById(id: number): Observable<MonthlyBooklet>;
  abstract getMonthlyBookletsByStudent(studentId: number): Observable<MonthlyBooklet[]>;
  abstract getMonthlyBookletByPeriod(studentId: number, year: number, month: number): Observable<MonthlyBooklet>;
  abstract createMonthlyBooklet(payload: CreateMonthlyBookletPayload): Observable<MonthlyBooklet>;
  abstract updateMonthlyBooklet(id: number, payload: UpdateMonthlyBookletPayload): Observable<MonthlyBooklet>;
  abstract deleteMonthlyBooklet(id: number): Observable<ApiMessageResponse>;

  // Curriculum Versions (Phase 3.3)
  abstract getCurriculumVersions(): Observable<CurriculumVersion[]>;
  abstract getCurriculumVersionById(id: number): Observable<CurriculumVersion>;
  abstract getActiveCurriculumVersion(): Observable<CurriculumVersion>;
  abstract createCurriculumVersion(payload: CreateCurriculumVersionPayload): Observable<CurriculumVersion>;
  abstract updateCurriculumVersion(id: number, payload: UpdateCurriculumVersionPayload): Observable<CurriculumVersion>;
  abstract deleteCurriculumVersion(id: number): Observable<ApiMessageResponse>;

  // Progression (Phase 3.1)
  abstract checkProgression(studentId: number): Observable<ProgressionResult>;
  abstract checkRingProgression(ringId: number): Observable<ProgressionResult[]>;
  abstract recordProgression(payload: { studentId: number; fromLevel: string; toLevel: string }): Observable<StudentPathHistory>;

  // Biweekly Progress (Phase 4)
  abstract getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse>;

  // Teacher (Phase 5)
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

  abstract getCompetitions(): Observable<Competition[]>;
  abstract getActiveCompetitions(): Observable<Competition[]>;
  abstract getCompetitionById(id: number): Observable<CompetitionDetail>;
  abstract createCompetition(payload: CreateCompetitionPayload): Observable<Competition>;
  abstract updateCompetition(id: number, payload: UpdateCompetitionPayload): Observable<Competition>;
  abstract deleteCompetition(id: number): Observable<ApiMessageResponse>;
  abstract registerParticipant(competitionId: number, payload: RegisterParticipantPayload): Observable<CompetitionParticipant>;
  abstract removeParticipant(competitionId: number, studentId: number): Observable<ApiMessageResponse>;
  abstract updateParticipantScore(competitionId: number, studentId: number, payload: UpdateParticipantScorePayload): Observable<CompetitionParticipant>;
  abstract getCompetitionResults(competitionId: number): Observable<CompetitionResult>;

  abstract getLeagues(): Observable<League[]>;
  abstract getActiveLeagues(): Observable<League[]>;
  abstract getLeagueById(id: number): Observable<LeagueDetail>;
  abstract createLeague(payload: CreateLeaguePayload): Observable<League>;
  abstract updateLeague(id: number, payload: UpdateLeaguePayload): Observable<League>;
  abstract deleteLeague(id: number): Observable<ApiMessageResponse>;
  abstract getLeagueRankings(leagueId: number): Observable<LeagueRanking[]>;
  abstract updateLeagueRanking(leagueId: number, payload: UpdateLeagueRankingPayload): Observable<LeagueRanking>;

  abstract getIssueSurveys(): Observable<IssueSurvey[]>;
  abstract getIssueSurveyById(id: number): Observable<IssueSurvey>;
  abstract createIssueSurvey(payload: CreateIssueSurveyPayload): Observable<IssueSurvey>;
  abstract updateIssueSurvey(id: number, payload: UpdateIssueSurveyPayload): Observable<IssueSurvey>;
  abstract deleteIssueSurvey(id: number): Observable<ApiMessageResponse>;
  abstract publishIssueSurvey(id: number): Observable<IssueSurvey>;
  abstract closeIssueSurvey(id: number): Observable<IssueSurvey>;
  abstract duplicateIssueSurvey(id: number): Observable<IssueSurvey>;

  abstract getIssueSurveyQuestions(surveyId: number): Observable<IssueSurveyQuestion[]>;
  abstract createIssueSurveyQuestion(surveyId: number, payload: CreateIssueQuestionPayload): Observable<IssueSurveyQuestion>;
  abstract updateIssueSurveyQuestion(surveyId: number, questionId: number, payload: Partial<CreateIssueQuestionPayload>): Observable<IssueSurveyQuestion>;
  abstract deleteIssueSurveyQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse>;
  abstract reorderIssueQuestions(surveyId: number, questionIds: number[]): Observable<void>;

  abstract getIssueSurveysForRespond(surveyId: number): Observable<IssueSurvey>;
  abstract submitSurveyResponses(surveyId: number, payload: SubmitSurveyResponsePayload): Observable<IssueSurveyResponse[]>;

  abstract getSurveyAnalytics(surveyId: number): Observable<SurveyAnalytics>;
  abstract getSurveyCategoryBreakdown(surveyId: number): Observable<CategoryAnalytics[]>;
  abstract getSurveyTrends(): Observable<any[]>;
  abstract exportSurveyJson(surveyId: number): Observable<any[]>;

  abstract getSurveyComments(surveyId: number): Observable<IssueSurveyComment[]>;
  abstract addSurveyComment(surveyId: number, payload: { comment: string }): Observable<IssueSurveyComment>;

  abstract getSurveyActions(surveyId: number): Observable<IssueAction[]>;
  abstract createSurveyAction(surveyId: number, payload: CreateIssueActionPayload): Observable<IssueAction>;
  abstract updateIssueAction(id: number, payload: Partial<IssueAction>): Observable<IssueAction>;
  abstract updateIssueActionStatus(id: number, status: string, updatedById: number, note?: string, progressPercent?: number): Observable<IssueAction>;

  abstract getIssueItemPool(category?: string): Observable<IssueItemPool[]>;
  abstract createIssueItemPool(payload: CreateIssueItemPoolPayload): Observable<IssueItemPool>;
  abstract addPoolItemToSurvey(poolItemId: number, surveyId: number, sortOrder?: number): Observable<IssueItemPool>;

  abstract getIssueDashboardSummary(): Observable<IssueDashboardSummary>;

  abstract getServiceSurveys(targetRole?: string): Observable<ServiceSurvey[]>;
  abstract getServiceSurveyById(id: number): Observable<ServiceSurvey>;
  abstract createServiceSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey>;
  abstract updateServiceSurvey(id: number, payload: UpdateServiceSurveyPayload): Observable<ServiceSurvey>;
  abstract deleteServiceSurvey(id: number): Observable<ApiMessageResponse>;
  abstract publishServiceSurvey(id: number): Observable<ServiceSurvey>;
  abstract closeServiceSurvey(id: number): Observable<ServiceSurvey>;

  abstract getServiceSurveyQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]>;
  abstract createServiceQuestion(surveyId: number, payload: CreateServiceQuestionPayload): Observable<ServiceSurveyQuestion>;
  abstract deleteServiceQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse>;

  abstract getServiceSurveyResponses(surveyId: number): Observable<ServiceSurveyResponse[]>;
  abstract submitServiceSurveyResponse(payload: SubmitServiceSurveyPayload): Observable<ServiceSurveyResponse>;

  abstract getServiceSurveyAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics>;
  abstract getServiceDashboardSummary(): Observable<ServiceDashboardSummary>;

  abstract getSurahs(): Observable<Surah[]>;
  abstract getSurahById(id: number): Observable<Surah>;
  abstract createSurah(surah: Partial<Surah>): Observable<Surah>;
  abstract updateSurah(id: number, surah: Partial<Surah>): Observable<Surah>;
  abstract deleteSurah(id: number): Observable<void>;

  abstract getAyahs(surahId: number): Observable<Ayah[]>;
  abstract getAyahsBySurah(surahId: number): Observable<Ayah[]>;
  abstract getAyahById(id: number): Observable<Ayah>;
  abstract createAyah(ayah: Partial<Ayah>): Observable<Ayah>;
  abstract updateAyah(id: number, ayah: Partial<Ayah>): Observable<Ayah>;
  abstract deleteAyah(id: number): Observable<void>;

  abstract getTajweedRules(): Observable<TajweedRule[]>;
  abstract getTajweedRule(id: number): Observable<TajweedRule>;
  abstract createTajweedRule(rule: Partial<TajweedRule>): Observable<TajweedRule>;
  abstract updateTajweedRule(id: number, rule: Partial<TajweedRule>): Observable<TajweedRule>;
  abstract deleteTajweedRule(id: number): Observable<void>;

  abstract getRecitationLevels(): Observable<RecitationLevel[]>;
  abstract getRecitationLevel(id: number): Observable<RecitationLevel>;
  abstract createRecitationLevel(level: Partial<RecitationLevel>): Observable<RecitationLevel>;
  abstract updateRecitationLevel(id: number, level: Partial<RecitationLevel>): Observable<RecitationLevel>;
  abstract deleteRecitationLevel(id: number): Observable<void>;

  abstract getQuranCurricula(): Observable<QuranCurriculum[]>;
  abstract getQuranCurriculumById(id: number): Observable<QuranCurriculum>;
  abstract createQuranCurriculum(curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum>;
  abstract updateQuranCurriculum(id: number, curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum>;
  abstract deleteQuranCurriculum(id: number): Observable<void>;

  abstract getQuranStudentProgress(studentId: number): Observable<QuranStudentProgress>;
  abstract getQuranProgress(id: number): Observable<QuranStudentProgress>;
  abstract createQuranProgress(progress: Partial<QuranStudentProgress>): Observable<QuranStudentProgress>;

  abstract getQuranLessonPlans(): Observable<any[]>;
  abstract getQuranLessonPlanById(id: number): Observable<any>;
  abstract createQuranLessonPlan(payload: any): Observable<any>;
  abstract updateQuranLessonPlan(id: number, payload: any): Observable<any>;
  abstract deleteQuranLessonPlan(id: number): Observable<void>;

  abstract getQuranDashboardStats(): Observable<any>;
  abstract searchAyahs(query: string, max?: number): Observable<Ayah[]>;

  // Persian Literature
  abstract getPoets(difficulty?: string): Observable<PersianLiteraturePoet[]>;
  abstract getPoetById(id: number): Observable<PersianLiteraturePoet>;
  abstract createPoet(payload: CreatePersianLiteraturePoetPayload): Observable<PersianLiteraturePoet>;
  abstract updatePoet(id: number, payload: Partial<CreatePersianLiteraturePoetPayload>): Observable<PersianLiteraturePoet>;
  abstract deletePoet(id: number): Observable<void>;
  abstract searchPoets(query: string): Observable<PersianLiteraturePoet[]>;

  abstract getPoems(poetId?: number, genre?: string, difficulty?: string): Observable<PersianLiteraturePoem[]>;
  abstract getPoemById(id: number): Observable<PersianLiteraturePoem>;
  abstract createPoem(payload: CreatePersianLiteraturePoemPayload): Observable<PersianLiteraturePoem>;
  abstract updatePoem(id: number, payload: Partial<CreatePersianLiteraturePoemPayload>): Observable<PersianLiteraturePoem>;
  abstract deletePoem(id: number): Observable<void>;
  abstract searchPoems(query: string): Observable<PersianLiteraturePoem[]>;

  abstract getAnalysesByPoem(poemId: number): Observable<PersianLiteratureAnalysis[]>;
  abstract getAnalysisById(id: number): Observable<PersianLiteratureAnalysis>;
  abstract createAnalysis(payload: CreatePersianLiteratureAnalysisPayload): Observable<PersianLiteratureAnalysis>;
  abstract updateAnalysis(id: number, payload: Partial<CreatePersianLiteratureAnalysisPayload>): Observable<PersianLiteratureAnalysis>;
  abstract deleteAnalysis(id: number): Observable<void>;

  abstract getLiteratureDashboardStats(): Observable<any>;
}
