import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface HubNotification {
  id?: number;
  type?: string;
  title?: string;
  body?: string;
  link?: string;
  ts?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationEventBus {
  readonly notification$ = new Subject<HubNotification>();

  next(n: HubNotification): void {
    this.notification$.next(n);
  }
}
