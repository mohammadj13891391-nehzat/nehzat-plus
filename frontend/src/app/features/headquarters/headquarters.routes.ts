import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const HEADQUARTERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('headquarters')],
    loadComponent: () => import('./headquarters.component').then((m) => m.HeadquartersComponent)
  }
];
