export type UserType = 'student' | 'admin';
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
  username: string;
  imageUrl?: string;
  userType: UserType;
  studentId?: number;
  studentInfo?: StudentInfo;
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
  gender: MadrasahGender;
  grade: MadrasahGrade;
  capacity?: number;
  managerId?: number;
  status?: MadrasahStatus;
}

export type UpdateMadrasahPayload = Partial<CreateMadrasahPayload>;

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

export interface Student extends StudentInfo {}

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
}

export type CurrentUserSession = CurrentUser;

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
