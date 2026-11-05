import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { MorabbiApiService } from './morabbi-api.service';
import { Branch, CreateReportPayload, DailyReport, TargetStatus } from './morabbi.models';

interface ReportForm {
  branchId: number | null;
  date: string;
  subject: string;
  summary: string;
  reportPattern: string;
  reportStyle: string;
  content: string;
  recommendations: string;
  audience: string;
  attendeesCount: number;
  quranRefs: string;
  hadithRefs: string;
  challenges: string;
  solutions: string;
  pedagogicalNotes: string;
  transcriptionSource: string;
  transcriptionConfidence: number | null;
  planType: string;
  approach: string;
  traineeCount: number;
  stagePresentation: string;
  stageThinking: string;
  stageDiscussion: string;
  stageReporting: string;
  groupEndurance: string;
  groupSemiSpeed: string;
  groupSpeed: string;
  evaluationSelf: string;
  status: string;
}

const emptyForm = (): ReportForm => ({
  branchId: null,
  date: new Date().toISOString().slice(0, 10),
  subject: '',
  summary: '',
  reportPattern: '',
  reportStyle: '',
  content: '',
  recommendations: '',
  audience: '',
  attendeesCount: 0,
  quranRefs: '',
  hadithRefs: '',
  challenges: '',
  solutions: '',
  pedagogicalNotes: '',
  transcriptionSource: 'MANUAL',
  transcriptionConfidence: null,
  planType: 'daily',
  approach: '',
  traineeCount: 0,
  stagePresentation: '',
  stageThinking: '',
  stageDiscussion: '',
  stageReporting: '',
  groupEndurance: '',
  groupSemiSpeed: '',
  groupSpeed: '',
  evaluationSelf: '',
  status: 'DRAFT'
});

@Component({
  selector: 'app-report-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ editId() ? 'ویرایش گزارش' : 'گزارش جدید' }}</h1>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>

    <form (ngSubmit)="submit()" *ngIf="ready(); else loading">
      <div class="card">
        <h3 class="card-title">مشخصات اصلی</h3>
        <div class="grid-2">
          <div class="field">
            <label>موضوع *</label>
            <input name="subject" [(ngModel)]="form.subject" required />
          </div>
          <div class="field">
            <label>تاریخ</label>
            <input name="date" type="date" [(ngModel)]="form.date" dir="ltr" />
          </div>
        </div>
        <div class="field" *ngIf="showBranch">
          <label>شعبه</label>
          <select name="branchId" [(ngModel)]="form.branchId">
            <option [ngValue]="null">انتخاب کنید</option>
            <option *ngFor="let b of branches()" [ngValue]="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>خلاصه</label>
          <textarea name="summary" [(ngModel)]="form.summary"></textarea>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>الگوی گزارش</label>
            <input name="reportPattern" [(ngModel)]="form.reportPattern" />
          </div>
          <div class="field">
            <label>سبک گزارش</label>
            <input name="reportStyle" [(ngModel)]="form.reportStyle" />
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 16px">
        <h3 class="card-title">محتوا</h3>
        <div class="field">
          <label>متن گزارش</label>
          <textarea name="content" [(ngModel)]="form.content" rows="8"></textarea>
        </div>
        <div class="field">
          <label>توصیه‌ها</label>
          <textarea name="recommendations" [(ngModel)]="form.recommendations"></textarea>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>مخاطبان</label>
            <input name="audience" [(ngModel)]="form.audience" />
          </div>
          <div class="field">
            <label>تعداد حاضرین</label>
            <input name="attendeesCount" type="number" min="0" [(ngModel)]="form.attendeesCount" dir="ltr" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>ارجاعات قرآنی (با ویرگول جدا کنید)</label>
            <input name="quranRefs" [(ngModel)]="form.quranRefs" placeholder="سوره نوح آیه ۱، ..." />
          </div>
          <div class="field">
            <label>ارجاعات حدیثی (با ویرگول جدا کنید)</label>
            <input name="hadithRefs" [(ngModel)]="form.hadithRefs" />
          </div>
        </div>
        <div class="field">
          <label>چالش‌ها</label>
          <textarea name="challenges" [(ngModel)]="form.challenges"></textarea>
        </div>
        <div class="field">
          <label>راه‌حل‌ها</label>
          <textarea name="solutions" [(ngModel)]="form.solutions"></textarea>
        </div>
        <div class="field">
          <label>یادداشت‌های تربیتی</label>
          <textarea name="pedagogicalNotes" [(ngModel)]="form.pedagogicalNotes"></textarea>
        </div>
      </div>

      <div class="card" style="margin-top: 16px">
        <h3 class="card-title">مراحل اجرا</h3>
        <div class="field">
          <label>ارائه</label>
          <textarea name="stagePresentation" [(ngModel)]="form.stagePresentation"></textarea>
        </div>
        <div class="field">
          <label>تفکر</label>
          <textarea name="stageThinking" [(ngModel)]="form.stageThinking"></textarea>
        </div>
        <div class="field">
          <label>بحث و گفت‌وگو</label>
          <textarea name="stageDiscussion" [(ngModel)]="form.stageDiscussion"></textarea>
        </div>
        <div class="field">
          <label>گزارش‌گیری</label>
          <textarea name="stageReporting" [(ngModel)]="form.stageReporting"></textarea>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>گروهی — استقامت</label>
            <input name="groupEndurance" [(ngModel)]="form.groupEndurance" />
          </div>
          <div class="field">
            <label>گروهی — نیم‌سریع</label>
            <input name="groupSemiSpeed" [(ngModel)]="form.groupSemiSpeed" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>گروهی — سریع</label>
            <input name="groupSpeed" [(ngModel)]="form.groupSpeed" />
          </div>
          <div class="field">
            <label>ارزیابی خود</label>
            <textarea name="evaluationSelf" [(ngModel)]="form.evaluationSelf"></textarea>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 16px">
        <h3 class="card-title">سایر</h3>
        <div class="grid-2">
          <div class="field">
            <label>منبع ترانسکریپشن</label>
            <select name="transcriptionSource" [(ngModel)]="form.transcriptionSource">
              <option value="MANUAL">دستی</option>
              <option value="AI">هوش مصنوعی</option>
            </select>
          </div>
          <div class="field">
            <label>دقت ترانسکریپشن (۰ تا ۱)</label>
            <input name="transcriptionConfidence" type="number" step="0.05" min="0" max="1" [(ngModel)]="form.transcriptionConfidence" dir="ltr" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>نوع طرح</label>
            <input name="planType" [(ngModel)]="form.planType" />
          </div>
          <div class="field">
            <label>رویکرد</label>
            <input name="approach" [(ngModel)]="form.approach" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>تعداد فراگیران</label>
            <input name="traineeCount" type="number" min="0" [(ngModel)]="form.traineeCount" dir="ltr" />
          </div>
          <div class="field">
            <label>وضعیت</label>
            <select name="status" [(ngModel)]="form.status">
              <option value="DRAFT">پیش‌نویس</option>
              <option value="SUBMITTED">ثبت‌شده</option>
            </select>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 18px; justify-content: flex-end">
        <button type="button" class="btn btn-secondary" (click)="cancel()">انصراف</button>
        <button class="btn" [disabled]="busy()">{{ editId() ? 'ذخیره تغییرات' : 'ثبت گزارش' }}</button>
      </div>
    </form>

    <ng-template #loading>
      <div class="card"><div class="empty">در حال بارگذاری...</div></div>
    </ng-template>
  `
})
export class MorabbiReportFormComponent implements OnInit {
  private readonly auth = inject(MorabbiApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifier = inject(NotificationService);

  readonly editId = signal<number | null>(null);
  readonly ready = signal(false);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly branches = signal<Branch[]>([]);
  readonly showBranch = signal(false);
  form: ReportForm = emptyForm();

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    this.auth.getBranches().subscribe((b) => {
      this.branches.set(b);
      if (!this.editId() && this.auth.user()?.branchId) {
        this.form.branchId = this.auth.user()!.branchId;
      }
    });

    if (id) {
      this.editId.set(id);
      this.auth.getReport(id).subscribe({
        next: (r) => this.fillFromReport(r),
        error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت گزارش')
      });
    } else {
      this.ready.set(true);
    }
    this.showBranch.set(this.auth.isStaff());
  }

  cancel(): void {
    if (this.editId()) this.router.navigate(['/coach/reports', this.editId()]);
    else this.router.navigate(['/coach/reports']);
  }

  submit(): void {
    const f = this.form;
    const payload: CreateReportPayload = {
      subject: f.subject.trim(),
      date: f.date || null,
      summary: f.summary || null,
      reportPattern: f.reportPattern || null,
      reportStyle: f.reportStyle || null,
      content: f.content || null,
      recommendations: f.recommendations || null,
      audience: f.audience || null,
      attendeesCount: f.attendeesCount || 0,
      quranRefs: this.toRefs(f.quranRefs),
      hadithRefs: this.toRefs(f.hadithRefs),
      challenges: f.challenges || null,
      solutions: f.solutions || null,
      pedagogicalNotes: f.pedagogicalNotes || null,
      transcriptionSource: f.transcriptionSource || 'MANUAL',
      transcriptionConfidence: f.transcriptionConfidence ?? null,
      planType: f.planType || 'daily',
      approach: f.approach || null,
      traineeCount: f.traineeCount || 0,
      stagePresentation: f.stagePresentation || null,
      stageThinking: f.stageThinking || null,
      stageDiscussion: f.stageDiscussion || null,
      stageReporting: f.stageReporting || null,
      groupEndurance: f.groupEndurance || null,
      groupSemiSpeed: f.groupSemiSpeed || null,
      groupSpeed: f.groupSpeed || null,
      evaluationSelf: f.evaluationSelf || null,
      status: f.status as TargetStatus
    };
    if (this.showBranch() || this.auth.isAdminManager()) {
      payload.branchId = f.branchId;
    }

    this.busy.set(true);
    this.error.set(null);
    const obs = this.editId()
      ? this.auth.updateReport(this.editId()!, this.stripBranchDate(payload))
      : this.auth.createReport(payload);

    obs.subscribe({
      next: (res) => {
        this.busy.set(false);
        if (!res.report) {
          this.notifier.show('گزارش آفلاین ذخیره شد؛ پس از برقراری اتصال به‌صورت خودکار ارسال می‌شود.', 'info');
          this.router.navigate(['/coach/reports']);
          return;
        }
        this.router.navigate(['/coach/reports', res.report.id]);
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'خطا در ذخیره گزارش');
      }
    });
  }

  private fillFromReport(r: DailyReport): void {
    this.form = {
      branchId: r.branchId,
      date: (r.date || '').slice(0, 10),
      subject: r.subject,
      summary: r.summary ?? '',
      reportPattern: r.reportPattern ?? '',
      reportStyle: r.reportStyle ?? '',
      content: r.content ?? '',
      recommendations: r.recommendations ?? '',
      audience: r.audience ?? '',
      attendeesCount: r.attendeesCount,
      quranRefs: this.toCsv(r.quranRefs),
      hadithRefs: this.toCsv(r.hadithRefs),
      challenges: r.challenges ?? '',
      solutions: r.solutions ?? '',
      pedagogicalNotes: r.pedagogicalNotes ?? '',
      transcriptionSource: r.transcriptionSource || 'MANUAL',
      transcriptionConfidence: r.transcriptionConfidence,
      planType: r.planType || 'daily',
      approach: r.approach ?? '',
      traineeCount: r.traineeCount,
      stagePresentation: r.stagePresentation ?? '',
      stageThinking: r.stageThinking ?? '',
      stageDiscussion: r.stageDiscussion ?? '',
      stageReporting: r.stageReporting ?? '',
      groupEndurance: r.groupEndurance ?? '',
      groupSemiSpeed: r.groupSemiSpeed ?? '',
      groupSpeed: r.groupSpeed ?? '',
      evaluationSelf: r.evaluationSelf ?? '',
      status: r.status ?? 'DRAFT'
    };
    this.ready.set(true);
  }

  private toCsv(raw: string | null): string {
    try {
      const v = raw ? JSON.parse(raw) : [];
      if (Array.isArray(v)) return v.join('، ');
      return raw ?? '';
    } catch {
      return raw ?? '';
    }
  }

  private toRefs(text: string): string {
    const items = text
      .split(/،|,/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return JSON.stringify(items);
  }

  private stripBranchDate(p: CreateReportPayload) {
    const { branchId, date, ...rest } = p;
    return rest;
  }
}
