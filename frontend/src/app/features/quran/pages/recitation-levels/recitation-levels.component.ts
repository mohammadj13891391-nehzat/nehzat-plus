import { Component, OnInit } from '@angular/core';
import { RecitationLevel } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-recitation-levels',
  template: `
    <div class="levels-container">
      <h2>سطوح تجوید</h2>
      <mat-card *ngFor="let level of levels" class="level-card">
        <mat-card-header>
          <mat-card-title>سطح {{ level.levelNumber }}: {{ level.name }}</mat-card-title>
          <mat-card-subtitle>{{ level.estimatedWeeks }} هفته - {{ level.pointsRequired }} نقطه</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ level.description }}</p>
          <p><strong>معیارها:</strong> {{ level.criteria }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .levels-container { padding: 20px; }
    .level-card { margin-bottom: 16px; }
  `]
})
export class RecitationLevelsComponent implements OnInit {
  levels: RecitationLevel[] = [];

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.quranService.getRecitationLevels().subscribe(data => this.levels = data);
  }
}