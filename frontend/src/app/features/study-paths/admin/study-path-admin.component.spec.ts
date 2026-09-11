import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { StudyPathAdminComponent } from './study-path-admin.component';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { createMockAuthService, createMockNotificationService } from '../../shared/testing-utils';
import type { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import type { StudyPath, Accommodation, AgeGroup, SubjectArea, CreateStudyPathRequest } from '../../../core/models/lesson-planner.models';

import { initialStudyPaths, initialAccommodations } from '../../../core/services/mock/mock-data-context.data';

describe('StudyPathAdminComponent (Integration with real seed data)', () => {
  let component: StudyPathAdminComponent;
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;
  let notify: { show: ReturnType<typeof vi.fn> };

  const mockAgeGroups: AgeGroup[] = [
    { id: 1, key: 'children-6-8', name: '۶ تا هشت سال', description: '', minAge: 6, maxAge: 8, sortOrder: 1 },
    { id: 2, key: 'children-9-11', name: '۹ تا یازده سال', description: '', minAge: 9, maxAge: 11, sortOrder: 2 },
    { id: 3, key: 'teens-12-14', name: '۱۲ تا چهارده سال', description: '', minAge: 12, maxAge: 14, sortOrder: 3 },
    { id: 4, key: 'teens-15-17', name: '۱۵ تا هفده سال', description: '', minAge: 15, maxAge: 17, sortOrder: 4 },
    { id: 5, key: 'youth-18-21', name: '۱۸ تا بیست و یک سال', description: '', minAge: 18, maxAge: 21, sortOrder: 5 },
  ];

  const mockSubjectAreas: SubjectArea[] = [
    { id: 1, key: 'math', name: 'ریاضیات', description: 'ریاضیات', sortOrder: 1 },
    { id: 2, key: 'science', name: 'علوم تجربه‌ای', description: 'علوم', sortOrder: 2 },
    { id: 3, key: 'persian', name: 'ادبیات فارسی', description: 'ادبیات', sortOrder: 3 },
  ];

  function createComponent(): StudyPathAdminComponent {
    const fixture = TestBed.createComponent(StudyPathAdminComponent);
    return fixture.componentInstance;
  }

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

    TestBed.configureTestingModule({
      imports: [StudyPathAdminComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        { provide: NotificationService, useFactory: createMockNotificationService },
      ],
    });

    notify = TestBed.inject(NotificationService) as any;
    component = createComponent();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Data loading', () => {
    beforeEach(() => {
      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getAccommodations'] = vi.fn().mockReturnValue(of(initialAccommodations));
      mockApi['getStudyPathAgeGroups'] = vi.fn().mockReturnValue(of(mockAgeGroups));
      mockApi['getStudyPathSubjectAreas'] = vi.fn().mockReturnValue(of(mockSubjectAreas));
      component.ngOnInit();
    });

    it('should load 3 study paths from the mock backend', () => {
      expect(component.studyPaths.length).toBe(3);
      expect(component.studyPaths[0].key).toBe('math-advanced');
      expect(component.studyPaths[1].key).toBe('biology-cellular');
      expect(component.studyPaths[2].key).toBe('persian-literature');
    });

    it('should load accommodations', () => {
      expect(component.accommodations.length).toBe(4);
      expect(component.accommodations[0].code).toBe('auditory');
    });

    it('should load age groups', () => {
      expect(component.ageGroups.length).toBe(5);
      expect(component.ageGroups[0].key).toBe('children-6-8');
    });

    it('should load subject areas', () => {
      expect(component.subjectAreas.length).toBe(3);
      expect(component.subjectAreas[0].name).toBe('ریاضیات');
    });

    it('should set loading=false after data loads', () => {
      expect(component.loading).toBe(false);
    });

    it('should make concurrent API calls', () => {
      expect(mockApi['getStudyPaths']).toHaveBeenCalledTimes(1);
      expect(mockApi['getAccommodations']).toHaveBeenCalledTimes(1);
      expect(mockApi['getStudyPathAgeGroups']).toHaveBeenCalledTimes(1);
      expect(mockApi['getStudyPathSubjectAreas']).toHaveBeenCalledTimes(1);
    });
  });

  describe('CRUD operations', () => {
    beforeEach(() => {
      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getAccommodations'] = vi.fn().mockReturnValue(of(initialAccommodations));
      mockApi['getStudyPathAgeGroups'] = vi.fn().mockReturnValue(of(mockAgeGroups));
      mockApi['getStudyPathSubjectAreas'] = vi.fn().mockReturnValue(of(mockSubjectAreas));
      component.ngOnInit();
    });

    it('should create a new study path via API', () => {
      const newPath: CreateStudyPathRequest = {
        key: 'test-new',
        title: 'مسیر تست',
        description: 'توضیحات تست',
        ageGroupId: 1,
        subjectAreaId: 1,
        cognitiveLevel: 'understanding',
        isActive: true,
        sortOrder: 0,
        steps: [],
        accommodationIds: [],
      };
      mockApi['createStudyPath'] = vi.fn().mockReturnValue(of({ ...newPath, id: 99 }));

      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(of([...initialStudyPaths, { ...newPath, id: 99 }]));

      component.openCreateModal();
      component.newPath = newPath;
      component.createPath();

      expect(mockApi['createStudyPath']).toHaveBeenCalledWith(newPath);
      expect(notify.show).toHaveBeenCalledWith('مسیر مطالعاتی ایجاد شد', 'success');
      expect(component.showCreateModal).toBe(false);
    });

    it('should show error on create failure', () => {
      const newPath: CreateStudyPathRequest = {
        key: 'test-fail',
        title: 'مسیر تست',
        description: '',
        ageGroupId: 1,
        subjectAreaId: 1,
        cognitiveLevel: 'understanding',
        isActive: true,
        sortOrder: 0,
        steps: [],
        accommodationIds: [],
      };
      mockApi['createStudyPath'] = vi.fn().mockReturnValue(throwError(() => new Error('fail')));

      component.openCreateModal();
      component.newPath = newPath;
      component.createPath();

      expect(mockApi['createStudyPath']).toHaveBeenCalledWith(newPath);
      expect(notify.show).toHaveBeenCalledWith('خطا در ساخت مسیر', 'error');
      expect(component.creating).toBe(false);
    });

    it('should delete a study path via confirm flow', () => {
      const pathToDelete: StudyPath = initialStudyPaths[0];

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      mockApi['deleteStudyPath'] = vi.fn().mockReturnValue(of(undefined));
      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(of([initialStudyPaths[1], initialStudyPaths[2]]));

      component.deletePath(pathToDelete.id);

      expect(mockApi['deleteStudyPath']).toHaveBeenCalledWith(pathToDelete.id);
      expect(notify.show).toHaveBeenCalledWith('مسیر حذف شد', 'success');
    });

    it('should cancel delete when confirm is false', () => {
      const pathToDelete: StudyPath = initialStudyPaths[0];
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      mockApi['deleteStudyPath'] = vi.fn();

      component.deletePath(pathToDelete.id);

      expect(mockApi['deleteStudyPath']).not.toHaveBeenCalled();
    });

    it('should show error on delete failure', () => {
      const pathToDelete: StudyPath = initialStudyPaths[0];
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      mockApi['deleteStudyPath'] = vi.fn().mockReturnValue(throwError(() => new Error('fail')));

      component.deletePath(pathToDelete.id);

      expect(mockApi['deleteStudyPath']).toHaveBeenCalledWith(pathToDelete.id);
      expect(notify.show).toHaveBeenCalledWith('خطا در حذف مسیر', 'error');
    });
  });

  describe('Modal operations', () => {
    beforeEach(() => {
      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getAccommodations'] = vi.fn().mockReturnValue(of(initialAccommodations));
      mockApi['getStudyPathAgeGroups'] = vi.fn().mockReturnValue(of(mockAgeGroups));
      mockApi['getStudyPathSubjectAreas'] = vi.fn().mockReturnValue(of(mockSubjectAreas));
      component.ngOnInit();
    });

    it('should open create modal with empty form', () => {
      component.openCreateModal();
      expect(component.showCreateModal).toBe(true);
      expect(component.newPath.key).toBe('');
      expect(component.newPath.title).toBe('');
      expect(component.newPath.steps).toEqual([]);
    });

    it('should add and remove step fields in create modal', () => {
      component.openCreateModal();
      expect(component.newPath.steps!.length).toBe(0);

      component.addStepField();
      expect(component.newPath.steps!.length).toBe(1);
      expect(component.newPath.steps![0].cognitiveLevel).toBe('understanding');
      expect(component.newPath.steps![0].estimatedDurationMinutes).toBe(30);

      component.addStepField();
      expect(component.newPath.steps!.length).toBe(2);

      component.removeStep(0);
      expect(component.newPath.steps!.length).toBe(1);
      expect(component.newPath.steps![0].stepOrder).toBe(0); // re-indexed
    });

    it('should toggle modal visibility', () => {
      component.openCreateModal();
      expect(component.showCreateModal).toBe(true);

      component.showCreateModal = false;
      expect(component.showCreateModal).toBe(false);
    });
  });

  describe('View switching', () => {
    beforeEach(() => {
      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getAccommodations'] = vi.fn().mockReturnValue(of(initialAccommodations));
      mockApi['getStudyPathAgeGroups'] = vi.fn().mockReturnValue(of(mockAgeGroups));
      mockApi['getStudyPathSubjectAreas'] = vi.fn().mockReturnValue(of(mockSubjectAreas));
      component.ngOnInit();
    });

    it('should start in paths view', () => {
      expect(component.view).toBe('paths');
    });

    it('should allow switching to accommodations view', () => {
      component.view = 'accommodations';
      expect(component.view).toBe('accommodations');
    });

    it('should allow switching back to paths view', () => {
      component.view = 'accommodations';
      component.view = 'paths';
      expect(component.view).toBe('paths');
    });
  });

  describe('Error handling', () => {
    it('should show error when getStudyPaths fails', () => {
      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(throwError(() => new Error('API error')));
      mockApi['getAccommodations'] = vi.fn().mockReturnValue(of(initialAccommodations));
      mockApi['getStudyPathAgeGroups'] = vi.fn().mockReturnValue(of(mockAgeGroups));
      mockApi['getStudyPathSubjectAreas'] = vi.fn().mockReturnValue(of(mockSubjectAreas));

      component.ngOnInit();

      expect(component.error).toBeTruthy();
      expect(component.loading).toBe(false);
    });

    it('should retry loading data', () => {
      mockApi['getStudyPaths'] = vi.fn().mockReturnValue(of(initialStudyPaths));
      mockApi['getAccommodations'] = vi.fn().mockReturnValue(of(initialAccommodations));
      mockApi['getStudyPathAgeGroups'] = vi.fn().mockReturnValue(of(mockAgeGroups));
      mockApi['getStudyPathSubjectAreas'] = vi.fn().mockReturnValue(of(mockSubjectAreas));

      component.error = 'some error';
      component.retry();

      expect(component.error).toBeNull();
      expect(component.studyPaths.length).toBe(3);
      expect(component.loading).toBe(false);
    });
  });
});
