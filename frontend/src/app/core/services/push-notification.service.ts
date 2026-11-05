import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationEventBus, HubNotification } from './notification-events';
import { LessonPlannerApi } from './lesson-planner-api.interface';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private readonly bus = inject(NotificationEventBus);
  private readonly api = inject(LessonPlannerApi);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private registered = false;

  get isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  register(): void {
    if (this.registered || !this.isNative || !this.auth.isAuthenticated()) {
      return;
    }
    this.registered = true;

    PushNotifications.addListener('registration', async ({ value }: { value: string }) => {
      await this.sendToken(value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.warn('push registration error', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      this.forward(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const link = action.notification?.data?.link as string | undefined;
      if (link) {
        this.router.navigateByUrl(link).catch(() => {});
      }
      this.forward(action.notification);
    });

    void this.startRegistration();
  }

  private async startRegistration(): Promise<void> {
    try {
      await PushNotifications.createChannel({
        id: 'nehzat_notifications',
        name: 'اعلان‌های نهضت',
        importance: 4
      });
    } catch {
      // channel creation is best-effort (e.g. missing Firebase setup)
    }

    let receive = 'granted';
    try {
      const perms = await PushNotifications.requestPermissions();
      receive = perms.receive;
    } catch {
      return;
    }
    if (receive !== 'granted') {
      return;
    }

    try {
      await PushNotifications.register();
    } catch {
      // Firebase not initialized (no google-services.json yet) — build stays green, push disabled on device
    }
  }

  private async sendToken(token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.api.registerDevice({
          deviceToken: token,
          platform: 'android',
          deviceName: Capacitor.getPlatform()
        })
      );
    } catch {
      // token registration is best-effort; the bell still works via hub + polling
    }
  }

  private forward(notification: { title?: string; body?: string; data?: unknown } | undefined): void {
    if (!notification) {
      return;
    }
    const data = (notification.data ?? {}) as Record<string, string>;
    const title = notification.title ?? data.title;
    const body = notification.body ?? data.body;
    if (!title && !body) {
      return;
    }
    this.bus.next({
      id: data.id ? Number(data.id) : undefined,
      type: data.type,
      title,
      body,
      link: data.link
    });
  }
}
