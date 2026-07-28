import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExperimentalSciencesService } from '../../services/experimental-sciences.service';
import { LessonDto, ExperimentDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-experiment-guide',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="experiment-container" dir="rtl">
      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && lesson">
        <div class="header">
          <button mat-icon-button [routerLink]="['/experimental-sciences/topics', lesson.topicId, 'lessons']">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <div>
            <h1>{{ lesson.title }}</h1>
            <p>آزمایش‌های عملی</p>
          </div>
        </div>

        <div class="experiments-list">
          <mat-card *ngFor="let experiment of experiments; let i = index" class="experiment-card">
            <mat-card-header>
              <div mat-card-avatar class="experiment-number">
                <mat-icon>science</mat-icon>
              </div>
              <mat-card-title>{{ experiment.title }}</mat-card-title>
              <mat-card-subtitle>
                <mat-icon>schedule</mat-icon>
                {{ experiment.estimatedMinutes }} دقیقه
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>مواد و وسایل مورد نیاز</mat-panel-title>
                </mat-expansion-panel-header>
                <p>{{ experiment.materials }}</p>
              </mat-expansion-panel>

              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>مراحل انجام آزمایش</mat-panel-title>
                </mat-expansion-panel-header>
                <div class="steps">
                  <div *ngFor="let step of parseSteps(experiment.steps); let j = index" class="step">
                    <div class="step-number">{{ j + 1 }}</div>
                    <p>{{ step }}</p>
                  </div>
                </div>
              </mat-expansion-panel>

              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>نتیجه مورد انتظار</mat-panel-title>
                </mat-expansion-panel-header>
                <p>{{ experiment.expectedResult }}</p>
              </mat-expansion-panel>

              <div *ngIf="experiment.safetyNotes" class="safety-notes">
                <mat-icon color="warn">warning</mat-icon>
                <div>
                  <strong>نکات ایمنی:</strong>
                  <p>{{ experiment.safetyNotes }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div *ngIf="experiments.length === 0" class="empty-state">
          <mat-icon>science</mat-icon>
          <p>آزمایش عملی برای این درس تعریف نشده است</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .experiment-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .header h1 {
      color: var(--lp-primary, #1976d2);
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 4px 0 0;
    }
    .experiments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .experiment-card {
      background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
    }
    .experiment-number {
      background: var(--lp-accent, #ff9800);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .step {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .step-number {
      background: var(--lp-primary, #1976d2);
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .step p {
      margin: 0;
      line-height: 1.6;
    }
    .safety-notes {
      display: flex;
      gap: 12px;
      padding: 16px;
      margin-top: 16px;
      background: #fff3e0;
      border-radius: 8px;
      border-right: 4px solid #ff9800;
    }
    .safety-notes mat-icon {
      color: #ff9800;
    }
    .safety-notes strong {
      color: #e65100;
    }
    .safety-notes p {
      margin: 4px 0 0;
    }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: #999;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }
  `]
})
export class ExperimentGuideComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ExperimentalSciencesService);
  
  lesson: LessonDto | null = null;
  experiments: ExperimentDto[] = [];
  loading = true;

  ngOnInit(): void {
    const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    if (lessonId) {
      this.loadData(lessonId);
    }
  }

  loadData(lessonId: number): void {
    this.service.getLesson(lessonId).subscribe(lesson => {
      this.lesson = lesson;
      this.service.getExperimentsByLesson(lessonId).subscribe(experiments => {
        this.experiments = experiments;
        this.loading = false;
      });
    });
  }

  parseSteps(steps: string): string[] {
    try {
      return JSON.parse(steps);
    } catch {
      return steps.split('\n').filter(s => s.trim());
    }
  }
}
