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