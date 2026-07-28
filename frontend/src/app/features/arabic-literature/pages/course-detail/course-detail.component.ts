import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { ArabicCourse, ArabicLesson, ArabicUserProgress } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-arabic-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="literature-container" dir="rtl">
      <a [routerLink]="['/arabic-literature/courses']" class="back-link">← بازگشت به دوره‌ها</a>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && course">
        <div class="course-header" [style.background]="'linear-gradient(135deg, ' + (course.color ?? '#4a148c') + ', ' + (course.color ?? '#6a1b9a') + '80')">
          <div class="course-icon-large" [style.background-color]="(course.color ?? '#4a148c') + '30'">
            {{ course.title.charAt(0) }}
          </div>
          <h1>{{ course.title }}</h1>
          <p class="course-level">{{ course.level === 'beginner' ? 'مبتدی' : course.level === 'intermediate' ? 'متوسط' : 'پیشرفته' }}</p>
          <p class="course-desc" *ngIf="course.description">{{ course.description }}</p>
          <div class="course-stats">
            <span>{{ lessons.length }} درس</span>
            <span *ngIf="course.ageRange">{{ course.ageRange }} سال</span>
          </div>
        </div>

        <div class="progress-summary" *ngIf="progress.length > 0">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" [style.width.%]="completionPercent"></div>
          </div>
          <span class="progress-text">{{ completedLessons }} از {{ lessons.length }} درس تکمیل شده</span>
        </div>

        <div class="lessons-section">
          <h2>دروس دوره</h2>
          <div class="lesson-list">
            <div class="lesson-card" *ngFor="let lesson of lessons; let i = index"
                 [class.completed]="isCompleted(lesson.id)"
                 [class.in-progress]="isInProgress(lesson.id)">
              <div class="lesson-number">{{ i + 1 }}</div>
              <div class="lesson-info">
                <h3 [routerLink]="['/arabic-literature/lessons', lesson.id]">{{ lesson.title }}</h3>
                <p *ngIf="lesson.description">{{ lesson.description }}</p>
                <div class="lesson-meta">
                  <span>{{ lesson.durationMinutes }} دقیقه</span>
                  <span *ngIf="lesson.objectives" class="objective-count">{{ getObjectiveCount(lesson.objectives) }} هدف</span>
                  <span *ngIf="getLessonStatus(lesson.id)" class="status-badge" [class]="getLessonStatus(lesson.id)">
                    {{ getLessonStatus(lesson.id) === 'completed' ? 'تکمیل شده' : 'در حال انجام' }}
                  </span>
                </div>
              </div>
              <a [routerLink]="['/arabic-literature/lessons', lesson.id]" class="lesson-action">
                {{ isCompleted(lesson.id) ? 'مرور' : 'شروع' }}
              </a>
            </div>
          </div>
          <div *ngIf="lessons.length === 0" class="empty-state">
            <p>هیچ درسی برای این دوره یافت نشد.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .literature-container { padding: 20px; max-width: 900px; margin: 0 auto; direction: rtl; }
    .back-link { display: inline-block; margin-bottom: 16px; color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .course-header { padding: 32px; border-radius: 12px; color: #fff; margin-bottom: 20px; text-align: center; }
    .course-icon-large { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; margin: 0 auto 12px; color: #fff; }
    .course-header h1 { margin: 0 0 8px; font-size: 24px; }
    .course-level { margin: 0 0 8px; opacity: 0.85; font-size: 13px; }
    .course-desc { margin: 0 0 12px; opacity: 0.9; font-size: 14px; line-height: 1.6; }
    .course-stats { display: flex; gap: 16px; justify-content: center; font-size: 13px; opacity: 0.85; }
    .progress-summary { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding: 16px; background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; }
    .progress-bar-track { flex: 1; height: 8px; background: var(--lp-border, #e0e0e0); border-radius: 4px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #4caf50, #8bc34a); border-radius: 4px; transition: width 0.3s; }
    .progress-text { font-size: 13px; color: var(--lp-text-muted, #888); white-space: nowrap; }
    .lessons-section h2 { margin: 0 0 16px; font-size: 18px; color: var(--lp-text, #333); }
    .lesson-list { display: flex; flex-direction: column; gap: 8px; }
    .lesson-card { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; transition: box-shadow 0.2s; }
    .lesson-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .lesson-card.completed { border-right: 4px solid #4caf50; }
    .lesson-card.in-progress { border-right: 4px solid #ff9800; }
    .lesson-number { width: 36px; height: 36px; border-radius: 50%; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0; }
    .lesson-card.completed .lesson-number { background: #e8f5e9; color: #2e7d32; }
    .lesson-card.in-progress .lesson-number { background: #fff3e0; color: #e65100; }
    .lesson-info { flex: 1; min-width: 0; }
    .lesson-info h3 { margin: 0 0 4px; font-size: 16px; color: var(--lp-text, #333); cursor: pointer; }
    .lesson-info h3:hover { color: var(--lp-primary, #4a148c); }
    .lesson-info p { margin: 0 0 8px; font-size: 13px; color: var(--lp-text-muted, #888); }
    .lesson-meta { display: flex; gap: 12px; font-size: 12px; color: var(--lp-text-muted, #888); flex-wrap: wrap; }
    .status-badge { padding: 1px 8px; border-radius: 10px; font-size: 11px; }
    .status-badge.completed { background: #e8f5e9; color: #2e7d32; }
    .status-badge.in_progress { background: #fff3e0; color: #e65100; }
    .lesson-action { padding: 8px 20px; border-radius: 8px; background: var(--lp-primary, #4a148c); color: #fff; text-decoration: none; font-size: 13px; font-weight: 500; white-space: nowrap; transition: opacity 0.2s; }
    .lesson-action:hover { opacity: 0.9; }
    .lesson-card.completed .lesson-action { background: #4caf50; }
    .lesson-card.in-progress .lesson-action { background: #ff9800; }
    .empty-state { text-align: center; padding: 40px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class CourseDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);

  course: ArabicCourse | null = null;
  lessons: ArabicLesson[] = [];
  progress: ArabicUserProgress[] = [];
  loading = true;

  get completedLessons(): number {
    return this.progress.filter(p => p.status === 'completed').length;
  }

  get completionPercent(): number {
    if (this.lessons.length === 0) return 0;
    return Math.round((this.completedLessons / this.lessons.length) * 100);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadData(id);
  }

  private loadData(courseId: number): void {
    this.loading = true;
    this.api.getArabicCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.lessons = course.lessons ?? [];
        this.loadProgress();
      },
      error: () => this.loading = false
    });
  }

  private loadProgress(): void {
    this.api.getArabicUserProgress().subscribe({
      next: (progress) => {
        this.progress = progress;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  isCompleted(lessonId: number): boolean {
    return this.progress.some(p => p.lessonId === lessonId && p.status === 'completed');
  }

  isInProgress(lessonId: number): boolean {
    return this.progress.some(p => p.lessonId === lessonId && p.status === 'in_progress');
  }

  getLessonStatus(lessonId: number): string {
    if (this.isCompleted(lessonId)) return 'completed';
    if (this.isInProgress(lessonId)) return 'in_progress';
    return '';
  }

  getObjectiveCount(objectives: string | undefined): number {
    if (!objectives) return 0;
    try {
      const parsed = JSON.parse(objectives);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch { return 0; }
  }
}
