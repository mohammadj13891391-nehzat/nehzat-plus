import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PERSIAN_LITERATURE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'learning',
        loadComponent: () => import('./learning-dashboard/learning-dashboard.component').then(m => m.LearningDashboardComponent)
      },
      {
        path: 'learning/:id',
        loadComponent: () => import('./path-detail/path-detail.component').then(m => m.PathDetailComponent)
      },
      {
        path: 'lesson/:id',
        loadComponent: () => import('./lesson-view/lesson-view.component').then(m => m.LessonViewComponent)
      },
      {
        path: 'quiz/:id',
        loadComponent: () => import('./quiz-view/quiz-view.component').then(m => m.QuizViewComponent)
      },
      {
        path: 'poets',
        loadComponent: () => import('./pages/poet-list/poet-list.component').then(m => m.PoetListComponent)
      },
      {
        path: 'poets/:id',
        loadComponent: () => import('./pages/poet-detail/poet-detail.component').then(m => m.PoetDetailComponent)
      },
      {
        path: 'poems',
        loadComponent: () => import('./pages/poem-list/poem-list.component').then(m => m.PoemListComponent)
      },
      {
        path: 'poems/:id',
        loadComponent: () => import('./pages/poem-detail/poem-detail.component').then(m => m.PoemDetailComponent)
      },
      { path: '', redirectTo: 'learning', pathMatch: 'full' }
    ]
  }
];
