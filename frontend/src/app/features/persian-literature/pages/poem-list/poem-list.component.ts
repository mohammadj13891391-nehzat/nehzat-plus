import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { PersianLiteraturePoem } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-poem-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="literature-container" dir="rtl">
      <div class="header-card">
        <h1>اشعار ادبیات فارسی</h1>
        <p class="subtitle">گنجینه نظم و نثر پارسی</p>
      </div>

      <div class="filter-bar">
        <select [(ngModel)]="genreFilter" (change)="applyFilters()">
          <option value="">همه genres</option>
          <option value="ghazal">غزل</option>
          <option value="masnavi">مثنوی</option>
          <option value="prose">نثر</option>
          <option value="qasideh">قصیده</option>
          <option value="robaee">رباعی</option>
        </select>
        <select [(ngModel)]="difficultyFilter" (change)="applyFilters()">
          <option value="">همه سطوح</option>
          <option value="beginner">مبتدی</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">پیشرفته</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading" class="poem-list">
        <div class="poem-card" *ngFor="let poem of poems" [routerLink]="['/persian-literature/poems', poem.id]">
          <h3>{{ poem.title }}</h3>
          <p class="poem-excerpt">{{ poem.content.slice(0, 120) }}{{ poem.content.length > 120 ? '...' : '' }}</p>
          <div class="poem-meta">
            <span class="genre-badge" *ngIf="poem.genre">{{ poem.genre }}</span>
            <span *ngIf="poem.verseCount > 0" class="meta-item">{{ poem.verseCount }} بیت</span>
            <span *ngIf="poem.difficultyLevel" class="difficulty-badge" [class]="'level-' + poem.difficultyLevel">
              {{ poem.difficultyLevel === 'beginner' ? 'مبتدی' : poem.difficultyLevel === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
            </span>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && poems.length === 0" class="empty-state">
        <p>هیچ شعری یافت نشد.</p>
      </div>
    </div>
  `,
  styles: [`
    .literature-container { padding: 20px; max-width: 900px; margin: 0 auto; direction: rtl; }
    .header-card { margin-bottom: 20px; padding: 24px; background: linear-gradient(135deg, var(--lp-primary, #4a148c), var(--lp-primary-dark, #6a1b9a)); color: #fff; border-radius: 12px; text-align: center; }
    .header-card h1 { margin: 0 0 8px; font-size: 28px; }
    .subtitle { margin: 0; opacity: 0.85; font-size: 14px; }
    .filter-bar { display: flex; gap: 12px; margin-bottom: 20px; }
    .filter-bar select { flex: 1; padding: 10px 12px; border: 1px solid var(--lp-border, #e0e0e0); border-radius: 8px; font-size: 14px; background: var(--lp-surface, #fff); color: var(--lp-text, #333); cursor: pointer; }
    .loading-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--lp-border, #e0e0e0); border-top-color: var(--lp-primary, #4a148c); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .poem-list { display: flex; flex-direction: column; gap: 12px; }
    .poem-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; padding: 20px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .poem-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .poem-card h3 { margin: 0 0 8px; font-size: 18px; color: var(--lp-primary, #4a148c); }
    .poem-excerpt { margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: var(--lp-text, #555); }
    .poem-meta { display: flex; gap: 12px; align-items: center; font-size: 12px; }
    .genre-badge { padding: 2px 10px; border-radius: 12px; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); font-size: 11px; font-weight: 500; }
    .meta-item { color: var(--lp-text-muted, #888); }
    .difficulty-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .level-beginner { background: #e8f5e9; color: #2e7d32; }
    .level-intermediate { background: #fff3e0; color: #e65100; }
    .level-advanced { background: #fce4ec; color: #c62828; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class PoemListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  poems: PersianLiteraturePoem[] = [];
  allPoems: PersianLiteraturePoem[] = [];
  loading = true;
  genreFilter = '';
  difficultyFilter = '';

  ngOnInit(): void {
    this.loadPoems();
  }

  private loadPoems(): void {
    this.loading = true;
    this.api.getPoems().subscribe({
      next: (data) => {
        this.allPoems = data;
        this.poems = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.poems = this.allPoems.filter(p => {
      if (this.genreFilter && p.genre !== this.genreFilter) return false;
      if (this.difficultyFilter && p.difficultyLevel !== this.difficultyFilter) return false;
      return true;
    });
  }
}
