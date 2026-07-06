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
  userType: UserType;
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
  generatedByUserId: number;
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
