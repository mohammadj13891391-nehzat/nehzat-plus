import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  protected isSubmitting = false;
  protected errorMessage = '';
  private returnUrl = '';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '';
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    const { username, password } = this.form.getRawValue();

    this.authService
      .signin(username, password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          if (this.returnUrl) {
            window.location.href = this.returnUrl;
            return;
          }
          const user = this.authService.getCurrentUser();
          const target = user
            ? this.authService.getDashboardPathForRole(user.userType)
            : '/dashboard';
          void this.router.navigateByUrl(target);
        },
        error: (error) => {
          this.errorMessage = error?.error?.error_description
            ?? error?.error?.message
            ?? 'نام کاربری یا رمز عبور اشتباه است';
          this.notify.show(this.errorMessage, 'error');
        }
      });
  }
}
