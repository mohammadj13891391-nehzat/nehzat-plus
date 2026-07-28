import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { LESSON_PLANNER_API } from '../../../../core/services/lesson-planner-api.token';
import { PersianLiteraturePoet } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-poet-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="literature-container" dir="rtl">
      <div class="header-card">
        <h1>ادبیات فارسی</h1>
        <p class="subtitle">شاعران نام‌آور ایران زمین</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <div *ngIf="!loading" class="poet-grid">
        <div class="poet-card" *ngFor="let poet of poets" [routerLink]="['/persian-literature/poets', poet.id]">
          <div class="poet-avatar">{{ poet.name.charAt(0) }}</div>
          <h3>{{ poet.name }}</h3>
          <p class="pen-name" *ngIf="poet.penName">{{ poet.penName }}</p>
          <div class="poet-meta">
            <span *ngIf="poet.era">{{ poet.era }}</span>
            <span *ngIf="poet.century">قرن {{ poet.century }}</span>
          </div>
          <div class="difficulty-badge" [class]="'level-' + (poet.difficultyLevel ?? 'beginner')">
            {{ poet.difficultyLevel === 'beginner' ? 'مبتدی' : poet.difficultyLevel === 'intermediate' ? 'متوسط' : 'پیشرفته' }}
          </div>
        </div>
      </div>

      <div *ngIf="!loading && poets.length === 0" class="empty-state">
        <p>هیچ شاعری یافت نشد.</p>
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
    .poet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .poet-card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e0e0e0); border-radius: 12px; padding: 20px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
    .poet-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .poet-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--lp-primary-light, #e1bee7); color: var(--lp-primary, #4a148c); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; margin-bottom: 12px; }
    .poet-card h3 { margin: 0 0 4px; font-size: 18px; color: var(--lp-text, #333); }
    .pen-name { margin: 0 0 8px; font-size: 13px; color: var(--lp-primary, #4a148c); font-style: italic; }
    .poet-meta { display: flex; gap: 12px; font-size: 12px; color: var(--lp-text-muted, #888); margin-bottom: 8px; }
    .difficulty-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .level-beginner { background: #e8f5e9; color: #2e7d32; }
    .level-intermediate { background: #fff3e0; color: #e65100; }
    .level-advanced { background: #fce4ec; color: #c62828; }
    .empty-state { text-align: center; padding: 60px 0; color: var(--lp-text-muted, #888); }
  `]
})
export class PoetListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  poets: PersianLiteraturePoet[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadPoets();
  }

  private loadPoets(): void {
    this.loading = true;
    this.api.getPoets().subscribe({
      next: (data) => {
        this.poets = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
