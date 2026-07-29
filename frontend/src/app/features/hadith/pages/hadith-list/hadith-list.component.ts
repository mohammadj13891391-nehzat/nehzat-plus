import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HadithItem } from '../../services/hadith.service';
import { HadithService } from '../../services/hadith.service';

@Component({
  selector: 'app-hadith-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './hadith-list.component.html',
  styleUrls: ['./hadith-list.component.scss']
})
export class HadithListComponent implements OnInit {
  hadiths: HadithItem[] = [];
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private hadithService: HadithService
  ) {}

  ngOnInit(): void {
    const chapterId = Number(this.route.snapshot.paramMap.get('chapterId'));
    this.loadHadiths(chapterId);
  }

  loadHadiths(chapterId: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.hadithService.getHadithsByChapter(chapterId).subscribe({
      next: (data) => { this.hadiths = data; this.loading.set(false); },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگذاری احادیث'); this.loading.set(false); }
    });
  }

  getGradeClass(hadith: HadithItem): string {
    if (!hadith.grade) return '';
    const grade = hadith.grade.toLowerCase();
    if (grade.includes('صحیح') || grade.includes('sahih')) return 'grade-sahih';
    if (grade.includes('حسن') || grade.includes('hasan')) return 'grade-hasan';
    if (grade.includes('ضعیف') || grade.includes('daif')) return 'grade-daif';
    return '';
  }
}
