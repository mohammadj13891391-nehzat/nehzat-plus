import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('trainee')],
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent)
  }
];
