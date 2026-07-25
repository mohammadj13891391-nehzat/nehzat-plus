import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { BranchManagerComponent } from './branch-manager.component';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';
import { AssessmentPanelComponent } from '../shared/assessment-panel/assessment-panel.component';
import { CompetitionManagementComponent } from './competition-management/competition-management.component';
import { LeagueManagementComponent } from './league-management/league-management.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class BranchManagerSpiritualPageComponent {}

@Component({
  standalone: true,
  imports: [AssessmentPanelComponent],
  template: '<app-assessment-panel />'
})
export class BranchManagerAssessmentComponent {}

export const BRANCH_MANAGER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('branch_manager')],
    component: BranchManagerComponent
  },
  {
    path: 'assessment',
    canActivate: [roleGuard('branch_manager')],
    component: BranchManagerAssessmentComponent
  },
  {
    path: 'spiritual',
    canActivate: [roleGuard('branch_manager')],
    component: BranchManagerSpiritualPageComponent
  },
  {
    path: 'competitions',
    canActivate: [roleGuard('branch_manager')],
    component: CompetitionManagementComponent
  },
  {
    path: 'leagues',
    canActivate: [roleGuard('branch_manager')],
    component: LeagueManagementComponent
  }
];
