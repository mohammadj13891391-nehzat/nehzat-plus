export interface CommunityMetrics {
  totalTrainees: number;
  activeThisWeek: number;
  totalCollaborations: number;
  totalPortfolioItems: number;
  avgSkillLevel: number;
  topDomains: DomainMetric[];
}

export interface DomainMetric {
  domain: string;
  traineeCount: number;
  avgXp: number;
  avgLevel: number;
}

export interface PeerActivity {
  id: number;
  traineeId: number;
  traineeName: string;
  traineeAvatar?: string | null;
  activityType: 'project_created' | 'discussion_posted' | 'portfolio_uploaded' | 'badge_earned' | 'level_up' | 'collaboration_joined';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SkillSharingMetrics {
  totalShared: number;
  topSharedSkills: SkillShare[];
  recentShares: SkillShare[];
}

export interface SkillShare {
  id: number;
  skillName: string;
  sharedBy: string;
  sharedById: number;
  category: string;
  viewCount: number;
  likeCount: number;
  sharedAt: string;
}

export interface CollaboratorMetric {
  traineeId: number;
  traineeName: string;
  projectCount: number;
  contributionScore: number;
}

export interface PublicShowcase {
  id: number;
  traineeId: number;
  traineeName: string;
  traineeAvatar?: string | null;
  title: string;
  type: 'portfolio' | 'artwork' | 'music' | 'calligraphy' | 'project' | 'achievement';
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
}


