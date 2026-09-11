import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { mountStandalone, createMockRouter } from '../shared/testing-utils';
import { AdminComponent } from './admin.component';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { createMockAuthService, createMockApi } from '../shared/testing-utils';

describe('AdminComponent', () => {
  it('should be defined', () => {
    expect(AdminComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const auth = createMockAuthService();
    const api = createMockApi() as any;
    api.getMadrasahs.mockReturnValue(of([]));
    api.getBranches.mockReturnValue(of([]));
    api.getSystemStatistics.mockReturnValue(
      of({ totalCourses: 1, totalAssignments: 2, totalAttachments: 0, activeCourses: 1 })
    );

    const instance = mountStandalone(AdminComponent, [
      { provide: AuthService, useValue: auth },
      { provide: LESSON_PLANNER_API, useValue: api },
      { provide: Router, useValue: createMockRouter() },
    ]);
    expect(instance).toBeTruthy();
  });
});