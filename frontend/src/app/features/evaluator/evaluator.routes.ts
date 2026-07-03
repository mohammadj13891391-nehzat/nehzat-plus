import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { RoleStubComponent } from '../shared/role-stub/role-stub.component';

@Component({
  standalone: true,
  imports: [RoleStubComponent],
  template: '<app-role-stub [title]="\'پنل ارزیاب\'" [role]="\'evaluator\'" />'
})
export class EvaluatorPageComponent {}

export const EVALUATOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('evaluator')],
    component: EvaluatorPageComponent
  }
];
