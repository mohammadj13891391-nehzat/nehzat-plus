import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import {
  PhaseDto,
  TopicDto,
  LessonDto,
  ExperimentDto,
  ExpSciQuizDto,
  ExpSciQuizQuestionDto,
  StudentProgressDto,
  CreatePhaseRequest,
  UpdatePhaseRequest,
  CreateTopicRequest,
  UpdateTopicRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  CreateExperimentRequest,
  UpdateExperimentRequest,
  CreateExpSciQuizRequest,
  UpdateExpSciQuizRequest,
  CreateExpSciQuizQuestionRequest,
  UpdateExpSciQuizQuestionRequest,
  UpdateStudentProgressRequest
} from '../../../core/models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class ExperimentalSciencesService {
  private api = inject(LESSON_PLANNER_API);

  // Phase methods
  getPhases(): Observable<PhaseDto[]> {
    return this.api.getExperimentalSciencesPhases();
  }

  getPhase(id: number): Observable<PhaseDto> {
    return this.api.getExperimentalSciencesPhase(id);
  }

  createPhase(request: CreatePhaseRequest): Observable<PhaseDto> {
    return this.api.createExperimentalSciencesPhase(request);
  }

  updatePhase(id: number, request: UpdatePhaseRequest): Observable<void> {
    return this.api.updateExperimentalSciencesPhase(id, request);
  }

  deletePhase(id: number): Observable<void> {
    return this.api.deleteExperimentalSciencesPhase(id);
  }

  // Topic methods
  getTopics(): Observable<TopicDto[]> {
    return this.api.getExperimentalSciencesTopics();
  }

  getTopicsByPhase(phaseId: number): Observable<TopicDto[]> {
    return this.api.getExperimentalSciencesTopicsByPhase(phaseId);
  }

  getTopic(id: number): Observable<TopicDto> {
    return this.api.getExperimentalSciencesTopic(id);
  }

  createTopic(request: CreateTopicRequest): Observable<TopicDto> {
    return this.api.createExperimentalSciencesTopic(request);
  }

  updateTopic(id: number, request: UpdateTopicRequest): Observable<void> {
    return this.api.updateExperimentalSciencesTopic(id, request);
  }

  deleteTopic(id: number): Observable<void> {
    return this.api.deleteExperimentalSciencesTopic(id);
  }

  // Lesson methods
  getLessonsByTopic(topicId: number): Observable<LessonDto[]> {
    return this.api.getExperimentalSciencesLessonsByTopic(topicId);
  }

  getLesson(id: number): Observable<LessonDto> {
    return this.api.getExperimentalSciencesLesson(id);
  }

  createLesson(request: CreateLessonRequest): Observable<LessonDto> {
    return this.api.createExperimentalSciencesLesson(request);
  }

  updateLesson(id: number, request: UpdateLessonRequest): Observable<void> {
    return this.api.updateExperimentalSciencesLesson(id, request);
  }

  deleteLesson(id: number): Observable<void> {
    return this.api.deleteExperimentalSciencesLesson(id);
  }

  // Experiment methods
  getExperimentsByLesson(lessonId: number): Observable<ExperimentDto[]> {
    return this.api.getExperimentalSciencesExperimentsByLesson(lessonId);
  }

  getExperiment(id: number): Observable<ExperimentDto> {
    return this.api.getExperimentalSciencesExperiment(id);
  }

  createExperiment(request: CreateExperimentRequest): Observable<ExperimentDto> {
    return this.api.createExperimentalSciencesExperiment(request);
  }

  updateExperiment(id: number, request: UpdateExperimentRequest): Observable<void> {
    return this.api.updateExperimentalSciencesExperiment(id, request);
  }

  deleteExperiment(id: number): Observable<void> {
    return this.api.deleteExperimentalSciencesExperiment(id);
  }

  // Quiz methods
  getQuizByLesson(lessonId: number): Observable<ExpSciQuizDto> {
    return this.api.getExperimentalSciencesQuizByLesson(lessonId);
  }

  getQuiz(id: number): Observable<ExpSciQuizDto> {
    return this.api.getExperimentalSciencesQuiz(id);
  }

  createQuiz(request: CreateExpSciQuizRequest): Observable<ExpSciQuizDto> {
    return this.api.createExperimentalSciencesQuiz(request);
  }

  updateQuiz(id: number, request: UpdateExpSciQuizRequest): Observable<void> {
    return this.api.updateExperimentalSciencesQuiz(id, request);
  }

  deleteQuiz(id: number): Observable<void> {
    return this.api.deleteExperimentalSciencesQuiz(id);
  }

  // QuizQuestion methods
  getQuizQuestions(quizId: number): Observable<ExpSciQuizQuestionDto[]> {
    return this.api.getExperimentalSciencesQuizQuestions(quizId);
  }

  getQuizQuestion(id: number): Observable<ExpSciQuizQuestionDto> {
    return this.api.getExperimentalSciencesQuizQuestion(id);
  }

  createQuizQuestion(request: CreateExpSciQuizQuestionRequest): Observable<ExpSciQuizQuestionDto> {
    return this.api.createExperimentalSciencesQuizQuestion(request);
  }

  updateQuizQuestion(id: number, request: UpdateExpSciQuizQuestionRequest): Observable<void> {
    return this.api.updateExperimentalSciencesQuizQuestion(id, request);
  }

  deleteQuizQuestion(id: number): Observable<void> {
    return this.api.deleteExperimentalSciencesQuizQuestion(id);
  }

  // Progress methods
  getStudentProgress(studentId: number): Observable<StudentProgressDto[]> {
    return this.api.getExperimentalSciencesStudentProgress(studentId);
  }

  getStudentProgressByTopic(studentId: number, topicId: number): Observable<StudentProgressDto> {
    return this.api.getExperimentalSciencesStudentProgressByTopic(studentId, topicId);
  }

  updateStudentProgress(studentId: number, topicId: number, request: UpdateStudentProgressRequest): Observable<void> {
    return this.api.updateExperimentalSciencesStudentProgress(studentId, topicId, request);
  }

  getDashboardStats(): Observable<any> {
    return this.api.getExperimentalSciencesDashboardStats();
  }
}
