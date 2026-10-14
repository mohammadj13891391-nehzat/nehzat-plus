export interface MathTopic {
  id: number;
  title: string;
  description?: string;
  difficultyLevel: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  lessons?: MathLesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MathLesson {
  id: number;
  title: string;
  content: string;
  summary?: string;
  videoUrl?: string;
  mathTopicId: number;
  topic?: MathTopic;
  durationMinutes: number;
  displayOrder: number;
  isPublished: boolean;
  questions?: MathQuestion[];
  progressRecords?: MathProgress[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MathQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  mathLessonId: number;
  lesson?: MathLesson;
  difficultyLevel: string;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MathProgress {
  id: number;
  studentId: number;
  student?: { id: number; username: string; firstName?: string; lastName?: string };
  mathLessonId: number;
  lesson?: MathLesson;
  mathQuestionId?: number;
  question?: MathQuestion;
  isCompleted: boolean;
  score?: number;
  attemptCount: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MathScholar {
  id: number;
  name: string;
  nameArabic?: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  biography?: string;
  imageUrl?: string;
  knownFor?: string;
  contributions?: MathContribution[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MathContribution {
  id: number;
  mathScholarId: number;
  scholar?: MathScholar;
  mathTopicId?: number;
  topic?: MathTopic;
  title: string;
  description?: string;
  yearRange?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMathTopicPayload {
  title: string;
  description?: string;
  difficultyLevel: string;
  iconUrl?: string;
  displayOrder: number;
}

export interface UpdateMathTopicPayload {
  title?: string;
  description?: string;
  difficultyLevel?: string;
  iconUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateMathLessonPayload {
  title: string;
  content: string;
  summary?: string;
  videoUrl?: string;
  mathTopicId: number;
  durationMinutes: number;
  displayOrder: number;
}

export interface UpdateMathLessonPayload {
  title?: string;
  content?: string;
  summary?: string;
  videoUrl?: string;
  durationMinutes?: number;
  displayOrder?: number;
  isPublished?: boolean;
}

export interface CreateMathQuestionPayload {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  mathLessonId: number;
  difficultyLevel: string;
  points: number;
}

export interface UpdateMathQuestionPayload {
  questionText?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctOption?: string;
  explanation?: string;
  difficultyLevel?: string;
  points?: number;
}

export interface RecordMathProgressPayload {
  studentId: number;
  mathLessonId: number;
  mathQuestionId?: number;
  isCompleted: boolean;
  score?: number;
}

export interface UpdateMathProgressPayload {
  isCompleted?: boolean;
  score?: number;
}

export interface CreateMathScholarPayload {
  name: string;
  nameArabic?: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  biography?: string;
  imageUrl?: string;
  knownFor?: string;
}

export interface UpdateMathScholarPayload {
  name?: string;
  nameArabic?: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  biography?: string;
  imageUrl?: string;
  knownFor?: string;
}

export interface CreateMathContributionPayload {
  mathScholarId: number;
  mathTopicId?: number;
  title: string;
  description?: string;
  yearRange?: string;
}

export interface UpdateMathContributionPayload {
  mathScholarId?: number;
  mathTopicId?: number;
  title?: string;
  description?: string;
  yearRange?: string;
}

// ==================== Experimental Sciences (علوم تجربی) ====================


