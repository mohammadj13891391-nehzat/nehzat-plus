import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const COACH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('coach')],
    loadComponent: () => import('./coach.component').then((m) => m.CoachComponent)
  }
];
