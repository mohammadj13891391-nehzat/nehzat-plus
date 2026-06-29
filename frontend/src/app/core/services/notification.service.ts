import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'error' | 'success';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private counter = 0;
  private readonly duration = 5000;

  notifications = signal<Notification[]>([]);

  show(message: string, type: 'error' | 'success' = 'error'): void {
    const id = ++this.counter;
    this.notifications.update((list) => [...list, { id, message, type }]);

    setTimeout(() => this.dismiss(id), this.duration);
  }

  dismiss(id: number): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
