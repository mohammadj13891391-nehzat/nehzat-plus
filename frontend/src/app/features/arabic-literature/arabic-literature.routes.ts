import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ARABIC_LITERATURE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'courses',
        loadComponent: () => import('./pages/course-list/course-list.component').then(m => m.CourseListComponent)
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      },
      {
        path: 'lessons/:id',
        loadComponent: () => import('./pages/lesson-view/lesson-view.component').then(m => m.LessonViewComponent)
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
      { path: '', redirectTo: 'courses', pathMatch: 'full' }
    ]
  }
];
