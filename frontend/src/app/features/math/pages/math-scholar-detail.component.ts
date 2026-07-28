import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { MathScholar, MathContribution } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-math-scholar-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div dir="rtl" class="container">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && scholar">
        <a routerLink="/math/scholars" class="back-link">بازگشت به دانشمندان</a>

        <div class="scholar-header">
          <div class="avatar">{{ scholar.name.charAt(0) }}</div>
          <div class="info">
            <h1>{{ scholar.name }}</h1>
            <p *ngIf="scholar.nameArabic" class="arabic-name">{{ scholar.nameArabic }}</p>
            <p class="dates">{{ scholar.birthYear }} - {{ scholar.deathYear }} میلادی</p>
            <p class="place">زادگاه: {{ scholar.birthPlace }}</p>
            <p class="known-for">شناخته شده برای: {{ scholar.knownFor }}</p>
          </div>
        </div>

        <div class="biography">
          <h2>زندگی‌نامه</h2>
          <p>{{ scholar.biography }}</p>
        </div>

        <div class="contributions" *ngIf="scholar.contributions && scholar.contributions.length > 0">
          <h2>مشارکت‌ها در ریاضیات</h2>
          <div class="contribution-card" *ngFor="let contribution of scholar.contributions">
            <h3>{{ contribution.title }}</h3>
            <p class="year-range">{{ contribution.yearRange }}</p>
            <p class="description">{{ contribution.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .loading { text-align: center; padding: 48px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--lp-border); border-top-color: var(--lp-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .back-link { color: var(--lp-primary); text-decoration: none; font-size: 0.9rem; display: inline-block; margin-bottom: 24px; }
    .back-link:hover { text-decoration: underline; }
    .scholar-header { display: flex; gap: 24px; margin-bottom: 32px; align-items: flex-start; }
    .avatar { width: 100px; height: 100px; background: linear-gradient(135deg, var(--lp-primary), var(--lp-primary-dark)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; flex-shrink: 0; }
    .info h1 { color: var(--lp-text); margin-bottom: 4px; }
    .arabic-name { color: var(--lp-text-muted); font-style: italic; margin-bottom: 8px; }
    .dates { color: var(--lp-text-muted); margin-bottom: 4px; }
    .place { color: var(--lp-text-muted); margin-bottom: 4px; }
    .known-for { color: var(--lp-primary); font-weight: 500; }
    .biography { background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 12px; padding: 24px; margin-bottom: 32px; }
    .biography h2 { color: var(--lp-text); margin-bottom: 12px; }
    .biography p { color: var(--lp-text); line-height: 1.8; }
    .contributions h2 { color: var(--lp-text); margin-bottom: 16px; }
    .contribution-card { background: var(--lp-surface); border: 1px solid var(--lp-border); border-radius: 12px; padding: 20px; margin-bottom: 12px; }
    .contribution-card h3 { color: var(--lp-text); margin-bottom: 4px; }
    .year-range { color: var(--lp-primary); font-size: 0.9rem; margin-bottom: 8px; }
    .description { color: var(--lp-text-muted); line-height: 1.6; }
  `]
})
export class MathScholarDetailComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private route = inject(ActivatedRoute);
  scholar: MathScholar | null = null;
  loading = true;

  ngOnInit(): void {
    const scholarId = Number(this.route.snapshot.paramMap.get('scholarId'));
    this.api.getMathScholarById(scholarId).subscribe({
      next: (scholar) => { this.scholar = scholar; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
