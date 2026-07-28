import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExperimentalSciencesService } from '../../services/experimental-sciences.service';
import { TopicDto, LessonDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="lesson-container" dir="rtl">
      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && topic">
        <div class="header">
          <button mat-icon-button routerLink="/experimental-sciences/topics">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <div>
            <h1>{{ topic.title }}</h1>
            <p>{{ topic.description }}</p>
          </div>
        </div>

        <mat-card class="progress-card">
          <mat-card-content>
            <div class="progress-info">
              <span>پیشرفت شما</span>
              <span>{{ completedLessons }}/{{ lessons.length }} درس</span>
            </div>
            <mat-progress-bar [value]="progressPercent" color="primary"></mat-progress-bar>
          </mat-card-content>
        </mat-card>

        <div class="lessons-list">
          <mat-card *ngFor="let lesson of lessons; let i = index" 
                    class="lesson-card"
                    [class.completed]="false">
            <mat-card-header>
              <div mat-card-avatar class="lesson-number">{{ i + 1 }}</div>
              <mat-card-title>{{ lesson.title }}</mat-card-title>
              <mat-card-subtitle>
                <mat-icon>schedule</mat-icon>
                {{ lesson.estimatedMinutes }} دقیقه
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ lesson.content | slice:0:150 }}...</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" 
                      [routerLink]="['/experimental-sciences/lessons', lesson.id, 'experiments']">
                <mat-icon>science</mat-icon>
                آزمایش
              </button>
              <button mat-raised-button color="accent"
                      [routerLink]="['/experimental-sciences/lessons', lesson.id, 'quiz']">
                <mat-icon>quiz</mat-icon>
                آزمون
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lesson-container {
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
    .progress-card {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%);
    }
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .lessons-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .lesson-card {
      transition: all 0.2s;
    }
    .lesson-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .lesson-number {
      background: var(--lp-primary, #1976d2);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 16px;
    }
    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class LessonViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ExperimentalSciencesService);
  
  topic: TopicDto | null = null;
  lessons: LessonDto[] = [];
  loading = true;
  completedLessons = 0;

  get progressPercent(): number {
    return this.lessons.length > 0 ? (this.completedLessons / this.lessons.length) * 100 : 0;
  }

  ngOnInit(): void {
    const topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    if (topicId) {
      this.loadData(topicId);
    }
  }

  loadData(topicId: number): void {
    this.service.getTopic(topicId).subscribe(topic => {
      this.topic = topic;
      this.service.getLessonsByTopic(topicId).subscribe(lessons => {
        this.lessons = lessons;
        this.loading = false;
      });
    });
  }
}
