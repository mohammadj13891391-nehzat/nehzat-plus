import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Branch, CreateBranchPayload, UpdateBranchPayload } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';
import type { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';

@Component({
  selector: 'app-admin-branches',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-branches-title">
      <header class="section-header">
        <h2 id="admin-branches-title" class="section-title">
          مدیریت شعب
          <span class="count-badge">{{ branches.length }}</span>
        </h2>
        <button type="button" class="btn" (click)="openCreateModal()">افزودن شعبه جدید</button>
      </header>

      <input type="text" [(ngModel)]="searchQuery" placeholder="جستجوی شعبه..." class="search-input" (input)="filterBranches()" />

      @if (loading) {
        <div class="loading-indicator">در حال بارگذاری...</div>
      } @else if (filteredBranches.length === 0) {
        <div class="empty-state">هیچ شعبه‌ای یافت نشد</div>
      } @else {
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نام شعبه</th>
                <th>استان</th>
                <th>توضیحات</th>
                <th>تاریخ ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              @for (branch of filteredBranches; track branch.id; let i = $index) {
                <tr>
                  <td>{{ i + 1 }}</td>
                  <td>{{ branch.name }}</td>
                  <td>{{ branch.province }}</td>
                  <td>{{ branch.description || '—' }}</td>
                  <td>{{ (branch.createdAt ?? '').slice(0, 10) }}</td>
                  <td>
                    <button type="button" class="icon-btn icon-btn--edit" (click)="openEditModal(branch)" title="ویرایش">&#9998;</button>
                    <button type="button" class="icon-btn icon-btn--delete" (click)="confirmDelete(branch)" title="حذف">&#128465;</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    @if (showModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editMode ? 'ویرایش شعبه' : 'افزودن شعبه جدید' }}</h3>
            <button type="button" class="modal-close" (click)="closeModal()">&times;</button>
          </div>
          <form [formGroup]="branchForm" class="modal-body" (ngSubmit)="saveBranch()">
            <div class="form-group">
              <label for="branch-name">نام شعبه <span class="required">*</span></label>
              <input id="branch-name" type="text" formControlName="name" placeholder="مثال: شعبه مرکزی" class="form-input" />
              @if (branchForm.get('name')?.invalid && branchForm.get('name')?.touched) {
                <span class="field-error">نام شعبه الزامی است</span>
              }
            </div>
            <div class="form-group">
              <label for="branch-province">استان <span class="required">*</span></label>
              <input id="branch-province" type="text" formControlName="province" placeholder="مثال: تهران" class="form-input" />
              @if (branchForm.get('province')?.invalid && branchForm.get('province')?.touched) {
                <span class="field-error">استان الزامی است</span>
              }
            </div>
            <div class="form-group">
              <label for="branch-desc">توضیحات</label>
              <textarea id="branch-desc" formControlName="description" placeholder="توضیحات اضافی..." class="form-input" rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">انصراف</button>
              <button type="submit" class="btn" [disabled]="branchForm.invalid || saving">
                {{ saving ? 'در حال ذخیره...' : (editMode ? 'ویرایش' : 'افزودن') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (deleteTarget) {
      <div class="modal-overlay" (click)="cancelDelete()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>تأیید حذف</h3>
            <button type="button" class="modal-close" (click)="cancelDelete()">&times;</button>
          </div>
          <div class="modal-body">
            <p>آیا از حذف شعبه «{{ deleteTarget.name }}» اطمینان دارید؟</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelDelete()">انصراف</button>
            <button type="button" class="btn btn-danger" (click)="doDelete()" [disabled]="deleting">
              {{ deleting ? 'در حال حذف...' : 'حذف' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .count-badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 1.5rem; height: 1.5rem; padding: 0 0.375rem;
      border-radius: 999px; font-size: 0.75rem; font-weight: 600;
      background: var(--lp-primary, #1a73e8); color: #fff;
      margin-left: 0.5rem;
    }
    .search-input {
      width: 100%; padding: 0.5rem 0.75rem; margin-bottom: 0.75rem;
      border: 1px solid var(--lp-border, #d0d5dd); border-radius: 6px;
      font-size: 0.875rem; box-sizing: border-box;
    }
    .loading-indicator, .empty-state {
      text-align: center; padding: 2rem; color: var(--lp-text-secondary, #667085);
    }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td {
      padding: 0.5rem 0.75rem; text-align: right; border-bottom: 1px solid var(--lp-border, #eaecf0);
      font-size: 0.875rem;
    }
    .data-table th { font-weight: 600; color: var(--lp-text-secondary, #667085); }
    .data-table tbody tr:hover { background: var(--lp-hover, #f5f5f5); }
    .icon-btn {
      background: none; border: 1px solid transparent; cursor: pointer;
      padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 1rem;
    }
    .icon-btn--edit:hover { background: #e8f5e9; }
    .icon-btn--delete:hover { background: #ffebee; }
    .section-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;
    }
    .section-title { font-size: 1.125rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
    .btn {
      padding: 0.5rem 1rem; border: none; border-radius: 6px;
      font-size: 0.875rem; cursor: pointer; background: var(--lp-primary, #1a73e8);
      color: #fff; font-weight: 500;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: var(--lp-border, #d0d5dd); color: #333; }
    .btn-danger { background: #d32f2f; color: #fff; }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000;
      display: flex; align-items: center; justify-content: center;
    }
    .modal-content {
      background: #fff; border-radius: 12px; width: 90%; max-width: 500px;
      max-height: 90vh; overflow-y: auto;
    }
    .modal-sm { max-width: 400px; }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.25rem; border-bottom: 1px solid var(--lp-border, #eaecf0);
    }
    .modal-header h3 { margin: 0; font-size: 1rem; }
    .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; padding: 0; }
    .modal-body { padding: 1.25rem; }
    .modal-actions {
      display: flex; gap: 0.5rem; justify-content: flex-end;
      padding: 1rem 1.25rem; border-top: 1px solid var(--lp-border, #eaecf0);
    }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem; }
    .required { color: #d32f2f; }
    .form-input {
      width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--lp-border, #d0d5dd);
      border-radius: 6px; font-size: 0.875rem; box-sizing: border-box; font-family: inherit;
    }
    .form-input.ng-invalid.ng-touched { border-color: #d32f2f; }
    .field-error { color: #d32f2f; font-size: 0.75rem; margin-top: 0.25rem; display: block; }
    textarea.form-input { resize: vertical; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBranchesComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API) as LessonPlannerApi;
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  branches: Branch[] = [];
  filteredBranches: Branch[] = [];
  searchQuery = '';
  loading = false;
  saving = false;
  deleting = false;
  showModal = false;
  editMode = false;
  editingId: number | null = null;
  deleteTarget: Branch | null = null;

  branchForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    province: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading = true;
    this.api.getBranches().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.loading = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: (data) => { this.branches = data; this.filterBranches(); },
      error: () => this.notify.show('خطا در بارگذاری شعب', 'error'),
    });
  }

  filterBranches(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredBranches = q
      ? this.branches.filter(b => b.name.toLowerCase().includes(q) || b.province.toLowerCase().includes(q))
      : [...this.branches];
  }

  openCreateModal(): void {
    this.editMode = false;
    this.editingId = null;
    this.branchForm.reset({ name: '', province: '', description: '' });
    this.showModal = true;
  }

  openEditModal(branch: Branch): void {
    this.editMode = true;
    this.editingId = branch.id;
    this.branchForm.patchValue({ name: branch.name, province: branch.province, description: branch.description ?? '' });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingId = null;
  }

  saveBranch(): void {
    if (this.branchForm.invalid) return;
    this.saving = true;
    const payload: CreateBranchPayload | UpdateBranchPayload = this.branchForm.value;

    const obs$ = this.editMode
      ? this.api.updateBranch(this.editingId!, payload as UpdateBranchPayload)
      : this.api.createBranch(payload as CreateBranchPayload);

    obs$.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.saving = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: () => {
        this.notify.show(this.editMode ? 'شعبه با موفقیت ویرایش شد' : 'شعبه با موفقیت ایجاد شد', 'success');
        this.closeModal();
        this.loadBranches();
      },
      error: () => this.notify.show('خطا در ذخیره شعبه', 'error'),
    });
  }

  confirmDelete(branch: Branch): void {
    this.deleteTarget = branch;
  }

  cancelDelete(): void {
    this.deleteTarget = null;
  }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.deleting = true;
    this.api.deleteBranch(this.deleteTarget.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => { this.deleting = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: () => {
        this.notify.show('شعبه با موفقیت حذف شد', 'success');
        this.deleteTarget = null;
        this.loadBranches();
      },
      error: () => this.notify.show('خطا در حذف شعبه', 'error'),
    });
  }
}
