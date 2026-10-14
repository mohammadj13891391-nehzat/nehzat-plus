export type TraineeDomainKey = 'scientific' | 'spiritual' | 'physical' | 'artistic' | 'social' | 'career';

export interface DomainProgress {
  key: TraineeDomainKey;
  labelFa: string;
  icon: string;
  score: number;
}

export type StreakDomainKey = 'academic' | 'spiritual' | 'physical';

export interface StreakInfo {
  academic: number;
  spiritual: number;
  physical: number;
  unified: number;
}

export type NudgeDomain = 'scientific' | 'spiritual' | 'physical';

export interface DailyNudge {
  id: number;
  userId: number;
  domain: NudgeDomain;
  message: string;
  scheduledFor: string;
  status: 'pending' | 'delivered' | 'dismissed';
  createdAt: string;
  dismissedAt?: string | null;
}

export interface NudgeSchedule {
  id: number;
  domain: NudgeDomain;
  hour: number;
  minute: number;
  message: string;
  enabled: boolean;
}

// ===== XP / Gamification Module =====


