import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  protected isSubmitting = false;
  protected errorMessage = '';
  protected onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    const payload = this.form.getRawValue();

    this.authService
      .signin(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          const target = this.authService.getDashboardPathForRole(response.userType);
          void this.router.navigateByUrl(target);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'خطا در ورود. دوباره تلاش کنید.';
          this.notify.show(this.errorMessage, 'error');
        }
      });
  }
}
