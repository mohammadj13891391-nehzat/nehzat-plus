import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import type { DailySpiritualEntry, CurrentUser } from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-spiritual-history-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="panel">
      <h2>تاریخچه ورودی‌ها</h2>
      <p class="panel-desc">سوابق ثبت تمرینات روزانه خود را مرور کنید</p>

      <div class="filter-bar">
        <label class="field">
          <span>از تاریخ</span>
          <input type="date" [(ngModel)]="fromDate" (change)="loadHistory()" />
        </label>
        <label class="field">
          <span>تا تاریخ</span>
          <input type="date" [(ngModel)]="toDate" (change)="loadHistory()" />
        </label>
      </div>

      @if (loading) {
        <p class="muted">در حال بارگذاری...</p>
      } @else if (entries.length === 0) {
        <p class="muted">هیچ ورودی‌ای یافت نشد</p>
      } @else {
        <div class="entry-list">
          @for (e of entries; track e.id) {
            <div class="entry-card">
              <div class="entry-header">
                <span class="entry-date">{{ formatDate(e.entryDate) }}</span>
                @if (e.moodScore) {
                  <span class="mood-badge">حالت روحی: {{ e.moodScore }}/10</span>
                }
              </div>
              @if (e.completedSteps) {
                <div class="entry-steps">
                  @for (s of parseSteps(e.completedSteps); track s) {
                    <span class="step-tag">{{ s }}</span>
                  }
                </div>
              }
              @if (e.notes) {
                <p class="entry-notes">{{ e.notes }}</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .panel { padding: 0.5rem 0; }
    .panel-desc { color: var(--lp-muted, #6b7280); margin: 0 0 1rem; font-size: 0.875rem; }
    .muted { color: var(--lp-muted, #6b7280); font-size: 0.875rem; }
    .filter-bar { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .field { display: flex; flex-direction: column; gap: 0.25rem; }
    .field span { font-size: 0.8125rem; font-weight: 500; }
    .field input { border: 1px solid var(--lp-border, #d1d5db); border-radius: 0.5rem; padding: 0.4rem 0.5rem; font-size: 0.875rem; font-family: inherit; }
    .entry-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .entry-card { border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.75rem; padding: 0.75rem 1rem; }
    .entry-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.375rem; }
    .entry-date { font-weight: 600; font-size: 0.9375rem; }
    .mood-badge { background: #fef3c7; color: #92400e; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .entry-steps { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.375rem; }
    .step-tag { background: #e0f2fe; color: #0369a1; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
    .entry-notes { font-size: 0.8125rem; color: var(--lp-muted, #6b7280); margin: 0; }
  `]
})
export class SpiritualHistoryPanelComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  entries: DailySpiritualEntry[] = [];
  fromDate = '';
  toDate = '';
  loading = false;

  private currentUser: CurrentUser | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 30);
    this.toDate = this.toDateStr(today);
    this.fromDate = this.toDateStr(weekAgo);
    this.loadHistory();
  }

  loadHistory(): void {
    const userId = this.currentUser?.studentId ?? 0;
    if (!userId) return;
    this.loading = true;
    this.api.getSpiritualEntryHistory(userId, this.fromDate || undefined, this.toDate || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => { this.entries = items; this.loading = false; },
        error: () => { this.loading = false; }
      });
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('fa-IR');
    } catch {
      return dateStr;
    }
  }

  parseSteps(steps: string): string[] {
    return steps.split(',').map(s => s.trim()).filter(Boolean);
  }

  private toDateStr(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
