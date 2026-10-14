export type SrsContentType = 'math' | 'quran' | 'vocabulary' | string;

export interface SpacedRepetitionCard {
  id: number;
  userId: number;
  contentType: SrsContentType;
  contentId?: number | null;
  question: string;
  answer: string;
  nextReviewAt: string;
  interval: number;
  easeFactor: number;
  repetition: number;
  lastReviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertSrsCardPayload {
  contentType: SrsContentType;
  contentId?: number | null;
  question: string;
  answer: string;
}

export interface SrsReviewPayload {
  quality: number;
}

export interface SrsStats {
  dueToday: number;
  totalCards: number;
  learningCards: number;
  reviewCards: number;
  averageEaseFactor: number;
}

export interface UserXp {
  userId: number;
  totalXp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  levelProgressXp: number;
  levelProgressPercent: number;
  updatedAt: string;
}

export interface XpBadge {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  xpMilestone: number;
  category: string;
  isEarned: boolean;
}

export interface XpActivity {
  id: number;
  type: string;
  xpAmount: number;
  badgeId?: number | null;
  badgeName?: string | null;
  badgeIcon?: string | null;
  reason: string;
  createdAt: string;
}

export interface AwardXpResult {
  userXp: UserXp;
  awardedXp: number;
  leveledUp: boolean;
  newBadges: XpBadge[];
}

export interface AwardXpPayload {
  xp: number;
  reason: string;
}

// ===== Vocabulary Module =====
export interface AwardXpRequest {
  xp: number;
  reason: string;
}


