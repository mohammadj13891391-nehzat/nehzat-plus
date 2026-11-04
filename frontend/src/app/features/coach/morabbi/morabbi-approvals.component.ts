import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MorabbiApiService } from './morabbi-api.service';
import { AuthUserDto } from './morabbi.models';
import { roleLabel as roleLabelFn } from './morabbi-labels';

@Component({
  selector: 'app-approvals',
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">تأیید کاربران</h1>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>
    <div class="alert alert-success" *ngIf="info()">{{ info() }}</div>

    <div class="card">
      <div class="empty" *ngIf="list().length === 0">درخواستی در انتظار نیست.</div>
      <table class="lp-table" *ngIf="list().length > 0">
        <thead>
          <tr>
            <th>نام</th>
            <th>تلفن</th>
            <th>نقش</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of list()">
            <td>{{ u.name }}</td>
            <td dir="ltr">{{ u.phone }}</td>
            <td>{{ roleLabel(u.role) }}</td>
            <td><span class="badge badge-pending">در انتظار</span></td>
            <td>
              <button class="btn btn-sm" [disabled]="busyId() === u.id" (click)="decide(u, true)">تأیید</button>
              <button class="btn btn-danger btn-sm" [disabled]="busyId() === u.id" (click)="decide(u, false)">رد</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class MorabbiApprovalsComponent implements OnInit {
  readonly auth = inject(MorabbiApiService);
  readonly roleLabel = roleLabelFn;

  readonly list = signal<AuthUserDto[]>([]);
  readonly busyId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.auth.pendingApprovals().subscribe({
      next: (l) => this.list.set(l),
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت درخواست‌ها')
    });
  }

  decide(u: AuthUserDto, approved: boolean): void {
    this.busyId.set(u.id);
    this.error.set(null);
    this.info.set(null);
    this.auth.approveUser({ userId: u.id, approved }).subscribe({
      next: () => {
        this.busyId.set(null);
        this.info.set(approved ? `کاربر «${u.name}» تأیید شد.` : `درخواست «${u.name}» رد شد.`);
        this.load();
      },
      error: (err) => {
        this.busyId.set(null);
        this.error.set(err?.error?.message ?? 'خطا در تصمیم‌گیری');
      }
    });
  }
}
