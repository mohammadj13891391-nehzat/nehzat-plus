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
  HadithBook,
  HadithBookDetail,
  HadithChapter,
  HadithChapterDetail,
  HadithItem,
  HadithReviewCard,
  UserHadithProgress,
  HadithAssessment,
  SubmitReviewPayload,
  HadithDashboardStats,
  HadithReview,
  HadithReviewStats,
  SubmitHadithReviewPayload,
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
  LearningPathTreeDto,
  UserDashboardDto,
  LearningDashboardStatsDto,
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
  /** Coach-accessible student list (GET /students — StudentController allows coach). */
  abstract getCoachStudents(): Observable<Student[]>;
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

  // ===== Hadith Module =====
  abstract getHadithBooks(): Observable<HadithBook[]>;
  abstract getHadithBookById(id: number): Observable<HadithBookDetail>;
  abstract createHadithBook(payload: Partial<HadithBook>): Observable<HadithBook>;
  abstract updateHadithBook(id: number, payload: Partial<HadithBook>): Observable<HadithBook>;
  abstract deleteHadithBook(id: number): Observable<void>;
  abstract getHadithChaptersByBook(bookId: number): Observable<HadithChapter[]>;
  abstract getHadithChapterById(id: number): Observable<HadithChapterDetail>;
  abstract createHadithChapter(payload: Partial<HadithChapter>): Observable<HadithChapter>;
  abstract updateHadithChapter(id: number, payload: Partial<HadithChapter>): Observable<HadithChapter>;
  abstract deleteHadithChapter(id: number): Observable<void>;
  abstract getHadithsByChapter(chapterId: number): Observable<HadithItem[]>;
  abstract getHadithById(id: number): Observable<HadithItem>;
  abstract createHadith(payload: Partial<HadithItem>): Observable<HadithItem>;
  abstract updateHadith(id: number, payload: Partial<HadithItem>): Observable<HadithItem>;
  abstract deleteHadith(id: number): Observable<void>;
  abstract getDueHadithReviews(count: number): Observable<HadithReviewCard[]>;
  abstract submitHadithReview(payload: SubmitReviewPayload): Observable<UserHadithProgress>;
  abstract getHadithProgressSummary(): Observable<Record<string, number>>;
  abstract getHadithAssessmentsByChapter(chapterId: number): Observable<HadithAssessment[]>;
  abstract createHadithAssessment(payload: Partial<HadithAssessment>): Observable<HadithAssessment>;
  abstract getHadithDashboardStats(): Observable<HadithDashboardStats>;
  abstract getHadithChapters(bookId: number): Observable<HadithChapter[]>;
  abstract getHadithReviewStats(studentId: number): Observable<HadithReviewStats>;
  abstract getPendingHadithReviews(studentId: number, limit?: number): Observable<HadithItem[]>;
  abstract submitHadithStudentReview(studentId: number, payload: SubmitHadithReviewPayload): Observable<HadithReview>;

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

  // Arabic Literature
  abstract getArabicPoets(difficulty?: string): Observable<ArabicLiteraturePoet[]>;
  abstract getArabicPoetById(id: number): Observable<ArabicLiteraturePoet>;
  abstract createArabicPoet(payload: CreateArabicLiteraturePoetPayload): Observable<ArabicLiteraturePoet>;
  abstract updateArabicPoet(id: number, payload: Partial<CreateArabicLiteraturePoetPayload>): Observable<ArabicLiteraturePoet>;
  abstract deleteArabicPoet(id: number): Observable<void>;
  abstract searchArabicPoets(query: string): Observable<ArabicLiteraturePoet[]>;

  abstract getArabicPoems(poetId?: number, genre?: string, difficulty?: string): Observable<ArabicLiteraturePoem[]>;
  abstract getArabicPoemById(id: number): Observable<ArabicLiteraturePoem>;
  abstract createArabicPoem(payload: CreateArabicLiteraturePoemPayload): Observable<ArabicLiteraturePoem>;
  abstract updateArabicPoem(id: number, payload: Partial<CreateArabicLiteraturePoemPayload>): Observable<ArabicLiteraturePoem>;
  abstract deleteArabicPoem(id: number): Observable<void>;
  abstract searchArabicPoems(query: string): Observable<ArabicLiteraturePoem[]>;

  abstract getArabicAnalysesByPoem(poemId: number): Observable<ArabicLiteratureAnalysis[]>;
  abstract getArabicAnalysisById(id: number): Observable<ArabicLiteratureAnalysis>;
  abstract createArabicAnalysis(payload: CreateArabicLiteratureAnalysisPayload): Observable<ArabicLiteratureAnalysis>;
  abstract updateArabicAnalysis(id: number, payload: Partial<CreateArabicLiteratureAnalysisPayload>): Observable<ArabicLiteratureAnalysis>;
  abstract deleteArabicAnalysis(id: number): Observable<void>;

  // Arabic Literature Curriculum
  abstract getArabicCourses(): Observable<ArabicCourse[]>;
  abstract getArabicCourseById(id: number): Observable<ArabicCourse>;
  abstract createArabicCourse(payload: CreateArabicCoursePayload): Observable<ArabicCourse>;
  abstract updateArabicCourse(id: number, payload: UpdateArabicCoursePayload): Observable<ArabicCourse>;
  abstract deleteArabicCourse(id: number): Observable<void>;

  abstract getArabicLessons(courseId: number): Observable<ArabicLesson[]>;
  abstract getArabicLessonById(id: number): Observable<ArabicLesson>;
  abstract createArabicLesson(payload: CreateArabicLessonPayload): Observable<ArabicLesson>;
  abstract updateArabicLesson(id: number, payload: UpdateArabicLessonPayload): Observable<ArabicLesson>;
  abstract deleteArabicLesson(id: number): Observable<void>;

  abstract getArabicUserProgress(): Observable<ArabicUserProgress[]>;
  abstract getArabicCourseProgress(courseId: number): Observable<ArabicUserProgress[]>;
  abstract recordArabicProgress(payload: RecordArabicProgressPayload): Observable<ArabicUserProgress>;

  abstract getArabicDashboardStats(): Observable<Record<string, unknown>>;

  // Math Module
  abstract getMathTopics(): Observable<MathTopic[]>;
  abstract getMathTopicById(id: number): Observable<MathTopic>;
  abstract createMathTopic(payload: CreateMathTopicPayload): Observable<MathTopic>;
  abstract updateMathTopic(id: number, payload: UpdateMathTopicPayload): Observable<MathTopic>;
  abstract deleteMathTopic(id: number): Observable<void>;
  abstract searchMathTopics(query: string, maxResults?: number): Observable<MathTopic[]>;

  abstract getMathLessons(topicId?: number): Observable<MathLesson[]>;
  abstract getMathLessonById(id: number): Observable<MathLesson>;
  abstract createMathLesson(payload: CreateMathLessonPayload): Observable<MathLesson>;
  abstract updateMathLesson(id: number, payload: UpdateMathLessonPayload): Observable<MathLesson>;
  abstract deleteMathLesson(id: number): Observable<void>;
  abstract searchMathLessons(query: string, maxResults?: number): Observable<MathLesson[]>;

  abstract getMathQuestions(lessonId?: number): Observable<MathQuestion[]>;
  abstract getMathQuestionById(id: number): Observable<MathQuestion>;
  abstract createMathQuestion(payload: CreateMathQuestionPayload): Observable<MathQuestion>;
  abstract updateMathQuestion(id: number, payload: UpdateMathQuestionPayload): Observable<MathQuestion>;
  abstract deleteMathQuestion(id: number): Observable<void>;

  abstract getMathStudentProgress(studentId: number): Observable<MathProgress[]>;
  abstract getMathStudentLessonProgress(studentId: number, lessonId: number): Observable<MathProgress>;
  abstract recordMathProgress(payload: RecordMathProgressPayload): Observable<MathProgress>;
  abstract updateMathProgress(id: number, payload: UpdateMathProgressPayload): Observable<MathProgress>;

  abstract getMathDashboardStats(): Observable<Record<string, unknown>>;

  abstract getMathScholars(): Observable<MathScholar[]>;
  abstract getMathScholarById(id: number): Observable<MathScholar>;
  abstract createMathScholar(payload: CreateMathScholarPayload): Observable<MathScholar>;
  abstract updateMathScholar(id: number, payload: UpdateMathScholarPayload): Observable<MathScholar>;
  abstract deleteMathScholar(id: number): Observable<void>;
  abstract searchMathScholars(query: string, maxResults?: number): Observable<MathScholar[]>;

  abstract getMathContributions(scholarId?: number, topicId?: number): Observable<MathContribution[]>;
  abstract getMathContributionById(id: number): Observable<MathContribution>;
  abstract createMathContribution(payload: CreateMathContributionPayload): Observable<MathContribution>;
  abstract updateMathContribution(id: number, payload: UpdateMathContributionPayload): Observable<MathContribution>;
  abstract deleteMathContribution(id: number): Observable<void>;

  // Experimental Sciences (علوم تجربی)
  abstract getExperimentalSciencesPhases(): Observable<PhaseDto[]>;
  abstract getExperimentalSciencesPhase(id: number): Observable<PhaseDto>;
  abstract createExperimentalSciencesPhase(request: CreatePhaseRequest): Observable<PhaseDto>;
  abstract updateExperimentalSciencesPhase(id: number, request: UpdatePhaseRequest): Observable<void>;
  abstract deleteExperimentalSciencesPhase(id: number): Observable<void>;

  abstract getExperimentalSciencesTopics(): Observable<TopicDto[]>;
  abstract getExperimentalSciencesTopicsByPhase(phaseId: number): Observable<TopicDto[]>;
  abstract getExperimentalSciencesTopic(id: number): Observable<TopicDto>;
  abstract createExperimentalSciencesTopic(request: CreateTopicRequest): Observable<TopicDto>;
  abstract updateExperimentalSciencesTopic(id: number, request: UpdateTopicRequest): Observable<void>;
  abstract deleteExperimentalSciencesTopic(id: number): Observable<void>;

  abstract getExperimentalSciencesLessonsByTopic(topicId: number): Observable<LessonDto[]>;
  abstract getExperimentalSciencesLesson(id: number): Observable<LessonDto>;
  abstract createExperimentalSciencesLesson(request: CreateLessonRequest): Observable<LessonDto>;
  abstract updateExperimentalSciencesLesson(id: number, request: UpdateLessonRequest): Observable<void>;
  abstract deleteExperimentalSciencesLesson(id: number): Observable<void>;

  abstract getExperimentalSciencesExperimentsByLesson(lessonId: number): Observable<ExperimentDto[]>;
  abstract getExperimentalSciencesExperiment(id: number): Observable<ExperimentDto>;
  abstract createExperimentalSciencesExperiment(request: CreateExperimentRequest): Observable<ExperimentDto>;
  abstract updateExperimentalSciencesExperiment(id: number, request: UpdateExperimentRequest): Observable<void>;
  abstract deleteExperimentalSciencesExperiment(id: number): Observable<void>;

  abstract getExperimentalSciencesQuizByLesson(lessonId: number): Observable<ExpSciQuizDto>;
  abstract getExperimentalSciencesQuiz(id: number): Observable<ExpSciQuizDto>;
  abstract createExperimentalSciencesQuiz(request: CreateExpSciQuizRequest): Observable<ExpSciQuizDto>;
  abstract updateExperimentalSciencesQuiz(id: number, request: UpdateExpSciQuizRequest): Observable<void>;
  abstract deleteExperimentalSciencesQuiz(id: number): Observable<void>;

  abstract getExperimentalSciencesQuizQuestions(quizId: number): Observable<ExpSciQuizQuestionDto[]>;
  abstract getExperimentalSciencesQuizQuestion(id: number): Observable<ExpSciQuizQuestionDto>;
  abstract createExperimentalSciencesQuizQuestion(request: CreateExpSciQuizQuestionRequest): Observable<ExpSciQuizQuestionDto>;
  abstract updateExperimentalSciencesQuizQuestion(id: number, request: UpdateExpSciQuizQuestionRequest): Observable<void>;
  abstract deleteExperimentalSciencesQuizQuestion(id: number): Observable<void>;

  abstract getExperimentalSciencesStudentProgress(studentId: number): Observable<StudentProgressDto[]>;
  abstract getExperimentalSciencesStudentProgressByTopic(studentId: number, topicId: number): Observable<StudentProgressDto>;
  abstract updateExperimentalSciencesStudentProgress(studentId: number, topicId: number, request: UpdateStudentProgressRequest): Observable<void>;

  abstract getExperimentalSciencesDashboardStats(): Observable<any>;

  // ===== Persian Literature Learning System =====
  abstract getLearningPaths(): Observable<LearningPath[]>;
  abstract getLearningPath(id: number): Observable<LearningPath>;
  abstract getLearningPathTree(id: number): Observable<LearningPathTreeDto>;
  abstract createLearningPath(payload: CreateLearningPathPayload): Observable<LearningPath>;
  abstract updateLearningPath(id: number, payload: UpdateLearningPathPayload): Observable<LearningPath>;
  abstract deleteLearningPath(id: number): Observable<void>;

  abstract getLearningLevels(pathId: number): Observable<LearningLevel[]>;
  abstract getLearningLevel(id: number): Observable<LearningLevel>;
  abstract createLearningLevel(payload: CreateLearningLevelPayload): Observable<LearningLevel>;
  abstract updateLearningLevel(id: number, payload: UpdateLearningLevelPayload): Observable<LearningLevel>;
  abstract deleteLearningLevel(id: number): Observable<void>;

  abstract getStudyModules(levelId: number): Observable<StudyModule[]>;
  abstract getStudyModule(id: number): Observable<StudyModule>;
  abstract createStudyModule(payload: CreateStudyModulePayload): Observable<StudyModule>;
  abstract updateStudyModule(id: number, payload: UpdateStudyModulePayload): Observable<StudyModule>;
  abstract deleteStudyModule(id: number): Observable<void>;

  abstract getStudyLessons(moduleId: number): Observable<StudyLesson[]>;
  abstract getStudyLesson(id: number): Observable<StudyLesson>;
  abstract getLessonById(id: number): Observable<StudyLesson>;
  abstract createStudyLesson(payload: CreateStudyLessonPayload): Observable<StudyLesson>;
  abstract updateStudyLesson(id: number, payload: UpdateStudyLessonPayload): Observable<StudyLesson>;
  abstract deleteStudyLesson(id: number): Observable<void>;

  abstract getContentBlocks(lessonId: number): Observable<LessonContentBlock[]>;
  abstract createContentBlock(payload: CreateContentBlockPayload): Observable<LessonContentBlock>;
  abstract updateContentBlock(id: number, payload: UpdateContentBlockPayload): Observable<LessonContentBlock>;
  abstract deleteContentBlock(id: number): Observable<void>;

  abstract getQuizzes(lessonId: number): Observable<PersLitQuiz[]>;
  abstract getQuiz(id: number): Observable<PersLitQuiz>;
  abstract getQuizById(id: number): Observable<PersLitQuiz>;
  abstract createQuiz(payload: CreatePersLitQuizPayload): Observable<PersLitQuiz>;
  abstract updateQuiz(id: number, payload: UpdatePersLitQuizPayload): Observable<PersLitQuiz>;
  abstract deleteQuiz(id: number): Observable<void>;

  abstract getQuizQuestions(quizId: number): Observable<PersLitQuizQuestion[]>;
  abstract createQuizQuestion(payload: CreatePersLitQuizQuestionPayload): Observable<PersLitQuizQuestion>;
  abstract updateQuizQuestion(id: number, payload: UpdatePersLitQuizQuestionPayload): Observable<PersLitQuizQuestion>;
  abstract deleteQuizQuestion(id: number): Observable<void>;

  abstract enrollUser(payload: EnrollUserRequest): Observable<UserEnrollment>;
  abstract getUserEnrollments(userId?: number): Observable<UserEnrollment[]>;
  abstract getUserDashboard(userId: number, pathId: number): Observable<UserDashboardDto>;
  abstract getLearningDashboardStats(): Observable<LearningDashboardStatsDto>;

  abstract updateLessonProgress(payload: { lessonId: number; status: string; score?: number }): Observable<UserLessonProgress>;

  abstract submitQuiz(payload: SubmitQuizRequest): Observable<QuizResultDto>;
  abstract getUserQuizAttempts(enrollmentId: number): Observable<UserQuizAttempt[]>;
}
