import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Surah {
  id: number;
  number: string;
  name: string;
  translatedName: string;
  revelationPlace: string;
  revelationOrder: number;
  totalAyahs: number;
  type: string;
  bismillah: string;
  hizbBegin: number;
  hizbEnd: number;
  juzBegin: number;
  juzEnd: number;
  ruqyah: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  ayahs?: Ayah[];
}

export interface Ayah {
  id: number;
  surahId: number;
  verseNumber: number;
  text: string;
  translation: string;
  transliteration: string;
  footnote: string;
  ruku: string;
  sajda: string;
  ayaNumber: number;
  juz: string;
  hizbQuarter: string;
  createdAt: string;
  updatedAt: string;
}

export interface TajweedRule {
  id: number;
  ruleCode: string;
  name: string;
  description: string;
  exampleText: string;
  ruleLevel: number;
  affectedRecitationType: string;
  guidelines: string;
  surahId: number;
  ayahNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecitationLevel {
  id: number;
  levelNumber: number;
  name: string;
  description: string;
  criteria: string;
  colorCode: string;
  pointsRequired: number;
  estimatedWeeks: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuranCurriculum {
  id: number;
  title: string;
  description: string;
  language: string;
  startSurah: number;
  endSurah: number;
  totalAyahs: number;
  estimatedDays: number;
  difficultyLevel: string;
  learningObjectives: string;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuranStudentProgress {
  id: number;
  studentId: number;
  surahId: number;
  ayahNumber: number;
  surahProgress: number;
  totalSurahs: number;
  percentage: number;
  progressDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  surah?: Surah;
}

@Injectable({ providedIn: 'root' })
export class QuranService {
  private apiUrl = `${environment.apiBaseUrl}/quran`;

  constructor(private http: HttpClient) {}

  // Surah
  getSurahs(): Observable<Surah[]> {
    return this.http.get<Surah[]>(`${this.apiUrl}/surahs`);
  }

  getSurah(id: number): Observable<Surah> {
    return this.http.get<Surah>(`${this.apiUrl}/surahs/${id}`);
  }

  createSurah(surah: Partial<Surah>): Observable<Surah> {
    return this.http.post<Surah>(`${this.apiUrl}/surahs`, surah);
  }

  updateSurah(id: number, surah: Partial<Surah>): Observable<Surah> {
    return this.http.put<Surah>(`${this.apiUrl}/surahs/${id}`, surah);
  }

  deleteSurah(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/surahs/${id}`);
  }

  // Ayah
  getAyahs(params?: { surahId?: number }): Observable<Ayah[]> {
    let httpParams = new HttpParams();
    if (params?.surahId) httpParams = httpParams.set('surahId', params.surahId);
    return this.http.get<Ayah[]>(`${this.apiUrl}/ayahs`, { params: httpParams });
  }

  getAyahsBySurah(surahId: number): Observable<Ayah[]> {
    return this.http.get<Ayah[]>(`${this.apiUrl}/ayahs/surah/${surahId}`);
  }

  getAyah(id: number): Observable<Ayah> {
    return this.http.get<Ayah>(`${this.apiUrl}/ayahs/${id}`);
  }

  createAyah(ayah: Partial<Ayah>): Observable<Ayah> {
    return this.http.post<Ayah>(`${this.apiUrl}/ayahs`, ayah);
  }

  updateAyah(id: number, ayah: Partial<Ayah>): Observable<Ayah> {
    return this.http.put<Ayah>(`${this.apiUrl}/ayahs/${id}`, ayah);
  }

  deleteAyah(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ayahs/${id}`);
  }

  // Tajweed Rules
  getTajweedRules(): Observable<TajweedRule[]> {
    return this.http.get<TajweedRule[]>(`${this.apiUrl}/tajweed-rules`);
  }

  getTajweedRule(id: number): Observable<TajweedRule> {
    return this.http.get<TajweedRule>(`${this.apiUrl}/tajweed-rules/${id}`);
  }

  createTajweedRule(rule: Partial<TajweedRule>): Observable<TajweedRule> {
    return this.http.post<TajweedRule>(`${this.apiUrl}/tajweed-rules`, rule);
  }

  updateTajweedRule(id: number, rule: Partial<TajweedRule>): Observable<TajweedRule> {
    return this.http.put<TajweedRule>(`${this.apiUrl}/tajweed-rules/${id}`, rule);
  }

  deleteTajweedRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tajweed-rules/${id}`);
  }

  // Recitation Levels
  getRecitationLevels(): Observable<RecitationLevel[]> {
    return this.http.get<RecitationLevel[]>(`${this.apiUrl}/recitation-levels`);
  }

  getRecitationLevel(id: number): Observable<RecitationLevel> {
    return this.http.get<RecitationLevel>(`${this.apiUrl}/recitation-levels/${id}`);
  }

  createRecitationLevel(level: Partial<RecitationLevel>): Observable<RecitationLevel> {
    return this.http.post<RecitationLevel>(`${this.apiUrl}/recitation-levels`, level);
  }

  updateRecitationLevel(id: number, level: Partial<RecitationLevel>): Observable<RecitationLevel> {
    return this.http.put<RecitationLevel>(`${this.apiUrl}/recitation-levels/${id}`, level);
  }

  deleteRecitationLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recitation-levels/${id}`);
  }

  // Quran Curriculum
  getQuranCurricula(): Observable<QuranCurriculum[]> {
    return this.http.get<QuranCurriculum[]>(`${this.apiUrl}/curricula`);
  }

  getQuranCurriculum(id: number): Observable<QuranCurriculum> {
    return this.http.get<QuranCurriculum>(`${this.apiUrl}/curricula/${id}`);
  }

  createQuranCurriculum(curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
    return this.http.post<QuranCurriculum>(`${this.apiUrl}/curricula`, curriculum);
  }

  updateQuranCurriculum(id: number, curriculum: Partial<QuranCurriculum>): Observable<QuranCurriculum> {
    return this.http.put<QuranCurriculum>(`${this.apiUrl}/curricula/${id}`, curriculum);
  }

  deleteQuranCurriculum(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/curricula/${id}`);
  }

  // Student Progress
  getStudentProgress(studentId: number): Observable<QuranStudentProgress[]> {
    return this.http.get<QuranStudentProgress[]>(`${this.apiUrl}/progress/student/${studentId}`);
  }

  getProgress(id: number): Observable<QuranStudentProgress> {
    return this.http.get<QuranStudentProgress>(`${this.apiUrl}/progress/${id}`);
  }

  createProgress(progress: Partial<QuranStudentProgress>): Observable<QuranStudentProgress> {
    return this.http.post<QuranStudentProgress>(`${this.apiUrl}/progress`, progress);
  }
}