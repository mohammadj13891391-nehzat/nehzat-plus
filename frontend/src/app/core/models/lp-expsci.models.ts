import { StudyLesson } from './lp-learning.models';

export interface PhaseDto {
  id: number;
  title: string;
  description?: string;
  order: number;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePhaseRequest {
  title: string;
  description?: string;
  order: number;
  icon?: string;
}

export interface UpdatePhaseRequest {
  title?: string;
  description?: string;
  order?: number;
  icon?: string;
}

export interface TopicDto {
  id: number;
  phaseId: number;
  title: string;
  description?: string;
  order: number;
  difficultyLevel: 'Child' | 'Teen' | 'YoungAdult' | 'Adult' | 'Senior';
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTopicRequest {
  phaseId: number;
  title: string;
  description?: string;
  order: number;
  difficultyLevel: 'Child' | 'Teen' | 'YoungAdult' | 'Adult' | 'Senior';
  icon?: string;
}

export interface UpdateTopicRequest {
  phaseId?: number;
  title?: string;
  description?: string;
  order?: number;
  difficultyLevel?: 'Child' | 'Teen' | 'YoungAdult' | 'Adult' | 'Senior';
  icon?: string;
}

export interface LessonDto {
  id: number;
  topicId: number;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  estimatedMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonRequest {
  topicId: number;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  estimatedMinutes: number;
}

export interface UpdateLessonRequest {
  topicId?: number;
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  estimatedMinutes?: number;
}

export interface ExperimentDto {
  id: number;
  lessonId: number;
  title: string;
  materials: string;
  steps: string;
  expectedResult: string;
  safetyNotes?: string;
  order: number;
  estimatedMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExperimentRequest {
  lessonId: number;
  title: string;
  materials: string;
  steps: string;
  expectedResult: string;
  safetyNotes?: string;
  order: number;
  estimatedMinutes: number;
}

export interface UpdateExperimentRequest {
  lessonId?: number;
  title?: string;
  materials?: string;
  steps?: string;
  expectedResult?: string;
  safetyNotes?: string;
  order?: number;
  estimatedMinutes?: number;
}

export interface ExpSciQuizDto {
  id: number;
  lessonId: number;
  title: string;
  passingScore: number;
  timeLimitMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpSciQuizRequest {
  lessonId: number;
  title: string;
  passingScore: number;
  timeLimitMinutes: number;
}

export interface UpdateExpSciQuizRequest {
  lessonId?: number;
  title?: string;
  passingScore?: number;
  timeLimitMinutes?: number;
}

export interface ExpSciQuizQuestionDto {
  id: number;
  quizId: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpSciQuizQuestionRequest {
  quizId: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
}

export interface UpdateExpSciQuizQuestionRequest {
  quizId?: number;
  questionText?: string;
  options?: string;
  correctAnswer?: string;
  explanation?: string;
  order?: number;
  points?: number;
}

export interface UpdateStudentProgressRequest {
  status?: 'NotStarted' | 'InProgress' | 'Completed';
  score?: number;
  completedLessons?: number;
  totalLessons?: number;
}

// ===== Persian Literature Learning System (مسیر یادگیری ادبیات فارسی) =====

export interface LessonContentBlock {
  id: number;
  studyLessonId: number;
  studyLesson?: StudyLesson;
  blockType: string;
  title: string;
  content: string;
  data?: string;
  explanation?: string;
  mediaUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}



