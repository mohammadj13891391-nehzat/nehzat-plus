import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartEvent,
  registerables
} from 'chart.js';

import type {
  AssignmentProgressItem,
  BiweeklyProgressResponse
} from '../../../core/models/lesson-planner.models';

Chart.register(...registerables);

export interface BiweeklyProgressData {
  studentId: number;
  studentName: string;
  periodStart: string;
  periodEnd: string;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  completionPercentage: number;
  averageScore: number;
  totalSubmissions: number;
  assignments: AssignmentProgressItem[];
}

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (chartData) {
      <div class="progress-chart-container">
        <canvas
          baseChart
          [data]="chartData"
          [options]="chartOptions"
          [type]="chartType"
          class="progress-chart-canvas"
        ></canvas>
      </div>
    } @else {
      <div class="chart-empty">
        <p class="muted">داده‌ای برای نمایش نمودار وجود ندارد.</p>
      </div>
    }
  `,
  styles: [`
    .progress-chart-container {
      width: 100%;
      height: 300px;
      position: relative;
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem;
      padding: 1rem;
    }
    .progress-chart-canvas {
      max-height: 100%;
    }
    .chart-empty {
      width: 100%;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--lp-bg, #f8f9fa);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem;
    }
    .muted {
      color: var(--lp-muted, #6b7280);
      margin: 0;
    }
  `]
})
export class ProgressChartComponent implements OnChanges {
  @Input() progressData: BiweeklyProgressData | null = null;

  public chartType = 'line' as const;
  public chartData: ChartData<'line'> | null = null;
  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Vazirmatn, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Vazirmatn, sans-serif', size: 13 },
        bodyFont: { family: 'Vazirmatn, sans-serif', size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: [],
        grid: {
          display: false
        },
        ticks: {
          font: { family: 'Vazirmatn, sans-serif', size: 11 },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          stepSize: 20,
          font: { family: 'Vazirmatn, sans-serif', size: 11 },
          callback: (value) => `${value}%`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progressData'] && this.progressData) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    if (!this.progressData) return;

    const labels = this.generateDateLabels(
      this.progressData.periodStart,
      this.progressData.periodEnd
    );

    const completionData = this.calculateDailyCompletion(
      this.progressData.assignments,
      labels
    );

    const scoreData = this.calculateDailyScores(
      this.progressData.assignments,
      labels
    );

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'درصد تکمیل (%)',
          data: completionData,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'میانگین نمره (%)',
          data: scoreData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    };

    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        ...this.chartOptions!.scales,
        x: {
          ...this.chartOptions!.scales!['x'],
          labels
        }
      }
    };
  }

  private generateDateLabels(start: string, end: string): string[] {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const labels: string[] = [];
    
    const current = new Date(startDate);
    while (current <= endDate) {
      labels.push(this.formatPersianDate(current));
      current.setDate(current.getDate() + 1);
    }
    
    return labels;
  }

  private formatPersianDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  }

  private calculateDailyCompletion(
    assignments: AssignmentProgressItem[],
    labels: string[]
  ): number[] {
    const data: number[] = new Array(labels.length).fill(0);
    const dateToIndex = new Map<string, number>();
    
    labels.forEach((label, i) => dateToIndex.set(label, i));

    assignments.forEach(assignment => {
      const assignmentDate = new Date(assignment.assignmentDate);
      const label = this.formatPersianDate(assignmentDate);
      const index = dateToIndex.get(label);
      
      if (index !== undefined && assignment.isSubmitted) {
        data[index] = 100; // Task completed
      }
    });

    return data;
  }

  private calculateDailyScores(
    assignments: AssignmentProgressItem[],
    labels: string[]
  ): (number | null)[] {
    const data: (number | null)[] = new Array(labels.length).fill(null);
    const dateToIndex = new Map<string, number>();
    
    labels.forEach((label, i) => dateToIndex.set(label, i));

    assignments.forEach(assignment => {
      if (assignment.dailyScore !== null && assignment.dailyScore !== undefined) {
        const assignmentDate = new Date(assignment.assignmentDate);
        const label = this.formatPersianDate(assignmentDate);
        const index = dateToIndex.get(label);
        
        if (index !== undefined) {
          data[index] = assignment.dailyScore;
        }
      }
    });

    return data;
  }
}