import { LessonContentBlock } from './lp-expsci.models';

export interface ProgressionResult {
  studentId: number;
  studentName: string;
  currentLevel: string;
  currentRing: string;
  nextLevel?: string;
  nextRing?: string;
  canProgress: boolean;
  blockingReasons: string[];
  skillMasteryRates: Record<string, number>;
  checkedAt: string;
}

export interface AvailablePath {
  id: number;
  key: string;
  titleFa: string;
  descriptionFa?: string;
  genderMask: string;
  sortOrder: number;
  ageEntryPoint: number;
  ageFinalizePoint: number;
  status: string;
}

export interface LearningPath {
  id: number;
  title: string;
  description?: string;
  slug: string;
  ageGroup: string;
  ageRange?: string;
  difficultyLevel?: string;
  estimatedDurationDays?: number;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  moduleCount?: number;
  lessonCount?: number;
  levelCount?: number;
  levels?: LearningLevel[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningLevel {
  id: number;
  learningPathId: number;
  learningPath?: LearningPath;
  title: string;
  description?: string;
  levelNumber: number;
  requiredXp: number;
  sortOrder: number;
  minAge?: number;
  maxAge?: number;
  estimatedDurationDays?: number;
  modules?: StudyModule[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyModule {
  id: number;
  learningLevelId: number;
  learningLevel?: LearningLevel;
  title: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  estimatedDays: number;
  lessons?: StudyLesson[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyLesson {
  id: number;
  studyModuleId: number;
  studyModule?: StudyModule;
  module?: StudyModule;
  title: string;
  description?: string;
  objectives?: string;
  difficultyLevel?: string;
  contentBlocks?: LessonContentBlock[];
  quizzes?: PersLitQuiz[];
  sortOrder: number;
  estimatedMinutes: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersLitQuiz {
  id: number;
  studyLessonId: number;
  studyLesson?: StudyLesson;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes?: number;
  phase?: string;
  questions?: PersLitQuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface PersLitQuizQuestion {
  id: number;
  quizId: number;
  quiz?: PersLitQuiz;
  questionText: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizOption {
  id: number;
  quizQuestionId: number;
  quizQuestion?: PersLitQuizQuestion;
  optionText: string;
  label: string;
  text: string;
  isCorrect: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserEnrollment {
  id: number;
  userId: number;
  learningPathId: number;
  learningPath?: LearningPath;
  currentLevelId?: number;
  currentLevel?: LearningLevel;
  progress: number;
  xpEarned: number;
  isCompleted: boolean;
  completedAt?: string;
  lessonProgress?: UserLessonProgress[];
  createdAt: string;
  updatedAt: string;
}

export interface UserLessonProgress {
  id: number;
  userEnrollmentId: number;
  enrollment?: UserEnrollment;
  studyLessonId: number;
  studyLesson?: StudyLesson;
  status: string;
  score: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuizAttempt {
  id: number;
  userEnrollmentId: number;
  enrollment?: UserEnrollment;
  quizId: number;
  quiz?: PersLitQuiz;
  score: number;
  totalPoints: number;
  answers: string;
  isPassed: boolean;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Learning System Payloads
export interface CreateLearningPathPayload {
  title: string;
  description?: string;
  slug: string;
  ageGroup: string;
  icon?: string;
  color?: string;
  sortOrder: number;
}

export interface UpdateLearningPathPayload {
  title?: string;
  description?: string;
  slug?: string;
  ageGroup?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateLearningLevelPayload {
  learningPathId: number;
  title: string;
  description?: string;
  levelNumber: number;
  requiredXp: number;
  sortOrder: number;
}

export interface UpdateLearningLevelPayload {
  title?: string;
  description?: string;
  levelNumber?: number;
  requiredXp?: number;
  sortOrder?: number;
}

export interface CreateStudyModulePayload {
  learningLevelId: number;
  title: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  estimatedDays: number;
}

export interface UpdateStudyModulePayload {
  title?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  estimatedDays?: number;
}

export interface CreateStudyLessonPayload {
  studyModuleId: number;
  title: string;
  description?: string;
  objectives?: string;
  sortOrder: number;
  estimatedMinutes: number;
  isPremium?: boolean;
}

export interface UpdateStudyLessonPayload {
  title?: string;
  description?: string;
  objectives?: string;
  sortOrder?: number;
  estimatedMinutes?: number;
  isPremium?: boolean;
}

export interface CreateContentBlockPayload {
  studyLessonId: number;
  blockType: string;
  title: string;
  content: string;
  data?: string;
  sortOrder: number;
}

export interface UpdateContentBlockPayload {
  blockType?: string;
  title?: string;
  content?: string;
  data?: string;
  sortOrder?: number;
}

export interface CreatePersLitQuizPayload {
  studyLessonId: number;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
}

export interface UpdatePersLitQuizPayload {
  title?: string;
  description?: string;
  passingScore?: number;
  maxAttempts?: number;
}

export interface CreatePersLitQuizQuestionPayload {
  quizId: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
  points: number;
}

export interface UpdatePersLitQuizQuestionPayload {
  questionText?: string;
  options?: string;
  correctAnswer?: string;
  explanation?: string;
  order?: number;
  points?: number;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface CreateQuizPayload {
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
  passingScore?: number;
}

export interface EnrollUserRequest {
  learningPathId: number;
}

export interface QuizResultDto {
  attempt: UserQuizAttempt;
  passed: boolean;
  score: number;
  totalPoints: number;
  percentage: number;
  passedThreshold: number;
}

export interface SubmitQuizRequest {
  quizId: number;
  answers: { questionId: number; answer: string }[];
}

export interface LearningPathTreeDto {
  path: LearningPath;
  levels: (LearningLevel & {
    modules: (StudyModule & {
      lessons: (StudyLesson & {
        quizzes: PersLitQuiz[];
      })[];
    })[];
  })[];
}

export interface LearningDashboardStatsDto {
  totalPaths: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  badges: number;
}

export interface UserDashboardDto {
  enrollment: UserEnrollment;
  path: LearningPath;
  currentLevel?: LearningLevel;
  recentLessons: UserLessonProgress[];
  quizAttempts: UserQuizAttempt[];
  xpProgress: { current: number; nextLevel: number };
}

// ===== Hadith Module =====



