import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { MathScholar } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-math-scholars',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div dir="rtl" class="container">
      <div class="header">
        <a routerLink="/math/topics" class="back-link">بازگشت به ریاضیات</a>
        <h1>میراث ریاضی مسلمانان</h1>
        <p class="subtitle">دانشمندان بزرگ اسلامی که پایه‌گذار علوم ریاضی مدرن بودند</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && scholars.length === 0" class="empty">
        <p>هنوز دانشمندی تعریف نشده است</p>
      </div>

      <div class="grid" *ngIf="!loading && scholars.length > 0">
        <div class="scholar-card" *ngFor="let scholar of scholars" [routerLink]="['/math/scholars', scholar.id]">
          <div class="avatar">{{ scholar.name.charAt(0) }}</div>
          <h3>{{ scholar.name }}</h3>
          <p class="dates">{{ scholar.birthYear }} - {{ scholar.deathYear }} میلادی</p>
          <p class="known-for">{{ scholar.knownFor }}</p>
          <p class="place">{{ scholar.birthPlace }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .header { text-align: center; margin-bottom: 32px; }
    .back-link { color: var(--lp-primary); text-decoration: none; font-size: 0.9rem; display: inline-block; margin-bottom: 16px; }
    .back-link:hover { text-decoration: underline; }
    .header h1 { color: var(--lp-text); margin-bottom: 8px; font-size: 2rem; }
    .subtitle { color: var(--lp-text-muted); }
    .loading, .empty { text-align: center; padding: 48px; color: var(--lp-text-muted); }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--lp-border); border-top-color: var(--lp-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .scholar-card { background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .scholar-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .avatar { width: 80px; height: 80px; background: linear-gradient(135deg, var(--lp-primary), var(--lp-primary-dark)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 16px; }
    .scholar-card h3 { color: var(--lp-text); margin-bottom: 8px; }
    .dates { color: var(--lp-text-muted); font-size: 0.9rem; margin-bottom: 8px; }
    .known-for { color: var(--lp-primary); font-weight: 500; margin-bottom: 4px; }
    .place { color: var(--lp-text-muted); font-size: 0.85rem; }
  `]
})
export class MathScholarsComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  scholars: MathScholar[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.getMathScholars().subscribe({
      next: (scholars) => { this.scholars = scholars; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
