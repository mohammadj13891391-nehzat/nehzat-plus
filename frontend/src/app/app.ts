import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './core/components/notification/notification.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { NotificationBellComponent } from './features/notifications/notification-bell/notification-bell.component';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent, NavbarComponent, NotificationBellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly push = inject(PushNotificationService);

  ngOnInit(): void {
    this.push.register();
  }
}
