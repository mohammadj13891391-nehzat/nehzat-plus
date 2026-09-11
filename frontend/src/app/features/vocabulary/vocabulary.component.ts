import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="vocabulary-page" dir="rtl">
      <header class="page-header">
        <h1>مر vocab</h1>
        <nav class="vocab-nav">
          <button routerLink="/vocabulary/texts" [routerLinkActive]="['active']">متن‌های لغوی</button>
          <button routerLink="/vocabulary/words" [routerLinkActive]="['active']"> لغات</button>
          <button routerLink="/vocabulary/cards" [routerLinkActive]="['active']">کارت‌های کلامی</button>
          <button routerLink="/vocabulary/book-marker" [routerLinkActive]="['active']">
            <i class="fas fa-book-open"></i> نشاننامه کتاب
          </button>
        </nav>
      </header>

      <main class="vocabulary-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class VocabularyComponent {}