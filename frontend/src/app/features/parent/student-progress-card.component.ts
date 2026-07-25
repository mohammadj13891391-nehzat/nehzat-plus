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
  template: `
    <article class="student-card">
      <header class="student-header">
        <div class="student-info">
          <h3>{{ studentName }}</h3>
          <p class="muted">{{ studentCode }}</p>
          <p class="course-name">{{ courseName }}</p>
        </div>
        @if (latestGrade !== undefined) {
          <div class="grade-badge">{{ latestGrade }}</div>
        }
      </header>

      @if (progressSummary$ | async; as summary) {
        <div class="progress-summary">
          <div class="summary-row">
            <span>میانگین نمرات</span>
            <strong>{{ summary.summary.averageScore | number:'1.0-1' }}%</strong>
          </div>
          <div class="summary-row">
            <span>هدف‌های تکمیل شده</span>
            <strong>{{ summary.summary.masteredCount }} / {{ summary.summary.totalObjectives }}</strong>
          </div>
          @if (summary.subjectAreas.length > 0) {
            <div class="subject-areas">
              @for (area of summary.subjectAreas; track area.subjectAreaId) {
                <div class="subject-area">
                  <span>{{ area.subjectAreaTitle }}</span>
                  <span>{{ area.masteredCount }}/{{ area.totalObjectives }}</span>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <p class="muted">در حال بارگذاری پیشرفت...</p>
      }

      @if (skillProgress$ | async; as skills) {
        @if (skills.length > 0) {
          <div class="skills-section">
            <h4>مهارت‌های اخیر</h4>
            <div class="skills-list">
              @for (skill of skills; track skill.id) {
                <div class="skill-item">
                  <span class="skill-name">{{ skill.objectiveTitle }}</span>
                  <span class="skill-level" [class]="skill.proficiencyLevel">{{ skill.proficiencyLevel }}</span>
                </div>
              }
            </div>
          </div>
        }
      }
    </article>
  `,
  styles: [`
    .student-card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .student-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .student-info h3 { margin: 0; font-size: 1.1rem; }
    .course-name { font-size: 0.85rem; color: var(--lp-primary, #2563eb); }
    .grade-badge {
      background: var(--lp-primary, #2563eb);
      color: #fff;
      border-radius: 9999px;
      padding: 0.25rem 0.75rem;
      font-weight: bold;
      font-size: 0.9rem;
    }
    .progress-summary { margin-top: 1rem; }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .summary-row:last-child { border-bottom: none; }
    .subject-areas { margin-top: 0.75rem; }
    .subject-area {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      padding: 0.25rem 0;
    }
    .skills-section { margin-top: 1rem; }
    .skills-section h4 { margin: 0 0 0.5rem 0; font-size: 0.9rem; }
    .skill-item {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 0;
      font-size: 0.85rem;
    }
    .skill-level {
      padding: 0.1rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .skill-level.not_started { background: #f3f4f6; color: #6b7280; }
    .skill-level.in_progress { background: #dbeafe; color: #2563eb; }
    .skill-level.achieved { background: #dcfce7; color: #16a34a; }
    .skill-level.mastered { background: #a78bfa; color: #fff; }
  `]
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
