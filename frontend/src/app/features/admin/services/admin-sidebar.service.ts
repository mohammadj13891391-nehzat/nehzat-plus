import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import type { Branch, Madrasah } from '../../../core/models/lesson-planner.models';

export interface MenuItem {
  key: string;
  label: string;
  routePath: string;
  roles: readonly string[];
}

@Injectable({ providedIn: 'root' })
export class AdminSidebarService {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // --- Static menu configuration ---
  readonly menuItems: readonly MenuItem[] = [
    { key: 'trainees', label: 'متربیان', routePath: 'trainees', roles: ['manager', 'headquarters'] },
    { key: 'teachers', label: 'مربیان', routePath: 'teachers', roles: ['manager', 'headquarters'] },
    { key: 'courses', label: 'دوره‌ها', routePath: 'courses', roles: ['manager', 'headquarters'] },
    { key: 'branch-managers', label: 'مسئولین شعب', routePath: 'branch-managers', roles: ['manager', 'headquarters'] },
    { key: 'branches', label: 'شعب', routePath: 'branches', roles: ['manager', 'headquarters'] },
    { key: 'makatib', label: 'مکاتب تربیتی، آموزشی، مهارتی', routePath: 'makatib', roles: ['manager', 'headquarters'] },
    { key: 'curriculum', label: 'برنامه درسی', routePath: 'curriculum', roles: ['manager', 'headquarters'] },
    { key: 'rings', label: 'حلقه‌ها', routePath: 'rings', roles: ['manager', 'headquarters'] },
    { key: 'parents', label: 'والدین', routePath: 'parents', roles: ['manager', 'headquarters'] },
    { key: 'evaluators', label: 'ارزیاب', routePath: 'evaluators', roles: ['manager', 'headquarters'] },
    { key: 'headquarters', label: 'ستاد', routePath: 'headquarters', roles: ['manager', 'headquarters'] },
    { key: 'spiritual', label: 'مسیر معنوی', routePath: 'spiritual', roles: ['manager', 'headquarters'] },
    { key: 'surveys', label: 'نظرسنجی‌ها', routePath: 'surveys', roles: ['manager', 'headquarters'] },
  ] as const;

  /** Reverse lookup: route path → menu key */
  private readonly routeToKey = new Map<string, string>(
    this.menuItems.map((item) => [item.routePath, item.key]),
  );

  // --- Reactive state (signals) ---
  readonly activeMenu = signal<string>('makatib');
  readonly expandedMenus = signal<Set<string>>(new Set(['makatib']));

  // --- Madrasah sidebar data ---
  readonly madrasahs = signal<Madrasah[]>([]);
  readonly loadingMadrasahs = signal(false);

  readonly makatibGirls = signal<Madrasah[]>([]);
  readonly makatibBoys = signal<Madrasah[]>([]);

  // --- Branches for branch-manager form ---
  readonly registeredBranches = signal<Branch[]>([]);

  // --- Computed ---
  readonly visibleMenuItems = signal<readonly MenuItem[]>([]);

  readonly isBranchManager = signal(false);
  readonly currentUserBranchId = signal<number | undefined>(undefined);

  constructor() {
    this.updateRoleBasedState();
    this.loadMadrasahsForSidebar();
    this.loadBranchesList();
    this.syncActiveMenuFromRouter();
  }

  // --- Public API ---

  setActiveMenu(key: string): void {
    this.activeMenu.set(key);
  }

  toggleExpand(key: string): void {
    const current = this.expandedMenus();
    const next = new Set(current);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.expandedMenus.set(next);
  }

  isExpanded(key: string): boolean {
    return this.expandedMenus().has(key);
  }

  onMadrasahSidebarClick(madrasah: Madrasah): void {
    this.activeMenu.set(madrasah.key);
    if (madrasah.gender === 'girls') {
      this.toggleExpand('makatib-girls');
    } else {
      this.toggleExpand('makatib-boys');
    }
  }

  // --- Private methods ---

  private updateRoleBasedState(): void {
    const user = this.authService.getCurrentUser();
    this.isBranchManager.set(this.authService.hasRole('branch_manager'));
    this.currentUserBranchId.set(user?.branchId);

    const visible = this.menuItems.filter((item) =>
      (item.roles as readonly string[]).some((role) => this.authService.hasRole(role))
    );
    this.visibleMenuItems.set(visible);

    // Branch managers only see trainees by default
    if (this.isBranchManager()) {
      this.activeMenu.set('trainees');
    }
  }

  private loadMadrasahsForSidebar(): void {
    this.loadingMadrasahs.set(true);
    this.api
      .getMadrasahs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (madrasahs) => {
          this.madrasahs.set(madrasahs);
          this.makatibGirls.set(madrasahs.filter((m) => m.gender === 'girls'));
          this.makatibBoys.set(madrasahs.filter((m) => m.gender === 'boys'));
          this.loadingMadrasahs.set(false);
        },
        error: () => {
          this.loadingMadrasahs.set(false);
        },
      });
  }

  private loadBranchesList(): void {
    this.api
      .getBranches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (branches) => {
          this.registeredBranches.set(branches);
        },
        error: () => {},
      });
  }

  private syncActiveMenuFromRouter(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => {
          const adminFragment = event.urlAfterRedirects.replace(/^\/admin\/?/, '');
          const firstSegment = adminFragment.split('/')[0];
          return firstSegment || '';
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((path) => {
        const key = this.routeToKey.get(path);
        if (key) {
          this.activeMenu.set(key);
        } else if (this.madrasahs().some((m) => m.key === path)) {
          this.activeMenu.set(path);
        }
      });
  }
}