import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExperimentalSciencesService } from '../../services/experimental-sciences.service';
import { PhaseDto, TopicDto, StudentProgressDto } from '../../../../core/models/lesson-planner.models';

@Component({
  selector: 'app-progress-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container" dir="rtl">
      <h1>داشبورد پیشرفت علوم تجربی</h1>
      <p class="subtitle">مسیر یادگیری خود را دنبال کنید</p>

      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon class="stat-icon">school</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ totalTopics }}</span>
                <span class="stat-label">موضوع</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon class="stat-icon">check_circle</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ completedTopics }}</span>
                <span class="stat-label">تکمیل شده</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon class="stat-icon">trending_up</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ averageScore }}%</span>
                <span class="stat-label">میانگین نمره</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon class="stat-icon">local_fire_department</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ streakDays }}</span>
                <span class="stat-label">روز پیاپی</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Overall Progress -->
        <mat-card class="progress-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>emoji_events</mat-icon>
            <mat-card-title>پیشرفت کلی</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="progress-bar-container">
              <mat-progress-bar [value]="overallProgress" color="primary"></mat-progress-bar>
              <span>{{ overallProgress | number:'1.0-0' }}%</span>
            </div>
            <p>{{ completedTopics }} از {{ totalTopics }} موضوع تکمیل شده</p>
          </mat-card-content>
        </mat-card>

        <!-- Phases Progress -->
        <h2>مراحل یادگیری</h2>
        <div class="phases-list">
          <mat-card *ngFor="let phase of phases" class="phase-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>{{ phase.icon || 'science' }}</mat-icon>
              <mat-card-title>{{ phase.title }}</mat-card-title>
              <mat-card-subtitle>{{ phase.description }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="phase-topics">
                <div *ngFor="let topic of getTopicsByPhase(phase.id)" 
                     class="topic-progress"
                     [routerLink]="['/experimental-sciences/topics', topic.id, 'lessons']">
                  <div class="topic-header">
                    <mat-icon>{{ topic.icon || 'biotech' }}</mat-icon>
                    <span>{{ topic.title }}</span>
                  </div>
                  <div class="topic-status">
                    <mat-chip [color]="getStatusColor(getTopicStatus(topic.id))" selected>
                      {{ getStatusLabel(getTopicStatus(topic.id)) }}
                    </mat-chip>
                    <mat-icon>chevron_left</mat-icon>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Recent Activity -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>history</mat-icon>
            <mat-card-title>فعالیت‌های اخیر</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="recentProgress.length === 0" class="empty-activity">
              <p>هنوز فعالیتی ثبت نشده است</p>
            </div>
            <div *ngFor="let progress of recentProgress" class="activity-item">
              <mat-icon [color]="progress.status === 'Completed' ? 'primary' : 'accent'">
                {{ progress.status === 'Completed' ? 'check_circle' : 'pending' }}
              </mat-icon>
              <div class="activity-info">
                <span class="activity-title">{{ getTopicTitle(progress.topicId) }}</span>
                <span class="activity-date">{{ progress.completedAt | date:'short' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
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
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
    }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }
    .stat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--lp-primary, #1976d2);
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--lp-primary, #1976d2);
    }
    .stat-label {
      font-size: 14px;
      color: #666;
    }
    .progress-card {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%);
    }
    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .progress-bar-container mat-progress-bar {
      flex: 1;
    }
    .progress-bar-container span {
      font-weight: bold;
      color: var(--lp-primary, #1976d2);
    }
    .phases-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    .phase-card {
      background: #fff;
    }
    .phase-topics {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }
    .topic-progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .topic-progress:hover {
      background: #e0e0e0;
      transform: translateX(-4px);
    }
    .topic-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .topic-header mat-icon {
      color: var(--lp-primary, #1976d2);
    }
    .topic-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .topic-status mat-icon {
      color: #999;
    }
    .activity-card {
      margin-bottom: 24px;
    }
    .empty-activity {
      text-align: center;
      padding: 24px;
      color: #999;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .activity-item:last-child {
      border-bottom: none;
    }
    .activity-info {
      display: flex;
      flex-direction: column;
    }
    .activity-title {
      font-weight: 500;
    }
    .activity-date {
      font-size: 12px;
      color: #666;
    }
  `]
})
export class ProgressDashboardComponent implements OnInit {
  private service = inject(ExperimentalSciencesService);
  
  phases: PhaseDto[] = [];
  topics: TopicDto[] = [];
  progress: StudentProgressDto[] = [];
  loading = true;

  totalTopics = 0;
  completedTopics = 0;
  averageScore = 0;
  streakDays = 0;
  overallProgress = 0;
  recentProgress: StudentProgressDto[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getPhases().subscribe(phases => {
      this.phases = phases;
      this.service.getTopics().subscribe(topics => {
        this.topics = topics;
        this.totalTopics = topics.length;
        
        // Mock student ID = 1 for demo
        this.service.getStudentProgress(1).subscribe(progress => {
          this.progress = progress;
          this.calculateStats();
          this.loading = false;
        });
      });
    });
  }

  calculateStats(): void {
    this.completedTopics = this.progress.filter(p => p.status === 'Completed').length;
    this.overallProgress = this.totalTopics > 0 ? (this.completedTopics / this.totalTopics) * 100 : 0;
    
    const completedWithScore = this.progress.filter(p => p.score > 0);
    this.averageScore = completedWithScore.length > 0 
      ? Math.round(completedWithScore.reduce((sum, p) => sum + p.score, 0) / completedWithScore.length)
      : 0;
    
    // Mock streak for demo
    this.streakDays = 5;
    
    // Recent progress (last 5)
    this.recentProgress = this.progress
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5);
  }

  getTopicsByPhase(phaseId: number): TopicDto[] {
    return this.topics.filter(t => t.phaseId === phaseId);
  }

  getTopicStatus(topicId: number): string {
    const p = this.progress.find(p => p.topicId === topicId);
    return p?.status || 'NotStarted';
  }

  getTopicTitle(topicId: number): string {
    const topic = this.topics.find(t => t.id === topicId);
    return topic?.title || 'نامشخص';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed': return 'primary';
      case 'InProgress': return 'accent';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Completed': return 'تکمیل شده';
      case 'InProgress': return 'در حال انجام';
      default: return 'شروع نشده';
    }
  }
}
