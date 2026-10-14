import { Course, StudentInfo } from './lp-core.models';

export type AssessmentType = 'weekly' | 'monthly' | 'midterm' | 'final' | 'quiz' | string;
export type AssessmentStatus = 'draft' | 'published' | 'completed' | 'archived' | string;
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank' | string;
export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | string;

export interface Assessment {
  id: number;
  title: string;
  description: string;
  type: AssessmentType;
  maxScore: number;
  durationMinutes: number;
  assessmentDate: string;
  status: AssessmentStatus;
  instructions?: string;
  courseId: number;
  course?: Course;
  generatedByUserId?: number;
  generationCriteria?: string;
  questions?: AssessmentQuestion[];
  results?: AssessmentResult[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentQuestion {
  id: number;
  type: QuestionType;
  questionText: string;
  optionsJson?: string;
  correctAnswerJson?: string;
  points: number;
  order: number;
  difficulty: QuestionDifficulty;
  topic?: string;
  explanation?: string;
  assessmentId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentResult {
  id: number;
  completedAt: string;
  score: number;
  maxPossibleScore: number;
  percentage: number;
  status: string;
  answersJson?: string;
  feedback?: string;
  timeSpentMinutes: number;
  assessmentId: number;
  assessment?: Assessment;
  studentId: number;
  student?: StudentInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerateWeeklyAssessmentPayload {
  courseId: number;
  generatedByUserId?: number;
  title: string;
  description: string;
  durationMinutes: number;
  maxScore: number;
  assessmentDate: string;
  criteria?: Record<string, unknown>;
}

export interface SubmitAssessmentResultPayload {
  studentId: number;
  completedAt: string;
  score: number;
  maxPossibleScore: number;
  percentage: number;
  status: string;
  answersJson?: string;
  feedback?: string;
  timeSpentMinutes: number;
}

export interface AssessmentQuestionPayload {
  type: QuestionType;
  questionText: string;
  optionsJson?: string;
  correctAnswerJson?: string;
  points: number;
  order: number;
  difficulty: QuestionDifficulty;
  topic?: string;
  explanation?: string;
}

export interface AssessmentAnalytics {
  assessment: { id: number; title: string; type: string; maxScore: number; assessmentDate: string; status: string };
  totalStudents: number;
  completedCount: number;
  completionRate: number;
  averageScore: number;
  passRate: number;
  questionStats: Array<{
    questionId: number;
    questionText: string;
    topic?: string;
    difficulty: string;
    points: number;
    correctRate: number;
  }>;
}

export type VocabularyLanguage = 'fa' | 'en' | 'ar';

export interface VocabularyTextDto {
  id: number;
  title: string;
  description?: string | null;
  content: string;
  language: VocabularyLanguage;
  subjectAreaId: number;
  ownerUserId: string;
  isPublished: boolean;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyWordDto {
  id: number;
  wordText: string;
  definition: string;
  exampleSentence?: string | null;
  exampleTranslation?: string | null;
  partOfSpeech?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  difficultyLevel: string;
  vocabularyTextId: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserVocabularyCardDto {
  id: number;
  userId: string;
  vocabularyWordId: number;
  vocabularyWord?: VocabularyWordDto;
  nextReviewAt: string;
  interval: number;
  easeFactor: number;
  repetition: number;
  quality: number;
  isKnown: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ArtworkType = 'painting' | 'craft' | 'music' | 'calligraphy';

export interface Artwork {
  id: number;
  userId: number;
  title: string;
  type: ArtworkType | string;
  fileUrl: string;
  description?: string | null;
  tags?: string | null;
  isPublic: boolean;
  likeCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArtworkPayload {
  title: string;
  type: ArtworkType | string;
  fileUrl: string;
  description?: string | null;
  tags?: string | null;
  isPublic?: boolean;
}

export interface MusicRecord {
  id: number;
  userId: number;
  title: string;
  audioUrl: string;
  artistName?: string | null;
  durationSeconds?: number | null;
  genre?: string | null;
  description?: string | null;
  tags?: string | null;
  isPublic: boolean;
  likeCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMusicRecordPayload {
  title: string;
  audioUrl: string;
  artistName?: string | null;
  durationSeconds?: number | null;
  genre?: string | null;
  description?: string | null;
  tags?: string | null;
  isPublic?: boolean;
}

export interface CalligraphySample {
  id: number;
  userId: number;
  title: string;
  imageUrl: string;
  style?: string | null;
  description?: string | null;
  tags?: string | null;
  isPublic: boolean;
  likeCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCalligraphySamplePayload {
  title: string;
  imageUrl: string;
  style?: string | null;
  description?: string | null;
  tags?: string | null;
  isPublic?: boolean;
}



