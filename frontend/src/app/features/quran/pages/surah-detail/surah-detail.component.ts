import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Surah, Ayah } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-surah-detail',
  template: `
    <div class="surah-detail" *ngIf="surah; else loading">
      <h2>{{ surah.number }}. {{ surah.name }}</h2>
      <p><strong>نام فارسی:</strong> {{ surah.translatedName }}</p>
      <p><strong>مکان نزول:</strong> {{ surah.revelationPlace }}</p>
      <p><strong>نوع:</strong> {{ surah.type }}</p>
      <p><strong>تعداد آیات:</strong> {{ surah.totalAyahs }}</p>
      <div class="ayahs">
        <h3>آیات</h3>
        <div *ngFor="let ayah of surah.ayahs" class="ayah">
          <p class="verse-number">آیه {{ ayah.verseNumber }}</p>
          <p class="verse-text">{{ ayah.text }}</p>
        </div>
      </div>
    </div>
    <mat-progress-spinner *ngIf="loading" mode="indeterminate"></mat-progress-spinner>
  `,
  styles: [`
    .surah-detail { padding: 20px; }
    .ayahs { margin-top: 20px; }
    .ayah { border-bottom: 1px solid #eee; padding: 10px 0; }
    .verse-number { color: #888; font-size: 0.8em; }
    .verse-text { font-size: 1.1em; direction: rtl; text-align: right; }
  `]
})
export class SurahDetailComponent implements OnInit {
  surah: Surah | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private quranService: QuranService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quranService.getSurah(id).subscribe({
      next: (data) => { this.surah = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }
}