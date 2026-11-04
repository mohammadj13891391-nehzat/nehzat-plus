import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'coach',
    canActivate: [authGuard],
    loadChildren: () => import('./features/coach/coach.routes').then((m) => m.COACH_ROUTES),
  },
  {
    path: 'parent',
    canActivate: [authGuard],
    loadChildren: () => import('./features/parent/parent.routes').then((m) => m.PARENT_ROUTES),
  },
  {
    path: 'branch-manager',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/branch-manager/branch-manager.routes').then(
        (m) => m.BRANCH_MANAGER_ROUTES,
      ),
  },
  {
    path: 'evaluator',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/evaluator/evaluator.routes').then((m) => m.EVALUATOR_ROUTES),
  },
  {
    path: 'headquarters',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/headquarters/headquarters.routes').then((m) => m.HEADQUARTERS_ROUTES),
  },
  {
    path: 'teacher',
    canActivate: [authGuard],
    loadChildren: () => import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES),
  },
  {
    path: 'survey',
    canActivate: [authGuard],
    loadChildren: () => import('./features/survey/survey.routes').then((m) => m.SURVEY_ROUTES),
  },
  {
    path: 'surveys',
    canActivate: [authGuard],
    loadChildren: () => import('./features/surveys/surveys.routes').then((m) => m.SURVEYS_ROUTES),
  },
  {
    path: 'hadith',
    canActivate: [authGuard],
    loadChildren: () => import('./features/hadith/hadith.routes').then((m) => m.HADITH_ROUTES),
  },
  {
    path: 'quran',
    canActivate: [authGuard],
    loadChildren: () => import('./features/quran/quran.routes').then((m) => m.QURAN_ROUTES),
  },
  {
    path: 'persian-literature',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/persian-literature/persian-literature.routes').then(
        (m) => m.PERSIAN_LITERATURE_ROUTES,
      ),
  },
  {
    path: 'arabic-literature',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/arabic-literature/arabic-literature.routes').then(
        (m) => m.ARABIC_LITERATURE_ROUTES,
      ),
  },
  {
    path: 'math',
    canActivate: [authGuard],
    loadChildren: () => import('./features/math/math.routes').then((m) => m.MATH_ROUTES),
  },
  {
    path: 'experimental-sciences',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/experimental-sciences/experimental-sciences.routes').then(
        (m) => m.EXPERIMENTAL_SCIENCES_ROUTES,
      ),
  },
  {
    path: 'learning',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/learning/learning.routes').then((m) => m.LEARNING_ROUTES),
  },
  {
    path: 'activity',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/activity/activity.routes').then((m) => m.ACTIVITY_ROUTES),
  },
  {
    path: 'arts',
    canActivate: [authGuard],
    loadChildren: () => import('./features/arts/arts.routes').then((m) => m.ARTS_ROUTES),
  },
  {
    path: 'social',
    canActivate: [authGuard],
    loadChildren: () => import('./features/social/social.routes').then((m) => m.SOCIAL_ROUTES),
  },
  {
    path: 'career',
    canActivate: [authGuard],
    loadChildren: () => import('./features/career/career.routes').then((m) => m.CAREER_ROUTES),
  },
  {
    path: 'portfolio',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/portfolio/portfolio.routes').then((m) => m.PORTFOLIO_ROUTES),
  },
  {
    path: 'career-pathways',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/career-pathways/career-pathways.routes').then(
        (m) => m.CAREER_PATHWAYS_ROUTES,
      ),
  },
  {
    path: 'project-defense',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/project-defense/project-defense.routes').then(
        (m) => m.PROJECT_DEFENSE_ROUTES,
      ),
  },
  {
    path: 'community-metrics',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/community-metrics/community-metrics.routes').then(
        (m) => m.COMMUNITY_METRICS_ROUTES,
      ),
  },
  {
    path: 'training-courses',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/training-courses/training-courses.routes').then(
        (m) => m.TRAINING_COURSES_ROUTES,
      ),
  },
{
    path: 'quizzes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/quizzes/quizzes.routes').then((m) => m.QUIZ_ROUTES),
  },
  {
    path: 'courses',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/courses/courses.routes').then((m) => m.COURSE_ROUTES),
  },
  {
    path: 'map',
    canActivate: [authGuard],
    loadChildren: () => import('./features/map/map.routes').then((m) => m.MAP_ROUTES),
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/calendar/calendar.routes').then((m) => m.CALENDAR_ROUTES),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'maktabs',
    canActivate: [authGuard],
    loadChildren: () => import('./features/maktab/maktab.routes').then((m) => m.MAKTAB_ROUTES),
  },
  {
    path: 'halghehs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/halgheh/pages/halghehs-page.component').then(
        (m) => m.HalghehsPageComponent,
      ),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/notifications/notifications.routes').then((m) => m.NOTIFICATIONS_ROUTES),
  },
  {
    path: 'courier-reports',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/courier-report/courier-report.routes').then(
        (m) => m.COURIER_REPORT_ROUTES,
      ),
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadChildren: () => import('./features/messaging/messaging.routes').then((m) => m.MESSAGING_ROUTES),
  },
  {
    path: 'evaluations',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/evaluation/evaluation.routes').then((m) => m.EVALUATION_ROUTES),
  },
  {
    path: 'progress',
    canActivate: [authGuard],
    loadChildren: () => import('./features/progress/progress.routes').then((m) => m.PROGRESS_ROUTES),
  },
   {
    path: 'study-paths',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/study-paths/study-paths.routes').then((m) => m.STUDY_PATHS_ROUTES),
  },
  {
    path: 'vocabulary',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/vocabulary/vocabulary.routes').then((m) => m.vocabularyRoutes),
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
