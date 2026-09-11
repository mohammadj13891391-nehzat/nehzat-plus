import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LESSON_PLANNER_API } from '@core/services/lesson-planner-api.token';
import { UserVocabularyCardDto, VocabularyWordDto } from '@core/models/lesson-planner.models';

@Component({
  selector: 'app-vocabulary-card-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="vocab-card-list page-container">
      <header class="page-header">
        <h1>کارت‌های کلامی</h1>
        <div class="actions">
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> New Card
          </button>
        </div>
      </header>

      @if (isLoading) {
        <div class="loading-state">
          <span>در حال بارگذاری...</span>
        </div>
      } @else if (cards.length === 0) {
        <div class="empty-state">
          <i class="fas fa-folder"></i>
          <p>کارت کلامی یافت نشد</p>
          <p> لغاتی کهreview هستند نمایش داده خواهند شد</p>
        </div>
      } @else {
        <div class="cards-tabs">
          <button class="tab-btn active" (click)="viewType = 'due'">بازم ({{ dueCards.length }})</button>
          <button class="tab-btn" (click)="viewType = 'learning'">یادگیری ({{ learningCards.length }})</button>
          <button class="tab-btn" (click)="viewType = 'review'">مرور ({{ reviewCards.length }})</button>
        </div>

        @switch (viewType) {
          @case ('due') {
            <div *ngIf="dueCards.length > 0 else noDueCards">
              <div class="cards-grid">
                @for (card of dueCards; track card.id) {
                <div class="card-item card due-card">
                  <div class="card-front">
                    <span class="word">{{ card.vocabularyWord?.wordText }}</span>
                    <span class="quality-badge">{{ card.quality }}</span>
                  </div>
                  <div class="card-back">
                    <p>{{ card.vocabularyWord?.definition }}</p>
                    <button class="btn btn-sm btn-primary" (click)="markKnown(card.id)"> biết شده </button>
                  </div>
                </div>
                }
              </div>
            </div>
            <ng-template #noDueCards>
              <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>هنوز کارت بازIFIED نیست</p>
              </div>
            </ng-template>
          }
          @case ('learning') {
            <div *ngIf="learningCards.length > 0 else noLearningCards">
              <div class="cards-grid">
                @for (card of learningCards; track card.id) {
                <div class="card-item card learning-card">
                  <div class="card-front">
                    <span class="word">{{ card.vocabularyWord?.wordText }}</span>
                  </div>
                  <div class="card-back">
                    <p>{{ card.vocabularyWord?.definition }}</p>
                    <button class="btn btn-sm btn-primary" (click)="markKnown(card.id)">believed known</button>
                  </div>
                </div>
                }
              </div>
            </div>
            <ng-template #noLearningCards>
              <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>هنوز لغتی برای یادگیری وجود ندارد</p>
              </div>
            </ng-template>
          }
          @case ('review') {
            <div *ngIf="reviewCards.length > 0 else noReviewCards">
              <div class="cards-grid">
                @for (card of reviewCards; track card.id) {
                <div class="card-item card review-card">
                  <div class="card-front">
                    <span class="word">{{ card.vocabularyWord?.wordText }}</span>
                  </div>
                  <div class="card-back">
                    <p>{{ card.vocabularyWord?.definition }}</p>
                    <p><small>Calculate next review based on quality</small></p>
                    <button class="btn btn-sm btn-primary" (click)="reviewCard(card.id, 3)">Good</button>
                    <button class="btn btn-sm btn-secondary" (click)="reviewCard(card.id, 1)">Again</button>
                  </div>
                </div>
                }
              </div>
            </div>
            <ng-template #noReviewCards>
              <div class="empty-state">
                <i class="fas fa-smile"></i>
                <p>هنوز کارتی برای مرور وجود ندارد</p>
              </div>
            </ng-template>
          }
        }
      }
    </div>
  `
})
export class VocabularyCardListComponent implements OnInit {
  private api = inject(LESSON_PLANNER_API);
  private destroyRef = inject(DestroyRef);
  
  cards: UserVocabularyCardDto[] = [];
  dueCards: UserVocabularyCardDto[] = [];
  learningCards: UserVocabularyCardDto[] = [];
  reviewCards: UserVocabularyCardDto[] = [];
  texts: VocabularyWordDto[] = [];
  isLoading = true;
  viewType: 'due' | 'learning' | 'review' = 'due';

  ngOnInit(): void {
    this.loadCards();
  }

  private loadCards(): void {
    this.isLoading = true;
    // Get user ID from auth service or use a default
    const userId = 1; // TODO: Get from auth
    
    // Load all card types in parallel
    this.api.getDueVocabularyCards(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.dueCards = result || [];
        this.checkCardType(result, 'due');
      }
    });
    
    this.api.getLearningVocabularyCards(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        // learning cards logic
      }
    });
    
    this.api.getReviewVocabularyCards(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.reviewCards = result || [];
        this.checkCardType(result, 'review');
      }
    });
    
    this.api.getVocabularyEaseFactorInfo(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        console.log('Ease factor info:', result);
      }
    });
  }

  private checkCardType(result: any[], type: 'due' | 'review'): void {
    if (type === 'due') {
      this.dueCards = result;
    } else {
      this.reviewCards = result;
    }
    this.isLoading = false;
  }

  public markKnown = (cardId: number): void => {
    console.log('Mark known:', cardId);
  };

  public reviewCard = (cardId: number, quality: number): void => {
    console.log('Review card:', cardId, 'quality:', quality);
  };
}