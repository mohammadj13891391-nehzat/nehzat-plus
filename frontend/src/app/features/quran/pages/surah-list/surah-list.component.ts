import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Surah } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-quran-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatTableModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule],
  templateUrl: './surah-list.component.html',
  styleUrls: ['./surah-list.component.scss']
})
export class QuranListComponent implements OnInit {
  surahs: Surah[] = [];
  filteredSurahs: Surah[] = [];
  searchTerm = '';
  _loading = signal(true);
  _error = signal<string | null>(null);
  displayedColumns = ['number', 'name', 'translatedName', 'type', 'totalAyahs', 'revelationPlace', 'actions'];

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.loadSurahs();
  }

  loadSurahs(): void {
    this._loading.set(true);
    this._error.set(null);
    this.quranService.getSurahs().subscribe({
      next: (data) => {
        this.surahs = data;
        this.filteredSurahs = data;
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error loading surahs:', err);
        this._error.set('خطا در بارگذاری سوره‌ها');
        this._loading.set(false);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.filteredSurahs = this.surahs.filter(s =>
        s.name.includes(this.searchTerm) ||
        s.translatedName.includes(this.searchTerm) ||
        s.number.includes(this.searchTerm)
      );
    } else {
      this.filteredSurahs = this.surahs;
    }
  }
}