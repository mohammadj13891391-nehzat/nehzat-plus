import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MorabbiApiService } from './morabbi-api.service';
import { Branch, DailyReport } from './morabbi.models';
import { formatDate as formatDateFn, statusLabel as statusLabelFn } from './morabbi-labels';

@Component({
  selector: 'app-reports-list',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h1 class="page-title">گزارش‌های روزانه</h1>
      <div class="toolbar">
        <select [(ngModel)]="branchFilter" (change)="load()" *ngIf="auth.isStaff()">
          <option [ngValue]="null">همه شعب</option>
          <option *ngFor="let b of branches()" [ngValue]="b.id">{{ b.name }}</option>
        </select>
        <select [(ngModel)]="statusFilter" (change)="applyStatusFilter()">
          <option value="">همه وضعیت‌ها</option>
          <option *ngFor="let s of statuses" [value]="s">{{ statusLabel(s) }}</option>
        </select>
        <a routerLink="/coach/reports/new" class="btn">+ گزارش جدید</a>
      </div>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>

    <div class="card">
      <div class="empty" *ngIf="filtered().length === 0">گزارشی یافت نشد.</div>
      <table class="lp-table" *ngIf="filtered().length > 0">
        <thead>
          <tr>
            <th>تاریخ</th>
            <th>موضوع</th>
            <th>مربی</th>
            <th>شعبه</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of filtered()" class="clickable" (click)="open(r.id)">
            <td>{{ formatDate(r.date) }}</td>
            <td>{{ r.subject }}</td>
            <td>{{ r.instructor?.name ?? '—' }}</td>
            <td>{{ r.branch?.name ?? '—' }}</td>
            <td><span class="badge badge-{{ r.status || 'draft' }}">{{ statusLabel(r.status) }}</span></td>
            <td (click)="$event.stopPropagation()">
              <button class="btn btn-secondary btn-sm" (click)="open(r.id)">مشاهده</button>
              <button *ngIf="canEdit(r)" class="btn btn-secondary btn-sm" (click)="router.navigate(['/coach/reports', r.id, 'edit'])">ویرایش</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
    td {
      font-size: 13px;
    }
    .btn {
      margin-left: 4px;
    }
  `
})
export class MorabbiReportsListComponent implements OnInit {
  readonly auth = inject(MorabbiApiService);
  readonly router = inject(Router);
  readonly statusLabel = statusLabelFn;
  readonly formatDate = formatDateFn;

  readonly branches = signal<Branch[]>([]);
  readonly reports = signal<DailyReport[]>([]);
  readonly filtered = signal<DailyReport[]>([]);
  readonly error = signal<string | null>(null);
  readonly statuses = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'RETURNED'];

  branchFilter: number | null = null;
  statusFilter = '';

  ngOnInit(): void {
    this.auth.getBranches().subscribe((b) => this.branches.set(b));
    this.load();
  }

  load(): void {
    const branchId = this.auth.isStaff() ? this.branchFilter ?? undefined : undefined;
    this.auth.getReports(branchId).subscribe({
      next: (list) => {
        this.reports.set(list);
        this.applyStatusFilter();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت گزارش‌ها')
    });
  }

  canEdit(r: DailyReport): boolean {
    const u = this.auth.user();
    if (!u) return false;
    if (this.auth.isStaff()) return true;
    return r.instructorId === u.id && (r.status === 'DRAFT' || r.status === 'RETURNED');
  }

  open(id: number): void {
    this.router.navigate(['/coach/reports', id]);
  }

  applyStatusFilter(): void {
    const all = this.reports();
    this.filtered.set(this.statusFilter ? all.filter((r) => r.status === this.statusFilter) : all);
  }
}
