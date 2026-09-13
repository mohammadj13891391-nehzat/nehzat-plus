import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PHASE_CONFIG } from '../../../core/tokens/phase.token';
import { LearningPathService, StudyLessonDetailDto } from '../services/learning-path.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-lesson-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-detail-page.component.html',
  styleUrls: ['./lesson-detail-page.component.scss'],
})
export class LessonDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(LearningPathService);
  private readonly notify = inject(NotificationService);
  protected readonly phaseConfig = inject(PHASE_CONFIG);

  lesson = signal<StudyLessonDetailDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'content' | 'quiz'>('content');

  ngOnInit(): void {
    const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    if (lessonId) {
      this.loadLesson(lessonId);
    } else {
      this.error.set('شناسه درس نامعتبر است');
      this.loading.set(false);
    }
  }

  private loadLesson(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getStudyLesson(id).pipe(takeUntilDestroyed()).subscribe({
      next: (lesson) => {
        this.lesson.set(lesson);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'خطا در بارگذاری درس');
        this.loading.set(false);
        this.notify.show(this.error()!, 'error');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/learning-path']);
  }

  protected readonly hasContent = computed(() => (this.lesson()?.contentBlocks?.length ?? 0) > 0);
  protected readonly hasQuizzes = computed(() => (this.lesson()?.quizzes?.length ?? 0) > 0);

  getBlockIcon(type: string): string {
    switch (type) {
      case 'text': return '📝';
      case 'audio': return '🔊';
      case 'video': return '🎬';
      case 'image': return '🖼️';
      case 'interactive': return '🎮';
      default: return '📄';
    }
  }

  getBlockTypeLabel(type: string): string {
    switch (type) {
      case 'text': return 'متن';
      case 'audio': return 'صوت';
      case 'video': return 'ویدیو';
      case 'image': return 'تصویر';
      case 'interactive': return 'تعاملی';
      default: return type;
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} دقیقه`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ساعت و ${mins} دقیقه` : `${hours} ساعت`;
  }

  startQuiz(quizId: number): void {
    this.notify.show('آزمون شروع شد', 'info');
    // TODO: Connect to quiz API: POST /api/learning/quizzes/{id}/attempt
  }
}