import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { LearningPathTreeDto, UserEnrollment } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-path-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="path-container" dir="rtl">
      <a [routerLink]="['/persian-literature/learning']" class="back-link">← بازگشت به مسیرها</a>

      <div *ngIf="data" class="path-detail">
        <header class="path-header">
          <div class="path-icon">{{data.path.icon || '📖'}}</div>
          <div>
            <h1>{{data.path.title}}</h1>
            <p>{{data.path.description || ''}}</p>
            <span class="age-badge">{{data.path.ageGroup || ''}}</span>
          </div>
        </header>

        <section class="levels-section">
          <h2>سطوح یادگیری</h2>
          <div *ngFor="let level of data.levels" class="level-card">
            <div class="level-header">
              <h3>{{level.title}}</h3>
              <span class="level-number">سطح {{level.levelNumber}}</span>
            </div>
            <p *ngIf="level.description" class="level-desc">{{level.description}}</p>
          </div>
        </section>

        <section *ngIf="enrollment" class="enrollment-section">
          <div class="enrollment-card">
            <div class="enrollment-info">
              <span>وضعیت: {{ enrollment.isCompleted ? 'تکمیل شده' : 'در حال یادگیری' }}</span>
              <span *ngIf="enrollment.xpEarned" class="xp">{{ enrollment.xpEarned }} XP</span>
            </div>
            <div *ngIf="enrollment.currentLevelId" class="current-level">
              سطح فعلی: سطح {{ enrollment.currentLevelId }}
            </div>
          </div>
        </section>
      </div>

      <div *ngIf="!data && !loadingError" class="loading">در حال بارگذاری...</div>
      <div *ngIf="loadingError" class="error">خطا در بارگذاری مسیر یادگیری</div>
    </div>
  `,
  styles: [`
    .path-container { max-width: 800px; margin: 0 auto; padding: 24px; direction: rtl; }
    .back-link { color: var(--lp-gold, #c8a951); text-decoration: none; font-size: 14px; margin-bottom: 20px; display: inline-block; }
    .back-link:hover { text-decoration: underline; }
    .path-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 16px; padding: 24px; }
    .path-icon { font-size: 56px; }
    .path-header h1 { font-size: 24px; margin: 0 0 8px; }
    .path-header p { font-size: 14px; color: var(--lp-muted, #888); margin: 0; }
    .age-badge { display: inline-block; background: var(--lp-gold, #c8a951); color: #000; font-size: 12px; padding: 3px 14px; border-radius: 14px; margin-top: 8px; font-weight: 600; }
    .levels-section { margin-bottom: 32px; }
    .levels-section h2 { font-size: 20px; margin-bottom: 16px; }
    .level-card { background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; }
    .level-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .level-header h3 { font-size: 16px; margin: 0; }
    .level-number { font-size: 12px; background: var(--lp-gold, #c8a951); color: #000; padding: 2px 10px; border-radius: 10px; font-weight: 600; }
    .level-desc { font-size: 13px; color: var(--lp-muted, #888); margin: 4px 0 0; }
    .enrollment-section { margin-bottom: 32px; }
    .enrollment-card { background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 16px 20px; }
    .enrollment-info { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
    .xp { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 700; font-size: 13px; padding: 4px 12px; border-radius: 8px; }
    .current-level { font-size: 13px; color: var(--lp-muted, #888); margin-top: 8px; }
    .loading, .error { text-align: center; padding: 40px; font-size: 16px; }
    .error { color: #ef4444; }
  `]
})
export class PathDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);

  data: LearningPathTreeDto | null = null;
  enrollment: UserEnrollment | null = null;
  loadingError = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.loadingError = true; return; }

    this.api.getLearningPathTree(id).subscribe({
      next: (result) => {
        this.data = result;
        this.api.getUserEnrollments(0).subscribe({
          next: (enrollments) => {
            this.enrollment = enrollments.find(e => e.learningPathId === id) || null;
          }
        });
      },
      error: () => this.loadingError = true
    });
  }
}
