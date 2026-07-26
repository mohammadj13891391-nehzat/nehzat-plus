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
  CreateStudentPayload,
  CurrentUser,
  Student,
  UpdateStudentPayload
} from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

type Tab = 'info' | 'performance' | 'coaches' | 'students';

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
  readonly branchPerformance = signal<BranchPerformance | null>(null);
  readonly coachPerformance = signal<CoachPerformance[]>([]);
  readonly coaches = signal<Coach[]>([]);
  readonly students = signal<Student[]>([]);

  readonly formVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly submitting = signal(false);
  readonly formError = signal('');
  formModel: CreateStudentPayload = this.emptyFormModel();

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
      branches: this.api.getBranches().pipe(catchError(() => of([] as Branch[]))),
      managers: this.api.getBranchManagers().pipe(catchError(() => of([] as BranchManager[]))),
      performance: this.api.getBranchPerformance().pipe(catchError(() => of([] as BranchPerformance[]))),
      coachPerf: this.api.getCoachPerformance().pipe(catchError(() => of([] as CoachPerformance[]))),
      coaches: this.api.getCoaches().pipe(catchError(() => of([] as Coach[]))),
      students: this.api.getStudents().pipe(catchError(() => of([] as Student[])))
    }).subscribe({
      next: (data) => {
        const branchId = this.currentUser?.branchId;

        const myBranch = branchId != null
          ? data.branches.find((b) => b.id === branchId) ?? null
          : data.branches[0] ?? null;
        this.branch.set(myBranch);

        const resolvedBranchId = myBranch?.id ?? branchId;
        const myManager = data.managers.find((m) => m.branchId === resolvedBranchId) ?? null;
        this.manager.set(myManager);

        const myPerf = resolvedBranchId != null
          ? data.performance.find((p) => p.branchId === resolvedBranchId) ?? null
          : null;
        this.branchPerformance.set(myPerf);

        this.coachPerformance.set(data.coachPerf);
        this.coaches.set(
          resolvedBranchId != null
            ? data.coaches.filter((c) => c.branchId === resolvedBranchId)
            : data.coaches
        );
        this.students.set(
          resolvedBranchId != null
            ? data.students.filter((s) => s.branchId === resolvedBranchId)
            : data.students
        );

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
          this.formError.set('افزودن دانش‌آموز با خطا مواجه شد.');
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
          this.formError.set('به‌روزرسانی دانش‌آموز با خطا مواجه شد.');
          this.submitting.set(false);
        }
      });
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