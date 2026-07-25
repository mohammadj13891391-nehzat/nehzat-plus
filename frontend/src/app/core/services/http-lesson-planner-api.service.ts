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
  UpdateLeagueRankingPayload
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
