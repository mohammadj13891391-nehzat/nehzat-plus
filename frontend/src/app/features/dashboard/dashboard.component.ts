import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import type {
  Assignment,
  AssignmentAttachment,
  AssignmentSubmission,
  Course,
  CurrentUser,
  StudentAssignmentGateState
} from '../../core/models/lesson-planner.models';
import { resolveMediaUrl } from '../../core/services/api-url.util';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../core/services/notification.service';
import { DashboardTrainingStepsComponent } from './dashboard-training-steps/dashboard-training-steps.component';

type TimelineStatus = 'future' | 'today' | 'past';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardTrainingStepsComponent],
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

  loadingCourses = false;
  loadingAssignments = false;
  loadingSubmissions = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  chartSummary = 'پس از انتخاب درس، وضعیت پیشرفت اینجا نمایش داده می‌شود.';

  isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private recordingChunks: Blob[] = [];
  private recordingStartedAt = 0;
  private recordingDurationSeconds = 0;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;

  logoHidden = false;
  isUserMenuOpen = false;
  isUserModalOpen = false;
  isAssignmentModalOpen = false;

  private listenSession = {
    active: false,
    lastTime: 0,
    listenedSeconds: 0,
    duration: 0
  };
  private listenRequestInFlight = false;
  private lastProgressRequestKey = '';

  get displayName(): string {
    const student = this.currentUser?.studentInfo;
    if (!student) {
      return this.currentUser?.username ?? 'متربی';
    }
    return `${student.firstName} ${student.lastName}`;
  }

  get roleDisplayName(): string {
    return 'متربی';
  }

  get filteredSubmissions(): AssignmentSubmission[] {
    if (!this.selectedCourse) {
      return this.submissions;
    }
    const assignmentIds = new Set(this.assignments.map((assignment) => assignment.id));
    return this.submissions.filter((submission) => assignmentIds.has(submission.assignmentId));
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
  }

  ngOnDestroy(): void {
    this.stopStreamTracks();
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  showUserModal(): void {
    this.isUserMenuOpen = false;
    this.isUserModalOpen = true;
  }

  hideUserModal(): void {
    this.isUserModalOpen = false;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.api
      .getActiveCourses()
      .pipe(finalize(() => (this.loadingCourses = false)))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.audioBlob = null;
    this.audioUrl = null;
    this.isAssignmentModalOpen = false;
    this.loadAssignments(course.id);
    this.loadSubmissions();
  }

  loadAssignments(courseId: number): void {
    this.loadingAssignments = true;
    this.api
      .getCourseAssignments(courseId)
      .pipe(finalize(() => (this.loadingAssignments = false)))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  showAssignmentDetails(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.errorMessage = '';
    this.successMessage = '';
    this.resetRecordingPreview();
    this.listenSession = {
      active: false,
      lastTime: 0,
      listenedSeconds: 0,
      duration: 0
    };
    this.primaryInstructionAudioUrl = this.resolvePrimaryInstructionAudioUrl(assignment.attachments ?? []);
    this.isAssignmentModalOpen = true;
    this.loadAssignmentProgress(assignment.id);
  }

  closeAssignmentModal(): void {
    if (this.isRecording) {
      this.stopRecording();
    }
    this.isAssignmentModalOpen = false;
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
        this.audioBlob = new Blob(this.recordingChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
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
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  onInstructionAudioPlay(audio: HTMLAudioElement): void {
    this.listenSession = {
      active: true,
      lastTime: audio.currentTime,
      listenedSeconds: 0,
      duration: audio.duration || 0
    };
  }

  onInstructionAudioTimeUpdate(audio: HTMLAudioElement): void {
    if (!this.listenSession.active) {
      return;
    }
    const delta = audio.currentTime - this.listenSession.lastTime;
    if (delta > 0 && delta <= 1.5) {
      this.listenSession.listenedSeconds += delta;
    }
    this.listenSession.lastTime = audio.currentTime;
    if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
      this.listenSession.duration = audio.duration;
    }
  }

  onInstructionAudioEnded(audio: HTMLAudioElement): void {
    if (!this.selectedAssignment || this.listenRequestInFlight) {
      return;
    }
    this.listenSession.active = false;
    const duration = this.listenSession.duration || audio.duration || 0;
    if (duration <= 0) {
      return;
    }
    const requiredElapsed = Math.max(duration * 0.85, duration - 3);
    if (this.listenSession.listenedSeconds < requiredElapsed) {
      return;
    }

    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    this.listenRequestInFlight = true;
    this.api
      .registerAssignmentListenCompletion(
        studentId,
        this.selectedAssignment.id,
        this.selectedAssignment.instructionAudioVersion
      )
      .pipe(finalize(() => (this.listenRequestInFlight = false)))
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (progress) => {
          this.assignmentProgress = progress;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ثبت گوش‌دادن با خطا مواجه شد.');
        }
      });
  }

  onInstructionAudioError(): void {
    this.setError('پخش فایل راهنما با خطا مواجه شد.');
  }

  private loadAssignmentProgress(assignmentId: number): void {
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    const requestKey = `${studentId}:${assignmentId}:${Date.now()}`;
    this.lastProgressRequestKey = requestKey;
    this.api.getAssignmentProgress(studentId, assignmentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (progress) => {
        if (this.lastProgressRequestKey !== requestKey) {
          return;
        }
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
        if (this.lastProgressRequestKey !== requestKey) {
          return;
        }
        this.setError(error?.error?.message ?? 'دریافت وضعیت تکلیف با خطا مواجه شد.');
      }
    });
  }

  private resolvePrimaryInstructionAudioUrl(attachments: AssignmentAttachment[]): string | null {
    const primary = attachments.find((attachment) => attachment.kind === 'audio' && Boolean(attachment.url));
    return resolveMediaUrl(primary?.url) ?? null;
  }

  private getStudentId(): number | null {
    const session = this.authService.getCurrentUser();
    return session?.studentId ?? session?.studentInfo?.id ?? null;
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
