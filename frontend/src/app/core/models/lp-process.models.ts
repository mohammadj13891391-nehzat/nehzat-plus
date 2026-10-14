export type EducationalEntityType = 'Course' | 'Enrollment' | 'Submission' | 'Content' | 'Grade';

export interface EducationalProcessDto {
  id: number;
  name: string;
  description?: string;
  workflowDefinitionId: number;
  workflowDefinitionName?: string;
  entityType: EducationalEntityType;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEducationalProcessRequest {
  name: string;
  description?: string;
  workflowDefinitionId: number;
  entityType: EducationalEntityType;
  isActive?: boolean;
}

export interface UpdateEducationalProcessRequest {
  name?: string;
  description?: string;
  workflowDefinitionId?: number;
  entityType?: EducationalEntityType;
  isActive?: boolean;
}

export interface ProcessTriggerResultDto {
  success: boolean;
  workflowRequestId?: number;
  message?: string;
}


