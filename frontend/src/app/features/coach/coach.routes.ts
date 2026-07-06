import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AssessmentPanelComponent } from '../shared/assessment-panel/assessment-panel.component';

@Component({
  standalone: true,
  imports: [AssessmentPanelComponent],
  template: '<app-assessment-panel />'
})
export class CoachPageComponent {}

export const COACH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('coach')],
    component: CoachPageComponent
  }
];
