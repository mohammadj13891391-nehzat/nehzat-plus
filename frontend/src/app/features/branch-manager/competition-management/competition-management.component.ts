import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import type {
  Competition,
  CompetitionDetail,
  CompetitionParticipant,
  CompetitionResult,
  CompetitionType,
  CreateCompetitionPayload,
  UpdateCompetitionPayload,
  RegisterParticipantPayload,
  UpdateParticipantScorePayload
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-competition-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .competition-page { direction: rtl; min-height: 100vh; padding: 1rem; display: grid; gap: 1rem; background: var(--lp-bg, #f8f9fa); }
    .toast { position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); z-index: 9999; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; font-size: 0.9rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); animation: slideDown 0.3s ease; }
    .toast-success { background: #065f46; color: #fff; }
    .toast-error { background: #991b1b; color: #fff; }
    @keyframes slideDown { from { transform: translateX(-50%) translateY(-20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
    .page-header { background: linear-gradient(135deg, var(--lp-primary, #1a6b3c) 0%, #0f3d22 100%); border-radius: 18px; padding: 0.75rem 1.25rem; display: flex; justify-content: space-between; align-items: center; color: #fff; box-shadow: 0 4px 16px rgba(26, 107, 60, 0.2); }
    .header-content { display: flex; align-items: center; gap: 0.75rem; }
    .header-content h1 { margin: 0; font-size: 1.1rem; color: #fff; }
    .header-actions { display: flex; gap: 0.5rem; }
    .logo { width: 42px; height: 42px; border-radius: 12px; object-fit: cover; border: 2px solid rgba(255,255,255,0.2); }
    .card { background: var(--lp-surface, #fff); border: 1px solid var(--lp-border, #ddd5c5); border-radius: 18px; padding: 1.25rem; box-shadow: 0 8px 24px rgba(30,27,20,0.06); }
    .card-title { margin: 0 0 1rem; font-size: 1.1rem; }
    .form-card { margin-top: 0.5rem; }
    .form-layout { display: grid; gap: 0.85rem; }
    .form-group { display: grid; gap: 0.35rem; font-size: 0.9rem; }
    .form-group label { font-weight: 600; color: var(--lp-text, #1e1b14); }
    .form-control { width: 100%; padding: 0.55rem 0.75rem; border: 1px solid var(--lp-border, #ddd5c5); border-radius: 12px; background: var(--lp-surface, #fff); color: var(--lp-text, #1e1b14); font: inherit; }
    .form-control:focus { outline: none; border-color: var(--lp-gold, #b8942e); box-shadow: 0 0 0 3px rgba(184,148,46,0.12); }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; }
    .form-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .btn { border: 1px solid transparent; border-radius: 12px; padding: 0.55rem 0.95rem; cursor: pointer; font-weight: 600; font: inherit; transition: background 0.2s; }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-primary { background: var(--lp-primary, #1a6b3c); color: #fff; }
    .btn-primary:hover:not(:disabled) { background: var(--lp-primary-hover, #14522d); }
    .btn-secondary { background: var(--lp-surface, #fff); color: var(--lp-text, #1e1b14); border-color: var(--lp-border, #ddd5c5); }
    .btn-secondary:hover:not(:disabled) { background: #f0ece4; }
    .btn-danger { background: var(--lp-danger, #b91c1c); color: #fff; }
    .btn-danger:hover:not(:disabled) { background: #991b1b; }
    .btn-sm { padding: 0.35rem 0.65rem; font-size: 0.85rem; }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .data-table th, .data-table td { padding: 0.65rem 0.75rem; text-align: right; border-bottom: 1px solid var(--lp-border, #ddd5c5); }
    .data-table th { color: var(--lp-muted, #7a7468); font-weight: 600; background: var(--lp-bg, #f6f3ed); }
    .badge { display: inline-block; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; background: var(--lp-bg, #f6f3ed); color: var(--lp-muted, #7a7468); }
    .badge-active { background: #dbeafe; color: #1e40af; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .info-item dt { font-size: 0.8rem; color: var(--lp-muted, #7a7468); }
    .info-item dd { margin: 0; font-weight: 600; }
    .section-title { margin: 1rem 0 0.5rem; font-size: 1rem; }
    .section-actions { margin-top: 0.75rem; }
    .inline-form { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; }
    .inline-input { max-width: 180px; }
    .inline-input-sm { width: 80px; padding: 0.35rem 0.5rem; border: 1px solid var(--lp-border, #ddd5c5); border-radius: 8px; font: inherit; }
    .inline-edit-group { display: flex; align-items: center; gap: 0.35rem; }
    .field-error { color: var(--lp-danger, #b91c1c); font-size: 0.8rem; }
    .actions-cell { white-space: nowrap; }
    .actions-cell .btn + .btn { margin-right: 0.35rem; }
    .muted { color: var(--lp-muted, #7a7468); }
    .error-text { color: var(--lp-danger, #b91c1c); }
  `],
  template: `
    <main class="competition-page">
      <header class="page-header">
        <div class="header-content">
          <img src="assets/nehzat.png" alt="لوگو" class="logo" (error)="logoHidden = true" />
          <div>
            <h1>مدیریت مسابقات</h1>
          </div>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-primary" (click)="showCreateForm.set(true)">+ مسابقه جدید</button>
        </div>
      </header>

      @if (toast(); as t) {
        <div class="toast" [class.toast-success]="t.type === 'success'" [class.toast-error]="t.type === 'error'">{{ t.message }}</div>
      }

      <!-- Create/Edit Form -->
      @if (showCreateForm() || editingCompetition()) {
        <section class="card form-card">
          <h2 class="card-title">{{ editingCompetition() ? 'ویرایش مسابقه' : 'مسابقه جدید' }}</h2>
          <form #f="ngForm" (ngSubmit)="saveCompetition()" class="form-layout">
            <div class="form-group">
              <label for="title">عنوان</label>
              <input id="title" name="title" [(ngModel)]="formData.title" required #title="ngModel" class="form-control" />
              @if (title.invalid && title.touched) { <span class="field-error">عنوان الزامی است</span> }
            </div>
            <div class="form-group">
              <label for="description">توضیحات</label>
              <textarea id="description" name="description" [(ngModel)]="formData.description" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="type">نوع مسابقه</label>
              <select id="type" name="type" [(ngModel)]="formData.type" required class="form-control">
                <option value="assignment_based">مبتنی بر تکلیف</option>
                <option value="assessment_based">مبتنی بر آزمون</option>
                <option value="mixed">ترکیبی</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="startDate">تاریخ شروع</label>
                <input id="startDate" name="startDate" type="date" [(ngModel)]="formData.startDate" required class="form-control" />
              </div>
              <div class="form-group">
                <label for="endDate">تاریخ پایان</label>
                <input id="endDate" name="endDate" type="date" [(ngModel)]="formData.endDate" required class="form-control" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="f.invalid || saving()">ذخیره</button>
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">انصراف</button>
            </div>
          </form>
        </section>
      }

      <!-- Competition List -->
      <section class="card">
        <h2 class="card-title">لیست مسابقات</h2>
        @if (loading()) {
          <p class="muted">در حال بارگذاری…</p>
        } @else if (competitions().length === 0) {
          <p class="muted">هیچ مسابقه‌ای ثبت نشده است.</p>
        } @else {
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>عنوان</th>
                  <th>نوع</th>
                  <th>تاریخ شروع</th>
                  <th>تاریخ پایان</th>
                  <th>وضعیت</th>
                  <th>شرکت‌کنندگان</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                @for (comp of competitions(); track comp.id) {
                  <tr>
                    <td>{{ comp.title }}</td>
                    <td>{{ typeLabel(comp.type) }}</td>
                    <td>{{ comp.startDate }}</td>
                    <td>{{ comp.endDate }}</td>
                    <td><span class="badge" [class.badge-active]="comp.status === 'published' || comp.status === 'in_progress'" [class.badge-success]="comp.status === 'completed'">{{ statusLabel(comp.status) }}</span></td>
                    <td>{{ comp.participantCount }}</td>
                    <td class="actions-cell">
                      <button type="button" class="btn btn-sm btn-secondary" (click)="viewCompetition(comp.id)">جزئیات</button>
                      <button type="button" class="btn btn-sm btn-primary" (click)="editCompetition(comp)">ویرایش</button>
                      <button type="button" class="btn btn-sm btn-danger" (click)="deleteCompetition(comp.id)">حذف</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <!-- Competition Detail -->
      @if (selectedCompetition(); as detail) {
        <section class="card">
          <h2 class="card-title">جزئیات مسابقه: {{ detail.title }}</h2>
          <dl class="info-grid">
            <div class="info-item"><dt>وضعیت</dt><dd><span class="badge" [class.badge-success]="detail.status === 'completed'">{{ statusLabel(detail.status) }}</span></dd></div>
            <div class="info-item"><dt>شرکت‌کنندگان</dt><dd>{{ detail.participants.length }}</dd></div>
          </dl>

          <h3 class="section-title">شرکت‌کنندگان</h3>
          @if (detail.participants.length === 0) {
            <p class="muted">هیچ شرکت‌کننده‌ای ثبت نشده است.</p>
          } @else {
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>نام دانش‌آموز</th><th>امتیاز</th><th>رتبه</th><th>عملیات</th></tr>
                </thead>
                <tbody>
                  @for (p of detail.participants; track p.id) {
                    <tr>
                      <td>{{ p.studentName }}</td>
                      <td>
                        @if (editingScoreFor() === p.studentId) {
                          <div class="inline-edit-group">
                            <input type="number" [(ngModel)]="editScoreValue" class="form-control inline-input-sm" placeholder="امتیاز" />
                            <input type="number" [(ngModel)]="editRankValue" class="form-control inline-input-sm" placeholder="رتبه" />
                            <button type="button" class="btn btn-sm btn-success" (click)="saveScore(detail.id)">ذخیره</button>
                            <button type="button" class="btn btn-sm btn-secondary" (click)="editingScoreFor.set(0)">انصراف</button>
                          </div>
                        } @else {
                          {{ p.score ?? '-' }}
                        }
                      </td>
                      <td>{{ p.rank ?? '-' }}</td>
                      <td class="actions-cell">
                        <button type="button" class="btn btn-sm btn-secondary" (click)="startEditScore(p.studentId, p.score, p.rank)">ثبت امتیاز</button>
                        <button type="button" class="btn btn-sm btn-danger" (click)="removeParticipant(detail.id, p.studentId)">حذف</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <!-- Register Participant -->
          <div class="inline-form">
            <input type="number" placeholder="شناسه دانش‌آموز" [(ngModel)]="studentIdToAdd" class="form-control inline-input" />
            <button type="button" class="btn btn-sm btn-primary" (click)="registerParticipant(detail.id)">ثبت شرکت‌کننده</button>
          </div>

          <!-- View Results -->
          <div class="section-actions">
            <button type="button" class="btn btn-secondary" (click)="viewResults(detail.id)">مشاهده نتایج</button>
          </div>
        </section>
      }

      <!-- Competition Results -->
      @if (competitionResults(); as result) {
        <section class="card">
          <h2 class="card-title">نتایج: {{ result.competitionTitle }}</h2>
          @if (result.rankings.length === 0) {
            <p class="muted">نتیجه‌ای ثبت نشده است.</p>
          } @else {
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>رتبه</th><th>نام دانش‌آموز</th><th>امتیاز</th></tr>
                </thead>
                <tbody>
                  @for (r of result.rankings; track r.id) {
                    <tr>
                      <td><strong>{{ r.rank }}</strong></td>
                      <td>{{ r.studentName }}</td>
                      <td>{{ r.score }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }
    </main>
  `
})
export class CompetitionManagementComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  readonly competitions = signal<Competition[]>([]);
  readonly selectedCompetition = signal<CompetitionDetail | null>(null);
  readonly competitionResults = signal<CompetitionResult | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly showCreateForm = signal(false);
  readonly editingCompetition = signal<Competition | null>(null);
  studentIdToAdd = 0;
  readonly editingScoreFor = signal(0);
  editScoreValue: number | undefined;
  editRankValue: number | undefined;

  readonly toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  logoHidden = false;

  formData: CreateCompetitionPayload = this.emptyForm();

  ngOnInit(): void {
    this.loadCompetitions();
  }

  private emptyForm(): CreateCompetitionPayload {
    const today = new Date().toISOString().slice(0, 10);
    return { title: '', description: '', type: 'assignment_based', startDate: today, endDate: today };
  }

  loadCompetitions(): void {
    this.loading.set(true);
    this.api.getCompetitions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => { this.competitions.set(data); this.loading.set(false); },
      error: () => { this.showToast('خطا در بارگذاری مسابقات', 'error'); this.loading.set(false); }
    });
  }

  saveCompetition(): void {
    this.saving.set(true);
    const edit = this.editingCompetition();
    if (edit) {
      const payload: UpdateCompetitionPayload = { title: this.formData.title, description: this.formData.description, type: this.formData.type, startDate: this.formData.startDate, endDate: this.formData.endDate };
      this.api.updateCompetition(edit.id, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.showToast('مسابقه با موفقیت ویرایش شد', 'success'); this.cancelForm(); this.loadCompetitions(); this.saving.set(false); },
        error: () => { this.showToast('خطا در ویرایش مسابقه', 'error'); this.saving.set(false); }
      });
    } else {
      this.api.createCompetition(this.formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.showToast('مسابقه با موفقیت ایجاد شد', 'success'); this.cancelForm(); this.loadCompetitions(); this.saving.set(false); },
        error: () => { this.showToast('خطا در ایجاد مسابقه', 'error'); this.saving.set(false); }
      });
    }
  }

  editCompetition(comp: Competition): void {
    this.editingCompetition.set(comp);
    this.formData = { title: comp.title, description: comp.description, type: comp.type, startDate: comp.startDate, endDate: comp.endDate };
    this.showCreateForm.set(true);
  }

  deleteCompetition(id: number): void {
    if (!confirm('آیا از حذف این مسابقه اطمینان دارید؟')) return;
    this.api.deleteCompetition(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.showToast('مسابقه حذف شد', 'success'); this.loadCompetitions(); },
      error: () => { this.showToast('خطا در حذف مسابقه', 'error'); }
    });
  }

  viewCompetition(id: number): void {
    this.api.getCompetitionById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => { this.selectedCompetition.set(data); this.competitionResults.set(null); },
      error: () => this.showToast('خطا در بارگذاری جزئیات', 'error')
    });
  }

  registerParticipant(competitionId: number): void {
    if (!this.studentIdToAdd || this.studentIdToAdd <= 0) {
      this.showToast('شناسه دانش‌آموز معتبر وارد کنید', 'error');
      return;
    }
    this.api.registerParticipant(competitionId, { studentId: this.studentIdToAdd }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.showToast('شرکت‌کننده با موفقیت ثبت شد', 'success'); this.studentIdToAdd = 0; this.viewCompetition(competitionId); },
      error: () => this.showToast('خطا در ثبت شرکت‌کننده', 'error')
    });
  }

  viewResults(competitionId: number): void {
    this.api.getCompetitionResults(competitionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.competitionResults.set(data),
      error: () => this.showToast('خطا در بارگذاری نتایج', 'error')
    });
  }

  startEditScore(studentId: number, score?: number, rank?: number): void {
    this.editingScoreFor.set(studentId);
    this.editScoreValue = score;
    this.editRankValue = rank;
  }

  saveScore(competitionId: number): void {
    const studentId = this.editingScoreFor();
    if (!studentId) return;
    this.api.updateParticipantScore(competitionId, studentId, { score: this.editScoreValue, rank: this.editRankValue }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.showToast('امتیاز با موفقیت ثبت شد', 'success'); this.editingScoreFor.set(0); this.viewCompetition(competitionId); },
      error: () => this.showToast('خطا در ثبت امتیاز', 'error')
    });
  }

  removeParticipant(competitionId: number, studentId: number): void {
    if (!confirm('آیا از حذف این شرکت‌کننده اطمینان دارید؟')) return;
    this.api.removeParticipant(competitionId, studentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.showToast('شرکت‌کننده حذف شد', 'success'); this.viewCompetition(competitionId); },
      error: () => this.showToast('خطا در حذف شرکت‌کننده', 'error')
    });
  }

  cancelForm(): void {
    this.showCreateForm.set(false);
    this.editingCompetition.set(null);
    this.formData = this.emptyForm();
  }

  typeLabel(t: CompetitionType): string {
    const labels: Record<CompetitionType, string> = { assignment_based: 'مبتنی بر تکلیف', assessment_based: 'مبتنی بر آزمون', mixed: 'ترکیبی' };
    return labels[t] ?? t;
  }

  statusLabel(s: string): string {
    const labels: Record<string, string> = { draft: 'پیش‌نویس', published: 'منتشر شده', in_progress: 'در حال اجرا', completed: 'تکمیل شده', cancelled: 'لغو شده' };
    return labels[s] ?? s;
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3000);
  }
}
