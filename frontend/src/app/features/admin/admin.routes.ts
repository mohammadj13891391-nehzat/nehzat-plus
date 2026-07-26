import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';
import { AdminSurveysComponent } from './admin-surveys/admin-surveys.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class AdminSpiritualPageComponent {}

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'spiritual',
    component: AdminSpiritualPageComponent,
  },
  {
    path: 'surveys',
    component: AdminSurveysComponent,
  },
];
