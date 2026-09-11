import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-teacher-courses-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-courses-section.component.html',
  styleUrls: ['./teacher-courses-section.component.scss']
})
export class TeacherCoursesSectionComponent implements OnInit {
  private readonly api = inject(LESSON_PLANNER_API);

  @Input({ required: true }) teacherId = 0;

  readonly courses = signal<any[]>([]);

  ngOnInit(): void {
    if (!this.teacherId) return;
    this.load();
  }

  load(): void {
    this.api.getTeacherCourses(this.teacherId).pipe(
      catchError(() => of([]))
    ).subscribe(courses => this.courses.set(courses));
  }
}
