# گزارش وضعیت صفحات و لایه‌ها — Nehzat Plus (Lesson Planner)

**تاریخ:** 2026-07-20
**روش:** اسکن واقعی فایل‌ها (PowerShell) — نه حدس

---

## ۱. لایه فرانت‌اند (Angular 21 — Standalone Components)

### صفحات اصلی (`features/`)
| صفحه | HTML | TS Files | خطوط TS | وضعیت |
|------|------|----------|---------|--------|
| **coach** | ۲ | ۵ | ~۱۲۰۰ | **کامل** |
| **parent** | ۳ | ۴ | ~۸۰۰ | **کامل** — ۳ کامپوننت استخراج‌شده + زیرصفحه جزئیات دانش‌آموز + HTML/SCSS جداگانه |
| **branch-manager** | ۰ | ۲ | ۶۰۵ | **نیمه‌کاره** — استاب پیشرفته |
| **evaluator** | ۰ | ۲ | ۶۰۵ | **نیمه‌کاره** — ارجاع به assessment-panel |
| **headquarters** | ۰ | ۴ | ۱۲۷۹ | **پیشرفته‌ترین استاب** — ۴ فایل TS (داشبورد، نمودار، مدیریت) |
| **dashboard** | ۱ | ۳ | ۵۶۹ | **کامل** — shell + assessment-taker + training-steps + HTML/SCSS جداگانه |
| **admin** | ۱ | ۳ | ۹۲۴ | **بزرگ** — HTML/SCSS جداگانه، هنوز غول‌آسا |

### کامپوننت‌های مشترک (`features/shared/`)
| کامپوننت | خطوط | کاربرد |
|-----------|------|-------|
| `assessment-panel` | ۵۳۱ | پنل تولید/نمایش ارزیابی (مصرف evaluator/dashboard) |
| `spiritual-history-panel` | ۱۱۶ | تاریخچه معنوی/عبادی |
| `spiritual-occasion-panel` | ۱۸۱ | مناسبت‌های معنوی |
| `spiritual-path-panel` | ۱۴۳ | مسیر معنوی |
| `spiritual-shell` | ۳۱۲ | پوسته مسیرهای معنوی |
| `persian-date-input` | ۱۳۴ | ورودی تاریخ شمسی |
| `role-stub` | ۱۰۵ | نمایش عدم دسترسی |

**نکته مهم:** تمام صفحات **هنوز HTML ندارند** (به جز dashboard/admin) — یعنی templateها درون‌خطی (inline) هستند یا در حال توسعه.

---

## ۲. لایه بک‌اند (ASP.NET Core 10 — Clean Architecture)

### کنترلرهای API (۲۵ کنترلر)
| گروه | کنترلرها | تعداد |
|------|-----------|-------|
| **Admin (ششده شده)** | AdminBranches, AdminBranchManagers, AdminCoaches, AdminCourses, AdminEvaluators, AdminParents, AdminStatistics, AdminStudents | ۸ |
| **دامنه اصلی** | Assessment, Auth, Course, Curriculum, CurriculumVersion, Leagues, Madrasah, MonthlyBooklet, Progression, Rings, Seeder, SkillProgress, SpiritualCatalog, SpiritualEntry, SpiritualOccasion, SpiritualPath, Student, Teacher, UserManagement | ۱۹ |
| **Competitions** | Competitions | ۱ |

**مجموع:** ۲۵ کنترلر — **AdminController غول‌آسا قبلاً به ۸ زیرکنترلر تقسیم شده** (خبر خوب).

---

## ۳. لایه داده و سرویس (Clean Architecture Layers)

### Domain Entities (Domain/Entities)
- موجودیت‌های اصلی: User, Student, Coach, Parent, BranchManager, Evaluator, Headquarters
- موجودیت‌های آموزشی: Course, Assignment, AssignmentSubmission, Assessment, AssessmentQuestion, AssessmentResult
- موجودیت‌های معنوی: SpiritualPath, SpiritualOccasion, SpiritualEntry
- موجودیت‌های ساختاری: Branch, Madrasah, Curriculum, CurriculumVersion

### Application Interfaces (Application/Interfaces)
- ۱۰+ اینترفیس سرویس (IUserService, IStudentService, ICoachService, IParentService, IBranchManagerService, IEvaluatorService, IHeadquartersService, ICourseService, IAssessmentService, ISpiritualService)

### Infrastructure Services (Infrastructure/Services)
- پیاده‌سازی‌های تمام اینترفیس‌ها
- Refit clients برای OTUH2
- Seeders برای داده‌های اولیه

---

## ۴. وضعیت لایه‌ها به تفکیک صفحة

### Coach (۸۳۰ خط / ۳ فایل)
```
features/coach/
├── coach.component.ts          # اصلی
├── coach.routes.ts             # مسیریابی
└── coach-dashboard/            # زیرصفحه داشبورد مربی
    └── coach-dashboard.component.ts
```
- **لایه‌ها:** Component → AuthService (hasRole) → LessonPlannerApi (getStudents, getStudentProgress)
- **نیاز:** جداسازی HTML + SCSS

### Parent (~۸۰۰ خط / ۴ فایل TS + ۳ HTML + ۳ SCSS)
```
features/parent/
├── parent-panel.component.ts/html/scss      # پنل اصلی والد + لیست فرزندان
├── student-progress-card.component.ts/html/scss  # کارت پیشرفت هر فرزند
├── monthly-booklet.component.ts/html/scss   # مشاهده جزوات ماهانه
├── parent-student-detail.component.ts/html/scss  # جزئیات فرزند + تکالیف/نمرات
└── parent.routes.ts                         # مسیریابی
```
- **لایه‌ها:** Component → LessonPlannerApi (getParentStudents, getAssignmentProgress, getStudentAssessmentResults)
- **کامل** — جداسازی HTML/SCSS، ۳ کامپوننت استخراج‌شده + زیرصفحه جزئیات

### Branch-Manager (۶۰۵ خط / ۲ فایل)
- Component اصلی + routes
- نیاز به: داشبورد عملکرد شعبه، مدیریت مربیان/دانش‌آموزان

### Evaluator (۶۰۵ خط / ۲ فایل)
- مسیر به `AssessmentPanelComponent` متصل
- **مشترک:** assessment-panel (۵۳۱ خط) — ابزار تولید/نمایش ارزیابی

### Headquarters (۱۲۷۹ خط / ۴ فایل)
```
features/headquarters/
├── headquarters.component.ts
├── headquarters.routes.ts
├── headquarters-dashboard/     # خلاصه سیستم + نمودارها
└── headquarters-management/    # مدیریت مراکز
```
- **پیشرفته‌ترین استاب** — ۴ فایل جداگانه

### Dashboard (۵۶۹ خط / ۳ فایل + ۱ HTML + ۱ SCSS)
```
features/dashboard/
├── dashboard.component.ts/html/scss
├── dashboard.routes.ts
├── assessment-taker/           # شرکت در آزمون
│   └── assessment-taker.component.ts
└── dashboard-training-steps/   # گام‌های آموزشی
    └── dashboard-training-steps.component.ts/html
```
- **کامل‌ترین صفحه** — جداسازی کامل HTML/SCSS، OnPush

### Admin (۹۲۴ خط / ۳ فایل + ۱ HTML + ۱ SCSS)
```
features/admin/
├── admin.component.ts/html/scss
├── admin.routes.ts
├── admin-shell.component.ts    # پوسته تب‌محور
```
- **بزرگ‌ترین چالش** — ۲۵ کنترلر Admin در بک‌اند، فایل فرانت ۹۲۴ خط
- **نیاز:** استخراج زیرکامپوننت‌ها (Users, Courses, Branches, Assessments, Spiritual)

---

## ۵. لایه‌های اشتراکی و زیرساختی

### Core Services (`core/services/`)
| سرویس | نقش |
|--------|------|
| `AuthService` | hasRole(), token management, login/logout |
| `LessonPlannerApi` (interface) | قرارداد API — ۲۰۰+ متد |
| `HttpLessonPlannerApiService` | پیاده‌سازی HTTP واقعی |
| `MockLessonPlannerApiService` | Mock برای توسعه (۱۵۵۵ خط) |
| `HttpOtuh2ApiService` | OTUH2 service-to-service |
| `NotificationService` | Toast/پیام‌ها |

### Guards (`core/guards/`)
- `authGuard` — ریدایرکت به OTUH2
- `adminGuard` — hasRole('admin')
- `roleGuard('role')` — محافظت نقش‌محور

### Models (`core/models/`)
- `lesson-planner.models.ts` — ~۷۰۰ خط، تمام DTOها
- `otuh2.models.ts` — مدل‌های OTUH2

---

## ۶. خلاصه اولویت‌ها

| اولویت | مورد | دلیل |
|--------|------|------|
| **۱** | جداسازی HTML/SCSS برای ۵ صفحه (coach/parent/branch/evaluator/hq) | استانداردسازی، OnPush |
| **۲** | تکمیل زیرصفحه‌های parent/branch-manager/evaluator/hq | منطق کسب‌وکار |
| **۳** | استخراج زیرکامپوننت از admin (Users, Courses, Branches, Spiritual) | کاهش ۹۲۴ خط |
| **۴** | تقسیم assessment-panel به creator/viewer | جلوگیری از landmine جدید |
| **۵** | تست دسترسی منفی در تمام صفحات | امنیت |

---

## ۷. متریک‌ها
- **کل فایل‌های TS در features/:** ~۵۸ فایل
- **کل خطوط TS در features/:** ~۵۶۰۰ خط
- **کنترلرهای بک‌اند:** ۲۵ کنترلر (Admin تقسیم شده)
- **کامپوننت‌های shared:** ۷ کامپوننت قابل tái استفاده
- **API Interface:** ۲۰۰+ متد تعریف‌شده

---

**نتیجه:** پروژه در حالت **"نصفه‌کاره پیشرفته"** است — بک‌اند کامل و تمیز، فرانت‌اند بک‌اندها را دارد اما UI لایه‌های ۵ صفحه اصلی همچنان inline template است و نیاز به تکمیل دارد. Admin و Dashboard تنها صفحات با HTML/SCSS جداگانه هستند.