export type CognitiveLevel = 'awareness' | 'understanding' | 'application' | 'analysis' | 'synthesis' | 'evaluation';

export interface Accommodation {
  id: number;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyPathAccommodation {
  id: number;
  studyPathId: number;
  accommodationId: number;
}

export interface StudyPathStep {
  id: number;
  studyPathId: number;
  stepOrder: number;
  title: string;
  description?: string;
  cognitiveLevel: CognitiveLevel;
  estimatedDurationMinutes: number;
  prerequisitesJson?: string;
  contentUrl?: string;
  resourceId?: number;
  assessmentId?: number;
  assessmentTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyPath {
  id: number;
  key: string;
  title: string;
  description?: string;
  ageGroupId: number;
  ageGroupName: string;
  subjectAreaId: number;
  subjectAreaName: string;
  cognitiveLevel: CognitiveLevel;
  isActive: boolean;
  sortOrder: number;
  accommodations: Accommodation[];
  steps: StudyPathStep[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccommodationRequest {
  code: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface CreateStudyPathStepRequest {
  stepOrder: number;
  title: string;
  description?: string;
  cognitiveLevel?: CognitiveLevel;
  estimatedDurationMinutes?: number;
  prerequisitesJson?: string;
  contentUrl?: string;
  resourceId?: number;
  assessmentId?: number;
}

export interface UpdateStudyPathStepRequest {
  stepOrder?: number;
  title?: string;
  description?: string;
  cognitiveLevel?: CognitiveLevel;
  estimatedDurationMinutes?: number;
  prerequisitesJson?: string;
  contentUrl?: string;
  resourceId?: number;
  assessmentId?: number;
}

export interface CreateStudyPathRequest {
  key: string;
  title: string;
  ageGroupId: number;
  subjectAreaId: number;
  description?: string;
  cognitiveLevel?: CognitiveLevel;
  isActive?: boolean;
  sortOrder?: number;
  steps?: CreateStudyPathStepRequest[];
  accommodationIds?: number[];
}

export interface UpdateStudyPathRequest {
  key?: string;
  title?: string;
  description?: string;
  ageGroupId?: number;
  subjectAreaId?: number;
  cognitiveLevel?: CognitiveLevel;
  isActive?: boolean;
  sortOrder?: number;
  accommodationIds?: number[];
}

export interface ReorderStepsRequest {
  stepIds: number[];
}

export interface CompleteStepRequest {
  studyPathId: number;
  stepId: number;
}

export interface SkipStepRequest {
  studyPathId: number;
  stepId: number;
}

export interface EnrollRequest {
  studyPathId: number;
}

// Analytics Types
export interface StepAnalyticsDto {
  stepId: number;
  stepOrder: number;
  title: string;
  cognitiveLevel: string;
  estimatedDurationMinutes: number;
  actualDurationMinutes?: number;
  isCompleted: boolean;
  isSkipped: boolean;
  isCurrent: boolean;
  completedAt?: string;
}

export interface StudyPathProgressAnalyticsDto {
  enrollmentId: number;
  studyPathTitle: string;
  totalSteps: number;
  completedSteps: number;
  skippedSteps: number;
  currentStepIndex: number;
  progressPercentage: number;
  status: string;
  enrollmentDate: string;
  startedAt?: string;
  completedAt?: string;
  steps: StepAnalyticsDto[];
  estimatedTimeRemaining?: string;
  averageTimePerStepMinutes: number;
}

export interface StudyPathSummaryDto {
  enrollmentId: number;
  studyPathId: number;
  studyPathTitle: string;
  subjectAreaName: string;
  progressPercentage: number;
  status: string;
  enrollmentDate: string;
  completedAt?: string;
}


