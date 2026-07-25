import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { TeacherComponent } from './teacher.component';

@Component({
  standalone: true,
  imports: [TeacherComponent],
  template: '<app-teacher />'
})
export class TeacherPageComponent {}

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard('teacher')],
    component: TeacherPageComponent
  }
];