import { EvaluationAnswerDto } from './lp-evaluation.models';

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

export interface SubmitAnswersRequest {
  randomEvaluationId: number;
  answers: EvaluationAnswerDto[];
}



