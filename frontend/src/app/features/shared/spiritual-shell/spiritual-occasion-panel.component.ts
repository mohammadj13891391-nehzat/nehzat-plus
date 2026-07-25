import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import type {
  SpiritualOccasion,
  SpiritualOccasionDetail,
  UserOccasionProgress,
  MarkOccasionPracticePayload,
  CurrentUser,
} from '../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-spiritual-occasion-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="panel">
      <h2>مناسبت‌های مذهبی</h2>
      <p class="panel-desc">تمرینات مرتبط با مناسبت‌های مذهبی را علامت بزنید</p>

      @if (loading) {
        <p class="muted">در حال بارگذاری...</p>
      } @else if (occasions.length === 0) {
        <p class="muted">هیچ مناسبت‌ی یافت نشد</p>
      } @else {
        <div class="occasion-list">
          @for (occ of occasions; track occ.id) {
            <div class="occasion-card" [class.expanded]="expandedId === occ.id">
              <button class="occasion-header" (click)="toggleOccasion(occ.id, occ)">
                <span class="occ-icon">&#x1F4C5;</span>
                <div class="occ-info">
                  <span class="occ-title">{{ occ.titleFa }}</span>
                  @if (occ.descriptionFa) {
                    <span class="occ-desc-small">{{ occ.descriptionFa }}</span>
                  }
                </div>
                <span class="expand-icon">{{ expandedId === occ.id ? '&#x25B2;' : '&#x25BC;' }}</span>
              </button>

              @if (expandedId === occ.id) {
                <div class="occasion-body">
                  @if (occDetailLoading) {
                    <p class="muted">در حال بارگذاری...</p>
                  } @else if (occasionPractices.length === 0) {
                    <p class="muted">هیچ تمرینی برای این مناسبت تعریف نشده</p>
                  } @else {
                    <div class="practice-check-list">
                      @for (p of occasionPractices; track p.id) {
                        <label class="practice-item">
                          <input
                            type="checkbox"
                            [checked]="isPracticeChecked(occ.id, p.id)"
                            (change)="togglePractice(occ.id, p.id, $event)"
                          />
                          <span>{{ p.titleFa }}</span>
                        </label>
                      }
                    </div>
                    @if (toast) {
                      <div class="toast-mini" [class.success]="toast.type === 'success'" [class.error]="toast.type === 'error'">
                        {{ toast.message }}
                      </div>
                    }
                  }
                </div>
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
    .occasion-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .occasion-card { border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.75rem; overflow: hidden; }
    .occasion-header { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; background: none; border: none; cursor: pointer; font-family: inherit; text-align: right; }
    .occasion-header:hover { background: #f9fafb; }
    .occ-icon { font-size: 1.25rem; flex-shrink: 0; }
    .occ-info { flex: 1; display: flex; flex-direction: column; }
    .occ-title { font-weight: 600; font-size: 0.9375rem; }
    .occ-desc-small { font-size: 0.75rem; color: var(--lp-muted, #6b7280); }
    .expand-icon { font-size: 0.75rem; color: var(--lp-muted, #6b7280); }
    .occasion-body { border-top: 1px solid var(--lp-border, #e5e7eb); padding: 0.75rem 1rem; }
    .practice-check-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .practice-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer; }
    .practice-item input { width: 1rem; height: 1rem; }
    .toast-mini { margin-top: 0.5rem; padding: 0.4rem 0.75rem; border-radius: 0.5rem; font-size: 0.8125rem; }
    .toast-mini.success { background: #d1fae5; color: #065f46; }
    .toast-mini.error { background: #fee2e2; color: #991b1b; }
  `]
})
export class SpiritualOccasionPanelComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  occasions: SpiritualOccasion[] = [];
  occasionProgress: UserOccasionProgress[] = [];
  occasionPractices: SpiritualPracticeItem[] = [];
  expandedId: number | null = null;
  loading = false;
  occDetailLoading = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;

  private currentUser: CurrentUser | null = null;
  private currentHijriYear = 1448;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentHijriYear = new Date().getFullYear() - 578;
    this.loadOccasions();
  }

  private loadOccasions(): void {
    this.loading = true;
    this.api.getSpiritualOccasions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.occasions = items; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  private loadProgress(): void {
    const userId = this.currentUser?.studentId ?? 0;
    if (!userId) return;
    this.api.getUserOccasionProgress(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (prog) => { this.occasionProgress = prog; }
    });
  }

  toggleOccasion(id: number, occ: SpiritualOccasion): void {
    if (this.expandedId === id) {
      this.expandedId = null;
      this.occasionPractices = [];
      return;
    }
    this.expandedId = id;
    this.occDetailLoading = true;
    this.loadProgress();
    this.api.getSpiritualOccasionDetail(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (detail) => {
        this.occasionPractices = detail.practices ?? [];
        this.occDetailLoading = false;
      },
      error: () => { this.occDetailLoading = false; }
    });
  }

  isPracticeChecked(occasionId: number, practiceId: number): boolean {
    return this.occasionProgress.some(p => p.occasionId === occasionId && p.practiceItemId === practiceId && p.isCompleted);
  }

  togglePractice(occasionId: number, practiceId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const userId = this.currentUser?.studentId ?? 0;
    if (!userId) return;

    const payload: MarkOccasionPracticePayload = {
      userId, occasionId, practiceItemId: practiceId,
      hijriYear: this.currentHijriYear, isCompleted: checked
    };

    this.api.markOccasionPractice(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (checked) {
          this.occasionProgress.push({
            id: result.id, userId, occasionId, practiceItemId: practiceId,
            hijriYear: this.currentHijriYear, isCompleted: true, createdAt: '', updatedAt: ''
          });
        } else {
          this.occasionProgress = this.occasionProgress.filter(
            p => !(p.occasionId === occasionId && p.practiceItemId === practiceId)
          );
        }
        this.showToast(checked ? 'تمرین ثبت شد' : 'تمرین لغو شد', 'success');
      },
      error: () => this.showToast('خطا در ثبت', 'error')
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 2000);
  }
}

interface SpiritualPracticeItem {
  id: number; key: string; titleFa: string; descriptionFa?: string; stepKind: string;
  genderMask: string; roleMask: string; sortOrder: number;
  createdAt: string; updatedAt: string;
}
