import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExperimentalSciencesService } from '../../services/experimental-sciences.service';
import { PhaseDto, TopicDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="topic-container" dir="rtl">
      <h1>علوم تجربی</h1>
      <p class="subtitle">یادگیری علوم تجربی از پایه تا پیشرفته</p>

      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading" class="phases-grid">
        <mat-card *ngFor="let phase of phases" class="phase-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>{{ phase.icon || 'science' }}</mat-icon>
            <mat-card-title>{{ phase.title }}</mat-card-title>
            <mat-card-subtitle>{{ phase.description }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="topics-list">
              <div *ngFor="let topic of getTopicsByPhase(phase.id)" 
                   class="topic-item"
                   [routerLink]="['/experimental-sciences/topics', topic.id, 'lessons']">
                <div class="topic-info">
                  <mat-icon>{{ topic.icon || 'biotech' }}</mat-icon>
                  <div>
                    <h3>{{ topic.title }}</h3>
                    <p>{{ topic.description }}</p>
                  </div>
                </div>
                <div class="topic-meta">
                  <mat-chip [color]="getDifficultyColor(topic.difficultyLevel)" selected>
                    {{ getDifficultyLabel(topic.difficultyLevel) }}
                  </mat-chip>
                  <mat-icon>chevron_left</mat-icon>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .topic-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: var(--lp-primary, #1976d2);
      margin-bottom: 8px;
    }
    .subtitle {
      color: #666;
      margin-bottom: 24px;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    .phases-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .phase-card {
      background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
    }
    .topics-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }
    .topic-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid #e0e0e0;
    }
    .topic-item:hover {
      background: #f5f5f5;
      transform: translateX(-4px);
    }
    .topic-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .topic-info mat-icon {
      color: var(--lp-primary, #1976d2);
    }
    .topic-info h3 {
      margin: 0;
      font-size: 16px;
    }
    .topic-info p {
      margin: 4px 0 0;
      font-size: 14px;
      color: #666;
    }
    .topic-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .topic-meta mat-icon {
      color: #999;
    }
  `]
})
export class TopicListComponent implements OnInit {
  private service = inject(ExperimentalSciencesService);
  
  phases: PhaseDto[] = [];
  topics: TopicDto[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getPhases().subscribe(phases => {
      this.phases = phases;
      this.service.getTopics().subscribe(topics => {
        this.topics = topics;
        this.loading = false;
      });
    });
  }

  getTopicsByPhase(phaseId: number): TopicDto[] {
    return this.topics.filter(t => t.phaseId === phaseId);
  }

  getDifficultyColor(level: string): string {
    switch (level) {
      case 'Child': return 'primary';
      case 'Teen': return 'accent';
      case 'YoungAdult': return 'warn';
      case 'Adult': return '';
      case 'Senior': return 'primary';
      default: return '';
    }
  }

  getDifficultyLabel(level: string): string {
    switch (level) {
      case 'Child': return 'کودک';
      case 'Teen': return 'نوجوان';
      case 'YoungAdult': return 'جوان';
      case 'Adult': return 'بزرگسال';
      case 'Senior': return 'ارشد';
      default: return level;
    }
  }
}
