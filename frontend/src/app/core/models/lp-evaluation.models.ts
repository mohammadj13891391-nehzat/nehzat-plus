export interface QuestionDto {
  id: number;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correctAnswer: string;
  points: number;
  createdAt: string;
}

export interface CreateQuestionRequest {
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface RandomEvaluationDto {
  id: number;
  studentId: number;
  studentName: string;
  title: string;
  category: string;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  status: 'in_progress' | 'completed' | 'expired';
  questions: EvaluationQuestionDto[];
  answers: EvaluationAnswerDto[];
}

export interface EvaluationQuestionDto {
  questionId: number;
  text: string;
  options: string[];
  points: number;
}

export interface EvaluationAnswerDto {
  questionId: number;
  answerText: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface StartEvaluationRequest {
  studentId: number;
  category: string;
  questionCount: number;
}

export interface EvaluationStatsDto {
  totalEvaluations: number;
  completedEvaluations: number;
  totalQuestions: number;
  categoryBreakdown: { [k: string]: number };
  scoreTrend: EvaluationTrendPointDto[];
}

export interface EvaluationTrendPointDto {
  date: string;
  averageScore: number;
}

// === Phase 17: Notifications & Courier Reports ===

