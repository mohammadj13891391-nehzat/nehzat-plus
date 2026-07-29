import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { LearningPath, LearningPathTreeDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-path-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="path-detail-container" dir="rtl">
      <a class="back-link" routerLink="/learning">← بازگشت به مسیرها</a>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && path">
        <div class="path-header" [style.border-right-color]="path.path.color || 'var(--lp-primary, #4a148c)'">
          <div class="path-icon-large">{{ path.path.icon || '📚' }}</div>
          <div class="path-info">
            <h1>{{ path.path.title }}</h1>
            <p class="path-description">{{ path.path.description }}</p>
            <div class="path-details">
              <span>👤 {{ path.path.ageRange }}</span>
              <span>📊 {{ path.path.difficultyLevel }}</span>
              <span>⏱ {{ path.path.estimatedDurationDays }} روز</span>
            </div>
          </div>
        </div>

        <div class="enrollment-bar" *ngIf="!isEnrolled && path.path.id">
          <p>{{ enrollmentMsg }}</p>
          <button class="enroll-btn" (click)="enroll()" [disabled]="enrolling">شروع یادگیری</button>
        </div>
        <div class="enrollment-bar enrolled" *ngIf="isEnrolled">
          <p>✅ شما در این مسیر ثبت‌نام کرده‌اید</p>
          <span>پیشرفت: {{ userProgress || 0 }}%</span>
        </div>

        <div class="levels-section" *ngIf="path.levels">
          <h2>سطوح آموزشی</h2>
          <div class="level-card" *ngFor="let level of path.levels">
            <div class="level-header">
              <span class="level-badge">سطح {{ level.sortOrder }}</span>
              <h3>{{ level.title }}</h3>
            </div>
            <p class="level-desc">{{ level.description }}</p>
            <div class="level-meta">
              <span>⏱ {{ level.estimatedDurationDays }} روز</span>
              <span *ngIf="level.minAge || level.maxAge">👤 {{ level.minAge || '' }}-{{ level.maxAge || '' }} سال</span>
            </div>
            <div class="modules-list" *ngIf="level.modules">
              <h4>دروس:</h4>
              <div class="module-item" *ngFor="let mod of level.modules">
                <div class="module-info">
                  <span class="module-title">{{ mod.title }}</span>
                  <span class="module-lessons">{{ mod.lessons?.length || 0 }} درس</span>
                </div>
                <a class="module-link" [routerLink]="'/learning/lessons/' + (mod.lessons?.[0]?.id || mod.id)">مشاهده</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !path" class="error-state">
        <p>مسیر یادگیری مورد نظر یافت نشد.</p>
        <a routerLink="/learning" class="back-link">بازگشت</a>
      </div>
    </div>
  `,
  styles: [`
    .path-detail-container { padding: 20px; max-width: 900px; margin: 0 auto; direction: rtl; }
    .back-link { color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .path-header { display: flex; gap: 20px; background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-right: 5px solid var(--lp-primary, #4a148c); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .path-icon-large { font-size: 48px; }
    .path-info { flex: 1; }
    .path-info h1 { margin: 0 0 8px; font-size: 24px; color: var(--lp-text, #333); }
    .path-description { margin: 0 0 12px; font-size: 14px; color: var(--lp-text-muted, #666); line-height: 1.6; }
    .path-details { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: var(--lp-text-muted, #888); }
    .enrollment-bar { background: var(--lp-primary-light, #e8eaf6); border: 1px solid var(--lp-primary, #4a148c); border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
    .enrollment-bar.enrolled { background: #e8f5e9; border-color: #2e7d32; }
    .enrollment-bar p { margin: 0; font-size: 14px; }
    .enroll-btn { padding: 8px 24px; background: var(--lp-primary, #4a148c); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .enroll-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .levels-section h2 { font-size: 20px; margin: 24px 0 16px; color: var(--lp-text, #333); }
    .level-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 10px; padding: 16px; margin-bottom: 12px; }
    .level-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .level-badge { background: var(--lp-primary, #4a148c); color: #fff; padding: 2px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .level-header h3 { margin: 0; font-size: 16px; color: var(--lp-text, #333); }
    .level-desc { margin: 0 0 8px; font-size: 13px; color: var(--lp-text-muted, #666); }
    .level-meta { display: flex; gap: 12px; font-size: 12px; color: var(--lp-text-muted, #888); margin-bottom: 12px; }
    .modules-list { border-top: 1px solid var(--lp-border, #eee); padding-top: 12px; }
    .modules-list h4 { margin: 0 0 8px; font-size: 13px; color: var(--lp-text-muted, #888); }
    .module-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 6px; transition: background 0.15s; }
    .module-item:hover { background: var(--lp-surface-alt, #f5f5f5); }
    .module-info { display: flex; gap: 12px; align-items: baseline; }
    .module-title { font-size: 14px; color: var(--lp-text, #333); }
    .module-lessons { font-size: 12px; color: var(--lp-text-muted, #888); }
    .module-link { color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 13px; }
    .error-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class PathDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  path: LearningPathTreeDto | null = null;
  loading = true;
  isEnrolled = false;
  enrolling = false;
  enrollmentMsg = 'برای شروع یادگیری در این مسیر ثبت‌نام کنید';
  userProgress = 0;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.loadPath(id);
      this.checkEnrollment(id);
    } else {
      this.loading = false;
    }
  }

  private loadPath(id: number): void {
    this.loading = true;
    this.api.getLearningPathTree(id).subscribe({
      next: (data) => {
        this.path = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private checkEnrollment(pathId: number): void {
    this.api.getUserEnrollments().subscribe({
      next: (enrollments) => {
        const enrollment = enrollments.find(e => e.learningPathId === pathId);
        if (enrollment) {
          this.isEnrolled = true;
          if (enrollment.lessonProgress && this.path?.levels) {
            const total = this.path.levels.reduce((s, l) => s + (l.modules?.reduce((s2, m) => s2 + (m.lessons?.length || 0), 0) || 0), 0);
            const done = enrollment.lessonProgress.filter(lp => lp.status === 'completed').length;
            this.userProgress = total > 0 ? Math.round((done / total) * 100) : 0;
          }
        }
      },
      error: () => {}
    });
  }

  enroll(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (!id) return;
    this.enrolling = true;
    this.api.enrollUser({ learningPathId: id }).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.enrolling = false;
        this.enrollmentMsg = '✅ ثبت‌نام با موفقیت انجام شد';
      },
      error: () => {
        this.enrolling = false;
        this.enrollmentMsg = '❌ خطا در ثبت‌نام. مجدداً تلاش کنید.';
      }
    });
  }
}
