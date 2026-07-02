import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const BRANCH_MANAGER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('branch_manager')],
    loadComponent: () => import('./branch-manager.component').then((m) => m.BranchManagerComponent)
  }
];
