import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TajweedRule } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-tajweed-rules',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './tajweed-rules.component.html',
  styleUrls: ['./tajweed-rules.component.scss']
})
export class TajweedRulesComponent implements OnInit {
  rules: TajweedRule[] = [];
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.quranService.getTajweedRules().subscribe({
      next: (data) => { this.rules = data; this.loading.set(false); },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگیری قوانین تجوید'); this.loading.set(false); }
    });
  }
}