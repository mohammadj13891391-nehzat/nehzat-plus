import { Routes } from '@angular/router';

export const LEARNING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./learning-dashboard/learning-dashboard.component').then(m => m.LearningDashboardComponent)
  },
  {
    path: ':pathId',
    loadComponent: () => import('./path-detail/path-detail.component').then(m => m.PathDetailComponent)
  },
  {
    path: ':pathId/lessons/:lessonId',
    loadComponent: () => import('./lesson-view/lesson-view.component').then(m => m.LessonViewComponent)
  },
  {
    path: ':pathId/lessons/:lessonId/quiz/:quizId',
    loadComponent: () => import('./quiz-view/quiz-view.component').then(m => m.QuizViewComponent)
  }
];
