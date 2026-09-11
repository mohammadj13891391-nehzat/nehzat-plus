import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { StudentProgressSummary, StudentSkillProgress } from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-student-progress-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-progress-card.component.html',
  styleUrls: ['./student-progress-card.component.scss']
})
export class StudentProgressCardComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);

  @Input({ required: true }) studentId!: number;
  @Input({ required: true }) studentName!: string;
  @Input({ required: true }) studentCode!: string;
  @Input() courseName?: string;
  @Input() latestGrade?: number;
  @Input() attendanceRate?: number;

  @Input() age?: number;
  @Input() phase?: string;
  @Input() activePathTitle?: string;
  @Input() completedLevels?: number;
  @Input() totalLevels?: number;
  @Input() completedLessons?: number;
  @Input() totalLessons?: number;

  readonly progressSummary = toSignal(this.api.getProgressSummary(this.studentId));
  readonly skillProgress = toSignal(this.api.getSkillProgressByStudent(this.studentId));

  get phaseColor(): string {
    switch (this.phase) {
      case 'A': return '#ef4444';
      case 'B': return '#14b8a6';
      case 'C': return '#8b5cf6';
      case 'D': return '#f97316';
      case 'E': return '#2563eb';
      default: return '#6b7280';
    }
  }

  get levelProgress(): number {
    if (!this.totalLevels || this.totalLevels === 0) return 0;
    return ((this.completedLevels ?? 0) / this.totalLevels) * 100;
  }

  navigateToDetail(): void {
    void this.router.navigate(['/parent/student', this.studentId]);
  }
}
