import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LightragApiService, LightragDocumentStatus, LightragQueryResponse } from './lightrag-api.service';

type QueryMode = 'local' | 'global' | 'hybrid' | 'naive' | 'mix';

const MODE_OPTIONS: Array<{ value: QueryMode; label: string }> = [
  { value: 'hybrid', label: 'ترکیبی (پیش‌فرض)' },
  { value: 'mix', label: 'جامع (ترکیبی + متن)' },
  { value: 'local', label: 'محلی (جزئیات)' },
  { value: 'global', label: 'سراسری (مفهومی)' },
  { value: 'naive', label: 'ساده (فقط جستجوی متنی)' }
];

@Component({
  selector: 'app-lightrag-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">پایگاه دانش</h1>
      <div class="lp-status" *ngIf="health()">
        <span class="lp-dot [ok]=healthOk()"></span>
        <span *ngIf="healthOk()">سرور فعال — {{ docCount() }} سند ایندکس‌شده</span>
        <span *ngIf="!healthOk()">سرور در دسترس نیست</span>
      </div>
    </div>

    <div class="alert alert-error" *ngIf="!health() && healthTried()">
      سرور پایگاه دانش (LightRAG) اجرا نیست. از اسکریپت start-server.ps1 در پوشه scripts/lightrag شروع کنید.
    </div>

    <div class="card">
      <h3 class="card-title">سؤال از اسناد پروژه</h3>
      <p class="lp-hint">پاسخ از روی اسناد ایندکس‌شده (دیکشن‌اسنی‌ها، تحلیل قرآن، AGENTS.md) تولید می‌شود.</p>
      <div class="field">
        <label>سؤال شما</label>
        <textarea
          [(ngModel)]="question"
          rows="4"
          [disabled]="busy()"
          placeholder="مثلاً: چرا MorabbiApiService از inject(HttpBackend) استفاده می‌کند؟"
        ></textarea>
      </div>
      <div class="lp-row">
        <div class="field lp-mode">
          <label>حالت جستجو</label>
          <select [(ngModel)]="mode" [disabled]="busy()">
            <option *ngFor="let m of modeOptions" [value]="m.value">{{ m.label }}</option>
          </select>
        </div>
        @if (busy()) {
          <button class="btn btn-sm" (click)="cancel()">لغو سؤال</button>
        } @else {
          <button class="btn btn-primary" (click)="ask()" [disabled]="!question().trim() || !healthOk()">
            پرسش
          </button>
        }
      </div>
    </div>

    <div class="card lp-loading-card" *ngIf="busy()">
      <div class="lp-spinner"></div>
      <div>در حال پردازش سؤال... این کار می‌تواند تا چند دقیقه طول بکشد.</div>
    </div>

    <div class="alert alert-error" *ngIf="error() && !busy()">{{ error() }}</div>

    <div class="card" *ngIf="answer() && !busy()">
      <h3 class="card-title">پاسخ</h3>
      <div class="lp-answer">{{ answer()!.response }}</div>
      <div class="lp-refs" *ngIf="answer()!.references && answer()!.references!.length > 0">
        <div class="lp-refs-title">منابع:</div>
        <div class="lp-ref" *ngFor="let r of answer()!.references">{{ r.file_path || 'سند' }}</div>
      </div>
    </div>
  `,
  styles: `
    .lp-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--lp-muted, var(--lp-text-muted));
      margin-right: 16px;
    }
    .lp-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--lp-danger);
      display: inline-block;
    }
    .lp-dot.ok {
      background: var(--lp-success);
    }
    .lp-hint {
      font-size: 12px;
      color: var(--lp-muted, var(--lp-text-muted));
      margin: 0 0 12px;
    }
    .lp-row {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      flex-wrap: wrap;
    }
    .lp-mode {
      min-width: 220px;
    }
    .lp-loading-card {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 28px;
      color: var(--lp-muted, var(--lp-text-muted));
    }
    .lp-spinner {
      width: 22px;
      height: 22px;
      border: 3px solid var(--lp-border);
      border-top-color: var(--lp-primary);
      border-radius: 50%;
      animation: lp-spin 0.9s linear infinite;
    }
    @keyframes lp-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .lp-answer {
      white-space: pre-wrap;
      line-height: 1.9;
      font-size: 14px;
    }
    .lp-refs {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--lp-border);
    }
    .lp-refs-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--lp-muted, var(--lp-text-muted));
      margin-bottom: 6px;
    }
    .lp-ref {
      font-size: 12px;
      color: var(--lp-accent, var(--lp-gold));
      direction: ltr;
      text-align: left;
    }
  `
})
export class LightragPageComponent implements OnInit, OnDestroy {
  private readonly api = inject(LightragApiService);

  readonly modeOptions = MODE_OPTIONS;
  readonly question = signal('');
  readonly mode = signal<QueryMode>('hybrid');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly answer = signal<LightragQueryResponse | null>(null);
  readonly health = signal<{ ok: boolean; processed: number; errorCount: number } | null>(null);
  readonly healthTried = signal(false);

  private activeSub: Subscription | null = null;

  healthOk(): boolean {
    return this.health()?.ok ?? false;
  }

  docCount(): number {
    return this.health()?.processed ?? 0;
  }

  ngOnInit(): void {
    this.checkHealth();
  }

  ngOnDestroy(): void {
    this.activeSub?.unsubscribe();
  }

  private checkHealth(): void {
    this.api
      .health()
      .pipe()
      .subscribe({
        next: (h) => {
          this.healthTried.set(true);
          this.health.set({ ok: h.status === 'healthy', processed: 0, errorCount: 0 });
          this.api.documentStatus().subscribe({
            next: (d) => {
              const counts = d.status_counts ?? {};
              const processed = (counts['processed'] as number) ?? 0;
              const failed = (counts['failed'] as number) ?? 0;
              this.health.update((prev) => (prev ? { ...prev, processed, errorCount: failed } : prev));
            },
            error: () => {}
          });
        },
        error: () => {
          this.healthTried.set(true);
          this.health.set({ ok: false, processed: 0, errorCount: 0 });
        }
      });
  }

  ask(): void {
    const text = this.question().trim();
    if (!text || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.answer.set(null);
    this.activeSub?.unsubscribe();
    this.activeSub = this.api.query(text, this.mode()).subscribe({
      next: (res) => {
        this.answer.set(res);
        this.busy.set(false);
      },
      error: (err) => {
        const msg = err?.error?.detail ?? 'پرسش از پایگاه دانش ناموفق بود. سرور LightRAG را بررسی کنید.';
        this.error.set(typeof msg === 'string' ? msg : 'پرسش از پایگاه دانش ناموفق بود.');
        this.busy.set(false);
      }
    });
  }

  cancel(): void {
    this.activeSub?.unsubscribe();
    this.busy.set(false);
  }
}
