import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Surah, Ayah } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-surah-detail',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './surah-detail.component.html',
  styleUrls: ['./surah-detail.component.scss']
})
export class SurahDetailComponent implements OnInit {
  surah: Surah | null = null;
  loading = true;
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private quranService: QuranService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quranService.getSurah(id).subscribe({
      next: (data) => { this.surah = data; this.loading = false; },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگیری اطلاعات سوره'); this.loading = false; }
    });
  }
}