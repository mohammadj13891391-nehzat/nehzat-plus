export interface HadithBook {
  id: number;
  key: string;
  title: string;
  titleTranslation: string;
  author: string;
  description?: string;
  hadithCount: number;
  chapterCount: number;
  language: string;
  difficultyLevel?: string;
  sortOrder: number;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HadithChapter {
  id: number;
  bookId: number;
  book?: HadithBook;
  title: string;
  titleTranslation: string;
  description?: string;
  chapterNumber: number;
  hadithCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface HadithItem {
  id: number;
  chapterId: number;
  chapter?: HadithChapter;
  bookId: number;
  book?: HadithBook;
  hadithNumber: number;
  arabicText: string;
  persianTranslation: string;
  isnad?: string;
  explanation?: string;
  fiqhTakeaway?: string;
  grade?: string;
  gradeColor?: string;
  audioUrl?: string;
  sourceReference?: string;
  difficultyLevel?: string;
  keywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HadithReview {
  id: number;
  studentId: number;
  hadithId: number;
  hadith?: HadithItem;
  reviewCount: number;
  correctCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  masteryLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface HadithReviewStats {
  totalReviewed: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  streakDays: number;
  accuracyRate: number;
}

export interface HadithBookDetail extends HadithBook {
  chapters?: HadithChapter[];
  hadiths?: HadithItem[];
}

export interface HadithChapterDetail extends HadithChapter {
  hadiths?: HadithItem[];
}

export interface HadithReviewCard {
  id: number;
  hadithId: number;
  hadith?: HadithItem;
  reviewType: string;
  dueDate: string;
  streak: number;
  ease: number;
}

export interface SubmitReviewPayload {
  hadithId: number;
  score: number;
  reviewType: string;
}

export interface HadithAssessment {
  id: number;
  chapterId: number;
  title: string;
  description: string;
  questionCount: number;
  score: number;
  passedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HadithDashboardStats {
  totalBooks: number;
  totalHadiths: number;
  totalMemorized: number;
  currentStreak: number;
  totalXp: number;
}

export interface SubmitHadithReviewPayload {
  hadithId: number;
  isCorrect: boolean;
}

// ===== Trainee Domain Radar + Multi-domain Streaks =====


