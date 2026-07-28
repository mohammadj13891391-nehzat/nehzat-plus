import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { ArabicLiteraturePoem, ArabicLiteratureAnalysis } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-arabic-poem-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="literature-container" dir="rtl">
      <div class="nav-links">
        <a class="back-link" routerLink="/arabic-literature/poems">← بازگشت به فهرست اشعار</a>
        <a class="back-link" *ngIf="poem?.poetId" [routerLink]="['/arabic-literature/poets', poem?.poetId]">→ مشاهده شاعر</a>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading && poem" class="poem-detail">
        <div class="poem-header">
          <h1>{{ poem.title }}</h1>
          <div class="poem-header-meta">
            <span class="genre-badge" *ngIf="poem.genre">{{ poem.genre }}</span>
            <span *ngIf="poem.bahr" class="meta-item">بحر: {{ poem.bahr }}</span>
            <span *ngIf="poem.qafiya" class="meta-item">قافیه: {{ poem.qafiya }}</span>
            <span *ngIf="poem.verseCount > 0" class="meta-item">{{ poem.verseCount }} بیت</span>
            <span *ngIf="poem.difficultyLevel" class="difficulty-badge" [class]="'level-' + poem.difficultyLevel">
              {{ poem.difficultyLevel === 'beginner' ? 'مبتدی' : poem.difficultyLevel === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
            </span>
            <span *ngIf="poem.theme" class="meta-item">موضوع: {{ poem.theme }}</span>
          </div>
        </div>

        <div class="poem-content-section">
          <h2>متن شعر</h2>
          <div class="poem-content">{{ poem.content }}</div>
        </div>

        <div class="poem-translation-section" *ngIf="poem.translation">
          <h2>ترجمه</h2>
          <p>{{ poem.translation }}</p>
        </div>

        <div class="poem-interpretation-section" *ngIf="poem.interpretation">
          <h2>تفسیر و شرح</h2>
          <p>{{ poem.interpretation }}</p>
        </div>

        <div class="poem-source-section" *ngIf="poem.sourceBook">
          <h2>منبع</h2>
          <p>{{ poem.sourceBook }}</p>
        </div>

        <div class="analyses-section" *ngIf="analyses.length > 0">
          <h2>تحلیل‌ها ({{ analyses.length }})</h2>
          <div class="analysis-list">
            <div class="analysis-item" *ngFor="let analysis of analyses">
              <h4>{{ analysis.title }}</h4>
              <p>{{ analysis.content }}</p>
              <div class="analysis-meta">
                <span class="analysis-type">{{ analysis.analysisType }}</span>
                <span *ngIf="analysis.difficultyLevel" class="difficulty-badge" [class]="'level-' + analysis.difficultyLevel">
                  {{ analysis.difficultyLevel === 'beginner' ? 'مبتدی' : analysis.difficultyLevel === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !poem" class="empty-state">
        <p>شعر مورد نظر یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .literature-container { padding: 20px; max-width: 800px; margin: 0 auto; direction: rtl; }
    .nav-links { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .back-link { color: var(--lp-primary, #4a148c); text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .poem-detail { background: var(--lp-surface, #fff); border-radius: 12px; border: 1px solid var(--lp-border, #e0e0e0); overflow: hidden; }
    .poem-header { padding: 24px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-primary-dark, #6a1b9a)); color: #fff; }
    .poem-header h1 { margin: 0 0 12px; font-size: 24px; }
    .poem-header-meta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; font-size: 13px; }
    .meta-item { opacity: 0.85; }
    .genre-badge { padding: 2px 10px; border-radius: 12px; background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; font-weight: 500; }
    .difficulty-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .level-beginner { background: #e8f5e9; color: #2e7d32; }
    .level-intermediate { background: #fff3e0; color: #e65100; }
    .level-advanced { background: #fce4ec; color: #c62828; }
    .poem-content-section, .poem-translation-section, .poem-interpretation-section, .poem-source-section, .analyses-section { padding: 20px 24px; border-bottom: 1px solid var(--lp-border, #e0e0e0); }
    .poem-content-section h2, .poem-translation-section h2, .poem-interpretation-section h2, .poem-source-section h2, .analyses-section h2 { margin: 0 0 12px; font-size: 18px; color: var(--lp-text, #333); }
    .poem-content { font-size: 16px; line-height: 2; color: var(--lp-text, #333); white-space: pre-line; }
    .poem-translation-section p, .poem-interpretation-section p, .poem-source-section p { font-size: 14px; line-height: 1.8; color: var(--lp-text, #555); margin: 0; }
    .analysis-list { display: flex; flex-direction: column; gap: 12px; }
    .analysis-item { padding: 16px; border: 1px solid var(--lp-border, #e0e0e0); border-radius: 8px; }
    .analysis-item h4 { margin: 0 0 8px; font-size: 15px; color: var(--lp-primary, #4a148c); }
    .analysis-item p { margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: var(--lp-text, #555); }
    .analysis-meta { display: flex; gap: 12px; align-items: center; font-size: 12px; }
    .analysis-type { padding: 1px 8px; border-radius: 12px; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); font-size: 11px; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class PoemDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  poem: ArabicLiteraturePoem | null = null;
  analyses: ArabicLiteratureAnalysis[] = [];
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.loadPoem(id);
    }
  }

  private loadPoem(id: number): void {
    this.loading = true;
    this.api.getArabicPoemById(id).subscribe({
      next: (data) => {
        this.poem = data;
        this.analyses = data.analyses ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
