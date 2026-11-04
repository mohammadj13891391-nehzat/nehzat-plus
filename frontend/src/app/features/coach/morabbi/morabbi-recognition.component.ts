import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MorabbiApiService } from './morabbi-api.service';
import { AwardRecognitionPayload, BoardEntry, PointTransaction, Recognition } from './morabbi.models';
import { formatDate as formatDateFn, roleLabel as roleLabelFn } from './morabbi-labels';

@Component({
  selector: 'app-recognition',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">تشویق‌ها و امتیازها</h1>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>
    <div class="alert alert-success" *ngIf="info()">{{ info() }}</div>

    <div class="tabs">
      <button [class.active]="tab() === 'board'" (click)="tab.set('board')">تابلو افتخارات</button>
      <button [class.active]="tab() === 'list'" (click)="tab.set('list')">فهرست تشویق‌ها</button>
      <button [class.active]="tab() === 'award'" (click)="tab.set('award')" *ngIf="auth.canEvaluate()">اعطای تشویق</button>
      <button [class.active]="tab() === 'points'" (click)="tab.set('points')" *ngIf="auth.isStaff()">امتیازها</button>
    </div>

    <div class="card" *ngIf="tab() === 'board'">
      <div class="empty" *ngIf="board().length === 0">ورودی‌ای یافت نشد.</div>
      <table class="lp-table" *ngIf="board().length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>نام</th>
            <th>نقش</th>
            <th>شعبه</th>
            <th>امتیاز</th>
            <th>تشویق</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let e of board(); let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ e.name }}</td>
            <td>{{ roleLabel(e.role) }}</td>
            <td>{{ e.branchName || '—' }}</td>
            <td><strong>{{ e.totalPoints }}</strong></td>
            <td>{{ e.recognitionsCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" *ngIf="tab() === 'list'">
      <div class="empty" *ngIf="recognitions().length === 0">تشویقی ثبت نشده است.</div>
      <table class="lp-table" *ngIf="recognitions().length > 0">
        <thead>
          <tr>
            <th>تاریخ</th>
            <th>دریافت‌کننده</th>
            <th>عنوان</th>
            <th>سطح</th>
            <th>توضیحات</th>
            <th>اعطاکننده</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of recognitions()">
            <td>{{ formatDate(r.createdAt) }}</td>
            <td>{{ r.user?.name ?? '—' }}</td>
            <td>{{ r.title }}</td>
            <td><span class="badge">{{ r.level }}</span></td>
            <td>{{ r.description || '—' }}</td>
            <td>{{ r.awardedBy || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" *ngIf="tab() === 'award'">
      <h3 class="card-title">اعطای تشویق</h3>
      <div class="field">
        <label>دریافت‌کننده</label>
        <select [(ngModel)]="awardForm.userId">
          <option [ngValue]="null">انتخاب کنید</option>
          <option *ngFor="let u of board()" [ngValue]="u.id">{{ u.name }} — {{ roleLabel(u.role) }}</option>
        </select>
      </div>
      <div class="grid-2">
        <div class="field">
          <label>عنوان *</label>
          <input [(ngModel)]="awardForm.title" />
        </div>
        <div class="field">
          <label>سطح</label>
          <input [(ngModel)]="awardForm.level" placeholder="مثلا: ممتاز" />
        </div>
      </div>
      <div class="field">
        <label>توضیحات</label>
        <textarea [(ngModel)]="awardForm.description"></textarea>
      </div>
      <div class="grid-2">
        <div class="field">
          <label>دوره</label>
          <input [(ngModel)]="awardForm.period" placeholder="مثلا: ۱۴۰۴/۰۷" />
        </div>
        <div class="field">
          <label>امتیاز</label>
          <input type="number" [(ngModel)]="awardForm.points" dir="ltr" />
        </div>
      </div>
      <button class="btn" [disabled]="busy()" (click)="award()">اعطا</button>
    </div>

    <div class="card" *ngIf="tab() === 'points'">
      <div class="field" style="max-width: 320px">
        <label>کاربر</label>
        <select [(ngModel)]="pointsUserId" (change)="loadPoints()">
          <option [ngValue]="null">انتخاب کنید</option>
          <option *ngFor="let u of board()" [ngValue]="u.id">{{ u.name }} — {{ roleLabel(u.role) }}</option>
        </select>
      </div>
      <div class="empty" *ngIf="points().length === 0">ترازوردی در حال حاضر موجود نیست.</div>
      <table class="lp-table" *ngIf="points().length > 0">
        <thead>
          <tr>
            <th>تاریخ</th>
            <th>مبلغ</th>
            <th>دلیل</th>
            <th>توضیحات</th>
            <th>اعطاکننده</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of points()">
            <td>{{ formatDate(t.createdAt) }}</td>
            <td><strong [style.color]="t.amount >= 0 ? 'var(--lp-success)' : 'var(--lp-danger)'">{{ t.amount }}</strong></td>
            <td>{{ t.reason }}</td>
            <td>{{ t.description || '—' }}</td>
            <td>{{ t.awardedBy || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class MorabbiRecognitionComponent implements OnInit {
  readonly auth = inject(MorabbiApiService);
  readonly roleLabel = roleLabelFn;
  readonly formatDate = formatDateFn;

  readonly tab = signal<'board' | 'list' | 'award' | 'points'>('board');
  readonly board = signal<BoardEntry[]>([]);
  readonly recognitions = signal<Recognition[]>([]);
  readonly points = signal<PointTransaction[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);

  awardForm: AwardRecognitionPayload = { userId: 0, level: '', title: '', description: '', period: '', points: 0 };
  pointsUserId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.auth.getRecognitionBoard().subscribe({
      next: (b) => this.board.set(b),
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت تابلو')
    });
    this.auth.getRecognitions().subscribe({
      next: (r) => this.recognitions.set(r),
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت تشویق‌ها')
    });
  }

  loadPoints(): void {
    if (this.pointsUserId) {
      this.auth.getPoints(this.pointsUserId).subscribe({
        next: (p) => this.points.set(p),
        error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت امتیازها')
      });
    }
  }

  award(): void {
    if (!this.awardForm.userId || this.awardForm.userId <= 0) {
      this.error.set('دریافت‌کننده را انتخاب کنید.');
      return;
    }
    if (!this.awardForm.title.trim()) {
      this.error.set('عنوان تشویق الزامی است.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.auth.awardRecognition(this.awardForm).subscribe({
      next: () => {
        this.busy.set(false);
        this.info.set('تشویق با موفقیت اعطا شد.');
        this.awardForm = { userId: 0, level: '', title: '', description: '', period: '', points: 0 };
        this.load();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'خطا در اعطای تشویق');
      }
    });
  }
}
