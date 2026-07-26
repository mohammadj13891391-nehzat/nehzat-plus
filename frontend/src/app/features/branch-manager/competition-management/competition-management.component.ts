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
  templateUrl: './competition-management.component.html',
  styleUrls: ['./competition-management.component.scss']
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
