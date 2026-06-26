import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import type {
  Assignment,
  AssignmentAttachment,
  AssignmentSubmission,
  Course,
  CurrentUser,
  StudentAssignmentGateState
} from '../../core/models/lesson-planner.models';
import { resolveMediaUrl } from '../../core/services/api-url.util';
import { AuthService } from '../../core/services/auth.service';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';

type TimelineStatus = 'future' | 'today' | 'past';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="student-page">
      <header class="site-header">
        <div class="brand-wrap">
          @if (!logoHidden) {
            <img
              src="assets/nehzat.png"
              alt="لوگو سایت"
              class="site-logo"
              (error)="logoHidden = true"
            />
          }
          <div>
            <h1>پنل متربی</h1>
            <p class="muted">خوش آمدید {{ displayName }}</p>
          </div>
        </div>

        <div class="user-menu">
          <button type="button" class="menu-trigger" (click)="toggleUserMenu()">
            <i class="bi bi-person-circle"></i>
            <span>{{ currentUser?.username }}</span>
          </button>
          @if (isUserMenuOpen) {
            <div class="menu-dropdown">
              <button type="button" (click)="showUserModal()">نمایش جزئیات کاربر</button>
              <button type="button" (click)="logout()">خروج</button>
            </div>
          }
        </div>
      </header>

      @if (errorMessage) {
        <p class="lp-error">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p class="lp-success">{{ successMessage }}</p>
      }

      <div class="dashboard-container">
        <aside class="sidebar">
          <h3>دروس فعال</h3>
          @if (loadingCourses) {
            <p class="muted">در حال دریافت دروس...</p>
          } @else if (courses.length === 0) {
            <p class="muted">درسی برای شما فعال نشده است.</p>
          } @else {
            <div class="lesson-menu">
              @for (course of courses; track course.id) {
                <button
                  type="button"
                  class="lesson-btn"
                  [class.active]="selectedCourse?.id === course.id"
                  (click)="selectCourse(course)"
                >
                  <i class="bi bi-book"></i> {{ course.title }}
                </button>
              }
            </div>
          }
        </aside>

        <section class="main-content">
          <h2>داشبورد پیشرفت دروس</h2>

          @if (selectedCourse) {
            <div class="lesson-info">
              <h3>{{ selectedCourse.title }}</h3>
              <p><strong>استاد:</strong> {{ selectedCourse.instructor }}</p>
              <p><strong>درباره درس:</strong> {{ selectedCourse.description }}</p>
            </div>
          }

          <div class="timeline-container">
            <h4>تایم‌لاین تکالیف</h4>
            @if (loadingAssignments) {
              <p class="muted">در حال دریافت تکالیف...</p>
            } @else if (!selectedCourse || assignments.length === 0) {
              <p class="muted">برای این درس هنوز تکلیفی ثبت نشده است.</p>
            } @else {
              <div class="timeline-horizontal">
                @for (assignment of assignments; track assignment.id; let i = $index) {
                  <div class="timeline-item">
                    @if (i > 0) {
                      <div class="timeline-bar"></div>
                    }
                    <button
                      type="button"
                      class="timeline-dot"
                      [class.gray]="getAssignmentStatus(assignment) === 'future'"
                      [class.blue]="getAssignmentStatus(assignment) === 'today'"
                      [class.green]="getAssignmentStatus(assignment) === 'past'"
                      [title]="assignment.title"
                      (click)="showAssignmentDetails(assignment)"
                    >
                      <i class="bi" [class.bi-file-earmark-audio]="hasAudioAttachment(assignment)"></i>
                      <i class="bi bi-book" [class.hidden]="hasAudioAttachment(assignment)"></i>
                    </button>
                    <div class="timeline-label">روز {{ i + 1 }}</div>
                  </div>
                }
              </div>
            }
          </div>

          <div class="chart-container">
            <h4>نمودار پیشرفت</h4>
            <div class="chart-placeholder">
              {{ chartSummary }}
            </div>
          </div>

          <section class="virtual-training-box">
            <h4>💠💠 مراحل آموزش مجازی 💠💠</h4>
            <p class="muted">
              در روند آموزش مجازی، مجموعه‌ای از مراحل به‌صورت گام‌به‌گام اجرا می‌شود تا یادگیری دقیق، مستمر و
              قابل ارزیابی باشد. والدین محترم توجه داشته باشند هر مرحله با هدف رفع اشکالات و رسیدن متربی به
              فهم کامل محتوا طراحی شده است.
            </p>

            <div class="training-step">
              <h5>💠 مرحله اول: خوانش متن</h5>
              <p>
                👈 در این مرحله، متربی متن درس را با دقت (با صوت ارسالی) می‌خواند تا اشکالات احتمالی در خوانش
                مشخص شود. هر کلمه‌ای که در خواندن یا معنای آن مشکل دارد را با مداد مشخص می‌کند.
              </p>
            </div>

            <div class="training-step">
              <h5>💠 مرحله دوم: رفع اشکال کلمات مشکل</h5>
              <p>
                👈 پس از گوش‌دادن به صوت درس و خواندن متن و علامت‌گذاری کلمات دشوار، فایل صوتی شامل کلماتی که
                معمولاً دشوار هستند ارسال می‌شود تا بخش عمده‌ی مشکلات خوانش برطرف شود.
              </p>
            </div>

            <div class="training-step">
              <h5>💠 مرحله سوم: ارسال اشکالات باقی‌مانده</h5>
              <p>
                👈 متربی کلمات یا قسمت‌هایی را که هنوز برایش دشوار است برای مربّی یا کاربر مشخص‌شده ارسال
                می‌کند. سپس اشکالات تجمیع شده و صوت رفع‌اشکال جدید برای متربی فرستاده می‌شود.
              </p>
            </div>

            <div class="training-step">
              <h5>💠 مرحله چهارم: توضیح محتوایی</h5>
              <p>
                👈 در این مرحله هدف، فهم کلی و محتوایی درس است. محدوده مطالعاتی مشخص می‌شود و متربی باید توضیحات
                را گوش دهد.
              </p>
              <p class="training-warning">
                ⚠️ اگر ابهامی داشت، باید آن را با خط خوش (یا ترجیحاً تایپ شده) مکتوب و برای مربّی ارسال کند.
              </p>
            </div>

            <div class="training-step">
              <h5>💠 مرحله پنجم: پاسخ‌گویی به اشکالات محتوایی</h5>
              <p>👈 مربّی به پرسش‌ها و ابهامات محتوایی دریافت شده پاسخ می‌دهد.</p>
            </div>

            <div class="training-step">
              <h5>💠 مرحله ششم: بازخورد متنی، صوتی و احیانا ویدیویی</h5>
              <p>
                👈 پس از دریافت پاسخ‌ها، متربی باید میزان فهم خود را به‌صورت متن، صوت یا در صورت امکان کلیپ
                ویدیویی ارائه کند و مطالب را خودش توضیح دهد.
              </p>
            </div>

            <div class="training-step">
              <h5>💠 مرحله هفتم: طراحی سؤال و مسئله</h5>
              <p>
                👈 بر اساس موضوع مطالعه‌شده، مجموعه‌ای از پرسش‌ها و مسائل برای متربی ارسال می‌شود. متربی باید به
                این موارد پاسخ دهد و نتیجه را برای مربّی ارسال کند.
              </p>
            </div>

            <div class="training-step">
              <h5>💠 مرحله هشتم: ارزیابی نهایی و تأیید یادگیری</h5>
              <p>
                پس از بررسی پاسخ‌ها، اگر یادگیری کامل باشد، اجازه‌ی ورود به مبحث بعدی داده می‌شود.
              </p>
              <p class="training-note">
                ✅ نظم، ارسال به‌موقع تکالیف و همراهی مستمر نقش تعیین‌کننده در کیفیت این فرایند دارد.
              </p>
              <p class="training-note">
                ✅ متناسب با محتوای حلقه‌ها، تغییراتی در شیوه تعامل طبیعی است.
              </p>
            </div>

            <div class="training-footer">
              <h5>نکات پایانی</h5>
              <ul>
                <li>رعایت نظم و ارسال منظم تکالیف، اثر مستقیم بر نتیجه آموزشی دارد.</li>
                <li>پیشنهادها یا تجربه‌های سودمند در زمینه آموزش مجازی با استقبال دریافت می‌شود.</li>
                <li>
                  التماس دعا و آرزوی پیروزی جبهه حق بر باطل به برکت صلوات بر محمد و آل محمد.
                </li>
              </ul>

              <p class="audio-caption">صوت توضیحی مراحل آموزش مجازی — ۱۸ فروردین ۱۴۰۵</p>
              <a
                class="download-link"
                href="https://my.uupload.ir/dl/VXNJ7ayM"
                target="_blank"
                rel="noopener noreferrer"
              >
                👇👇👇 لینک دانلود 👇👇👇
              </a>
              <audio controls src="https://my.uupload.ir/dl/VXNJ7ayM"></audio>

              <div class="training-tags">
                <span>#آموزش_مجازی</span>
                <span>#مراحل_آموزش_مجازی</span>
                <span>#فرآیند</span>
                <span>#نهضت_تربیتی_حضرت_سیدالشهدا علیه‌السلام</span>
              </div>
            </div>
          </section>

          <div class="audio-recorder">
            <h4>ضبط صوت</h4>
            @if (selectedAssignment) {
              <p class="muted">تکلیف انتخاب‌شده: {{ selectedAssignment.title }}</p>
            } @else {
              <p class="muted">برای شروع ضبط، ابتدا یک تکلیف از تایم‌لاین انتخاب کنید.</p>
            }

            @if (selectedAssignment && primaryInstructionAudioUrl) {
              <p class="muted">
                وضعیت پیش‌نیاز گوش‌دادن:
                {{ assignmentProgress?.currentListenCount ?? 0 }} /
                {{ assignmentProgress?.requiredListenCount ?? 3 }}
              </p>
            }

            <div class="recorder-controls">
              <button
                type="button"
                class="record-btn"
                [class.recording]="isRecording"
                (click)="toggleRecording()"
                [disabled]="!selectedAssignment || (!isRecording && !isRecordingUnlocked)"
              >
                <i class="bi" [class.bi-mic]="!isRecording" [class.bi-stop-fill]="isRecording"></i>
              </button>
              @if (isRecording) {
                <span class="text-danger">در حال ضبط...</span>
              }
            </div>

            @if (selectedAssignment && !isRecordingUnlocked) {
              <p class="lp-error">برای شروع ضبط باید فایل راهنما را کامل گوش دهید تا قفل باز شود.</p>
            }

            @if (audioUrl) {
              <div class="audio-preview">
                <audio [src]="audioUrl" controls></audio>
                <button type="button" class="btn-primary" (click)="submitAudio()" [disabled]="isSubmitting">
                  {{ isSubmitting ? 'در حال ارسال...' : 'ارسال صوت' }}
                </button>
              </div>
            }
          </div>

          <div class="submissions-container">
            <div class="submissions-header">
              <h4>ارسال‌های من</h4>
              <button type="button" class="btn-primary" (click)="loadSubmissions()">بروزرسانی</button>
            </div>

            @if (loadingSubmissions) {
              <p class="muted">در حال بارگذاری ارسال‌ها...</p>
            } @else if (filteredSubmissions.length === 0) {
              <p class="muted">هنوز هیچ ارسالی ثبت نشده است.</p>
            } @else {
              <div class="submissions-grid">
                @for (submission of filteredSubmissions; track submission.id) {
                  <article class="submission-card">
                    <h6>{{ assignmentTitleById(submission.assignmentId) }}</h6>
                    <p class="muted">تاریخ: {{ submission.submissionDate }}</p>
                    <p class="muted">وضعیت: {{ submission.status }}</p>
                    <p class="muted">نمره روزانه: {{ submission.dailyScore ?? 0 }}</p>
                    @if (submission.notes) {
                      <p>{{ submission.notes }}</p>
                    }
                    @if (resolveAudioUrl(submission.audioFileUrl); as submissionAudioUrl) {
                      <button type="button" class="btn-secondary" (click)="playAudio(submissionAudioUrl)">
                        پخش صوت
                      </button>
                    }
                  </article>
                }
              </div>
            }
          </div>
        </section>
      </div>

      @if (isAssignmentModalOpen && selectedAssignment) {
        <div class="modal-backdrop" (click)="closeAssignmentModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <h5>جزئیات تکلیف</h5>
              <button type="button" class="btn-secondary" (click)="closeAssignmentModal()">بستن</button>
            </header>

            <div class="modal-body">
              <h5>{{ selectedAssignment.title }}</h5>
              <p><strong>تاریخ:</strong> {{ selectedAssignment.assignmentDate }}</p>
              <p><strong>توضیحات:</strong> {{ selectedAssignment.description }}</p>
              <p><strong>دستورالعمل:</strong> {{ selectedAssignment.instructions || '-' }}</p>

              @if (selectedAssignment.attachments?.length) {
                <div class="attachment-box">
                  <h6>فایل‌های ضمیمه:</h6>
                  <div class="attachment-list">
                    @for (attachment of selectedAssignment.attachments; track attachment.id) {
                      <a
                        [href]="resolveAttachmentUrl(attachment.url) || '#'"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="attachment-item"
                      >
                        <i class="bi" [class]="getAttachmentIcon(attachment.kind)"></i>
                        {{ attachment.title }}
                      </a>
                    }
                  </div>
                </div>
              }

              @if (primaryInstructionAudioUrl) {
                <div class="gate-box">
                  <h6>فایل راهنما (پیش‌نیاز ضبط)</h6>
                  <audio
                    #instructionAudio
                    controls
                    [src]="primaryInstructionAudioUrl"
                    (play)="onInstructionAudioPlay(instructionAudio)"
                    (timeupdate)="onInstructionAudioTimeUpdate(instructionAudio)"
                    (ended)="onInstructionAudioEnded(instructionAudio)"
                    (error)="onInstructionAudioError()"
                  ></audio>
                  <p class="muted">
                    گوش‌دادن کامل:
                    {{ assignmentProgress?.currentListenCount ?? 0 }}
                    /
                    {{ assignmentProgress?.requiredListenCount ?? 3 }}
                  </p>
                </div>
              }

              @if (assignmentProgress) {
                <div class="progress-box">
                  <p><strong>وضعیت:</strong> {{ assignmentProgress.hasSubmission ? 'تکمیل شده' : 'در انتظار تکمیل' }}</p>
                  <p><strong>نمره روزانه:</strong> {{ assignmentProgress.latestSubmission?.dailyScore ?? '-' }}</p>
                  <p><strong>نمره تجمعی:</strong> {{ assignmentProgress.latestSubmission?.cumulativeScore ?? '-' }}</p>
                  @if (assignmentProgress.latestSubmission?.feedback) {
                    <p><strong>بازخورد:</strong> {{ assignmentProgress.latestSubmission?.feedback }}</p>
                  }
                </div>
              }

              <button type="button" class="btn-primary" (click)="startRecordingForAssignment(selectedAssignment)">
                شروع ضبط صوت
              </button>
            </div>
          </div>
        </div>
      }

      @if (isUserModalOpen && currentUser) {
        <div class="modal-backdrop" (click)="hideUserModal()">
          <div class="modal-content user-modal" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <h5>اطلاعات کاربر</h5>
              <button type="button" class="btn-secondary" (click)="hideUserModal()">بستن</button>
            </header>
            <div class="modal-body user-grid">
              <p><strong>نام:</strong> {{ currentUser.studentInfo?.firstName ?? '-' }}</p>
              <p><strong>نام خانوادگی:</strong> {{ currentUser.studentInfo?.lastName ?? '-' }}</p>
              <p><strong>ایمیل:</strong> {{ currentUser.studentInfo?.email ?? '-' }}</p>
              <p><strong>شماره تماس:</strong> {{ currentUser.studentInfo?.phoneNumber ?? '-' }}</p>
              <p><strong>نام کاربری:</strong> {{ currentUser.username }}</p>
              <p><strong>نوع کاربر:</strong> {{ currentUser.userType === 'admin' ? 'مدیر' : 'متربی' }}</p>
            </div>
          </div>
        </div>
      }
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .student-page {
        direction: rtl;
        min-height: 100vh;
        padding: 1rem;
        display: grid;
        gap: 1rem;
      }
      .site-header {
        background: #fff;
        border: 1px solid var(--lp-border);
        border-radius: 14px;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }
      .brand-wrap {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .site-logo {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        object-fit: cover;
      }
      .brand-wrap h1 {
        margin: 0;
        font-size: 1.05rem;
      }
      .user-menu {
        position: relative;
      }
      .menu-trigger {
        border: 1px solid var(--lp-border);
        border-radius: 10px;
        background: #fff;
        padding: 0.45rem 0.6rem;
        display: flex;
        align-items: center;
        gap: 0.45rem;
        cursor: pointer;
      }
      .menu-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        min-width: 180px;
        background: #fff;
        border: 1px solid var(--lp-border);
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.14);
        padding: 0.25rem;
        display: grid;
        z-index: 5;
      }
      .menu-dropdown button {
        border: 0;
        background: transparent;
        padding: 0.5rem;
        text-align: right;
        border-radius: 8px;
        cursor: pointer;
      }
      .menu-dropdown button:hover {
        background: #f8fafc;
      }
      .dashboard-container {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 1rem;
      }
      .sidebar,
      .main-content {
        background: #fff;
        border: 1px solid var(--lp-border);
        border-radius: 14px;
        padding: 1rem;
      }
      .lesson-menu {
        display: grid;
        gap: 0.5rem;
      }
      .lesson-btn {
        border: 1px solid var(--lp-border);
        background: #fff;
        border-radius: 10px;
        padding: 0.55rem 0.65rem;
        text-align: right;
        cursor: pointer;
      }
      .lesson-btn.active {
        border-color: var(--lp-primary);
        background: #eff6ff;
      }
      .main-content h2 {
        margin: 0 0 1rem;
      }
      .lesson-info,
      .chart-container,
      .audio-recorder,
      .submissions-container,
      .timeline-container {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
      }
      .timeline-horizontal {
        display: flex;
        gap: 0.9rem;
        overflow-x: auto;
        padding-bottom: 0.3rem;
      }
      .timeline-item {
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }
      .timeline-bar {
        width: 24px;
        height: 3px;
        border-radius: 999px;
        background: #cbd5e1;
      }
      .timeline-dot {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
      }
      .timeline-dot.gray {
        background: #94a3b8;
      }
      .timeline-dot.blue {
        background: #2563eb;
      }
      .timeline-dot.green {
        background: #16a34a;
      }
      .timeline-label {
        text-align: center;
        font-size: 0.78rem;
        color: var(--lp-muted);
        margin-top: 0.35rem;
      }
      .hidden {
        display: none;
      }
      .chart-placeholder {
        border: 1px dashed #93c5fd;
        background: #eff6ff;
        border-radius: 10px;
        padding: 0.7rem;
        color: #1e3a8a;
      }
      .virtual-training-box {
        border: 1px solid #c7d2fe;
        border-radius: 12px;
        background: #f8faff;
        padding: 0.85rem;
        margin-bottom: 0.75rem;
        display: grid;
        gap: 0.7rem;
      }
      .virtual-training-box h4,
      .virtual-training-box h5 {
        margin: 0;
      }
      .training-step {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background: #fff;
        padding: 0.65rem;
        display: grid;
        gap: 0.35rem;
      }
      .training-step p {
        margin: 0;
        line-height: 1.75;
      }
      .training-warning {
        color: #9a3412;
      }
      .training-note {
        color: #166534;
      }
      .training-footer {
        border-top: 1px dashed #cbd5e1;
        padding-top: 0.7rem;
        display: grid;
        gap: 0.45rem;
      }
      .training-footer ul {
        margin: 0;
        padding-right: 1.2rem;
        display: grid;
        gap: 0.3rem;
      }
      .audio-caption {
        margin: 0;
        font-weight: 600;
      }
      .download-link {
        color: #1d4ed8;
        font-weight: 600;
        text-decoration: none;
        width: fit-content;
      }
      .download-link:hover {
        text-decoration: underline;
      }
      .training-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }
      .training-tags span {
        border: 1px solid #bfdbfe;
        border-radius: 999px;
        padding: 0.15rem 0.55rem;
        color: #1e40af;
        font-size: 0.8rem;
        background: #eff6ff;
      }
      .recorder-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .record-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 0;
        background: #ef4444;
        color: #fff;
        cursor: pointer;
      }
      .record-btn.recording {
        background: #0f172a;
      }
      .record-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .audio-preview {
        margin-top: 0.75rem;
        display: grid;
        gap: 0.55rem;
      }
      .submissions-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.6rem;
      }
      .submissions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.65rem;
      }
      .submission-card {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.7rem;
        display: grid;
        gap: 0.35rem;
      }
      .submission-card h6 {
        margin: 0;
      }
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 20;
        background: rgba(15, 23, 42, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
      }
      .modal-content {
        width: min(900px, 100%);
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 14px;
        border: 1px solid var(--lp-border);
        background: #fff;
        padding: 1rem;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.7rem;
      }
      .modal-header h5 {
        margin: 0;
      }
      .modal-body {
        display: grid;
        gap: 0.65rem;
      }
      .attachment-box,
      .gate-box,
      .progress-box {
        border: 1px solid var(--lp-border);
        border-radius: 10px;
        padding: 0.65rem;
      }
      .attachment-list {
        display: grid;
        gap: 0.45rem;
      }
      .attachment-item {
        text-decoration: none;
        color: #1e40af;
      }
      .attachment-item:hover {
        text-decoration: underline;
      }
      .user-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
      .muted {
        color: var(--lp-muted);
      }
      .text-danger {
        color: #dc2626;
      }
      audio {
        width: 100%;
      }
      @media (max-width: 920px) {
        .dashboard-container {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 640px) {
        .site-header {
          flex-direction: column;
          align-items: stretch;
        }
        .submissions-header {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);

  currentUser: CurrentUser | null = null;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  assignments: Assignment[] = [];
  submissions: AssignmentSubmission[] = [];
  selectedAssignment: Assignment | null = null;
  assignmentProgress: StudentAssignmentGateState | null = null;
  primaryInstructionAudioUrl: string | null = null;

  loadingCourses = false;
  loadingAssignments = false;
  loadingSubmissions = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  chartSummary = 'پس از انتخاب درس، وضعیت پیشرفت اینجا نمایش داده می‌شود.';

  isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private recordingChunks: Blob[] = [];
  private recordingStartedAt = 0;
  private recordingDurationSeconds = 0;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;

  logoHidden = false;
  isUserMenuOpen = false;
  isUserModalOpen = false;
  isAssignmentModalOpen = false;

  private listenSession = {
    active: false,
    lastTime: 0,
    listenedSeconds: 0,
    duration: 0
  };
  private listenRequestInFlight = false;
  private lastProgressRequestKey = '';

  get displayName(): string {
    const student = this.currentUser?.studentInfo;
    if (!student) {
      return this.currentUser?.username ?? 'متربی';
    }
    return `${student.firstName} ${student.lastName}`;
  }

  get filteredSubmissions(): AssignmentSubmission[] {
    if (!this.selectedCourse) {
      return this.submissions;
    }
    const assignmentIds = new Set(this.assignments.map((assignment) => assignment.id));
    return this.submissions.filter((submission) => assignmentIds.has(submission.assignmentId));
  }

  get isRecordingUnlocked(): boolean {
    if (!this.selectedAssignment) {
      return false;
    }
    if (!this.primaryInstructionAudioUrl) {
      return true;
    }
    return Boolean(this.assignmentProgress?.isRecordingUnlocked);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }
    if (this.currentUser.userType === 'admin') {
      void this.router.navigateByUrl('/admin');
      return;
    }
    if (this.getStudentId() === null) {
      this.errorMessage = 'شناسه متربی نامعتبر است. لطفا یک‌بار خروج و ورود مجدد انجام دهید.';
    }
    this.loadCourses();
    this.loadSubmissions();
  }

  ngOnDestroy(): void {
    this.stopStreamTracks();
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  showUserModal(): void {
    this.isUserMenuOpen = false;
    this.isUserModalOpen = true;
  }

  hideUserModal(): void {
    this.isUserModalOpen = false;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.api
      .getActiveCourses()
      .pipe(finalize(() => (this.loadingCourses = false)))
      .subscribe({
        next: (courses) => {
          this.courses = courses;
          if (courses.length > 0) {
            this.selectCourse(courses[0]);
          } else {
            this.selectedCourse = null;
            this.assignments = [];
            this.chartSummary = 'درسی برای نمایش نمودار وجود ندارد.';
          }
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'خطا در دریافت دروس فعال';
        }
      });
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
    this.selectedAssignment = null;
    this.assignmentProgress = null;
    this.primaryInstructionAudioUrl = null;
    this.audioBlob = null;
    this.audioUrl = null;
    this.isAssignmentModalOpen = false;
    this.loadAssignments(course.id);
    this.loadSubmissions();
  }

  loadAssignments(courseId: number): void {
    this.loadingAssignments = true;
    this.api
      .getCourseAssignments(courseId)
      .pipe(finalize(() => (this.loadingAssignments = false)))
      .subscribe({
        next: (assignments) => {
          this.assignments = [...assignments].sort((a, b) => a.assignmentDate.localeCompare(b.assignmentDate));
          this.updateChartSummary();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'خطا در دریافت تکالیف';
          this.assignments = [];
          this.updateChartSummary();
        }
      });
  }

  loadSubmissions(): void {
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    this.loadingSubmissions = true;
    this.api
      .getStudentSubmissions(studentId)
      .pipe(finalize(() => (this.loadingSubmissions = false)))
      .subscribe({
        next: (submissions) => {
          this.submissions = submissions;
          this.updateChartSummary();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'خطا در دریافت ارسال‌ها';
          this.submissions = [];
          this.updateChartSummary();
        }
      });
  }

  getAssignmentStatus(assignment: Assignment): TimelineStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const assignmentDate = new Date(assignment.assignmentDate);
    assignmentDate.setHours(0, 0, 0, 0);

    if (assignmentDate.getTime() > today.getTime()) {
      return 'future';
    }
    if (assignmentDate.getTime() === today.getTime()) {
      return 'today';
    }
    return 'past';
  }

  hasAudioAttachment(assignment: Assignment): boolean {
    return Boolean((assignment.attachments ?? []).some((attachment) => attachment.kind === 'audio'));
  }

  showAssignmentDetails(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.errorMessage = '';
    this.successMessage = '';
    this.resetRecordingPreview();
    this.listenSession = {
      active: false,
      lastTime: 0,
      listenedSeconds: 0,
      duration: 0
    };
    this.primaryInstructionAudioUrl = this.resolvePrimaryInstructionAudioUrl(assignment.attachments ?? []);
    this.isAssignmentModalOpen = true;
    this.loadAssignmentProgress(assignment.id);
  }

  closeAssignmentModal(): void {
    if (this.isRecording) {
      this.stopRecording();
    }
    this.isAssignmentModalOpen = false;
  }

  startRecordingForAssignment(assignment: Assignment): void {
    this.showAssignmentDetails(assignment);
    void this.startRecording();
  }

  async toggleRecording(): Promise<void> {
    if (this.isRecording) {
      this.stopRecording();
      return;
    }
    await this.startRecording();
  }

  async startRecording(): Promise<void> {
    if (this.isRecording || !this.selectedAssignment) {
      return;
    }
    if (!this.isRecordingUnlocked) {
      this.errorMessage = 'ضبط هنوز فعال نشده است. ابتدا فایل راهنما را کامل گوش دهید.';
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      this.errorMessage = 'مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.';
      return;
    }

    try {
      this.errorMessage = '';
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;
      this.recordingChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.recordingChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        if (!this.recordingChunks.length) {
          return;
        }
        this.audioBlob = new Blob(this.recordingChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
      };
      this.mediaRecorder.start();
      this.recordingStartedAt = Date.now();
      this.isRecording = true;
    } catch {
      this.errorMessage = 'دسترسی به میکروفون امکان‌پذیر نیست.';
      this.stopStreamTracks();
    }
  }

  stopRecording(): void {
    if (!this.isRecording) {
      return;
    }
    this.isRecording = false;
    this.recordingDurationSeconds = Math.max(1, Math.round((Date.now() - this.recordingStartedAt) / 1000));
    this.mediaRecorder?.stop();
    this.stopStreamTracks();
  }

  submitAudio(): void {
    if (!this.selectedAssignment || !this.audioBlob || this.isSubmitting) {
      return;
    }
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    if (!this.isRecordingUnlocked) {
      this.errorMessage = 'ضبط هنوز فعال نشده است.';
      return;
    }

    const audioFile = new File(
      [this.audioBlob],
      `submission-${this.selectedAssignment.id}-${Date.now()}.webm`,
      { type: this.audioBlob.type || 'audio/webm' }
    );
    const payload = new FormData();
    payload.append('audioFile', audioFile);
    payload.append('notes', 'ارسال از داشبورد متربی');
    payload.append('timeSpent', String(this.recordingDurationSeconds || 1));

    this.isSubmitting = true;
    this.api
      .submitAssignment(studentId, this.selectedAssignment.id, payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'فایل صوتی با موفقیت ارسال شد.';
          this.loadSubmissions();
          this.loadAssignmentProgress(this.selectedAssignment!.id);
          this.resetRecordingPreview();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'خطا در ارسال فایل صوتی';
        }
      });
  }

  playAudio(audioUrl: string): void {
    const resolved = resolveMediaUrl(audioUrl);
    if (!resolved) {
      return;
    }
    const audio = new Audio(resolved);
    void audio.play();
  }

  getAttachmentIcon(kind: string): string {
    switch (kind) {
      case 'audio':
        return 'bi-file-earmark-audio';
      case 'document':
        return 'bi-file-earmark-text';
      case 'image':
        return 'bi-file-earmark-image';
      default:
        return 'bi-file-earmark';
    }
  }

  assignmentTitleById(assignmentId: number): string {
    return this.assignments.find((assignment) => assignment.id === assignmentId)?.title ?? `تکلیف ${assignmentId}`;
  }

  resolveAudioUrl(url: string | null | undefined): string | null {
    return resolveMediaUrl(url);
  }

  resolveAttachmentUrl(url: string | null | undefined): string | null {
    return resolveMediaUrl(url);
  }

  onInstructionAudioPlay(audio: HTMLAudioElement): void {
    this.listenSession = {
      active: true,
      lastTime: audio.currentTime,
      listenedSeconds: 0,
      duration: audio.duration || 0
    };
  }

  onInstructionAudioTimeUpdate(audio: HTMLAudioElement): void {
    if (!this.listenSession.active) {
      return;
    }
    const delta = audio.currentTime - this.listenSession.lastTime;
    if (delta > 0 && delta <= 1.5) {
      this.listenSession.listenedSeconds += delta;
    }
    this.listenSession.lastTime = audio.currentTime;
    if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
      this.listenSession.duration = audio.duration;
    }
  }

  onInstructionAudioEnded(audio: HTMLAudioElement): void {
    if (!this.selectedAssignment || this.listenRequestInFlight) {
      return;
    }
    this.listenSession.active = false;
    const duration = this.listenSession.duration || audio.duration || 0;
    if (duration <= 0) {
      return;
    }
    const requiredElapsed = Math.max(duration * 0.85, duration - 3);
    if (this.listenSession.listenedSeconds < requiredElapsed) {
      return;
    }

    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    this.listenRequestInFlight = true;
    this.api
      .registerAssignmentListenCompletion(
        studentId,
        this.selectedAssignment.id,
        this.selectedAssignment.instructionAudioVersion
      )
      .pipe(finalize(() => (this.listenRequestInFlight = false)))
      .subscribe({
        next: (progress) => {
          this.assignmentProgress = progress;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message ?? 'ثبت گوش‌دادن با خطا مواجه شد.';
        }
      });
  }

  onInstructionAudioError(): void {
    this.errorMessage = 'پخش فایل راهنما با خطا مواجه شد.';
  }

  private loadAssignmentProgress(assignmentId: number): void {
    const studentId = this.getStudentId();
    if (studentId === null) {
      return;
    }
    const requestKey = `${studentId}:${assignmentId}:${Date.now()}`;
    this.lastProgressRequestKey = requestKey;
    this.api.getAssignmentProgress(studentId, assignmentId).subscribe({
      next: (progress) => {
        if (this.lastProgressRequestKey !== requestKey) {
          return;
        }
        if (!this.selectedAssignment || this.selectedAssignment.id !== assignmentId) {
          return;
        }
        if (!this.primaryInstructionAudioUrl) {
          this.assignmentProgress = {
            ...progress,
            requiredListenCount: 0,
            currentListenCount: 0,
            isRecordingUnlocked: true,
            hasPlayableInstructionAudio: false
          };
          return;
        }
        this.assignmentProgress = progress;
      },
      error: (error) => {
        if (this.lastProgressRequestKey !== requestKey) {
          return;
        }
        this.errorMessage = error?.error?.message ?? 'دریافت وضعیت تکلیف با خطا مواجه شد.';
      }
    });
  }

  private resolvePrimaryInstructionAudioUrl(attachments: AssignmentAttachment[]): string | null {
    const primary = attachments.find((attachment) => attachment.kind === 'audio' && Boolean(attachment.url));
    return resolveMediaUrl(primary?.url) ?? null;
  }

  private getStudentId(): number | null {
    const session = this.authService.getCurrentUser();
    return session?.studentId ?? session?.studentInfo?.id ?? null;
  }

  private updateChartSummary(): void {
    const total = this.assignments.length;
    const submitted = this.filteredSubmissions.length;
    if (total === 0) {
      this.chartSummary = 'برای این درس هنوز داده‌ای برای نمودار وجود ندارد.';
      return;
    }
    const ratio = Math.round((submitted / total) * 100);
    this.chartSummary = `تکمیل تکالیف: ${submitted} از ${total} (${ratio}٪)`;
  }

  private resetRecordingPreview(): void {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
    this.audioUrl = null;
    this.audioBlob = null;
  }

  private stopStreamTracks(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }
}
