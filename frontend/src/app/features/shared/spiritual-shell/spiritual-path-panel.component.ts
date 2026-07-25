import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import type {
  AvailablePath,
  StudentPathSelection,
  CurrentUser,
} from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-spiritual-path-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="panel">
      <h2>مسیر معنوی</h2>
      <p class="panel-desc">مسیرهای رشد معنوی را بررسی کرده و انتخاب کنید</p>

      @if (loading) {
        <p class="muted">در حال بارگذاری...</p>
      } @else if (currentSelection) {
        <div class="selection-card">
          <h3>مسیر انتخاب شده</h3>
          <p><strong>{{ currentSelection.finalizedPathTitle ?? 'نامشخص' }}</strong></p>
          <p class="muted">مرحله: {{ currentSelection.stage }}</p>
        </div>
      }

      <div class="path-list">
        @for (p of availablePaths; track p.id) {
          <div class="path-card" [class.selected]="selectedPathId === p.id">
            <div class="path-header">
              <span class="path-icon">&#x1F9F0;</span>
              <div class="path-info">
                <span class="path-title">{{ p.titleFa }}</span>
                @if (p.descriptionFa) {
                  <span class="path-desc">{{ p.descriptionFa }}</span>
                }
              </div>
              <button
                class="select-btn"
                [class.active]="selectedPathId === p.id"
                (click)="selectPath(p.id)"
              >
                {{ selectedPathId === p.id ? 'انتخاب شده' : 'انتخاب' }}
              </button>
            </div>
          </div>
        }
      </div>

      @if (selectedPathId && availablePaths.length > 0) {
        <button class="finalize-btn" (click)="finalizePath()" [disabled]="finalizing">
          {{ finalizing ? 'در حال نهایی‌سازی...' : 'نهایی‌سازی مسیر' }}
        </button>
      }

      @if (toast) {
        <div class="toast-mini" [class.success]="toast.type === 'success'" [class.error]="toast.type === 'error'">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .panel { padding: 0.5rem 0; }
    .panel-desc { color: var(--lp-muted, #6b7280); margin: 0 0 1rem; font-size: 0.875rem; }
    .muted { color: var(--lp-muted, #6b7280); font-size: 0.875rem; }
    .selection-card { background: #f0f7f3; border: 1px solid var(--lp-primary, #1a6b3c); border-radius: 0.75rem; padding: 0.75rem 1rem; margin-bottom: 1rem; }
    .selection-card h3 { margin: 0 0 0.25rem; font-size: 0.9375rem; color: var(--lp-primary, #1a6b3c); }
    .selection-card p { margin: 0; font-size: 0.875rem; }
    .path-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .path-card { border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.75rem; padding: 0.75rem 1rem; }
    .path-card.selected { border-color: var(--lp-primary, #1a6b3c); background: #f0f7f3; }
    .path-header { display: flex; align-items: center; gap: 0.75rem; }
    .path-icon { font-size: 1.25rem; flex-shrink: 0; }
    .path-info { flex: 1; display: flex; flex-direction: column; }
    .path-title { font-weight: 600; font-size: 0.9375rem; }
    .path-desc { font-size: 0.75rem; color: var(--lp-muted, #6b7280); }
    .select-btn { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #d1d5db); border-radius: 0.5rem; padding: 0.4rem 0.75rem; font-family: inherit; font-size: 0.8125rem; cursor: pointer; }
    .select-btn.active { background: var(--lp-primary, #1a6b3c); color: #fff; border-color: var(--lp-primary, #1a6b3c); }
    .finalize-btn { margin-top: 1rem; background: var(--lp-gold, #b8942e); color: #fff; border: none; border-radius: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9375rem; font-weight: 600; cursor: pointer; width: 100%; }
    .finalize-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .toast-mini { margin-top: 0.5rem; padding: 0.4rem 0.75rem; border-radius: 0.5rem; font-size: 0.8125rem; }
    .toast-mini.success { background: #d1fae5; color: #065f46; }
    .toast-mini.error { background: #fee2e2; color: #991b1b; }
  `]
})
export class SpiritualPathPanelComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  availablePaths: AvailablePath[] = [];
  currentSelection: StudentPathSelection | null = null;
  selectedPathId: number | null = null;
  loading = false;
  finalizing = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;

  private currentUser: CurrentUser | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPaths();
  }

  private loadPaths(): void {
    const studentId = this.currentUser?.studentId ?? 0;
    if (!studentId) {
      this.loading = false;
      return;
    }
    this.loading = true;

    this.api.getAvailablePaths(studentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (paths) => { this.availablePaths = paths; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.api.getStudentPathSelection(studentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (sel) => {
        this.currentSelection = sel;
        if (sel?.finalizedPathId) this.selectedPathId = sel.finalizedPathId;
      }
    });
  }

  selectPath(pathId: number): void {
    this.selectedPathId = this.selectedPathId === pathId ? null : pathId;
  }

  finalizePath(): void {
    const studentId = this.currentUser?.studentId ?? 0;
    if (!studentId || !this.selectedPathId || this.finalizing) return;
    this.finalizing = true;

    this.api.finalizePath({ studentId, pathId: this.selectedPathId }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.currentSelection = result;
        this.finalizing = false;
        this.showToast('مسیر با موفقیت نهایی‌سازی شد', 'success');
      },
      error: () => {
        this.finalizing = false;
        this.showToast('خطا در نهایی‌سازی مسیر', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 2000);
  }
}
