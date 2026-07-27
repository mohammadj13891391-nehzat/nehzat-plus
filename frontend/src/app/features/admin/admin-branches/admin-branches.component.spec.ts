import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminBranchesComponent } from './admin-branches.component';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { createMockAuthService, createMockNotificationService } from '../../shared/testing-utils';
import type { LessonPlannerApi } from '../../../core/services/lesson-planner-api.interface';
import type { Branch } from '../../../core/models/lesson-planner.models';

describe('AdminBranchesComponent', () => {
  let component: AdminBranchesComponent;
  let mockApi: Record<string, ReturnType<typeof vi.fn>>;

  function createComponent(): AdminBranchesComponent {
    const fixture = TestBed.createComponent(AdminBranchesComponent);
    return fixture.componentInstance;
  }

  beforeEach(() => {
    mockApi = {};
    // Proxy: any method access returns a vi.fn().mockReturnValue(of(null))
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
      imports: [AdminBranchesComponent],
      providers: [
        { provide: LESSON_PLANNER_API, useValue: api },
        { provide: AuthService, useFactory: createMockAuthService },
        { provide: NotificationService, useFactory: createMockNotificationService },
      ],
    });
  });

  it('should be defined', () => {
    component = createComponent();
    expect(component).toBeTruthy();
  });

  describe('CRUD operations', () => {
    const mockBranch: Branch = {
      id: 1, name: 'شعبه تست', province: 'تهران',
      description: 'توضیحات', createdAt: '2026-07-01T00:00:00.000Z',
    };
    const mockBranchList: Branch[] = [
      mockBranch,
      { id: 2, name: 'شعبه دوم', province: 'اصفهان', createdAt: '2026-07-02T00:00:00.000Z' },
    ];

    beforeEach(() => {
      mockApi['getBranches'] = vi.fn().mockReturnValue(of(mockBranchList));
      component = createComponent();
    });

    it('should load branches on init', () => {
      component.ngOnInit();
      expect(mockApi['getBranches']).toHaveBeenCalled();
      expect(component.branches.length).toBe(2);
      expect(component.filteredBranches.length).toBe(2);
    });

    it('should filter branches by name', () => {
      component.ngOnInit();
      component.searchQuery = 'دوم';
      component.filterBranches();
      expect(component.filteredBranches.length).toBe(1);
      expect(component.filteredBranches[0].name).toBe('شعبه دوم');
    });

    it('should filter branches by province', () => {
      component.ngOnInit();
      component.searchQuery = 'اصفهان';
      component.filterBranches();
      expect(component.filteredBranches.length).toBe(1);
      expect(component.filteredBranches[0].province).toBe('اصفهان');
    });

    it('should show all branches when search is empty', () => {
      component.ngOnInit();
      component.searchQuery = '';
      component.filterBranches();
      expect(component.filteredBranches.length).toBe(2);
    });

    it('should open create modal with empty form', () => {
      component.openCreateModal();
      expect(component.showModal).toBe(true);
      expect(component.editMode).toBe(false);
      expect(component.editingId).toBeNull();
      expect(component.branchForm.get('name')?.value).toBe('');
    });

    it('should open edit modal with populated form', () => {
      component.openEditModal(mockBranch);
      expect(component.showModal).toBe(true);
      expect(component.editMode).toBe(true);
      expect(component.editingId).toBe(1);
      expect(component.branchForm.get('name')?.value).toBe('شعبه تست');
      expect(component.branchForm.get('province')?.value).toBe('تهران');
    });

    it('should create branch via API and reload list', () => {
      const newBranch: Branch = { id: 3, name: 'شعبه جدید', province: 'قم', createdAt: '2026-07-03T00:00:00.000Z' };
      mockApi['createBranch'] = vi.fn().mockReturnValue(of(newBranch));
      // getBranches is already set up in beforeEach
      component.ngOnInit();
      // Reset count after init
      mockApi['getBranches'].mockClear();

      mockApi['getBranches'] = vi.fn().mockReturnValue(of([...mockBranchList, newBranch]));

      component.openCreateModal();
      component.branchForm.patchValue({ name: 'شعبه جدید', province: 'قم' });
      component.saveBranch();

      expect(mockApi['createBranch']).toHaveBeenCalledWith({ name: 'شعبه جدید', province: 'قم', description: '' });
      expect(component.showModal).toBe(false);
      // After save, loadBranches should re-fetch
      expect(mockApi['getBranches']).toHaveBeenCalledTimes(1);
    });

    it('should update branch via API and reload list', () => {
      const updated = { ...mockBranch, name: 'شعبه ویرایش شده' };
      mockApi['updateBranch'] = vi.fn().mockReturnValue(of(updated));
      component.ngOnInit();
      mockApi['getBranches'] = vi.fn().mockReturnValue(of([updated, mockBranchList[1]]));

      component.openEditModal(mockBranch);
      component.branchForm.patchValue({ name: 'شعبه ویرایش شده' });
      component.saveBranch();

      expect(mockApi['updateBranch']).toHaveBeenCalledWith(1, { name: 'شعبه ویرایش شده', province: 'تهران', description: 'توضیحات' });
    });

    it('should delete branch via API and reload list', () => {
      mockApi['deleteBranch'] = vi.fn().mockReturnValue(of({ message: 'حذف شد' }));
      component.ngOnInit();
      mockApi['getBranches'] = vi.fn().mockReturnValue(of([mockBranchList[1]]));

      component.confirmDelete(mockBranch);
      expect(component.deleteTarget).toBe(mockBranch);

      component.doDelete();
      expect(mockApi['deleteBranch']).toHaveBeenCalledWith(1);
      expect(component.deleteTarget).toBeNull();
    });

    it('should cancel delete', () => {
      component.confirmDelete(mockBranch);
      expect(component.deleteTarget).toBeTruthy();
      component.cancelDelete();
      expect(component.deleteTarget).toBeNull();
    });

    it('should close modal', () => {
      component.openCreateModal();
      expect(component.showModal).toBe(true);
      component.closeModal();
      expect(component.showModal).toBe(false);
    });
  });
});
