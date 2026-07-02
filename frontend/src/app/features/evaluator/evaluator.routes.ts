import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const EVALUATOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('evaluator')],
    loadComponent: () => import('./evaluator.component').then((m) => m.EvaluatorComponent)
  }
];
