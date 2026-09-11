import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

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
  templateUrl: './headquarters-dashboard.component.html',
  styleUrls: ['./headquarters-dashboard.component.scss']
})
export class HeadquartersDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  readonly summary = toSignal(this.api.getHeadquartersSummary());
  readonly branchPerformance = toSignal(this.api.getBranchPerformance());
  readonly coachPerformance = toSignal(this.api.getCoachPerformance());

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.authService.hasRole('headquarters')) {
      console.warn('User is not headquarters type');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}