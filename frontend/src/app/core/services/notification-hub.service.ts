import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { resolveApiBaseUrl } from './api-url.util';

export interface HubNotification {
  title: string;
  body: string;
  ts: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationHubService {
  private readonly auth = inject(AuthService);
  private readonly notifier = inject(NotificationService);
  private connection: HubConnection | null = null;
  private starting = false;

  connect(): void {
    if (this.connection || this.starting) return;
    const user = this.auth.getCurrentUser();
    if (!user?.username) return;
    this.starting = true;

    const conn = new HubConnectionBuilder()
      .withUrl(`${resolveApiBaseUrl()}/hubs/notifications`, {
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => this.auth.getAccessToken() ?? ''
      })
      .withAutomaticReconnect()
      .build();

    conn.on('ReceiveNotification', (n: HubNotification) => {
      if (n && (n.title || n.body)) {
        this.notifier.show(`${n.title ? n.title + ': ' : ''}${n.body ?? ''}`, 'info');
      }
    });

    conn
      .start()
      .then(() => conn.invoke('JoinGroup', user.username))
      .then(() => {
        this.connection = conn;
      })
      .catch(() => {
        this.connection = null;
      })
      .finally(() => {
        this.starting = false;
      });
  }

  disconnect(): void {
    const conn = this.connection;
    this.connection = null;
    if (conn) {
      conn.stop().catch(() => {});
    }
  }
}
