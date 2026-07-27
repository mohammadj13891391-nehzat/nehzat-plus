import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import type {
  Branch,
  CreateMadrasahPayload,
  Madrasah,
  MaktabBranch,
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

import { AdminStudentsComponent } from './admin-students/admin-students.component';
import { AdminCoachesComponent } from './admin-coaches/admin-coaches.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminBranchManagersComponent } from './admin-branch-managers/admin-branch-managers.component';
import { AdminParentsComponent } from './admin-parents/admin-parents.component';
import { AdminEvaluatorsComponent } from './admin-evaluators/admin-evaluators.component';
import { AdminHeadquartersComponent } from './admin-headquarters/admin-headquarters.component';
import { AdminMakatibComponent } from './admin-makatib/admin-makatib.component';
import { AdminCurriculumComponent } from './admin-curriculum/admin-curriculum.component';
import { AdminRingsComponent } from './admin-rings/admin-rings.component';
import { AdminSurveysComponent } from './admin-surveys/admin-surveys.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AdminStudentsComponent,
    AdminCoachesComponent,
    AdminCoursesComponent,
    AdminBranchManagersComponent,
    AdminParentsComponent,
    AdminEvaluatorsComponent,
    AdminHeadquartersComponent,
    AdminMakatibComponent,
    AdminCurriculumComponent,
    AdminRingsComponent,
    AdminSurveysComponent,
  ],
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

  username = '';
  errorMessage = '';
  successMessage = '';
  activeMenu: string = 'makatib';
  expandedMenus = new Set<string>(['makatib']);
  menuItems = [
    { key: 'trainees', label: 'متربیان', roles: ['manager', 'headquarters'] },
    { key: 'teachers', label: 'مربیان', roles: ['manager', 'headquarters'] },
    { key: 'courses', label: 'دوره‌ها', roles: ['manager', 'headquarters'] },
    { key: 'branch-managers', label: 'مسئولین شعب', roles: ['manager', 'headquarters'] },
    { key: 'makatib', label: 'مکاتب تربیتی، آموزشی، مهارتی', roles: ['manager', 'headquarters'] },
    { key: 'curriculum', label: 'برنامه درسی', roles: ['manager', 'headquarters'] },
    { key: 'rings', label: 'حلقه‌ها', roles: ['manager', 'headquarters'] },
    { key: 'parents', label: 'والدین', roles: ['manager', 'headquarters'] },
    { key: 'evaluators', label: 'ارزیاب', roles: ['manager', 'headquarters'] },
    { key: 'headquarters', label: 'ستاد', roles: ['manager', 'headquarters'] },
    { key: 'spiritual', label: 'مسیر معنوی', roles: ['manager', 'headquarters'] },
    { key: 'surveys', label: 'نظرسنجی‌ها', roles: ['manager', 'headquarters'] },
  ] as const;

  registeredBranches: Branch[] = [];

  get visibleMenuItems() {
    const currentUser = this.authService.getCurrentUser();
    const userType = currentUser?.userType ?? 'trainee';
    return this.menuItems.filter((item) => (item.roles as readonly string[]).includes(userType));
  }

  get isBranchManager(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.userType === 'branch_manager';
  }

  get currentUserBranchId(): number | undefined {
    return this.authService.getCurrentUser()?.branchId;
  }

  stats = {
    pendingUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    totalAttachments: 0,
    activeCourses: 0,
  };

  /* ──────────────────────────────────────
   * Madrasah sidebar (loaded from API)
   * ────────────────────────────────────── */

  madrasahs: Madrasah[] = [];

  get makatibGirls(): Madrasah[] {
    return this.madrasahs.filter((m) => m.gender === 'girls');
  }

  get makatibBoys(): Madrasah[] {
    return this.madrasahs.filter((m) => m.gender === 'boys');
  }

  get allMakatib(): Madrasah[] {
    return this.madrasahs;
  }

  readonly provinces = [
    'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
    'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
    'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
    'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
    'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
  ];

  constructor() {
    this.username = this.authService.getCurrentUser()?.username ?? 'admin';
  }

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

    this.loadBranchesList();
    this.loadMadrasahsForSidebar();

    if (this.isBranchManager) {
      this.activeMenu = 'trainees';
    }

    this.loadStatistics();
  }

  /* ──────────────────────────────────────
   * Sidebar helpers
   * ────────────────────────────────────── */

  toggleExpand(key: string): void {
    if (this.expandedMenus.has(key)) {
      this.expandedMenus.delete(key);
    } else {
      this.expandedMenus.add(key);
    }
  }

  onMadrasahSidebarClick(madrasah: Madrasah): void {
    this.activeMenu = madrasah.key;
    if (madrasah.gender === 'girls') {
      this.expandedMenus.add('makatib-girls');
    } else {
      this.expandedMenus.add('makatib-boys');
    }
  }

  /** Load madrasahs for the sidebar navigation tree. */
  loadMadrasahsForSidebar(): void {
    this.api
      .getMadrasahs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (madrasahs) => {
          this.madrasahs = madrasahs;
          this.cdr.markForCheck();
        },
        error: () => {},
      });
  }

  /** Load branches for the sidebar branch-manager form (kept in shell for now). */
  loadBranchesList(): void {
    this.api
      .getBranches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (branches) => {
          this.registeredBranches = branches;
          this.cdr.markForCheck();
        },
        error: () => {},
      });
  }

  /* ──────────────────────────────────────
   * Logout / refresh
   * ────────────────────────────────────── */

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  navigateToSpiritual(): void {
    void this.router.navigate(['/admin/spiritual']);
  }

  /* ──────────────────────────────────────
   * Private
   * ────────────────────────────────────── */

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
