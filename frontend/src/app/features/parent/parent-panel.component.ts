import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CurrentUser, ParentStudentInfo } from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';
import { StudentProgressCardComponent } from './student-progress-card.component';

@Component({
  selector: 'app-parent-panel',
  standalone: true,
  imports: [CommonModule, StudentProgressCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="role-page">
      <header class="site-header">
        <div class="brand-wrap">
          <img
            src="assets/nehzat.png"
            alt="لوگو سایت"
            class="site-logo"
            (error)="logoHidden = true"
          />
          <div>
            <h1>پنل والدین</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>

      <section class="main-content">
        <h2>دانش‌آموزان شما</h2>

        @if (students$ | async; as students) {
          @if (students.length === 0) {
            <p class="muted">هیچ دانش‌آموزی ثبت نشده است.</p>
          } @else {
            <div class="students-grid">
              @for (student of students; track student.studentId) {
                <app-student-progress-card
                  [studentId]="student.studentId"
                  [studentName]="student.studentName"
                  [studentCode]="student.studentCode"
                  [courseName]="student.courseName"
                  [latestGrade]="student.latestGrade"
                  [attendanceRate]="student.attendanceRate"
                />
              }
            </div>
          }
        } @else {
          <p class="muted">در حال بارگذاری...</p>
        }
      </section>
    </main>
  `,
  styles: [`
    .role-page { direction: rtl; min-height: 100vh; background: var(--lp-bg, #f8f9fa); }
    .site-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: var(--lp-surface, #fff); border-bottom: 1px solid var(--lp-border, #e5e7eb); }
    .brand-wrap { display: flex; align-items: center; gap: 1rem; }
    .site-logo { width: 48px; height: 48px; object-fit: contain; }
    h1 { margin: 0; font-size: 1.25rem; }
    .muted { color: var(--lp-muted, #6b7280); margin: 0; }
    .menu-trigger { background: var(--lp-primary, #2563eb); color: #fff; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; }
    .main-content { padding: 2rem; }
    .students-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
  `]
})
export class ParentPanelComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LessonPlannerApi);
  private readonly router = inject(Router);

  currentUser: CurrentUser | null = null;
  logoHidden = false;
  students$: Observable<ParentStudentInfo[]> = new Observable();

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'parent') {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee')
      );
      return;
    }

    // Fetch parent's students
    const parentId = this.currentUser.studentId ?? 0;
    this.students$ = this.api.getParentStudents(parentId);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
