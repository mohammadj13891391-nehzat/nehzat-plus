import { Injectable, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import {
  Surah,
  Ayah,
  TajweedRule,
  RecitationLevel,
  QuranCurriculum,
  QuranStudentProgress
} from '../../../core/models/lesson-planner.models';

export type {
  Surah,
  Ayah,
  TajweedRule,
  RecitationLevel,
  QuranCurriculum,
  QuranStudentProgress
};

@Injectable({ providedIn: 'root' })
export class QuranService {
  private readonly api = inject(LESSON_PLANNER_API);

  getSurahs(): Observable<Surah[]> {
    return this.api.getSurahs();
  }

  getSurah(id: number): Observable<Surah> {
    return this.api.getSurahById(id);
  }

  getAyahs(surahId?: number): Observable<Ayah[]> {
    if (surahId) {
      return this.api.getAyahs(surahId);
    }
    return this.api.getSurahs().pipe(
      switchMap(surahs => {
        if (surahs.length === 0) return of([] as Ayah[]);
        const allAyahs = surahs.map(s => this.api.getAyahs(s.id));
        return forkJoin(allAyahs).pipe(map(arrays => arrays.flat()));
      })
    );
  }

  getAyah(id: number): Observable<Ayah> {
    return this.api.getAyahById(id);
  }

  searchAyahs(query: string): Observable<Ayah[]> {
    return this.api.searchAyahs(query);
  }

  getTajweedRules(): Observable<TajweedRule[]> {
    return this.api.getTajweedRules();
  }

  getRecitationLevels(): Observable<RecitationLevel[]> {
    return this.api.getRecitationLevels();
  }

  getQuranCurricula(): Observable<QuranCurriculum[]> {
    return this.api.getQuranCurricula();
  }

  getQuranCurriculum(id: number): Observable<QuranCurriculum> {
    return this.api.getQuranCurriculumById(id);
  }

  createQuranCurriculum(curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
    return this.api.createQuranCurriculum(curriculum);
  }

  updateQuranCurriculum(id: number, curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
    return this.api.updateQuranCurriculum(id, curriculum);
  }

  deleteQuranCurriculum(id: number): Observable<void> {
    return this.api.deleteQuranCurriculum(id);
  }

  getQuranStudentProgress(studentId: number): Observable<QuranStudentProgress> {
    return this.api.getQuranStudentProgress(studentId);
  }

  getQuranLessonPlans(): Observable<any[]> {
    return this.api.getQuranLessonPlans();
  }

  getQuranLessonPlanById(id: number): Observable<any> {
    return this.api.getQuranLessonPlanById(id);
  }

  createQuranLessonPlan(payload: any): Observable<any> {
    return this.api.createQuranLessonPlan(payload);
  }

  updateQuranLessonPlan(id: number, payload: any): Observable<any> {
    return this.api.updateQuranLessonPlan(id, payload);
  }

  deleteQuranLessonPlan(id: number): Observable<void> {
    return this.api.deleteQuranLessonPlan(id);
  }

  getQuranDashboardStats(): Observable<any> {
    return this.api.getQuranDashboardStats();
  }
}
