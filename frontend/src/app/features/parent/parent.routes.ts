import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { RoleStubComponent } from '../shared/role-stub/role-stub.component';

@Component({
  standalone: true,
  imports: [RoleStubComponent],
  template: '<app-role-stub [title]="\'پنل والدین\'" [role]="\'parent\'" />'
})
export class ParentPageComponent {}

export const PARENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('parent')],
    component: ParentPageComponent
  }
];
