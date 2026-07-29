import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HadithItem, HadithReviewStats } from '../../services/hadith.service';
import { HadithService } from '../../services/hadith.service';

@Component({
  selector: 'app-hadith-review',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './hadith-review.component.html',
  styleUrls: ['./hadith-review.component.scss']
})
export class HadithReviewComponent implements OnInit {
  stats: HadithReviewStats | null = null;
  currentHadith: HadithItem | null = null;
  loading = signal(true);
  flipped = signal(false);
  reviewing = signal(false);
  errorMessage = signal<string | null>(null);
  reviewComplete = signal(false);

  constructor(private hadithService: HadithService) {}

  ngOnInit(): void {
    this.loadReviewData();
  }

  loadReviewData(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    const studentId = 1;

    this.hadithService.getReviewStats(studentId).subscribe({
      next: (data) => { this.stats = data; },
      error: (err) => { console.error(err); }
    });

    this.hadithService.getPendingReviews(studentId, 1).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.currentHadith = data[0];
        } else {
          this.reviewComplete.set(true);
        }
        this.loading.set(false);
      },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگذاری حدیث‌ها'); this.loading.set(false); }
    });
  }

  flipCard(): void {
    this.flipped.update(v => !v);
  }

  submitReview(isCorrect: boolean): void {
    if (!this.currentHadith || this.reviewing()) return;

    this.reviewing.set(true);
    const studentId = 1;

    this.hadithService.submitReview(studentId, { hadithId: this.currentHadith.id, isCorrect }).subscribe({
      next: () => {
        this.reviewing.set(false);
        this.flipped.set(false);
        this.loadNextHadith();
      },
      error: (err) => { console.error(err); this.reviewing.set(false); }
    });
  }

  private loadNextHadith(): void {
    const studentId = 1;
    this.hadithService.getPendingReviews(studentId, 1).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.currentHadith = data[0];
          this.reviewComplete.set(false);
        } else {
          this.currentHadith = null;
          this.reviewComplete.set(true);
        }
      },
      error: (err) => { console.error(err); }
    });
  }
}
