import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HadithBook } from '../../services/hadith.service';
import { HadithService } from '../../services/hadith.service';

@Component({
  selector: 'app-hadith-books',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './hadith-books.component.html',
  styleUrls: ['./hadith-books.component.scss']
})
export class HadithBooksComponent implements OnInit {
  books: HadithBook[] = [];
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(private hadithService: HadithService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.hadithService.getHadithBooks().subscribe({
      next: (data) => { this.books = data; this.loading.set(false); },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگذاری کتاب‌های حدیث'); this.loading.set(false); }
    });
  }
}
