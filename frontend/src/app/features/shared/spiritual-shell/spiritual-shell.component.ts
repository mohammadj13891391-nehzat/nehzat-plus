import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import type {
  CurrentUser,
  DailySpiritualEntry,
  SpiritualPracticeItem,
  UpsertDailySpiritualEntryPayload
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import { SpiritualOccasionPanelComponent } from './spiritual-occasion-panel.component';
import { SpiritualPathPanelComponent } from './spiritual-path-panel.component';
import { SpiritualHistoryPanelComponent } from './spiritual-history-panel.component';

type TabId = 'practice' | 'occasions' | 'path' | 'history' | 'quran' | 'math';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-spiritual-shell',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    SpiritualOccasionPanelComponent,
    SpiritualPathPanelComponent,
    SpiritualHistoryPanelComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="spiritual-page">
      <div class="toast" *ngIf="toast" [class.toast-success]="toast.type === 'success'" [class.toast-error]="toast.type === 'error'">
        {{ toast.message }}
      </div>

      <header class="page-header">
        <div class="header-content">
          <img src="assets/nehzat.png" alt="لوگو" class="logo" (error)="logoHidden = true" />
          <div>
            <h1>مناسک و مسیر</h1>
            <p class="subtitle">{{ persianDate }} — {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="streak-badge" *ngIf="streak > 0">
            <span class="streak-icon">&#x1F525;</span>
            <span class="streak-count">{{ streak }} روز متوالی</span>
          </div>
          <button type="button" class="logout-btn" (click)="logout()">خروج</button>
        </div>
      </header>

      <nav class="tab-bar">
        <button class="tab-btn" [class.active]="activeTab === 'practice'" (click)="activeTab = 'practice'">
          &#x1F4DD; تمرین روزانه
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'occasions'" (click)="activeTab = 'occasions'">
          &#x1F4C5; مناسبت‌ها
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'path'" (click)="activeTab = 'path'">
          &#x1F9F0; مسیر معنوی
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'history'" (click)="activeTab = 'history'">
          &#x1F4CB; تاریخچه
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'quran'" (click)="goToQuran()">
          &#x1F4DC; قرآن
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'math'" (click)="goToMath()">
          &#x1F4D0; ریاضیات
        </button>
      </nav>

      <div class="content-grid">
        @switch (activeTab) {
          @case ('practice') {
            <section class="card practice-card">
              <h2>تمرین روزانه پنج‌گانه</h2>
              <p class="card-desc">گام‌های امروز خود را علامت بزنید و ثبت کنید</p>

              <form [formGroup]="practiceForm" (ngSubmit)="onSave()" class="practice-form">
                <div class="steps-list" *ngIf="practiceItems.length > 0; else noItems">
                  @for (step of stepKinds; track step.kind) {
                    <div class="step-group">
                      <h3 class="step-heading">{{ step.label }}</h3>
                      @for (item of getItemsByKind(step.kind); track item.id) {
                        <label class="step-item">
                          <input
                            type="checkbox"
                            [formControl]="getStepControl(item.key)"
                            class="step-checkbox"
                          />
                          <span class="step-text">{{ item.titleFa }}</span>
                          <span class="step-desc" *ngIf="item.descriptionFa">{{ item.descriptionFa }}</span>
                        </label>
                      }
                      @if (getItemsByKind(step.kind).length === 0) {
                        <p class="empty-step">هیچ موردی برای این گام یافت نشد</p>
                      }
                    </div>
                  }
                </div>

                <ng-template #noItems>
                  <div class="empty-state">
                    <p class="muted">هیچ آیین نامه‌ای برای شما یافت نشد. لطفاً بعداً مراجعه کنید.</p>
                  </div>
                </ng-template>

                <label class="field">
                  <span>یادداشت روزانه (اختیاری)</span>
                  <textarea formControlName="notes" rows="3" placeholder="احساسات، افکار و تجربیات امروز..."></textarea>
                </label>

                <label class="field">
                  <span>امتیاز حالت روحی (۱ تا ۱۰)</span>
                  <input type="number" formControlName="moodScore" min="1" max="10" placeholder="۵" />
                </label>

                <button type="submit" class="save-btn" [disabled]="!practiceForm.dirty">
                  <span *ngIf="!saving">ذخیره امروز</span>
                  <span *ngIf="saving">در حال ذخیره...</span>
                </button>
              </form>
            </section>
          }
          @case ('occasions') {
            <section class="card">
              <app-spiritual-occasion-panel />
            </section>
          }
          @case ('path') {
            <section class="card">
              <app-spiritual-path-panel />
            </section>
          }
          @case ('history') {
            <section class="card">
              <app-spiritual-history-panel />
            </section>
          }
        }
      </div>
    </main>
  `,
  styles: [`
    .spiritual-page { direction: rtl; min-height: 100vh; background: var(--lp-bg, #f8f9fa); }
    .toast { position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); padding: 0.75rem 1.5rem; border-radius: 0.5rem; z-index: 1000; font-size: 0.875rem; }
    .toast-success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .toast-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .page-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: var(--lp-surface, #fff); border-bottom: 1px solid var(--lp-border, #e5e7eb); flex-wrap: wrap; gap: 0.5rem; }
    .header-content { display: flex; align-items: center; gap: 1rem; }
    .logo { width: 44px; height: 44px; object-fit: contain; }
    h1 { margin: 0; font-size: 1.25rem; }
    .subtitle { color: var(--lp-muted, #6b7280); margin: 0; font-size: 0.875rem; }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .streak-badge { display: flex; align-items: center; gap: 0.375rem; background: #fef3c7; color: #92400e; padding: 0.375rem 0.75rem; border-radius: 999px; font-size: 0.8125rem; font-weight: 600; }
    .streak-icon { font-size: 1rem; }
    .streak-count { white-space: nowrap; }
    .logout-btn { background: var(--lp-primary, #2563eb); color: #fff; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.875rem; }
    .tab-bar { display: flex; gap: 0; background: var(--lp-surface, #fff); border-bottom: 1px solid var(--lp-border, #e5e7eb); padding: 0 1rem; overflow-x: auto; }
    .tab-btn { padding: 0.75rem 1rem; background: none; border: none; border-bottom: 2px solid transparent; font-family: inherit; font-size: 0.875rem; cursor: pointer; white-space: nowrap; color: var(--lp-muted, #6b7280); transition: all 0.15s; }
    .tab-btn:hover { color: var(--lp-text, #1e1b14); }
    .tab-btn.active { color: var(--lp-primary, #1a6b3c); border-bottom-color: var(--lp-primary, #1a6b3c); font-weight: 600; }
    .content-grid { padding: 1.5rem; max-width: 720px; margin: 0 auto; }
    .card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.75rem; padding: 1.5rem; }
    .practice-card h2 { margin: 0 0 0.25rem; font-size: 1.125rem; }
    .card-desc { color: var(--lp-muted, #6b7280); margin: 0 0 1.25rem; font-size: 0.875rem; }
    .practice-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .steps-list { display: flex; flex-direction: column; gap: 1rem; }
    .step-group { border: 1px solid var(--lp-border, #e5e7eb); border-radius: 0.5rem; padding: 0.75rem; }
    .step-heading { margin: 0 0 0.5rem; font-size: 0.9375rem; color: var(--lp-primary, #2563eb); border-bottom: 1px solid var(--lp-border, #e5e7eb); padding-bottom: 0.375rem; }
    .step-item { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.375rem 0; cursor: pointer; }
    .step-checkbox { margin-top: 0.25rem; flex-shrink: 0; width: 1.125rem; height: 1.125rem; }
    .step-text { font-size: 0.875rem; font-weight: 500; }
    .step-desc { display: block; font-size: 0.75rem; color: var(--lp-muted, #6b7280); margin-top: 0.125rem; }
    .empty-step { color: var(--lp-muted, #6b7280); font-size: 0.8125rem; padding: 0.5rem 0; }
    .empty-state { text-align: center; padding: 2rem 0; }
    .muted { color: var(--lp-muted, #6b7280); }
    .field { display: flex; flex-direction: column; gap: 0.375rem; }
    .field span { font-size: 0.875rem; font-weight: 500; }
    .field input, .field textarea, .field select { border: 1px solid var(--lp-border, #d1d5db); border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; font-family: inherit; }
    .field textarea { resize: vertical; min-height: 60px; }
    .save-btn { background: var(--lp-primary, #2563eb); color: #fff; border: none; border-radius: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9375rem; font-weight: 600; cursor: pointer; align-self: flex-start; }
    .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class SpiritualShellComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  activeTab: TabId = 'practice';
  currentUser: CurrentUser | null = null;
  logoHidden = false;
  toast: Toast | null = null;
  saving = false;
  streak = 0;
  persianDate = '';
  practiceItems: SpiritualPracticeItem[] = [];
  todayEntry: DailySpiritualEntry | null = null;

  practiceForm: FormGroup = this.fb.group({
    controls: this.fb.group({}),
    notes: [''],
    moodScore: [null]
  });

  readonly stepKinds: { kind: string; label: string }[] = [
    { kind: 'pledge', label: '۱. مشارطه (تعهد)' },
    { kind: 'monitoring', label: '۲. مراقبه (نظارت)' },
    { kind: 'accounting', label: '۳. محاسبه (حساب‌کشی)' },
    { kind: 'reprimand', label: '۴. معاتبه (سرزنش)' },
    { kind: 'discipline', label: '۵. معاقبه (تنبیه)' }
  ];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.persianDate = this.formatPersianDate(new Date());
    if (!this.currentUser) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    this.loadData();
  }

  private loadData(): void {
    const userId = this.currentUser!.studentId ?? 0;
    const today = this.toDateStr(new Date());

    this.api.getSpiritualPracticesForMe().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.practiceItems = items;
        this.buildFormControls();
      },
      error: () => this.showToast('خطا در بارگذاری آیین نامه‌ها', 'error')
    });

    if (userId > 0) {
      this.api.getDailySpiritualEntry(userId, today).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (entry) => {
          if (entry?.id) {
            this.todayEntry = entry;
            this.patchForm(entry);
          }
        }
      });

      this.api.getSpiritualStreak(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => { this.streak = res.streak; }
      });
    }
  }

  private buildFormControls(): void {
    const controlsGroup = this.practiceForm.get('controls') as FormGroup;
    for (const item of this.practiceItems) {
      controlsGroup.addControl(item.key, this.fb.control(false));
    }
  }

  private patchForm(entry: DailySpiritualEntry): void {
    const completed = (entry.completedSteps ?? '').split(',').map(s => s.trim()).filter(Boolean);
    const controlsGroup = this.practiceForm.get('controls') as FormGroup;
    for (const item of this.practiceItems) {
      const ctrl = controlsGroup.get(item.key);
      if (ctrl) {
        ctrl.patchValue(completed.includes(item.key));
      }
    }
    this.practiceForm.patchValue({
      notes: entry.notes ?? '',
      moodScore: entry.moodScore ?? null
    });
  }

  getItemsByKind(kind: string): SpiritualPracticeItem[] {
    return this.practiceItems.filter(i => i.stepKind === kind);
  }

  getStepControl(key: string): FormControl {
    const controls = this.practiceForm.get('controls') as FormGroup;
    const ctrl = controls.get(key) as FormControl | null;
    return ctrl ?? this.fb.control(false);
  }

  onSave(): void {
    if (this.saving || !this.currentUser) return;
    this.saving = true;

    const controls = this.practiceForm.get('controls')?.value as Record<string, boolean> ?? {};
    const completedKeys = Object.entries(controls)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const userId = this.currentUser.studentId ?? 0;
    const payload: UpsertDailySpiritualEntryPayload = {
      userId,
      entryDate: this.toDateStr(new Date()),
      notes: this.practiceForm.get('notes')?.value ?? '',
      moodScore: this.practiceForm.get('moodScore')?.value ?? null,
      completedSteps: completedKeys.join(',')
    };

    this.api.upsertDailySpiritualEntry(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving = false;
        this.practiceForm.markAsPristine();
        this.showToast('ورودی امروز با موفقیت ذخیره شد', 'success');
      },
      error: () => {
        this.saving = false;
        this.showToast('خطا در ذخیره‌سازی', 'error');
      }
    });
  }

  private formatPersianDate(date: Date): string {
    try {
      const jDate = new Date(date);
      return jDate.toLocaleDateString('fa-IR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return date.toLocaleDateString('fa-IR');
    }
  }

  private toDateStr(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 3000);
  }

  logout(): void {
    this.authService.logout();
  }

  goToQuran(): void {
    this.router.navigate(['/quran']);
  }

  goToMath(): void {
    this.router.navigate(['/math']);
  }
}
