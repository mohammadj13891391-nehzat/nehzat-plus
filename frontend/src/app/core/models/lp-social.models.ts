import { CollaboratorMetric } from './lp-metrics.models';

export interface CollaborationProject {
  id: number;
  title: string;
  description?: string | null;
  subject?: string | null;
  memberIds: number[];
  memberNames?: string[];
  createdAt: string;
  updatedAt: string;
  progressPercent: number;
  taskCount: number;
  completedTaskCount: number;
}

export interface CreateCollaborationProjectPayload {
  title: string;
  description?: string | null;
  subject?: string | null;
  memberIds: number[];
}

export interface DiscussionThread {
  id: number;
  projectId: number;
  projectTitle?: string;
  title: string;
  body: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  postCount: number;
  isPinned: boolean;
}

export interface CreateDiscussionThreadPayload {
  projectId: number;
  title: string;
  body: string;
}

export interface DiscussionPost {
  id: number;
  threadId: number;
  threadTitle?: string;
  body: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  parentId?: number | null;
  likeCount: number;
  isLiked: boolean;
}

export interface CreateDiscussionPostPayload {
  threadId: number;
  body: string;
  parentId?: number | null;
}

export interface PeerReview {
  id: number;
  projectId: number;
  projectTitle?: string;
  reviewerId: number;
  reviewerName?: string;
  authorId: number;
  authorName?: string;
  score: number;
  feedback: string;
  submittedAt: string;
  status: 'assigned' | 'submitted' | 'returned';
}

export interface SubmitPeerReviewPayload {
  projectId: number;
  score: number;
  feedback: string;
}

export interface PortfolioItem {
  id: number;
  userId: number;
  title: string;
  type: 'artwork' | 'music' | 'writing' | 'project' | 'certificate' | 'other';
  typeLabel?: string;
  description?: string | null;
  fileUrl?: string | null;
  tags?: string | null;
  isPublic: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadPortfolioItemPayload {
  title: string;
  type: 'artwork' | 'music' | 'writing' | 'project' | 'certificate' | 'other';
  fileUrl?: string | null;
  description?: string | null;
  tags?: string | null;
  isPublic?: boolean;
}

export interface SkillCertificate {
  id: number;
  userId: number;
  title: string;
  issuer: string;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialHash?: string | null;
  certificateUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillBasket {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  skillIds: number[];
  skillNames?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  competencyPercent: number;
}

export interface CreateSkillBasketPayload {
  title: string;
  description?: string | null;
  skillIds: number[];
  isPublic?: boolean;
}

export interface CollaborationMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  avgTeamSize: number;
  topCollaborators: CollaboratorMetric[];
}



