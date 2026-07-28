import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';
import { NotificationService } from '../../core/services/notification.service';

export function createMockAuthService(): AuthService {
  return {
    isAuthenticated: vi.fn().mockReturnValue(true),
    hasRole: vi.fn().mockReturnValue(true),
    getCurrentUser: vi.fn().mockReturnValue({
      id: '1',
      username: 'test',
      roles: ['manager'],
      userType: 'manager',
      studentId: undefined,
      branchId: '1',
    }),
    getDashboardPathForRole: vi.fn().mockReturnValue('/admin'),
    resolvePrimaryRole: vi.fn().mockReturnValue('manager'),
    signin: vi.fn().mockReturnValue(of({})),
    signup: vi.fn().mockReturnValue(of({})),
    logout: vi.fn(),
    getToken: vi.fn().mockReturnValue(null),
  } as unknown as AuthService;
}

export function createMockApi(): LessonPlannerApi {
  return new Proxy({} as Record<string, unknown>, {
    get(_target, prop: string | symbol) {
      if (prop === 'then') return undefined; // not a thenable
      return vi.fn().mockReturnValue(of(null));
    },
  }) as unknown as LessonPlannerApi;
}

export function createMockRouter(): Router {
  return {
    navigate: vi.fn().mockResolvedValue(true),
    navigateByUrl: vi.fn().mockResolvedValue(true),
    createUrlTree: vi.fn(),
    serializeUrl: vi.fn(),
    url: '/',
    events: of(),
    isActive: vi.fn().mockReturnValue(false),
  } as unknown as Router;
}

export function createMockActivatedRoute(): ActivatedRoute {
  return { snapshot: { params: {}, paramMap: { get: vi.fn() }, queryParamMap: { get: vi.fn() } } } as unknown as ActivatedRoute;
}

export function createMockNotificationService(): NotificationService {
  return { show: vi.fn(), dismiss: vi.fn() } as unknown as NotificationService;
}

export const DEFAULT_MOCK_PROVIDERS: Provider[] = [
  { provide: AuthService, useFactory: createMockAuthService },
  { provide: LESSON_PLANNER_API, useFactory: createMockApi },
  { provide: LessonPlannerApi, useFactory: createMockApi },
  { provide: Router, useFactory: createMockRouter },
  { provide: ActivatedRoute, useFactory: createMockActivatedRoute },
  { provide: NotificationService, useFactory: createMockNotificationService },
];

export function mountStandalone<T>(component: Type<T>, extraProviders: Provider[] = []): T {
  TestBed.configureTestingModule({
    imports: [component],
    providers: [...DEFAULT_MOCK_PROVIDERS, ...extraProviders],
  });
  return TestBed.createComponent(component).componentInstance;
}
