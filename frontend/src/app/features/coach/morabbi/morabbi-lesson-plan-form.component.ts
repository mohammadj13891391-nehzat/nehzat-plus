import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MorabbiApiService } from './morabbi-api.service';
import { Branch, CreateLessonPlanPayload, LessonPlan, TargetStatus } from './morabbi.models';

interface PlanForm {
  branchId: number | null;
  title: string;
  subject: string;
  grade: string;
  sessionCount: string;
  generalObjective: string;
  objectives: string;
  behavioralObjectives: string;
  subHeadings: string;
  prerequisites: string;
  diagnosticEvaluation: string;
  preparationPhase: string;
  introductionPhase: string;
  presentationPhase: string;
  summaryPhase: string;
  evaluationPhase: string;
  supplementaryActivities: string;
  teachingMethod: string;
  teachingAids: string;
  evaluationQuestions: string;
  contentOutline: string;
  evaluationMethod: string;
  quranRefs: string;
  hadithRefs: string;
  sources: string;
  planType: string;
  approach: string;
  traineeCount: string;
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

interface FieldDef {
  key: keyof PlanForm;
  label: string;
  ta?: boolean;
}

interface SectionDef {
  title: string;
  fields: FieldDef[];
}

const SECTIONS: SectionDef[] = [
  {
    title: 'حوزه‌های عمومی',
    fields: [
      { key: 'generalObjective', label: 'هدف کلی', ta: true },
      { key: 'objectives', label: 'اهداف (با ویرگول جدا کنید)' },
      { key: 'behavioralObjectives', label: 'اهداف رفتاری', ta: true },
      { key: 'subHeadings', label: 'زیرمباحث', ta: true },
      { key: 'prerequisites', label: 'پیش‌نیازها', ta: true },
      { key: 'diagnosticEvaluation', label: 'ارزیابی تشخیصی' }
    ]
  },
  {
    title: 'حوزه‌های اجرایی',
    fields: [
      { key: 'preparationPhase', label: 'مرحله آمادگی', ta: true },
      { key: 'introductionPhase', label: 'مرحله مقدمه‌سازی', ta: true },
      { key: 'presentationPhase', label: 'مرحله ارائه', ta: true },
      { key: 'summaryPhase', label: 'مرحله جمع‌بندی', ta: true },
      { key: 'evaluationPhase', label: 'مرحله ارزشیابی', ta: true },
      { key: 'supplementaryActivities', label: 'فعالیت‌های تکمیلی', ta: true }
    ]
  },
  {
    title: 'روش تدریس',
    fields: [
      { key: 'teachingMethod', label: 'روش تدریس' },
      { key: 'teachingAids', label: 'وسایل کمک‌آموزشی' },
      { key: 'evaluationQuestions', label: 'سؤالات ارزشیابی', ta: true },
      { key: 'contentOutline', label: 'طرح محتوا', ta: true },
      { key: 'evaluationMethod', label: 'روش ارزشیابی' }
    ]
  },
  {
    title: 'منابع',
    fields: [
      { key: 'quranRefs', label: 'ارجاعات قرآنی (با ویرگول جدا کنید)' },
      { key: 'hadithRefs', label: 'ارجاعات حدیثی (با ویرگول جدا کنید)' },
      { key: 'sources', label: 'منابع (با ویرگول جدا کنید)' }
    ]
  },
  {
    title: 'مراحل اجرا',
    fields: [
      { key: 'stagePresentation', label: 'ارائه', ta: true },
      { key: 'stageThinking', label: 'تفکر', ta: true },
      { key: 'stageDiscussion', label: 'بحث و گفت‌وگو', ta: true },
      { key: 'stageReporting', label: 'گزارش‌گیری', ta: true },
      { key: 'groupEndurance', label: 'گروهی — استقامت' },
      { key: 'groupSemiSpeed', label: 'گروهی — نیم‌سریع' },
      { key: 'groupSpeed', label: 'گروهی — سریع' },
      { key: 'evaluationSelf', label: 'ارزیابی خود', ta: true }
    ]
  }
];

const emptyForm = (): PlanForm => ({
  branchId: null,
  title: '',
  subject: '',
  grade: '',
  sessionCount: '1',
  generalObjective: '',
  objectives: '',
  behavioralObjectives: '',
  subHeadings: '',
  prerequisites: '',
  diagnosticEvaluation: '',
  preparationPhase: '',
  introductionPhase: '',
  presentationPhase: '',
  summaryPhase: '',
  evaluationPhase: '',
  supplementaryActivities: '',
  teachingMethod: '',
  teachingAids: '',
  evaluationQuestions: '',
  contentOutline: '',
  evaluationMethod: '',
  quranRefs: '',
  hadithRefs: '',
  sources: '',
  planType: 'biweekly',
  approach: '',
  traineeCount: '0',
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
  selector: 'app-lesson-plan-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ editId() ? 'ویرایش طرح درس' : 'طرح درس جدید' }}</h1>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>

    <form (ngSubmit)="submit()" *ngIf="ready(); else loading">
      <div class="card">
        <h3 class="card-title">مشخصات اصلی</h3>
        <div class="grid-2">
          <div class="field">
            <label>عنوان طرح *</label>
            <input name="title" [(ngModel)]="form.title" required />
          </div>
          <div class="field">
            <label>موضوع</label>
            <input name="subject" [(ngModel)]="form.subject" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>پایه / سطح</label>
            <input name="grade" [(ngModel)]="form.grade" />
          </div>
          <div class="field">
            <label>تعداد جلسات</label>
            <input name="sessionCount" type="number" min="1" [(ngModel)]="form.sessionCount" dir="ltr" />
          </div>
        </div>
        <div class="field" *ngIf="showBranch">
          <label>شعبه</label>
          <select name="branchId" [(ngModel)]="form.branchId">
            <option [ngValue]="null">انتخاب کنید</option>
            <option *ngFor="let b of branches()" [ngValue]="b.id">{{ b.name }}</option>
          </select>
        </div>
      </div>

      <div class="card" *ngFor="let s of sections" style="margin-top: 16px">
        <h3 class="card-title">{{ s.title }}</h3>
        <div class="grid-2">
          <div class="field" *ngFor="let f of s.fields">
            <label>{{ f.label }}</label>
            <textarea *ngIf="f.ta" [name]="f.key" [(ngModel)]="form[f.key]"></textarea>
            <input *ngIf="!f.ta" [name]="f.key" [(ngModel)]="form[f.key]" />
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 16px">
        <h3 class="card-title">سایر</h3>
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
        <button class="btn" [disabled]="busy()">{{ editId() ? 'ذخیره تغییرات' : 'ثبت طرح' }}</button>
      </div>
    </form>

    <ng-template #loading>
      <div class="card"><div class="empty">در حال بارگذاری...</div></div>
    </ng-template>
  `
})
export class MorabbiLessonPlanFormComponent implements OnInit {
  private readonly auth = inject(MorabbiApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly sections = SECTIONS;
  readonly editId = signal<number | null>(null);
  readonly ready = signal(false);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly branches = signal<Branch[]>([]);
  readonly showBranch = signal(false);
  form: PlanForm = emptyForm();

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
      this.auth.getLessonPlan(id).subscribe({
        next: (p) => this.fillFromPlan(p),
        error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت طرح')
      });
    } else {
      this.ready.set(true);
    }
    this.showBranch.set(this.auth.isStaff());
  }

  cancel(): void {
    if (this.editId()) this.router.navigate(['/coach/lesson-plans', this.editId()]);
    else this.router.navigate(['/coach/lesson-plans']);
  }

  submit(): void {
    const f = this.form;
    const payload: CreateLessonPlanPayload = {
      title: f.title.trim(),
      subject: f.subject || null,
      grade: f.grade || null,
      sessionCount: Number(f.sessionCount) || 1,
      generalObjective: f.generalObjective || null,
      objectives: this.toRefs(f.objectives),
      behavioralObjectives: f.behavioralObjectives || null,
      subHeadings: f.subHeadings || null,
      prerequisites: f.prerequisites || null,
      diagnosticEvaluation: f.diagnosticEvaluation || null,
      preparationPhase: f.preparationPhase || null,
      introductionPhase: f.introductionPhase || null,
      presentationPhase: f.presentationPhase || null,
      summaryPhase: f.summaryPhase || null,
      evaluationPhase: f.evaluationPhase || null,
      supplementaryActivities: f.supplementaryActivities || null,
      teachingMethod: f.teachingMethod || null,
      teachingAids: f.teachingAids || null,
      evaluationQuestions: f.evaluationQuestions || null,
      contentOutline: f.contentOutline || null,
      evaluationMethod: f.evaluationMethod || null,
      quranRefs: this.toRefs(f.quranRefs),
      hadithRefs: this.toRefs(f.hadithRefs),
      sources: this.toRefs(f.sources),
      planType: f.planType || 'biweekly',
      approach: f.approach || null,
      traineeCount: Number(f.traineeCount) || 0,
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
    if (this.showBranch()) {
      payload.branchId = f.branchId;
    }

    this.busy.set(true);
    this.error.set(null);
    const obs = this.editId() ? this.auth.updateLessonPlan(this.editId()!, payload) : this.auth.createLessonPlan(payload);
    obs.subscribe({
      next: (res) => this.router.navigate(['/coach/lesson-plans', res.lessonPlan.id]),
      error: (err) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? 'خطا در ذخیره طرح');
      }
    });
  }

  private fillFromPlan(p: LessonPlan): void {
    this.form = {
      branchId: p.branchId,
      title: p.title,
      subject: p.subject ?? '',
      grade: p.grade ?? '',
      sessionCount: String(p.sessionCount),
      generalObjective: p.generalObjective ?? '',
      objectives: this.toCsv(p.objectives),
      behavioralObjectives: p.behavioralObjectives ?? '',
      subHeadings: p.subHeadings ?? '',
      prerequisites: p.prerequisites ?? '',
      diagnosticEvaluation: p.diagnosticEvaluation ?? '',
      preparationPhase: p.preparationPhase ?? '',
      introductionPhase: p.introductionPhase ?? '',
      presentationPhase: p.presentationPhase ?? '',
      summaryPhase: p.summaryPhase ?? '',
      evaluationPhase: p.evaluationPhase ?? '',
      supplementaryActivities: p.supplementaryActivities ?? '',
      teachingMethod: p.teachingMethod ?? '',
      teachingAids: p.teachingAids ?? '',
      evaluationQuestions: p.evaluationQuestions ?? '',
      contentOutline: p.contentOutline ?? '',
      evaluationMethod: p.evaluationMethod ?? '',
      quranRefs: this.toCsv(p.quranRefs),
      hadithRefs: this.toCsv(p.hadithRefs),
      sources: this.toCsv(p.sources),
      planType: p.planType || 'biweekly',
      approach: p.approach ?? '',
      traineeCount: String(p.traineeCount),
      stagePresentation: p.stagePresentation ?? '',
      stageThinking: p.stageThinking ?? '',
      stageDiscussion: p.stageDiscussion ?? '',
      stageReporting: p.stageReporting ?? '',
      groupEndurance: p.groupEndurance ?? '',
      groupSemiSpeed: p.groupSemiSpeed ?? '',
      groupSpeed: p.groupSpeed ?? '',
      evaluationSelf: p.evaluationSelf ?? '',
      status: p.status ?? 'DRAFT'
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
}
