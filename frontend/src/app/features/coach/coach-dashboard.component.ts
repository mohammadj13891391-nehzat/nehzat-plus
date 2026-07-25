import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import type {
  Ring,
  RingStudent,
  RingDashboardDto,
  StudentSkillProgress,
  CurrentUser
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

@Component({
  selector: 'app-coach-dashboard',
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
            <h1>داشبورد مربی</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="header-nav">
          <a class="nav-link" routerLink="/coach/spiritual" routerLinkActive="nav-link-active">مسیر معنوی</a>
        </div>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>

      <section class="main-content">
        @if (myRings$ | async; as rings) {
          @if (rings.length === 0) {
            <div class="empty-state">
              <p class="muted">هیچ حلقه‌ای به شما تخصیص نیافته است.</p>
            </div>
          } @else {
            <div class="rings-grid">
              @for (ring of rings; track ring.id) {
                <article class="ring-card" (click)="openRingDashboard(ring.id)">
                  <header class="ring-header">
                    <h3>{{ ring.name }}</h3>
                    <span class="ring-code">{{ ring.key }}</span>
                  </header>
                  <div class="ring-meta">
                    <span class="meta-item">
                      <span class="meta-label">دانش‌آموزان</span>
                      <span class="meta-value">{{ getStudentCount(ring.id) }}</span>
                    </span>
                    <span class="meta-item">
                      <span class="meta-label">کتاب‌ها</span>
                      <span class="meta-value">{{ ring.ringBooks?.length ?? 0 }}</span>
                    </span>
                    <span class="meta-item">
                      <span class="meta-label">روش‌های تدریس</span>
                      <span class="meta-value">{{ ring.ringTeachingMethods?.length ?? 0 }}</span>
                    </span>
                  </div>
                  <button type="button" class="view-dashboard-btn" (click)="openRingDashboard(ring.id); $event.stopPropagation()">
                    مشاهده داشبورد
                  </button>
                </article>
              }
            </div>
          }
        } @else {
          <p class="muted">در حال بارگذاری...</p>
        }

        @if (selectedRingDashboard$ | async; as dashboard) {
          <section class="dashboard-detail" id="ring-dashboard">
            <header class="detail-header">
              <button type="button" class="back-btn" (click)="closeRingDashboard()">بازگشت</button>
              <h2>داشبورد {{ dashboard.ringName }}</h2>
            </header>

            <div class="summary-cards">
              <div class="summary-card">
                <span class="summary-value">{{ dashboard.studentCount }}</span>
                <span class="summary-label">تعداد دانش‌آموزان</span>
              </div>
              <div class="summary-card">
                <span class="summary-value">{{ dashboard.averageScore | number:'1.0-1' }}%</span>
                <span class="summary-label">میانگین نمره</span>
              </div>
              <div class="summary-card">
                <span class="summary-value">{{ dashboard.masteredCount }}</span>
                <span class="summary-label">تکمیل‌شده (Mastered)</span>
              </div>
              <div class="summary-card">
                <span class="summary-value">{{ dashboard.achievedCount }}</span>
                <span class="summary-label">دست‌یافته (Achieved)</span>
              </div>
              <div class="summary-card">
                <span class="summary-value">{{ dashboard.inProgressCount }}</span>
                <span class="summary-label">در حال پیشرفت</span>
              </div>
              <div class="summary-card">
                <span class="summary-value">{{ dashboard.notStartedCount }}</span>
                <span class="summary-label">شروع نشده</span>
              </div>
            </div>

            <h3>پیشرفت دانش‌آموزان</h3>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>نام دانش‌آموز</th>
                    <th>نمره</th>
                    <th>سطح مهارت</th>
                    <th>آخرین ارزیابی</th>
                  </tr>
                </thead>
                <tbody>
                  @for (student of dashboard.students; track student.studentId) {
                    <tr>
                      <td>{{ student.studentName }}</td>
                      <td>{{ student.score }}%</td>
                      <td>
                        <span class="skill-badge" [class]="student.proficiencyLevel">
                          {{ getProficiencyLabel(student.proficiencyLevel) }}
                        </span>
                      </td>
                      <td>{{ student.lastAssessedAt ? (student.lastAssessedAt | date:'shortDate') : '—' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
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

    .empty-state { text-align: center; padding: 3rem; }

    .rings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    .ring-card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .ring-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    .ring-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .ring-header h3 { margin: 0; font-size: 1.1rem; }
    .ring-code { background: var(--lp-bg, #f8f9fa); color: var(--lp-muted, #6b7280); padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.85rem; }
    .ring-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .meta-label { font-size: 0.75rem; color: var(--lp-muted, #6b7280); }
    .meta-value { font-weight: 600; color: var(--lp-text, #1f2937); }
    .view-dashboard-btn {
      width: 100%;
      background: var(--lp-primary, #2563eb);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      font-weight: 500;
    }
    .view-dashboard-btn:hover { background: var(--lp-primary-hover, #1d4ed8); }

    .dashboard-detail { margin-top: 2rem; }
    .detail-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .back-btn {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    .detail-header h2 { margin: 0; font-size: 1.25rem; }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem;
      padding: 1.25rem;
      text-align: center;
    }
    .summary-value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--lp-primary, #2563eb); }
    .summary-label { font-size: 0.8rem; color: var(--lp-muted, #6b7280); }

    h3 { margin: 1.5rem 0 1rem; color: var(--lp-text, #1f2937); }

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

    .skill-badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .skill-badge.not_started { background: #f3f4f6; color: #6b7280; }
    .skill-badge.in_progress { background: #dbeafe; color: #2563eb; }
    .skill-badge.achieved { background: #dcfce7; color: #16a34a; }
    .skill-badge.mastered { background: #a78bfa; color: #fff; }

    @media (max-width: 768px) {
      .rings-grid { grid-template-columns: 1fr; }
      .main-content { padding: 1rem; }
      .summary-cards { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
      .summary-cards { grid-template-columns: 1fr; }
      .data-table th, .data-table td { padding: 0.5rem; font-size: 0.85rem; }
    }
    .header-nav { display: flex; align-items: center; gap: 0.5rem; }
    .nav-link { color: var(--lp-primary, #2563eb); text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-weight: 500; }
    .nav-link:hover { background: rgba(37, 99, 235, 0.08); }
    .nav-link-active { background: rgba(37, 99, 235, 0.12); font-weight: 700; }
  `]
})
export class CoachDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);

  currentUser: CurrentUser | null = null;
  logoHidden = false;
  selectedRingId: number | null = null;

  myRings$: Observable<Ring[]> = this.api.getMyRings();
  myRingStudents$: Observable<RingStudent[]> = this.api.getMyRingStudents();
  selectedRingDashboard$: Observable<RingDashboardDto | null> = new Observable();

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'coach') {
      void this.router.navigateByUrl(this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee'));
    }
  }

  getStudentCount(ringId: number): number {
    // This would ideally come from the API, for now return 0
    // The actual count is in the dashboard detail view
    return 0;
  }

  openRingDashboard(ringId: number): void {
    this.selectedRingId = ringId;
    this.selectedRingDashboard$ = this.api.getRingDashboard(ringId);
  }

  closeRingDashboard(): void {
    this.selectedRingId = null;
    this.selectedRingDashboard$ = new Observable();
  }

  getProficiencyLabel(level: string): string {
    const labels: Record<string, string> = {
      not_started: 'شروع نشده',
      in_progress: 'در حال پیشرفت',
      achieved: 'دست‌یافته',
      mastered: 'تکمیل‌شده'
    };
    return labels[level] ?? level;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}