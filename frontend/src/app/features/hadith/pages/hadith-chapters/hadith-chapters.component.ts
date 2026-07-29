import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HadithChapter, HadithBook } from '../../services/hadith.service';
import { HadithService } from '../../services/hadith.service';

@Component({
  selector: 'app-hadith-chapters',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './hadith-chapters.component.html',
  styleUrls: ['./hadith-chapters.component.scss']
})
export class HadithChaptersComponent implements OnInit {
  book: HadithBook | null = null;
  chapters: HadithChapter[] = [];
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private hadithService: HadithService
  ) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('bookId'));
    this.loadBook(bookId);
    this.loadChapters(bookId);
  }

  loadBook(bookId: number): void {
    this.hadithService.getHadithBook(bookId).subscribe({
      next: (data) => { this.book = data; },
      error: (err) => { console.error(err); }
    });
  }

  loadChapters(bookId: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.hadithService.getHadithChapters(bookId).subscribe({
      next: (data) => { this.chapters = data; this.loading.set(false); },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگذاری ابواب'); this.loading.set(false); }
    });
  }
}
