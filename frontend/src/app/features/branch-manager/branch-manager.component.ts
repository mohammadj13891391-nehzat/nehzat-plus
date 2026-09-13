import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';

import type {
  Branch,
  BranchManager,
  BranchPerformance,
  Coach,
  CoachPerformance,
  CreateBranchManagerPayload,
  CreateCoachPayload,
  CreateStudentPayload,
  CurrentUser,
  Student,
  UpdateBranchManagerPayload,
  UpdateStudentPayload
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

type Tab = 'info' | 'performance' | 'coaches' | 'students' | 'managers';

@Component({
  selector: 'app-branch-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './branch-manager.component.html',
  styleUrls: ['./branch-manager.component.scss']
})
export class BranchManagerComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(LESSON_PLANNER_API);

  currentUser: CurrentUser | null = null;
  logoHidden = false;

  readonly activeTab = signal<Tab>('info');
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly branch = signal<Branch | null>(null);
  readonly manager = signal<BranchManager | null>(null);
  readonly managers = signal<BranchManager[]>([]);
  readonly branchPerformance = signal<BranchPerformance | null>(null);
  readonly coachPerformance = signal<CoachPerformance[]>([]);
  readonly coaches = signal<Coach[]>([]);
  readonly students = signal<Student[]>([]);

  readonly formVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly submitting = signal(false);
  readonly formError = signal('');
  formModel: CreateStudentPayload = this.emptyFormModel();

  readonly coachFormVisible = signal(false);
  readonly coachEditingId = signal<number | null>(null);
  readonly coachSubmitting = signal(false);
  readonly coachFormError = signal('');
  coachFormModel: CreateCoachPayload = this.emptyCoachFormModel();

  readonly managerFormVisible = signal(false);
  readonly managerEditingId = signal<number | null>(null);
  readonly managerSubmitting = signal(false);
  readonly managerFormError = signal('');
  managerFormModel: CreateBranchManagerPayload = this.emptyManagerFormModel();

  readonly drillDownCoach = signal<CoachPerformance | null>(null);
  readonly drillDownStudent = signal<Student | null>(null);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'branch_manager') {
      void this.router.navigateByUrl(this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee'));
      return;
    }
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      branch: this.api.getMyBranch().pipe(catchError(() => of(null as Branch | null))),
      managers: this.api.getMyBranchManagers().pipe(catchError(() => of([] as BranchManager[]))),
      performance: this.api.getMyBranchPerformance().pipe(catchError(() => of(null as BranchPerformance | null))),
      coachPerf: this.api.getMyCoachPerformance().pipe(catchError(() => of([] as CoachPerformance[]))),
      coaches: this.api.getMyCoaches().pipe(catchError(() => of([] as Coach[]))),
      students: this.api.getMyStudents().pipe(catchError(() => of([] as Student[])))
    }).subscribe({
      next: (data) => {
        this.branch.set(data.branch);
        this.manager.set(data.managers[0] ?? null);
        this.managers.set(Array.isArray(data.managers) ? data.managers : []);
        this.branchPerformance.set(data.performance);
        this.coachPerformance.set(Array.isArray(data.coachPerf) ? data.coachPerf : []);
        this.coaches.set(Array.isArray(data.coaches) ? data.coaches : []);
        this.students.set(Array.isArray(data.students) ? data.students : []);

        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('بارگذاری اطلاعات با خطا مواجه شد.');
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  genderLabel(gender: string): string {
    switch (gender) {
      case 'male': return 'پسر';
      case 'female': return 'دختر';
      case 'mixed': return 'مختلط';
      default: return gender;
    }
  }

  statusLabel(status: string): string {
    return status === 'active' ? 'فعال' : 'غیرفعال';
  }

  openCreateForm(): void {
    this.editingId.set(null);
    this.formModel = this.emptyFormModel();
    this.formError.set('');
    this.formVisible.set(true);
  }

  openEditForm(student: Student): void {
    this.editingId.set(student.id);
    this.formModel = {
      username: student.username,
      password: '',
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      studentId: student.studentId,
      nationalCode: '',
      branchId: student.branchId,
      gender: student.gender
    };
    this.formError.set('');
    this.formVisible.set(true);
  }

  closeForm(): void {
    this.formVisible.set(false);
    this.editingId.set(null);
    this.formError.set('');
    this.formModel = this.emptyFormModel();
  }

  submitForm(): void {
    this.formError.set('');
    const branchId = this.branch()?.id ?? this.currentUser?.branchId;
    if (!branchId) {
      this.formError.set('شناسه شعبه مشخص نیست.');
      return;
    }

    this.submitting.set(true);
    const payload: CreateStudentPayload = { ...this.formModel, branchId };

    if (this.editingId() === null) {
      this.api.createStudent(payload).subscribe({
        next: (created) => {
          this.students.update((list) => [...list, created]);
          this.submitting.set(false);
          this.closeForm();
        },
        error: () => {
          this.formError.set('افزودن متربی با خطا مواجه شد.');
          this.submitting.set(false);
        }
      });
    } else {
      const id = this.editingId()!;
      const updatePayload: UpdateStudentPayload = { ...payload };
      this.api.updateStudent(id, updatePayload).subscribe({
        next: (updated) => {
          this.students.update((list) => list.map((s) => (s.id === id ? updated : s)));
          this.submitting.set(false);
          this.closeForm();
        },
        error: () => {
          this.formError.set('به‌روزرسانی متربی با خطا مواجه شد.');
          this.submitting.set(false);
        }
      });
    }
  }

  openCoachDrillDown(cp: CoachPerformance): void {
    this.drillDownStudent.set(null);
    this.drillDownCoach.set(this.drillDownCoach()?.coachId === cp.coachId ? null : cp);
  }

  openStudentDrillDown(s: Student): void {
    this.drillDownCoach.set(null);
    this.drillDownStudent.set(this.drillDownStudent()?.id === s.id ? null : s);
  }

  closeDrillDown(): void {
    this.drillDownCoach.set(null);
    this.drillDownStudent.set(null);
  }

  deleteStudent(student: Student): void {
    if (!confirm('آیا از حذف این متربی اطمینان دارید؟')) return;

    const id = student.id!;
    this.api.deleteStudent(id).subscribe({
      next: () => {
        this.students.set(this.students().filter((s) => s.id !== id));
        this.errorMessage.set('');
      },
      error: () => {
        this.errorMessage.set('حذف متربی با خطا مواجه شد.');
      }
    });
  }

  openCreateCoachForm(): void {
    this.coachEditingId.set(null);
    this.coachFormModel = this.emptyCoachFormModel();
    this.coachFormError.set('');
    this.coachFormVisible.set(true);
  }

  openEditCoachForm(coach: Coach): void {
    this.coachEditingId.set(coach.id);
    this.coachFormModel = {
      username: coach.username,
      password: '',
      firstName: coach.firstName,
      lastName: coach.lastName,
      email: coach.email,
      phoneNumber: coach.phoneNumber,
      specialization: coach.specialization,
      branchId: coach.branchId,
      nationalCode: coach.nationalCode,
      assignedCourseIds: coach.assignedCourseIds || []
    };
    this.coachFormError.set('');
    this.coachFormVisible.set(true);
  }

  closeCoachForm(): void {
    this.coachFormVisible.set(false);
    this.coachEditingId.set(null);
    this.coachFormError.set('');
    this.coachFormModel = this.emptyCoachFormModel();
  }

  submitCoachForm(): void {
    this.coachFormError.set('');
    const branchId = this.branch()?.id ?? this.currentUser?.branchId;
    if (!branchId) {
      this.coachFormError.set('شناسه شعبه مشخص نیست.');
      return;
    }

    this.coachSubmitting.set(true);
    const payload: CreateCoachPayload = { ...this.coachFormModel, branchId };

    if (this.coachEditingId() === null) {
      this.api.createMyCoach(payload).subscribe({
        next: (created) => {
          this.coaches.update((list) => [...list, created]);
          this.coachSubmitting.set(false);
          this.closeCoachForm();
        },
        error: () => {
          this.coachFormError.set('افزودن مربی با خطا مواجه شد.');
          this.coachSubmitting.set(false);
        }
      });
    } else {
      const id = this.coachEditingId()!;
      const updatePayload: Partial<CreateCoachPayload> = { ...payload };
      this.api.updateMyCoach(id, updatePayload).subscribe({
        next: (updated) => {
          this.coaches.update((list) => list.map((c) => (c.id === id ? updated : c)));
          this.coachSubmitting.set(false);
          this.closeCoachForm();
        },
        error: () => {
          this.coachFormError.set('به‌روزرسانی مربی با خطا مواجه شد.');
          this.coachSubmitting.set(false);
        }
      });
    }
  }

  deleteCoach(coach: Coach): void {
    if (!confirm('آیا از حذف این مربی اطمینان دارید؟')) return;

    const id = coach.id!;
    this.api.deleteMyCoach(id).subscribe({
      next: () => {
        this.coaches.set(this.coaches().filter((c) => c.id !== id));
        this.errorMessage.set('');
      },
      error: () => {
        this.errorMessage.set('حذف مربی با خطا مواجه شد.');
      }
});
  }

  openManagerForm(): void {
    this.managerEditingId.set(null);
    this.managerFormModel = this.emptyManagerFormModel();
    this.managerFormError.set('');
    this.managerFormVisible.set(true);
  }

  closeManagerForm(): void {
    this.managerFormVisible.set(false);
    this.managerEditingId.set(null);
    this.managerFormError.set('');
    this.managerFormModel = this.emptyManagerFormModel();
  }

  submitManagerForm(): void {
    this.managerFormError.set('');
    const branchId = this.branch()?.id ?? this.currentUser?.branchId;
    if (!branchId) {
      this.managerFormError.set('شناسه شعبه مشخص نیست.');
      return;
    }

    this.managerSubmitting.set(true);
    const payload: CreateBranchManagerPayload = { ...this.managerFormModel, branchId };

    if (this.managerEditingId() === null) {
      this.api.createMyBranchManager(payload).subscribe({
        next: (created) => {
          this.managers.update((list) => [...list, created]);
          this.managerSubmitting.set(false);
          this.closeManagerForm();
        },
        error: () => {
          this.managerFormError.set('افزودن مدیر شعبه با خطا مواجه شد.');
          this.managerSubmitting.set(false);
        }
      });
    } else {
      const id = this.managerEditingId()!;
      const updatePayload: UpdateBranchManagerPayload = { ...payload };
      this.api.updateMyBranchManager(id, updatePayload).subscribe({
        next: (updated) => {
          this.managers.update((list) => list.map((m) => (m.id === id ? updated : m)));
          this.managerSubmitting.set(false);
          this.closeManagerForm();
        },
        error: () => {
          this.managerFormError.set('به‌روزرسانی مدیر شعبه با خطا مواجه شد.');
          this.managerSubmitting.set(false);
        }
      });
    }
  }

  deleteManager(manager: BranchManager): void {
    if (!confirm('آیا از حذف این مدیر شعبه اطمینان دارید؟')) return;

    const id = manager.id!;
    this.api.deleteMyBranchManager(id).subscribe({
      next: () => {
        this.managers.set(this.managers().filter((m) => m.id !== id));
        this.errorMessage.set('');
      },
      error: () => {
        this.errorMessage.set('حذف مدیر شعبه با خطا مواجه شد.');
      }
    });
  }

  private emptyCoachFormModel(): CreateCoachPayload {
    return {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      specialization: '',
      branchId: this.currentUser?.branchId,
      nationalCode: '',
      assignedCourseIds: []
    };
  }
}

  private emptyFormModel(): CreateStudentPayload {
    return {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      studentId: '',
      nationalCode: '',
      branchId: this.currentUser?.branchId,
      gender: ''
    };
  }
}