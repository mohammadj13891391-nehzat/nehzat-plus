import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MorabbiApiService } from './morabbi-api.service';
import { Evaluation, EvaluationCriteria, LessonPlan } from './morabbi.models';
import { formatDate as formatDateFn, parseJsonList, parseJsonRecord, statusLabel as statusLabelFn } from './morabbi-labels';

@Component({
  selector: 'app-lesson-plan-detail',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">طرح درس: {{ plan()?.title ?? '...' }}</h1>
      <div class="toolbar">
        <span class="badge badge-{{ plan()?.status || 'draft' }}">{{ statusLabel(plan()?.status) }}</span>
        <button *ngIf="canEdit()" class="btn btn-secondary btn-sm" (click)="router.navigate(['/coach/lesson-plans', id(), 'edit'])">ویرایش</button>
        <button *ngIf="canReturn()" class="btn btn-danger btn-sm" (click)="returnMode.set(!returnMode())">
          {{ returnMode() ? 'انصراف' : 'بازگردانی' }}
        </button>
      </div>
    </div>

    <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>
    <div class="alert alert-success" *ngIf="info()">{{ info() }}</div>

    <div class="card" *ngIf="returnMode()">
      <h3 class="card-title">بازگردانی طرح درس</h3>
      <div class="field">
        <label>توضیحات / دلایل بازموردانی</label>
        <textarea [(ngModel)]="returnComment" name="returnComment"></textarea>
      </div>
      <button class="btn btn-danger btn-sm" [disabled]="busy()" (click)="doReturn()">تأیید بازموردانی</button>
    </div>

    <div class="card" *ngIf="plan()">
      <dl class="kv">
        <dt>موضوع</dt><dd>{{ plan()!.subject || '—' }}</dd>
        <dt>پایه / سطح</dt><dd>{{ plan()!.grade || '—' }}</dd>
        <dt>تعداد جلسات</dt><dd>{{ plan()!.sessionCount }}</dd>
        <dt>مربی</dt><dd>{{ plan()!.instructor?.name ?? '—' }}</dd>
        <dt>شعبه</dt><dd>{{ plan()!.branch?.name ?? '—' }}</dd>
        <dt>هدف کلی</dt><dd>{{ plan()!.generalObjective || '—' }}</dd>
        <dt>اهداف</dt><dd>{{ objectives().length ? objectives().join('، ') : '—' }}</dd>
        <dt>اهداف رفتاری</dt><dd>{{ plan()!.behavioralObjectives || '—' }}</dd>
        <dt>زیرمباحث</dt><dd>{{ plan()!.subHeadings || '—' }}</dd>
        <dt>پیش‌نیازها</dt><dd>{{ plan()!.prerequisites || '—' }}</dd>
        <dt>ارزیابی تشخیصی</dt><dd>{{ plan()!.diagnosticEvaluation || '—' }}</dd>
        <dt>روش تدریس</dt><dd>{{ plan()!.teachingMethod || '—' }}</dd>
        <dt>وسایل کمک‌آموزشی</dt><dd>{{ plan()!.teachingAids || '—' }}</dd>
        <dt>روش ارزشیابی</dt><dd>{{ plan()!.evaluationMethod || '—' }}</dd>
        <dt>ارجاعات قرآنی</dt><dd>{{ quranRefs().length ? quranRefs().join('، ') : '—' }}</dd>
        <dt>ارجاعات حدیثی</dt><dd>{{ hadithRefs().length ? hadithRefs().join('، ') : '—' }}</dd>
        <dt>منابع</dt><dd>{{ sources().length ? sources().join('، ') : '—' }}</dd>
        <dt>نتیجه ارزیابی</dt><dd>{{ plan()!.evaluationResult || '—' }}</dd>
        <dt>تاریخ ارزیابی</dt><dd>{{ formatDate(plan()!.evaluatedAt) }}</dd>
      </dl>
    </div>

    <div class="card" style="margin-top: 16px" *ngIf="plan()">
      <div class="section-title">حوزه‌های اجرایی</div>
      <dl class="kv">
        <dt>مرحله آمادگی</dt><dd>{{ plan()!.preparationPhase || '—' }}</dd>
        <dt>مرحله مقدمه‌سازی</dt><dd>{{ plan()!.introductionPhase || '—' }}</dd>
        <dt>مرحله ارائه</dt><dd>{{ plan()!.presentationPhase || '—' }}</dd>
        <dt>مرحله جمع‌بندی</dt><dd>{{ plan()!.summaryPhase || '—' }}</dd>
        <dt>مرحله ارزشیابی</dt><dd>{{ plan()!.evaluationPhase || '—' }}</dd>
        <dt>فعالیت‌های تکمیلی</dt><dd>{{ plan()!.supplementaryActivities || '—' }}</dd>
        <dt>سؤالات ارزشیابی</dt><dd>{{ plan()!.evaluationQuestions || '—' }}</dd>
        <dt>طرح محتوا</dt><dd>{{ plan()!.contentOutline || '—' }}</dd>
      </dl>
    </div>

    <div class="card" style="margin-top: 16px" *ngIf="plan()">
      <div class="section-title">مراحل اجرا</div>
      <dl class="kv">
        <dt>ارائه</dt><dd>{{ plan()!.stagePresentation || '—' }}</dd>
        <dt>تفکر</dt><dd>{{ plan()!.stageThinking || '—' }}</dd>
        <dt>بحث و گفت‌وگو</dt><dd>{{ plan()!.stageDiscussion || '—' }}</dd>
        <dt>گزارش‌گیری</dt><dd>{{ plan()!.stageReporting || '—' }}</dd>
        <dt>گروهی — استقامت</dt><dd>{{ plan()!.groupEndurance || '—' }}</dd>
        <dt>گروهی — نیم‌سریع</dt><dd>{{ plan()!.groupSemiSpeed || '—' }}</dd>
        <dt>گروهی — سریع</dt><dd>{{ plan()!.groupSpeed || '—' }}</dd>
        <dt>ارزیابی خود</dt><dd>{{ plan()!.evaluationSelf || '—' }}</dd>
      </dl>
    </div>

    <div class="card" style="margin-top: 16px" *ngIf="canEvaluate()">
      <h3 class="card-title">{{ editingEvalId() ? 'ویرایش ارزیابی' : 'ارزیابی جدید' }}</h3>
      <div *ngIf="criteria().length === 0" class="empty">معیار ارزیابی تعریف نشده است.</div>
      <div *ngFor="let c of criteria()" class="field" style="display: flex; align-items: center; gap: 10px">
        <label style="flex: 1; margin: 0">{{ c.title }} <small>({{ c.weight }})</small></label>
        <input
          style="width: 90px"
          type="number"
          min="0"
          max="100"
          [ngModel]="scores()[c.id] ?? 0"
          (ngModelChange)="setScore(c.id, $event)"
        />
      </div>
      <div class="field">
        <label>دیدگاه کلی</label>
        <textarea [(ngModel)]="overallComment" name="overallComment"></textarea>
      </div>
      <div class="field">
        <label>وضعیت ارزیابی</label>
        <select [(ngModel)]="evalStatus" name="evalStatus">
          <option value="DRAFT">پیش‌نویس</option>
          <option value="FINAL">نهایی (تأیید طرح)</option>
          <option value="REVISED">اصلاح‌شده</option>
        </select>
      </div>
      <div style="display: flex; gap: 8px">
        <button class="btn btn-sm" [disabled]="busy()" (click)="saveEvaluation()">
          {{ editingEvalId() ? 'ذخیره ارزیابی' : 'ثبت ارزیابی' }}
        </button>
        <button *ngIf="editingEvalId()" class="btn btn-secondary btn-sm" (click)="resetEvalForm()">آغاز ارزیابی جدید</button>
      </div>
    </div>

    <div class="card" style="margin-top: 16px" *ngIf="evaluations().length > 0">
      <h3 class="card-title">سابقه ارزیابی</h3>
      <table class="lp-table">
        <thead>
          <tr>
            <th>ارزیاب</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
            <th>دیدگاه کلی</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let e of evaluations()">
            <td>{{ e.evaluator?.name ?? '—' }}</td>
            <td>{{ formatDate(e.updatedAt) }}</td>
            <td><span class="badge">{{ e.status }}</span></td>
            <td>{{ e.overallComment || '—' }}</td>
            <td>
              <button *ngIf="canEvaluate()" class="btn btn-secondary btn-sm" (click)="editEvaluation(e)">ویرایش</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class MorabbiLessonPlanDetailComponent implements OnInit {
  readonly auth = inject(MorabbiApiService);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly statusLabel = statusLabelFn;
  readonly formatDate = formatDateFn;

  readonly id = signal<number>(0);
  readonly plan = signal<LessonPlan | null>(null);
  readonly criteria = signal<EvaluationCriteria[]>([]);
  readonly evaluations = signal<Evaluation[]>([]);
  readonly scores = signal<Record<number, number>>({});
  readonly editingEvalId = signal<number | null>(null);
  readonly returnMode = signal(false);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);
  readonly objectives = signal<string[]>([]);
  readonly quranRefs = signal<string[]>([]);
  readonly hadithRefs = signal<string[]>([]);
  readonly sources = signal<string[]>([]);

  overallComment = '';
  evalStatus = 'DRAFT';
  returnComment = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(id);
    this.load();
  }

  canEvaluate(): boolean {
    return this.auth.canEvaluate();
  }

  canEdit(): boolean {
    const p = this.plan();
    const u = this.auth.user();
    if (!p || !u) return false;
    if (this.auth.isStaff()) return true;
    return p.instructorId === u.id && (p.status === 'DRAFT' || p.status === 'RETURNED');
  }

  canReturn(): boolean {
    const p = this.plan();
    return !!p && this.auth.canEvaluate() && (p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW');
  }

  load(): void {
    const id = this.id();
    this.auth.getLessonPlan(id).subscribe({
      next: (p) => {
        this.plan.set(p);
        this.objectives.set(parseJsonList(p.objectives));
        this.quranRefs.set(parseJsonList(p.quranRefs));
        this.hadithRefs.set(parseJsonList(p.hadithRefs));
        this.sources.set(parseJsonList(p.sources));
      },
      error: (err) => this.error.set(err?.error?.message ?? 'خطا در دریافت طرح')
    });
    this.auth.getCriteria('LESSON_PLAN').subscribe({
      next: (c) => this.criteria.set(c),
      error: () => this.criteria.set([])
    });
    this.auth.getEvaluations('lesson_plan', id).subscribe({
      next: (res) => this.evaluations.set(res.evaluations ?? []),
      error: () => this.evaluations.set([])
    });
  }

  setScore(id: number, value: number): void {
    this.scores.update((s) => ({ ...s, [id]: value }));
  }

  editEvaluation(e: Evaluation): void {
    const record = parseJsonRecord(e.scores);
    this.scores.set(
      Object.fromEntries(Object.entries(record).map(([k, v]) => [Number(k), typeof v === 'number' ? v : 0]))
    );
    this.overallComment = e.overallComment ?? '';
    this.evalStatus = e.status;
    this.editingEvalId.set(e.id);
  }

  resetEvalForm(): void {
    this.scores.set({});
    this.overallComment = '';
    this.evalStatus = 'DRAFT';
    this.editingEvalId.set(null);
  }

  saveEvaluation(): void {
    const id = this.id();
    const scoresJson = JSON.stringify(this.scores());
    this.busy.set(true);
    this.error.set(null);
    if (this.editingEvalId()) {
      this.auth.updateEvaluation(this.editingEvalId()!, {
        scores: scoresJson,
        overallComment: this.overallComment || null,
        status: this.evalStatus as 'DRAFT' | 'FINAL' | 'REVISED'
      }).subscribe({
        next: () => this.onSaved(),
        error: (err) => this.fail(err)
      });
    } else {
      this.auth.createEvaluation({
        targetType: 'lesson_plan',
        targetId: id,
        scores: scoresJson,
        overallComment: this.overallComment || null,
        status: this.evalStatus
      }).subscribe({
        next: () => this.onSaved(),
        error: (err) => this.fail(err)
      });
    }
  }

  doReturn(): void {
    this.busy.set(true);
    this.error.set(null);
    this.auth.returnLessonPlan(this.id(), this.returnComment || null).subscribe({
      next: () => {
        this.busy.set(false);
        this.returnMode.set(false);
        this.returnComment = '';
        this.info.set('طرح درس بازموردانده شد.');
        this.load();
      },
      error: (err) => this.fail(err)
    });
  }

  private onSaved(): void {
    this.busy.set(false);
    this.info.set('ارزیابی ذخیره شد.');
    this.resetEvalForm();
    this.load();
  }

  private fail(err: unknown): void {
    this.busy.set(false);
    this.error.set((err as { error?: { message?: string } })?.error?.message ?? 'خطا در عملیات');
  }
}
