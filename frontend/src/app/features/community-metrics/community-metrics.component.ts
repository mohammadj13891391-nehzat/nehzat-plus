import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import type {
  CommunityMetrics,
  PeerActivity,
  SkillSharingMetrics,
  CollaborationMetrics,
  PublicShowcase
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { inject } from '@angular/core';

type MetricsView = 'overview' | 'activity' | 'skills' | 'collaboration' | 'showcase';

@Component({
  selector: 'app-community-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-metrics.component.html',
  styleUrls: ['./community-metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityMetricsComponent {
  private readonly api = inject(LESSON_PLANNER_API);

  activeView: MetricsView = 'overview';

  readonly metrics = toSignal(this.api.getCommunityMetrics());
  readonly activity = toSignal(this.api.getPeerActivity(10));
  readonly skills = toSignal(this.api.getSkillSharingMetrics());
  readonly collaboration = toSignal(this.api.getCollaborationMetrics());
  readonly showcase = toSignal(this.api.getPublicShowcases(6));

  readonly loading = computed(() => this.metrics() === undefined);

  VIEW_LABELS: Record<MetricsView, string> = {
    overview: 'نمای کلی',
    activity: 'فعالیت همتاها',
    skills: 'اشتراک مهارت',
    collaboration: 'همکاری‌ها',
    showcase: 'نمایشگاه عمومی'
  };

  VIEW_ICONS: Record<MetricsView, string> = {
    overview: '📊',
    activity: '🔔',
    skills: '💡',
    collaboration: '🤝',
    showcase: '🏆'
  };

  views: MetricsView[] = ['overview', 'activity', 'skills', 'collaboration', 'showcase'];

  switchView(view: MetricsView): void {
    this.activeView = view;
  }

  getViewIcon(): string {
    return this.VIEW_ICONS[this.activeView];
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'چند لحظه پیش';
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffDays < 7) return `${diffDays} روز پیش`;
    return date.toLocaleDateString('fa-IR');
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      project_created: '📁',
      discussion_posted: '💬',
      portfolio_uploaded: '📎',
      badge_earned: '🏅',
      level_up: '⬆️',
      collaboration_joined: '🤝'
    };
    return icons[type] ?? '📌';
  }

  getShowcaseIcon(type: string): string {
    const icons: Record<string, string> = {
      portfolio: '📁',
      artwork: '🎨',
      music: '🎵',
      calligraphy: '✒️',
      project: '📁',
      achievement: '🏅'
    };
    return icons[type] ?? '📌';
  }
}