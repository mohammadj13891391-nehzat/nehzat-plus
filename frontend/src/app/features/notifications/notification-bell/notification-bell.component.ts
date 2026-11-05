import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from '../notifications.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationHubService } from '../../../core/services/notification-hub.service';
import type { NotificationDto } from '../../../core/models/lesson-planner.models';

const TYPE_ICONS: Record<NotificationDto['type'], string> = {
  info: 'ℹ',
  warning: '⚠',
  success: '✓',
  error: '✕',
};

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBellComponent implements OnInit {
  private readonly notifications = inject(NotificationsService);
  private readonly auth = inject(AuthService);
  private readonly hub = inject(NotificationHubService);
  private readonly destroyRef = inject(DestroyRef);

  readonly typeIcons = TYPE_ICONS;

  unread = signal(0);
  items = signal<NotificationDto[]>([]);
  open = signal(false);
  loading = signal(true);

  ngOnInit(): void {
    this.refresh();
    this.hub.notification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refresh());
  }

  refresh(): void {
    if (!this.auth.isAuthenticated()) {
      this.loading.set(false);
      return;
    }
    this.notifications
      .getNotifications(10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          this.items.set(summary.recent);
          this.unread.set(summary.unreadCount);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  toggle(): void {
    this.open.update((v) => !v);
    if (this.open()) {
      this.refresh();
    }
  }

  markAllRead(): void {
    this.notifications
      .markAllRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.unread.set(0);
          this.items.update((list) => list.map((n) => ({ ...n, isRead: true })));
        },
      });
  }

  markRead(id: number): void {
    this.notifications
      .markRead(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.items.update((list) => list.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
          this.unread.update((u) => Math.max(0, u - 1));
        },
      });
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' });
  }
}
