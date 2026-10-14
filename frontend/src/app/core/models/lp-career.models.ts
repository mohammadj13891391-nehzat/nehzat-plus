export interface CareerPath {
  id: number;
  title: string;
  description?: string | null;
  category: string;
  targetLevel: number;
  targetXp: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  milestones: CareerPathMilestone[];
  prerequisites?: string[];
}

export interface CreateCareerPathPayload {
  title: string;
  description?: string | null;
  category: string;
  targetLevel: number;
  targetXp: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

export interface CareerPathMilestone {
  id: number;
  pathId: number;
  title: string;
  description?: string | null;
  skillRequirement: string;
  requiredXp: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface CareerPathProgress {
  pathId: number;
  currentMilestoneId: number | null;
  completedMilestoneCount: number;
  totalMilestones: number;
  xpEarned: number;
  xpNeeded: number;
  pathTitle: string;
}

export interface PathwayRecommendation {
  id: number;
  careerPathId: number;
  careerPathTitle: string;
  recommendationLevel: 'high' | 'medium' | 'low';
  reason: string;
  userId: number;
  createdAt: string;
}

export interface CreateCareerPathPayload {
  title: string;
  description?: string | null;
  category: string;
  targetLevel: number;
  targetXp: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

export interface SaveProgressPayload {
  pathId: number;
  currentMilestoneId: number | null;
  completedMilestoneCount: number;
  totalMilestones: number;
  xpEarned: number;
  xpNeeded: number;
  pathTitle: string;
}

export interface SelectPathwayPayload {
  pathId: number;
}


