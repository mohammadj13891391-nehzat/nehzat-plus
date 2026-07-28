import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
   {
    path: 'coach',
    canActivate: [authGuard],
    loadChildren: () => import('./features/coach/coach.routes').then((m) => m.COACH_ROUTES)
  },
  {
    path: 'parent',
    canActivate: [authGuard],
    loadChildren: () => import('./features/parent/parent.routes').then((m) => m.PARENT_ROUTES)
  },
  {
    path: 'branch-manager',
    canActivate: [authGuard],
    loadChildren: () => import('./features/branch-manager/branch-manager.routes').then((m) => m.BRANCH_MANAGER_ROUTES)
  },
  {
    path: 'evaluator',
    canActivate: [authGuard],
    loadChildren: () => import('./features/evaluator/evaluator.routes').then((m) => m.EVALUATOR_ROUTES)
  },
  {
    path: 'headquarters',
    canActivate: [authGuard],
    loadChildren: () => import('./features/headquarters/headquarters.routes').then((m) => m.HEADQUARTERS_ROUTES)
  },
  {
    path: 'teacher',
    canActivate: [authGuard],
    loadChildren: () => import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES)
  },
  {
    path: 'survey',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/survey/survey.routes').then((m) => m.SURVEY_ROUTES),
  },
  {
    path: 'surveys',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/surveys/surveys.routes').then((m) => m.SURVEYS_ROUTES),
  },
  {
    path: 'quran',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/quran/quran.routes').then((m) => m.QURAN_ROUTES),
  },
  {
    path: 'persian-literature',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/persian-literature/persian-literature.routes').then((m) => m.PERSIAN_LITERATURE_ROUTES),
  },
  {
    path: 'arabic-literature',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/arabic-literature/arabic-literature.routes').then((m) => m.ARABIC_LITERATURE_ROUTES),
  },
  {
    path: 'math',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/math/math.routes').then((m) => m.MATH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
