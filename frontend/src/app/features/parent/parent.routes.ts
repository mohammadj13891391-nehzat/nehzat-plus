import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const PARENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('parent')],
    loadComponent: () => import('./parent.component').then((m) => m.ParentComponent)
  }
];
