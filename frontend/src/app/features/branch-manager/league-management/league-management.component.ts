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
  templateUrl: './league-management.component.html',
  styleUrls: ['./league-management.component.scss']
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
