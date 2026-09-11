import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type { AssignmentGrading } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-teacher-gradings-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-gradings-section.component.html',
  styleUrls: ['./teacher-gradings-section.component.scss']
})
export class TeacherGradingsSectionComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);

  @Input({ required: true }) teacherId = 0;

  readonly gradings = signal<AssignmentGrading[]>([]);

  ngOnInit(): void {
    if (!this.teacherId) return;
    this.load();
  }

  load(): void {
    this.api.getTeacherGradings(this.teacherId).pipe(
      catchError(() => of([]))
    ).subscribe(gradings => this.gradings.set(gradings));
  }

  getStatusClass(status?: string): string {
    return status ?? 'pending';
  }

  getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      graded: 'نمره‌دهی شده',
      pending: 'در انتظار',
      late: 'دیرکرد'
    };
    return labels[status ?? ''] ?? status ?? 'نامشخص';
  }
}
