import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page-shell">
      <section class="card auth-card">
        <h1>ثبت نام متربی</h1>
        <p class="muted">پس از ثبت‌نام، حساب شما باید توسط مدیر تایید شود.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <input formControlName="firstName" type="text" placeholder="نام" />
          <input formControlName="lastName" type="text" placeholder="نام خانوادگی" />
          <input formControlName="username" type="text" placeholder="نام کاربری" />
          <input formControlName="email" type="email" placeholder="ایمیل" />
          <input formControlName="phoneNumber" type="text" placeholder="شماره موبایل (09xxxxxxxxx)" />
          <input formControlName="password" type="password" placeholder="رمز عبور" />
          @if (form.controls.password.touched && form.controls.password.errors?.['minlength']) {
            <small class="error">رمز عبور باید حداقل ۸ کاراکتر باشد</small>
          }
          <button type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'در حال ثبت نام...' : 'ثبت نام' }}
          </button>
        </form>

        @if (successMessage) {
          <p class="ok">{{ successMessage }}</p>
        }
        @if (errorMessage) {
          <p class="error">{{ errorMessage }}</p>
        }

        <p class="muted">
          حساب کاربری دارید؟
          <a routerLink="/auth/login">وارد شوید</a>
        </p>
      </section>
    </main>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';
  successMessage = '';

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .signup(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          window.setTimeout(() => {
            void this.router.navigateByUrl('/auth/login');
          }, 1000);
        },
        error: (error: unknown) => {
          this.errorMessage =
            (error as { error?: { message?: string } })?.error?.message ?? 'خطا در ثبت نام';
        }
      });
  }
}
