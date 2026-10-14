export interface ProgressReportDto {
  id: number; studentId: number; studentName: string;
  periodStart: string; periodEnd: string;
  overallScore: number; attendanceRate: number; assignmentCompletionRate: number;
  completedAssignments: number; totalAssignments: number;
  coachNote?: string; generatedAt: string;
  metrics: ProgressMetricDto[];
}
export interface ProgressMetricDto {
  id: number; metricKey: string; metricLabel: string;
  score: number; target: number; rank: number; notes?: string;
}
export interface DashboardSummaryDto {
  recentReports: ProgressReportDto[];
  trend: ProgressTrendPointDto[];
  pendingEvaluations: number;
  unreadMessages: number;
  openWorkflows: number;
  totalXp: number;
  leaderboard: LeaderboardEntryDto[];
}
export interface ProgressTrendPointDto { date: string; overallScore: number; attendanceRate: number; assignmentCompletionRate: number; }
export interface LeaderboardEntryDto { studentId: number; studentName: string; overallScore: number; rank: number; }
export interface GenerateReportRequest { studentId: number; periodStart: string; periodEnd: string; coachNote?: string; }


