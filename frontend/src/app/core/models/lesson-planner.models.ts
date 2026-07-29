export type UserType =
  | 'trainee'
  | 'coach'
  | 'parent'
  | 'branch_manager'
  | 'evaluator'
  | 'headquarters'
  | 'manager';
export type CourseStatus = 'active' | 'inactive' | 'archived' | string;
export type AssignmentStatus = 'draft' | 'published' | 'closed' | string;
export type AssignmentType = 'daily' | 'homework' | 'project' | 'exam' | string;
export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'late';
export type AttachmentKind = 'audio' | 'image' | 'document' | 'text' | 'other';

export interface ApiMessageResponse {
  message: string;
}

export interface StudentInfo {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: string;
}

export interface AuthSigninPayload {
  username: string;
  password: string;
}

export interface AuthSigninResponse extends ApiMessageResponse {
  token: string;
  username: string;
  imageUrl?: string;
  userType: UserType;
  studentId?: number;
  studentInfo?: StudentInfo;
  branchId?: number;
}

export interface AuthSignupPayload {
  firstName: string;
  lastName: string;
  name?: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
  userImage?: File | null;
}

export interface AuthSignupResponse extends ApiMessageResponse {
  status: 'pending';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  courseCode: string;
  credits?: number;
  instructor: string;
  status: CourseStatus;
  startDate: string;
  endDate: string;
  maxStudents?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCoursePayload {
  title: string;
  description?: string;
  courseCode: string;
  credits?: number;
  instructor?: string;
  status?: CourseStatus;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
}

export type UpdateCoursePayload = Partial<CreateCoursePayload>;

export type MadrasahGender = 'boys' | 'girls';
export type MadrasahGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type MadrasahStatus = 'active' | 'inactive';

export interface Madrasah {
  id: number;
  name: string;
  key: string;
  label: string;
  level: string;
  gender: MadrasahGender;
  grade: MadrasahGrade;
  capacity?: number;
  managerId?: number;
  status: MadrasahStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMadrasahPayload {
  name: string;
  key: string;
  label: string;
  level: string;
  gender: MadrasahGender;
  grade: MadrasahGrade;
  capacity?: number;
  managerId?: number;
  status?: MadrasahStatus;
}

export type UpdateMadrasahPayload = Partial<CreateMadrasahPayload>;

export interface MaktabBranch {
  id: number;
  madrasahId: number;
  province: string;
  name: string;
  address: string;
  capacity: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaktabBranchPayload {
  province: string;
  name: string;
  address?: string;
  capacity?: number;
  status?: 'active' | 'inactive';
}

export type UpdateMaktabBranchPayload = Partial<CreateMaktabBranchPayload>;

export interface SubjectArea {
  id: number;
  key: string;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt?: string;
}

export interface CreateSubjectAreaPayload {
  key: string;
  name: string;
  description?: string;
  sortOrder?: number;
}

export type UpdateSubjectAreaPayload = Partial<CreateSubjectAreaPayload>;

export interface TeachingMethod {
  id: number;
  key: string;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt?: string;
}

export interface CreateTeachingMethodPayload {
  key: string;
  name: string;
  description?: string;
  sortOrder?: number;
}

export type UpdateTeachingMethodPayload = Partial<CreateTeachingMethodPayload>;

export interface Ring {
  id: number;
  key: string;
  name: string;
  description?: string;
  madrasahId: number;
  madrasah?: Madrasah;
  coachId?: number;
  courseId?: number;
  status: 'active' | 'inactive';
  gender?: string;
  createdAt?: string;
  ringStudents?: RingStudent[];
  ringBooks?: RingBook[];
  ringTeachingMethods?: RingTeachingMethod[];
}

export interface CreateRingPayload {
  key: string;
  name: string;
  description?: string;
  madrasahId: number;
  coachId?: number;
  courseId?: number;
  status?: 'active' | 'inactive';
  gender?: string;
}

export type UpdateRingPayload = Partial<CreateRingPayload>;

export interface RingStudent {
  id: number;
  ringId: number;
  studentId: number;
  joinedAt?: string;
  status: 'active' | 'inactive';
}

export interface CreateRingStudentPayload {
  ringId: number;
  studentId: number;
  status?: 'active' | 'inactive';
}

export interface CurriculumObjective {
  id: number;
  key: string;
  title: string;
  description?: string;
  subjectAreaId: number;
  subjectArea?: SubjectArea;
  parentObjectiveId?: number;
  parentObjective?: CurriculumObjective;
  childObjectives?: CurriculumObjective[];
  sortOrder: number;
  level: string;
  createdAt?: string;
}

export interface CreateCurriculumObjectivePayload {
  key: string;
  title: string;
  description?: string;
  subjectAreaId: number;
  parentObjectiveId?: number;
  sortOrder?: number;
  level?: string;
}

export type UpdateCurriculumObjectivePayload = Partial<CreateCurriculumObjectivePayload>;

export interface Book {
  id: number;
  key: string;
  title: string;
  author?: string;
  subjectAreaId: number;
  subjectArea?: SubjectArea;
  level?: string;
  publisher?: string;
  pages?: number;
  createdAt?: string;
}

export interface CreateBookPayload {
  key: string;
  title: string;
  author?: string;
  subjectAreaId: number;
  level?: string;
  publisher?: string;
  pages?: number;
}

export type UpdateBookPayload = Partial<CreateBookPayload>;

export interface AgeGroup {
  id: number;
  key: string;
  name: string;
  description?: string;
  minAge: number;
  maxAge: number;
  sortOrder: number;
}

export interface StudentSkillProgress {
  id: number;
  studentId: number;
  objectiveId: number;
  objectiveTitle: string;
  ringId?: number;
  proficiencyLevel: string;
  score: number;
  lastAssessedAt?: string;
}

export interface UpdateSkillProgressPayload {
  proficiencyLevel?: string;
  score?: number;
  lastAssessedAt?: string;
}

export interface ProgressSummary {
  totalObjectives: number;
  masteredCount: number;
  achievedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  averageScore: number;
}

export interface SubjectAreaProgress {
  subjectAreaId: number;
  subjectAreaTitle: string;
  subjectAreaKey: string;
  averageScore: number;
  masteredCount: number;
  totalObjectives: number;
}

export interface StudentProgressSummary {
  studentId: number;
  summary: ProgressSummary;
  subjectAreas: SubjectAreaProgress[];
}

export interface RingDashboardDto {
  ringId: number;
  ringName: string;
  studentCount: number;
  averageScore: number;
  masteredCount: number;
  achievedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  students: RingStudentProgressDto[];
}

export interface RingStudentProgressDto {
  studentId: number;
  studentName: string;
  score: number;
  proficiencyLevel: string;
  lastAssessedAt?: string;
}

export interface RingBook {
  id: number;
  ringId: number;
  bookId: number;
  book?: Book;
  sortOrder: number;
}

export interface CreateRingBookPayload {
  ringId: number;
  bookId: number;
  sortOrder?: number;
}

export interface RingTeachingMethod {
  id: number;
  ringId: number;
  teachingMethodId: number;
  teachingMethod?: TeachingMethod;
}

export interface CreateRingTeachingMethodPayload {
  ringId: number;
  teachingMethodId: number;
}

export interface AssignmentAttachment {
  id: number;
  assignmentId: number;
  title: string;
  description?: string;
  kind: AttachmentKind;
  url: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateAttachmentPayload {
  title?: string;
  description?: string;
  kind?: AttachmentKind;
  displayOrder?: number;
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  type?: AssignmentType;
  maxScore?: number;
  assignmentDate: string;
  status?: AssignmentStatus;
  instructions?: string;
  attachments?: AssignmentAttachment[];
  requiredListenCount?: number;
  currentListenCount?: number;
  isRecordingUnlocked?: boolean;
  instructionAudioVersion?: string;
  primaryInstructionAudioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssignmentPayload {
  title: string;
  description?: string;
  type?: AssignmentType;
  maxScore?: number;
  assignmentDate: string;
  status?: AssignmentStatus;
  instructions?: string;
}

export type UpdateAssignmentPayload = Partial<CreateAssignmentPayload>;

export interface CreateDailySeriesPayload {
  startDate: string;
  days: number;
  titlePrefix?: string;
  descriptionPrefix?: string;
  type?: AssignmentType;
  maxScore?: number;
  instructions?: string;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  submissionDate: string;
  status: SubmissionStatus;
  dailyScore?: number;
  cumulativeScore?: number;
  notes?: string;
  feedback?: string;
  audioFileUrl?: string;
  documentUrl?: string;
  isCompleted?: boolean;
  timeSpent?: number;
}

export interface AssignmentProgressResponse {
  assignmentId: number;
  hasSubmission: boolean;
  latestSubmission: AssignmentSubmission | null;
  requiredListenCount: number;
  currentListenCount: number;
  isRecordingUnlocked: boolean;
  instructionAudioVersion?: string;
  hasPlayableInstructionAudio?: boolean;
  primaryInstructionAudioUrl?: string;
}

export type StudentAssignmentGateState = AssignmentProgressResponse;

export interface RegisterListenCompletionPayload {
  instructionAudioVersion?: string;
}

export interface PendingUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: 'pending';
  createdAt?: string;
}

export interface ApproveUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentId: string;
  courseIds: number[];
}

export interface CreateUserPayload {
  username: string;
  password: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface CreatedUser {
  id: number;
  username: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Student extends StudentInfo {
  username: string;
  branchId?: number;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface CreateStudentPayload {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentId?: string;
  nationalCode?: string;
  branchId?: number;
  gender?: string;
}

export interface UpdateStudentPayload {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  studentId?: string;
  nationalCode?: string;
  branchId?: number;
  status?: string;
  gender?: string;
}

export interface StudentCourseProgress {
  course: Course;
  assignments: Assignment[];
}

export interface StudentProgressResponse {
  student: StudentInfo;
  courses: StudentCourseProgress[];
  submissions: AssignmentSubmission[];
}

export interface AdminSystemStatistics {
  totalCourses: number;
  totalAssignments: number;
  totalAttachments: number;
  activeCourses: number;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  totalCourses: number;
  totalAssignments: number;
  totalAttachments: number;
  activeCourses: number;
}

export interface AdminCourseStatistics {
  course: Course;
  totalAssignments: number;
  totalAttachments: number;
}

export interface CurrentUser {
  username: string;
  roles: string[];
  userType: string;
  studentId?: number;
  studentInfo?: StudentInfo;
  imageUrl?: string;
  branchId?: number;
}

export type CurrentUserSession = CurrentUser;

export interface Coach {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  nationalCode?: string;
  branchId?: number;
  assignedCourseIds: number[];
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface CourseEnrollment {
  studentId: number;
  studentName: string;
  studentCode: string;
  enrollmentDate: string;
}

export interface CourseInviteCode {
  code: string;
  expiresAt: string;
  courseId: number;
}

export interface Branch {
  id: number;
  name: string;
  province: string;
  description?: string;
  createdAt?: string;
}

export interface BranchManager {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  branchId: number;
  branchName?: string;
  gender: 'male' | 'female' | 'mixed';
  nationalCode?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface CreateBranchPayload {
  name: string;
  province: string;
  description?: string;
}

export interface UpdateBranchPayload {
  name?: string;
  province?: string;
  description?: string;
}

export interface CreateBranchManagerPayload {
  nationalCode?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  branchId: number;
  gender: 'male' | 'female' | 'mixed';
}

export interface CreateCoachPayload {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  nationalCode?: string;
  branchId?: number;
  assignedCourseIds: number[];
}

export interface Parent {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  nationalCode: string;
  branchId?: number;
  studentIds: number[];
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface CreateParentPayload {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  nationalCode?: string;
  branchId?: number;
  studentIds?: number[];
}

export interface ParentStudentInfo {
  studentId: number;
  studentName: string;
  studentCode: string;
  courseName: string;
  latestGrade?: number;
  attendanceRate?: number;
}

export interface Evaluator {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  expertise: string;
  branchId?: number;
  assignedMadrasahIds: number[];
  nationalCode?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface CreateEvaluatorPayload {
  nationalCode?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  expertise?: string;
  branchId?: number;
  assignedMadrasahIds?: number[];
}

export interface EvaluationRecord {
  id: number;
  evaluatorId: number;
  evaluatorName: string;
  targetName: string;
  targetType: 'coach' | 'student' | 'branch';
  targetId: number;
  score: number;
  feedback: string;
  evaluationDate: string;
  createdAt?: string;
}

export interface CreateEvaluationPayload {
  evaluatorId: number;
  targetName: string;
  targetType: 'coach' | 'student' | 'branch';
  targetId: number;
  score: number;
  feedback: string;
  evaluationDate: string;
}

export interface HeadquartersSummary {
  totalStudents: number;
  totalCoaches: number;
  totalBranchManagers: number;
  totalEvaluators: number;
  totalParents: number;
  totalCourses: number;
  activeCourses: number;
  totalAssignments: number;
  totalSubmissions: number;
  totalMadrasahs: number;
  totalBranches: number;
  averageScore: number;
  averageAttendanceRate: number;
  lastUpdated: string;
}

export interface BranchPerformance {
  branchId: number;
  branchName: string;
  province: string;
  madrasahName: string;
  studentCount: number;
  averageScore: number;
  attendanceRate: number;
  activeCourses: number;
  evaluationCount: number;
  averageEvaluationScore: number;
  status: 'active' | 'inactive';
}

export interface CoachPerformance {
  coachId: number;
  coachName: string;
  specialization: string;
  assignedCourseCount: number;
  studentCount: number;
  averageStudentScore: number;
  evaluationCount: number;
  averageEvaluationScore: number;
  status: 'active' | 'inactive';
}

// Compatibility aliases used by partially-scaffolded services.
export type SignInRequest = AuthSigninPayload;
export type SignInResponse = AuthSigninResponse;
export type SignUpRequest = AuthSignupPayload;
export type SignUpResponse = AuthSignupResponse;
export type CoursePayload = CreateCoursePayload;
export type AssignmentPayload = CreateAssignmentPayload;
export type DailySeriesPayload = CreateDailySeriesPayload;
export type AttachmentPayload = UpdateAttachmentPayload;
export type SystemStatistics = AdminSystemStatistics;
export type CourseStatistics = AdminCourseStatistics;

// Assessment types
export type AssessmentType = 'weekly' | 'monthly' | 'midterm' | 'final' | 'quiz' | string;
export type AssessmentStatus = 'draft' | 'published' | 'completed' | 'archived' | string;
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank' | string;
export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | string;

export interface Assessment {
  id: number;
  title: string;
  description: string;
  type: AssessmentType;
  maxScore: number;
  durationMinutes: number;
  assessmentDate: string;
  status: AssessmentStatus;
  instructions?: string;
  courseId: number;
  course?: Course;
  generatedByUserId?: number;
  generationCriteria?: string;
  questions?: AssessmentQuestion[];
  results?: AssessmentResult[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentQuestion {
  id: number;
  type: QuestionType;
  questionText: string;
  optionsJson?: string;
  correctAnswerJson?: string;
  points: number;
  order: number;
  difficulty: QuestionDifficulty;
  topic?: string;
  explanation?: string;
  assessmentId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentResult {
  id: number;
  completedAt: string;
  score: number;
  maxPossibleScore: number;
  percentage: number;
  status: string;
  answersJson?: string;
  feedback?: string;
  timeSpentMinutes: number;
  assessmentId: number;
  assessment?: Assessment;
  studentId: number;
  student?: StudentInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerateWeeklyAssessmentPayload {
  courseId: number;
  generatedByUserId?: number;
  title: string;
  description: string;
  durationMinutes: number;
  maxScore: number;
  assessmentDate: string;
  criteria?: Record<string, unknown>;
}

export interface SubmitAssessmentResultPayload {
  studentId: number;
  completedAt: string;
  score: number;
  maxPossibleScore: number;
  percentage: number;
  status: string;
  answersJson?: string;
  feedback?: string;
  timeSpentMinutes: number;
}

export interface AssessmentQuestionPayload {
  type: QuestionType;
  questionText: string;
  optionsJson?: string;
  correctAnswerJson?: string;
  points: number;
  order: number;
  difficulty: QuestionDifficulty;
  topic?: string;
  explanation?: string;
}

export interface AssessmentAnalytics {
  assessment: { id: number; title: string; type: string; maxScore: number; assessmentDate: string; status: string };
  totalStudents: number;
  completedCount: number;
  completionRate: number;
  averageScore: number;
  passRate: number;
  questionStats: Array<{
    questionId: number;
    questionText: string;
    topic?: string;
    difficulty: string;
    points: number;
    correctRate: number;
  }>;
}

export interface StudentAssessmentHistory {
  student: { id: number; name: string; studentId: string };
  history: Array<{
    assessment: { id: number; title: string; type: string; assessmentDate: string; maxScore: number; status: string };
    result: { id: number; score: number; percentage: number; status: string; completedAt: string } | null;
  }>;
  trend: Array<{ date: string; score: number }>;
  statistics: {
    totalAssessments: number;
    completedAssessments: number;
    averageScore: number;
    bestScore: number;
  };
}

// Spiritual Practice & Path domain

export type SpiritualStepKind = 'pledge' | 'monitoring' | 'accounting' | 'reprimand' | 'discipline';

export interface SpiritualPracticeItem {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  stepKind: SpiritualStepKind;
  minAge?: number;
  maxAge?: number;
  genderMask: string;
  roleMask: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpiritualOccasion {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  hijriMonth?: number;
  hijriDay?: number;
  genderMask: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpiritualOccasionDetail extends SpiritualOccasion {
  practices: SpiritualPracticeItem[];
}

export interface DailySpiritualEntry {
  id: number;
  userId: number;
  entryDate: string;
  moodScore?: number;
  notes?: string;
  completedSteps?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertDailySpiritualEntryPayload {
  userId: number;
  entryDate: string;
  moodScore?: number;
  notes?: string;
  completedSteps?: string;
}

export interface UserOccasionProgress {
  id: number;
  userId: number;
  occasionId: number;
  practiceItemId: number;
  hijriYear: number;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarkOccasionPracticePayload {
  userId: number;
  occasionId: number;
  practiceItemId: number;
  hijriYear: number;
  isCompleted: boolean;
  notes?: string;
}

export interface SpiritualPath {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  genderMask: string;
  sortOrder: number;
  ageEntryPoint: number;
  ageFinalizePoint: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPathSelection {
  id: number;
  studentId: number;
  hijriSelectionYear: number;
  stage: string;
  finalizedPathId?: number;
  finalizedPathTitle?: string;
  selectedAt: string;
  finalizedAt?: string;
  updatedAt: string;
}

export interface PathRankingPayload {
  selectionId: number;
  pathId: number;
  rankOrdinal: number;
}

export interface FinalizePathPayload {
  studentId: number;
  pathId: number;
  reason?: string;
}

export interface StudentPathHistory {
  id: number;
  studentId: number;
  studentName?: string;
  changedByUserId: number;
  changedByUserName?: string;
  previousStage?: string;
  newStage?: string;
  previousFinalizedPathId?: number;
  newFinalizedPathId?: number;
  reason?: string;
  changedAt: string;
}

export interface MonthlyBooklet {
  id: number;
  studentId: number;
  studentName?: string;
  month: number;
  year: number;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  createdByUserId?: number;
  createdByUserName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMonthlyBookletPayload {
  studentId: number;
  month: number;
  year: number;
  title: string;
  content: string;
  createdByUserId: number;
}

export interface UpdateMonthlyBookletPayload {
  title?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface CurriculumVersion {
  id: number;
  key: string;
  versionNumber: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  validFrom: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurriculumVersionPayload {
  key: string;
  versionNumber: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  validFrom: string;
  validTo?: string;
}

export interface UpdateCurriculumVersionPayload {
  versionNumber?: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  validFrom?: string;
  validTo?: string;
}

export interface BiweeklyProgressResponse {
  studentId: number;
  studentName: string;
  periodStart: string;
  periodEnd: string;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  completionPercentage: number;
  averageScore: number;
  totalSubmissions: number;
  assignments: AssignmentProgressItem[];
}

export interface AssignmentProgressItem {
  assignmentId: number;
  assignmentTitle: string;
  assignmentDate: string;
  isSubmitted: boolean;
  dailyScore?: number;
  cumulativeScore?: number;
  status: string;
}

export interface ProgressionResult {
  studentId: number;
  studentName: string;
  currentLevel: string;
  currentRing: string;
  nextLevel?: string;
  nextRing?: string;
  canProgress: boolean;
  blockingReasons: string[];
  skillMasteryRates: Record<string, number>;
  checkedAt: string;
}

export interface AvailablePath {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  genderMask: string;
  sortOrder: number;
  ageEntryPoint: number;
  ageFinalizePoint: number;
  status: string;
}

export interface Teacher {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  branchId?: number;
  branchName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  teacherCourses?: TeacherCourse[];
  gradedSubmissions?: AssignmentGrading[];
}

export interface TeacherCourse {
  id: number;
  teacherId: number;
  courseId: number;
  course?: Course;
  createdAt: string;
}

export interface AssignmentGrading {
  id: number;
  submissionId: number;
  submission?: AssignmentSubmission;
  teacherId: number;
  teacher?: Teacher;
  dailyScore?: number;
  cumulativeScore?: number;
  status: string;
  feedback?: string;
  gradedAt: string;
}

export interface CreateTeacherRequest {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface UpdateTeacherRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  status?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface GradeSubmissionRequest {
  submissionId: number;
  teacherId: number;
  dailyScore?: number;
  cumulativeScore?: number;
  status?: string;
  feedback?: string;
}

export interface CreateTeacherPayload {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface UpdateTeacherPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  status?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface GradeSubmissionPayload {
  submissionId: number;
  teacherId: number;
  dailyScore?: number;
  cumulativeScore?: number;
  status?: string;
  feedback?: string;
}

export interface TeacherDashboardSummary {
  totalCourses: number;
  totalStudents: number;
  pendingGradings: number;
  completedGradings: number;
  averageScore: number;
}

export type CompetitionType = 'assignment_based' | 'assessment_based' | 'mixed';
export type CompetitionStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
export type LeagueStatus = 'active' | 'completed';
export type RankingTrend = 'up' | 'down' | 'stable';

export interface Competition {
  id: number;
  title: string;
  description?: string;
  type: CompetitionType;
  startDate: string;
  endDate: string;
  status: CompetitionStatus;
  courseId?: number;
  courseName?: string;
  participantCount: number;
  createdAt: string;
}

export interface CompetitionDetail extends Competition {
  participants: CompetitionParticipant[];
}

export interface CompetitionParticipant {
  id: number;
  studentId: number;
  studentName: string;
  score?: number;
  rank?: number;
  completedAt?: string;
}

export interface CreateCompetitionPayload {
  title: string;
  description?: string;
  type: CompetitionType;
  startDate: string;
  endDate: string;
  courseId?: number;
}

export interface UpdateCompetitionPayload {
  title?: string;
  description?: string;
  type?: CompetitionType;
  startDate?: string;
  endDate?: string;
  status?: CompetitionStatus;
  courseId?: number;
}

export interface RegisterParticipantPayload {
  studentId: number;
}

export interface UpdateParticipantScorePayload {
  score?: number;
  rank?: number;
  completedAt?: string;
}

export interface CompetitionResult {
  competitionId: number;
  competitionTitle: string;
  rankings: CompetitionParticipant[];
}

export interface League {
  id: number;
  name: string;
  description?: string;
  season: string;
  startDate: string;
  endDate: string;
  status: LeagueStatus;
  courseId?: number;
  courseName?: string;
  participantCount: number;
  createdAt: string;
}

export interface LeagueDetail extends League {
  rankings: LeagueRanking[];
}

export interface LeagueRanking {
  id: number;
  studentId: number;
  studentName: string;
  score: number;
  rank: number;
  previousRank?: number;
  trend: RankingTrend;
  lastUpdated: string;
}

export interface CreateLeaguePayload {
  name: string;
  description?: string;
  season: string;
  startDate: string;
  endDate: string;
  courseId?: number;
}

export interface UpdateLeaguePayload {
  name?: string;
  description?: string;
  season?: string;
  startDate?: string;
  endDate?: string;
  status?: LeagueStatus;
  courseId?: number;
}

export interface UpdateLeagueRankingPayload {
  studentId: number;
  score: number;
  previousRank?: number;
  trend?: RankingTrend;
}



export type SurveyStatus = 'draft' | 'active' | 'closed' | 'archived';
export type SurveyType = 'general' | 'follow_up' | 'targeted';
export type ActionPriority = 'critical' | 'high' | 'medium' | 'low';
export type ActionStatus = 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
export type IssueSeverity = 'critical' | 'problem' | 'solvable';

export interface IssueSurvey {
  id: number;
  title: string;
  description: string;
  surveyType: SurveyType;
  targetRole: string;
  status: SurveyStatus;
  startDate: string;
  endDate: string;
  isAnonymous: boolean;
  scoreScaleMin: number;
  scoreScaleMax: number;
  createdById: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  responseCount: number;
  questions?: IssueSurveyQuestion[];
  responses?: IssueSurveyResponse[];
  comments?: IssueSurveyComment[];
  actions?: IssueAction[];
}

export interface CreateIssueSurveyPayload {
  title: string;
  description: string;
  surveyType: SurveyType;
  targetRole: string;
  startDate: string;
  endDate: string;
  isAnonymous: boolean;
  scoreScaleMin: number;
  scoreScaleMax: number;
}

export interface UpdateIssueSurveyPayload {
  title?: string;
  description?: string;
  surveyType?: SurveyType;
  targetRole?: string;
  startDate?: string;
  endDate?: string;
  isAnonymous?: boolean;
  status?: SurveyStatus;
  scoreScaleMin?: number;
  scoreScaleMax?: number;
}

export interface IssueSurveyQuestion {
  id: number;
  surveyId: number;
  itemPoolId?: number;
  questionText: string;
  category: string;
  subCategory?: string;
  targetAudience?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateIssueQuestionPayload {
  surveyId: number;
  itemPoolId?: number;
  questionText: string;
  category: string;
  subCategory?: string;
  targetAudience?: string;
  sortOrder: number;
}

export interface IssueItemPool {
  id: number;
  questionText: string;
  category: string;
  subCategory?: string;
  targetAudience?: string;
  suggestedActions?: string;
  source: string;
  usageCount: number;
  avgScore?: number;
  trend: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateIssueItemPoolPayload {
  questionText: string;
  category: string;
  subCategory?: string;
  targetAudience?: string;
  suggestedActions?: string;
  source: string;
}

export interface IssueSurveyResponse {
  id: number;
  surveyId: number;
  questionId: number;
  questionText?: string;
  respondentId?: number;
  respondentRole?: string;
  respondentBranchId?: number;
  score: number;
  answeredAt: string;
}

export interface SubmitAnswerItem {
  questionId: number;
  score: number;
}

export interface SubmitSurveyResponsePayload {
  surveyId: number;
  answers: SubmitAnswerItem[];
  comment?: string;
}

export interface IssueSurveyComment {
  id: number;
  surveyId: number;
  respondentId?: number;
  respondentName?: string;
  comment: string;
  isPublic: boolean;
  createdAt: string;
}

export interface IssueAction {
  id: number;
  surveyId: number;
  questionId?: number;
  questionText?: string;
  category: string;
  title: string;
  description: string;
  priority: ActionPriority;
  status: ActionStatus;
  assignedToId?: number;
  assignedToName?: string;
  assignedTeam?: string;
  targetDate?: string;
  completedAt?: string;
  kpiDefinition?: string;
  createdAt: string;
  updatedAt: string;
  updateCount: number;
  updates?: IssueActionUpdate[];
}

export interface CreateIssueActionPayload {
  surveyId: number;
  questionId?: number;
  title: string;
  description: string;
  category: string;
  priority: ActionPriority;
  assignedToId?: number;
  assignedTeam?: string;
  targetDate?: string;
  kpiDefinition?: string;
}

export interface IssueActionUpdate {
  id: number;
  actionId: number;
  updatedById: number;
  updatedByName?: string;
  previousStatus: ActionStatus;
  newStatus: ActionStatus;
  note: string;
  progressPercent?: number;
  createdAt: string;
}

export interface SurveyAnalytics {
  surveyId: number;
  title: string;
  totalRespondents: number;
  totalQuestions: number;
  overallAverage: number;
  categoryBreakdown: CategoryAnalytics[];
  topCriticalIssues: QuestionAnalytics[];
  topStrengths: QuestionAnalytics[];
}

export interface CategoryAnalytics {
  category: string;
  averageScore: number;
  questionCount: number;
  severity: IssueSeverity;
}

export interface QuestionAnalytics {
  questionId: number;
  questionText: string;
  category: string;
  averageScore: number;
  standardDeviation: number;
  responseCount: number;
  severity: IssueSeverity;
}

export interface IssueDashboardSummary {
  activeSurveys: number;
  openActions: number;
  completedActions: number;
  criticalIssuePercentage: number;
  improvingTrendPercentage: number;
}

// ── Service Survey (سرویس‌یاب) ──

export type ServiceSurveyStatus = 'draft' | 'active' | 'closed' | 'archived';
export type ServiceSurveyTargetRole = 'parent' | 'branch_manager' | 'headquarters' | 'manager';
export type ServiceQuestionType = 'radio' | 'checkbox' | 'rating' | 'text' | 'select';
export type ServiceQuestionScale = 1 | 2 | 3 | 4 | 5;
export type ServiceResponseStatus = 'draft' | 'submitted' | 'reviewed' | 'archived';

export interface ServiceSurvey {
  id: number;
  title: string;
  description: string;
  targetRole: ServiceSurveyTargetRole;
  status: ServiceSurveyStatus;
  startDate: string;
  endDate: string;
  scoreScaleMin: number;
  scoreScaleMax: number;
  isAnonymous: boolean;
  createdById: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  responseCount: number;
  questions?: ServiceSurveyQuestion[];
  responses?: ServiceSurveyResponse[];
}

export interface CreateServiceSurveyPayload {
  title: string;
  description: string;
  targetRole: ServiceSurveyTargetRole;
  startDate: string;
  endDate: string;
  isAnonymous: boolean;
  scoreScaleMin: number;
  scoreScaleMax: number;
}

export interface UpdateServiceSurveyPayload {
  title?: string;
  description?: string;
  targetRole?: ServiceSurveyTargetRole;
  startDate?: string;
  endDate?: string;
  isAnonymous?: boolean;
  status?: ServiceSurveyStatus;
  scoreScaleMin?: number;
  scoreScaleMax?: number;
}

export interface ServiceSurveyQuestion {
  id: number;
  surveyId: number;
  questionText: string;
  questionType: ServiceQuestionType;
  category: string;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  sortOrder: number;
  isRequired: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateServiceQuestionPayload {
  surveyId: number;
  questionText: string;
  questionType: ServiceQuestionType;
  category: string;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  sortOrder?: number;
  isRequired?: boolean;
}

export interface ServiceSurveyResponse {
  id: number;
  surveyId: number;
  questionId: number;
  respondentId?: number;
  respondentRole?: string;
  respondentBranchId?: number;
  answerText?: string;
  answerScore?: number;
  answerOptions?: string[];
  respondedAt: string;
}

export interface SubmitServiceAnswerItem {
  questionId: number;
  answerText?: string;
  answerScore?: number;
  answerOptions?: string[];
}

export interface SubmitServiceSurveyPayload {
  surveyId: number;
  answers: SubmitServiceAnswerItem[];
  comment?: string;
}

export interface ServiceSurveyAnalytics {
  surveyId: number;
  title: string;
  totalRespondents: number;
  totalQuestions: number;
  overallAverage: number;
  responseCount: number;
  categoryBreakdown: ServiceCategoryAnalytics[];
  topQuestions: ServiceQuestionAnalytics[];
}

export interface ServiceCategoryAnalytics {
  category: string;
  averageScore: number;
  questionCount: number;
  responseCount: number;
}

export interface ServiceQuestionAnalytics {
  questionId: number;
  questionText: string;
  category: string;
  averageScore: number;
  responseCount: number;
  responseRate: number;
}

export interface ServiceDashboardSummary {
  activeSurveys: number;
  totalResponses: number;
  averageScore: number;
  completionRate: number;
  lastUpdated: string;
}

export interface Surah {
  id: number;
  number: string;
  name: string;
  translatedName: string;
  revelationPlace: string;
  revelationOrder: number;
  totalAyahs: number;
  type: string;
  bismillah: string;
  hizbBegin: number;
  hizbEnd: number;
  juzBegin: number;
  juzEnd: number;
  ruqyah: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  ayahs?: Ayah[];
}

export interface Ayah {
  id: number;
  surahId: number;
  verseNumber: number;
  text: string;
  translation: string;
  transliteration: string;
  footnote: string;
  ruku: string;
  sajda: string;
  ayaNumber: number;
  juz: string;
  hizbQuarter: string;
  createdAt: string;
  updatedAt: string;
}

export interface TajweedRule {
  id: number;
  ruleCode: string;
  name: string;
  description: string;
  exampleText: string;
  ruleLevel: number;
  affectedRecitationType: string;
  guidelines: string;
  surahId: number;
  ayahNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecitationLevel {
  id: number;
  levelNumber: number;
  name: string;
  description: string;
  criteria: string;
  colorCode: string;
  pointsRequired: number;
  estimatedWeeks: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuranCurriculum {
  id: number;
  title: string;
  description: string;
  language: string;
  startSurah: number;
  endSurah: number;
  totalAyahs: number;
  estimatedDays: number;
  difficultyLevel: string;
  learningObjectives: string;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuranStudentProgress {
  id: number;
  studentId: number;
  surahId: number;
  ayahNumber: number;
  surahProgress: number;
  totalSurahs: number;
  percentage: number;
  progressDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  surah?: Surah;
}

// ===== Persian Literature =====
export interface PersianLiteraturePoet {
  id: number;
  name: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  poems?: PersianLiteraturePoem[];
}

export interface PersianLiteraturePoem {
  id: number;
  poetId: number;
  poet?: PersianLiteraturePoet;
  title: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  analyses?: PersianLiteratureAnalysis[];
}

export interface PersianLiteratureAnalysis {
  id: number;
  poemId: number;
  poem?: PersianLiteraturePoem;
  title: string;
  content: string;
  analysisType: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
}

export interface CreatePersianLiteraturePoetPayload {
  name: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century?: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

export interface CreatePersianLiteraturePoemPayload {
  poetId: number;
  title: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount?: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder?: number;
}

export interface CreatePersianLiteratureAnalysisPayload {
  poemId: number;
  title: string;
  content: string;
  analysisType?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

// ===== Arabic Literature =====

export interface ArabicLiteraturePoet {
  id: number;
  name: string;
  nasab?: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  poems?: ArabicLiteraturePoem[];
}

export interface ArabicLiteraturePoem {
  id: number;
  poetId: number;
  poet?: ArabicLiteraturePoet;
  title: string;
  bahr?: string;
  qafiya?: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  analyses?: ArabicLiteratureAnalysis[];
}

export interface ArabicLiteratureAnalysis {
  id: number;
  poemId: number;
  poem?: ArabicLiteraturePoem;
  title: string;
  content: string;
  analysisType: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
}

export interface CreateArabicLiteraturePoetPayload {
  name: string;
  nasab?: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century?: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

export interface CreateArabicLiteraturePoemPayload {
  poetId: number;
  title: string;
  bahr?: string;
  qafiya?: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount?: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder?: number;
}

export interface CreateArabicLiteratureAnalysisPayload {
  poemId: number;
  title: string;
  content: string;
  analysisType?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

// ===== Arabic Literature Curriculum =====

export interface ArabicCourse {
  id: number;
  title: string;
  description?: string;
  level: string;
  ageRange?: string;
  sortOrder: number;
  icon?: string;
  color?: string;
  prerequisiteCourseIds?: string;
  createdAt: string;
  updatedAt: string;
  lessons?: ArabicLesson[];
}

export interface ArabicLesson {
  id: number;
  courseId: number;
  course?: ArabicCourse;
  title: string;
  description?: string;
  objectives?: string;
  poemId?: number;
  poem?: ArabicLiteraturePoem;
  content?: string;
  exerciseData?: string;
  quizData?: string;
  durationMinutes: number;
  sortOrder: number;
  prerequisiteLessonIds?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArabicUserProgress {
  id: number;
  userId: number;
  lessonId: number;
  lesson?: ArabicLesson;
  status: string;
  score: number;
  startedAt?: string;
  completedAt?: string;
}

export interface CreateArabicCoursePayload {
  title: string;
  description?: string;
  level?: string;
  ageRange?: string;
  sortOrder?: number;
  icon?: string;
  color?: string;
  prerequisiteCourseIds?: string;
}

export interface UpdateArabicCoursePayload {
  title?: string;
  description?: string;
  level?: string;
  ageRange?: string;
  sortOrder?: number;
  icon?: string;
  color?: string;
  prerequisiteCourseIds?: string;
}

export interface CreateArabicLessonPayload {
  courseId: number;
  title: string;
  description?: string;
  objectives?: string;
  poemId?: number;
  content?: string;
  exerciseData?: string;
  quizData?: string;
  durationMinutes?: number;
  sortOrder?: number;
  prerequisiteLessonIds?: string;
}

export interface UpdateArabicLessonPayload {
  title?: string;
  description?: string;
  objectives?: string;
  poemId?: number;
  content?: string;
  exerciseData?: string;
  quizData?: string;
  durationMinutes?: number;
  sortOrder?: number;
  prerequisiteLessonIds?: string;
}

export interface RecordArabicProgressPayload {
  lessonId: number;
  status?: string;
  score?: number;
}

// ===== Math Module =====

export interface MathTopic {
  id: number;
  title: string;
  description?: string;
  difficultyLevel: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  lessons?: MathLesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MathLesson {
  id: number;
  title: string;
  content: string;
  summary?: string;
  videoUrl?: string;
  mathTopicId: number;
  topic?: MathTopic;
  durationMinutes: number;
  displayOrder: number;
  isPublished: boolean;
  questions?: MathQuestion[];
  progressRecords?: MathProgress[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MathQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  mathLessonId: number;
  lesson?: MathLesson;
  difficultyLevel: string;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MathProgress {
  id: number;
  studentId: number;
  student?: { id: number; username: string; firstName?: string; lastName?: string };
  mathLessonId: number;
  lesson?: MathLesson;
  mathQuestionId?: number;
  question?: MathQuestion;
  isCompleted: boolean;
  score?: number;
  attemptCount: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MathScholar {
  id: number;
  name: string;
  nameArabic?: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  biography?: string;
  imageUrl?: string;
  knownFor?: string;
  contributions?: MathContribution[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MathContribution {
  id: number;
  mathScholarId: number;
  scholar?: MathScholar;
  mathTopicId?: number;
  topic?: MathTopic;
  title: string;
  description?: string;
  yearRange?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMathTopicPayload {
  title: string;
  description?: string;
  difficultyLevel: string;
  iconUrl?: string;
  displayOrder: number;
}

export interface UpdateMathTopicPayload {
  title?: string;
  description?: string;
  difficultyLevel?: string;
  iconUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateMathLessonPayload {
  title: string;
  content: string;
  summary?: string;
  videoUrl?: string;
  mathTopicId: number;
  durationMinutes: number;
  displayOrder: number;
}

export interface UpdateMathLessonPayload {
  title?: string;
  content?: string;
  summary?: string;
  videoUrl?: string;
  durationMinutes?: number;
  displayOrder?: number;
  isPublished?: boolean;
}

export interface CreateMathQuestionPayload {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  mathLessonId: number;
  difficultyLevel: string;
  points: number;
}

export interface UpdateMathQuestionPayload {
  questionText?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctOption?: string;
  explanation?: string;
  difficultyLevel?: string;
  points?: number;
}

export interface RecordMathProgressPayload {
  studentId: number;
  mathLessonId: number;
  mathQuestionId?: number;
  isCompleted: boolean;
  score?: number;
}

export interface UpdateMathProgressPayload {
  isCompleted?: boolean;
  score?: number;
}

export interface CreateMathScholarPayload {
  name: string;
  nameArabic?: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  biography?: string;
  imageUrl?: string;
  knownFor?: string;
}

export interface UpdateMathScholarPayload {
  name?: string;
  nameArabic?: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  biography?: string;
  imageUrl?: string;
  knownFor?: string;
}

export interface CreateMathContributionPayload {
  mathScholarId: number;
  mathTopicId?: number;
  title: string;
  description?: string;
  yearRange?: string;
}

export interface UpdateMathContributionPayload {
  mathScholarId?: number;
  mathTopicId?: number;
  title?: string;
  description?: string;
  yearRange?: string;
}

// ==================== Experimental Sciences (علوم تجربی) ====================

export interface PhaseDto {
  id: number;
  title: string;
  description?: string;
  order: number;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePhaseRequest {
  title: string;
  description?: string;
  order: number;
  icon?: string;
}

export interface UpdatePhaseRequest {
  title?: string;
  description?: string;
  order?: number;
  icon?: string;
}

export interface TopicDto {
  id: number;
  phaseId: number;
  title: string;
  description?: string;
  order: number;
  difficultyLevel: 'Child' | 'Teen' | 'YoungAdult' | 'Adult' | 'Senior';
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTopicRequest {
  phaseId: number;
  title: string;
  description?: string;
  order: number;
  difficultyLevel: 'Child' | 'Teen' | 'YoungAdult' | 'Adult' | 'Senior';
  icon?: string;
}

export interface UpdateTopicRequest {
  phaseId?: number;
  title?: string;
  description?: string;
  order?: number;
  difficultyLevel?: 'Child' | 'Teen' | 'YoungAdult' | 'Adult' | 'Senior';
  icon?: string;
}

export interface LessonDto {
  id: number;
  topicId: number;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  estimatedMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonRequest {
  topicId: number;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  estimatedMinutes: number;
}

export interface UpdateLessonRequest {
  topicId?: number;
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  estimatedMinutes?: number;
}

export interface ExperimentDto {
  id: number;
  lessonId: number;
  title: string;
  materials: string;
  steps: string;
  expectedResult: string;
  safetyNotes?: string;
  order: number;
  estimatedMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExperimentRequest {
  lessonId: number;
  title: string;
  materials: string;
  steps: string;
  expectedResult: string;
  safetyNotes?: string;
  order: number;
  estimatedMinutes: number;
}

export interface UpdateExperimentRequest {
  lessonId?: number;
  title?: string;
  materials?: string;
  steps?: string;
  expectedResult?: string;
  safetyNotes?: string;
  order?: number;
  estimatedMinutes?: number;
}

export interface ExpSciQuizDto {
  id: number;
  lessonId: number;
  title: string;
  passingScore: number;
  timeLimitMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpSciQuizRequest {
  lessonId: number;
  title: string;
  passingScore: number;
  timeLimitMinutes: number;
}

export interface UpdateExpSciQuizRequest {
  lessonId?: number;
  title?: string;
  passingScore?: number;
  timeLimitMinutes?: number;
}

export interface ExpSciQuizQuestionDto {
  id: number;
  quizId: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpSciQuizQuestionRequest {
  quizId: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
}

export interface UpdateExpSciQuizQuestionRequest {
  quizId?: number;
  questionText?: string;
  options?: string;
  correctAnswer?: string;
  explanation?: string;
  order?: number;
  points?: number;
}

export interface StudentProgressDto {
  id: number;
  studentId: number;
  topicId: number;
  status: 'NotStarted' | 'InProgress' | 'Completed';
  score: number;
  completedLessons: number;
  totalLessons: number;
  completedAt?: string;
}

export interface UpdateStudentProgressRequest {
  status?: 'NotStarted' | 'InProgress' | 'Completed';
  score?: number;
  completedLessons?: number;
  totalLessons?: number;
}

// ===== Persian Literature Learning System (مسیر یادگیری ادبیات فارسی) =====

export interface LearningPath {
  id: number;
  title: string;
  description?: string;
  slug: string;
  ageGroup: string;
  ageRange?: string;
  difficultyLevel?: string;
  estimatedDurationDays?: number;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  moduleCount?: number;
  lessonCount?: number;
  levelCount?: number;
  levels?: LearningLevel[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningLevel {
  id: number;
  learningPathId: number;
  learningPath?: LearningPath;
  title: string;
  description?: string;
  levelNumber: number;
  requiredXp: number;
  sortOrder: number;
  minAge?: number;
  maxAge?: number;
  estimatedDurationDays?: number;
  modules?: StudyModule[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyModule {
  id: number;
  learningLevelId: number;
  learningLevel?: LearningLevel;
  title: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  estimatedDays: number;
  lessons?: StudyLesson[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyLesson {
  id: number;
  studyModuleId: number;
  studyModule?: StudyModule;
  module?: StudyModule;
  title: string;
  description?: string;
  objectives?: string;
  difficultyLevel?: string;
  contentBlocks?: LessonContentBlock[];
  quizzes?: PersLitQuiz[];
  sortOrder: number;
  estimatedMinutes: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonContentBlock {
  id: number;
  studyLessonId: number;
  studyLesson?: StudyLesson;
  blockType: string;
  title: string;
  content: string;
  data?: string;
  explanation?: string;
  mediaUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersLitQuiz {
  id: number;
  studyLessonId: number;
  studyLesson?: StudyLesson;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes?: number;
  questions?: PersLitQuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface PersLitQuizQuestion {
  id: number;
  quizId: number;
  quiz?: PersLitQuiz;
  questionText: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizOption {
  id: number;
  quizQuestionId: number;
  quizQuestion?: PersLitQuizQuestion;
  optionText: string;
  label: string;
  text: string;
  isCorrect: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserEnrollment {
  id: number;
  userId: number;
  learningPathId: number;
  learningPath?: LearningPath;
  currentLevelId?: number;
  currentLevel?: LearningLevel;
  progress: number;
  xpEarned: number;
  isCompleted: boolean;
  completedAt?: string;
  lessonProgress?: UserLessonProgress[];
  createdAt: string;
  updatedAt: string;
}

export interface UserLessonProgress {
  id: number;
  userEnrollmentId: number;
  enrollment?: UserEnrollment;
  studyLessonId: number;
  studyLesson?: StudyLesson;
  status: string;
  score: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuizAttempt {
  id: number;
  userEnrollmentId: number;
  enrollment?: UserEnrollment;
  quizId: number;
  quiz?: PersLitQuiz;
  score: number;
  totalPoints: number;
  answers: string;
  isPassed: boolean;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Learning System Payloads
export interface CreateLearningPathPayload {
  title: string;
  description?: string;
  slug: string;
  ageGroup: string;
  icon?: string;
  color?: string;
  sortOrder: number;
}

export interface UpdateLearningPathPayload {
  title?: string;
  description?: string;
  slug?: string;
  ageGroup?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateLearningLevelPayload {
  learningPathId: number;
  title: string;
  description?: string;
  levelNumber: number;
  requiredXp: number;
  sortOrder: number;
}

export interface UpdateLearningLevelPayload {
  title?: string;
  description?: string;
  levelNumber?: number;
  requiredXp?: number;
  sortOrder?: number;
}

export interface CreateStudyModulePayload {
  learningLevelId: number;
  title: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  estimatedDays: number;
}

export interface UpdateStudyModulePayload {
  title?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  estimatedDays?: number;
}

export interface CreateStudyLessonPayload {
  studyModuleId: number;
  title: string;
  description?: string;
  objectives?: string;
  sortOrder: number;
  estimatedMinutes: number;
  isPremium?: boolean;
}

export interface UpdateStudyLessonPayload {
  title?: string;
  description?: string;
  objectives?: string;
  sortOrder?: number;
  estimatedMinutes?: number;
  isPremium?: boolean;
}

export interface CreateContentBlockPayload {
  studyLessonId: number;
  blockType: string;
  title: string;
  content: string;
  data?: string;
  sortOrder: number;
}

export interface UpdateContentBlockPayload {
  blockType?: string;
  title?: string;
  content?: string;
  data?: string;
  sortOrder?: number;
}

export interface CreatePersLitQuizPayload {
  studyLessonId: number;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
}

export interface UpdatePersLitQuizPayload {
  title?: string;
  description?: string;
  passingScore?: number;
  maxAttempts?: number;
}

export interface CreatePersLitQuizQuestionPayload {
  quizId: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
}

export interface UpdatePersLitQuizQuestionPayload {
  questionText?: string;
  options?: string;
  correctAnswer?: string;
  explanation?: string;
  order?: number;
  points?: number;
}

export interface EnrollUserRequest {
  learningPathId: number;
}

export interface QuizResultDto {
  attempt: UserQuizAttempt;
  passed: boolean;
  score: number;
  totalPoints: number;
  percentage: number;
  passedThreshold: number;
}

export interface SubmitQuizRequest {
  quizId: number;
  answers: { questionId: number; answer: string }[];
}

export interface LearningPathTreeDto {
  path: LearningPath;
  levels: (LearningLevel & {
    modules: (StudyModule & {
      lessons: (StudyLesson & {
        quizzes: PersLitQuiz[];
      })[];
    })[];
  })[];
}

export interface LearningDashboardStatsDto {
  totalPaths: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  badges: number;
}

export interface UserDashboardDto {
  enrollment: UserEnrollment;
  path: LearningPath;
  currentLevel?: LearningLevel;
  recentLessons: UserLessonProgress[];
  quizAttempts: UserQuizAttempt[];
  xpProgress: { current: number; nextLevel: number };
}

// ===== Hadith Module =====

export interface HadithBook {
  id: number;
  key: string;
  title: string;
  titleTranslation: string;
  author: string;
  description?: string;
  hadithCount: number;
  chapterCount: number;
  language: string;
  difficultyLevel?: string;
  sortOrder: number;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HadithChapter {
  id: number;
  bookId: number;
  book?: HadithBook;
  title: string;
  titleTranslation: string;
  description?: string;
  chapterNumber: number;
  hadithCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface HadithItem {
  id: number;
  chapterId: number;
  chapter?: HadithChapter;
  bookId: number;
  book?: HadithBook;
  hadithNumber: number;
  arabicText: string;
  persianTranslation: string;
  isnad?: string;
  explanation?: string;
  fiqhTakeaway?: string;
  grade?: string;
  gradeColor?: string;
  audioUrl?: string;
  sourceReference?: string;
  difficultyLevel?: string;
  keywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HadithReview {
  id: number;
  studentId: number;
  hadithId: number;
  hadith?: HadithItem;
  reviewCount: number;
  correctCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  masteryLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface HadithReviewStats {
  totalReviewed: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  streakDays: number;
  accuracyRate: number;
}

export interface HadithBookDetail extends HadithBook {
  chapters?: HadithChapter[];
  hadiths?: HadithItem[];
}

export interface HadithChapterDetail extends HadithChapter {
  hadiths?: HadithItem[];
}

export interface HadithReviewCard {
  id: number;
  hadithId: number;
  hadith?: HadithItem;
  reviewType: string;
  dueDate: string;
  streak: number;
  ease: number;
}

export interface UserHadithProgress {
  id: number;
  userId: number;
  hadithId: number;
  memorizationStatus: string;
  reviewCount: number;
  lastReviewedAt: string;
  ease: number;
  interval: number;
  nextReviewAt: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  hadith?: HadithItem;
}

export interface SubmitReviewPayload {
  hadithId: number;
  score: number;
  reviewType: string;
}

export interface HadithAssessment {
  id: number;
  chapterId: number;
  title: string;
  description: string;
  questionCount: number;
  score: number;
  passedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HadithDashboardStats {
  totalBooks: number;
  totalHadiths: number;
  totalMemorized: number;
  currentStreak: number;
  totalXp: number;
}

export interface SubmitHadithReviewPayload {
  hadithId: number;
  isCorrect: boolean;
}
