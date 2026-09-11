import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';
import { AdminShellComponent } from './admin-shell.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class AdminSpiritualPageComponent {}

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./admin.component').then((m) => m.AdminComponent),
      },
      {
        path: 'trainees',
        loadComponent: () => import('./admin-students/admin-students.component').then((m) => m.AdminStudentsComponent),
      },
      {
        path: 'teachers',
        loadComponent: () => import('./admin-coaches/admin-coaches.component').then((m) => m.AdminCoachesComponent),
      },
      {
        path: 'courses',
        loadComponent: () => import('./admin-courses/admin-courses.component').then((m) => m.AdminCoursesComponent),
      },
      {
        path: 'branch-managers',
        loadComponent: () => import('./admin-branch-managers/admin-branch-managers.component').then((m) => m.AdminBranchManagersComponent),
      },
      {
        path: 'branches',
        loadComponent: () => import('./admin-branches/admin-branches.component').then((m) => m.AdminBranchesComponent),
      },
      {
        path: 'makatib',
        loadComponent: () => import('./admin-makatib/admin-makatib.component').then((m) => m.AdminMakatibComponent),
      },
      {
        path: 'makatib-new',
        loadComponent: () => import('./admin-makatib/admin-makatib.component').then((m) => m.AdminMakatibComponent),
      },
      {
        path: 'makatib/:madrasahKey',
        loadComponent: () => import('./admin-makatib/admin-makatib.component').then((m) => m.AdminMakatibComponent),
      },
      {
        path: 'parents',
        loadComponent: () => import('./admin-parents/admin-parents.component').then((m) => m.AdminParentsComponent),
      },
      {
        path: 'evaluators',
        loadComponent: () => import('./admin-evaluators/admin-evaluators.component').then((m) => m.AdminEvaluatorsComponent),
      },
      {
        path: 'curriculum',
        loadComponent: () => import('./admin-curriculum/admin-curriculum.component').then((m) => m.AdminCurriculumComponent),
      },
      {
        path: 'rings',
        loadComponent: () => import('./admin-rings/admin-rings.component').then((m) => m.AdminRingsComponent),
      },
      {
        path: 'headquarters',
        loadComponent: () => import('./admin-headquarters/admin-headquarters.component').then((m) => m.AdminHeadquartersComponent),
      },
      {
        path: 'spiritual',
        component: AdminSpiritualPageComponent,
      },
      {
        path: 'surveys',
        loadComponent: () => import('./admin-surveys/admin-surveys.component').then((m) => m.AdminSurveysComponent),
      },
    ],
  },
];
