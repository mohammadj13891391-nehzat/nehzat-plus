import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Madrasah, MaktabBranch, CreateMaktabBranchPayload, Branch } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-makatib',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-makatib-title">
      <header class="section-header">
        <h2 id="admin-makatib-title" class="section-title">مدیریت مکاتب و شعب</h2>
      </header>

      <div class="tabs" style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 2px solid var(--lp-border); padding-bottom: 0.25rem">
        <button type="button" class="tab-btn" [class.active]="maktabTab === 'madrasahs'" (click)="setMaktabTab('madrasahs')">مدیریت مکاتب</button>
        <button type="button" class="tab-btn" [class.active]="maktabTab === 'branches'" (click)="setMaktabTab('branches')">مدیریت شعب مکتب</button>
      </div>

      <!-- MADRASAHS TAB -->
      @if (maktabTab === 'madrasahs') {
        <div class="split-grid">
          <div>
            <input type="text" [(ngModel)]="searchMadrasahQuery" placeholder="جستجوی مکتب..." class="search-input" />
            <button type="button" class="btn btn-secondary" (click)="startCreateMadrasah()" style="margin-bottom: 0.5rem">افزودن مکتب جدید</button>
            @if (loadingMadrasahs) {
              <p class="muted">در حال دریافت مکاتب...</p>
            } @else if (filteredMadrasahs.length === 0) {
              <p class="muted">مکتبی یافت نشد.</p>
            } @else {
              <div class="select-list">
                @for (madrasah of filteredMadrasahs; track madrasah.id) {
                  <button type="button" class="list-item" [class.is-selected]="selectedMadrasahId === madrasah.id" (click)="selectMadrasah(madrasah.id)">
                    <div class="list-item-top">
                      <strong>{{ madrasah.name }}</strong>
                      <span class="status-chip" [class.status-chip--active]="madrasah.status === 'active'" [class.status-chip--inactive]="madrasah.status !== 'active'">
                        {{ madrasah.status === 'active' ? 'فعال' : 'غیرفعال' }}
                      </span>
                    </div>
                    <span class="list-meta">{{ madrasah.gender === 'girls' ? 'دخترانه' : 'پسرانه' }} | پایه {{ madrasah.grade }}</span>
                  </button>
                }
              </div>
            }
          </div>
          <form [formGroup]="madrasahForm" class="editor-form" (ngSubmit)="saveMadrasah()">
            <h3>{{ madrasahEditMode ? 'ویرایش مکتب' : 'مکتب جدید' }}</h3>
            <label>نام مکتب <input type="text" formControlName="name" /></label>
            <label>کلید یکتا <input type="text" formControlName="key" /></label>
            <label>برچسب <input type="text" formControlName="label" /></label>
            <label>
              سطح
              <select formControlName="level">
                <option value="7 سال اول">7 سال اول</option>
                <option value="7 سال دوم">7 سال دوم</option>
                <option value="7 سال سوم">7 سال سوم</option>
              </select>
            </label>
            <label>
              جنسیت
              <select formControlName="gender">
                <option value="girls">دخترانه</option>
                <option value="boys">پسرانه</option>
              </select>
            </label>
            <label>پایه <input type="number" formControlName="grade" min="1" max="7" /></label>
            <label>ظرفیت <input type="number" formControlName="capacity" min="1" /></label>
            <div class="row-actions">
              <button type="submit" class="btn" [disabled]="madrasahForm.invalid || savingMadrasah">
                {{ savingMadrasah ? 'در حال ذخیره...' : madrasahEditMode ? 'ذخیره تغییرات' : 'ایجاد مکتب' }}
              </button>
              @if (madrasahEditMode && selectedMadrasahId !== null) {
                <button type="button" class="btn btn-secondary" [disabled]="savingMadrasah" (click)="deleteMadrasah(selectedMadrasahId)">حذف مکتب</button>
              }
            </div>
          </form>
        </div>
      }

      <!-- BRANCHES TAB -->
      @if (maktabTab === 'branches') {
        <div>
          <label>انتخاب مکتب
            <select [(ngModel)]="selectedBranchMadrasahId" (ngModelChange)="loadMaktabBranchesForSelectedMadrasah()">
              <option [value]="null">— انتخاب کنید —</option>
              @for (madrasah of madrasahs; track madrasah.id) {
                <option [value]="madrasah.id">{{ madrasah.name }}</option>
              }
            </select>
          </label>

          @if (selectedBranchMadrasahId !== null) {
            <div style="margin-top: 1rem">
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem">
                <input type="text" [(ngModel)]="newMaktabBranchName" placeholder="نام شعبه جدید" class="search-input" />
                <input type="text" [(ngModel)]="newMaktabBranchProvince" placeholder="استان" class="search-input" style="max-width: 120px" />
                <button type="button" class="btn btn-secondary" [disabled]="!newMaktabBranchName.trim() || !newMaktabBranchProvince.trim() || savingMaktabBranch" (click)="createMaktabBranch()">
                  {{ savingMaktabBranch ? '...' : 'افزودن شعبه' }}
                </button>
              </div>

              @if (loadingMaktabBranches) {
                <p class="muted">در حال دریافت شعب...</p>
              } @else if (maktabBranches.length === 0) {
                <p class="muted">شعبه‌ای برای این مکتب ثبت نشده است.</p>
              } @else {
                <div class="branch-list">
                  @for (b of maktabBranches; track b.id) {
                    <div class="branch-item">
                      <span class="branch-name">{{ b.name }}</span>
                      <span class="list-meta">{{ b.province }}</span>
                      <span class="status-chip" [class.status-chip--active]="b.status === 'active'" [class.status-chip--inactive]="b.status !== 'active'">
                        {{ b.status === 'active' ? 'فعال' : 'غیرفعال' }}
                      </span>
                      <button type="button" class="btn-remove" (click)="deleteMaktabBranch(b.id)" title="حذف شعبه">✕</button>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMakatibComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  madrasahs: Madrasah[] = [];
  loadingMadrasahs = false;
  searchMadrasahQuery = '';
  selectedMadrasahId: number | null = null;
  madrasahEditMode = false;
  savingMadrasah = false;
  maktabTab: 'madrasahs' | 'branches' = 'madrasahs';

  madrasahForm: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    key: ['', [Validators.required]],
    label: ['', [Validators.required]],
    level: ['', [Validators.required]],
    gender: ['girls'],
    grade: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
    capacity: [30, [Validators.required, Validators.min(1)]],
    status: ['active'],
  });

  // Branch (MaktabBranch) state
  maktabBranches: MaktabBranch[] = [];
  loadingMaktabBranches = false;
  savingMaktabBranch = false;
  selectedBranchMadrasahId: number | null = null;
  newMaktabBranchName = '';
  newMaktabBranchProvince = '';

  errorMessage = '';
  successMessage = '';

  get filteredMadrasahs(): Madrasah[] {
    const q = this.searchMadrasahQuery.trim().toLowerCase();
    if (!q) return this.madrasahs;
    return this.madrasahs.filter((m) => m.name.toLowerCase().includes(q));
  }

  loadMadrasahs(): void {
    this.loadingMadrasahs = true;
    this.api
      .getMadrasahs()
      .pipe(finalize(() => (this.loadingMadrasahs = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (madrasahs) => {
          this.madrasahs = madrasahs;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت مکاتب با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  startCreateMadrasah(): void {
    this.madrasahEditMode = false;
    this.selectedMadrasahId = null;
    this.madrasahForm.reset({
      name: '', key: '', label: '', level: '',
      gender: 'girls', grade: 1, capacity: 30, status: 'active',
    });
  }

  selectMadrasah(madrasahId: number): void {
    const madrasah = this.madrasahs.find((m) => m.id === madrasahId);
    if (!madrasah) return;
    this.selectedMadrasahId = madrasahId;
    this.madrasahEditMode = true;
    this.madrasahForm.setValue({
      name: madrasah.name,
      key: madrasah.key,
      label: madrasah.label,
      level: madrasah.level,
      gender: madrasah.gender,
      grade: madrasah.grade,
      capacity: madrasah.capacity ?? 30,
      status: madrasah.status,
    });
  }

  saveMadrasah(): void {
    if (this.madrasahForm.invalid) return;
    const raw = this.madrasahForm.getRawValue();
    this.savingMadrasah = true;
    const request$ =
      this.madrasahEditMode && this.selectedMadrasahId !== null
        ? this.api.updateMadrasah(this.selectedMadrasahId, raw)
        : this.api.createMadrasah(raw);

    request$
      .pipe(finalize(() => (this.savingMadrasah = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('مکتب ذخیره شد.');
          this.loadMadrasahs();
        },
        error: () => {
          this.setError('ذخیره مکتب با خطا مواجه شد.');
        },
      });
  }

  deleteMadrasah(madrasahId: number): void {
    if (this.savingMadrasah) return;
    this.savingMadrasah = true;
    this.api
      .deleteMadrasah(madrasahId)
      .pipe(finalize(() => (this.savingMadrasah = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('مکتب حذف شد.');
          if (this.selectedMadrasahId === madrasahId) this.startCreateMadrasah();
          this.loadMadrasahs();
        },
        error: () => {
          this.setError('حذف مکتب با خطا مواجه شد.');
        },
      });
  }

  /* ──────────────────────────────────────
   * MaktabBranch operations
   * ────────────────────────────────────── */

  loadMaktabBranchesForSelectedMadrasah(): void {
    const madrasahId = this.selectedBranchMadrasahId;
    if (madrasahId === null) {
      this.maktabBranches = [];
      return;
    }
    this.loadingMaktabBranches = true;
    this.api
      .getMaktabBranches(madrasahId)
      .pipe(finalize(() => (this.loadingMaktabBranches = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (branches) => {
          this.maktabBranches = branches;
          this.cdr.markForCheck();
        },
        error: () => {
          this.setError('دریافت شعب با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  createMaktabBranch(): void {
    const name = this.newMaktabBranchName.trim();
    const province = this.newMaktabBranchProvince.trim();
    const madrasahId = this.selectedBranchMadrasahId;
    if (!name || !province || madrasahId === null) return;

    this.savingMaktabBranch = true;
    this.api
      .createMaktabBranch(madrasahId, { name, province, status: 'active' })
      .pipe(finalize(() => (this.savingMaktabBranch = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('شعبه اضافه شد.');
          this.newMaktabBranchName = '';
          this.newMaktabBranchProvince = '';
          this.loadMaktabBranchesForSelectedMadrasah();
        },
        error: () => {
          this.setError('افزودن شعبه با خطا مواجه شد.');
        },
      });
  }

  deleteMaktabBranch(branchId: number): void {
    const madrasahId = this.selectedBranchMadrasahId;
    if (madrasahId === null || this.savingMaktabBranch) return;

    this.savingMaktabBranch = true;
    this.api
      .deleteMaktabBranch(madrasahId, branchId)
      .pipe(finalize(() => (this.savingMaktabBranch = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('شعبه حذف شد.');
          this.loadMaktabBranchesForSelectedMadrasah();
        },
        error: () => {
          this.setError('حذف شعبه با خطا مواجه شد.');
        },
      });
  }

  setMaktabTab(tab: 'madrasahs' | 'branches'): void {
    this.maktabTab = tab;
    if (tab === 'madrasahs' && this.madrasahs.length === 0) this.loadMadrasahs();
    if (tab === 'branches' && this.madrasahs.length === 0) this.loadMadrasahs();
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
  }
}
