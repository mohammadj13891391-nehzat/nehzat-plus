import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class TraineeSpiritualPageComponent {}

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('trainee')],
    loadComponent: () => import('./dashboard-wrapper.component').then((m) => m.DashboardWrapperComponent)
  },
  {
    path: 'spiritual',
    canActivate: [roleGuard('trainee')],
    component: TraineeSpiritualPageComponent
  },
  {
    path: 'overview',
    loadComponent: () => import('./pages/dashboard-page.component').then((m) => m.DashboardPageComponent)
  },
  {
    path: 'learning-path',
    loadChildren: () => import('../learning-path/learning-path.routes')
  }
];
