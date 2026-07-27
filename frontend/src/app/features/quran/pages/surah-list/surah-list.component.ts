import { Component, OnInit } from '@angular/core';
import { Surah } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-quran-list',
  template: `
    <div class="quran-container">
      <h2>قرآن کریم - سوره‌ها</h2>
      <div class="search-bar">
        <mat-form-field appearance="outline">
          <mat-label>جستجوی سوره</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="نام سوره..." />
        </mat-form-field>
      </div>
      <mat-progress-spinner *ngIf="loading" mode="indeterminate"></mat-progress-spinner>
      <table mat-table [dataSource]="filteredSurahs" class="mat-elevation-z8" *ngIf="!loading">
        <ng-container matColumnDef="number">
          <th mat-header-cell *matHeaderCellDef>شماره</th>
          <td mat-cell *matCellDef="let surah">{{ surah.number }}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>نام سوره</th>
          <td mat-cell *matCellDef="let surah">{{ surah.name }}</td>
        </ng-container>
        <ng-container matColumnDef="translatedName">
          <th mat-header-cell *matHeaderCellDef>نام فارسی</th>
          <td mat-cell *matCellDef="let surah">{{ surah.translatedName }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>نوع</th>
          <td mat-cell *matCellDef="let surah">{{ surah.type }}</td>
        </ng-container>
        <ng-container matColumnDef="totalAyahs">
          <th mat-header-cell *matHeaderCellDef>تعداد آیات</th>
          <td mat-cell *matCellDef="let surah">{{ surah.totalAyahs }}</td>
        </ng-container>
        <ng-container matColumnDef="revelationPlace">
          <th mat-header-cell *matHeaderCellDef>مکان نزول</th>
          <td mat-cell *matCellDef="let surah">{{ surah.revelationPlace }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>عملیات</th>
          <td mat-cell *matCellDef="let surah">
            <button mat-button [routerLink]="['/quran/surah', surah.id]">نمایش</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .quran-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .search-bar { margin-bottom: 20px; }
    table { width: 100%; }
  `]
})
export class QuranListComponent implements OnInit {
  surahs: Surah[] = [];
  filteredSurahs: Surah[] = [];
  searchTerm = '';
  loading = true;
  displayedColumns = ['number', 'name', 'translatedName', 'type', 'totalAyahs', 'revelationPlace', 'actions'];

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.loadSurahs();
  }

  loadSurahs(): void {
    this.loading = true;
    this.quranService.getSurahs().subscribe({
      next: (data) => {
        this.surahs = data;
        this.filteredSurahs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading surahs:', err);
        this.loading = false;
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