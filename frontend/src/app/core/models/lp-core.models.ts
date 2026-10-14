import { ProgressSummary } from './lp-skill.models';
import { StudyPathStep, StudyPathSummaryDto } from './lp-studypath.models';
import { Teacher } from './lp-teacher.models';

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

export interface RingTeachingMethod {
  id: number;
  ringId: number;
  teachingMethodId: number;
  teachingMethod?: TeachingMethod;
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
  phase?: string;
  ageCluster?: string;
  ringNumber?: number;
  maktabNameEn?: string;
  age?: number;
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
  branchId?: number;
  gender: 'male' | 'female' | 'mixed';
}

export interface UpdateBranchManagerPayload {
  nationalCode?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  branchId?: number;
  gender?: 'male' | 'female' | 'mixed';
  status?: 'active' | 'inactive';
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
  courseName?: string;
  latestGrade?: number;
  attendanceRate?: number;

  age: number;
  phase: string;
  activePathId?: number;
  activePathTitle?: string;
  completedLevels: number;
  totalLevels: number;
  completedLessons: number;
  totalLessons: number;
  lastActivityDate?: string;
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

export interface AssignmentProgressItem {
  assignmentId: number;
  assignmentTitle: string;
  assignmentDate: string;
  isSubmitted: boolean;
  dailyScore?: number;
  cumulativeScore?: number;
  status: string;
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

export interface AttachmentDto {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface StudentStudyPath {
  id: number;
  studentId: number;
  studyPathId: number;
  studyPathTitle?: string;
  enrollmentDate: string;
  currentStepId?: number;
  currentStep?: StudyPathStep;
  status: string;
  progressPercentage: number;
  startedAt?: string;
  completedAt?: string;
  steps?: StudyPathStep[];
  completedStepsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentOverallProgressDto {
  studentId: number;
  studentName: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgressPercentage: number;
  enrollments: StudyPathSummaryDto[];
}

export interface CoachStudentProgressDto {
  studentId: number;
  studentName: string;
  branchId: number;
  branchName: string;
  enrollments: StudyPathSummaryDto[];
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgressPercentage: number;
}

export interface CoachBranchProgressDto {
  branchId: number;
  branchName: string;
  totalStudents: number;
  studentsWithEnrollments: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgressPercentage: number;
  students: CoachStudentProgressDto[];
}



