import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecitationLevel } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-recitation-levels',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './recitation-levels.component.html',
  styleUrls: ['./recitation-levels.component.scss']
})
export class RecitationLevelsComponent implements OnInit {
  levels: RecitationLevel[] = [];
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.quranService.getRecitationLevels().subscribe({
      next: (data) => { this.levels = data; this.loading.set(false); },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگیری سطوح تجوید'); this.loading.set(false); }
    });
  }
}