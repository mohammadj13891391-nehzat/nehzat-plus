import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const QURAN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'surahs',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/surah-list/surah-list.component').then(m => m.QuranListComponent)
      },
      {
        path: 'surahs/:id',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/surah-detail/surah-detail.component').then(m => m.SurahDetailComponent)
      },
      {
        path: 'tajweed-rules',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/tajweed-rules/tajweed-rules.component').then(m => m.TajweedRulesComponent)
      },
      {
        path: 'recitation-levels',
        canActivate: [roleGuard('student')],
        loadComponent: () => import('./pages/recitation-levels/recitation-levels.component').then(m => m.RecitationLevelsComponent)
      },
      {
        path: 'curricula',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./pages/quran-curriculum/quran-curriculum.component').then(m => m.QuranCurriculumComponent)
      },
      {
        path: 'student-progress/:studentId',
        canActivate: [roleGuard('coach'), roleGuard('parent')],
        loadComponent: () => import('./pages/student-progress/student-progress.component').then(m => m.StudentProgressComponent)
      },
      {
        path: 'lesson-plans',
        canActivate: [roleGuard('admin'), roleGuard('coach')],
        loadComponent: () => import('./pages/lesson-plans/lesson-plans.component').then(m => m.LessonPlansComponent)
      },
      { path: '', redirectTo: 'surahs', pathMatch: 'full' }
    ]
  }
];
