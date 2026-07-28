import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const MATH_ROUTES: Routes = [
  { path: '', redirectTo: 'topics', pathMatch: 'full' },
  { path: 'topics', canActivate: [authGuard], loadComponent: () => import('./pages/math-topic-list.component').then(m => m.MathTopicListComponent) },
  { path: 'topics/:topicId/lessons', canActivate: [authGuard], loadComponent: () => import('./pages/math-lesson-list.component').then(m => m.MathLessonListComponent) },
  { path: 'lessons/:lessonId', canActivate: [authGuard], loadComponent: () => import('./pages/math-lesson-detail.component').then(m => m.MathLessonDetailComponent) },
  { path: 'lessons/:lessonId/practice', canActivate: [authGuard], loadComponent: () => import('./pages/math-practice.component').then(m => m.MathPracticeComponent) },
  { path: 'scholars', canActivate: [authGuard], loadComponent: () => import('./pages/math-scholars.component').then(m => m.MathScholarsComponent) },
  { path: 'scholars/:scholarId', canActivate: [authGuard], loadComponent: () => import('./pages/math-scholar-detail.component').then(m => m.MathScholarDetailComponent) },
  { path: 'progress', canActivate: [authGuard], loadComponent: () => import('./pages/math-progress.component').then(m => m.MathProgressComponent) },
];
