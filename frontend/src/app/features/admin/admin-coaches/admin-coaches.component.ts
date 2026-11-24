import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, forkJoin } from 'rxjs';
import {
  Branch,
  Coach,
  CoachFileDto,
  Course,
  CreateCoachPayload,
  TrainingSampleDto,
  TrainingSummaryDto,
} from '../../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../../core/services/lesson-planner-api.token';
import { NotificationService } from '../../../core/services/notification.service';
import { AiService } from '../../../core/services/ai.service';
import { AuthService } from '../../../core/services/auth.service';
import { resolveApiBaseUrl, resolveMediaUrl } from '../../../core/services/api-url.util';

type SortKey = 'name' | 'username' | 'specialization' | 'courses' | 'branch' | 'status';

interface AiChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-admin-coaches',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <section class="card" aria-labelledby="admin-coaches-title">
      <header class="section-header">
        <h2 id="admin-coaches-title" class="section-title">
          مدیریت مربیان
          <span class="count-badge">{{ coaches.length }}</span>
        </h2>
        <button type="button" class="btn btn-secondary" (click)="openTrainingModal()">آموزش مدل گفتار</button>
        <button type="button" class="btn" (click)="openCoachModal()">مربی جدید</button>
      </header>

      <div class="coaches-toolbar">
        <div class="trainee-search">
          <input
            type="text"
            [(ngModel)]="searchCoachQuery"
            (ngModelChange)="page = 1"
            placeholder="جستجوی مربی (نام، نام کاربری، تخصص)..."
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <label class="filter-field">
            <span class="filter-label">وضعیت</span>
            <select class="filter-select" [ngModel]="filterStatus" (ngModelChange)="onFilterChange()">
              <option value="">همه</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </label>
          <label class="filter-field">
            <span class="filter-label">شعبه</span>
            <select class="filter-select" [ngModel]="filterBranchId" (ngModelChange)="onFilterChange()">
              <option [ngValue]="0">همه</option>
              @for (branch of branches; track branch.id) {
                <option [ngValue]="branch.id">{{ branch.name }}</option>
              }
            </select>
          </label>
        </div>
      </div>

      @if (loadingCoaches) {
        <p class="muted">در حال دریافت لیست مربیان...</p>
      } @else if (coaches.length === 0) {
        <p class="muted">هیچ مربی ثبت نشده است.</p>
      } @else if (filteredCoaches.length === 0) {
        <p class="muted">مربی مطابق با فیلترهای انتخابی یافت نشد.</p>
      } @else {
        @if (selectedIds.size > 0) {
          <div class="bulk-toolbar">
            <span class="bulk-toolbar__count">انتخاب‌شده: {{ selectedIds.size }}</span>
            <button type="button" class="btn btn-danger btn-sm" (click)="showBulkConfirm = true">حذف انتخاب‌شده ({{ selectedIds.size }})</button>
            <button type="button" class="btn btn-secondary btn-sm" (click)="clearSelection()">انصراف</button>
          </div>
        }
        <div class="table-responsive">
          <table class="data-table coach-table">
            <thead>
              <tr>
                <th class="bulk-select-cell">
                  <input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll()" aria-label="انتخاب همه" />
                </th>
                @for (col of sortableColumns; track col.key) {
                  <th (click)="toggleSort(col.key)" class="sortable" [class.sortable--active]="sortKey === col.key">
                    {{ col.label }}
                    <span class="sort-indicator" *ngIf="sortKey === col.key">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                }
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              @for (coach of paginatedCoaches; track coach.id) {
                <tr [class.bulk-selected]="isSelected(coach.id)">
                  <td class="bulk-select-cell" (click)="$event.stopPropagation()">
                    <input type="checkbox" [checked]="isSelected(coach.id)" (change)="toggleRowSelection(coach.id)" aria-label="انتخاب ردیف" />
                  </td>
                  <td class="coach-name-cell">
                    <strong>{{ coach.firstName }} {{ coach.lastName }}</strong>
                  </td>
                  <td>{{ coach.username }}</td>
                  <td>{{ coach.specialization || '—' }}</td>
                  <td>
                    @if (coach.assignedCourseIds.length > 0) {
                      <span class="course-count-badge" [title]="courseTitlesFor(coach)">{{ coach.assignedCourseIds.length }} دوره</span>
                    } @else {
                      <span class="muted">—</span>
                    }
                  </td>
                  <td>{{ branchName(coach.branchId) }}</td>
                  <td>
                    <span class="status-chip" [class.status-chip--active]="coach.status === 'active'" [class.status-chip--inactive]="coach.status !== 'active'">
                      {{ coach.status === 'active' ? 'فعال' : 'غیرفعال' }}
                    </span>
                  </td>
                   <td>
                     <div class="action-buttons">
                       <button type="button" class="icon-btn icon-btn--files" (click)="openFilesModal(coach)" title="فایل‌ها">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                           <polyline points="14 2 14 8 20 8"/>
                         </svg>
                       </button>
                       <button type="button" class="icon-btn icon-btn--ai" (click)="openAiModal(coach)" title="دستیار هوش مصنوعی">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                           <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/>
                           <line x1="9" y1="21" x2="15" y2="21"/>
                         </svg>
                       </button>
                       <button type="button" class="icon-btn icon-btn--edit" (click)="openCoachModal(coach)" title="ویرایش">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button type="button" class="icon-btn icon-btn--delete" (click)="askDeleteCoach(coach)" title="حذف">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="pagination-bar">
          <span class="pagination-info">
            نمایش {{ paginationStart }} تا {{ paginationEnd }} از {{ filteredCoaches.length }} مربی
          </span>
          <div class="pagination-controls">
            <button type="button" class="btn btn-secondary btn-sm" [disabled]="page <= 1" (click)="goToPage(page - 1)">قبلی</button>
            <span class="pagination-page">صفحه {{ page }} از {{ totalPages }}</span>
            <button type="button" class="btn btn-secondary btn-sm" [disabled]="page >= totalPages" (click)="goToPage(page + 1)">بعدی</button>
          </div>
        </div>
      }
    </section>

    @if (showBulkConfirm) {
      <div class="modal-overlay" (click)="showBulkConfirm = false">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>تأیید حذف گروهی</h3>
            <button type="button" class="modal-close" (click)="showBulkConfirm = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p>آیا از حذف {{ selectedIds.size }} مربی انتخاب‌شده اطمینان دارید؟</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="showBulkConfirm = false">انصراف</button>
            <button type="button" class="btn btn-danger" [disabled]="bulkDeleting" (click)="executeBulkDelete()">
              {{ bulkDeleting ? 'در حال حذف...' : 'حذف' }}
            </button>
          </div>
        </div>
      </div>
    }

    @if (confirmDeleteCoach) {
      <div class="modal-overlay" (click)="cancelDeleteCoach()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>تأیید حذف مربی</h3>
            <button type="button" class="modal-close" (click)="cancelDeleteCoach()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p>آیا از حذف مربی «{{ confirmDeleteCoach.firstName }} {{ confirmDeleteCoach.lastName }}» اطمینان دارید؟ این عملیات بازگشت‌پذیر نیست.</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelDeleteCoach()">انصراف</button>
            <button type="button" class="btn btn-danger" [disabled]="deletingSingle" (click)="confirmDelete()">
              {{ deletingSingle ? 'در حال حذف...' : 'حذف' }}
            </button>
          </div>
        </div>
      </div>
    }

    @if (showCoachModal) {
      <div class="modal-overlay" (click)="closeCoachModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ coachEditMode ? 'ویرایش مربی' : 'مربی جدید' }}</h3>
            <button type="button" class="modal-close" (click)="closeCoachModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="coachForm" class="modal-body" (ngSubmit)="saveCoach()">
            <div class="form-grid">
              <label class="form-field">
                <span class="form-label">کد ملی</span>
                <input #coachNc type="text" formControlName="nationalCode" placeholder="مثال: 1234567890" class="form-input" (input)="onNationalCodeInput(coachNc.value)" />
                @if (!coachEditMode) {
                  <small class="form-hint">نام کاربری و رمز عبور به‌طور خودکار کد ملی قرار می‌گیرد</small>
                }
              </label>
              <label class="form-field">
                <span class="form-label">نام کاربری *</span>
                <input type="text" formControlName="username" placeholder="مثال: ali.ahmadi" class="form-input" [readonly]="!coachEditMode" />
              </label>
              <label class="form-field">
                <span class="form-label">{{ coachEditMode ? 'رمز عبور (خالی = بدون تغییر)' : 'رمز عبور *' }}</span>
                <input type="password" formControlName="password" [placeholder]="coachEditMode ? 'خالی بگذارید = بدون تغییر' : 'حداقل ۶ کاراکتر'" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">نام *</span>
                <input type="text" formControlName="firstName" placeholder="مثال: علی" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">نام خانوادگی *</span>
                <input type="text" formControlName="lastName" placeholder="مثال: احمدی" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">ایمیل *</span>
                <input type="email" formControlName="email" placeholder="مثال: ali@example.com" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">شماره موبایل *</span>
                <input type="text" formControlName="phoneNumber" placeholder="09123456789" class="form-input" />
              </label>
              <label class="form-field">
                <span class="form-label">شعبه</span>
                <select formControlName="branchId" class="form-select">
                  <option [ngValue]="null">بدون شعبه</option>
                  @for (branch of branches; track branch.id) {
                    <option [ngValue]="branch.id">{{ branch.name }}</option>
                  }
                </select>
              </label>
              <label class="form-field form-field--full">
                <span class="form-label">تخصص</span>
                <div class="voice-input-wrap">
                  <input type="text" formControlName="specialization" placeholder="مثال: ریاضیات، علوم قرآنی" class="form-input" />
                  <button
                    type="button"
                    class="mic-btn"
                    [class.mic-btn--recording]="recordingTarget === 'specialization'"
                    [disabled]="recordingTarget !== null && recordingTarget !== 'specialization'"
                    (click)="toggleVoice('specialization')"
                    title="تایپ صوتی"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </button>
                </div>
              </label>
              <div class="form-field form-field--full">
                <span class="form-label">دوره‌های تحت پوشش</span>
                @if (courses.length === 0) {
                  <p class="muted course-empty">هنوز دوره‌ای تعریف نشده است.</p>
                } @else {
                  <div class="course-picker">
                    @for (course of courses; track course.id) {
                      <label class="course-picker__item">
                        <input type="checkbox" [checked]="isCourseSelected(course.id)" (change)="toggleCourse(course.id)" />
                        <span class="course-picker__title">{{ course.title }}</span>
                        @if (course.courseCode) {
                          <span class="course-picker__code">{{ course.courseCode }}</span>
                        }
                      </label>
                    }
                  </div>
                }
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeCoachModal()">انصراف</button>
              @if (coachEditMode && selectedCoachId !== null) {
                <button type="button" class="btn btn-danger" [disabled]="savingCoach" (click)="askDeleteCoachById(selectedCoachId!)">حذف مربی</button>
              }
              <button type="submit" class="btn" [disabled]="coachForm.invalid || savingCoach">
                {{ savingCoach ? 'در حال ذخیره...' : coachEditMode ? 'ذخیره تغییرات' : 'ایجاد مربی' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (showFilesModal && filesCoach) {
      <div class="modal-overlay" (click)="closeFilesModal()">
        <div class="modal-content modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>فایل‌های «{{ filesCoach.firstName }} {{ filesCoach.lastName }}»</h3>
            <button type="button" class="modal-close" (click)="closeFilesModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="file-upload-row">
              <input
                type="text"
                [ngModel]="fileTitle"
                (ngModelChange)="fileTitle = $event"
                placeholder="عنوان فایل (اختیاری)"
                class="form-input file-title-input"
              />
              <input
                type="file"
                class="file-file-input"
                [accept]="acceptedFileTypes"
                (change)="onFilePicked($event)"
              />
              <button type="button" class="btn btn-sm" [disabled]="uploadingFile || pendingFile === null" (click)="uploadPendingFile()">
                {{ uploadingFile ? 'در حال بارگذاری...' : 'بارگذاری فایل' }}
              </button>
            </div>

            @if (transcriptFor) {
              <div class="transcript-box">
                <div class="transcript-box__header">
                  <span>متن استخراج‌شده از «{{ transcriptFor.title }}»</span>
                  <div class="transcript-box__actions">
                    <button type="button" class="btn btn-sm" [disabled]="savingTranscript" (click)="saveTranscriptAsFile()">
                      {{ savingTranscript ? 'در حال ذخیره...' : 'ذخیره به‌عنوان فایل متن' }}
                    </button>
                    <button type="button" class="modal-close" (click)="transcriptFor = null">بستن</button>
                  </div>
                </div>
                <textarea
                  [ngModel]="transcriptText"
                  (ngModelChange)="transcriptText = $event"
                  class="transcript-textarea"
                  rows="6"
                ></textarea>
              </div>
            }

            @if (loadingFiles) {
              <p class="muted">در حال دریافت فایل‌ها...</p>
            } @else if (coachFiles.length === 0) {
              <p class="muted">هنوز فایلی برای این مربی بارگذاری نشده است.</p>
            } @else {
              <div class="file-list">
                @for (f of coachFiles; track f.id) {
                  <div class="file-item">
                    <span class="file-kind-chip" [class]="fileKindClass(f.kind)">{{ fileKindLabel(f.kind) }}</span>
                    <div class="file-item__info">
                      <a class="file-item__title" [href]="fileUrl(f)" target="_blank" rel="noopener">{{ f.title }}</a>
                      <span class="file-item__meta">{{ f.fileName }} • {{ formatSize(f.sizeBytes) }}</span>
                    </div>
                    <div class="file-item__actions">
                      @if (f.kind === 'audio') {
                        <button type="button" class="icon-btn icon-btn--play" [disabled]="transcribingFileId === f.id" (click)="transcribeAudioFile(f)" title="تبدیل به متن">
                          @if (transcribingFileId === f.id) {
                            <span class="spinner"></span>
                          } @else {
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            </svg>
                          }
                        </button>
                      }
                      <button type="button" class="icon-btn icon-btn--delete" [disabled]="deletingFileId === f.id" (click)="deleteFile(f)" title="حذف فایل">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }

    @if (showAiModal && aiCoach) {
      <div class="modal-overlay" (click)="closeAiModal()">
        <div class="modal-content modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>دستیار هوش مصنوعی — مربی: {{ aiCoach.firstName }} {{ aiCoach.lastName }}</h3>
            <div class="ai-header-actions">
              <button type="button" class="btn btn-sm" [disabled]="aiBusy || aiChat.length === 0" (click)="runAiEvaluation()">
                ارزیابی هوشمند مربی
              </button>
              <button type="button" class="modal-close" (click)="closeAiModal()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="modal-body ai-body">
            <div class="ai-chat" #aiChatBox>
              @if (aiChat.length === 0) {
                <div class="ai-empty">
                  <p>با این دستیار درباره عملکرد، برنامه‌ریزی و بهبود «{{ aiCoach.firstName }} {{ aiCoach.lastName }}» گفت‌وگو کنید.</p>
                  <p class="ai-empty__hint">با دکمه «ارزیابی هوشمند مربی» می‌توانید ارزیابی کامل خودکار دریافت کنید.</p>
                </div>
              }
              @for (msg of aiChat; track $index) {
                <div class="ai-msg" [class]="msg.role === 'user' ? 'ai-msg--user' : 'ai-msg--assistant'">
                  <div class="ai-msg__role">{{ msg.role === 'user' ? 'شما' : 'دستیار' }}</div>
                  <div class="ai-msg__content">{{ msg.content }}</div>
                </div>
              }
              @if (aiBusy) {
                <div class="ai-msg ai-msg--assistant">
                  <div class="ai-msg__content"><span class="spinner"></span> در حال فکر کردن...</div>
                </div>
              }
            </div>
            <div class="ai-input-row">
              <textarea
                [ngModel]="aiInput"
                (ngModelChange)="aiInput = $event"
                (keydown.enter.shiftKey)="$event.preventDefault(); sendAiMessage()"
                class="ai-input"
                rows="2"
                placeholder="سوال خود را بنویسید... (Enter برای ارسال)"
                [disabled]="aiBusy"
              ></textarea>
              <button type="button" class="btn" [disabled]="aiBusy || aiInput.trim() === ''" (click)="sendAiMessage()">ارسال</button>
            </div>
          </div>
        </div>
      </div>
    }

    @if (showTrainingModal) {
      <div class="modal-overlay" (click)="closeTrainingModal()">
        <div class="modal-content modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>آموزش مدل گفتار فارسی (Whisper)</h3>
            <button type="button" class="modal-close" (click)="closeTrainingModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="muted training-hint">
              با بارگذاری فایل‌های صوتی کوتاه و متن دقیقِ آن‌ها، دیتاست آموزش مدل تبدیل گفتار به متن فارسی ساخته می‌شود. هرچه نمونه‌های بیشتری ثبت شود، مدل فارسی دقیق‌تر آموزش داده خواهد شد.
            </p>

            @if (trainingSummary) {
              <div class="training-summary">
                <div class="training-summary__stat">
                  <span class="training-summary__value">{{ trainingSummary.count }}</span>
                  <span class="training-summary__label">مجموع نمونه‌ها</span>
                </div>
                <div class="training-summary__stat">
                  <span class="training-summary__value">{{ formatDuration(trainingSummary.totalDurationSec) }}</span>
                  <span class="training-summary__label">مجموع مدت</span>
                </div>
                @for (c of trainingSummary.byCoach; track c.coach) {
                  <div class="training-summary__stat">
                    <span class="training-summary__value">{{ c.samples }}</span>
                    <span class="training-summary__label">{{ c.coach || 'بدون نام' }}</span>
                  </div>
                }
              </div>
            }

            <div class="training-form">
              <div class="training-form__row">
                <label class="filter-field">
                  <span class="filter-label">مربی (اختیاری)</span>
                  <select class="filter-select" [ngModel]="trainCoachId" (ngModelChange)="trainCoachId = $event">
                    <option [ngValue]="null">— بدون انتخاب —</option>
                    @for (coach of coaches; track coach.id) {
                      <option [ngValue]="coach.id">{{ coach.firstName }} {{ coach.lastName }}</option>
                    }
                  </select>
                </label>
                <label class="filter-field">
                  <span class="filter-label">فایل صوتی (کوتاه)</span>
                  <input
                    type="file"
                    class="file-file-input"
                    accept=".wav,.mp3,.m4a,.ogg,.flac,.webm"
                    (change)="onTrainAudioPicked($event)"
                  />
                </label>
              </div>
              <textarea
                [ngModel]="trainText"
                (ngModelChange)="trainText = $event"
                class="training-textarea"
                rows="3"
                placeholder="متن دقیقِ گفتاری که در فایل صوتی بیان شده را اینجا بنویسید..."
              ></textarea>
              <div class="training-form__actions">
                <button
                  type="button"
                  class="btn"
                  [disabled]="savingTrainingSample || trainAudioFile === null || trainText.trim() === ''"
                  (click)="addTrainingSample()"
                >
                  {{ savingTrainingSample ? 'در حال ثبت...' : 'ثبت نمونه آموزش' }}
                </button>
                @if (trainAudioFile) {
                  <span class="muted">فایل انتخاب‌شده: {{ trainAudioFile.name }}</span>
                }
              </div>
            </div>

            <h4 class="training-list-title">نمونه‌های ثبت‌شده</h4>
            @if (loadingTraining) {
              <p class="muted">در حال دریافت نمونه‌ها...</p>
            } @else if (trainingSamples.length === 0) {
              <p class="muted">هنوز نمونه آموزشی ثبت نشده است.</p>
            } @else {
              <div class="file-list">
                @for (s of trainingSamples; track s.id) {
                  <div class="file-item">
                    <span class="file-kind-chip file-kind-chip--audio">آموزشی</span>
                    <div class="file-item__info">
                      <span class="file-item__title">{{ s.text }}</span>
                      <span class="file-item__meta">
                        {{ s.coachName || 'بدون نام' }}
                        @if (s.durationSec !== null) { • {{ formatDuration(s.durationSec) }} }
                      </span>
                    </div>
                    <div class="file-item__actions">
                      <button type="button" class="icon-btn icon-btn--delete" [disabled]="deletingTrainingId === s.id" (click)="deleteTrainingSample(s)" title="حذف نمونه">
                        @if (deletingTrainingId === s.id) {
                          <span class="spinner"></span>
                        } @else {
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        }
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: contents; }
    .coaches-toolbar { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: flex-end; margin-bottom: 1rem; }
    .trainee-search { flex: 1 1 260px; }
    .filter-group { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .filter-field { display: flex; flex-direction: column; gap: 0.25rem; }
    .filter-label { font-size: 0.75rem; color: var(--lp-muted, #6b7280); }
    .filter-select { padding: 0.4rem 0.6rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; background: var(--lp-surface, #fff); font-size: 0.875rem; min-width: 140px; }
    .sortable { cursor: pointer; user-select: none; white-space: nowrap; }
    .sortable:hover { color: var(--lp-primary, #1a73e8); }
    .sortable--active { color: var(--lp-primary, #1a73e8); font-weight: 700; }
    .sort-indicator { font-size: 0.65rem; margin-inline-start: 0.25rem; }
    .bulk-select-cell { width: 3rem; text-align: center; vertical-align: middle; }
    .bulk-select-cell input[type="checkbox"] { cursor: pointer; accent-color: var(--lp-primary, #1a73e8); width: 1rem; height: 1rem; margin: 0; }
    .data-table tbody tr { cursor: pointer; }
    .data-table tbody tr.bulk-selected { background: var(--lp-primary-light, #e3f2fd); border-inline-start: 3px solid var(--lp-primary, #1a73e8); }
    .bulk-toolbar { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; margin-bottom: 0.75rem; background: var(--lp-primary-light, #e3f2fd); border-radius: 8px; border: 1px solid var(--lp-primary, #1a73e8); }
    .bulk-toolbar__count { font-size: 0.875rem; font-weight: 600; color: var(--lp-primary, #1a73e8); }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
    .modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; padding: 1rem 1.25rem; border-top: 1px solid var(--lp-border, #eaecf0); }
    .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; padding: 0; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--lp-border, #eaecf0); }
    .modal-header h3 { margin: 0; font-size: 1rem; }
    .modal-body { padding: 1.25rem; }
    .modal-sm { max-width: 400px; }
    .pagination-bar { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; padding: 0.75rem 0 0; }
    .pagination-info { font-size: 0.8125rem; color: var(--lp-muted, #6b7280); }
    .pagination-controls { display: flex; align-items: center; gap: 0.75rem; }
    .pagination-page { font-size: 0.8125rem; }
    .form-select { padding: 0.5rem 0.6rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; background: var(--lp-surface, #fff); font-size: 0.875rem; width: 100%; }
    .course-picker { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.375rem; max-height: 180px; overflow-y: auto; padding: 0.5rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; background: var(--lp-surface, #fff); }
    .course-picker__item { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; }
    .course-picker__item:hover { background: var(--lp-primary-light, #e3f2fd); }
    .course-picker__item input[type="checkbox"] { accent-color: var(--lp-primary, #1a73e8); width: 1rem; height: 1rem; margin: 0; flex-shrink: 0; }
    .course-picker__title { flex: 1; }
    .course-picker__code { font-size: 0.7rem; color: var(--lp-muted, #6b7280); }
    .course-empty { margin: 0.25rem 0; }

    .voice-input-wrap { display: flex; gap: 0.5rem; align-items: center; }
    .voice-input-wrap .form-input { flex: 1; }
    .mic-btn { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; background: var(--lp-surface, #fff); color: var(--lp-muted, #6b7280); cursor: pointer; flex-shrink: 0; }
    .mic-btn:hover:not(:disabled) { color: var(--lp-primary, #1a73e8); border-color: var(--lp-primary, #1a73e8); }
    .mic-btn--recording { background: var(--lp-danger, #d93025); border-color: var(--lp-danger, #d93025); color: #fff; animation: mic-pulse 1s infinite; }
    @keyframes mic-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    .icon-btn--files { color: var(--lp-muted, #6b7280); }
    .icon-btn--ai { color: var(--lp-primary, #1a73e8); }
    .modal-lg { max-width: 720px; width: 95%; }
    .file-upload-row { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--lp-border, #eaecf0); }
    .file-title-input { flex: 1 1 180px; }
    .file-file-input { flex: 1 1 220px; font-size: 0.8125rem; }
    .file-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 340px; overflow-y: auto; }
    .file-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; }
    .file-kind-chip { font-size: 0.6875rem; padding: 0.125rem 0.5rem; border-radius: 999px; white-space: nowrap; }
    .file-kind-chip--audio { background: #e8f0fe; color: #1a73e8; }
    .file-kind-chip--image { background: #e6f4ea; color: #137333; }
    .file-kind-chip--video { background: #fce8e6; color: #c5221f; }
    .file-kind-chip--document { background: #fef7e0; color: #b06000; }
    .file-kind-chip--text { background: #f1f3f4; color: #3c4043; }
    .file-kind-chip--mindmap { background: #f3e8fd; color: #7627bb; }
    .file-kind-chip--other { background: #f1f3f4; color: #6b7280; }
    .file-item__info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .file-item__title { font-size: 0.875rem; font-weight: 600; color: var(--lp-primary, #1a73e8); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .file-item__meta { font-size: 0.7rem; color: var(--lp-muted, #6b7280); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .file-item__actions { display: flex; gap: 0.375rem; flex-shrink: 0; }
    .icon-btn--play { color: var(--lp-primary, #1a73e8); }
    .transcript-box { margin-bottom: 1rem; padding: 0.75rem; border: 1px solid var(--lp-primary, #1a73e8); border-radius: 8px; background: var(--lp-primary-light, #e3f2fd); }
    .transcript-box__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.8125rem; font-weight: 600; }
    .transcript-box__actions { display: flex; gap: 0.5rem; align-items: center; }
    .transcript-textarea { width: 100%; padding: 0.5rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; font-size: 0.8125rem; resize: vertical; font-family: inherit; }
    .spinner { display: inline-block; width: 1rem; height: 1rem; border: 2px solid var(--lp-border, #eaecf0); border-top-color: var(--lp-primary, #1a73e8); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .ai-header-actions { display: flex; align-items: center; gap: 0.75rem; }
    .ai-body { display: flex; flex-direction: column; gap: 0.75rem; }
    .ai-chat { flex: 1; overflow-y: auto; max-height: 380px; display: flex; flex-direction: column; gap: 0.625rem; padding: 0.25rem; }
    .ai-empty { text-align: center; color: var(--lp-muted, #6b7280); padding: 2rem 1rem; font-size: 0.875rem; }
    .ai-empty__hint { font-size: 0.75rem; }
    .ai-msg { max-width: 85%; padding: 0.625rem 0.875rem; border-radius: 12px; font-size: 0.875rem; line-height: 1.7; }
    .ai-msg--user { align-self: flex-start; background: var(--lp-primary, #1a73e8); color: #fff; border-start-start-radius: 4px; }
    .ai-msg--assistant { align-self: flex-end; background: var(--lp-surface-alt, #f1f3f4); color: var(--lp-text, #1f2937); border-start-end-radius: 4px; white-space: pre-wrap; }
    .ai-msg__role { font-size: 0.65rem; opacity: 0.75; margin-bottom: 0.25rem; font-weight: 700; }
    .ai-input-row { display: flex; gap: 0.5rem; align-items: flex-end; }
    .ai-input { flex: 1; padding: 0.5rem 0.625rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; font-size: 0.875rem; resize: none; font-family: inherit; }

    /* ===== Model training ===== */
    .training-hint { margin: 0 0 0.75rem; font-size: 0.8125rem; line-height: 1.7; }
    .training-summary { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; }
    .training-summary__stat { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; padding: 0.6rem 1rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 10px; background: var(--lp-surface, #fff); min-width: 96px; }
    .training-summary__value { font-size: 1.125rem; font-weight: 700; color: var(--lp-primary, #1a73e8); }
    .training-summary__label { font-size: 0.6875rem; color: var(--lp-muted, #6b7280); text-align: center; }
    .training-form { border: 1px solid var(--lp-border, #eaecf0); border-radius: 10px; padding: 0.75rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .training-form__row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .training-textarea { width: 100%; padding: 0.5rem 0.625rem; border: 1px solid var(--lp-border, #eaecf0); border-radius: 8px; font-size: 0.875rem; resize: vertical; font-family: inherit; }
    .training-form__actions { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
    .training-list-title { margin: 0 0 0.5rem; font-size: 0.9375rem; }
  `],
})
export class AdminCoachesComponent {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ai = inject(AiService);
  private readonly auth = inject(AuthService);

  private speechRecognition: any = null;

  // ===== Files modal =====
  readonly acceptedFileTypes =
    '.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.webm,.m4a,.ogg,.mp4,.pdf,.doc,.docx,.txt,.md,.json,.mm,.map';
  showFilesModal = false;
  filesCoach: Coach | null = null;
  coachFiles: CoachFileDto[] = [];
  loadingFiles = false;
  fileTitle = '';
  pendingFile: File | null = null;
  uploadingFile = false;
  deletingFileId: number | null = null;
  transcribingFileId: number | null = null;
  transcriptFor: CoachFileDto | null = null;
  transcriptText = '';
  savingTranscript = false;

  // ===== Voice typing =====
  recordingTarget: 'specialization' | null = null;

  // ===== AI modal =====
  showAiModal = false;
  aiCoach: Coach | null = null;
  aiChat: AiChatMsg[] = [];
  aiInput = '';
  aiBusy = false;
  private aiConversationId: number | null = null;

  // ===== Model training (Whisper fine-tuning corpus) =====
  showTrainingModal = false;
  loadingTraining = false;
  trainingSamples: TrainingSampleDto[] = [];
  trainingSummary: TrainingSummaryDto | null = null;
  trainAudioFile: File | null = null;
  trainText = '';
  trainCoachId: number | null = null;
  savingTrainingSample = false;
  deletingTrainingId: number | null = null;

  coaches: Coach[] = [];
  courses: Course[] = [];
  branches: Branch[] = [];
  loadingCoaches = false;
  savingCoach = false;
  showCoachModal = false;
  coachEditMode = false;
  selectedCoachId: number | null = null;
  searchCoachQuery = '';
  filterStatus = '';
  filterBranchId = 0;

  // pagination + sorting
  page = 1;
  readonly pageSize = 10;
  sortKey: SortKey = 'name';
  sortDir: 'asc' | 'desc' = 'asc';

  readonly sortableColumns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'نام و نام خانوادگی' },
    { key: 'username', label: 'نام کاربری' },
    { key: 'specialization', label: 'تخصص' },
    { key: 'courses', label: 'دوره‌ها' },
    { key: 'branch', label: 'شعبه' },
  ];

  coachForm: FormGroup = this.fb.nonNullable.group({
    nationalCode: [''],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    specialization: [''],
    branchId: [null as number | null],
    assignedCourseIds: [[] as number[]],
  });

  errorMessage = '';
  successMessage = '';
  selectedIds = new Set<number>();
  bulkDeleting = false;
  showBulkConfirm = false;
  confirmDeleteCoach: Coach | null = null;
  deletingSingle = false;

  get filteredCoaches(): Coach[] {
    const q = this.searchCoachQuery.trim().toLowerCase();
    return this.coaches.filter((c) => {
      const matchesSearch =
        !q ||
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        (c.specialization ?? '').toLowerCase().includes(q);
      const matchesStatus = !this.filterStatus || c.status === this.filterStatus;
      const matchesBranch =
        this.filterBranchId === 0 ||
        (c.branchId ?? 0) === this.filterBranchId;
      return matchesSearch && matchesStatus && matchesBranch;
    });
  }

  get sortedCoaches(): Coach[] {
    const list = [...this.filteredCoaches];
    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      switch (this.sortKey) {
        case 'username':
          return a.username.localeCompare(b.username, 'fa') * dir;
        case 'specialization':
          return (a.specialization ?? '').localeCompare(b.specialization ?? '', 'fa') * dir;
        case 'courses':
          return (a.assignedCourseIds.length - b.assignedCourseIds.length) * dir;
        case 'branch':
          return (this.branchName(a.branchId) ?? '').localeCompare(this.branchName(b.branchId) ?? '', 'fa') * dir;
        case 'name':
        default:
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, 'fa') * dir;
      }
    });
    return list;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCoaches.length / this.pageSize));
  }

  get paginatedCoaches(): Coach[] {
    const start = (this.page - 1) * this.pageSize;
    return this.sortedCoaches.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    return this.filteredCoaches.length === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.page * this.pageSize, this.filteredCoaches.length);
  }

  ngOnInit(): void {
    this.loadCoaches();
    this.loadCourses();
    this.loadBranches();
  }

  loadCoaches(): void {
    this.loadingCoaches = true;
    this.api
      .getCoaches()
      .pipe(finalize(() => (this.loadingCoaches = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (coaches) => {
          this.coaches = coaches;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت لیست مربیان با خطا مواجه شد.');
          this.cdr.markForCheck();
        },
      });
  }

  loadCourses(): void {
    this.api
      .getCourses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (courses) => {
          this.courses = courses;
          this.cdr.markForCheck();
        },
        error: () => {
          this.courses = [];
        },
      });
  }

  loadBranches(): void {
    this.api
      .getBranches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (branches) => {
          this.branches = branches;
          this.cdr.markForCheck();
        },
        error: () => {
          this.branches = [];
        },
      });
  }

  branchName(branchId?: number): string {
    if (!branchId) return '—';
    const b = this.branches.find((x) => x.id === branchId);
    return b ? b.name : '—';
  }

  courseTitlesFor(coach: Coach): string {
    return coach.assignedCourseIds
      .map((id) => this.courses.find((c) => c.id === id)?.title ?? `دوره ${id}`)
      .join('، ');
  }

  onFilterChange(): void {
    this.page = 1;
    this.cdr.markForCheck();
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.cdr.markForCheck();
  }

  goToPage(p: number): void {
    this.page = Math.min(Math.max(1, p), this.totalPages);
    this.cdr.markForCheck();
  }

  openCoachModal(coach?: Coach): void {
    if (coach) {
      this.coachEditMode = true;
      this.selectedCoachId = coach.id;
      this.coachForm.reset({
        nationalCode: coach.nationalCode ?? '',
        username: coach.username,
        password: '',
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email,
        phoneNumber: coach.phoneNumber,
        specialization: coach.specialization,
        branchId: coach.branchId ?? null,
        assignedCourseIds: [...coach.assignedCourseIds],
      });
      this.coachForm.get('password')?.clearValidators();
      this.coachForm.get('password')?.updateValueAndValidity();
    } else {
      this.coachEditMode = false;
      this.selectedCoachId = null;
      this.coachForm.reset({
        nationalCode: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        branchId: null,
        assignedCourseIds: [],
      });
      this.coachForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.coachForm.get('password')?.updateValueAndValidity();
    }
    this.showCoachModal = true;
  }

  onNationalCodeInput(value: string): void {
    if (this.coachEditMode) return;
    const code = value.trim();
    this.coachForm.patchValue(
      { username: code, password: code },
      { emitEvent: false },
    );
  }

  isCourseSelected(courseId: number): boolean {
    const value: number[] = this.coachForm.get('assignedCourseIds')?.value ?? [];
    return value.includes(courseId);
  }

  toggleCourse(courseId: number): void {
    const ctrl = this.coachForm.get('assignedCourseIds');
    if (!ctrl) return;
    const current: number[] = ctrl.value ?? [];
    const next = current.includes(courseId)
      ? current.filter((x) => x !== courseId)
      : [...current, courseId];
    ctrl.setValue(next, { emitEvent: false });
    this.cdr.markForCheck();
  }

  closeCoachModal(): void {
    this.showCoachModal = false;
    this.coachEditMode = false;
    this.selectedCoachId = null;
  }

  saveCoach(): void {
    if (this.coachForm.invalid) return;
    const raw = this.coachForm.getRawValue();
    const payload: CreateCoachPayload = {
      username: raw.username.trim(),
      password: raw.password.trim(),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim(),
      phoneNumber: raw.phoneNumber.trim(),
      specialization: raw.specialization.trim(),
      nationalCode: raw.nationalCode.trim(),
      branchId: raw.branchId ?? undefined,
      assignedCourseIds: [...raw.assignedCourseIds],
    };

    const isEdit = this.coachEditMode && this.selectedCoachId !== null;
    const coachId = this.selectedCoachId;
    this.closeCoachModal();
    this.savingCoach = true;
    const request$ = isEdit
      ? this.api.updateCoach(coachId!, payload)
      : this.api.createCoach(payload);

    request$
      .pipe(finalize(() => (this.savingCoach = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (coach) => {
          if (isEdit) {
            const idx = this.coaches.findIndex((c) => c.id === coach.id);
            if (idx >= 0) {
              this.coaches[idx] = coach;
            } else {
              this.coaches.push(coach);
            }
          } else {
            this.coaches.push(coach);
          }
          this.setSuccess('اطلاعات مربی ذخیره شد.');
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ذخیره اطلاعات مربی با خطا مواجه شد.');
        },
      });
  }

  askDeleteCoach(coach: Coach): void {
    this.confirmDeleteCoach = coach;
    this.cdr.markForCheck();
  }

  askDeleteCoachById(coachId: number): void {
    const coach = this.coaches.find((c) => c.id === coachId);
    if (coach) this.askDeleteCoach(coach);
  }

  cancelDeleteCoach(): void {
    this.confirmDeleteCoach = null;
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    const coach = this.confirmDeleteCoach;
    if (!coach) return;
    this.confirmDeleteCoach = null;
    this.cdr.markForCheck();
    this.deleteCoach(coach.id);
  }

  deleteCoach(coachId: number): void {
    this.deletingSingle = true;
    this.api
      .deleteCoach(coachId)
      .pipe(finalize(() => (this.deletingSingle = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.setSuccess(response?.message ?? 'مربی با موفقیت حذف شد.');
          this.closeCoachModal();
          this.loadCoaches();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف مربی با خطا مواجه شد.');
        },
      });
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.notify.show(message, 'success');
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.notify.show(message, 'error');
  }

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  toggleRowSelection(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.cdr.markForCheck();
  }

  isAllSelected(): boolean {
    const filtered = this.filteredCoaches;
    return filtered.length > 0 && filtered.every(c => this.selectedIds.has(c.id));
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selectedIds.clear();
    } else {
      for (const c of this.filteredCoaches) {
        this.selectedIds.add(c.id);
      }
    }
    this.cdr.markForCheck();
  }

  clearSelection(): void {
    this.selectedIds.clear();
    this.cdr.markForCheck();
  }

  executeBulkDelete(): void {
    this.bulkDeleting = true;
    const ids = Array.from(this.selectedIds);
    forkJoin(ids.map(id => this.api.deleteCoach(id)))
      .pipe(
        finalize(() => { this.bulkDeleting = false; this.cdr.markForCheck(); }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.selectedIds.clear();
          this.showBulkConfirm = false;
          this.setSuccess(`${ids.length} مربی با موفقیت حذف شد.`);
          this.loadCoaches();
        },
        error: () => {
          this.selectedIds.clear();
          this.showBulkConfirm = false;
          this.setError('حذف یک یا چند مورد با خطا مواجه شد.');
          this.loadCoaches();
        },
      });
  }

  // ===== Files =====
  openFilesModal(coach: Coach): void {
    this.filesCoach = coach;
    this.showFilesModal = true;
    this.fileTitle = '';
    this.pendingFile = null;
    this.coachFiles = [];
    this.transcriptFor = null;
    this.loadCoachFiles(coach.id);
  }

  closeFilesModal(): void {
    this.showFilesModal = false;
    this.filesCoach = null;
    this.cdr.markForCheck();
  }

  loadCoachFiles(coachId: number): void {
    this.loadingFiles = true;
    this.api
      .getCoachFiles(coachId)
      .pipe(finalize(() => (this.loadingFiles = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (files) => {
          this.coachFiles = files;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.setError(this.extractError(error) ?? 'دریافت فایل‌ها با خطا مواجه شد.');
        },
      });
  }

  onFilePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.pendingFile = file;
    if (file && !this.fileTitle) this.fileTitle = file.name;
    input.value = '';
    this.cdr.markForCheck();
  }

  uploadPendingFile(): void {
    const coach = this.filesCoach;
    const file = this.pendingFile;
    if (!coach || !file) return;
    this.uploadingFile = true;
    this.api
      .uploadCoachFile(coach.id, this.fileTitle.trim() || file.name, file)
      .pipe(finalize(() => (this.uploadingFile = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.fileTitle = '';
          this.pendingFile = null;
          this.setSuccess('فایل با موفقیت بارگذاری شد.');
          this.loadCoachFiles(coach.id);
        },
        error: (error) => {
          this.setError(this.extractError(error) ?? 'بارگذاری فایل با خطا مواجه شد.');
        },
      });
  }

  deleteFile(file: CoachFileDto): void {
    const coach = this.filesCoach;
    if (!coach) return;
    this.deletingFileId = file.id;
    this.api
      .deleteCoachFile(coach.id, file.id)
      .pipe(finalize(() => (this.deletingFileId = null)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('فایل حذف شد.');
          this.loadCoachFiles(coach.id);
        },
        error: (error) => {
          this.setError(this.extractError(error) ?? 'حذف فایل با خطا مواجه شد.');
        },
      });
  }

  fileKindLabel(kind: string): string {
    switch (kind) {
      case 'audio': return 'صوتی';
      case 'image': return 'تصویر';
      case 'video': return 'ویدیو';
      case 'document': return 'سند';
      case 'text': return 'متن';
      case 'mindmap': return 'نقشه ذهنی';
      default: return 'سایر';
    }
  }

  fileKindClass(kind: string): string {
    const map: Record<string, string> = {
      audio: 'file-kind-chip file-kind-chip--audio',
      image: 'file-kind-chip file-kind-chip--image',
      video: 'file-kind-chip file-kind-chip--video',
      document: 'file-kind-chip file-kind-chip--document',
      text: 'file-kind-chip file-kind-chip--text',
      mindmap: 'file-kind-chip file-kind-chip--mindmap',
    };
    return map[kind] ?? 'file-kind-chip file-kind-chip--other';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  fileUrl(f: CoachFileDto): string {
    return resolveMediaUrl(f.storedPath) ?? f.storedPath;
  }

  // ===== Model training (Whisper fine-tuning corpus) =====
  openTrainingModal(): void {
    this.showTrainingModal = true;
    this.trainAudioFile = null;
    this.trainText = '';
    this.trainCoachId = null;
    this.trainingSamples = [];
    this.trainingSummary = null;
    this.loadTrainingData();
  }

  closeTrainingModal(): void {
    this.showTrainingModal = false;
    this.cdr.markForCheck();
  }

  loadTrainingData(): void {
    this.loadingTraining = true;
    this.api
      .getTrainingSamples()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (samples) => {
          this.trainingSamples = samples;
          this.loadingTraining = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingTraining = false;
          this.setError(this.extractError(error) ?? 'دریافت نمونه‌های آموزشی با خطا مواجه شد.');
        },
      });
    this.api
      .getTrainingSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          this.trainingSummary = summary;
          this.cdr.markForCheck();
        },
        error: () => {
          this.trainingSummary = null;
          this.cdr.markForCheck();
        },
      });
  }

  onTrainAudioPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.trainAudioFile = input.files?.[0] ?? null;
    input.value = '';
    this.cdr.markForCheck();
  }

  addTrainingSample(): void {
    const file = this.trainAudioFile;
    const text = this.trainText.trim();
    if (!file || !text) return;
    this.savingTrainingSample = true;
    this.api
      .addTrainingSample(file, text, this.trainCoachId ?? undefined)
      .pipe(finalize(() => (this.savingTrainingSample = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.trainAudioFile = null;
          this.trainText = '';
          this.setSuccess('نمونه آموزشی با موفقیت ثبت شد.');
          this.loadTrainingData();
        },
        error: (error) => {
          this.setError(this.extractError(error) ?? 'ثبت نمونه آموزشی با خطا مواجه شد.');
        },
      });
  }

  deleteTrainingSample(sample: TrainingSampleDto): void {
    this.deletingTrainingId = sample.id;
    this.api
      .deleteTrainingSample(sample.id)
      .pipe(finalize(() => (this.deletingTrainingId = null)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setSuccess('نمونه آموزشی حذف شد.');
          this.loadTrainingData();
        },
        error: (error) => {
          this.setError(this.extractError(error) ?? 'حذف نمونه آموزشی با خطا مواجه شد.');
        },
      });
  }

  formatDuration(totalSec: number): string {
    if (!totalSec || totalSec <= 0) return '0 دقیقه';
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    if (h > 0) return `${h} ساعته و ${m} دقیقه`;
    if (m > 0) return `${m} دقیقه`;
    return `${totalSec} ثانیه`;
  }

  // ===== Audio to text (Whisper) =====
  async transcribeAudioFile(file: CoachFileDto): Promise<void> {
    const url = this.fileUrl(file);
    this.transcribingFileId = file.id;
    this.cdr.markForCheck();
    try {
      const resp = await fetch(url, { headers: this.authHeaders() });
      if (!resp.ok) throw new Error('download failed');
      const blob = await resp.blob();
      const fd = new FormData();
      fd.append('file', blob, file.fileName);
      const up = await fetch(`${this.apiBase()}/api/ai/transcribe`, {
        method: 'POST',
        headers: this.authHeaders(),
        body: fd,
      });
      const data = up.ok ? await up.json() : { message: await this.readErrorMessage(up) };
      if (!up.ok) throw new Error(data?.message ?? 'transcribe failed');
      this.transcriptFor = file;
      this.transcriptText = data.text ?? '';
      this.cdr.markForCheck();
    } catch (e: any) {
      this.setError(this.extractError(e) ?? 'تبدیل صوت به متن با خطا مواجه شد.');
    } finally {
      this.transcribingFileId = null;
      this.cdr.markForCheck();
    }
  }

  saveTranscriptAsFile(): void {
    const coach = this.filesCoach;
    const target = this.transcriptFor;
    if (!coach || !target) return;
    const blob = new Blob([this.transcriptText], { type: 'text/plain;charset=utf-8' });
    const file = new File([blob], `${target.title}.txt`, { type: 'text/plain' });
    this.savingTranscript = true;
    this.api
      .uploadCoachFile(coach.id, `متن «${target.title}»`, file)
      .pipe(finalize(() => (this.savingTranscript = false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.transcriptFor = null;
          this.transcriptText = '';
          this.setSuccess('متن به‌عنوان فایل ذخیره شد.');
          this.loadCoachFiles(coach.id);
        },
        error: (error) => {
          this.setError(this.extractError(error) ?? 'ذخیره متن با خطا مواجه شد.');
        },
      });
  }

  // ===== Voice typing (Web Speech API) =====
  toggleVoice(target: 'specialization'): void {
    if (this.recordingTarget === target) {
      this.stopVoice();
      return;
    }
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      this.setError('مرورگر شما از تشخیص صوتی پشتیبانی نمی‌کند. از Chrome استفاده کنید.');
      return;
    }
    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch { /* noop */ }
    }
    const rec = new SR();
    rec.lang = 'fa-IR';
    rec.interimResults = false;
    rec.continuous = true;
    const ctrl = this.coachForm.get('specialization');
    rec.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      const current = ctrl?.value ?? '';
      const sep = current && !current.endsWith(' ') && !current.endsWith('،') ? ' ' : '';
      ctrl?.setValue(current + sep + text.trim(), { emitEvent: false });
      this.cdr.markForCheck();
    };
    rec.onend = () => {
      this.recordingTarget = null;
      this.cdr.markForCheck();
    };
    rec.onerror = () => {
      this.recordingTarget = null;
      this.notify.show('تشخیص صوتی با خطا مواجه شد.', 'error');
      this.cdr.markForCheck();
    };
    this.speechRecognition = rec;
    this.recordingTarget = target;
    try {
      rec.start();
    } catch {
      this.recordingTarget = null;
    }
    this.cdr.markForCheck();
  }

  stopVoice(): void {
    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch { /* noop */ }
      this.speechRecognition = null;
    }
    this.recordingTarget = null;
    this.cdr.markForCheck();
  }

  // ===== AI assistant =====
  openAiModal(coach: Coach): void {
    this.aiCoach = coach;
    this.aiChat = [];
    this.aiInput = '';
    this.aiConversationId = null;
    this.showAiModal = true;
    this.cdr.markForCheck();
  }

  closeAiModal(): void {
    this.showAiModal = false;
    this.aiCoach = null;
    this.cdr.markForCheck();
  }

  aiContextPrompt(): string {
    const c = this.aiCoach!;
    const courseTitles = c.assignedCourseIds
      .map((id) => this.courses.find((x) => x.id === id)?.title ?? `دوره ${id}`)
      .join('، ');
    return `اطلاعات مربی:\n` +
      `نام: ${c.firstName} ${c.lastName}\n` +
      `تخصص: ${c.specialization || '—'}\n` +
      `شعبه: ${this.branchName(c.branchId)}\n` +
      `وضعیت: ${c.status === 'active' ? 'فعال' : 'غیرفعال'}\n` +
      `دوره‌های تحت پوشش: ${courseTitles || '—'}`;
  }

  sendAiMessage(): void {
    const msg = this.aiInput.trim();
    if (!msg || this.aiBusy || !this.aiCoach) return;
    this.aiInput = '';
    this.aiChat.push({ role: 'user', content: msg });
    this.aiBusy = true;
    this.cdr.markForCheck();

    const isFirst = this.aiChat.length === 1;
    const content = isFirst ? `${this.aiContextPrompt()}\n\n${msg}` : msg;
    const request = {
      conversationId: this.aiConversationId ?? undefined,
      message: content,
    };

    this.ai
      .chat(request as any)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.aiConversationId = res.conversationId;
          this.aiChat.push({ role: 'assistant', content: res.response });
          this.aiBusy = false;
          this.cdr.markForCheck();
          this.scrollToAiBottom();
        },
        error: (error) => {
          this.aiChat.push({
            role: 'assistant',
            content: `خطا در دریافت پاسخ: ${this.extractError(error) ?? 'در دسترس نیست'}. برای فعال‌سازی، کلید هوش مصنوعی (AI:ApiKey) را در بکند تنظیم کنید.`,
          });
          this.aiBusy = false;
          this.cdr.markForCheck();
          this.scrollToAiBottom();
        },
      });
  }

  runAiEvaluation(): void {
    if (!this.aiCoach) return;
    const prompt =
      'بر اساس اطلاعات ارائه‌شده، یک ارزیابی جامع و حرفه‌ای از این مربی ارائه بده.\n' +
      'شامل: ۱) نقاط قوت، ۲) نقاط ضعف و قابل بهبود، ۳) پیشنهادهای عملی برای ارتقاء کیفیت تدریس، ۴) پیشنهاد مسیر رشد شغلی. ' +
      'پاسخ را ساختاریافته و به فارسی روان بنویس.';
    this.aiInput = prompt;
    this.sendAiMessage();
  }

  private scrollToAiBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.ai-chat');
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  // ===== Helpers =====
  private authHeaders(): Record<string, string> {
    const token = this.auth.getAccessToken() ?? '';
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private apiBase(): string {
    return resolveApiBaseUrl();
  }

  private async readErrorMessage(resp: Response): Promise<string> {
    try {
      const text = await resp.text();
      const parsed = JSON.parse(text);
      return parsed?.message ?? parsed?.Message ?? text;
    } catch {
      return '';
    }
  }

  private extractError(error: any): string | null {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (typeof error?.error === 'string') return error.error;
    return error?.error?.message ?? error?.message ?? null;
  }
}
