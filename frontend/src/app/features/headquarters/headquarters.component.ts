import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type {
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
  Madrasah,
  MaktabBranch,
  CurrentUser
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import type { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';

type TabKey = 'summary' | 'branches' | 'coaches' | 'madrasahs';

@Component({
  selector: 'app-headquarters',
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
            [class.hidden]="logoHidden"
            (error)="logoHidden = true"
          />
          <div>
            <h1>پنل ستاد</h1>
            <p class="muted">خوش آمدید {{ currentUser?.username }}</p>
          </div>
        </div>
        <div class="header-nav">
          <a
            class="nav-link"
            routerLink="/headquarters/spiritual"
            routerLinkActive="nav-link-active"
          >مسیر معنوی</a>
        </div>
        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="logout()">خروج</button>
        </div>
      </header>

      <nav class="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'summary'"
          (click)="activeTab.set('summary')"
        >خلاصه</button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'branches'"
          (click)="activeTab.set('branches')"
        >عملکرد شعب</button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'coaches'"
          (click)="activeTab.set('coaches')"
        >عملکرد مربیان</button>
        <button
          type="button"
          role="tab"
          class="tab"
          [class.tab-active]="activeTab() === 'madrasahs'"
          (click)="activeTab.set('madrasahs')"
        >مدیریت مدارس</button>
      </nav>

      <section class="main-content">
        @if (activeTab() === 'summary') {
          @if (summary$ | async; as summary) {
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
                <div class="stat-icon">🏢</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalBranchManagers }}</span>
                  <span class="stat-label">مدیران شعب</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📋</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalEvaluators }}</span>
                  <span class="stat-label">ارزیابان</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">👨‍👩‍👧</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalParents }}</span>
                  <span class="stat-label">اولیا</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🏫</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalMadrasahs }}</span>
                  <span class="stat-label">مدارس</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🌿</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalBranches }}</span>
                  <span class="stat-label">شعب مکتب</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📚</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalCourses }}</span>
                  <span class="stat-label">کل دوره‌ها</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.activeCourses }}</span>
                  <span class="stat-label">دوره‌های فعال</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalAssignments }}</span>
                  <span class="stat-label">تکالیف</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📤</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.totalSubmissions }}</span>
                  <span class="stat-label">ارسال‌ها</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.averageScore | number: '1.0-1' }}%</span>
                  <span class="stat-label">میانگین نمرات</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                  <span class="stat-value">{{ summary.averageAttendanceRate | number: '1.0-1' }}%</span>
                  <span class="stat-label">نرخ حضور</span>
                </div>
              </div>
            </div>
            <p class="muted updated">آخرین به‌روزرسانی: {{ summary.lastUpdated }}</p>
          } @else {
            <p class="muted">در حال بارگذاری خلاصه...</p>
          }
        }

        @if (activeTab() === 'branches') {
          <div class="card-section">
            <h2>عملکرد شعب</h2>
            @if (branchPerformance$ | async; as branches) {
              @if (branches.length === 0) {
                <p class="muted">داده‌ای برای نمایش وجود ندارد.</p>
              } @else {
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
                          <td data-label="میانگین نمره">{{ branch.averageScore | number: '1.0-1' }}%</td>
                          <td data-label="نرخ حضور">{{ branch.attendanceRate }}%</td>
                          <td data-label="دوره‌های فعال">{{ branch.activeCourses }}</td>
                          <td data-label="ارزیابی‌ها">{{ branch.evaluationCount }}</td>
                          <td data-label="میانگین ارزیابی">{{ branch.averageEvaluationScore | number: '1.0-1' }}%</td>
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
            } @else {
              <p class="muted">در حال بارگذاری عملکرد شعب...</p>
            }
          </div>
        }

        @if (activeTab() === 'coaches') {
          <div class="card-section">
            <h2>عملکرد مربیان</h2>
            @if (coachPerformance$ | async; as coaches) {
              @if (coaches.length === 0) {
                <p class="muted">داده‌ای برای نمایش وجود ندارد.</p>
              } @else {
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
                          <td data-label="میانگین نمره">{{ coach.averageStudentScore | number: '1.0-1' }}%</td>
                          <td data-label="ارزیابی‌ها">{{ coach.evaluationCount }}</td>
                          <td data-label="میانگین ارزیابی">{{ coach.averageEvaluationScore | number: '1.0-1' }}%</td>
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
            } @else {
              <p class="muted">در حال بارگذاری عملکرد مربیان...</p>
            }
          </div>
        }

        @if (activeTab() === 'madrasahs') {
          <div class="card-section">
            <h2>مدیریت مدارس</h2>
            @if (madrasahs$ | async; as madrasahs) {
              @if (madrasahs.length === 0) {
                <p class="muted">مدرسه‌ای ثبت نشده است.</p>
              } @else {
                <div class="madrasah-list">
                  @for (madrasah of madrasahs; track madrasah.id) {
                    <div class="madrasah-card">
                      <div class="madrasah-head" (click)="toggleMadrasah(madrasah.id)">
                        <div class="madrasah-title">
                          <span class="expand-icon">{{ expandedMadrasahId() === madrasah.id ? '▾' : '▸' }}</span>
                          <strong>{{ madrasah.name }}</strong>
                          <span class="madrasah-meta">
                            ({{ madrasah.gender === 'boys' ? 'پسرانه' : 'دخترانه' }} -
                            پایه {{ madrasah.grade }})
                          </span>
                        </div>
                        <span class="status-badge" [class.active]="madrasah.status === 'active'">
                          {{ madrasah.status === 'active' ? 'فعال' : 'غیرفعال' }}
                        </span>
                      </div>
                      @if (expandedMadrasahId() === madrasah.id) {
                        <div class="madrasah-body">
                          <dl class="meta-grid">
                            <div><dt>کلید</dt><dd>{{ madrasah.key }}</dd></div>
                            <div><dt>برچسب</dt><dd>{{ madrasah.label }}</dd></div>
                            <div><dt>سطح</dt><dd>{{ madrasah.level }}</dd></div>
                            <div><dt>ظرفیت</dt><dd>{{ madrasah.capacity ?? '—' }}</dd></div>
                          </dl>
                          <h3>شعب مکتب</h3>
                          @if (branchCache()[madrasah.id]; as branches) {
                            @if (branches.length === 0) {
                              <p class="muted">شعبه‌ای برای این مدرسه ثبت نشده است.</p>
                            } @else {
                              <div class="table-container">
                                <table class="data-table">
                                  <thead>
                                    <tr>
                                      <th>نام شعبه</th>
                                      <th>استان</th>
                                      <th>آدرس</th>
                                      <th>ظرفیت</th>
                                      <th>وضعیت</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    @for (branch of branches; track branch.id) {
                                      <tr>
                                        <td data-label="نام شعبه">{{ branch.name }}</td>
                                        <td data-label="استان">{{ branch.province }}</td>
                                        <td data-label="آدرس">{{ branch.address || '—' }}</td>
                                        <td data-label="ظرفیت">{{ branch.capacity }}</td>
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
                          } @else {
                            <p class="muted">در حال بارگذاری شعب...</p>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            } @else {
              <p class="muted">در حال بارگذاری مدارس...</p>
            }
          </div>
        }
      </section>
    </main>
  `,
  styles: [`
    .role-page { direction: rtl; min-height: 100vh; background: var(--lp-bg, #f8f9fa); }
    .site-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem; background: var(--lp-surface, #fff);
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .brand-wrap { display: flex; align-items: center; gap: 1rem; }
    .site-logo { width: 48px; height: 48px; object-fit: contain; }
    .site-logo.hidden { display: none; }
    h1 { margin: 0; font-size: 1.25rem; color: var(--lp-text, #1f2937); }
    .muted { color: var(--lp-muted, #6b7280); margin: 0; }
    .updated { margin-top: 1rem; font-size: 0.8rem; }
    .menu-trigger {
      background: var(--lp-primary, #2563eb); color: #fff; border: none;
      border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer;
    }
    .menu-trigger:hover { opacity: 0.9; }
    .header-nav { display: flex; align-items: center; gap: 0.5rem; }
    .nav-link {
      color: var(--lp-primary, #2563eb); text-decoration: none;
      padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-weight: 500;
    }
    .nav-link:hover { background: rgba(37, 99, 235, 0.08); }
    .nav-link-active { background: rgba(37, 99, 235, 0.12); font-weight: 700; }

    .tabs {
      display: flex; gap: 0.25rem; padding: 0 2rem;
      background: var(--lp-surface, #fff);
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .tab {
      background: transparent; border: none; border-bottom: 2px solid transparent;
      padding: 0.75rem 1.25rem; cursor: pointer; font-size: 0.95rem;
      color: var(--lp-muted, #6b7280); font-weight: 500;
    }
    .tab:hover { color: var(--lp-text, #1f2937); background: var(--lp-bg, #f8f9fa); }
    .tab-active {
      color: var(--lp-primary, #2563eb); border-bottom-color: var(--lp-primary, #2563eb);
      font-weight: 700;
    }

    .main-content { padding: 2rem; }
    h2 { margin-top: 0; color: var(--lp-text, #1f2937); }
    h3 { margin: 1rem 0 0.5rem; font-size: 1rem; color: var(--lp-text, #1f2937); }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .stat-card {
      display: flex; align-items: center; gap: 1rem;
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.75rem; padding: 1.25rem;
    }
    .stat-icon { font-size: 2rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--lp-primary, #2563eb); }
    .stat-label { font-size: 0.85rem; color: var(--lp-muted, #6b7280); }

    .card-section { margin-top: 0; }
    .table-container { overflow-x: auto; }
    .data-table {
      width: 100%; border-collapse: collapse;
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem; overflow: hidden;
    }
    .data-table th, .data-table td {
      padding: 0.75rem 1rem; text-align: right;
      border-bottom: 1px solid var(--lp-border, #e5e7eb);
    }
    .data-table th {
      background: var(--lp-bg, #f8f9fa); font-weight: 600;
      color: var(--lp-text, #1f2937); white-space: nowrap;
    }
    .data-table tbody tr:hover { background: var(--lp-bg, #f8f9fa); }
    .status-badge {
      display: inline-block; padding: 0.25rem 0.75rem;
      border-radius: 9999px; font-size: 0.8rem; font-weight: 500;
    }
    .status-badge.active { background: #dcfce7; color: #166534; }
    .status-badge:not(.active) { background: #fef2f2; color: #991b1b; }

    .madrasah-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .madrasah-card {
      background: var(--lp-surface, #fff);
      border: 1px solid var(--lp-border, #e5e7eb);
      border-radius: 0.5rem; overflow: hidden;
    }
    .madrasah-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.75rem 1rem; cursor: pointer;
    }
    .madrasah-head:hover { background: var(--lp-bg, #f8f9fa); }
    .madrasah-title { display: flex; align-items: center; gap: 0.5rem; }
    .expand-icon { color: var(--lp-muted, #6b7280); }
    .madrasah-meta { color: var(--lp-muted, #6b7280); font-size: 0.85rem; }
    .madrasah-body { padding: 0 1rem 1rem; border-top: 1px solid var(--lp-border, #e5e7eb); }
    .meta-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.5rem; margin: 0.75rem 0;
    }
    .meta-grid div {
      background: var(--lp-bg, #f8f9fa); border-radius: 0.375rem; padding: 0.5rem 0.75rem;
    }
    .meta-grid dt { font-size: 0.75rem; color: var(--lp-muted, #6b7280); }
    .meta-grid dd { margin: 0; font-weight: 600; color: var(--lp-text, #1f2937); }
  `]
})
export class HeadquartersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(LESSON_PLANNER_API) as LessonPlannerApi;
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  readonly activeTab = signal<TabKey>('summary');
  readonly expandedMadrasahId = signal<number | null>(null);
  readonly branchCache = signal<Record<number, MaktabBranch[]>>({});

  readonly summary$: Observable<HeadquartersSummary>;
  readonly branchPerformance$: Observable<BranchPerformance[]>;
  readonly coachPerformance$: Observable<CoachPerformance[]>;
  readonly madrasahs$: Observable<Madrasah[]>;

  constructor() {
    this.summary$ = this.api.getHeadquartersSummary();
    this.branchPerformance$ = this.api.getBranchPerformance();
    this.coachPerformance$ = this.api.getCoachPerformance();
    this.madrasahs$ = this.api.getMadrasahs();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'headquarters') {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee')
      );
    }
  }

  toggleMadrasah(madrasahId: number): void {
    const current = this.expandedMadrasahId();
    if (current === madrasahId) {
      this.expandedMadrasahId.set(null);
      return;
    }
    this.expandedMadrasahId.set(madrasahId);
    if (!this.branchCache()[madrasahId]) {
      this.api
        .getMaktabBranches(madrasahId)
        .pipe(
          catchError(() => of([] as MaktabBranch[])),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((branches) => {
          this.branchCache.update((cache) => ({ ...cache, [madrasahId]: branches }));
        });
    }
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}