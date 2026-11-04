export interface AuthUserDto {
  id: number;
  name: string;
  phone: string;
  nationalId: string | null;
  role: string;
  branchId: number | null;
  maktabId: number | null;
  approvalStatus: string;
  totalPoints: number;
  recognitionsCount: number;
}

export interface LoginResponse {
  token: string;
  user: AuthUserDto;
}

export interface RegisterPayload {
  phone: string;
  name: string;
  nationalId?: string | null;
  password: string;
  requestedRole?: string | null;
  branchId?: number | null;
  maktabId?: number | null;
}

export interface Maktab {
  id: number;
  name: string;
  code: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string | null;
  phone: string | null;
  maktabId: number | null;
  maktab: Maktab | null;
  isBoys: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MorabbiUser {
  id: number;
  name: string;
  nationalId: string | null;
  phone: string;
  passwordHash: string | null;
  oidcSubject: string | null;
  role: string;
  requestedRole: string | null;
  branchId: number | null;
  branch: Branch | null;
  maktabId: number | null;
  maktab: Maktab | null;
  approvalStatus: string;
  approvedBy: string | null;
  approvedAt: string | null;
  active: boolean;
  totalPoints: number;
  recognitionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TargetStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'RETURNED';

export interface DailyReport {
  id: number;
  instructorId: number;
  instructor: MorabbiUser | null;
  branchId: number;
  branch: Branch | null;
  date: string;
  subject: string;
  summary: string | null;
  reportPattern: string | null;
  reportStyle: string | null;
  content: string;
  recommendations: string | null;
  audience: string | null;
  attendeesCount: number;
  quranRefs: string;
  hadithRefs: string;
  challenges: string | null;
  solutions: string | null;
  pedagogicalNotes: string | null;
  attachments: string;
  transcriptionSource: string;
  transcriptionConfidence: number | null;
  planType: string;
  approach: string | null;
  traineeCount: number;
  stagePresentation: string | null;
  stageThinking: string | null;
  stageDiscussion: string | null;
  stageReporting: string | null;
  groupEndurance: string | null;
  groupSemiSpeed: string | null;
  groupSpeed: string | null;
  evaluationSelf: string | null;
  evaluationResult: string | null;
  status: TargetStatus | null;
  evaluatorId: number | null;
  evaluator: MorabbiUser | null;
  evaluatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportPayload {
  branchId?: number | null;
  date?: string | null;
  subject: string;
  summary?: string | null;
  reportPattern?: string | null;
  reportStyle?: string | null;
  content?: string | null;
  recommendations?: string | null;
  audience?: string | null;
  attendeesCount?: number | null;
  quranRefs?: string | null;
  hadithRefs?: string | null;
  challenges?: string | null;
  solutions?: string | null;
  pedagogicalNotes?: string | null;
  transcriptionSource?: string | null;
  transcriptionConfidence?: number | null;
  planType?: string | null;
  approach?: string | null;
  traineeCount?: number | null;
  stagePresentation?: string | null;
  stageThinking?: string | null;
  stageDiscussion?: string | null;
  stageReporting?: string | null;
  groupEndurance?: string | null;
  groupSemiSpeed?: string | null;
  groupSpeed?: string | null;
  evaluationSelf?: string | null;
  status?: TargetStatus | null;
}

export type UpdateReportPayload = Omit<CreateReportPayload, 'branchId' | 'date'>;

export interface LessonPlan {
  id: number;
  instructorId: number;
  instructor: MorabbiUser | null;
  branchId: number;
  branch: Branch | null;
  title: string;
  subject: string;
  grade: string | null;
  sessionCount: number;
  generalObjective: string | null;
  objectives: string;
  behavioralObjectives: string | null;
  subHeadings: string | null;
  prerequisites: string | null;
  diagnosticEvaluation: string | null;
  preparationPhase: string | null;
  introductionPhase: string | null;
  presentationPhase: string | null;
  summaryPhase: string | null;
  evaluationPhase: string | null;
  supplementaryActivities: string | null;
  teachingMethod: string | null;
  teachingAids: string | null;
  evaluationQuestions: string | null;
  contentOutline: string | null;
  evaluationMethod: string | null;
  quranRefs: string;
  hadithRefs: string;
  sources: string;
  planType: string;
  approach: string | null;
  traineeCount: number;
  stagePresentation: string | null;
  stageThinking: string | null;
  stageDiscussion: string | null;
  stageReporting: string | null;
  groupEndurance: string | null;
  groupSemiSpeed: string | null;
  groupSpeed: string | null;
  evaluationSelf: string | null;
  evaluationResult: string | null;
  status: TargetStatus | null;
  evaluatorId: number | null;
  evaluator: MorabbiUser | null;
  evaluatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonPlanPayload {
  branchId?: number | null;
  title: string;
  subject?: string | null;
  grade?: string | null;
  sessionCount?: number | null;
  generalObjective?: string | null;
  objectives?: string | null;
  behavioralObjectives?: string | null;
  subHeadings?: string | null;
  prerequisites?: string | null;
  diagnosticEvaluation?: string | null;
  preparationPhase?: string | null;
  introductionPhase?: string | null;
  presentationPhase?: string | null;
  summaryPhase?: string | null;
  evaluationPhase?: string | null;
  supplementaryActivities?: string | null;
  teachingMethod?: string | null;
  teachingAids?: string | null;
  evaluationQuestions?: string | null;
  contentOutline?: string | null;
  evaluationMethod?: string | null;
  quranRefs?: string | null;
  hadithRefs?: string | null;
  sources?: string | null;
  planType?: string | null;
  approach?: string | null;
  traineeCount?: number | null;
  stagePresentation?: string | null;
  stageThinking?: string | null;
  stageDiscussion?: string | null;
  stageReporting?: string | null;
  groupEndurance?: string | null;
  groupSemiSpeed?: string | null;
  groupSpeed?: string | null;
  evaluationSelf?: string | null;
  status?: TargetStatus | null;
}

export type UpdateLessonPlanPayload = Omit<CreateLessonPlanPayload, 'branchId'>;

export interface Evaluation {
  id: number;
  targetType: string;
  targetId: number;
  evaluatorId: number;
  evaluator: MorabbiUser | null;
  scores: string;
  overallComment: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvaluationPayload {
  targetType: string;
  targetId: number;
  scores?: string | null;
  overallComment?: string | null;
  status?: string | null;
}

export interface UpdateEvaluationPayload {
  scores?: string | null;
  overallComment?: string | null;
  status?: 'DRAFT' | 'FINAL' | 'REVISED' | null;
}

export interface EvaluationCriteria {
  id: number;
  type: string;
  title: string;
  description: string | null;
  weight: number;
  rubricLevels: string;
  active: boolean;
  version: number;
  definedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Recognition {
  id: number;
  userId: number;
  user: MorabbiUser | null;
  branchId: number | null;
  branch: Branch | null;
  level: string;
  title: string;
  description: string | null;
  period: string | null;
  awardedBy: string | null;
  aiSuggested: boolean;
  createdAt: string;
}

export interface AwardRecognitionPayload {
  userId: number;
  level: string;
  title: string;
  description?: string | null;
  period?: string | null;
  points: number;
}

export interface PointTransaction {
  id: number;
  userId: number;
  user: MorabbiUser | null;
  branchId: number | null;
  branch: Branch | null;
  amount: number;
  reason: string;
  description: string | null;
  sourceType: string | null;
  sourceId: string | null;
  awardedBy: string | null;
  createdAt: string;
}

export interface BoardEntry {
  id: number;
  name: string;
  role: string;
  branchId: number | null;
  branchName: string;
  totalPoints: number;
  recognitionsCount: number;
}

export interface Notification {
  id: number;
  userId: number;
  user: MorabbiUser | null;
  type: string;
  title: string;
  body: string | null;
  payload: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface TargetCounts {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  returned: number;
}

export interface DashboardData {
  user: {
    id: number;
    name: string;
    role: string;
    branchId: number | null;
    totalPoints: number;
    recognitionsCount: number;
  } | null;
  reports: TargetCounts;
  lessonPlans: TargetCounts;
  pendingApprovals: number;
  recentNotifications: Notification[];
}

export interface ApproveUserPayload {
  userId: number;
  approved: boolean;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface CreateMaktabPayload {
  name: string;
  code: string;
  description?: string | null;
  active?: boolean | null;
}

export type UpdateMaktabPayload = Partial<CreateMaktabPayload>;

export interface CreateBranchPayload {
  name: string;
  code: string;
  address?: string | null;
  phone?: string | null;
  maktabId?: number | null;
  isBoys: boolean;
}

export interface UpdateBranchPayload {
  name?: string | null;
  code?: string | null;
  address?: string | null;
  phone?: string | null;
  maktabId?: number | null;
  isBoys?: boolean | null;
}
