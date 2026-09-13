import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PHASE_CONFIG } from '../../../core/tokens/phase.token';
import { Router, RouterModule } from '@angular/router';
import {
  LearningPathService,
  LearningPathDto,
  LearningPathTreeDto,
} from '../services/learning-path.service';

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="learning-path" [class.child-theme]="phaseConfig().isChild"
                               [class.teen-theme]="!phaseConfig().isChild">

      <div class="header">
        <h1>{{ phaseConfig().isChild ? '🌟 مسیر یادگیری من' : '📚 مسیرهای یادگیری' }}</h1>
        <p class="subtitle">
          {{ phaseConfig().isChild ? 'با بازی و سرگرمی یاد بگیر!' : 'دوره‌های تخصصی' }}
        </p>
      </div>

      @if (paths(); as paths) {
        <div class="paths-grid">
          @for (p of paths; track p.id) {
            <div class="path-card" (click)="selectPath(p)"
                 [style.--card-color]="p.colorHex ?? '#667eea'">
              <div class="card-icon">{{ p.iconUrl ? '' : '📖' }}</div>
              <h3>{{ p.title }}</h3>
              <p>{{ p.description }}</p>
              <span class="age-range">{{ p.ageRangeMin }}–{{ p.ageRangeMax }} سال</span>
            </div>
          }
        </div>
      } @else {
        <div class="loading">در حال بارگذاری مسیرها...</div>
      }

      @if (selectedTree(); as tree) {
        <div class="tree-view">
          <button class="back-btn" (click)="selectedTree.set(null)">
            ← بازگشت به لیست
          </button>
          <h2>{{ tree.path.title }}</h2>

          @for (level of tree.levels; track level.id) {
            <details class="level-card" open>
              <summary>
                <span class="level-num">مرحله {{ level.sortOrder }}</span>
                <strong>{{ level.title }}</strong>
              </summary>
              <div class="modules">
                @for (mod of level.modules; track mod.id) {
                  <details class="module-card">
                    <summary>
                      <span>📂 {{ mod.title }}</span>
                    </summary>
                    <div class="lessons">
                      @for (les of mod.lessons; track les.id) {
                        <div class="lesson-item" (click)="goToLesson(les.id)">
                          <span>{{ les.title }}</span>
                          <span class="duration">{{ les.estimatedMinutes }} دق</span>
                        </div>
                      }
                    </div>
                  </details>
                }
              </div>
            </details>
          }
        </div>
      }
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .learning-path { padding: 1.5rem; direction: rtl; }
    .child-theme { --primary: #FF6B6B; --bg: #FFF0F0; }
    .teen-theme  { --primary: #4ECDC4; --bg: #F0FFFE; }
    .header { text-align: center; margin-bottom: 2rem; }
    .paths-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
    .path-card { background: var(--bg); border-radius: 12px; padding: 1.5rem; cursor: pointer;
                  border-left: 4px solid var(--card-color); transition: transform 0.2s; }
    .path-card:hover { transform: translateY(-3px); }
    .age-range { display: inline-block; background: var(--primary); color: white;
                  border-radius: 20px; padding: 0.2rem 0.8rem; font-size: 0.85rem; }
    .tree-view { margin-top: 2rem; }
    .level-card { background: white; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;
                   border: 1px solid #eee; }
    .level-num { background: var(--primary); color: white; border-radius: 50%;
                    width: 30px; height: 30px; display: inline-flex; align-items: center;
                    justify-content: center; margin-left: 0.5rem; }
    .modules { padding-right: 1.5rem; }
    .module-card { background: #f9f9f9; border-radius: 8px; padding: 0.8rem; margin: 0.5rem 0; }
    .lessons { margin-top: 0.5rem; }
    .lesson-item { display: flex; justify-content: space-between; padding: 0.6rem 0.8rem;
                     border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s;
                     border-radius: 6px; margin: 0.2rem 0; }
    .lesson-item:hover { background: color-mix(in srgb, var(--primary) 10%, transparent); }
    .duration { color: #999; font-size: 0.85rem; }
    .back-btn { background: none; border: none; color: var(--primary); cursor: pointer;
                  font-size: 1rem; margin-bottom: 1rem; }
    .loading { text-align: center; color: #999; padding: 3rem; }
  `]
})
export class LearningPathComponent {
  private service = inject(LearningPathService);
  private router = inject(Router);
  protected phaseConfig = inject(PHASE_CONFIG);

  protected paths = toSignal(this.service.getLearningPaths());
  protected selectedTree = signal<LearningPathTreeDto | null>(null);

  selectPath(path: LearningPathDto): void {
    this.service.getLearningPathTree(path.id).subscribe({
      next: (tree) => this.selectedTree.set(tree),
    });
  }

  goToLesson(lessonId: number): void {
    this.router.navigate(['/dashboard/learning-path/lesson', lessonId]);
  }
}
