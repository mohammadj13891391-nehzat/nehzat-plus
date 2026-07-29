import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HadithItem } from '../../services/hadith.service';
import { HadithService } from '../../services/hadith.service';

@Component({
  selector: 'app-hadith-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './hadith-detail.component.html',
  styleUrls: ['./hadith-detail.component.scss']
})
export class HadithDetailComponent implements OnInit {
  hadith: HadithItem | null = null;
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  audioPlaying = signal(false);

  private audio: HTMLAudioElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private hadithService: HadithService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadHadith(id);
  }

  loadHadith(id: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.hadithService.getHadith(id).subscribe({
      next: (data) => { this.hadith = data; this.loading.set(false); },
      error: (err) => { console.error(err); this.errorMessage.set('خطا در بارگذاری حدیث'); this.loading.set(false); }
    });
  }

  toggleAudio(): void {
    if (!this.hadith?.audioUrl) return;

    if (this.audioPlaying()) {
      this.audio?.pause();
      this.audioPlaying.set(false);
    } else {
      if (!this.audio) {
        this.audio = new Audio(this.hadith.audioUrl);
        this.audio.onended = () => this.audioPlaying.set(false);
      }
      this.audio.play();
      this.audioPlaying.set(true);
    }
  }

  getGradeClass(): string {
    if (!this.hadith?.grade) return '';
    const grade = this.hadith.grade.toLowerCase();
    if (grade.includes('صحیح') || grade.includes('sahih')) return 'grade-sahih';
    if (grade.includes('حسن') || grade.includes('hasan')) return 'grade-hasan';
    if (grade.includes('ضعیف') || grade.includes('daif')) return 'grade-daif';
    return '';
  }
}
