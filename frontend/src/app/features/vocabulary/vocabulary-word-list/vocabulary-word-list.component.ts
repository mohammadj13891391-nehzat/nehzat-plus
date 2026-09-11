import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LESSON_PLANNER_API } from '@core/services/lesson-planner-api.token';
import { VocabularyWordDto, VocabularyTextDto } from '@core/models/lesson-planner.models';

@Component({
  selector: 'app-vocabulary-word-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="vocab-word-list page-container">
      <header class="page-header">
        <h1> لغات</h1>
        <div class="actions">
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> agreg word
          </button>
        </div>
      </header>

      @if (isLoading) {
        <div class="loading-state">
          <span>در حال بارگذاری...</span>
        </div>
      } @else if (words.length === 0) {
        <div class="empty-state">
          <i class="fas fa-folder"></i>
          <p>هنوز لغتی اضافه نشده است</p>
          <p>ابتدا یک متن لغوي اضافه کنید</p>
        </div>
      } @else {
        <div class="words-grid">
          @for (word of words; track word.id) {
          <div class="word-card card">
            <div class="word-info">
              <span class="word-text">{{ word.wordText }}</span>
              <span class="difficulty-badge [word.difficultyLevel]">
                {{ word.difficultyLevel }}
              </span>
            </div>
            <div class="word-actions">
              <button class="btn btn-sm btn-outline" (click)="viewWord(word.id)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" (click)="reviewWord(word.id)">
                <i class="fas fa-repeat"></i>
              </button>
            </div>
          </div>
          }
        </div>
      }
    </div>
  `
})
export class VocabularyWordListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private destroyRef = inject(DestroyRef);
  
  words: VocabularyWordDto[] = [];
  texts: VocabularyTextDto[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadWords();
    this.loadTexts();
  }

  private loadWords(): void {
    this.isLoading = true;
    this.api.getVocabularyWordsByText(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.words = result || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading words:', err);
        this.error = 'خطا در بارگذاری لغات';
        this.isLoading = false;
      }
    });
  }

  private loadTexts(): void {
    this.api.getVocabularyTexts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.texts = result || [];
      }
    });
  }

  viewWord(wordId: number): void {
    console.log('View word:', wordId);
  }

  reviewWord(wordId: number): void {
    console.log('Review word:', wordId);
  }
}