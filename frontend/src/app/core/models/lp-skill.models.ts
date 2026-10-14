import { AssignmentProgressItem } from './lp-core.models';

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

export interface CreateRingBookPayload {
  ringId: number;
  bookId: number;
  sortOrder?: number;
}

export interface CreateRingTeachingMethodPayload {
  ringId: number;
  teachingMethodId: number;
}

export interface RegisterListenCompletionPayload {
  instructionAudioVersion?: string;
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



