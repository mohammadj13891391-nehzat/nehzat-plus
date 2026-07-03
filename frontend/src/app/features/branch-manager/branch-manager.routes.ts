import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { RoleStubComponent } from '../shared/role-stub/role-stub.component';

@Component({
  standalone: true,
  imports: [RoleStubComponent],
  template: '<app-role-stub [title]="\'پنل مسئول شعبه\'" [role]="\'branch_manager\'" />'
})
export class BranchManagerPageComponent {}

export const BRANCH_MANAGER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('branch_manager')],
    component: BranchManagerPageComponent
  }
];
