import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ParentPanelComponent } from './parent-panel.component';
import { StudentProgressCardComponent } from './student-progress-card.component';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';
import { createMockAuthService, createMockRouter } from '../shared/testing-utils';
import type { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';
import type { ParentStudentInfo } from '../../core/models/lesson-planner.models';

describe('ParentPanelComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ParentPanelComponent>>;
  let component: ParentPanelComponent;
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;
  let mockRouter: Router;

  const mockStudents: ParentStudentInfo[] = [
    { studentId: 10, studentName: 'علی احمدی', studentCode: 'S001', courseName: 'قرآن', latestGrade: 85, attendanceRate: 92,
      age: 12, phase: 'راهنمایی', completedLevels: 3, totalLevels: 10, completedLessons: 15, totalLessons: 50 },
    { studentId: 20, studentName: 'فاطمه محمدی', studentCode: 'S002', courseName: 'ادبیات', latestGrade: 90, attendanceRate: 98,
      age: 14, phase: 'دبیرستان', completedLevels: 5, totalLevels: 12, completedLessons: 25, totalLessons: 80 },
  ];

  beforeEach(() => {
    mockApi = {};
    const api = new Proxy({} as LessonPlannerApi, {
      get(_target, prop: string | symbol) {
        if (prop === 'then') return undefined;
        if (!mockApi[prop as string]) {
          mockApi[prop as string] = vi.fn().mockReturnValue(of(null));
        }
        return mockApi[prop as string];
      },
    });

    mockRouter = createMockRouter();

    TestBed.configureTestingModule({
      imports: [ParentPanelComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be defined', () => {
    fixture = TestBed.createComponent(ParentPanelComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('when user is a parent', () => {
    beforeEach(() => {
      const authService = TestBed.inject(AuthService);
      (authService.getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({
        id: '1',
        username: 'parent1',
        roles: ['parent'],
        userType: 'parent',
        studentId: 1,
      });
      mockApi['getParentStudents'] = vi.fn().mockReturnValue(of(mockStudents));
      fixture = TestBed.createComponent(ParentPanelComponent);
      component = fixture.componentInstance;
    });

    it('should load parent students on init', () => {
      fixture.detectChanges();
      expect(mockApi['getParentStudents']).toHaveBeenCalledWith(1);
    });

    it('should expose students signal', () => {
      fixture.detectChanges();
      const result = component.students();
      expect(result.length).toBe(2);
      expect(result[0].studentName).toBe('علی احمدی');
    });

    it('should have navigateToDetail method on child cards', () => {
      expect(typeof StudentProgressCardComponent.prototype.navigateToDetail).toBe('function');
    });
  });

  describe('when user is NOT a parent', () => {
    beforeEach(() => {
      const authService = TestBed.inject(AuthService);
      (authService.getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({
        id: '2',
        username: 'admin',
        roles: ['manager'],
        userType: 'manager',
      });
      fixture = TestBed.createComponent(ParentPanelComponent);
      component = fixture.componentInstance;
    });

    it('should redirect to dashboard on init', () => {
      fixture.detectChanges();
      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
    });
  });
});
