import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import type {
  Assignment,
  AssignmentAttachment,
  AssignmentStatus,
  AssignmentType,
  AttachmentKind,
  Course,
  CourseStatus,
  PendingUser
} from '../../core/models/lesson-planner.models';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="app-shell admin-page" aria-labelledby="admin-page-title">
      <header class="shell-header">
        <div>
          <h1 id="admin-page-title">پنل مدیریت</h1>
          <p>خوش آمدید {{ username }}</p>
        </div>
        <button type="button" class="btn btn-secondary" (click)="logout()">خروج</button>
      </header>

      @if (errorMessage) {
        <p class="lp-error" role="alert" aria-live="assertive">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p class="lp-success" role="status" aria-live="polite">{{ successMessage }}</p>
      }

      <section class="card stats-grid">
        <article class="stat-card">
          <h3>کاربران در انتظار</h3>
          <strong>{{ stats.pendingUsers }}</strong>
        </article>
        <article class="stat-card">
          <h3>کل دوره‌ها</h3>
          <strong>{{ stats.totalCourses }}</strong>
        </article>
        <article class="stat-card">
          <h3>کل تکالیف</h3>
          <strong>{{ stats.totalAssignments }}</strong>
        </article>
        <article class="stat-card">
          <h3>کل پیوست‌ها</h3>
          <strong>{{ stats.totalAttachments }}</strong>
        </article>
        <article class="stat-card">
          <h3>دوره‌های فعال</h3>
          <strong>{{ stats.activeCourses }}</strong>
        </article>
      </section>

      <div class="admin-layout">
        <aside class="admin-sidebar" aria-label="منوی مدیریت">
          <ul class="sidebar-menu">
            @for (item of menuItems; track item.key) {
              @if (item.key === 'makatib') {
                <li
                  class="sidebar-item sidebar-parent"
                  [class.expanded]="expandedMenus.has('makatib')"
                  (click)="toggleExpand('makatib'); activeMenu = 'makatib'"
                  (keydown.enter)="toggleExpand('makatib'); activeMenu = 'makatib'"
                  tabindex="0"
                  role="button"
                >
                  <span class="sidebar-parent-label">{{ item.label }}</span>
                  <span class="sidebar-arrow">{{ expandedMenus.has('makatib') ? '▲' : '▼' }}</span>
                </li>
                @if (expandedMenus.has('makatib')) {
                  <li class="sidebar-submenu">
                    <ul>
                      <li
                        class="sidebar-item sidebar-sub-parent"
                        [class.expanded]="expandedMenus.has('makatib-girls')"
                        (click)="toggleExpand('makatib-girls'); $event.stopPropagation()"
                        tabindex="0"
                        role="button"
                      >
                        <span>مکاتب دخترانه</span>
                        <span class="sidebar-arrow">{{ expandedMenus.has('makatib-girls') ? '▲' : '▼' }}</span>
                      </li>
                      @if (expandedMenus.has('makatib-girls')) {
                        @for (maktab of makatibGirls; track maktab.key) {
                          <li
                            class="sidebar-item sidebar-child"
                            [class.active]="activeMenu === maktab.key"
                            (click)="activeMenu = maktab.key; $event.stopPropagation()"
                            tabindex="0"
                            role="button"
                          >
                            <span class="sidebar-child-level">{{ maktab.level }}</span>
                            <span class="sidebar-child-name">{{ maktab.label }}</span>
                          </li>
                        }
                      }
                      <li
                        class="sidebar-item sidebar-sub-parent"
                        [class.expanded]="expandedMenus.has('makatib-boys')"
                        (click)="toggleExpand('makatib-boys'); $event.stopPropagation()"
                        tabindex="0"
                        role="button"
                      >
                        <span>مکاتب پسرانه</span>
                        <span class="sidebar-arrow">{{ expandedMenus.has('makatib-boys') ? '▲' : '▼' }}</span>
                      </li>
                      @if (expandedMenus.has('makatib-boys')) {
                        @for (maktab of makatibBoys; track maktab.key) {
                          <li
                            class="sidebar-item sidebar-child"
                            [class.active]="activeMenu === maktab.key"
                            (click)="activeMenu = maktab.key; $event.stopPropagation()"
                            tabindex="0"
                            role="button"
                          >
                            <span class="sidebar-child-level">{{ maktab.level }}</span>
                            <span class="sidebar-child-name">{{ maktab.label }}</span>
                          </li>
                        }
                      }
                    </ul>
                  </li>
                }
              } @else {
                <li
                  class="sidebar-item"
                  [class.active]="activeMenu === item.key"
                  (click)="activeMenu = item.key"
                  (keydown.enter)="activeMenu = item.key"
                  tabindex="0"
                  role="button"
                >
                  {{ item.label }}
                </li>
              }
            }
          </ul>
        </aside>

        <div class="admin-content">
          @if (activeMenu === 'trainees') {
            <section class="card pending-users-card" aria-labelledby="admin-users-title">
              <header class="section-header">
                <h2 id="admin-users-title" class="section-title">
                  متربیان در انتظار تایید
                  <span class="count-badge">{{ pendingUsers.length }}</span>
                </h2>
                <button type="button" class="btn btn-secondary" [disabled]="loadingPendingUsers" (click)="refreshAll()">
                  {{ loadingPendingUsers ? 'در حال بروزرسانی...' : 'بروزرسانی' }}
                </button>
              </header>

              @if (loadingPendingUsers) {
                <p class="muted">در حال دریافت لیست کاربران...</p>
              } @else if (pendingUsers.length === 0) {
                <p class="muted">در حال حاضر کاربر در انتظار تایید وجود ندارد.</p>
              } @else {
                <div class="pending-list">
                  @for (user of pendingUsers; track user.id) {
                    <article class="pending-item">
                      <div class="pending-summary">
                        <h3>{{ user.firstName }} {{ user.lastName }}</h3>
                        <p class="muted">نام کاربری: {{ user.username }}</p>
                        <p class="muted">ایمیل: {{ user.email || '-' }}</p>
                        <p class="muted">موبایل: {{ user.phoneNumber || '-' }}</p>
                      </div>

                      @if (approvalForms[user.id]; as approvalForm) {
                        <form [formGroup]="approvalForm" class="approval-form" (ngSubmit)="approveUser(user)">
                          <label>
                            نام
                            <input type="text" formControlName="firstName" />
                          </label>
                          <label>
                            نام خانوادگی
                            <input type="text" formControlName="lastName" />
                          </label>
                          <label>
                            ایمیل
                            <input type="email" formControlName="email" />
                          </label>
                          <label>
                            موبایل
                            <input type="text" formControlName="phoneNumber" />
                          </label>
                          <label>
                            شماره متربی
                            <input type="text" formControlName="studentId" />
                          </label>
                          <label>
                            دوره‌ها (ID با کاما)
                            <input type="text" formControlName="courseIdsInput" placeholder="مثال: 1,2" />
                          </label>

                          <div class="row-actions">
                            <button type="submit" class="btn" [disabled]="isProcessing(user.id) || approvalForm.invalid">
                              {{ isProcessing(user.id) ? 'در حال تایید...' : 'تایید' }}
                            </button>
                            <button
                              type="button"
                              class="btn btn-secondary"
                              [disabled]="isProcessing(user.id)"
                              (click)="rejectUser(user)"
                            >
                              {{ isProcessing(user.id) ? 'در حال پردازش...' : 'رد' }}
                            </button>
                          </div>
                        </form>
                      }
                    </article>
                  }
                </div>
              }
            </section>
          }

          @if (activeMenu === 'teachers') {
            <section class="card">
              <h2 class="section-title">مربیان</h2>
              <p class="muted">بخش مربیان در حال توسعه است.</p>
            </section>
          }

          @if (activeMenu === 'courses') {
            <section id="admin-courses" class="card" aria-labelledby="admin-courses-title">
              <header class="section-header">
                <h2 id="admin-courses-title" class="section-title">
                  مدیریت دوره‌ها
                  <span class="count-badge">{{ courses.length }}</span>
                </h2>
                <button type="button" class="btn btn-secondary" (click)="startCreateCourse()">دوره جدید</button>
              </header>

              <form class="inline-form" [formGroup]="courseFilterForm" (ngSubmit)="applyCourseFilters()">
                <label>
                  جستجو
                  <input type="text" formControlName="query" placeholder="عنوان، کد یا مدرس" />
                </label>
                <label>
                  وضعیت
                  <select formControlName="status">
                    <option value="">همه</option>
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                    <option value="archived">آرشیو</option>
                  </select>
                </label>
                <div class="row-actions">
                  <button type="submit" class="btn" [disabled]="loadingCourses">اعمال</button>
                  <button type="button" class="btn btn-secondary" [disabled]="loadingCourses" (click)="resetCourseFilters()">
                    پاک کردن
                  </button>
                </div>
              </form>

              <div class="split-grid">
                <div>
                  @if (loadingCourses) {
                    <p class="muted">در حال دریافت دوره‌ها...</p>
                  } @else if (courses.length === 0) {
                    <p class="muted">هیچ دوره‌ای یافت نشد.</p>
                  } @else {
                    <div class="select-list">
                      @for (course of courses; track course.id) {
                        <div
                          class="list-item"
                          role="button"
                          tabindex="0"
                          [class.is-selected]="selectedCourseId === course.id"
                          (click)="selectCourse(course.id)"
                          (keydown.enter)="selectCourse(course.id)"
                          (keydown.space)="$event.preventDefault(); selectCourse(course.id)"
                        >
                          <div class="list-item-top">
                            <strong>{{ course.title }}</strong>
                            <span class="list-item-actions">
                              <span class="status-chip" [ngClass]="courseStatusClass(course.status)">
                                {{ courseStatusLabel(course.status) }}
                              </span>
                              @if (course.status === 'inactive' || course.status === 'active') {
                                <button
                                  type="button"
                                  class="toggle-btn"
                                  [class.is-active]="course.status === 'active'"
                                  (click)="$event.stopPropagation(); toggleCourseStatus(course)"
                                  [title]="course.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'"
                                >
                                  {{ course.status === 'active' ? '🔴' : '🟢' }}
                                </button>
                              }
                            </span>
                          </div>
                          <span class="list-meta list-meta--truncate">{{ course.courseCode }}</span>
                          <small class="list-meta list-meta--truncate">{{ course.instructor }}</small>
                        </div>
                      }
                    </div>
                  }
                </div>

                <form [formGroup]="courseForm" class="editor-form" (ngSubmit)="saveCourse()">
                  <h3>{{ courseMode === 'create' ? 'ایجاد دوره' : 'ویرایش دوره' }}</h3>
                  <label>
                    عنوان
                    <input type="text" formControlName="title" />
                  </label>
                  <label>
                    کد دوره
                    <input type="text" formControlName="courseCode" />
                  </label>
                  <label>
                    توضیحات
                    <textarea formControlName="description" rows="3"></textarea>
                  </label>
                  <label>
                    مدرس
                    <input type="text" formControlName="instructor" />
                  </label>
                  <label>
                    وضعیت
                    <select formControlName="status">
                      <option value="active">فعال</option>
                      <option value="inactive">غیرفعال</option>
                      <option value="archived">آرشیو</option>
                    </select>
                  </label>
                  <label>
                    تاریخ شروع
                    <input type="date" formControlName="startDate" />
                  </label>
                  <label>
                    تاریخ پایان
                    <input type="date" formControlName="endDate" />
                  </label>
                  <label>
                    واحد
                    <input type="number" formControlName="credits" min="1" />
                  </label>
                  <label>
                    ظرفیت
                    <input type="number" formControlName="maxStudents" min="1" />
                  </label>
                  <div class="row-actions">
                    <button type="submit" class="btn" [disabled]="courseForm.invalid || savingCourse">
                      {{ savingCourse ? 'در حال ذخیره...' : courseMode === 'create' ? 'ایجاد دوره' : 'ذخیره تغییرات' }}
                    </button>
                    @if (courseMode === 'edit' && selectedCourseId !== null) {
                      <button type="button" class="btn btn-secondary" [disabled]="savingCourse" (click)="deleteSelectedCourse()">
                        حذف دوره
                      </button>
                    }
                  </div>
                </form>
              </div>
            </section>

            <section id="admin-assignments" class="card" aria-labelledby="admin-assignments-title">
              <header class="section-header">
                <h2 id="admin-assignments-title" class="section-title">
                  مدیریت تکالیف
                  <span class="count-badge">{{ assignments.length }}</span>
                </h2>
                <button type="button" class="btn btn-secondary" [disabled]="selectedCourseId === null" (click)="startCreateAssignment()">
                  تکلیف جدید
                </button>
              </header>

              <p class="section-context">دوره انتخاب‌شده: {{ selectedCourseTitle }}</p>
              @if (selectedCourseId === null) {
                <p class="muted">برای مدیریت تکالیف، ابتدا یک دوره انتخاب یا ایجاد کنید.</p>
              } @else {
                <div class="split-grid">
                  <div>
                    @if (loadingAssignments) {
                      <p class="muted">در حال دریافت تکالیف...</p>
                    } @else if (assignments.length === 0) {
                      <p class="muted">برای این دوره تکلیفی ثبت نشده است.</p>
                    } @else {
                      <div class="select-list">
                        @for (assignment of assignments; track assignment.id) {
                          <button
                            type="button"
                            class="list-item"
                            [class.is-selected]="selectedAssignmentId === assignment.id"
                            (click)="selectAssignment(assignment.id)"
                          >
                          <div class="list-item-top">
                            <strong>{{ assignment.title }}</strong>
                            <span class="status-chip" [ngClass]="assignmentStatusClass(assignment.status)">
                              {{ assignmentStatusLabel(assignment.status) }}
                            </span>
                          </div>
                          <span class="list-meta">{{ assignment.assignmentDate }}</span>
                          <small class="list-meta">{{ assignmentTypeLabel(assignment.type) }}</small>
                          </button>
                        }
                      </div>
                    }
                  </div>

                  <form [formGroup]="assignmentForm" class="editor-form" (ngSubmit)="saveAssignment()">
                    <h3>{{ assignmentMode === 'create' ? 'ایجاد تکلیف' : 'ویرایش تکلیف' }}</h3>
                    <label>
                      عنوان
                      <input type="text" formControlName="title" />
                    </label>
                    <label>
                      توضیحات
                      <textarea formControlName="description" rows="3"></textarea>
                    </label>
                    <label>
                      تاریخ تکلیف
                      <input type="date" formControlName="assignmentDate" />
                    </label>
                    <label>
                      نوع
                      <select formControlName="type">
                        <option value="daily">روزانه</option>
                        <option value="homework">تکلیف</option>
                        <option value="project">پروژه</option>
                        <option value="exam">آزمون</option>
                      </select>
                    </label>
                    <label>
                      وضعیت
                      <select formControlName="status">
                        <option value="draft">پیش‌نویس</option>
                        <option value="published">منتشر شده</option>
                        <option value="closed">بسته</option>
                      </select>
                    </label>
                    <label>
                      نمره
                      <input type="number" formControlName="maxScore" min="0" />
                    </label>
                    <label>
                      راهنما
                      <textarea formControlName="instructions" rows="3"></textarea>
                    </label>
                    <div class="row-actions">
                      <button type="submit" class="btn" [disabled]="assignmentForm.invalid || savingAssignment">
                        {{ savingAssignment ? 'در حال ذخیره...' : assignmentMode === 'create' ? 'ایجاد تکلیف' : 'ذخیره تغییرات' }}
                      </button>
                      @if (assignmentMode === 'edit' && selectedAssignmentId !== null) {
                        <button
                          type="button"
                          class="btn btn-secondary"
                          [disabled]="savingAssignment"
                          (click)="deleteSelectedAssignment()"
                        >
                          حذف تکلیف
                        </button>
                      }
                    </div>
                  </form>
                </div>

                <form [formGroup]="dailySeriesForm" class="editor-form daily-series-form" (ngSubmit)="createDailySeries()">
                  <h3>ایجاد سری روزانه</h3>
                  <label>
                    تاریخ شروع
                    <input type="date" formControlName="startDate" />
                  </label>
                  <label>
                    تعداد روز
                    <input type="number" formControlName="days" min="1" />
                  </label>
                  <label>
                    پیشوند عنوان
                    <input type="text" formControlName="titlePrefix" />
                  </label>
                  <label>
                    پیشوند توضیحات
                    <input type="text" formControlName="descriptionPrefix" />
                  </label>
                  <label>
                    نوع
                    <select formControlName="type">
                      <option value="daily">روزانه</option>
                      <option value="homework">تکلیف</option>
                      <option value="project">پروژه</option>
                      <option value="exam">آزمون</option>
                    </select>
                  </label>
                  <label>
                    نمره
                    <input type="number" formControlName="maxScore" min="0" />
                  </label>
                  <label>
                    راهنما
                    <input type="text" formControlName="instructions" />
                  </label>
                  <button type="submit" class="btn" [disabled]="dailySeriesForm.invalid || creatingDailySeries">
                    {{ creatingDailySeries ? 'در حال ایجاد...' : 'ایجاد سری روزانه' }}
                  </button>
                </form>
              }
            </section>

            <section id="admin-attachments" class="card" aria-labelledby="admin-attachments-title">
              <header class="section-header">
                <h2 id="admin-attachments-title" class="section-title">
                  مدیریت پیوست‌ها
                  <span class="count-badge">{{ attachments.length }}</span>
                </h2>
              </header>

              <p class="section-context">تکلیف انتخاب‌شده: {{ selectedAssignmentTitle }}</p>
              @if (selectedAssignmentId === null) {
                <p class="muted">برای مدیریت پیوست‌ها، ابتدا یک تکلیف انتخاب کنید.</p>
              } @else {
                <form [formGroup]="attachmentCreateForm" class="editor-form" (ngSubmit)="createAttachment()">
                  <h3>پیوست جدید</h3>
                  <label>
                    عنوان
                    <input type="text" formControlName="title" />
                  </label>
                  <label>
                    توضیحات
                    <input type="text" formControlName="description" />
                  </label>
                  <label>
                    نوع
                    <select formControlName="kind">
                      <option value="document">سند</option>
                      <option value="audio">صوت</option>
                      <option value="image">تصویر</option>
                      <option value="text">متن</option>
                      <option value="other">سایر</option>
                    </select>
                  </label>
                  <label>
                    ترتیب نمایش
                    <input type="number" formControlName="displayOrder" min="1" />
                  </label>
                  <label>
                    فایل
                    <input type="file" (change)="onCreateAttachmentFileChange($event)" />
                  </label>
                  <button type="submit" class="btn" [disabled]="attachmentCreateForm.invalid || creatingAttachment">
                    {{ creatingAttachment ? 'در حال ایجاد...' : 'افزودن پیوست' }}
                  </button>
                </form>

                @if (loadingAttachments) {
                  <p class="muted">در حال دریافت پیوست‌ها...</p>
                } @else if (attachments.length === 0) {
                  <p class="muted">برای این تکلیف پیوستی ثبت نشده است.</p>
                } @else {
                  <div class="pending-list">
                    @for (attachment of attachments; track attachment.id) {
                      <article class="pending-item">
                        <p><strong>{{ attachment.title }}</strong></p>
                        <p class="muted url-text">{{ attachment.url }}</p>

                        @if (attachmentMetaForms[attachment.id]; as attachmentForm) {
                          <form [formGroup]="attachmentForm" class="approval-form" (ngSubmit)="updateAttachment(attachment.id)">
                            <label>
                              عنوان
                              <input type="text" formControlName="title" />
                            </label>
                            <label>
                              توضیحات
                              <input type="text" formControlName="description" />
                            </label>
                            <label>
                              نوع
                              <select formControlName="kind">
                                <option value="document">سند</option>
                                <option value="audio">صوت</option>
                                <option value="image">تصویر</option>
                                <option value="text">متن</option>
                                <option value="other">سایر</option>
                              </select>
                            </label>
                            <label>
                              ترتیب نمایش
                              <input type="number" formControlName="displayOrder" min="1" />
                            </label>
                            <label>
                              جایگزینی فایل
                              <input type="file" (change)="onReplaceAttachmentFileChange(attachment.id, $event)" />
                            </label>
                            <div class="row-actions">
                              <button type="submit" class="btn" [disabled]="updatingAttachmentIds.has(attachment.id)">
                                {{ updatingAttachmentIds.has(attachment.id) ? 'در حال ذخیره...' : 'ذخیره' }}
                              </button>
                              <button
                                type="button"
                                class="btn btn-secondary"
                                [disabled]="updatingAttachmentIds.has(attachment.id)"
                                (click)="replaceAttachmentFile(attachment.id)"
                              >
                                جایگزینی فایل
                              </button>
                              <button
                                type="button"
                                class="btn btn-secondary"
                                [disabled]="updatingAttachmentIds.has(attachment.id)"
                                (click)="deleteAttachment(attachment.id)"
                              >
                                حذف
                              </button>
                            </div>
                          </form>
                        }
                      </article>
                    }
                  </div>
                }
              }
            </section>
          }

          @if (activeMenu === 'branch-managers') {
            <section class="card">
              <h2 class="section-title">مسئولین شعب</h2>
              <p class="muted">بخش مسئولین شعب در حال توسعه است.</p>
            </section>
          }

          @if (activeMenu === 'makatib') {
            <section class="card">
              <h2 class="section-title">مکاتب تربیتی، آموزشی، مهارتی</h2>
              <p class="muted">از منوی سمت راست یک مکتب را انتخاب کنید.</p>
            </section>
          }
          @for (maktab of allMakatib; track maktab.key) {
            @if (activeMenu === maktab.key) {
              <section class="card">
                <h2 class="section-title">{{ maktab.label }}</h2>
                <p class="muted">شعبه‌های {{ maktab.label }} به زودی اضافه می‌شود.</p>
              </section>
            }
          }

          @if (activeMenu === 'parents') {
            <section class="card">
              <h2 class="section-title">والدین</h2>
              <p class="muted">بخش والدین در حال توسعه است.</p>
            </section>
          }

          @if (activeMenu === 'evaluators') {
            <section class="card">
              <h2 class="section-title">ارزیاب</h2>
              <p class="muted">بخش ارزیاب در حال توسعه است.</p>
            </section>
          }

          @if (activeMenu === 'headquarters') {
            <section class="card">
              <h2 class="section-title">ستاد</h2>
              <p class="muted">بخش ستاد در حال توسعه است.</p>
            </section>
          }
        </div>
      </div>
    </main>
  `,
  styles: [
    `
      .admin-page {
        display: grid;
        gap: 1rem;
      }
      .stats-grid {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      }
      .stat-card {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.75rem;
        background: #fff;
      }
      .stat-card h3 {
        margin: 0 0 0.3rem;
        font-size: 0.9rem;
        color: var(--lp-muted);
      }
      .stat-card strong {
        font-size: 1.3rem;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
      }
      .section-nav {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 0.25rem;
        scrollbar-width: thin;
      }
      .nav-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--lp-border);
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
        color: #0f172a;
        background: #fff;
        text-decoration: none;
        font-size: 0.82rem;
        white-space: nowrap;
        flex: 0 0 auto;
      }
      .nav-chip:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      .section-title {
        margin: 0;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
      }
      .count-badge {
        background: #e2e8f0;
        color: #0f172a;
        border-radius: 999px;
        padding: 0.15rem 0.55rem;
        font-size: 0.75rem;
        line-height: 1.4;
      }
      .section-context {
        margin: 0.2rem 0 0.75rem;
        color: var(--lp-muted);
        font-size: 0.86rem;
      }
      .inline-form {
        display: grid;
        gap: 0.6rem;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        margin-bottom: 0.75rem;
      }
      .inline-form label,
      .editor-form label {
        display: grid;
        gap: 0.25rem;
        font-size: 0.85rem;
      }
      .split-grid {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      }
      .select-list {
        display: grid;
        gap: 0.5rem;
      }
      .list-item {
        text-align: right;
        border: 1px solid var(--lp-border);
        border-radius: 10px;
        background: #fff;
        padding: 0.65rem;
        display: grid;
        gap: 0.2rem;
        cursor: pointer;
      }
      .list-item:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      .list-item.is-selected {
        border-color: var(--lp-primary);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.18);
      }
      .list-item span,
      .list-item small {
        color: var(--lp-muted);
      }
      .list-item-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.45rem;
      }
      .list-meta {
        color: var(--lp-muted);
      }
      .list-meta--truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .status-chip {
        border-radius: 999px;
        padding: 0.15rem 0.5rem;
        font-size: 0.74rem;
        border: 1px solid transparent;
        white-space: nowrap;
      }
      .status-chip--active,
      .status-chip--published {
        color: #065f46;
        background: #ecfdf5;
        border-color: #a7f3d0;
      }
      .status-chip--inactive,
      .status-chip--draft {
        color: #92400e;
        background: #fffbeb;
        border-color: #fcd34d;
      }
      .status-chip--archived,
      .status-chip--closed {
        color: #374151;
        background: #f3f4f6;
        border-color: #d1d5db;
      }
      .list-item-actions {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }
      .toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.85rem;
        line-height: 1;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        width: 1.5rem;
        height: 1.5rem;
        transition: transform 0.15s;
      }
      .toggle-btn:hover {
        transform: scale(1.2);
      }
      .editor-form {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.75rem;
        display: grid;
        gap: 0.5rem;
      }
      .daily-series-form {
        margin-top: 0.75rem;
      }
      .pending-list {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
      }
      .pending-item {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.75rem;
        background: #fff;
      }
      .pending-summary h3 {
        margin: 0 0 0.35rem;
      }
      .pending-summary p {
        margin: 0 0 0.2rem;
      }
      .approval-form {
        margin-top: 0.75rem;
        display: grid;
        gap: 0.5rem;
      }
      input,
      textarea,
      select {
        border: 1px solid var(--lp-border);
        border-radius: 8px;
        padding: 0.5rem;
        font: inherit;
      }
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible,
      button:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      .row-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .muted {
        color: var(--lp-muted);
      }
      .url-text {
        overflow-wrap: anywhere;
        word-break: break-word;
      }
      .admin-layout {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }
      .admin-sidebar {
        flex: 0 0 160px;
        position: sticky;
        top: 0.5rem;
      }
      .sidebar-menu {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.25rem;
      }
      .sidebar-item {
        border: 1px solid var(--lp-border);
        border-radius: 10px;
        padding: 0.6rem 0.75rem;
        cursor: pointer;
        font-size: 0.87rem;
        background: #fff;
        transition: background 0.15s, border-color 0.15s;
        user-select: none;
      }
      .sidebar-item:hover {
        background: #f1f5f9;
      }
      .sidebar-item.active {
        border-color: var(--lp-primary);
        background: #eff6ff;
        color: var(--lp-primary);
        font-weight: 600;
      }
      .sidebar-item:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      .admin-content {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 1rem;
      }
      @media (max-width: 900px) {
        .split-grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 768px) {
      .maktab-tabs {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 0.25rem;
        margin-top: 0.75rem;
        scrollbar-width: thin;
      }
      .maktab-tab {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 0.5rem 0.75rem;
        background: #fff;
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;
        min-width: 140px;
      }
      .maktab-tab:hover {
        background: #f1f5f9;
      }
      .maktab-tab.active {
        border-color: var(--lp-primary);
        background: #eff6ff;
      }
      .maktab-tab:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      .maktab-tab-gender {
        font-size: 0.7rem;
        color: var(--lp-muted);
      }
      .maktab-tab-name {
        font-size: 0.78rem;
        font-weight: 600;
        color: #0f172a;
        text-align: center;
      }
      .maktab-tab-level {
        font-size: 0.7rem;
        color: var(--lp-muted);
      }
      .maktab-content {
        margin-top: 0.75rem;
      }
      .maktab-panel {
        border: 1px solid var(--lp-border);
        border-radius: 12px;
        padding: 1rem;
        background: #fff;
      }
      .maktab-panel-title {
        margin: 0 0 0.5rem;
        font-size: 1rem;
        color: var(--lp-primary);
      }
      .admin-layout {
          flex-direction: column-reverse;
        }
        .admin-sidebar {
          flex: none;
          width: 100%;
          position: static;
        }
        .sidebar-menu {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }
      }
      @media (max-width: 640px) {
        .admin-page {
          gap: 0.75rem;
        }
        .section-header {
          flex-direction: column;
          align-items: stretch;
        }
        .section-title {
          justify-content: space-between;
          width: 100%;
        }
        .inline-form {
          grid-template-columns: 1fr;
        }
        .row-actions {
          display: grid;
          grid-template-columns: 1fr;
        }
        .row-actions .btn {
          width: 100%;
        }
        .list-item-top {
          align-items: flex-start;
        }
        .status-chip {
          font-size: 0.7rem;
        }
        .editor-form {
          padding: 0.65rem;
        }
        .sidebar-menu {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        }
      }
    `
  ]
})
export class AdminComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly fb = inject(FormBuilder);

  username = '';
  errorMessage = '';
  successMessage = '';
  activeMenu: string = 'makatib';
  expandedMenus = new Set<string>(['makatib']);
  menuItems = [
    { key: 'trainees', label: 'متربیان' },
    { key: 'teachers', label: 'مربیان' },
    { key: 'courses', label: 'دوره‌ها' },
    { key: 'branch-managers', label: 'مسئولین شعب' },
    { key: 'makatib', label: 'مکاتب تربیتی، آموزشی، مهارتی' },
    { key: 'parents', label: 'والدین' },
    { key: 'evaluators', label: 'ارزیاب' },
    { key: 'headquarters', label: 'ستاد' }
  ] as const;

  stats = {
    pendingUsers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    totalAttachments: 0,
    activeCourses: 0
  };

  pendingUsers: PendingUser[] = [];
  approvalForms: Record<number, FormGroup> = {};
  loadingPendingUsers = false;
  processingUserIds = new Set<number>();

  courseFilterForm = this.fb.nonNullable.group({
    query: [''],
    status: ['']
  });
  courseForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    courseCode: ['', [Validators.required]],
    description: [''],
    instructor: ['', [Validators.required]],
    status: ['active'],
    startDate: [this.todayIsoDate(), [Validators.required]],
    endDate: [this.todayIsoDate(), [Validators.required]],
    credits: [2, [Validators.required, Validators.min(1)]],
    maxStudents: [30, [Validators.required, Validators.min(1)]]
  });
  courses: Course[] = [];
  selectedCourseId: number | null = null;
  loadingCourses = false;
  savingCourse = false;
  courseMode: 'create' | 'edit' = 'create';

  assignmentForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    assignmentDate: [this.todayIsoDate(), [Validators.required]],
    type: ['daily'],
    status: ['published'],
    maxScore: [20, [Validators.required, Validators.min(0)]],
    instructions: ['']
  });
  dailySeriesForm = this.fb.nonNullable.group({
    startDate: [this.todayIsoDate(), [Validators.required]],
    days: [3, [Validators.required, Validators.min(1)]],
    titlePrefix: ['تکلیف روز'],
    descriptionPrefix: [''],
    type: ['daily'],
    maxScore: [20, [Validators.required, Validators.min(0)]],
    instructions: ['']
  });
  assignments: Assignment[] = [];
  selectedAssignmentId: number | null = null;
  assignmentMode: 'create' | 'edit' = 'create';
  loadingAssignments = false;
  savingAssignment = false;
  creatingDailySeries = false;

  attachmentCreateForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    kind: ['document'],
    displayOrder: [1, [Validators.required, Validators.min(1)]]
  });
  attachments: AssignmentAttachment[] = [];
  attachmentMetaForms: Record<number, FormGroup> = {};
  attachmentReplacementFiles: Record<number, File | null> = {};
  createAttachmentFile: File | null = null;
  loadingAttachments = false;
  creatingAttachment = false;
  updatingAttachmentIds = new Set<number>();

  constructor() {
    this.username = this.authService.getCurrentUser()?.username ?? 'admin';
  }

  ngOnInit(): void {
    this.refreshAll();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }

  refreshAll(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loadStatistics();
    this.loadPendingUsers();
    this.loadCourses();
  }

  isProcessing(userId: number): boolean {
    return this.processingUserIds.has(userId);
  }

  get selectedCourseTitle(): string {
    if (this.selectedCourseId === null) {
      return 'انتخاب نشده';
    }
    return this.courses.find((item) => item.id === this.selectedCourseId)?.title ?? `#${this.selectedCourseId}`;
  }

  get selectedAssignmentTitle(): string {
    if (this.selectedAssignmentId === null) {
      return 'انتخاب نشده';
    }
    return this.assignments.find((item) => item.id === this.selectedAssignmentId)?.title ?? `#${this.selectedAssignmentId}`;
  }

  courseStatusLabel(status: CourseStatus | undefined): string {
    const normalized = this.normalizeCourseStatus(status);
    if (normalized === 'inactive') {
      return 'غیرفعال';
    }
    if (normalized === 'archived') {
      return 'آرشیو';
    }
    return 'فعال';
  }

  courseStatusClass(status: CourseStatus | undefined): string {
    return `status-chip--${this.normalizeCourseStatus(status)}`;
  }

  assignmentStatusLabel(status: AssignmentStatus | undefined): string {
    const normalized = this.normalizeAssignmentStatus(status);
    if (normalized === 'draft') {
      return 'پیش‌نویس';
    }
    if (normalized === 'closed') {
      return 'بسته';
    }
    return 'منتشر';
  }

  assignmentStatusClass(status: AssignmentStatus | undefined): string {
    return `status-chip--${this.normalizeAssignmentStatus(status)}`;
  }

  assignmentTypeLabel(type: AssignmentType | undefined): string {
    const normalized = this.normalizeAssignmentType(type);
    if (normalized === 'homework') {
      return 'تکلیف';
    }
    if (normalized === 'project') {
      return 'پروژه';
    }
    if (normalized === 'exam') {
      return 'آزمون';
    }
    return 'روزانه';
  }

  approveUser(user: PendingUser): void {
    const form = this.approvalForms[user.id];
    if (!form || form.invalid || this.isProcessing(user.id)) {
      return;
    }
    const courseIds = this.readControlString(form, 'courseIdsInput')
      .split(',')
      .map((item: string) => Number(item.trim()))
      .filter((value: number) => Number.isFinite(value) && value > 0);
    if (courseIds.length === 0) {
      this.setError('حداقل یک شناسه درس معتبر وارد کنید.');
      return;
    }

    this.processingUserIds.add(user.id);
    this.api
      .approveUser(user.id, {
        firstName: this.readControlString(form, 'firstName'),
        lastName: this.readControlString(form, 'lastName'),
        email: this.readControlString(form, 'email'),
        phoneNumber: this.readControlString(form, 'phoneNumber'),
        studentId: this.readControlString(form, 'studentId'),
        courseIds
      })
      .pipe(finalize(() => this.processingUserIds.delete(user.id)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.loadPendingUsers();
          this.loadStatistics();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'تایید کاربر با خطا مواجه شد.');
        }
      });
  }

  rejectUser(user: PendingUser): void {
    if (this.isProcessing(user.id)) {
      return;
    }
    this.processingUserIds.add(user.id);
    this.api
      .rejectUser(user.id)
      .pipe(finalize(() => this.processingUserIds.delete(user.id)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.loadPendingUsers();
          this.loadStatistics();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'رد کاربر با خطا مواجه شد.');
        }
      });
  }

  applyCourseFilters(): void {
    this.loadCourses();
  }

  resetCourseFilters(): void {
    this.courseFilterForm.setValue({ query: '', status: '' });
    this.loadCourses();
  }

  startCreateCourse(): void {
    this.courseMode = 'create';
    this.courseForm.setValue({
      title: '',
      courseCode: '',
      description: '',
      instructor: '',
      status: 'active',
      startDate: this.todayIsoDate(),
      endDate: this.todayIsoDate(),
      credits: 2,
      maxStudents: 30
    });
  }

  selectCourse(courseId: number): void {
    this.selectedCourseId = courseId;
    const course = this.courses.find((item) => item.id === courseId);
    if (course) {
      this.courseMode = 'edit';
      this.courseForm.setValue({
        title: course.title ?? '',
        courseCode: course.courseCode ?? '',
        description: course.description ?? '',
        instructor: course.instructor ?? '',
        status: this.normalizeCourseStatus(course.status),
        startDate: course.startDate ?? this.todayIsoDate(),
        endDate: course.endDate ?? this.todayIsoDate(),
        credits: Number(course.credits ?? 2),
        maxStudents: Number(course.maxStudents ?? 30)
      });
    }
    this.startCreateAssignment();
    this.loadAssignments(courseId);
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      return;
    }
    const raw = this.courseForm.getRawValue();
    const payload = {
      title: raw.title.trim(),
      courseCode: raw.courseCode.trim(),
      description: raw.description.trim(),
      instructor: raw.instructor.trim(),
      status: raw.status as CourseStatus,
      startDate: raw.startDate,
      endDate: raw.endDate,
      credits: Number(raw.credits),
      maxStudents: Number(raw.maxStudents)
    };

    this.savingCourse = true;
    const request$ =
      this.courseMode === 'edit' && this.selectedCourseId !== null
        ? this.api.updateAdminCourse(this.selectedCourseId, payload)
        : this.api.createAdminCourse(payload);

    request$.pipe(finalize(() => (this.savingCourse = false))).subscribe({
      next: (course) => {
        this.selectedCourseId = course.id;
        this.courseMode = 'edit';
        this.setSuccess(this.courseMode === 'edit' ? 'دوره با موفقیت ذخیره شد.' : 'دوره جدید ایجاد شد.');
        this.loadCourses();
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'ذخیره دوره با خطا مواجه شد.');
      }
    });
  }

  deleteSelectedCourse(): void {
    if (this.selectedCourseId === null || this.savingCourse) {
      return;
    }
    this.savingCourse = true;
    this.api
      .deleteAdminCourse(this.selectedCourseId)
      .pipe(finalize(() => (this.savingCourse = false)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.selectedCourseId = null;
          this.startCreateCourse();
          this.loadCourses();
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف دوره با خطا مواجه شد.');
        }
      });
  }

  readonly makatibGirls = [
    { key: 'maktab-roqieh', label: 'مکتب حضرت رقیه علیها السلام', level: '7 سال اول' },
    { key: 'maktab-sakineh', label: 'مکتب حضرت سکینه علیها السلام', level: '7 سال دوم' },
    { key: 'maktab-fatemeh', label: 'مکتب حضرت فاطمه بنت الحسین علیها السلام', level: '7 سال سوم' }
  ];
  readonly makatibBoys = [
    { key: 'maktab-ali-asghar', label: 'مکتب حضرت علی اصغر علیه السلام', level: '7 سال اول' },
    { key: 'maktab-ghasem', label: 'مکتب حضرت قاسم علیه السلام', level: '7 سال دوم' },
    { key: 'maktab-ali-akbar', label: 'مکتب حضرت علی اکبر علیه السلام', level: '7 سال سوم' }
  ];
  readonly allMakatib = [...this.makatibGirls, ...this.makatibBoys];

  toggleExpand(key: string): void {
    if (this.expandedMenus.has(key)) {
      this.expandedMenus.delete(key);
    } else {
      this.expandedMenus.add(key);
    }
  }

  // Handle makatib click - expand girls/boys sections only when makatib itself is clicked
  toggleMakatibClick(): void {
    this.expandedMenus.add('makatib');
    this.activeMenu = 'makatib';
    // Auto-expand children based on active menu
    if (this.makatibGirls.some(m => m.key === this.activeMenu)) {
      this.expandedMenus.add('makatib-girls');
    } else if (this.makatibBoys.some(m => m.key === this.activeMenu)) {
      this.expandedMenus.add('makatib-boys');
    }
  }

  toggleCourseStatus(course: Course): void {
    const newStatus: CourseStatus = course.status === 'active' ? 'inactive' : 'active';
    this.api
      .updateAdminCourse(course.id, { status: newStatus })
      .subscribe({
        next: () => {
          course.status = newStatus;
          this.loadStatistics();
          this.loadCourses();
          this.setSuccess(`وضعیت دوره "${course.title}" به ${newStatus === 'active' ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'تغییر وضعیت دوره با خطا مواجه شد.');
        }
      });
  }

  startCreateAssignment(): void {
    this.assignmentMode = 'create';
    this.selectedAssignmentId = null;
    this.assignments = this.assignments;
    this.assignmentForm.setValue({
      title: '',
      description: '',
      assignmentDate: this.todayIsoDate(),
      type: 'daily',
      status: 'published',
      maxScore: 20,
      instructions: ''
    });
    this.attachments = [];
    this.attachmentMetaForms = {};
    this.attachmentReplacementFiles = {};
  }

  selectAssignment(assignmentId: number): void {
    this.selectedAssignmentId = assignmentId;
    const assignment = this.assignments.find((item) => item.id === assignmentId);
    if (!assignment) {
      return;
    }
    this.assignmentMode = 'edit';
    this.assignmentForm.setValue({
      title: assignment.title ?? '',
      description: assignment.description ?? '',
      assignmentDate: assignment.assignmentDate ?? this.todayIsoDate(),
      type: this.normalizeAssignmentType(assignment.type),
      status: this.normalizeAssignmentStatus(assignment.status),
      maxScore: Number(assignment.maxScore ?? 20),
      instructions: assignment.instructions ?? ''
    });
    this.loadAttachments(assignmentId);
  }

  saveAssignment(): void {
    if (this.assignmentForm.invalid || this.selectedCourseId === null) {
      return;
    }
    const raw = this.assignmentForm.getRawValue();
    const payload = {
      title: raw.title.trim(),
      description: raw.description.trim(),
      assignmentDate: raw.assignmentDate,
      type: raw.type as AssignmentType,
      status: raw.status as AssignmentStatus,
      maxScore: Number(raw.maxScore),
      instructions: raw.instructions.trim()
    };

    this.savingAssignment = true;
    const request$ =
      this.assignmentMode === 'edit' && this.selectedAssignmentId !== null
        ? this.api.updateAdminAssignment(this.selectedAssignmentId, payload)
        : this.api.createAdminAssignment(this.selectedCourseId, payload);

    request$.pipe(finalize(() => (this.savingAssignment = false))).subscribe({
      next: (assignment) => {
        this.selectedAssignmentId = assignment.id;
        this.assignmentMode = 'edit';
        this.setSuccess('تکلیف با موفقیت ذخیره شد.');
        this.loadAssignments(this.selectedCourseId ?? assignment.courseId);
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'ذخیره تکلیف با خطا مواجه شد.');
      }
    });
  }

  deleteSelectedAssignment(): void {
    if (this.selectedAssignmentId === null || this.savingAssignment) {
      return;
    }
    this.savingAssignment = true;
    this.api
      .deleteAdminAssignment(this.selectedAssignmentId)
      .pipe(finalize(() => (this.savingAssignment = false)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          this.startCreateAssignment();
          if (this.selectedCourseId !== null) {
            this.loadAssignments(this.selectedCourseId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف تکلیف با خطا مواجه شد.');
        }
      });
  }

  createDailySeries(): void {
    if (this.dailySeriesForm.invalid || this.selectedCourseId === null) {
      return;
    }
    const raw = this.dailySeriesForm.getRawValue();
    this.creatingDailySeries = true;
    this.api
      .createDailyAssignments(this.selectedCourseId, {
        startDate: raw.startDate,
        days: Number(raw.days),
        titlePrefix: raw.titlePrefix.trim(),
        descriptionPrefix: raw.descriptionPrefix.trim(),
        type: raw.type as AssignmentType,
        maxScore: Number(raw.maxScore),
        instructions: raw.instructions.trim()
      })
      .pipe(finalize(() => (this.creatingDailySeries = false)))
      .subscribe({
        next: (items) => {
          this.setSuccess(`${items.length} تکلیف روزانه ایجاد شد.`);
          this.loadAssignments(this.selectedCourseId ?? 0);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ایجاد سری روزانه با خطا مواجه شد.');
        }
      });
  }

  onCreateAttachmentFileChange(event: Event): void {
    this.createAttachmentFile = this.extractFile(event);
  }

  createAttachment(): void {
    if (this.selectedAssignmentId === null || this.attachmentCreateForm.invalid) {
      return;
    }
    if (!this.createAttachmentFile) {
      this.setError('برای افزودن پیوست باید فایل انتخاب کنید.');
      return;
    }
    const raw = this.attachmentCreateForm.getRawValue();
    const payload = new FormData();
    payload.set('file', this.createAttachmentFile);
    payload.set('title', raw.title.trim());
    payload.set('description', raw.description.trim());
    payload.set('kind', raw.kind);
    payload.set('displayOrder', String(raw.displayOrder));

    this.creatingAttachment = true;
    this.api
      .createAttachment(this.selectedAssignmentId, payload)
      .pipe(finalize(() => (this.creatingAttachment = false)))
      .subscribe({
        next: () => {
          this.setSuccess('پیوست جدید افزوده شد.');
          this.createAttachmentFile = null;
          this.attachmentCreateForm.setValue({
            title: '',
            description: '',
            kind: 'document',
            displayOrder: 1
          });
          this.loadAttachments(this.selectedAssignmentId ?? 0);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'افزودن پیوست با خطا مواجه شد.');
        }
      });
  }

  updateAttachment(attachmentId: number): void {
    const form = this.attachmentMetaForms[attachmentId];
    if (!form || form.invalid || this.updatingAttachmentIds.has(attachmentId)) {
      return;
    }
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .updateAttachment(attachmentId, {
        title: this.readControlString(form, 'title'),
        description: this.readControlString(form, 'description'),
        kind: this.normalizeAttachmentKind(this.readControlString(form, 'kind')),
        displayOrder: Number(this.readControlString(form, 'displayOrder')) || 1
      })
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .subscribe({
        next: () => {
          this.setSuccess('پیوست با موفقیت ویرایش شد.');
          if (this.selectedAssignmentId !== null) {
            this.loadAttachments(this.selectedAssignmentId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'ویرایش پیوست با خطا مواجه شد.');
        }
      });
  }

  onReplaceAttachmentFileChange(attachmentId: number, event: Event): void {
    this.attachmentReplacementFiles[attachmentId] = this.extractFile(event);
  }

  replaceAttachmentFile(attachmentId: number): void {
    if (this.updatingAttachmentIds.has(attachmentId)) {
      return;
    }
    const file = this.attachmentReplacementFiles[attachmentId];
    if (!file) {
      this.setError('برای جایگزینی باید فایل جدید انتخاب شود.');
      return;
    }
    const payload = new FormData();
    payload.set('file', file);
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .uploadAttachmentFile(attachmentId, payload)
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .subscribe({
        next: () => {
          this.setSuccess('فایل پیوست جایگزین شد.');
          this.attachmentReplacementFiles[attachmentId] = null;
          if (this.selectedAssignmentId !== null) {
            this.loadAttachments(this.selectedAssignmentId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'جایگزینی فایل با خطا مواجه شد.');
        }
      });
  }

  deleteAttachment(attachmentId: number): void {
    if (this.updatingAttachmentIds.has(attachmentId)) {
      return;
    }
    this.updatingAttachmentIds.add(attachmentId);
    this.api
      .deleteAttachment(attachmentId)
      .pipe(finalize(() => this.updatingAttachmentIds.delete(attachmentId)))
      .subscribe({
        next: (response) => {
          this.setSuccess(response.message);
          if (this.selectedAssignmentId !== null) {
            this.loadAttachments(this.selectedAssignmentId);
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'حذف پیوست با خطا مواجه شد.');
        }
      });
  }

  private loadStatistics(): void {
    this.api.getSystemStatistics().subscribe({
      next: (systemStats) => {
        this.stats.totalCourses = systemStats.totalCourses;
        this.stats.totalAssignments = systemStats.totalAssignments;
        this.stats.totalAttachments = systemStats.totalAttachments;
        this.stats.activeCourses = systemStats.activeCourses;
      },
      error: () => {
        // Keep admin UI usable even if statistics endpoint fails.
      }
    });
  }

  private loadPendingUsers(): void {
    this.loadingPendingUsers = true;
    this.api
      .getPendingUsers()
      .pipe(finalize(() => (this.loadingPendingUsers = false)))
      .subscribe({
        next: (users) => {
          this.pendingUsers = users;
          this.ensureApprovalForms(users);
          this.stats.pendingUsers = users.length;
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت کاربران در انتظار تایید با خطا مواجه شد.');
        }
      });
  }

  private ensureApprovalForms(users: PendingUser[]): void {
    for (const user of users) {
      if (this.approvalForms[user.id]) {
        continue;
      }
      this.approvalForms[user.id] = this.fb.nonNullable.group({
        firstName: [user.firstName || '', [Validators.required]],
        lastName: [user.lastName || '', [Validators.required]],
        email: [user.email || '', [Validators.required, Validators.email]],
        phoneNumber: [user.phoneNumber || '', [Validators.required, Validators.pattern(/^09\\d{9}$/)]],
        studentId: [`S-${1000 + user.id}`, [Validators.required]],
        courseIdsInput: ['1', [Validators.required]]
      });
    }
  }

  private loadCourses(): void {
    const filters = this.courseFilterForm.getRawValue();
    const query = filters.query.trim();
    const status = filters.status.trim();
    this.loadingCourses = true;

    let request$;
    if (query) {
      request$ = this.api.searchAdminCourses(query);
    } else if (status) {
      request$ = this.api.filterAdminCourses(status);
    } else {
      request$ = this.api.getAdminCourses();
    }

    request$.pipe(finalize(() => (this.loadingCourses = false))).subscribe({
      next: (courses) => {
        this.courses = query && status ? courses.filter((course) => course.status === status) : courses;
        if (!this.courses.some((course) => course.id === this.selectedCourseId)) {
          this.selectedCourseId = this.courses[0]?.id ?? null;
        }
        if (this.selectedCourseId !== null) {
          this.selectCourse(this.selectedCourseId);
        } else {
          this.assignments = [];
          this.attachments = [];
          this.selectedAssignmentId = null;
          this.startCreateCourse();
        }
      },
      error: (error) => {
        this.setError(error?.error?.message ?? 'دریافت دوره‌ها با خطا مواجه شد.');
      }
    });
  }

  private loadAssignments(courseId: number): void {
    this.loadingAssignments = true;
    this.api
      .getAdminCourseAssignments(courseId)
      .pipe(finalize(() => (this.loadingAssignments = false)))
      .subscribe({
        next: (assignments) => {
          this.assignments = assignments;
          if (!this.assignments.some((item) => item.id === this.selectedAssignmentId)) {
            this.selectedAssignmentId = this.assignments[0]?.id ?? null;
          }
          if (this.selectedAssignmentId !== null) {
            this.selectAssignment(this.selectedAssignmentId);
          } else {
            this.attachments = [];
            this.attachmentMetaForms = {};
            this.attachmentReplacementFiles = {};
          }
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت تکالیف با خطا مواجه شد.');
        }
      });
  }

  private loadAttachments(assignmentId: number): void {
    this.loadingAttachments = true;
    this.api
      .getAssignmentAttachments(assignmentId)
      .pipe(finalize(() => (this.loadingAttachments = false)))
      .subscribe({
        next: (attachments) => {
          this.attachments = attachments;
          this.ensureAttachmentForms(attachments);
        },
        error: (error) => {
          this.setError(error?.error?.message ?? 'دریافت پیوست‌ها با خطا مواجه شد.');
        }
      });
  }

  private ensureAttachmentForms(attachments: AssignmentAttachment[]): void {
    const ids = new Set(attachments.map((item) => item.id));
    for (const [idKey] of Object.entries(this.attachmentMetaForms)) {
      const id = Number(idKey);
      if (!ids.has(id)) {
        delete this.attachmentMetaForms[id];
        delete this.attachmentReplacementFiles[id];
      }
    }
    for (const item of attachments) {
      if (this.attachmentMetaForms[item.id]) {
        continue;
      }
      this.attachmentMetaForms[item.id] = this.fb.nonNullable.group({
        title: [item.title || '', [Validators.required]],
        description: [item.description || ''],
        kind: [item.kind || 'document'],
        displayOrder: [Number(item.displayOrder ?? 1), [Validators.required, Validators.min(1)]]
      });
      this.attachmentReplacementFiles[item.id] = null;
    }
  }

  private readControlString(form: FormGroup, key: string): string {
    const raw = form.get(key)?.value;
    return typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
  }

  private extractFile(event: Event): File | null {
    const target = event.target as HTMLInputElement | null;
    if (!target?.files || target.files.length === 0) {
      return null;
    }
    return target.files[0];
  }

  private setSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private normalizeCourseStatus(status: CourseStatus | undefined): 'active' | 'inactive' | 'archived' {
    if (status === 'inactive' || status === 'archived') {
      return status;
    }
    return 'active';
  }

  private normalizeAssignmentType(type: AssignmentType | undefined): 'daily' | 'homework' | 'project' | 'exam' {
    if (type === 'homework' || type === 'project' || type === 'exam') {
      return type;
    }
    return 'daily';
  }

  private normalizeAssignmentStatus(status: AssignmentStatus | undefined): 'draft' | 'published' | 'closed' {
    if (status === 'draft' || status === 'closed') {
      return status;
    }
    return 'published';
  }

  private normalizeAttachmentKind(kind: string | undefined): AttachmentKind {
    if (kind === 'audio' || kind === 'image' || kind === 'text' || kind === 'other') {
      return kind;
    }
    return 'document';
  }
}
