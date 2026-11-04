import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';
import { CoachComponent } from './coach.component';
import { CoachDashboardComponent } from './coach-dashboard.component';
import { CoachStudentDetailComponent } from './coach-student-detail.component';
import { MorabbiShellComponent } from './morabbi/morabbi-shell.component';

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
    component: MorabbiShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./morabbi/morabbi-dashboard.component').then((m) => m.MorabbiDashboardComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./morabbi/morabbi-reports-list.component').then((m) => m.MorabbiReportsListComponent)
      },
      {
        path: 'reports/new',
        loadComponent: () => import('./morabbi/morabbi-report-form.component').then((m) => m.MorabbiReportFormComponent)
      },
      {
        path: 'reports/:id',
        loadComponent: () => import('./morabbi/morabbi-report-detail.component').then((m) => m.MorabbiReportDetailComponent)
      },
      {
        path: 'reports/:id/edit',
        loadComponent: () => import('./morabbi/morabbi-report-form.component').then((m) => m.MorabbiReportFormComponent)
      },
      {
        path: 'lesson-plans',
        loadComponent: () => import('./morabbi/morabbi-lesson-plans-list.component').then((m) => m.MorabbiLessonPlansListComponent)
      },
      {
        path: 'lesson-plans/new',
        loadComponent: () => import('./morabbi/morabbi-lesson-plan-form.component').then((m) => m.MorabbiLessonPlanFormComponent)
      },
      {
        path: 'lesson-plans/:id',
        loadComponent: () => import('./morabbi/morabbi-lesson-plan-detail.component').then((m) => m.MorabbiLessonPlanDetailComponent)
      },
      {
        path: 'lesson-plans/:id/edit',
        loadComponent: () => import('./morabbi/morabbi-lesson-plan-form.component').then((m) => m.MorabbiLessonPlanFormComponent)
      },
      {
        path: 'recognition',
        loadComponent: () => import('./morabbi/morabbi-recognition.component').then((m) => m.MorabbiRecognitionComponent)
      },
      {
        path: 'approvals',
        loadComponent: () => import('./morabbi/morabbi-approvals.component').then((m) => m.MorabbiApprovalsComponent)
      },
      {
        path: 'organization',
        loadComponent: () => import('./morabbi/morabbi-organization.component').then((m) => m.MorabbiOrganizationComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./morabbi/morabbi-profile.component').then((m) => m.MorabbiProfileComponent)
      }
    ]
  },
  {
    path: 'students',
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
