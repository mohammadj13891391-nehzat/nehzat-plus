import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import type {
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
  CurrentUser
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-headquarters-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <h1>داشبورد سرزمینی</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="header-nav">
          <a class="nav-link" routerLink="/headquarters/spiritual" routerLinkActive="nav-link-active">مسیر معنوی</a>
        </div>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>

      <section class="main-content">
        @if (summary$ | async; as summary) {
          <!-- Summary Cards -->
          <div class="summary-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <span class="stat-value">{{ summary.totalStudents }}</span>
                <span class="stat-label">کل دانش‌آموزان</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👨‍🏫</div>
              <div class="stat-info">
                <span class="stat-value">{{ summary.totalCoaches }}</span>
                <span class="stat-label">کل مربیان</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🏫</div>
              <div class="stat-info">
                <span class="stat-value">{{ summary.totalBranches }}</span>
                <span class="stat-label">کل شعب</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-info">
                <span class="stat-value">{{ summary.activeCourses }}</span>
                <span class="stat-label">دوره‌های فعال</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <span class="stat-value">{{ summary.averageScore | number:'1.0-1' }}%</span>
                <span class="stat-label">میانگین نمرات</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-info">
                <span class="stat-value">{{ summary.totalSubmissions }}</span>
                <span class="stat-label">تعداد ارسال‌ها</span>
              </div>
            </div>
          </div>

          <!-- Branch Performance Table -->
          <div class="card-section">
            <h2>عملکرد شعب</h2>
            @if (branchPerformance$ | async; as branches) {
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>نام شعبه</th>
                      <th>استان</th>
                      <th>مدرسه</th>
                      <th>دانش‌آموزان</th>
                      <th>میانگین نمره</th>
                      <th>نرخ حضور</th>
                      <th>دوره‌های فعال</th>
                      <th>ارزیابی‌ها</th>
                      <th>میانگین ارزیابی</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (branch of branches; track branch.branchId) {
                      <tr>
                        <td data-label="نام شعبه">{{ branch.branchName }}</td>
                        <td data-label="استان">{{ branch.province }}</td>
                        <td data-label="مدرسه">{{ branch.madrasahName }}</td>
                        <td data-label="دانش‌آموزان">{{ branch.studentCount }}</td>
                        <td data-label="میانگین نمره">{{ branch.averageScore | number:'1.0-1' }}%</td>
                        <td data-label="نرخ حضور">{{ branch.attendanceRate }}%</td>
                        <td data-label="دوره‌های فعال">{{ branch.activeCourses }}</td>
                        <td data-label="ارزیابی‌ها">{{ branch.evaluationCount }}</td>
                        <td data-label="میانگین ارزیابی">{{ branch.averageEvaluationScore | number:'1.0-1' }}%</td>
                        <td data-label="وضعیت">
                          <span class="status-badge" [class.active]="branch.status === 'active'">
                            {{ branch.status === 'active' ? 'فعال' : 'غیرفعال' }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

          <!-- Coach Performance Table -->
          <div class="card-section">
            <h2>عملکرد مربیان</h2>
            @if (coachPerformance$ | async; as coaches) {
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>نام مربی</th>
                      <th>تخصص</th>
                      <th>دوره‌ها</th>
                      <th>دانش‌آموزان</th>
                      <th>میانگین نمره</th>
                      <th>ارزیابی‌ها</th>
                      <th>میانگین ارزیابی</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (coach of coaches; track coach.coachId) {
                      <tr>
                        <td data-label="نام مربی">{{ coach.coachName }}</td>
                        <td data-label="تخصص">{{ coach.specialization }}</td>
                        <td data-label="دوره‌ها">{{ coach.assignedCourseCount }}</td>
                        <td data-label="دانش‌آموزان">{{ coach.studentCount }}</td>
                        <td data-label="میانگین نمره">{{ coach.averageStudentScore | number:'1.0-1' }}%</td>
                        <td data-label="ارزیابی‌ها">{{ coach.evaluationCount }}</td>
                        <td data-label="میانگین ارزیابی">{{ coach.averageEvaluationScore | number:'1.0-1' }}%</td>
                        <td data-label="وضعیت">
                          <span class="status-badge" [class.active]="coach.status === 'active'">
                            {{ coach.status === 'active' ? 'فعال' : 'غیرفعال' }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
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
    h2 { margin-top: 0; color: var(--lp-text, #1f2937); }
    .muted { color: var(--lp-muted, #6b7280); margin: 0; }
    .menu-trigger { background: var(--lp-primary, #2563eb); color: #fff; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; }
    .main-content { padding: 2rem; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem;
      padding: 1.25rem;
    }
    .stat-icon { font-size: 2rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--lp-primary, #2563eb); }
    .stat-label { font-size: 0.85rem; color: var(--lp-muted, #6b7280); }

    .card-section { margin-top: 2rem; }
    .table-container { overflow-x: auto; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .data-table th, .data-table td {
      padding: 0.75rem 1rem;
      text-align: right;
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .data-table th {
      background: var(--lp-bg, #f8f9fa);
      font-weight: 600;
      color: var(--lp-text, #1f2937);
      white-space: nowrap;
    }
    .data-table tbody tr:hover { background: var(--lp-bg, #f8f9fa); }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .status-badge.active { background: #dcfce7; color: #166534; }
    .status-badge:not(.active) { background: #fef2f2; color: #991b1b; }
    .header-nav { display: flex; align-items: center; gap: 0.5rem; }
    .nav-link { color: var(--lp-primary, #2563eb); text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-weight: 500; }
    .nav-link:hover { background: rgba(37, 99, 235, 0.08); }
    .nav-link-active { background: rgba(37, 99, 235, 0.12); font-weight: 700; }
  `]
})
export class HeadquartersDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  summary$: Observable<HeadquartersSummary>;
  branchPerformance$: Observable<BranchPerformance[]>;
  coachPerformance$: Observable<CoachPerformance[]>;

  constructor() {
    this.summary$ = this.api.getHeadquartersSummary();
    this.branchPerformance$ = this.api.getBranchPerformance();
    this.coachPerformance$ = this.api.getCoachPerformance();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'headquarters') {
      // The route guard should handle this, but just in case
      console.warn('User is not headquarters type');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}