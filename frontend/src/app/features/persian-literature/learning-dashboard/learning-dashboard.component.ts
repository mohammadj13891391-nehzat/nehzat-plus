import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { LearningPath, UserEnrollment } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-learning-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container" dir="rtl">
      <header class="dashboard-header">
        <h1>📚 سامانه یادگیری ادبیات فارسی</h1>
        <p class="subtitle">مسیرهای یادگیری گام به گام از ۵ تا ۵۰ سال</p>
      </header>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{paths.length}}</span>
          <span class="stat-label">مسیر یادگیری</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{enrollments.length}}</span>
          <span class="stat-label">ثبت‌نام فعال</span>
        </div>
      </div>

      <section class="paths-section">
        <h2>مسیرهای یادگیری</h2>
        <div class="paths-grid">
          <a *ngFor="let path of paths"
             [routerLink]="['/persian-literature/learning', path.id]"
             class="path-card"
             [style.borderRightColor]="path.color || 'var(--lp-gold)'">
            <div class="path-icon">{{path.icon || '📖'}}</div>
            <div class="path-info">
              <h3>{{path.title}}</h3>
              <p>{{path.description || ''}}</p>
              <span class="age-badge">{{path.ageGroup || ''}}</span>
            </div>
          </a>
        </div>
      </section>

      <section *ngIf="enrollments.length > 0" class="progress-section">
        <h2>ادامه یادگیری</h2>
        <div class="progress-list">
          <div *ngFor="let enrollment of enrollments" class="progress-card">
            <div class="progress-header">
              <span>{{ enrollment.learningPath?.title || 'مسیر یادگیری' }}</span>
              <span class="progress-status" [class.completed]="enrollment.isCompleted">{{ enrollment.isCompleted ? 'تکمیل شده' : 'در حال یادگیری' }}</span>
            </div>
            <div *ngIf="enrollment.xpEarned" class="xp-badge">{{ enrollment.xpEarned }} XP</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1200px; margin: 0 auto; padding: 24px; direction: rtl; }
    .dashboard-header { text-align: center; margin-bottom: 32px; }
    .dashboard-header h1 { font-size: 28px; color: var(--lp-gold, #c8a951); margin-bottom: 8px; }
    .subtitle { color: var(--lp-muted, #888); font-size: 14px; }
    .stats-row { display: flex; gap: 16px; margin-bottom: 32px; justify-content: center; flex-wrap: wrap; }
    .stat-card { background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 20px 32px; text-align: center; min-width: 120px; }
    .stat-value { display: block; font-size: 32px; font-weight: 700; color: var(--lp-gold, #c8a951); }
    .stat-label { font-size: 12px; color: var(--lp-muted, #888); margin-top: 4px; }
    .paths-section { margin-bottom: 32px; }
    .paths-section h2 { font-size: 20px; margin-bottom: 16px; }
    .paths-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .path-card { display: flex; flex-direction: column; gap: 12px; background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-right: 4px solid var(--lp-gold, #c8a951); border-radius: 12px; padding: 20px; cursor: pointer; text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s; }
    .path-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .path-icon { font-size: 40px; }
    .path-info h3 { font-size: 18px; margin: 0 0 4px; }
    .path-info p { font-size: 13px; color: var(--lp-muted, #888); margin: 0; }
    .age-badge { display: inline-block; background: var(--lp-gold, #c8a951); color: #000; font-size: 11px; padding: 2px 10px; border-radius: 12px; margin-top: 8px; font-weight: 600; }
    .path-levels { display: flex; gap: 6px; }
    .level-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lp-border, #2a2a4a); }
    .progress-section h2 { font-size: 20px; margin-bottom: 16px; }
    .progress-list { display: flex; flex-direction: column; gap: 12px; }
    .progress-card { display: flex; align-items: center; justify-content: space-between; background: var(--lp-card-bg, #1a1a2e); border: 1px solid var(--lp-border, #2a2a4a); border-radius: 12px; padding: 16px 20px; }
    .progress-header { display: flex; align-items: center; gap: 12px; }
    .progress-status { font-size: 12px; padding: 2px 10px; border-radius: 12px; background: var(--lp-border, #2a2a4a); }
    .progress-status.completed { background: #22c55e; color: #000; }
    .xp-badge { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 700; font-size: 13px; padding: 4px 12px; border-radius: 8px; }
  `]
})
export class LearningDashboardComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);

  paths: LearningPath[] = [];
  enrollments: UserEnrollment[] = [];

  stats = { totalPaths: 0, totalLevels: 0, totalModules: 0, totalLessons: 0 };

  ngOnInit(): void {
    this.api.getLearningPaths().subscribe({
      next: (paths) => {
        this.paths = paths;
        let levels = 0, modules = 0, lessons = 0;
        for (const p of paths) {
          levels += p.levelCount || 0;
          modules += p.moduleCount || 0;
          lessons += p.lessonCount || 0;
        }
        this.stats = {
          totalPaths: paths.length,
          totalLevels: levels,
          totalModules: modules,
          totalLessons: lessons
        };
      }
    });
    this.api.getUserEnrollments(0).subscribe({
      next: (enrollments) => this.enrollments = enrollments
    });
  }

  getLevelRange(path: LearningPath): number[] {
    return new Array(path.levelCount || 0);
  }
}
