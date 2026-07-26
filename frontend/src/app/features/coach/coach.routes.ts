import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';
import { CoachComponent } from './coach.component';
import { CoachDashboardComponent } from './coach-dashboard.component';
import { CoachStudentDetailComponent } from './coach-student-detail.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class CoachSpiritualPageComponent {}

export const COACH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('coach')],
    component: CoachComponent
  },
  {
    path: 'student/:id',
    canActivate: [roleGuard('coach')],
    component: CoachStudentDetailComponent
  },
  {
    path: 'rings',
    canActivate: [roleGuard('coach')],
    component: CoachDashboardComponent
  },
  {
    path: 'spiritual',
    canActivate: [roleGuard('coach')],
    component: CoachSpiritualPageComponent
  }
];
