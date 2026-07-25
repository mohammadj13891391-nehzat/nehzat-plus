import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { EvaluatorComponent } from './evaluator.component';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell />'
})
export class EvaluatorSpiritualPageComponent {}

export const EVALUATOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('evaluator')],
    component: EvaluatorComponent
  },
  {
    path: 'spiritual',
    canActivate: [roleGuard('evaluator')],
    component: EvaluatorSpiritualPageComponent
  }
];
