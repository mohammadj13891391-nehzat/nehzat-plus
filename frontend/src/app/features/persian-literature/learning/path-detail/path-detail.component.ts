import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: LearningLesson[];
}

interface LearningLesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  completed?: boolean;
}

interface LearningLevel {
  id: string;
  title: string;
  description?: string;
  modules: LearningModule[];
}

interface LearningPathTreeDto {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  ageGroup: string;
  levels: LearningLevel[];
}

@Component({
  selector: 'app-path-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="path-detail" dir="rtl">
      <a class="back-link" routerLink="/learning">← بازگشت به مسیرهای یادگیری</a>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && path" class="path-content">
        <div class="path-header" [style.borderColor]="path.color">
          <div class="path-header-top">
            <span class="path-icon-large">{{ path.icon }}</span>
            <div class="path-header-info">
              <h1>{{ path.title }}</h1>
              <p>{{ path.description }}</p>
              <span class="age-badge">{{ path.ageGroup }}</span>
            </div>
          </div>
        </div>

        <div class="levels-container">
          <div *ngFor="let level of path.levels; let levelIdx = index" class="level-section">
            <div class="level-header" (click)="toggleLevel(levelIdx)">
              <div class="level-title-row">
                <span class="level-number">سطح {{ levelIdx + 1 }}</span>
                <h2>{{ level.title }}</h2>
              </div>
              <span class="toggle-icon">{{ expandedLevels[levelIdx] ? '−' : '+' }}</span>
            </div>

            <div *ngIf="expandedLevels[levelIdx]" class="modules-container">
              <div *ngFor="let module of level.modules; let modIdx = index" class="module-card">
                <div class="module-header" (click)="toggleModule(levelIdx + '-' + modIdx)">
                  <h3>{{ module.title }}</h3>
                  <p class="module-description">{{ module.description }}</p>
                  <span class="toggle-icon">{{ expandedModules[levelIdx + '-' + modIdx] ? '−' : '+' }}</span>
                </div>

                <div *ngIf="expandedModules[levelIdx + '-' + modIdx]" class="lessons-list">
                  <div
                    *ngFor="let lesson of module.lessons"
                    class="lesson-item"
                    [class.completed]="lesson.completed"
                    [routerLink]="['/learning', path.id, 'lessons', lesson.id]"
                  >
                    <div class="lesson-status">
                      <span *ngIf="lesson.completed" class="check-mark">✓</span>
                      <span *ngIf="!lesson.completed" class="lesson-number">{{ modIdx + 1 }}.{{ module.lessons.indexOf(lesson) + 1 }}</span>
                    </div>
                    <div class="lesson-info">
                      <span class="lesson-title">{{ lesson.title }}</span>
                      <span *ngIf="lesson.duration" class="lesson-duration">{{ lesson.duration }}</span>
                    </div>
                    <span class="lesson-arrow">←</span>
                  </div>
                </div>
              </div>

              <div *ngIf="level.modules.length === 0" class="empty-modules">
                <p>هنوز ماژولی برای این سطح تعریف نشده است.</p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="path.levels.length === 0" class="empty-state">
          <p>هنوز سطحی برای این مسیر تعریف نشده است.</p>
        </div>
      </div>

      <div *ngIf="!loading && !path" class="empty-state">
        <p>مسیر مورد نظر یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .path-detail { padding: 20px; max-width: 900px; margin: 0 auto; }
    .back-link { display: inline-block; margin-bottom: 20px; color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .loading { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .path-content { background: var(--lp-surface, #fff); border-radius: 12px; border: 1px solid var(--lp-border, #e0e0e0); overflow: hidden; }
    .path-header { padding: 24px; border-bottom: 1px solid var(--lp-border, #e0e0e0); border-top: 4px solid var(--lp-primary, #4a148c); }
    .path-header-top { display: flex; align-items: center; gap: 20px; }
    .path-icon-large { font-size: 3rem; }
    .path-header-info h1 { margin: 0 0 8px; font-size: 24px; color: var(--lp-text, #333); }
    .path-header-info p { margin: 0 0 12px; color: var(--lp-text-muted, #888); font-size: 14px; line-height: 1.6; }
    .age-badge { display: inline-block; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .levels-container { padding: 16px; }
    .level-section { margin-bottom: 12px; border: 1px solid var(--lp-border, #e0e0e0); border-radius: 10px; overflow: hidden; }
    .level-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; background: var(--lp-surface-hover, #fafafa); transition: background 0.2s; }
    .level-header:hover { background: var(--lp-surface-hover, #f0f0f0); }
    .level-title-row { display: flex; align-items: center; gap: 12px; }
    .level-number { font-size: 12px; font-weight: 600; color: var(--lp-primary, #4a148c); background: var(--lp-primary-light, #e1bee7); padding: 2px 10px; border-radius: 12px; }
    .level-title-row h2 { margin: 0; font-size: 16px; color: var(--lp-text, #333); }
    .toggle-icon { font-size: 20px; color: var(--lp-text-muted, #888); user-select: none; }
    .modules-container { padding: 12px 16px 16px; }
    .module-card { margin-bottom: 12px; border: 1px solid var(--lp-border, #e0e0e0); border-radius: 8px; overflow: hidden; }
    .module-header { padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; background: var(--lp-surface-hover, #fafafa); }
    .module-header h3 { margin: 0 0 4px; font-size: 15px; color: var(--lp-text, #333); width: 100%; }
    .module-description { margin: 0; font-size: 12px; color: var(--lp-text-muted, #888); width: 100%; }
    .lessons-list { padding: 8px 12px; }
    .lesson-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .lesson-item:hover { background: var(--lp-surface-hover, #f5f5f5); }
    .lesson-item.completed { opacity: 0.7; }
    .lesson-status { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
    .check-mark { background: #4caf50; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .lesson-number { background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .lesson-info { flex: 1; display: flex; align-items: center; gap: 8px; }
    .lesson-title { font-size: 14px; color: var(--lp-text, #333); }
    .lesson-duration { font-size: 11px; color: var(--lp-text-muted, #888); }
    .lesson-arrow { color: var(--lp-text-muted, #888); font-size: 14px; }
    .empty-modules, .empty-state { text-align: center; padding: 40px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class PathDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  path: LearningPathTreeDto | null = null;
  loading = true;
  expandedLevels: boolean[] = [];
  expandedModules: Record<string, boolean> = {};

  ngOnInit(): void {
    const pathId = this.route.snapshot.params['pathId'];
    if (pathId) {
      this.loadPath(pathId);
    }
  }

  private loadPath(pathId: string): void {
    this.loading = true;
    this.api.getLearningPathTree(Number(pathId)).subscribe({
      next: (data) => {
        this.path = {
          id: String(data.path.id),
          title: data.path.title,
          description: data.path.description || '',
          icon: data.path.icon || '',
          color: data.path.color || '',
          ageGroup: data.path.ageGroup || '',
          levels: (data.levels || []).map(l => ({
            id: String(l.id),
            title: l.title,
            description: l.description || '',
            modules: (l.modules || []).map(m => ({
              id: String(m.id),
              title: m.title,
              description: m.description || '',
              lessons: (m.lessons || []).map(sl => ({
                id: String(sl.id),
                title: sl.title,
                description: sl.description,
                duration: String(sl.estimatedMinutes || 0) + ' دقیقه',
                completed: false
              }))
            }))
          }))
        };
        this.expandedLevels = (this.path.levels || []).map(() => false);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleLevel(index: number): void {
    this.expandedLevels[index] = !this.expandedLevels[index];
  }

  toggleModule(key: string): void {
    this.expandedModules[key] = !this.expandedModules[key];
  }
}
