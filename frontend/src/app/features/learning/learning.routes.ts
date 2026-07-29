import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const LEARNING_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/learning-dashboard/learning-dashboard.component').then(m => m.LearningDashboardComponent)
      },
      {
        path: 'paths/:id',
        loadComponent: () => import('./pages/path-detail/path-detail.component').then(m => m.PathDetailComponent)
      },
      {
        path: 'lessons/:id',
        loadComponent: () => import('./pages/lesson-view/lesson-view.component').then(m => m.LessonViewComponent)
      },
      {
        path: 'quizzes/:id',
        loadComponent: () => import('./pages/quiz-view/quiz-view.component').then(m => m.QuizViewComponent)
      }
    ]
  }
];
