import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MorabbiApiService } from './morabbi-api.service';
import { Branch, LessonPlan } from './morabbi.models';
import { formatDate as formatDateFn, statusLabel as statusLabelFn } from './morabbi-labels';

@Component({
  selector: 'app-lesson-plans-list',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h1 class="page-title">طرح‌های درس</h1>
      <div class="toolbar">
        <select [(ngModel)]="branchFilter" (change)="load()" *ngIf="auth.isStaff()">
          <option [ngValue]="null">همه شعب</option>
          <option *ngFor="let b of branches()" [ngValue]="b.id">{{ b.name }}</option>
        </select>
        <select [(ngModel)]="statusFilter" (change)="applyStatusFilter()">
          <option value="">همه وضعیت‌ها</option>
          <option *ngFor="let s of statuses" [value]="s">{{ statusLabel(s) }}</option>
        </select>
        <a routerLink="/coach/lesson-plans/new" class="btn">+ طرح جدید</a>
      </div>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>

    <div class="card">
      <div class="empty" *ngIf="filtered().length === 0">طرح درسی یافت نشد.</div>
      <table class="lp-table lp-stackable" *ngIf="filtered().length > 0">
        <thead>
          <tr>
            <th>عنوان</th>
            <th>موضوع</th>
            <th>مربی</th>
            <th>شعبه</th>
            <th>جلسه‌ها</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of filtered()" class="clickable" (click)="open(p.id)">
            <td data-label="عنوان">{{ p.title }}</td>
            <td data-label="موضوع">{{ p.subject || '—' }}</td>
            <td data-label="مربی">{{ p.instructor?.name ?? '—' }}</td>
            <td data-label="شعبه">{{ p.branch?.name ?? '—' }}</td>
            <td data-label="جلسه‌ها">{{ p.sessionCount }}</td>
            <td data-label="وضعیت"><span class="badge badge-{{ p.status || 'draft' }}">{{ statusLabel(p.status) }}</span></td>
            <td data-label="عملیات" (click)="$event.stopPropagation()">
              <button class="btn btn-secondary btn-sm" (click)="open(p.id)">مشاهده</button>
              <button *ngIf="canEdit(p)" class="btn btn-secondary btn-sm" (click)="router.navigate(['/coach/lesson-plans', p.id, 'edit'])">ویرایش</button>
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
export class MorabbiLessonPlansListComponent implements OnInit {
  readonly auth = inject(MorabbiApiService);
  readonly router = inject(Router);
  readonly statusLabel = statusLabelFn;
  readonly formatDate = formatDateFn;

  readonly branches = signal<Branch[]>([]);
  readonly plans = signal<LessonPlan[]>([]);
  readonly filtered = signal<LessonPlan[]>([]);
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
    this.auth.getLessonPlans(branchId).subscribe({
      next: (list) => {
        this.plans.set(list);
        this.applyStatusFilter();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت طرح‌ها')
    });
  }

  canEdit(p: LessonPlan): boolean {
    const u = this.auth.user();
    if (!u) return false;
    if (this.auth.isStaff()) return true;
    return p.instructorId === u.id && (p.status === 'DRAFT' || p.status === 'RETURNED');
  }

  open(id: number): void {
    this.router.navigate(['/coach/lesson-plans', id]);
  }

  applyStatusFilter(): void {
    const all = this.plans();
    this.filtered.set(this.statusFilter ? all.filter((p) => p.status === this.statusFilter) : all);
  }
}
