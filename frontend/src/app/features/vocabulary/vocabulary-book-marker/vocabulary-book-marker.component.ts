import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SelectedWord {
  word: string;
  selectedAt: Date;
}

@Component({
  selector: 'app-vocabulary-book-marker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="book-marker-page page-container" dir="rtl">
      <header class="page-header">
        <h1><i class="fas fa-book-open"></i> نشاننامه کتاب</h1>
        <p class="page-subtitle">استخراج کلمات دشواری کتاب از متن یا تصویر (OCR)</p>
      </header>

      <!-- Tab Navigation -->
      <nav class="book-marker-tabs" role="tablist">
        <button
          role="tab"
          [class.active]="activeTab === 'text'"
          (click)="switchTab('text')"
          [attr.aria-selected]="activeTab === 'text'"
        >
          <i class="fas fa-file-alt"></i> حالت متنی
        </button>
        <button
          role="tab"
          [class.active]="activeTab === 'image'"
          (click)="switchTab('image')"
          [attr.aria-selected]="activeTab === 'image'"
        >
          <i class="fas fa-image"></i> حالت تصویری (OCR)
        </button>
      </nav>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat">
          <span class="stat-value">{{ totalWords }}</span>
          <span class="stat-label">کل کلمات</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ selectedWords.length }}</span>
          <span class="stat-label">انتخاب شده</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ progressPercent }}%</span>
          <span class="stat-label">پیشرفت</span>
        </div>
      </div>

      <!-- Text Tab -->
      @if (activeTab === 'text') {
        <section class="tab-panel" role="tabpanel" aria-label="حالت متنی">
          <div class="toolbar">
            <label class="file-input-wrapper">
              <input type="file" accept=".txt" (change)="onTextFileSelected($event)" #txtFileInput>
              <span class="btn btn-secondary">
                <i class="fas fa-upload"></i> بارگذاری فایل متنی (.txt)
              </span>
            </label>
            <button class="btn btn-outline" (click)="clearText()" [disabled]="!textContent">
              <i class="fas fa-trash"></i> پاک کردن
            </button>
          </div>

          @if (textContent) {
            <div class="text-content" #textContentEl>
              @for (word of words; track $index) {
                <span
                  class="clickable-word"
                  [class.selected]="isWordSelected(word)"
                  (click)="toggleWordSelection(word)"
                  [title]="'کلیک برای ' + (isWordSelected(word) ? 'حذف' : 'انتخاب')"
                >
                  {{ word }}
                </span>
              }
            </div>
          } @else {
            <div class="empty-state">
              <i class="fas fa-file-alt"></i>
              <p>فایل متنی کتاب را بارگذاری کنید</p>
              <p class="hint">کلمات قابل کلیک برای انتخاب/حذف خواهند بود</p>
            </div>
          }
        </section>
      }

      <!-- Image Tab -->
      @if (activeTab === 'image') {
        <section class="tab-panel" role="tabpanel" aria-label="حالت تصویری OCR">
          <div class="toolbar">
            <div class="ocr-lang-selector">
              <label>زبان OCR:</label>
              <select [(ngModel)]="ocrLanguage" (change)="onLanguageChange()">
                <option value="fas+ara">فارسی + عربی (پیش‌فرض)</option>
                <option value="fas">فارسی</option>
                <option value="ara">عربی</option>
                <option value="eng+fas+ara">انگلیسی + فارسی + عربی</option>
              </select>
            </div>
          </div>

          <div class="image-upload-zone" (click)="imageFileInput.click()" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" [class.drag-active]="isDragActive">
            <input
              type="file"
              #imageFileInput
              accept="image/*,.pdf"
              (change)="onImageFileSelected($event)"
              style="display: none;"
            >
            @if (!ocrResult) {
              <div class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>تصویر صفحه کتاب را اینجا بکشید یا کلیک کنید</p>
                <span class="hint">پشتیبانی: JPG, PNG, WebP, PDF (صفحه اول)</span>
              </div>
            } @else {
              <div class="ocr-result">
                <div class="ocr-header">
                  <span class="ocr-status" [class.processing]="isOcrProcessing">
                    @if (isOcrProcessing) {
                      <i class="fas fa-spinner fa-spin"></i> در حال پردازش OCR...
                    } @else {
                      <i class="fas fa-check-circle"></i> OCR تکمیل شد
                    }
                  </span>
                  @if (ocrProgress > 0 && isOcrProcessing) {
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="ocrProgress"></div>
                    </div>
                  }
                </div>
                <div class="ocr-words" #ocrWordsEl>
                  @for (word of ocrWords; track $index) {
                    <span
                      class="clickable-word"
                      [class.selected]="isWordSelected(word)"
                      (click)="toggleWordSelection(word)"
                    >
                      {{ word }}
                    </span>
                  }
                </div>
              </div>
            }
          </div>

          @if (ocrResult && !isOcrProcessing) {
            <div class="image-toolbar">
              <button class="btn btn-outline" (click)="clearImage()">
                <i class="fas fa-trash"></i> پاک کردن تصویر
              </button>
            </div>
          }
        </section>
      }

      <!-- Selected Words Panel -->
      @if (selectedWords.length > 0) {
        <aside class="selected-words-panel">
          <header>
            <h3><i class="fas fa-list-check"></i> کلمات انتخاب شده ({{ selectedWords.length }})</h3>
            <div class="panel-actions">
              <button class="btn btn-sm btn-outline" (click)="copyToClipboard()">
                <i class="fas fa-copy"></i> کپی
              </button>
              <button class="btn btn-sm btn-primary" (click)="exportJson()">
                <i class="fas fa-file-export"></i> JSON
              </button>
              <button class="btn btn-sm btn-secondary" (click)="exportTxt()">
                <i class="fas fa-file-alt"></i> TXT
              </button>
              <button class="btn btn-sm btn-danger" (click)="clearAllSelections()">
                <i class="fas fa-times"></i> همه
              </button>
            </div>
          </header>
          <div class="selected-words-list">
            @for (item of selectedWords; track item.word) {
              <div class="selected-word-item">
                <span class="word-text">{{ item.word }}</span>
                <button class="btn-icon" (click)="removeWord(item.word)" title="حذف">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            }
          </div>
        </aside>
      }

      <!-- Keyboard Shortcuts Help -->
      <details class="shortcuts-help">
        <summary>کلیدهای میانبر</summary>
        <ul>
          <li><kbd>Ctrl+Z</kbd> - بازگشت (Undo)</li>
          <li><kbd>Ctrl+S</kbd> - خروجی JSON</li>
          <li><kbd>← →</kbd> - ناوبری تصاویر (در حالت تصویری)</li>
        </ul>
      </details>
    </div>
  `,
  styles: [`
    .book-marker-page {
      max-width: 100%;
    }

    .page-header {
      margin-bottom: var(--lp-space-lg);
    }

    .page-header h1 {
      font-size: var(--lp-text-2xl);
      color: var(--lp-text-primary);
      margin-bottom: var(--lp-space-xs);
    }

    .page-subtitle {
      color: var(--lp-text-secondary);
      font-size: var(--lp-text-base);
    }

    .book-marker-tabs {
      display: flex;
      gap: var(--lp-space-sm);
      margin-bottom: var(--lp-space-md);
      border-bottom: 2px solid var(--lp-border-light);
      padding-bottom: var(--lp-space-xs);
    }

    .book-marker-tabs button {
      padding: var(--lp-space-sm) var(--lp-space-md);
      border: none;
      background: transparent;
      color: var(--lp-text-secondary);
      font-size: var(--lp-text-sm);
      font-weight: 500;
      cursor: pointer;
      border-radius: var(--lp-radius-md) var(--lp-radius-md) 0 0;
      transition: all var(--lp-transition-fast);
      display: flex;
      align-items: center;
      gap: var(--lp-space-xs);
    }

    .book-marker-tabs button:hover {
      color: var(--lp-text-primary);
      background: var(--lp-bg-hover);
    }

    .book-marker-tabs button.active {
      color: var(--lp-primary);
      background: var(--lp-primary-light);
      border-bottom: 2px solid var(--lp-primary);
    }

    .stats-bar {
      display: flex;
      gap: var(--lp-space-lg);
      padding: var(--lp-space-md);
      background: var(--lp-bg-card);
      border-radius: var(--lp-radius-lg);
      border: 1px solid var(--lp-border-light);
      margin-bottom: var(--lp-space-lg);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
    }

    .stat-value {
      font-size: var(--lp-text-2xl);
      font-weight: 700;
      color: var(--lp-primary);
    }

    .stat-label {
      font-size: var(--lp-text-xs);
      color: var(--lp-text-secondary);
    }

    .tab-panel {
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .toolbar {
      display: flex;
      gap: var(--lp-space-md);
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: var(--lp-space-lg);
      padding: var(--lp-space-md);
      background: var(--lp-bg-card);
      border-radius: var(--lp-radius-lg);
      border: 1px solid var(--lp-border-light);
    }

    .ocr-lang-selector {
      display: flex;
      align-items: center;
      gap: var(--lp-space-sm);
    }

    .ocr-lang-selector label {
      font-size: var(--lp-text-sm);
      color: var(--lp-text-secondary);
    }

    .ocr-lang-selector select {
      padding: var(--lp-space-xs) var(--lp-space-sm);
      border: 1px solid var(--lp-border);
      border-radius: var(--lp-radius-md);
      background: var(--lp-bg-input);
      color: var(--lp-text-primary);
      font-size: var(--lp-text-sm);
    }

    .file-input-wrapper {
      position: relative;
      cursor: pointer;
    }

    .file-input-wrapper input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .text-content, .ocr-words {
      padding: var(--lp-space-lg);
      min-height: 200px;
      max-height: 500px;
      overflow-y: auto;
      background: var(--lp-bg-card);
      border: 1px solid var(--lp-border-light);
      border-radius: var(--lp-radius-lg);
      line-height: 2.5;
      font-size: var(--lp-text-base);
    }

    .clickable-word {
      cursor: pointer;
      padding: 2px 6px;
      margin: 1px 2px;
      border-radius: var(--lp-radius-sm);
      transition: all var(--lp-transition-fast);
      display: inline-block;
      user-select: none;
    }

    .clickable-word:hover {
      background: var(--lp-primary-light);
      color: var(--lp-primary);
    }

    .clickable-word.selected {
      background: var(--lp-primary);
      color: white;
      font-weight: 600;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--lp-space-2xl);
      text-align: center;
      color: var(--lp-text-secondary);
      background: var(--lp-bg-card);
      border: 2px dashed var(--lp-border);
      border-radius: var(--lp-radius-lg);
    }

    .empty-state i {
      font-size: 3rem;
      margin-bottom: var(--lp-space-md);
      opacity: 0.5;
    }

    .hint {
      font-size: var(--lp-text-sm);
      opacity: 0.7;
    }

    .image-upload-zone {
      border: 2px dashed var(--lp-border);
      border-radius: var(--lp-radius-lg);
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--lp-transition-fast);
      background: var(--lp-bg-card);
    }

    .image-upload-zone:hover, .image-upload-zone.drag-active {
      border-color: var(--lp-primary);
      background: var(--lp-primary-light);
    }

    .upload-placeholder i {
      font-size: 4rem;
      color: var(--lp-primary);
      margin-bottom: var(--lp-space-md);
    }

    .ocr-result {
      width: 100%;
    }

    .ocr-header {
      display: flex;
      align-items: center;
      gap: var(--lp-space-md);
      padding: var(--lp-space-md);
      background: var(--lp-bg-card);
      border-radius: var(--lp-radius-lg);
      border: 1px solid var(--lp-border-light);
      margin-bottom: var(--lp-space-md);
    }

    .ocr-status {
      display: flex;
      align-items: center;
      gap: var(--lp-space-xs);
      font-weight: 500;
    }

    .ocr-status.processing {
      color: var(--lp-warning);
    }

    .ocr-status:not(.processing) {
      color: var(--lp-success);
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: var(--lp-bg-input);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--lp-primary);
      transition: width var(--lp-transition-fast);
    }

    .ocr-words {
      min-height: 150px;
    }

    .image-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-top: var(--lp-space-md);
    }

    .selected-words-panel {
      margin-top: var(--lp-space-xl);
      padding: var(--lp-space-lg);
      background: var(--lp-bg-card);
      border: 1px solid var(--lp-border-light);
      border-radius: var(--lp-radius-lg);
    }

    .selected-words-panel header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--lp-space-md);
      flex-wrap: wrap;
      gap: var(--lp-space-sm);
    }

    .selected-words-panel h3 {
      font-size: var(--lp-text-lg);
      color: var(--lp-text-primary);
      display: flex;
      align-items: center;
      gap: var(--lp-space-xs);
    }

    .panel-actions {
      display: flex;
      gap: var(--lp-space-xs);
    }

    .btn-sm {
      padding: var(--lp-space-xs) var(--lp-space-sm);
      font-size: var(--lp-text-xs);
    }

    .selected-words-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--lp-space-xs);
    }

    .selected-word-item {
      display: flex;
      align-items: center;
      gap: var(--lp-space-xs);
      padding: var(--lp-space-xs) var(--lp-space-sm);
      background: var(--lp-primary-light);
      border-radius: var(--lp-radius-md);
      font-size: var(--lp-text-sm);
    }

    .selected-word-item .word-text {
      font-weight: 500;
    }

    .selected-word-item .btn-icon {
      padding: 2px 6px;
      color: var(--lp-text-secondary);
    }

    .selected-word-item .btn-icon:hover {
      color: var(--lp-danger);
    }

    .shortcuts-help {
      margin-top: var(--lp-space-xl);
      padding: var(--lp-space-md);
      background: var(--lp-bg-card);
      border: 1px solid var(--lp-border-light);
      border-radius: var(--lp-radius-lg);
    }

    .shortcuts-help summary {
      cursor: pointer;
      font-weight: 600;
      color: var(--lp-text-primary);
    }

    .shortcuts-help ul {
      margin-top: var(--lp-space-sm);
      padding-right: var(--lp-space-lg);
    }

    .shortcuts-help li {
      margin: var(--lp-space-xs) 0;
      font-size: var(--lp-text-sm);
      color: var(--lp-text-secondary);
    }

    .shortcuts-help kbd {
      background: var(--lp-bg-input);
      border: 1px solid var(--lp-border);
      border-radius: var(--lp-radius-sm);
      padding: 2px 6px;
      font-family: monospace;
      font-size: var(--lp-text-xs);
    }

    /* ============================================
       RESPONSIVE BREAKPOINTS
       Mobile: < 640px | Tablet: 640px - 1023px | Desktop: >= 1024px
       ============================================ */

    /* Mobile (< 640px) */
    @media (max-width: 639px) {
      .book-marker-page {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .book-marker-tabs {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: thin;
      }

      .stats-bar {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .toolbar .btn,
      .file-input-wrapper,
      .ocr-lang-selector {
        width: 100%;
      }

      .tab-panel {
        grid-template-columns: 1fr;
      }

      .selected-words-panel {
        order: 2;
        width: 100%;
        margin-top: 1rem;
      }

      .selected-words-list {
        max-height: 240px;
      }

      .panel-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .panel-actions .btn {
        flex: 1 1 auto;
      }

      .text-content,
      .ocr-words {
        max-height: 360px;
        overflow-y: auto;
      }

      .image-upload-zone {
        min-height: 220px;
        padding: 1rem;
      }

      .upload-placeholder {
        padding: 1rem;
        text-align: center;
      }

      .shortcuts-help {
        font-size: 0.8rem;
      }
    }

    /* Tablet (640px - 1023px) */
    @media (min-width: 640px) and (max-width: 1023px) {
      .book-marker-page {
        padding: 1.5rem;
      }

      .stats-bar {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        > :last-child {
          grid-column: 1 / -1;
        }
      }

      .toolbar {
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }

      .tab-panel {
        grid-template-columns: minmax(0, 1fr) minmax(240px, 0.35fr);
      }

      .selected-words-panel {
        min-width: 240px;
      }

      .text-content,
      .ocr-words {
        max-height: 480px;
        overflow-y: auto;
      }

      .panel-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }

    /* Desktop (>= 1024px) - refinements */
    @media (min-width: 1024px) {
      .book-marker-tabs {
        overflow-x: visible;
      }

      .toolbar {
        flex-wrap: nowrap;
      }

      .text-content,
      .ocr-words {
        max-height: 600px;
        overflow-y: auto;
      }
    }

    /* Accessibility: Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
      }
    }
  `]
})
export class VocabularyBookMarkerComponent implements OnInit, OnDestroy {
  // Tab state
  activeTab: 'text' | 'image' = 'text';

  // Text tab state
  textContent = '';
  words: string[] = [];

  // Image tab state
  ocrResult = false;
  ocrWords: string[] = [];
  isOcrProcessing = false;
  ocrProgress = 0;
  ocrLanguage = 'fas+ara';
  isDragActive = false;

  // Selected words (shared between tabs)
  selectedWords: SelectedWord[] = [];
  private selectionHistory: string[][] = []; // For undo

  // Computed
  get totalWords(): number {
    return this.activeTab === 'text' ? this.words.length : this.ocrWords.length;
  }

  get progressPercent(): number {
    if (this.totalWords === 0) return 0;
    return Math.round((this.selectedWords.length / this.totalWords) * 100);
  }

  ngOnInit(): void {
    this.setupKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.ctrlKey && event.key === 'z') {
      event.preventDefault();
      this.undo();
    }
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.exportJson();
    }
  };

  private setupKeyboardShortcuts(): void {
    window.addEventListener('keydown', this.handleKeydown);
  }

  switchTab(tab: 'text' | 'image'): void {
    this.activeTab = tab;
    this.saveSelectionState();
  }

  // Text tab methods
  onTextFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.textContent = e.target?.result as string;
      this.words = this.tokenizeText(this.textContent);
      this.selectedWords = [];
      this.selectionHistory = [];
    };
    reader.readAsText(file);
  }

  clearText(): void {
    this.textContent = '';
    this.words = [];
    this.selectedWords = [];
    this.selectionHistory = [];
  }

  // Image tab methods
  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.processImageFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processImageFile(file);
  }

  private async processImageFile(file: File): Promise<void> {
    this.isOcrProcessing = true;
    this.ocrProgress = 0;
    this.ocrResult = false;
    this.ocrWords = [];

    try {
      // Use Tesseract.js via CDN
      const Tesseract = (window as any).Tesseract;
      if (!Tesseract) {
        await this.loadTesseract();
      }

      const worker = await Tesseract.createWorker(this.ocrLanguage, 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            this.ocrProgress = Math.round(m.progress * 100);
          }
        }
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      this.ocrWords = this.tokenizeText(data.text);
      this.ocrResult = true;
    } catch (error) {
      console.error('OCR Error:', error);
      alert('خطا در پردازش OCR: ' + (error as Error).message);
    } finally {
      this.isOcrProcessing = false;
      this.ocrProgress = 100;
    }
  }

  private loadTesseract(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Tesseract) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Tesseract.js'));
      document.head.appendChild(script);
    });
  }

  onLanguageChange(): void {
    if (this.ocrResult) {
      this.ocrResult = false;
      this.ocrWords = [];
      alert('زبان تغییر کرد. لطفاً تصویر را مجدداً بارگذاری کنید.');
    }
  }

  clearImage(): void {
    this.ocrResult = false;
    this.ocrWords = [];
    this.isOcrProcessing = false;
    this.ocrProgress = 0;
    this.selectedWords = [];
    this.selectionHistory = [];
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }

  // Shared word selection methods
  private tokenizeText(text: string): string[] {
    // Split by whitespace and punctuation, keep Persian/Arabic words
    return text
      .split(/[\s\u200C\n\r\t]+/)
      .map(w => w.replace(/^[،।؛؟\!\?\.،:؛""''()\[\]{}]+|[،।؛؟\!\?\.،:؛""''()\[\]{}]+$/g, ''))
      .filter(w => w.length > 1);
  }

  isWordSelected(word: string): boolean {
    return this.selectedWords.some(w => w.word === word);
  }

  toggleWordSelection(word: string): void {
    this.saveSelectionState();
    const index = this.selectedWords.findIndex(w => w.word === word);
    if (index >= 0) {
      this.selectedWords.splice(index, 1);
    } else {
      this.selectedWords.push({ word, selectedAt: new Date() });
    }
  }

  removeWord(word: string): void {
    this.saveSelectionState();
    this.selectedWords = this.selectedWords.filter(w => w.word !== word);
  }

  clearAllSelections(): void {
    this.saveSelectionState();
    this.selectedWords = [];
  }

  private saveSelectionState(): void {
    this.selectionHistory.push([...this.selectedWords.map(w => w.word)]);
    if (this.selectionHistory.length > 50) this.selectionHistory.shift();
  }

  undo(): void {
    if (this.selectionHistory.length > 0) {
      const prev = this.selectionHistory.pop()!;
      this.selectedWords = prev.map(w => ({ word: w, selectedAt: new Date() }));
    }
  }

  // Export methods
  copyToClipboard(): void {
    const text = this.selectedWords.map(w => w.word).join('\n');
    navigator.clipboard.writeText(text);
    alert('کلمات در کلیپ‌بورد کپی شدند');
  }

  exportJson(): void {
    const data = {
      timestamp: new Date().toISOString(),
      source: this.activeTab,
      totalWords: this.totalWords,
      selectedCount: this.selectedWords.length,
      words: this.selectedWords.map(w => w.word)
    };
    this.downloadFile(JSON.stringify(data, null, 2), 'book-marker-words.json', 'application/json');
  }

  exportTxt(): void {
    const text = this.selectedWords.map(w => w.word).join('\n');
    this.downloadFile(text, 'book-marker-words.txt', 'text/plain');
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}