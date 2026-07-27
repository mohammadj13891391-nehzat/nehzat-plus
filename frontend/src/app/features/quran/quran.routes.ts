import { Routes } from '@angular/router';

export const QURAN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'surahs',
        loadComponent: () => import('../pages/surah-list/surah-list.component').then(m => m.SurahListComponent)
      },
      {
        path: 'surahs/:id',
        loadComponent: () => import('../pages/surah-detail/surah-detail.component').then(m => m.SurahDetailComponent)
      },
      {
        path: 'tajweed-rules',
        loadComponent: () => import('../pages/tajweed-rules/tajweed-rules.component').then(m => m.TajweedRulesComponent)
      },
      {
        path: 'recitation-levels',
        loadComponent: () => import('../pages/recitation-levels/recitation-levels.component').then(m => m.RecitationLevelsComponent)
      },
      {
        path: 'curricula',
        loadComponent: () => import('../pages/quran-curriculum/quran-curriculum.component').then(m => m.QuranCurriculumComponent)
      },
      {
        path: 'student-progress/:studentId',
        loadComponent: () => import('../pages/student-progress/student-progress.component').then(m => m.StudentProgressComponent)
      },
      { path: '', redirectTo: 'surahs', pathMatch: 'full' }
    ]
  }
];