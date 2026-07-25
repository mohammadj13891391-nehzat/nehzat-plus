import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import type {
  League,
  LeagueDetail,
  LeagueRanking,
  CreateLeaguePayload,
  UpdateLeaguePayload,
  UpdateLeagueRankingPayload
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-league-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .league-page { direction: rtl; min-height: 100vh; padding: 1rem; display: grid; gap: 1rem; background: var(--lp-bg, #f8f9fa); }
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
    .btn-success { background: #065f46; color: #fff; }
    .btn-success:hover:not(:disabled) { background: #047857; }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .data-table th, .data-table td { padding: 0.65rem 0.75rem; text-align: right; border-bottom: 1px solid var(--lp-border, #ddd5c5); }
    .data-table th { color: var(--lp-muted, #7a7468); font-weight: 600; background: var(--lp-bg, #f6f3ed); }
    .badge { display: inline-block; padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; background: var(--lp-bg, #f6f3ed); color: var(--lp-muted, #7a7468); }
    .badge-active { background: #dbeafe; color: #1e40af; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .inline-edit-group { display: flex; align-items: center; gap: 0.35rem; }
    .inline-input-sm { width: 80px; padding: 0.35rem 0.5rem; border: 1px solid var(--lp-border, #ddd5c5); border-radius: 8px; font: inherit; }
    .trend-up { color: #065f46; font-weight: 600; }
    .trend-down { color: #b91c1c; font-weight: 600; }
    .trend-stable { color: var(--lp-muted, #7a7468); }
    .muted { color: var(--lp-muted, #7a7468); }
  `],
  template: `
    <main class="league-page">
      <header class="page-header">
        <div class="header-content">
          <img src="assets/nehzat.png" alt="لوگو" class="logo" (error)="logoHidden = true" />
          <div>
            <h1>مدیریت لیگ‌ها</h1>
          </div>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-primary" (click)="showCreateForm.set(true)">+ لیگ جدید</button>
        </div>
      </header>

      @if (toast(); as t) {
        <div class="toast" [class.toast-success]="t.type === 'success'" [class.toast-error]="t.type === 'error'">{{ t.message }}</div>
      }

      <!-- Create/Edit Form -->
      @if (showCreateForm() || editingLeague()) {
        <section class="card form-card">
          <h2 class="card-title">{{ editingLeague() ? 'ویرایش لیگ' : 'لیگ جدید' }}</h2>
          <form #f="ngForm" (ngSubmit)="saveLeague()" class="form-layout">
            <div class="form-group">
              <label for="name">نام لیگ</label>
              <input id="name" name="name" [(ngModel)]="formData.name" required #name="ngModel" class="form-control" />
              @if (name.invalid && name.touched) { <span class="field-error">نام الزامی است</span> }
            </div>
            <div class="form-group">
              <label for="desc">توضیحات</label>
              <textarea id="desc" name="description" [(ngModel)]="formData.description" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="season">فصل</label>
              <input id="season" name="season" [(ngModel)]="formData.season" required class="form-control" placeholder="مثال: تابستان ۱۴۰۵" />
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

      <!-- League List -->
      <section class="card">
        <h2 class="card-title">لیست لیگ‌ها</h2>
        @if (loading()) {
          <p class="muted">در حال بارگذاری…</p>
        } @else if (leagues().length === 0) {
          <p class="muted">هیچ لیگی ثبت نشده است.</p>
        } @else {
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>فصل</th>
                  <th>تاریخ شروع</th>
                  <th>تاریخ پایان</th>
                  <th>وضعیت</th>
                  <th>شرکت‌کنندگان</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                @for (league of leagues(); track league.id) {
                  <tr>
                    <td>{{ league.name }}</td>
                    <td>{{ league.season }}</td>
                    <td>{{ league.startDate }}</td>
                    <td>{{ league.endDate }}</td>
                    <td><span class="badge" [class.badge-active]="league.status === 'active'">{{ league.status === 'active' ? 'فعال' : 'تکمیل شده' }}</span></td>
                    <td>{{ league.participantCount }}</td>
                    <td class="actions-cell">
                      <button type="button" class="btn btn-sm btn-secondary" (click)="viewLeague(league.id)">رتبه‌بندی</button>
                      <button type="button" class="btn btn-sm btn-primary" (click)="editLeague(league)">ویرایش</button>
                      <button type="button" class="btn btn-sm btn-danger" (click)="deleteLeague(league.id)">حذف</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <!-- League Rankings -->
      @if (selectedLeague(); as detail) {
        <section class="card">
          <h2 class="card-title">رتبه‌بندی: {{ detail.name }}</h2>
          <p class="muted">{{ detail.season }} — {{ detail.status === 'active' ? 'فعال' : 'تکمیل شده' }}</p>

          @if (detail.rankings.length === 0) {
            <p class="muted">هنوز رتبه‌بندی ثبت نشده است.</p>
          } @else {
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr><th>رتبه</th><th>نام دانش‌آموز</th><th>امتیاز</th><th>تغییرات</th></tr>
                </thead>
                <tbody>
                  @for (r of detail.rankings; track r.id) {
                    <tr>
                      <td><strong>{{ r.rank }}</strong></td>
                      <td>{{ r.studentName }}</td>
                      <td>
                        @if (editingScoreFor() === r.studentId) {
                          <div class="inline-edit-group">
                            <input type="number" [(ngModel)]="editScoreValue" class="form-control inline-input-sm" placeholder="امتیاز" />
                            <button type="button" class="btn btn-sm btn-success" (click)="saveRankingScore(detail.id)">ذخیره</button>
                            <button type="button" class="btn btn-sm btn-secondary" (click)="editingScoreFor.set(0)">انصراف</button>
                          </div>
                        } @else {
                          {{ r.score }}
                        }
                      </td>
                      <td>
                        @if (r.trend === 'up') { <span class="trend-up">صعود</span> }
                        @else if (r.trend === 'down') { <span class="trend-down">نزول</span> }
                        @else { <span class="trend-stable">ثابت</span> }
                        <button type="button" class="btn btn-sm btn-secondary" style="margin-right:8px" (click)="startEditScore(r.studentId, r.score)">ثبت امتیاز</button>
                      </td>
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
export class LeagueManagementComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  readonly leagues = signal<League[]>([]);
  readonly selectedLeague = signal<LeagueDetail | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly showCreateForm = signal(false);
  readonly editingLeague = signal<League | null>(null);
  readonly editingScoreFor = signal(0);
  editScoreValue: number | undefined;

  readonly toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  logoHidden = false;

  formData: CreateLeaguePayload = this.emptyForm();

  ngOnInit(): void {
    this.loadLeagues();
  }

  private emptyForm(): CreateLeaguePayload {
    const today = new Date().toISOString().slice(0, 10);
    return { name: '', description: '', season: '', startDate: today, endDate: today };
  }

  loadLeagues(): void {
    this.loading.set(true);
    this.api.getLeagues().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => { this.leagues.set(data); this.loading.set(false); },
      error: () => { this.showToast('خطا در بارگذاری لیگ‌ها', 'error'); this.loading.set(false); }
    });
  }

  saveLeague(): void {
    this.saving.set(true);
    const edit = this.editingLeague();
    if (edit) {
      this.api.updateLeague(edit.id, this.formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.showToast('لیگ با موفقیت ویرایش شد', 'success'); this.cancelForm(); this.loadLeagues(); this.saving.set(false); },
        error: () => { this.showToast('خطا در ویرایش لیگ', 'error'); this.saving.set(false); }
      });
    } else {
      this.api.createLeague(this.formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.showToast('لیگ با موفقیت ایجاد شد', 'success'); this.cancelForm(); this.loadLeagues(); this.saving.set(false); },
        error: () => { this.showToast('خطا در ایجاد لیگ', 'error'); this.saving.set(false); }
      });
    }
  }

  editLeague(league: League): void {
    this.editingLeague.set(league);
    this.formData = { name: league.name, description: league.description, season: league.season, startDate: league.startDate, endDate: league.endDate };
    this.showCreateForm.set(true);
  }

  deleteLeague(id: number): void {
    if (!confirm('آیا از حذف این لیگ اطمینان دارید؟')) return;
    this.api.deleteLeague(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.showToast('لیگ حذف شد', 'success'); this.loadLeagues(); },
      error: () => { this.showToast('خطا در حذف لیگ', 'error'); }
    });
  }

  viewLeague(id: number): void {
    this.api.getLeagueById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.selectedLeague.set(data),
      error: () => this.showToast('خطا در بارگذاری رتبه‌بندی', 'error')
    });
  }

  startEditScore(studentId: number, score?: number): void {
    this.editingScoreFor.set(studentId);
    this.editScoreValue = score;
  }

  saveRankingScore(leagueId: number): void {
    const studentId = this.editingScoreFor();
    if (!studentId) return;
    this.api.updateLeagueRanking(leagueId, { studentId, score: this.editScoreValue ?? 0 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.showToast('امتیاز با موفقیت ثبت شد', 'success'); this.editingScoreFor.set(0); this.viewLeague(leagueId); },
      error: () => this.showToast('خطا در ثبت امتیاز', 'error')
    });
  }

  cancelForm(): void {
    this.showCreateForm.set(false);
    this.editingLeague.set(null);
    this.formData = this.emptyForm();
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3000);
  }
}
