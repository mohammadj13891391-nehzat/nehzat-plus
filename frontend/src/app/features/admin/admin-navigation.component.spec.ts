import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AdminNavigationComponent } from './admin-navigation.component';
import { AdminSidebarService } from './services/admin-sidebar.service';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import {
  createMockAuthService,
  createMockApi,
  createMockNotificationService,
  createMockRouter,
  DEFAULT_MOCK_PROVIDERS,
} from '../shared/testing-utils';
import { NotificationService } from '../../core/services/notification.service';
import { of } from 'rxjs';

describe('AdminNavigationComponent', () => {
  let fixture: ComponentFixture<AdminNavigationComponent>;
  let component: AdminNavigationComponent;
  let auth: any;
  let api: any;
  let router: ReturnType<typeof createMockRouter>;
  let sidebarService: AdminSidebarService;

  const madrasahs = [
    { id: 1, key: 'maktab-a', label: 'مکتب الف', gender: 'girls', status: 'active', grade: 1 },
    { id: 2, key: 'maktab-b', label: 'مکتب ب', gender: 'boys', status: 'active', grade: 2 },
  ] as any[];

  beforeEach(async () => {
    auth = createMockAuthService();
    api = createMockApi();
    router = createMockRouter();
    api.getMadrasahs.mockReturnValue(of(madrasahs));
    api.getBranches.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AdminNavigationComponent],
      providers: [
        ...DEFAULT_MOCK_PROVIDERS,
        AdminSidebarService,
        { provide: AuthService, useValue: auth },
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: Router, useValue: router },
        { provide: NotificationService, useFactory: createMockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNavigationComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(AdminSidebarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render visible menu items', () => {
    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('.sidebar-item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should navigate to route on menu item click', () => {
    const el: HTMLElement = fixture.nativeElement;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.sidebar-item'));
    const coursesItem = items.find((i) => i.textContent?.includes('دوره‌ها'));
    expect(coursesItem).toBeTruthy();
    coursesItem!.click();
    expect(router.navigate).toHaveBeenCalledWith(['/admin', 'courses']);
  });

  it('should navigate to spiritual route on spiritual click', () => {
    const el: HTMLElement = fixture.nativeElement;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.sidebar-item'));
    const spiritualItem = items.find((i) => i.textContent?.includes('مسیر معنوی'));
    expect(spiritualItem).toBeTruthy();
    spiritualItem!.click();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/spiritual']);
  });

  it('should render makatib girls submenu when expanded', () => {
    sidebarService.expandedMenus.set(new Set(['makatib', 'makatib-girls']));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const text = el.textContent ?? '';
    expect(text).toContain('مکاتب دخترانه');
    expect(text).toContain('مکتب الف');
  });

  it('should render makatib boys submenu when expanded', () => {
    sidebarService.expandedMenus.set(new Set(['makatib', 'makatib-boys']));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const text = el.textContent ?? '';
    expect(text).toContain('مکاتب پسرانه');
    expect(text).toContain('مکتب ب');
  });
});