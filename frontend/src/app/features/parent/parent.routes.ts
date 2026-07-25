import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';
import { ParentPanelComponent } from './parent-panel.component';
import { MonthlyBookletComponent } from './monthly-booklet.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class ParentSpiritualPageComponent {}

@Component({
  standalone: true,
  imports: [MonthlyBookletComponent],
  template: '<app-monthly-booklet />'
})
export class ParentMonthlyBookletPageComponent {}

export const PARENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('parent')],
    component: ParentPanelComponent
  },
  {
    path: 'spiritual',
    canActivate: [roleGuard('parent')],
    component: ParentSpiritualPageComponent
  },
  {
    path: 'monthly-booklets',
    canActivate: [roleGuard('parent')],
    component: ParentMonthlyBookletPageComponent
  }
];
