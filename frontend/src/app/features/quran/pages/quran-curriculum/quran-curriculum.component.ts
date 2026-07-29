import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { QuranCurriculum } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-quran-curriculum',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './quran-curriculum.component.html',
  styleUrls: ['./quran-curriculum.component.scss']
})
export class QuranCurriculumComponent implements OnInit {
  curricula: QuranCurriculum[] = [];
  _loading = signal(true);
  _error = signal<string | null>(null);

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.loadCurricula();
  }

  loadCurricula(): void {
    this._loading.set(true);
    this._error.set(null);
    this.quranService.getQuranCurricula().subscribe({
      next: (data) => {
        this.curricula = data;
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error loading curricula:', err);
        this._error.set('خطا در بارگذاری برنامه‌های درسی');
        this._loading.set(false);
      }
    });
  }
}