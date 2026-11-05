import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { MorabbiShellComponent } from './morabbi/morabbi-shell.component';

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
      },
      {
        path: 'students',
        canActivate: [roleGuard('coach')],
        loadComponent: () => import('./coach.component').then((m) => m.CoachComponent)
      },
      {
        path: 'student/:id',
        canActivate: [roleGuard('coach')],
        loadComponent: () => import('./coach-student-detail.component').then((m) => m.CoachStudentDetailComponent)
      },
      {
        path: 'rings',
        canActivate: [roleGuard('coach')],
        loadComponent: () => import('./coach-dashboard.component').then((m) => m.CoachDashboardComponent)
      },
      {
        path: 'spiritual',
        canActivate: [roleGuard('coach')],
        loadComponent: () =>
          import('./coach-spiritual-page.component').then((m) => m.CoachSpiritualPageComponent)
      }
    ]
  }
];
