import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { RoleStubComponent } from '../shared/role-stub/role-stub.component';

@Component({
  standalone: true,
  imports: [RoleStubComponent],
  template: '<app-role-stub [title]="\'پنل مربی\'" [role]="\'coach\'" />'
})
export class CoachPageComponent {}

export const COACH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('coach')],
    component: CoachPageComponent
  }
];
