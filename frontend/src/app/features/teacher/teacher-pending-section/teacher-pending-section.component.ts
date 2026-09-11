import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type {
  AssignmentGrading,
  GradeSubmissionRequest
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-teacher-pending-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-pending-section.component.html',
  styleUrls: ['./teacher-pending-section.component.scss']
})
export class TeacherPendingSectionComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) teacherId = 0;
  @Input({ required: true }) currentUserId = 0;
  @Output() gradeSubmitted = new EventEmitter<void>();

  readonly pendingGradings = signal<AssignmentGrading[]>([]);
  readonly showGradeModal = signal(false);
  readonly selectedGrading = signal<AssignmentGrading | null>(null);
  readonly savingGrade = signal(false);

  gradeForm: GradeSubmissionRequest = {
    submissionId: 0,
    teacherId: 0,
    dailyScore: 0,
    cumulativeScore: 0,
    status: 'graded',
    feedback: ''
  };

  ngOnInit(): void {
    if (!this.teacherId) return;
    this.load();
  }

  load(): void {
    this.api.getPendingGradings(this.teacherId).pipe(
      catchError(() => of([]))
    ).subscribe(gradings => this.pendingGradings.set(gradings));
  }

  openGradeModal(grading: AssignmentGrading): void {
    this.selectedGrading.set(grading);
    this.gradeForm = {
      submissionId: grading.submissionId,
      teacherId: this.currentUserId,
      dailyScore: 0,
      cumulativeScore: 0,
      status: 'graded',
      feedback: ''
    };
    this.showGradeModal.set(true);
  }

  closeGradeModal(): void {
    this.showGradeModal.set(false);
    this.selectedGrading.set(null);
  }

  submitGrade(): void {
    if (this.savingGrade()) return;
    this.savingGrade.set(true);

    this.api.gradeSubmission(this.gradeForm).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.savingGrade.set(false);
        this.closeGradeModal();
        this.load();
        this.gradeSubmitted.emit();
      },
      error: (err: any) => {
        this.savingGrade.set(false);
        alert('خطا در ثبت نمره: ' + (err.error?.message || err.message));
      }
    });
  }
}
