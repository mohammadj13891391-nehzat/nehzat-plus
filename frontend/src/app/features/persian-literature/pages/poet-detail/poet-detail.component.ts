import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { PersianLiteraturePoet, PersianLiteraturePoem } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-poet-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="literature-container" dir="rtl">
      <a class="back-link" routerLink="/persian-literature/poets">← بازگشت به فهرست شاعران</a>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && poet" class="poet-detail">
        <div class="poet-header">
          <div class="poet-avatar-large">{{ poet.name.charAt(0) }}</div>
          <div class="poet-header-info">
            <h1>{{ poet.name }}</h1>
            <p class="pen-name" *ngIf="poet.penName">متخلص به {{ poet.penName }}</p>
            <div class="poet-meta">
              <span *ngIf="poet.era">دوره: {{ poet.era }}</span>
              <span *ngIf="poet.century">قرن {{ poet.century }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-row" *ngIf="poet.birthDate">
            <span class="info-label">تولد</span>
            <span>{{ poet.birthDate }} {{ poet.birthPlace ? '(' + poet.birthPlace + ')' : '' }}</span>
          </div>
          <div class="info-row" *ngIf="poet.deathDate">
            <span class="info-label">وفات</span>
            <span>{{ poet.deathDate }} {{ poet.deathPlace ? '(' + poet.deathPlace + ')' : '' }}</span>
          </div>
          <div class="info-row" *ngIf="poet.biography">
            <span class="info-label">زندگی‌نامه</span>
            <span>{{ poet.biography }}</span>
          </div>
          <div class="info-row" *ngIf="poet.difficultyLevel">
            <span class="info-label">سطح</span>
            <span class="difficulty-badge" [class]="'level-' + poet.difficultyLevel">
              {{ poet.difficultyLevel === 'beginner' ? 'مبتدی' : poet.difficultyLevel === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
            </span>
          </div>
        </div>

        <div class="poems-section" *ngIf="poems.length > 0">
          <h2>آثار ({{ poems.length }})</h2>
          <div class="poem-list">
            <div class="poem-item" *ngFor="let poem of poems" [routerLink]="['/persian-literature/poems', poem.id]">
              <div class="poem-item-header">
                <h4>{{ poem.title }}</h4>
                <span class="genre-badge" *ngIf="poem.genre">{{ poem.genre }}</span>
              </div>
              <p class="poem-excerpt">{{ poem.content.slice(0, 100) }}{{ poem.content.length > 100 ? '...' : '' }}</p>
              <div class="poem-item-meta">
                <span *ngIf="poem.verseCount > 0">{{ poem.verseCount }} بیت</span>
                <span *ngIf="poem.difficultyLevel" class="difficulty-badge" [class]="'level-' + poem.difficultyLevel">
                  {{ poem.difficultyLevel === 'beginner' ? 'مبتدی' : poem.difficultyLevel === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && poems.length === 0" class="empty-state">
          <p>هیچ اثری برای این شاعر ثبت نشده است.</p>
        </div>
      </div>

      <div *ngIf="!loading && !poet" class="empty-state">
        <p>شاعر مورد نظر یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .literature-container { padding: 20px; max-width: 800px; margin: 0 auto; direction: rtl; }
    .back-link { display: inline-block; margin-bottom: 20px; color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .poet-detail { background: var(--lp-surface, #fff); border-radius: 12px; border: 1px solid var(--lp-border, #e0e0e0); overflow: hidden; }
    .poet-header { display: flex; align-items: center; gap: 20px; padding: 24px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-primary-dark, #6a1b9a)); color: #fff; }
    .poet-avatar-large { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; flex-shrink: 0; }
    .poet-header-info h1 { margin: 0 0 4px; font-size: 24px; }
    .pen-name { margin: 0; font-size: 14px; opacity: 0.85; font-style: italic; }
    .poet-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 13px; opacity: 0.8; }
    .info-section { padding: 20px 24px; border-bottom: 1px solid var(--lp-border, #e0e0e0); }
    .info-row { display: flex; gap: 12px; padding: 8px 0; font-size: 14px; line-height: 1.6; }
    .info-label { font-weight: 600; color: var(--lp-text-muted, #888); min-width: 80px; flex-shrink: 0; }
    .difficulty-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .level-beginner { background: #e8f5e9; color: #2e7d32; }
    .level-intermediate { background: #fff3e0; color: #e65100; }
    .level-advanced { background: #fce4ec; color: #c62828; }
    .poems-section { padding: 20px 24px; }
    .poems-section h2 { margin: 0 0 16px; font-size: 20px; color: var(--lp-text, #333); }
    .poem-list { display: flex; flex-direction: column; gap: 12px; }
    .poem-item { padding: 16px; border: 1px solid var(--lp-border, #e0e0e0); border-radius: 8px; cursor: pointer; transition: background 0.2s; }
    .poem-item:hover { background: var(--lp-surface-hover, #f5f5f5); }
    .poem-item-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .poem-item-header h4 { margin: 0; font-size: 16px; color: var(--lp-primary, #4a148c); }
    .genre-badge { padding: 1px 8px; border-radius: 12px; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); font-size: 11px; }
    .poem-excerpt { margin: 0 0 8px; font-size: 13px; color: var(--lp-text-muted, #888); line-height: 1.5; }
    .poem-item-meta { display: flex; gap: 12px; font-size: 12px; align-items: center; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class PoetDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  poet: PersianLiteraturePoet | null = null;
  poems: PersianLiteraturePoem[] = [];
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.loadPoet(id);
    }
  }

  private loadPoet(id: number): void {
    this.loading = true;
    this.api.getPoetById(id).subscribe({
      next: (data) => {
        this.poet = data;
        this.poems = data.poems ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
