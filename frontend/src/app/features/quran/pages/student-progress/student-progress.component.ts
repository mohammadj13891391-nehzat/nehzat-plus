import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuranStudentProgress } from '../../../../core/models/lesson-planner.models';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-progress.component.html',
  styleUrls: ['./student-progress.component.scss']
})
export class StudentProgressComponent implements OnInit {
  progresses: QuranStudentProgress[] = [];
  overallProgress = 0;
  _loading = signal(true);
  _error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private quranService: QuranService
  ) {}

  ngOnInit(): void {
    const studentId = Number(this.route.snapshot.paramMap.get('studentId'));
    if (!studentId) {
      this._error.set('شناسه دانشجو نامعتبر است');
      this._loading.set(false);
      return;
    }
    this._loading.set(true);
    this.quranService.getQuranStudentProgress(studentId).subscribe({
      next: (data) => {
        this.progresses = [data];
        this.overallProgress = data.percentage;
        this._loading.set(false);
      },
      error: () => {
        this._error.set('خطا در بارگذاری پیشرفت');
        this._loading.set(false);
      }
    });
  }
}