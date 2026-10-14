import { HadithItem } from './lp-hadith.models';

export interface UserHadithProgress {
  id: number;
  userId: number;
  hadithId: number;
  memorizationStatus: string;
  reviewCount: number;
  lastReviewedAt: string;
  ease: number;
  interval: number;
  nextReviewAt: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  hadith?: HadithItem;
}



