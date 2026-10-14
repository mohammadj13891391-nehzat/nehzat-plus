export interface PersianLiteraturePoet {
  id: number;
  name: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  poems?: PersianLiteraturePoem[];
}

export interface PersianLiteraturePoem {
  id: number;
  poetId: number;
  poet?: PersianLiteraturePoet;
  title: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  analyses?: PersianLiteratureAnalysis[];
}

export interface PersianLiteratureAnalysis {
  id: number;
  poemId: number;
  poem?: PersianLiteraturePoem;
  title: string;
  content: string;
  analysisType: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
}

export interface CreatePersianLiteraturePoetPayload {
  name: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century?: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

export interface CreatePersianLiteraturePoemPayload {
  poetId: number;
  title: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount?: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder?: number;
}

export interface CreatePersianLiteratureAnalysisPayload {
  poemId: number;
  title: string;
  content: string;
  analysisType?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

// ===== Arabic Literature =====

export interface ArabicLiteraturePoet {
  id: number;
  name: string;
  nasab?: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  poems?: ArabicLiteraturePoem[];
}

export interface ArabicLiteraturePoem {
  id: number;
  poetId: number;
  poet?: ArabicLiteraturePoet;
  title: string;
  bahr?: string;
  qafiya?: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  analyses?: ArabicLiteratureAnalysis[];
}

export interface ArabicLiteratureAnalysis {
  id: number;
  poemId: number;
  poem?: ArabicLiteraturePoem;
  title: string;
  content: string;
  analysisType: string;
  difficultyLevel?: string;
  sortOrder: number;
  createdAt: string;
}

export interface CreateArabicLiteraturePoetPayload {
  name: string;
  nasab?: string;
  penName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  era?: string;
  century?: number;
  biography?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

export interface CreateArabicLiteraturePoemPayload {
  poetId: number;
  title: string;
  bahr?: string;
  qafiya?: string;
  genre?: string;
  content: string;
  translation?: string;
  interpretation?: string;
  sourceBook?: string;
  verseCount?: number;
  difficultyLevel?: string;
  theme?: string;
  sortOrder?: number;
}

export interface CreateArabicLiteratureAnalysisPayload {
  poemId: number;
  title: string;
  content: string;
  analysisType?: string;
  difficultyLevel?: string;
  sortOrder?: number;
}

// ===== Arabic Literature Curriculum =====

export interface ArabicCourse {
  id: number;
  title: string;
  description?: string;
  level: string;
  ageRange?: string;
  sortOrder: number;
  icon?: string;
  color?: string;
  prerequisiteCourseIds?: string;
  createdAt: string;
  updatedAt: string;
  lessons?: ArabicLesson[];
}

export interface ArabicLesson {
  id: number;
  courseId: number;
  course?: ArabicCourse;
  title: string;
  description?: string;
  objectives?: string;
  poemId?: number;
  poem?: ArabicLiteraturePoem;
  content?: string;
  exerciseData?: string;
  quizData?: string;
  durationMinutes: number;
  sortOrder: number;
  prerequisiteLessonIds?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArabicUserProgress {
  id: number;
  userId: number;
  lessonId: number;
  lesson?: ArabicLesson;
  status: string;
  score: number;
  startedAt?: string;
  completedAt?: string;
}

export interface CreateArabicCoursePayload {
  title: string;
  description?: string;
  level?: string;
  ageRange?: string;
  sortOrder?: number;
  icon?: string;
  color?: string;
  prerequisiteCourseIds?: string;
}

export interface UpdateArabicCoursePayload {
  title?: string;
  description?: string;
  level?: string;
  ageRange?: string;
  sortOrder?: number;
  icon?: string;
  color?: string;
  prerequisiteCourseIds?: string;
}

export interface CreateArabicLessonPayload {
  courseId: number;
  title: string;
  description?: string;
  objectives?: string;
  poemId?: number;
  content?: string;
  exerciseData?: string;
  quizData?: string;
  durationMinutes?: number;
  sortOrder?: number;
  prerequisiteLessonIds?: string;
}

export interface UpdateArabicLessonPayload {
  title?: string;
  description?: string;
  objectives?: string;
  poemId?: number;
  content?: string;
  exerciseData?: string;
  quizData?: string;
  durationMinutes?: number;
  sortOrder?: number;
  prerequisiteLessonIds?: string;
}

export interface RecordArabicProgressPayload {
  lessonId: number;
  status?: string;
  score?: number;
}

// ===== Math Module =====


