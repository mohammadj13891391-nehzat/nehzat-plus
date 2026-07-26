import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { StudentProgressSummary, StudentSkillProgress } from '../../core/models/lesson-planner.models';
import { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';

@Component({
  selector: 'app-student-progress-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-progress-card.component.html',
  styleUrls: ['./student-progress-card.component.scss']
})
export class StudentProgressCardComponent {
  private readonly api = inject(LessonPlannerApi);

  @Input({ required: true }) studentId!: number;
  @Input({ required: true }) studentName!: string;
  @Input({ required: true }) studentCode!: string;
  @Input({ required: true }) courseName!: string;
  @Input() latestGrade?: number;
  @Input() attendanceRate?: number;

  progressSummary$: Observable<StudentProgressSummary> = this.api.getProgressSummary(this.studentId);
  skillProgress$: Observable<StudentSkillProgress[]> = this.api.getSkillProgressByStudent(this.studentId);
}
