import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const HADITH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'books',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/hadith-books/hadith-books.component').then(m => m.HadithBooksComponent)
      },
      {
        path: 'books/:bookId/chapters',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/hadith-chapters/hadith-chapters.component').then(m => m.HadithChaptersComponent)
      },
      {
        path: 'chapters/:chapterId/hadiths',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/hadith-list/hadith-list.component').then(m => m.HadithListComponent)
      },
      {
        path: 'hadith/:id',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/hadith-detail/hadith-detail.component').then(m => m.HadithDetailComponent)
      },
      {
        path: 'review',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/hadith-review/hadith-review.component').then(m => m.HadithReviewComponent)
      },
      { path: '', redirectTo: 'books', pathMatch: 'full' }
    ]
  }
];
