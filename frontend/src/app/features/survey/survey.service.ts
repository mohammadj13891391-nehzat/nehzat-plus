import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import {
  ServiceSurvey,
  CreateServiceSurveyPayload,
  UpdateServiceSurveyPayload,
  ServiceSurveyQuestion,
  CreateServiceQuestionPayload,
  ServiceSurveyResponse,
  SubmitServiceSurveyPayload,
  ServiceSurveyAnalytics,
  ServiceDashboardSummary,
} from '../../core/models/lesson-planner.models';

const STORAGE_KEY = 'nehzat_service_survey_cache';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private readonly api = inject(LESSON_PLANNER_API);

  getSurveys(targetRole?: string): Observable<ServiceSurvey[]> {
    return this.api.getServiceSurveys(targetRole).pipe(
      catchError(() => of([]))
    );
  }

  getSurveyById(id: number): Observable<ServiceSurvey> {
    return this.api.getServiceSurveyById(id).pipe(
      catchError(() => {
        const cached = this.getCachedSurvey(id);
        if (cached) {
          return of(cached);
        }
        return of(this.emptySurvey(id));
      })
    );
  }

  createSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey> {
    return this.api.createServiceSurvey(payload).pipe(
      tap((survey) => this.cacheSurvey(survey))
    );
  }

  updateSurvey(id: number, payload: UpdateServiceSurveyPayload): Observable<ServiceSurvey> {
    return this.api.updateServiceSurvey(id, payload).pipe(
      tap((survey) => this.cacheSurvey(survey))
    );
  }

  deleteSurvey(id: number): Observable<void> {
    return this.api.deleteServiceSurvey(id).pipe(
      map(() => {
        this.removeCachedSurvey(id);
      })
    );
  }

  publishSurvey(id: number): Observable<ServiceSurvey> {
    return this.api.publishServiceSurvey(id).pipe(
      tap((survey) => this.cacheSurvey(survey))
    );
  }

  closeSurvey(id: number): Observable<ServiceSurvey> {
    return this.api.closeServiceSurvey(id).pipe(
      tap((survey) => this.cacheSurvey(survey))
    );
  }

  getQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]> {
    return this.api.getServiceSurveyQuestions(surveyId).pipe(
      catchError(() => of([]))
    );
  }

  createQuestion(surveyId: number, payload: CreateServiceQuestionPayload): Observable<ServiceSurveyQuestion> {
    return this.api.createServiceQuestion(surveyId, payload);
  }

  deleteQuestion(surveyId: number, questionId: number): Observable<void> {
    return this.api.deleteServiceQuestion(surveyId, questionId).pipe(map(() => {}));
  }

  getResponses(surveyId: number): Observable<ServiceSurveyResponse[]> {
    return this.api.getServiceSurveyResponses(surveyId).pipe(
      catchError(() => of([]))
    );
  }

  submitResponse(payload: SubmitServiceSurveyPayload): Observable<ServiceSurveyResponse> {
    return this.api.submitServiceSurveyResponse(payload);
  }

  getAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics> {
    return this.api.getServiceSurveyAnalytics(surveyId).pipe(
      catchError(() => of(this.emptyAnalytics(surveyId)))
    );
  }

  getDashboardSummary(): Observable<ServiceDashboardSummary> {
    return this.api.getServiceDashboardSummary().pipe(
      catchError(() => of(this.emptyDashboard()))
    );
  }

  private cacheSurvey(survey: ServiceSurvey): void {
    const cache = this.loadCache();
    cache[survey.id] = survey;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // localStorage unavailable
    }
  }

  private getCachedSurvey(id: number): ServiceSurvey | null {
    const cache = this.loadCache();
    return cache[id] ?? null;
  }

  private removeCachedSurvey(id: number): void {
    const cache = this.loadCache();
    delete cache[id];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // localStorage unavailable
    }
  }

  private loadCache(): Record<number, ServiceSurvey> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private emptyAnalytics(surveyId: number): ServiceSurveyAnalytics {
    return {
      surveyId,
      title: '',
      totalRespondents: 0,
      totalQuestions: 0,
      overallAverage: 0,
      responseCount: 0,
      categoryBreakdown: [],
      topQuestions: [],
    };
  }

  private emptySurvey(id: number): ServiceSurvey {
    return {
      id,
      title: '',
      description: '',
      targetRole: 'parent',
      status: 'draft',
      startDate: '',
      endDate: '',
      scoreScaleMin: 1,
      scoreScaleMax: 5,
      isAnonymous: false,
      createdById: 0,
      createdAt: '',
      updatedAt: '',
      questionCount: 0,
      responseCount: 0,
    };
  }

  private emptyDashboard(): ServiceDashboardSummary {
    return {
      activeSurveys: 0,
      totalResponses: 0,
      averageScore: 0,
      completionRate: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}
