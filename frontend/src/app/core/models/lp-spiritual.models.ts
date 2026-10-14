export type SpiritualStepKind = 'pledge' | 'monitoring' | 'accounting' | 'reprimand' | 'discipline';

export interface SpiritualPracticeItem {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  stepKind: SpiritualStepKind;
  minAge?: number;
  maxAge?: number;
  genderMask: string;
  roleMask: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpiritualOccasion {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  hijriMonth?: number;
  hijriDay?: number;
  genderMask: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpiritualOccasionDetail extends SpiritualOccasion {
  practices: SpiritualPracticeItem[];
}

export interface DailySpiritualEntry {
  id: number;
  userId: number;
  entryDate: string;
  moodScore?: number;
  notes?: string;
  completedSteps?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertDailySpiritualEntryPayload {
  userId: number;
  entryDate: string;
  moodScore?: number;
  notes?: string;
  completedSteps?: string;
}

export interface DailyActivity {
  id: number;
  userId: number;
  activityDate: string;
  activityMinutes?: number | null;
  steps?: number | null;
  sleepHours?: number | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertDailyActivityPayload {
  activityDate: string;
  activityMinutes?: number | null;
  steps?: number | null;
  sleepHours?: number | null;
  notes?: string | null;
}

// Spaced Repetition (SRS) — Phase 2 (SM-2 algorithm)
export interface UserOccasionProgress {
  id: number;
  userId: number;
  occasionId: number;
  practiceItemId: number;
  hijriYear: number;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarkOccasionPracticePayload {
  userId: number;
  occasionId: number;
  practiceItemId: number;
  hijriYear: number;
  isCompleted: boolean;
  notes?: string;
}

export interface SpiritualPath {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  genderMask: string;
  sortOrder: number;
  ageEntryPoint: number;
  ageFinalizePoint: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PathRankingPayload {
  selectionId: number;
  pathId: number;
  rankOrdinal: number;
}

export interface FinalizePathPayload {
  studentId: number;
  pathId: number;
  reason?: string;
}

export interface MonthlyBooklet {
  id: number;
  studentId: number;
  studentName?: string;
  month: number;
  year: number;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  createdByUserId?: number;
  createdByUserName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMonthlyBookletPayload {
  studentId: number;
  month: number;
  year: number;
  title: string;
  content: string;
  createdByUserId: number;
}

export interface UpdateMonthlyBookletPayload {
  title?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface CurriculumVersion {
  id: number;
  key: string;
  versionNumber: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  validFrom: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurriculumVersionPayload {
  key: string;
  versionNumber: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  validFrom: string;
  validTo?: string;
}

export interface UpdateCurriculumVersionPayload {
  versionNumber?: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  validFrom?: string;
  validTo?: string;
}


