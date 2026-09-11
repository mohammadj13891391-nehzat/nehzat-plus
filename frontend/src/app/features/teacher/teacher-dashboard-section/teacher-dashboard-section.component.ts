import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type { TeacherDashboardSummary } from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-teacher-dashboard-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-dashboard-section.component.html',
  styleUrls: ['./teacher-dashboard-section.component.scss']
})
export class TeacherDashboardSectionComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);

  @Input({ required: true }) teacherId = 0;

  readonly dashboardSummary = signal<TeacherDashboardSummary | undefined>(undefined);

  ngOnInit(): void {
    if (!this.teacherId) return;
    this.load();
  }

  load(): void {
    this.api.getTeacherDashboardSummary(this.teacherId).pipe(
      catchError(() => of({ totalCourses: 0, totalStudents: 0, pendingGradings: 0, completedGradings: 0, averageScore: 0 }))
    ).subscribe(summary => this.dashboardSummary.set(summary));
  }
}
