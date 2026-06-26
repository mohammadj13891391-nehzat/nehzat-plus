import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page-container">
      <section class="card auth-card">
        <h1 class="title">ورود به پنل متربی</h1>
        <p class="subtitle">برای نسخه نمایشی از حساب‌های زیر استفاده کنید:</p>
        <ul class="demo-accounts">
          <li>متربی: <code>student / student123</code></li>
          <li>مدیر: <code>admin / admin123</code></li>
        </ul>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <label class="field">
            <span>نام کاربری</span>
            <input formControlName="username" type="text" />
          </label>
          <label class="field">
            <span>رمز عبور</span>
            <input formControlName="password" type="password" />
          </label>
          @if (errorMessage) {
            <p class="error-text">{{ errorMessage }}</p>
          }
          <button class="btn-primary" type="submit" [disabled]="form.invalid || isSubmitting">
            {{ isSubmitting ? 'در حال ورود...' : 'ورود' }}
          </button>
        </form>

        <p class="helper-text">
          حساب ندارید؟
          <a routerLink="/auth/register">ثبت‌نام</a>
        </p>
      </section>
    </main>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
      .subscribe({
        next: (response) => {
          const target = response.userType === 'admin' ? '/admin' : '/dashboard';
          void this.router.navigateByUrl(target);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'خطا در ورود. دوباره تلاش کنید.';
        }
      });
  }
}
