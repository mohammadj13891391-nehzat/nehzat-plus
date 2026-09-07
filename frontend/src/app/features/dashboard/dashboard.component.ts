import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import type {
  Assignment,
  AssignmentSubmission,
  BiweeklyProgressResponse,
  Course,
  CurrentUser,
  StudentAssignmentGateState,
  StudentAssessmentHistory,
  DailyNudge
} from '../../core/models/lesson-planner.models';
import { resolveMediaUrl } from '../../core/services/api-url.util';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../core/services/notification.service';
import { DashboardTrainingStepsComponent } from './dashboard-training-steps/dashboard-training-steps.component';
import { AssessmentTakerComponent } from './assessment-taker/assessment-taker.component';
import { DashboardAssignmentModalComponent } from './components/dashboard-assignment-modal/dashboard-assignment-modal.component';
import { DashboardNudgePanelComponent } from './components/dashboard-nudge-panel/dashboard-nudge-panel.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { QuranProgressWidgetComponent } from '../quran/pages/quran-progress-widget/quran-progress-widget.component';
import { MathProgressWidgetComponent } from '../math/pages/math-progress-widget/math-progress-widget.component';
import { DashboardSummaryComponent } from '../progress/components/dashboard-summary/dashboard-summary.component';
import type { BiweeklyProgressData } from './progress-chart/progress-chart.component';

type TimelineStatus = 'future' | 'today' | 'past';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardTrainingStepsComponent,
    AssessmentTakerComponent,
    DashboardAssignmentModalComponent,
    DashboardNudgePanelComponent,
    DashboardHeaderComponent,
    QuranProgressWidgetComponent,
    MathProgressWidgetComponent,
    DashboardSummaryComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: CurrentUser | null = null;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  assignments: Assignment[] = [];
  submissions: AssignmentSubmission[] = [];
  selectedAssignment: Assignment | null = null;
  assignmentProgress: StudentAssignmentGateState | null = null;
  primaryInstructionAudioUrl: string | null = null;
  biweeklyProgress: BiweeklyProgressData | null = null;
  assessmentHistory: StudentAssessmentHistory | null = null;
  loadingHistory = false;

  loadingCourses = false;
  loadingAssignments = false;
  loadingSubmissions = false;
  isSubmitting = false;

  isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private recordingChunks: Blob[] = [];
  private recordingStartedAt = 0;
  recordingDurationSeconds = 0;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;

  isUserModalOpen = false;
  isAssignmentModalOpen = false;
  isAssessmentTakerOpen = false;

  nudgesEnabled = signal(false);
  dailyNudges: DailyNudge[] = [];
  loadingNudges = false;

  errorMessage = '';
  successMessage = '';
  chartSummary = 'پس از انتخاب درس، وضعیت پیشرفت اینجا نمایش داده می‌شود.';

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    if (this.currentUser.userType !== 'trainee') {
      void this.router.navigateByUrl(this.authService.getDashboardPathForRole(this.currentUser.userType));
      return;
    }
    if (this.getStudentId() === null) {
      this.setError('شناسه متربی نامعتبر است. لطفا یک‌بار خروج و ورود مجدد انجام دهید.');
    }
    this.loadCourses();
    this.loadSubmissions();
    this.loadDailyNudges();
    this.restoreNudgeToggle();
  }

  ngOnDestroy(): void {
    this.stopStreamTracks();
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  toggleUserMenu(): void {}

  showUserModal(): void {
    this.isUserModalOpen = true;
  }

  hideUserModal(): void {
    this.isUserModalOpen = false;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  openAssessmentTaker(): void {
    this.isAssessmentTakerOpen = true;
  }

  onAssessmentTakerClosed(): void {
    this.isAssessmentTakerOpen = false;
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.api
      .getActiveCourses()
      .pipe(finalize(() => (this.loadingCourses = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (courses) => {
          this.courses = courses;
          if (courses.length > 0) {
            this.selectCourse(courses[0]);
          } else {
            this.selectedCourse = null;
            this.assignments = [];
            this.chartSummary = 'درسی برای نمایش نمودار وجود ندارد.';
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'خطا در دریافت دروس فعال');
        }
      });
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
    this.selectedAssignment = null;
    this.assignmentProgress = null;
    this.primaryInstructionAudioUrl = null;
    this.isAssignmentModalOpen = false;
    this.loadAssignments(course.id);
    this.loadSubmissions();
    this.loadBiweeklyProgress();
    this.loadAssessmentHistory();
  }

  private loadBiweeklyProgress(): void {
    const studentId = this.getStudentId();
    if (studentId === null) return;

    this.api
      .getBiweeklyProgress(studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (progress) => {
          this.biweeklyProgress = this.mapToChartData(progress);
        },
        error: (error) => {
          console.error('Failed to load biweekly progress:', error);
        }
      });
  }

  private loadAssessmentHistory(): void {
    const studentId = this.getStudentId();
    if (studentId === null || !this.selectedCourse) return;
    this.loadingHistory = true;
    this.api
      .getStudentAssessmentHistory(studentId, this.selectedCourse.id)
      .pipe(finalize(() => (this.loadingHistory = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (history) => {
          this.assessmentHistory = history;
        },
        error: () => {
          this.assessmentHistory = null;
        }
      });
  }

  private mapToChartData(progress: BiweeklyProgressResponse): BiweeklyProgressData {
    return {
      studentId: progress.studentId,
      studentName: progress.studentName,
      periodStart: progress.periodStart,
      periodEnd: progress.periodEnd,
      totalAssignments: progress.totalAssignments,
      completedAssignments: progress.completedAssignments,
      pendingAssignments: progress.pendingAssignments,
      completionPercentage: progress.completionPercentage,
      averageScore: progress.averageScore,
      totalSubmissions: progress.totalSubmissions,
      assignments: progress.assignments
    };
  }

  loadAssignments(courseId: number): void {
    this.loadingAssignments = true;
    this.api
      .getCourseAssignments(courseId)
      .pipe(finalize(() => (this.loadingAssignments = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (assignments) => {
          this.assignments = [...assignments].sort((a, b) => a.assignmentDate.localeCompare(b.assignmentDate));
          this.updateChartSummary();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'خطا در دریافت تکالیف');
          this.assignments = [];
          this.updateChartSummary();
        }
      });
  }

  loadSubmissions(): void {
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    this.loadingSubmissions = true;
    this.api
      .getStudentSubmissions(studentId)
      .pipe(finalize(() => (this.loadingSubmissions = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (submissions) => {
          this.submissions = submissions;
          this.updateChartSummary();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'خطا در دریافت ارسال‌ها');
          this.submissions = [];
          this.updateChartSummary();
        }
      });
  }

  private loadDailyNudges(): void {
    this.loadingNudges = true;
    this.api
      .getDailyNudges()
      .pipe(finalize(() => (this.loadingNudges = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (nudges) => {
          this.dailyNudges = nudges;
        },
        error: () => {
          this.dailyNudges = [];
        }
      });
  }

  private restoreNudgeToggle(): void {
    const enabled = localStorage.getItem('lp-dashboard-nudges-enabled') === '1';
    this.nudgesEnabled.set(enabled);
    if (enabled) {
      this.scheduleDefaultNudges();
    }
  }

  async toggleNudgeNotifications(): Promise<void> {
    if (this.nudgesEnabled()) {
      this.nudgesEnabled.set(false);
      localStorage.removeItem('lp-dashboard-nudges-enabled');
      this.notify.show('یادآورهای روزانه غیرفعال شد', 'success');
      return;
    }
    const permission = await this.notify.requestPermission();
    if (permission === 'denied') {
      this.setError('دسترسی اعلان‌ها مسدود است. در تنظیمات مرورگر اجازه دهید.');
      return;
    }
    this.nudgesEnabled.set(true);
    localStorage.setItem('lp-dashboard-nudges-enabled', '1');
    this.notify.show('یادآورهای روزانه فعال شد', 'success');
    this.scheduleDefaultNudges();
  }

  dismissDailyNudge(nudgeId: number): void {
    this.api
      .dismissNudge(nudgeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dailyNudges = this.dailyNudges.filter((nudge) => nudge.id !== nudgeId);
          this.notify.show('یادآور بسته شد', 'success');
        },
        error: () => {
          this.setError('خطا در بستن یادآور');
        }
      });
  }

  private scheduleDefaultNudges(): void {
    this.notify.scheduleDailyNudge(8, 0, 'امروز تمرین درسی خود را انجام دادی؟', 'scientific');
    this.notify.scheduleDailyNudge(7, 30, 'تعهد معنوی امروز را فراموش نکن.', 'spiritual');
    this.notify.scheduleDailyNudge(17, 0, 'فعالیت بدنی امروز را ثبت کن.', 'physical');
  }

  get filteredSubmissions(): AssignmentSubmission[] {
    if (!this.selectedCourse) {
      return this.submissions;
    }
    const assignmentIds = new Set(this.assignments.map((assignment) => assignment.id));
    return this.submissions.filter((submission) => assignmentIds.has(submission.assignmentId));
  }

  getAssignmentStatus(assignment: Assignment): TimelineStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const assignmentDate = new Date(assignment.assignmentDate);
    assignmentDate.setHours(0, 0, 0, 0);

    if (assignmentDate.getTime() > today.getTime()) {
      return 'future';
    }
    if (assignmentDate.getTime() === today.getTime()) {
      return 'today';
    }
    return 'past';
  }

  hasAudioAttachment(assignment: Assignment): boolean {
    return Boolean((assignment.attachments ?? []).some((attachment) => attachment.kind === 'audio'));
  }

  get isRecordingUnlocked(): boolean {
    if (!this.selectedAssignment) {
      return false;
    }
    if (!this.primaryInstructionAudioUrl) {
      return true;
    }
    return Boolean(this.assignmentProgress?.isRecordingUnlocked);
  }

  showAssignmentDetails(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.errorMessage = '';
    this.successMessage = '';
    this.resetRecordingPreview();
    this.primaryInstructionAudioUrl = this.resolvePrimaryInstructionAudioUrl(
      assignment.attachments ?? []
    );
    this.isAssignmentModalOpen = true;
    this.loadAssignmentProgress(assignment.id);
  }

  closeAssignmentModal(): void {
    if (this.isRecording) {
      this.stopRecording();
    }
    this.isAssignmentModalOpen = false;
    this.selectedAssignment = null;
    this.assignmentProgress = null;
    this.primaryInstructionAudioUrl = null;
  }

  startRecordingForAssignment(assignment: Assignment): void {
    this.showAssignmentDetails(assignment);
    void this.startRecording();
  }

  async toggleRecording(): Promise<void> {
    if (this.isRecording) {
      this.stopRecording();
      return;
    }
    await this.startRecording();
  }

  async startRecording(): Promise<void> {
    if (this.isRecording || !this.selectedAssignment) {
      return;
    }
    if (!this.isRecordingUnlocked) {
      this.setError('ضبط هنوز فعال نشده است. ابتدا فایل راهنما را کامل گوش دهید.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      this.setError('مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.');
      return;
    }

    try {
      this.errorMessage = '';
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;
      this.recordingChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.recordingChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        if (!this.recordingChunks.length) {
          return;
        }
        this.audioBlob = new Blob(this.recordingChunks, {
          type: this.mediaRecorder?.mimeType || 'audio/webm'
        });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
      };
      this.mediaRecorder.start();
      this.recordingStartedAt = Date.now();
      this.isRecording = true;
    } catch {
      this.setError('دسترسی به میکروفون امکان‌پذیر نیست.');
      this.stopStreamTracks();
    }
  }

  stopRecording(): void {
    if (!this.isRecording) {
      return;
    }
    this.isRecording = false;
    this.recordingDurationSeconds = Math.max(1, Math.round((Date.now() - this.recordingStartedAt) / 1000));
    this.mediaRecorder?.stop();
    this.stopStreamTracks();
  }

  submitAudio(): void {
    if (!this.selectedAssignment || !this.audioBlob || this.isSubmitting) {
      return;
    }
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    if (!this.isRecordingUnlocked) {
      this.setError('ضبط هنوز فعال نشده است.');
      return;
    }

    const audioFile = new File(
      [this.audioBlob],
      `submission-${this.selectedAssignment.id}-${Date.now()}.webm`,
      { type: this.audioBlob.type || 'audio/webm' }
    );
    const payload = new FormData();
    payload.append('audioFile', audioFile);
    payload.append('notes', 'ارسال از داشبورد متربی');
    payload.append('timeSpent', String(this.recordingDurationSeconds || 1));

    this.isSubmitting = true;
    this.api
      .submitAssignment(studentId, this.selectedAssignment.id, payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('فایل صوتی با موفقیت ارسال شد.');
          this.loadSubmissions();
          this.loadAssignmentProgress(this.selectedAssignment!.id);
          this.resetRecordingPreview();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'خطا در ارسال فایل صوتی');
        }
      });
  }

  playAudio(audioUrl: string): void {
    const resolved = resolveMediaUrl(audioUrl);
    if (!resolved) {
      return;
    }
    const audio = new Audio(resolved);
    void audio.play();
  }

  getAttachmentIcon(kind: string): string {
    switch (kind) {
      case 'audio':
        return 'bi-file-earmark-audio';
      case 'document':
        return 'bi-file-earmark-text';
      case 'image':
        return 'bi-file-earmark-image';
      default:
        return 'bi-file-earmark';
    }
  }

  assignmentTitleById(assignmentId: number): string {
    return this.assignments.find((assignment) => assignment.id === assignmentId)?.title ?? `تکلیف ${assignmentId}`;
  }

  resolveAudioUrl(url: string | null | undefined): string | null {
    return resolveMediaUrl(url);
  }

  resolveAttachmentUrl(url: string | null | undefined): string | null {
    return resolveMediaUrl(url);
  }

  private loadAssignmentProgress(assignmentId: number): void {
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    this.api.getAssignmentProgress(studentId, assignmentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (progress) => {
        if (!this.selectedAssignment || this.selectedAssignment.id !== assignmentId) {
          return;
        }
        if (!this.primaryInstructionAudioUrl) {
          this.assignmentProgress = {
            ...progress,
            requiredListenCount: 0,
            currentListenCount: 0,
            isRecordingUnlocked: true,
            hasPlayableInstructionAudio: false
          };
          return;
        }
        this.assignmentProgress = progress;
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'دریافت وضعیت تکلیف با خطا مواجه شد.');
      }
    });
  }

  private resolvePrimaryInstructionAudioUrl(attachments: Assignment['attachments']): string | null {
    const primary = attachments?.find((attachment) => attachment.kind === 'audio' && Boolean(attachment.url));
    return resolveMediaUrl(primary?.url) ?? null;
  }

  private getStudentId(): number | null {
    const session = this.authService.getCurrentUser();
    return session?.studentId ?? session?.studentInfo?.id ?? null;
  }

  authStudentId(): number | null {
    return this.getStudentId();
  }

  private updateChartSummary(): void {
    const total = this.assignments.length;
    const submitted = this.filteredSubmissions.length;
    if (total === 0) {
      this.chartSummary = 'برای این درس هنوز داده‌ای برای نمودار وجود ندارد.';
      return;
    }
    const ratio = Math.round((submitted / total) * 100);
    this.chartSummary = `تکمیل تکالیف: ${submitted} از ${total} (${ratio}٪)`;
  }

  private resetRecordingPreview(): void {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
    this.audioUrl = null;
    this.audioBlob = null;
  }

  private stopStreamTracks(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
  }
}
