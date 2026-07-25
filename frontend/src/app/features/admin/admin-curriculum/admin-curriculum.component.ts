import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import {
  SubjectArea, TeachingMethod, Book, CurriculumObjective,
  CreateSubjectAreaPayload, CreateTeachingMethodPayload, CreateBookPayload, CreateCurriculumObjectivePayload,
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-curriculum',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-curriculum-title">
      <header class="section-header">
        <h2 id="admin-curriculum-title" class="section-title">برنامه درسی</h2>
      </header>

      <div class="tabs" style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 2px solid var(--lp-border); padding-bottom: 0.25rem">
        <button type="button" class="tab-btn" [class.active]="activeTab === 'subjectAreas'" (click)="setTab('subjectAreas')">حوزه‌های درسی</button>
        <button type="button" class="tab-btn" [class.active]="activeTab === 'teachingMethods'" (click)="setTab('teachingMethods')">روش‌های تدریس</button>
        <button type="button" class="tab-btn" [class.active]="activeTab === 'books'" (click)="setTab('books')">کتاب‌ها</button>
        <button type="button" class="tab-btn" [class.active]="activeTab === 'objectives'" (click)="setTab('objectives')">اهداف آموزشی</button>
      </div>

      @if (errorMessage) {
        <p class="lp-error" role="alert">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p class="lp-success" role="status">{{ successMessage }}</p>
      }

      <!-- SUBJECT AREAS -->
      @if (activeTab === 'subjectAreas') {
        <div class="split-grid">
          <div>
            <input type="text" [(ngModel)]="searchSaQuery" placeholder="جستجوی حوزه درسی..." class="search-input" />
            <button type="button" class="btn btn-secondary" (click)="startCreateSa()" style="margin-bottom: 0.5rem">افزودن حوزه درسی</button>
            @if (loadingSa) {
              <p class="muted">در حال دریافت...</p>
            } @else if (filteredSa.length === 0) {
              <p class="muted">حوزه درسی یافت نشد.</p>
            } @else {
              <div class="select-list">
                @for (item of filteredSa; track item.id) {
                  <button type="button" class="list-item" [class.is-selected]="selectedSaId === item.id" (click)="selectSa(item)">
                    <div class="list-item-top">
                      <strong>{{ item.name }}</strong>
                    </div>
                    <span class="list-meta">{{ item.key }}</span>
                  </button>
                }
              </div>
            }
          </div>
          <form [formGroup]="saForm" class="editor-form" (ngSubmit)="saveSa()">
            <h3>{{ saEditMode ? 'ویرایش حوزه درسی' : 'حوزه درسی جدید' }}</h3>
            <label>کلید یکتا <input type="text" formControlName="key" /></label>
            <label>نام <input type="text" formControlName="name" /></label>
            <label>توضیحات <textarea formControlName="description" rows="2"></textarea></label>
            <label>ترتیب <input type="number" formControlName="sortOrder" min="0" /></label>
            <div class="row-actions">
              <button type="submit" class="btn" [disabled]="saForm.invalid || savingSa">
                {{ savingSa ? 'در حال ذخیره...' : saEditMode ? 'ذخیره تغییرات' : 'ایجاد' }}
              </button>
              @if (saEditMode && selectedSaId !== null) {
                <button type="button" class="btn btn-secondary" [disabled]="savingSa" (click)="deleteSa(selectedSaId)">حذف</button>
              }
            </div>
          </form>
        </div>
      }

      <!-- TEACHING METHODS -->
      @if (activeTab === 'teachingMethods') {
        <div class="split-grid">
          <div>
            <input type="text" [(ngModel)]="searchTmQuery" placeholder="جستجوی روش تدریس..." class="search-input" />
            <button type="button" class="btn btn-secondary" (click)="startCreateTm()" style="margin-bottom: 0.5rem">افزودن روش تدریس</button>
            @if (loadingTm) {
              <p class="muted">در حال دریافت...</p>
            } @else if (filteredTm.length === 0) {
              <p class="muted">روش تدریسی یافت نشد.</p>
            } @else {
              <div class="select-list">
                @for (item of filteredTm; track item.id) {
                  <button type="button" class="list-item" [class.is-selected]="selectedTmId === item.id" (click)="selectTm(item)">
                    <div class="list-item-top">
                      <strong>{{ item.name }}</strong>
                    </div>
                    <span class="list-meta">{{ item.key }}</span>
                  </button>
                }
              </div>
            }
          </div>
          <form [formGroup]="tmForm" class="editor-form" (ngSubmit)="saveTm()">
            <h3>{{ tmEditMode ? 'ویرایش روش تدریس' : 'روش تدریس جدید' }}</h3>
            <label>کلید یکتا <input type="text" formControlName="key" /></label>
            <label>نام <input type="text" formControlName="name" /></label>
            <label>توضیحات <textarea formControlName="description" rows="2"></textarea></label>
            <label>ترتیب <input type="number" formControlName="sortOrder" min="0" /></label>
            <div class="row-actions">
              <button type="submit" class="btn" [disabled]="tmForm.invalid || savingTm">
                {{ savingTm ? 'در حال ذخیره...' : tmEditMode ? 'ذخیره تغییرات' : 'ایجاد' }}
              </button>
              @if (tmEditMode && selectedTmId !== null) {
                <button type="button" class="btn btn-secondary" [disabled]="savingTm" (click)="deleteTm(selectedTmId)">حذف</button>
              }
            </div>
          </form>
        </div>
      }

      <!-- BOOKS -->
      @if (activeTab === 'books') {
        <div class="split-grid">
          <div>
            <input type="text" [(ngModel)]="searchBookQuery" placeholder="جستجوی کتاب..." class="search-input" />
            <button type="button" class="btn btn-secondary" (click)="startCreateBook()" style="margin-bottom: 0.5rem">افزودن کتاب</button>
            @if (loadingBooks) {
              <p class="muted">در حال دریافت...</p>
            } @else if (filteredBooks.length === 0) {
              <p class="muted">کتابی یافت نشد.</p>
            } @else {
              <div class="select-list">
                @for (item of filteredBooks; track item.id) {
                  <button type="button" class="list-item" [class.is-selected]="selectedBookId === item.id" (click)="selectBook(item)">
                    <div class="list-item-top">
                      <strong>{{ item.title }}</strong>
                    </div>
                    <span class="list-meta">{{ item.author ? item.author : 'بدون نویسنده' }}</span>
                  </button>
                }
              </div>
            }
          </div>
          <form [formGroup]="bookForm" class="editor-form" (ngSubmit)="saveBook()">
            <h3>{{ bookEditMode ? 'ویرایش کتاب' : 'کتاب جدید' }}</h3>
            <label>کلید یکتا <input type="text" formControlName="key" /></label>
            <label>عنوان <input type="text" formControlName="title" /></label>
            <label>نویسنده <input type="text" formControlName="author" /></label>
            <label>
              حوزه درسی
              <select formControlName="subjectAreaId">
                <option [value]="null">— انتخاب کنید —</option>
                @for (sa of subjectAreas; track sa.id) {
                  <option [value]="sa.id">{{ sa.name }}</option>
                }
              </select>
            </label>
            <label>سطح <input type="text" formControlName="level" /></label>
            <label>ناشر <input type="text" formControlName="publisher" /></label>
            <label>تعداد صفحات <input type="number" formControlName="pages" min="1" /></label>
            <div class="row-actions">
              <button type="submit" class="btn" [disabled]="bookForm.invalid || savingBook">
                {{ savingBook ? 'در حال ذخیره...' : bookEditMode ? 'ذخیره تغییرات' : 'ایجاد' }}
              </button>
              @if (bookEditMode && selectedBookId !== null) {
                <button type="button" class="btn btn-secondary" [disabled]="savingBook" (click)="deleteBook(selectedBookId)">حذف</button>
              }
            </div>
          </form>
        </div>
      }

      <!-- OBJECTIVES -->
      @if (activeTab === 'objectives') {
        <div class="split-grid">
          <div>
            <input type="text" [(ngModel)]="searchObjQuery" placeholder="جستجوی هدف آموزشی..." class="search-input" />
            <button type="button" class="btn btn-secondary" (click)="startCreateObj()" style="margin-bottom: 0.5rem">افزودن هدف آموزشی</button>
            @if (loadingObj) {
              <p class="muted">در حال دریافت...</p>
            } @else if (filteredObj.length === 0) {
              <p class="muted">هدف آموزشی یافت نشد.</p>
            } @else {
              <div class="select-list">
                @for (item of filteredObj; track item.id) {
                  <button type="button" class="list-item" [class.is-selected]="selectedObjId === item.id" (click)="selectObj(item)">
                    <div class="list-item-top">
                      <strong>{{ item.title }}</strong>
                      <span class="list-meta">{{ item.level }}</span>
                    </div>
                    <span class="list-meta">{{ item.key }}</span>
                  </button>
                }
              </div>
            }
          </div>
          <form [formGroup]="objForm" class="editor-form" (ngSubmit)="saveObj()">
            <h3>{{ objEditMode ? 'ویرایش هدف آموزشی' : 'هدف آموزشی جدید' }}</h3>
            <label>کلید یکتا <input type="text" formControlName="key" /></label>
            <label>عنوان <input type="text" formControlName="title" /></label>
            <label>توضیحات <textarea formControlName="description" rows="2"></textarea></label>
            <label>
              حوزه درسی
              <select formControlName="subjectAreaId">
                <option [value]="null">— انتخاب کنید —</option>
                @for (sa of subjectAreas; track sa.id) {
                  <option [value]="sa.id">{{ sa.name }}</option>
                }
              </select>
            </label>
            <label>
              هدف والد
              <select formControlName="parentObjectiveId">
                <option [value]="null">— ندارد —</option>
                @for (obj of objectives; track obj.id) {
                  <option [value]="obj.id">{{ obj.title }}</option>
                }
              </select>
            </label>
            <label>ترتیب <input type="number" formControlName="sortOrder" min="0" /></label>
            <label>
              سطح
              <select formControlName="level">
                <option value="beginner">مقدماتی</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">پیشرفته</option>
              </select>
            </label>
            <div class="row-actions">
              <button type="submit" class="btn" [disabled]="objForm.invalid || savingObj">
                {{ savingObj ? 'در حال ذخیره...' : objEditMode ? 'ذخیره تغییرات' : 'ایجاد' }}
              </button>
              @if (objEditMode && selectedObjId !== null) {
                <button type="button" class="btn btn-secondary" [disabled]="savingObj" (click)="deleteObj(selectedObjId)">حذف</button>
              }
            </div>
          </form>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCurriculumComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  activeTab: 'subjectAreas' | 'teachingMethods' | 'books' | 'objectives' = 'subjectAreas';

  // Subject Areas
  subjectAreas: SubjectArea[] = [];
  loadingSa = false;
  savingSa = false;
  searchSaQuery = '';
  selectedSaId: number | null = null;
  saEditMode = false;
  saForm = this.fb.nonNullable.group({
    key: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    sortOrder: [0],
  });

  // Teaching Methods
  teachingMethods: TeachingMethod[] = [];
  loadingTm = false;
  savingTm = false;
  searchTmQuery = '';
  selectedTmId: number | null = null;
  tmEditMode = false;
  tmForm = this.fb.nonNullable.group({
    key: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    sortOrder: [0],
  });

  // Books
  books: Book[] = [];
  loadingBooks = false;
  savingBook = false;
  searchBookQuery = '';
  selectedBookId: number | null = null;
  bookEditMode = false;
  bookForm = this.fb.nonNullable.group({
    key: ['', Validators.required],
    title: ['', Validators.required],
    author: [''],
    subjectAreaId: [0, Validators.required],
    level: [''],
    publisher: [''],
    pages: [0],
  });

  // Objectives
  objectives: CurriculumObjective[] = [];
  loadingObj = false;
  savingObj = false;
  searchObjQuery = '';
  selectedObjId: number | null = null;
  objEditMode = false;
  objForm = this.fb.nonNullable.group({
    key: ['', Validators.required],
    title: ['', Validators.required],
    description: [''],
    subjectAreaId: [0, Validators.required],
    parentObjectiveId: [0],
    sortOrder: [0],
    level: ['beginner'],
  });

  errorMessage = '';
  successMessage = '';

  get filteredSa(): SubjectArea[] {
    const q = this.searchSaQuery.trim().toLowerCase();
    if (!q) return this.subjectAreas;
    return this.subjectAreas.filter((s) => s.name.toLowerCase().includes(q) || s.key.toLowerCase().includes(q));
  }

  get filteredTm(): TeachingMethod[] {
    const q = this.searchTmQuery.trim().toLowerCase();
    if (!q) return this.teachingMethods;
    return this.teachingMethods.filter((t) => t.name.toLowerCase().includes(q) || t.key.toLowerCase().includes(q));
  }

  get filteredBooks(): Book[] {
    const q = this.searchBookQuery.trim().toLowerCase();
    if (!q) return this.books;
    return this.books.filter((b) => b.title.toLowerCase().includes(q) || (b.author ?? '').toLowerCase().includes(q));
  }

  get filteredObj(): CurriculumObjective[] {
    const q = this.searchObjQuery.trim().toLowerCase();
    if (!q) return this.objectives;
    return this.objectives.filter((o) => o.title.toLowerCase().includes(q) || o.key.toLowerCase().includes(q));
  }

  setTab(tab: typeof this.activeTab): void {
    this.activeTab = tab;
    if (tab === 'subjectAreas' && this.subjectAreas.length === 0) this.loadSa();
    if (tab === 'teachingMethods' && this.teachingMethods.length === 0) this.loadTm();
    if (tab === 'books') { this.loadBooks(); if (this.subjectAreas.length === 0) this.loadSa(); }
    if (tab === 'objectives') { this.loadObj(); if (this.subjectAreas.length === 0) this.loadSa(); }
  }

  /* ─── Subject Areas ─── */

  loadSa(): void {
    this.loadingSa = true;
    this.api.getSubjectAreas().pipe(finalize(() => (this.loadingSa = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.subjectAreas = items; this.cdr.markForCheck(); },
      error: () => { this.setError('دریافت حوزه‌های درسی با خطا مواجه شد.'); this.cdr.markForCheck(); },
    });
  }

  startCreateSa(): void {
    this.saEditMode = false;
    this.selectedSaId = null;
    this.saForm.reset({ key: '', name: '', description: '', sortOrder: 0 });
  }

  selectSa(item: SubjectArea): void {
    this.selectedSaId = item.id;
    this.saEditMode = true;
    this.saForm.setValue({ key: item.key, name: item.name, description: item.description ?? '', sortOrder: item.sortOrder });
  }

  saveSa(): void {
    if (this.saForm.invalid) return;
    const raw = this.saForm.getRawValue();
    this.savingSa = true;
    const request$ = this.saEditMode && this.selectedSaId !== null
      ? this.api.updateSubjectArea(this.selectedSaId, raw)
      : this.api.createSubjectArea(raw);
    request$.pipe(finalize(() => (this.savingSa = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('حوزه درسی ذخیره شد.'); this.loadSa(); },
      error: () => { this.setError('ذخیره حوزه درسی با خطا مواجه شد.'); },
    });
  }

  deleteSa(id: number): void {
    if (this.savingSa) return;
    this.savingSa = true;
    this.api.deleteSubjectArea(id).pipe(finalize(() => (this.savingSa = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('حوزه درسی حذف شد.'); if (this.selectedSaId === id) this.startCreateSa(); this.loadSa(); },
      error: () => { this.setError('حذف حوزه درسی با خطا مواجه شد.'); },
    });
  }

  /* ─── Teaching Methods ─── */

  loadTm(): void {
    this.loadingTm = true;
    this.api.getTeachingMethods().pipe(finalize(() => (this.loadingTm = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.teachingMethods = items; this.cdr.markForCheck(); },
      error: () => { this.setError('دریافت روش‌های تدریس با خطا مواجه شد.'); this.cdr.markForCheck(); },
    });
  }

  startCreateTm(): void {
    this.tmEditMode = false;
    this.selectedTmId = null;
    this.tmForm.reset({ key: '', name: '', description: '', sortOrder: 0 });
  }

  selectTm(item: TeachingMethod): void {
    this.selectedTmId = item.id;
    this.tmEditMode = true;
    this.tmForm.setValue({ key: item.key, name: item.name, description: item.description ?? '', sortOrder: item.sortOrder });
  }

  saveTm(): void {
    if (this.tmForm.invalid) return;
    const raw = this.tmForm.getRawValue();
    this.savingTm = true;
    const request$ = this.tmEditMode && this.selectedTmId !== null
      ? this.api.updateTeachingMethod(this.selectedTmId, raw)
      : this.api.createTeachingMethod(raw);
    request$.pipe(finalize(() => (this.savingTm = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('روش تدریس ذخیره شد.'); this.loadTm(); },
      error: () => { this.setError('ذخیره روش تدریس با خطا مواجه شد.'); },
    });
  }

  deleteTm(id: number): void {
    if (this.savingTm) return;
    this.savingTm = true;
    this.api.deleteTeachingMethod(id).pipe(finalize(() => (this.savingTm = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('روش تدریس حذف شد.'); if (this.selectedTmId === id) this.startCreateTm(); this.loadTm(); },
      error: () => { this.setError('حذف روش تدریس با خطا مواجه شد.'); },
    });
  }

  /* ─── Books ─── */

  loadBooks(): void {
    this.loadingBooks = true;
    this.api.getBooks().pipe(finalize(() => (this.loadingBooks = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.books = items; this.cdr.markForCheck(); },
      error: () => { this.setError('دریافت کتاب‌ها با خطا مواجه شد.'); this.cdr.markForCheck(); },
    });
  }

  startCreateBook(): void {
    this.bookEditMode = false;
    this.selectedBookId = null;
    this.bookForm.reset({ key: '', title: '', author: '', subjectAreaId: 0, level: '', publisher: '', pages: 0 });
  }

  selectBook(item: Book): void {
    this.selectedBookId = item.id;
    this.bookEditMode = true;
    this.bookForm.setValue({
      key: item.key, title: item.title, author: item.author ?? '',
      subjectAreaId: item.subjectAreaId, level: item.level ?? '',
      publisher: item.publisher ?? '', pages: item.pages ?? 0,
    });
  }

  saveBook(): void {
    if (this.bookForm.invalid) return;
    const raw = this.bookForm.getRawValue();
    this.savingBook = true;
    const request$ = this.bookEditMode && this.selectedBookId !== null
      ? this.api.updateBook(this.selectedBookId, raw)
      : this.api.createBook(raw);
    request$.pipe(finalize(() => (this.savingBook = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('کتاب ذخیره شد.'); this.loadBooks(); },
      error: () => { this.setError('ذخیره کتاب با خطا مواجه شد.'); },
    });
  }

  deleteBook(id: number): void {
    if (this.savingBook) return;
    this.savingBook = true;
    this.api.deleteBook(id).pipe(finalize(() => (this.savingBook = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('کتاب حذف شد.'); if (this.selectedBookId === id) this.startCreateBook(); this.loadBooks(); },
      error: () => { this.setError('حذف کتاب با خطا مواجه شد.'); },
    });
  }

  /* ─── Objectives ─── */

  loadObj(): void {
    this.loadingObj = true;
    this.api.getObjectives().pipe(finalize(() => (this.loadingObj = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => { this.objectives = items; this.cdr.markForCheck(); },
      error: () => { this.setError('دریافت اهداف آموزشی با خطا مواجه شد.'); this.cdr.markForCheck(); },
    });
  }

  startCreateObj(): void {
    this.objEditMode = false;
    this.selectedObjId = null;
    this.objForm.reset({ key: '', title: '', description: '', subjectAreaId: 0, parentObjectiveId: 0, sortOrder: 0, level: 'beginner' });
  }

  selectObj(item: CurriculumObjective): void {
    this.selectedObjId = item.id;
    this.objEditMode = true;
    this.objForm.setValue({
      key: item.key, title: item.title, description: item.description ?? '',
      subjectAreaId: item.subjectAreaId, parentObjectiveId: item.parentObjectiveId ?? 0,
      sortOrder: item.sortOrder, level: item.level,
    });
  }

  saveObj(): void {
    if (this.objForm.invalid) return;
    const raw = this.objForm.getRawValue();
    this.savingObj = true;
    const request$ = this.objEditMode && this.selectedObjId !== null
      ? this.api.updateObjective(this.selectedObjId, raw)
      : this.api.createObjective(raw);
    request$.pipe(finalize(() => (this.savingObj = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('هدف آموزشی ذخیره شد.'); this.loadObj(); },
      error: () => { this.setError('ذخیره هدف آموزشی با خطا مواجه شد.'); },
    });
  }

  deleteObj(id: number): void {
    if (this.savingObj) return;
    this.savingObj = true;
    this.api.deleteObjective(id).pipe(finalize(() => (this.savingObj = false)), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.setSuccess('هدف آموزشی حذف شد.'); if (this.selectedObjId === id) this.startCreateObj(); this.loadObj(); },
      error: () => { this.setError('حذف هدف آموزشی با خطا مواجه شد.'); },
    });
  }

  /* ─── Shared ─── */

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
    this.cdr.markForCheck();
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
    this.cdr.markForCheck();
  }
}
