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




