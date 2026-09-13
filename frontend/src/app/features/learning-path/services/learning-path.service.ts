import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyLesson, LessonContentBlock, PersLitQuiz } from '../../../core/models/lesson-planner.models';
import { resolveApiBaseUrl } from '../../../core/services/api-url.util';

export interface LearningPathDto {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  ageRangeMin: number;
  ageRangeMax: number;
  iconUrl: string | null;
  colorHex: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface StudyLessonSummaryDto {
  id: number;
  title: string;
  estimatedMinutes: number;
}

export interface StudyModuleTreeDto {
  id: number;
  title: string;
  sortOrder: number;
  lessons: StudyLessonSummaryDto[];
}

export interface LearningLevelTreeDto {
  id: number;
  title: string;
  sortOrder: number;
  modules: StudyModuleTreeDto[];
}

export interface LearningPathTreeDto {
  path: LearningPathDto;
  levels: LearningLevelTreeDto[];
}

export interface StudyLessonDetailDto extends StudyLesson {
  contentBlocks?: LessonContentBlock[];
  quizzes?: PersLitQuiz[];
}

@Injectable({ providedIn: 'root' })
export class LearningPathService {
  private http = inject(HttpClient);
  private readonly baseUrl = resolveApiBaseUrl() + '/api/learning';

  getLearningPaths(): Observable<LearningPathDto[]> {
    return this.http.get<LearningPathDto[]>(`${this.baseUrl}/paths`);
  }

  getLearningPathTree(pathId: number): Observable<LearningPathTreeDto> {
    return this.http.get<LearningPathTreeDto>(`${this.baseUrl}/paths/${pathId}/tree`);
  }

  getStudyLesson(lessonId: number): Observable<StudyLessonDetailDto> {
    return this.http.get<StudyLessonDetailDto>(`${this.baseUrl}/lessons/${lessonId}`);
  }
}
