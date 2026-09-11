import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AdminSidebarService } from './admin-sidebar.service';
import { AuthService } from '../../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import {
  createMockAuthService,
  createMockApi,
  createMockNotificationService,
  createMockRouter,
} from '../../shared/testing-utils';
import { NotificationService } from '../../../core/services/notification.service';
import { of } from 'rxjs';

describe('AdminSidebarService', () => {
  let service: AdminSidebarService;
  let api: any;
  let auth: any;

  const madrasahs = [
    { id: 1, key: 'maktab-a', label: 'مکتب الف', gender: 'girls', status: 'active', grade: 1 },
    { id: 2, key: 'maktab-b', label: 'مکتب ب', gender: 'boys', status: 'active', grade: 2 },
  ] as any[];

  const branches = [{ id: 1, name: 'شعبه مرکزی', province: 'تهران' }] as any[];

  beforeEach(() => {
    auth = createMockAuthService();
    api = createMockApi();
    api.getMadrasahs.mockReturnValue(of(madrasahs));
    api.getBranches.mockReturnValue(of(branches));
    api.getSystemStatistics.mockReturnValue(
      of({ totalCourses: 5, totalAssignments: 10, totalAttachments: 3, activeCourses: 2 })
    );

    TestBed.configureTestingModule({
      providers: [
        AdminSidebarService,
        { provide: AuthService, useValue: auth },
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: Router, useValue: createMockRouter() },
        { provide: NotificationService, useFactory: createMockNotificationService },
      ],
    });

    service = TestBed.inject(AdminSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load madrasahs and split by gender', () => {
    expect(service.madrasahs().length).toBe(2);
    expect(service.makatibGirls().length).toBe(1);
    expect(service.makatibBoys().length).toBe(1);
    expect(service.loadingMadrasahs()).toBe(false);
  });

  it('should load registered branches', () => {
    expect(service.registeredBranches().length).toBe(1);
  });

  it('should set active menu', () => {
    service.setActiveMenu('courses');
    expect(service.activeMenu()).toBe('courses');
  });

  it('should toggle expand state', () => {
    expect(service.isExpanded('makatib')).toBe(true);
    service.toggleExpand('makatib');
    expect(service.isExpanded('makatib')).toBe(false);
    service.toggleExpand('makatib');
    expect(service.isExpanded('makatib')).toBe(true);
  });

  it('should filter visible menu items by role', () => {
    expect(service.visibleMenuItems().length).toBe(13);
  });

  it('should only show trainees for branch managers', () => {
    auth.hasRole.mockImplementation((role: string) => role === 'branch_manager');
    const svc = TestBed.inject(AdminSidebarService);
    expect(svc.isBranchManager()).toBe(true);
    expect(svc.activeMenu()).toBe('trainees');
  });

  it('should handle madrasah sidebar click for girls', () => {
    service.onMadrasahSidebarClick(madrasahs[0]);
    expect(service.activeMenu()).toBe('maktab-a');
    expect(service.isExpanded('makatib-girls')).toBe(true);
  });

  it('should handle madrasah sidebar click for boys', () => {
    service.onMadrasahSidebarClick(madrasahs[1]);
    expect(service.activeMenu()).toBe('maktab-b');
    expect(service.isExpanded('makatib-boys')).toBe(true);
  });
});