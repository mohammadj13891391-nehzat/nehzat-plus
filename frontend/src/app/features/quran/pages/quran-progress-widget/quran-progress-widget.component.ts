import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-quran-progress-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quran-progress-widget.component.html',
  styleUrls: ['./quran-progress-widget.component.scss']
})
export class QuranProgressWidgetComponent implements OnInit {
  @Input() studentId: number = 0;
  stats: any = null;
  studentProgress: number | null = null;
  _loading = signal(true);
  _error = signal<string | null>(null);

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this._loading.set(true);
    this.quranService.getQuranDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this._loading.set(false);
      },
      error: () => {
        this._error.set('خطا در بارگذاری آمار');
        this._loading.set(false);
      }
    });
    if (this.studentId > 0) {
      this.quranService.getQuranStudentProgress(this.studentId).subscribe({
        next: (data) => {
          this.studentProgress = data.percentage;
        },
        error: () => {}
      });
    }
  }
}