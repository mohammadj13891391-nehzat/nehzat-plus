import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import {
  HadithBook,
  HadithChapter,
  HadithItem,
  HadithReview,
  HadithReviewStats,
  SubmitHadithReviewPayload
} from '../../../core/models/lesson-planner.models';

export type {
  HadithBook,
  HadithChapter,
  HadithItem,
  HadithReview,
  HadithReviewStats,
  SubmitHadithReviewPayload
};

@Injectable({ providedIn: 'root' })
export class HadithService {
  private readonly api = inject(LESSON_PLANNER_API);

  getHadithBooks(): Observable<HadithBook[]> {
    return this.api.getHadithBooks();
  }

  getHadithBook(id: number): Observable<HadithBook> {
    return this.api.getHadithBookById(id);
  }

  getHadithChapters(bookId: number): Observable<HadithChapter[]> {
    return this.api.getHadithChapters(bookId);
  }

  getHadithChapter(id: number): Observable<HadithChapter> {
    return this.api.getHadithChapterById(id);
  }

  getHadithsByChapter(chapterId: number): Observable<HadithItem[]> {
    return this.api.getHadithsByChapter(chapterId);
  }

  getHadith(id: number): Observable<HadithItem> {
    return this.api.getHadithById(id);
  }

  getReviewStats(studentId: number): Observable<HadithReviewStats> {
    return this.api.getHadithReviewStats(studentId);
  }

  getPendingReviews(studentId: number, limit?: number): Observable<HadithItem[]> {
    return this.api.getPendingHadithReviews(studentId, limit);
  }

  submitReview(studentId: number, payload: SubmitHadithReviewPayload): Observable<HadithReview> {
    return this.api.submitHadithStudentReview(studentId, payload);
  }
}
