import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MorabbiApiService } from './morabbi-api.service';
import { Branch, CreateBranchPayload, CreateMaktabPayload, Maktab } from './morabbi.models';

interface MaktabForm {
  name: string;
  code: string;
  description: string;
  active: boolean;
}

interface BranchForm {
  name: string;
  code: string;
  address: string;
  phone: string;
  maktabId: number | null;
  isBoys: boolean;
}

@Component({
  selector: 'app-organization',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">مکتب‌ها و شعب</h1>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>
    <div class="alert alert-success" *ngIf="info()">{{ info() }}</div>

    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">مکتب‌ها</h3>
        <form (ngSubmit)="saveMaktab()" *ngIf="maktabEditing()">
          <div class="grid-2">
            <div class="field">
              <label>نام *</label>
              <input name="mName" [(ngModel)]="maktabForm.name" required />
            </div>
            <div class="field">
              <label>کد *</label>
              <input name="mCode" [(ngModel)]="maktabForm.code" required />
            </div>
          </div>
          <div class="field">
            <label>توضیحات</label>
            <input name="mDesc" [(ngModel)]="maktabForm.description" />
          </div>
          <div class="field" style="display: flex; align-items: center; gap: 8px">
            <input name="mActive" type="checkbox" [(ngModel)]="maktabForm.active" style="width: auto" />
            <label style="margin: 0">فعال</label>
          </div>
          <div style="display: flex; gap: 8px">
            <button class="btn btn-sm" [disabled]="busy()">ذخیره</button>
            <button type="button" class="btn btn-secondary btn-sm" (click)="cancelMaktab()">انصراف</button>
          </div>
        </form>
        <button class="btn btn-secondary btn-sm" (click)="startMaktab()" *ngIf="!maktabEditing()">+ مکتب جدید</button>

        <table class="lp-table" style="margin-top: 14px">
          <thead>
            <tr>
              <th>نام</th>
              <th>کد</th>
              <th>وضعیت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of maktabs()">
              <td>{{ m.name }}</td>
              <td>{{ m.code }}</td>
              <td><span class="badge" [class]="m.active ? 'badge-approved' : 'badge-returned'">{{ m.active ? 'فعال' : 'غیرفعال' }}</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" (click)="startMaktab(m)">ویرایش</button>
                <button class="btn btn-danger btn-sm" (click)="deleteMaktab(m.id)">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <h3 class="card-title">شعب</h3>
        <form (ngSubmit)="saveBranch()" *ngIf="branchEditing()">
          <div class="grid-2">
            <div class="field">
              <label>نام *</label>
              <input name="bName" [(ngModel)]="branchForm.name" required />
            </div>
            <div class="field">
              <label>کد *</label>
              <input name="bCode" [(ngModel)]="branchForm.code" required />
            </div>
          </div>
          <div class="grid-2">
            <div class="field">
              <label>آدرس</label>
              <input name="bAddress" [(ngModel)]="branchForm.address" />
            </div>
            <div class="field">
              <label>تلفن</label>
              <input name="bPhone" [(ngModel)]="branchForm.phone" dir="ltr" />
            </div>
          </div>
          <div class="grid-2">
            <div class="field">
              <label>مکتب</label>
              <select name="bMaktab" [(ngModel)]="branchForm.maktabId">
                <option [ngValue]="null">—</option>
                <option *ngFor="let m of maktabs()" [ngValue]="m.id">{{ m.name }}</option>
              </select>
            </div>
            <div class="field">
              <label>جنسیت</label>
              <select name="bBoys" [(ngModel)]="branchForm.isBoys">
                <option [ngValue]="true">پسرانه</option>
                <option [ngValue]="false">دخترانه</option>
              </select>
            </div>
          </div>
          <div style="display: flex; gap: 8px">
            <button class="btn btn-sm" [disabled]="busy()">ذخیره</button>
            <button type="button" class="btn btn-secondary btn-sm" (click)="cancelBranch()">انصراف</button>
          </div>
        </form>
        <button class="btn btn-secondary btn-sm" (click)="startBranch()" *ngIf="!branchEditing()">+ شعبه جدید</button>

        <table class="lp-table" style="margin-top: 14px">
          <thead>
            <tr>
              <th>نام</th>
              <th>کد</th>
              <th>مکتب</th>
              <th>جنسیت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of branches()">
              <td>{{ b.name }}</td>
              <td>{{ b.code }}</td>
              <td>{{ b.maktab?.name ?? '—' }}</td>
              <td>{{ b.isBoys ? 'پسرانه' : 'دخترانه' }}</td>
              <td>
                <button class="btn btn-secondary btn-sm" (click)="startBranch(b)">ویرایش</button>
                <button class="btn btn-danger btn-sm" (click)="deleteBranch(b.id)">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MorabbiOrganizationComponent implements OnInit {
  private readonly auth = inject(MorabbiApiService);

  readonly maktabs = signal<Maktab[]>([]);
  readonly branches = signal<Branch[]>([]);
  readonly maktabEditing = signal(false);
  readonly branchEditing = signal(false);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);

  maktabForm: MaktabForm = { name: '', code: '', description: '', active: true };
  branchForm: BranchForm = { name: '', code: '', address: '', phone: '', maktabId: null, isBoys: true };
  private maktabEditId: number | null = null;
  private branchEditId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.auth.getMaktabs().subscribe({
      next: (m) => this.maktabs.set(m),
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت مکتب‌ها')
    });
    this.auth.getBranches().subscribe({
      next: (b) => this.branches.set(b),
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت شعب')
    });
  }

  startMaktab(m?: Maktab): void {
    this.maktabEditId = m?.id ?? null;
    this.maktabForm = m
      ? { name: m.name, code: m.code, description: m.description ?? '', active: m.active }
      : { name: '', code: '', description: '', active: true };
    this.branchEditing.set(false);
    this.maktabEditing.set(true);
  }

  cancelMaktab(): void {
    this.maktabEditId = null;
    this.maktabEditing.set(false);
  }

  saveMaktab(): void {
    const payload: CreateMaktabPayload = {
      name: this.maktabForm.name.trim(),
      code: this.maktabForm.code.trim(),
      description: this.maktabForm.description || null,
      active: this.maktabForm.active
    };
    this.busy.set(true);
    this.error.set(null);
    const obs = this.maktabEditId
      ? this.auth.updateMaktab(this.maktabEditId, payload)
      : this.auth.createMaktab(payload);
    obs.subscribe({
      next: () => {
        this.busy.set(false);
        this.info.set('مکتب ذخیره شد.');
        this.cancelMaktab();
        this.load();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'خطا در ذخیره مکتب');
      }
    });
  }

  deleteMaktab(id: number): void {
    if (!confirm('این مکتب حذف شود؟')) return;
    this.auth.deleteMaktab(id).subscribe({
      next: () => {
        this.info.set('مکتب حذف شد.');
        this.load();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در حذف مکتب')
    });
  }

  startBranch(b?: Branch): void {
    this.branchEditId = b?.id ?? null;
    this.branchForm = b
      ? {
          name: b.name,
          code: b.code,
          address: b.address ?? '',
          phone: b.phone ?? '',
          maktabId: b.maktabId,
          isBoys: b.isBoys
        }
      : { name: '', code: '', address: '', phone: '', maktabId: null, isBoys: true };
    this.maktabEditing.set(false);
    this.branchEditing.set(true);
  }

  cancelBranch(): void {
    this.branchEditId = null;
    this.branchEditing.set(false);
  }

  saveBranch(): void {
    const payload: CreateBranchPayload = {
      name: this.branchForm.name.trim(),
      code: this.branchForm.code.trim(),
      address: this.branchForm.address || null,
      phone: this.branchForm.phone || null,
      maktabId: this.branchForm.maktabId,
      isBoys: this.branchForm.isBoys
    };
    this.busy.set(true);
    this.error.set(null);
    const obs = this.branchEditId
      ? this.auth.updateBranch(this.branchEditId, payload)
      : this.auth.createBranch(payload);
    obs.subscribe({
      next: () => {
        this.busy.set(false);
        this.info.set('شعبه ذخیره شد.');
        this.cancelBranch();
        this.load();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'خطا در ذخیره شعبه');
      }
    });
  }

  deleteBranch(id: number): void {
    if (!confirm('این شعبه حذف شود؟')) return;
    this.auth.deleteBranch(id).subscribe({
      next: () => {
        this.info.set('شعبه حذف شد.');
        this.load();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در حذف شعبه')
    });
  }
}
