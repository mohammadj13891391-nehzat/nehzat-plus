import { Component, OnInit } from '@angular/core';
import { QuranCurriculum } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-quran-curriculum',
  template: `
    <div class="curriculum-container">
      <h2>برنامه‌های درسی قرآن</h2>
      <mat-card *ngFor="let curriculum of curricula" class="curriculum-card">
        <mat-card-header>
          <mat-card-title>{{ curriculum.title }}</mat-card-title>
          <mat-card-subtitle>سطح: {{ curriculum.difficultyLevel }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ curriculum.description }}</p>
          <p><strong>سوره:</strong> {{ curriculum.startSurah }} تا {{ curriculum.endSurah }}</p>
          <p><strong>آیات:</strong> {{ curriculum.totalAyahs }}</p>
          <p><strong>زمان تخمینی:</strong> {{ curriculum.estimatedDays }} روز</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .curriculum-container { padding: 20px; }
    .curriculum-card { margin-bottom: 16px; }
  `]
})
export class QuranCurriculumComponent implements OnInit {
  curricula: QuranCurriculum[] = [];

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.quranService.getQuranCurricula().subscribe(data => this.curricula = data);
  }
}