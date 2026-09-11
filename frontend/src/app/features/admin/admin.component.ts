import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AdminNavigationComponent } from './admin-navigation.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminNavigationComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly api = inject(LESSON_PLANNER_API);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  errorMessage = '';
  successMessage = '';

  stats = {
    pendingUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    totalAttachments: 0,
    activeCourses: 0,
  };

  readonly provinces = [
    'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
    'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
    'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
    'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
    'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
  ];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (
      user?.userType !== 'manager' &&
      user?.userType !== 'headquarters' &&
      user?.userType !== 'branch_manager'
    ) {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(user?.userType ?? 'trainee'),
      );
      return;
    }

    this.loadStatistics();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  private loadStatistics(): void {
    this.api
      .getSystemStatistics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (systemStats) => {
          this.stats.totalCourses = systemStats.totalCourses;
          this.stats.totalAssignments = systemStats.totalAssignments;
          this.stats.totalAttachments = systemStats.totalAttachments;
          this.stats.activeCourses = systemStats.activeCourses;
          this.cdr.markForCheck();
        },
        error: () => {},
      });
  }

  setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
  }

  setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
  }
}