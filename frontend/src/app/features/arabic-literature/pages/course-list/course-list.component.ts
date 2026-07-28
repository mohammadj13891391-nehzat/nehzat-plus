import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { ArabicCourse } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-arabic-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="literature-container" dir="rtl">
      <div class="header-card">
        <h1>دوره‌های آموزش ادبیات عرب</h1>
        <p class="subtitle">دوره‌های منظم آموزشی برای یادگیری گام‌به‌گام ادبیات عرب</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading" class="course-grid">
        <div class="course-card" *ngFor="let course of courses" [routerLink]="['/arabic-literature/courses', course.id]">
          <div class="course-icon" [style.background-color]="(course.color ?? '#4a148c') + '20'" [style.color]="course.color ?? '#4a148c'">
            {{ course.title.charAt(0) }}
          </div>
          <h3>{{ course.title }}</h3>
          <p class="course-desc" *ngIf="course.description">{{ course.description }}</p>
          <div class="course-meta">
            <span class="level-badge" [class]="'level-' + course.level">
              {{ course.level === 'beginner' ? 'مبتدی' : course.level === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
            </span>
            <span *ngIf="course.ageRange" class="age-range">{{ course.ageRange }} سال</span>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && courses.length === 0" class="empty-state">
        <p>هیچ دوره‌ای یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .literature-container { padding: 20px; max-width: 1000px; margin: 0 auto; direction: rtl; }
    .header-card { margin-bottom: 24px; padding: 24px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-primary-dark, #6a1b9a)); color: #fff; border-radius: 12px; text-align: center; }
    .header-card h1 { margin: 0 0 8px; font-size: 28px; }
    .subtitle { margin: 0; opacity: 0.85; font-size: 14px; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .course-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; padding: 20px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .course-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .course-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; margin-bottom: 12px; }
    .course-card h3 { margin: 0 0 8px; font-size: 18px; color: var(--lp-text, #333); }
    .course-desc { margin: 0 0 12px; font-size: 13px; color: var(--lp-text-muted, #888); line-height: 1.5; }
    .course-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .level-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .level-beginner { background: #e8f5e9; color: #2e7d32; }
    .level-intermediate { background: #fff3e0; color: #e65100; }
    .level-advanced { background: #fce4ec; color: #c62828; }
    .age-range { font-size: 12px; color: var(--lp-text-muted, #888); }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class CourseListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  courses: ArabicCourse[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.loading = true;
    this.api.getArabicCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
