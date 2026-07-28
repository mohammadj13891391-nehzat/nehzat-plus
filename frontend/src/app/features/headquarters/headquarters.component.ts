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
  templateUrl: './headquarters.component.html',
  styleUrls: ['./headquarters.component.scss']
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
    if (!this.authService.hasRole('headquarters')) {
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