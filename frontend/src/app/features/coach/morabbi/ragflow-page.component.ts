import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  RagflowApiService,
  RagflowDataset,
  RagflowRetrievalData
} from './ragflow-api.service';

@Component({
  selector: 'app-ragflow-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">پاسخ‌گو (RAGFlow)</h1>
      <div class="lp-status" *ngIf="healthTried()">
        <span class="lp-dot [ok]=serverOk()"></span>
        <span *ngIf="serverOk()">سرور فعال — {{ datasets().length }} داده‌سنت</span>
        <span *ngIf="!serverOk()">سرور در دسترس نیست</span>
      </div>
    </div>

    <div class="alert alert-error" *ngIf="healthTried() && !serverOk()">
      سرور RAGFlow اجرا نیست. از اسکریپت start-server.ps1 در پوشه scripts/ragflow شروع کنید (Docker).
    </div>

    <div class="card" *ngIf="serverOk()">
      <h3 class="card-title">داده‌سنت‌ها</h3>
      <p class="lp-hint">برای جستجو حداقل یک داده‌سنت را انتخاب کنید.</p>
      <div class="rf-datasets" *ngIf="datasets().length > 0">
        <label class="rf-dataset" *ngFor="let d of datasets()">
          <input type="checkbox" [checked]="isSelected(d.id)" (change)="toggleDataset(d.id)" [disabled]="busy()" />
          <span class="rf-ds-name">{{ d.name }}</span>
          <span class="rf-ds-meta" *ngIf="d.document_count != null">{{ d.document_count }} سند</span>
        </label>
      </div>
      <div class="alert alert-error" *ngIf="datasetsError()">{{ datasetsError() }}</div>
      <div class="lp-hint" *ngIf="!datasetsLoading() && !datasetsError() && datasets().length === 0">
        داده‌سنتی وجود ندارد — ابتدا در رابط RAGFlow یک داده‌سنت بسازید و سند بارگذاری کنید.
      </div>
      <div class="lp-row" *ngIf="selectedCount() > 0">
        <button class="btn btn-sm" (click)="clearSelection()">حذف انتخاب</button>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">جستجو در اسناد</h3>
      <p class="lp-hint">متون مرتبط با امتیاز شباهت و نام سند منبع نمایش داده می‌شوند.</p>
      <div class="field">
        <label>پرسش شما</label>
        <textarea
          [(ngModel)]="question"
          rows="4"
          [disabled]="busy()"
          placeholder="مثلاً: روش تدبر در حلقه‌ها چیست؟"
        ></textarea>
      </div>
      <div class="lp-row">
        @if (busy()) {
          <button class="btn btn-sm" (click)="cancel()">لغو جستجو</button>
        } @else {
          <button class="btn btn-primary" (click)="ask()" [disabled]="!canAsk()">
            جستجو
          </button>
        }
      </div>
    </div>

    <div class="card lp-loading-card" *ngIf="busy()">
      <div class="lp-spinner"></div>
      <div>در حال جستجو در اسناد...</div>
    </div>

    <div class="alert alert-error" *ngIf="error() && !busy()">{{ error() }}</div>

    <div class="card" *ngIf="results() && !busy()">
      <h3 class="card-title">نتایج — {{ resultsTotal() }} متن مرتبط</h3>
      @for (chunk of results()!.chunks ?? []; track $index) {
        <div class="rf-chunk">
          <div class="rf-chunk-head">
            <span class="rf-chunk-doc">{{ chunk.document_keyword || 'سند' }}</span>
            <span class="rf-chunk-score" *ngIf="chunk.similarity != null">
              {{ (chunk.similarity * 100 | number: '1.0-0') }}%
            </span>
          </div>
          <div class="rf-chunk-content">{{ chunk.content }}</div>
        </div>
      }
      <p class="lp-hint" *ngIf="(results()!.chunks?.length ?? 0) === 0">متن مرتبطی یافت نشد.</p>
      <div class="lp-refs" *ngIf="(results()!.doc_aggs?.length ?? 0) > 0">
        <div class="lp-refs-title">منابع:</div>
        <div class="lp-ref" *ngFor="let d of results()!.doc_aggs">
          {{ d.doc_name || 'سند' }} — {{ d.count }} بخش
        </div>
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
    .rf-datasets {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }
    .rf-dataset {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      cursor: pointer;
      padding: 8px 12px;
      border: 1px solid var(--lp-border);
      border-radius: 8px;
    }
    .rf-dataset:hover {
      border-color: var(--lp-primary);
    }
    .rf-ds-name {
      font-weight: 600;
    }
    .rf-ds-meta {
      font-size: 11px;
      color: var(--lp-muted, var(--lp-text-muted));
    }
    .rf-chunk {
      padding: 12px 0;
      border-bottom: 1px solid var(--lp-border);
    }
    .rf-chunk:last-child {
      border-bottom: none;
    }
    .rf-chunk-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 6px;
    }
    .rf-chunk-doc {
      font-size: 12px;
      font-weight: 700;
      color: var(--lp-accent, var(--lp-gold));
    }
    .rf-chunk-score {
      font-size: 11px;
      color: var(--lp-muted, var(--lp-text-muted));
      direction: ltr;
    }
    .rf-chunk-content {
      white-space: pre-wrap;
      line-height: 1.8;
      font-size: 13px;
    }
  `
})
export class RagflowPageComponent implements OnInit, OnDestroy {
  private readonly api = inject(RagflowApiService);

  readonly healthTried = signal(false);
  readonly serverOk = signal(false);
  readonly datasets = signal<RagflowDataset[]>([]);
  readonly datasetsLoading = signal(false);
  readonly datasetsError = signal<string | null>(null);
  readonly selected = signal<string[]>([]);
  readonly question = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly results = signal<RagflowRetrievalData | null>(null);

  private activeSub: Subscription | null = null;

  ngOnInit(): void {
    this.api.health().subscribe({
      next: () => {
        this.healthTried.set(true);
        this.serverOk.set(true);
        this.loadDatasets();
      },
      error: () => {
        this.healthTried.set(true);
        this.serverOk.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.activeSub?.unsubscribe();
  }

  isSelected(id: string): boolean {
    return this.selected().includes(id);
  }

  toggleDataset(id: string): void {
    this.selected.update((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  selectedCount(): number {
    return this.selected().length;
  }

  clearSelection(): void {
    this.selected.set([]);
  }

  canAsk(): boolean {
    return this.serverOk() && this.question().trim().length > 0 && this.selected().length > 0;
  }

  resultsTotal(): number {
    return this.results()?.total ?? this.results()?.chunks?.length ?? 0;
  }

  ask(): void {
    const text = this.question().trim();
    if (!text || !this.canAsk()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.results.set(null);
    this.activeSub?.unsubscribe();
    this.activeSub = this.api.retrieve(text, this.selected()).subscribe({
      next: (res) => {
        this.results.set(res);
        this.busy.set(false);
      },
      error: (err) => {
        this.error.set(this.describeError(err));
        this.busy.set(false);
      }
    });
  }

  cancel(): void {
    this.activeSub?.unsubscribe();
    this.busy.set(false);
  }

  private loadDatasets(): void {
    this.datasetsLoading.set(true);
    this.datasetsError.set(null);
    this.api.listDatasets().subscribe({
      next: (list) => {
        this.datasets.set(list);
        this.datasetsLoading.set(false);
      },
      error: (err) => {
        this.datasetsError.set(this.describeError(err));
        this.datasetsLoading.set(false);
      }
    });
  }

  private describeError(err: unknown): string {
    const envelope = err as { code?: unknown; message?: unknown } | null;
    if (envelope && typeof envelope === 'object' && typeof envelope.code === 'number' && typeof envelope.message === 'string') {
      return envelope.message;
    }
    const http = err as { error?: { message?: unknown } } | null;
    if (http?.error && typeof http.error.message === 'string') {
      return http.error.message;
    }
    return 'جستجو از RAGFlow ناموفق بود. مطمئن شوید سرور RAGFlow اجرا می‌شود.';
  }
}
