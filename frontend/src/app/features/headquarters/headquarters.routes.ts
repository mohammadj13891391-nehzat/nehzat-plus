import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';
import { HeadquartersDashboardComponent } from './headquarters-dashboard.component';
import { MonthlyBookletComponent } from './monthly-booklet.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class HeadquartersSpiritualPageComponent {}

@Component({
  standalone: true,
  imports: [MonthlyBookletComponent],
  template: '<app-monthly-booklet />'
})
export class HeadquartersMonthlyBookletPageComponent {}

export const HEADQUARTERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('headquarters')],
    component: HeadquartersDashboardComponent
  },
  {
    path: 'spiritual',
    canActivate: [roleGuard('headquarters')],
    component: HeadquartersSpiritualPageComponent
  },
  {
    path: 'monthly-booklets',
    canActivate: [roleGuard('headquarters')],
    component: HeadquartersMonthlyBookletPageComponent
  }
];
