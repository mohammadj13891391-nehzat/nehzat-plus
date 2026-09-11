import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CurrentUser, ParentStudentInfo } from '../../core/models/lesson-planner.models';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { StudentProgressCardComponent } from './student-progress-card.component';

@Component({
  selector: 'app-parent-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, StudentProgressCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './parent-panel.component.html',
  styleUrls: ['./parent-panel.component.scss']
})
export class ParentPanelComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  logoHidden = false;
  readonly students = signal<ParentStudentInfo[]>([]);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.userType !== 'parent') {
      void this.router.navigateByUrl(
        this.authService.getDashboardPathForRole(this.currentUser?.userType ?? 'trainee')
      );
      return;
    }

    // Fetch parent's students
    const parentId = this.currentUser.studentId ?? 0;
    this.api.getParentStudents(parentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      students => this.students.set(students)
    );
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
