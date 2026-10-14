export interface ProjectDefense {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  projectUrl?: string | null;
  videoUrl?: string | null;
  status: 'draft' | 'submitted' | 'scheduled' | 'completed' | 'failed';
  scheduledAt?: string | null;
  scheduledDate?: string | null;
  defenseDate?: string | null;
  score?: number | null;
  feedback?: string | null;
  evaluatorId?: number | null;
  evaluatorName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDefensePayload {
  title: string;
  description?: string | null;
  projectUrl?: string | null;
  videoUrl?: string | null;
}

export interface SubmitProjectDefensePayload {
  defenseId: number;
  projectUrl?: string | null;
  videoUrl?: string | null;
}

export interface ProjectDefenseEvaluation {
  id: number;
  defenseId: number;
  evaluatorId: number;
  evaluatorName?: string;
  score: number;
  feedback: string;
  criteriaScores: Record<string, number>;
  evaluatedAt: string;
}

export interface ScheduleDefensePayload {
  defenseId: number;
  scheduledDate?: string;
  scheduledAt?: string;
  evaluatorId?: number;
  evaluatorIds?: number[];
  location?: string;
  durationMinutes?: number;
}

export interface DefenseSchedule {
  id: number;
  defenseId: number;
  defenseTitle?: string;
  studentId: number;
  studentName?: string;
  evaluatorId: number;
  evaluatorName?: string;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// ===== Community Metrics Module (Phase 9) =====

