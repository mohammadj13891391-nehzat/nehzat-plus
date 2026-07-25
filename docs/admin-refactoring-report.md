# گزارش بازآفرینی ادمین پنل (Admin Refactoring)

**تاریخ:** ۲۱ جولای ۲۰۲۶  
**پروژه:** Nehzat Plus (Lesson Planner)  
**فایل هدف:** `frontend/src/app/features/admin/admin.component.ts` (~۲۳۷۵ خط)

---

## 🎯 هدف

شکستن کامپوننت غول‌آسای `admin.component.ts` به ۸ زیرکامپوننت مجزا و مستقل، کاهش حجم شل، و افزایش قابلیت نگهداری.

---

## ✅ کارهای انجام شده

### ۱. آنالیز و نقشه راه

- بررسی ساختار `admin.component.ts` با ~۲۳۷۵ خط
- بررسی `admin.component.html` با ~۲۳۰۸ خط
- شناسایی ۸ دامنه مجزا برای استخراج
- تعیین مرزهای استخراج (هر زیرکامپوننت سرویس‌ها را مستقیماً تزریق می‌کند، نه از طریق `@Input`/`@Output`)

### ۲. ایجاد ۸ زیرکامپوننت

| ردیف | کامپوننت | مسیر | وظایف |
|------|----------|------|-------|
| ۱ | `AdminStudentsComponent` | `admin-students/` | CRUD دانش‌آموزان، مودال فرم، جستجو |
| ۲ | `AdminCoachesComponent` | `admin-coaches/` | CRUD مربیان، مودال فرم، جستجو |
| ۳ | `AdminBranchManagersComponent` | `admin-branch-managers/` | CRUD مدیران شعبه، dropdown شعبه |
| ۴ | `AdminParentsComponent` | `admin-parents/` | CRUD والدین، نمایش اطلاعات دانش‌آموز |
| ۵ | `AdminEvaluatorsComponent` | `admin-evaluators/` | CRUD ارزیابان + بخش سوابق ارزیابی |
| ۶ | `AdminHeadquartersComponent` | `admin-headquarters/` | داشبورد ستاد با ۳ تب (خلاصه، شعب، مربیان) |
| ۷ | `AdminMakatibComponent` | `admin-makatib/` | سیستم ۲ تَب: CRUD مکتب + CRUD شعب مکتوب |
| ۸ | `AdminCoursesComponent` | `admin-courses/` | CRUD دوره با کد، مدرس، واحد، ظرفیت، تاریخ |

تمامی زیرکامپوننت‌ها:
- **Standalone**: بدون نیاز به NgModule
- **OnPush**: `ChangeDetectionStrategy.OnPush`
- **تزریق مستقیم**: `inject(LESSON_PLANNER_API)`
- **دارای `FormsModule`**: برای `ngModel` در جستجو

### ۳. بازنویسی شل (Shell)

| فایل | قبل | بعد |
|------|-----|-----|
| `admin.component.ts` | ~۲۳۷۵ خط | ~۹۵۹ خط |
| `admin.component.html` | ~۲۳۰۸ خط | ~۳۰۰ خط |

**تغییرات شل:**
- حذف state و متدهای مربوط به ۷ دامنه (دانش‌آموزان، مربیان، مدیران شعبه، والدین، ارزیابان، ستاد، مکاتب)
- جایگزینی ۷ بخش از تمپلیت با تگ زیرکامپوننت (`<app-admin-students />`, ...)
- نگه‌داشتن بخش دوره‌ها + تکالیف + پیوست‌ها + ثبت‌نام + کد دعوت در شل (برای استخراج بعدی)
- بخش مکاتب: تمام مقادیر `activeMenu` مربوط به مکتب به `<app-admin-makatib />` هدایت شده

### ۴. رفع خطاهای بیلد

| مشکل | فایل | راه‌حل |
|------|------|--------|
| `Madrasah.description` وجود ندارد | `admin-makatib.component.ts` | جایگزینی با `key`, `label`, `gender`, `grade`, `capacity` |
| `capacity`, `sessions`, `coachId` در `Course` وجود ندارد | `admin-courses.component.ts` | بازنویسی کامل با اینترفیس صحیح `Course`/`CreateCoursePayload` |
| `uploadCourseAttachment`, `deleteCourseAttachment` در API وجود ندارد | `admin-courses.component.ts` | حذف متدهای پیوست (API فقط پیوست سطح تکلیف دارد) |
| `import path` اشتباه (`../../core/`) | تمام زیرکامپوننت‌ها | اصلاح به `../../../core/` |
| implicit `any` در callbackها | `admin-courses.component.ts` | افزودن تایپ صریح به پارامترها |
| `AdminCoursesComponent` ایمپورت شده ولی استفاده نشده | `admin.component.ts` | حذف ایمپورت unused |

### ۵. بیلد نهایی

```
ng build --configuration=development
✅ Application bundle generation complete.
✅ Zero errors, zero warnings.
```

---

## ⏳ کارهای باقی‌مانده (پیشنهادی)

### اولویت بالا

- [ ] **استخراج بخش دوره‌ها از شل**: بخش Course CRUD داخل شل هنوز inline است. `AdminCoursesComponent` ساخته و آماده است ولی نیاز به جابجایی منطق تکالیف، ثبت‌نام و کد دعوت همزمان دارد.

### اولویت متوسط

- [ ] **تست کامپوننت‌ها**: نوشتن تست واحد (Vitest) برای زیرکامپوننت‌های جدید
- [ ] **بررسی `OnPush` در زیرکامپوننت‌ها**: اطمینان از اینکه همه زیرکامپوننت‌ها به درستی `markForCheck()` را صدا می‌زنند
- [ ] **بررسی `<app-admin-courses />`**: یا حذف کامل از کامپوننت و بیلد و یا تصمیم‌گیری برای استخراج

### اولویت پایین

- [ ] **هماهنگی استایل**: زیرکامپوننت‌ها از کلاس‌های CSS شل استفاده می‌کنند — در آینده می‌توان استایل‌های اختصاصی هر کدام را جدا کرد
- [ ] **بارگذاری تنبل (lazy loading)**: زیرکامپوننت‌ها داخل lazy route `admin` هستند، اما خود شل هم lazy است — نیازی به تغییر نیست

---

## ساختار نهایی فایل‌ها

```
frontend/src/app/features/admin/
├── admin.component.ts              # ~959 خط (شل)
├── admin.component.html            # ~300 خط (تمپلیت)
├── admin.component.scss            # استایل‌ها
├── admin.routes.ts                 # lazy route
├── admin-students/                 # زیرکامپوننت دانش‌آموزان
├── admin-coaches/                  # زیرکامپوننت مربیان
├── admin-branch-managers/          # زیرکامپوننت مدیران شعبه
├── admin-parents/                  # زیرکامپوننت والدین
├── admin-evaluators/               # زیرکامپوننت ارزیابان
├── admin-headquarters/             # زیرکامپوننت ستاد
├── admin-makatib/                  # زیرکامپوننت مکاتب
└── admin-courses/                  # زیرکامپوننت دوره‌ها (ساخته شده، استفاده نشده)
```

---

## نکات فنی

- **نسخه Angular**: 21 (standalone)
- **استراتژی تغییر**: `ChangeDetectionStrategy.OnPush`
- **API Token**: `LESSON_PLANNER_API` (اینترفیس) — مستقیماً در زیرکامپوننت‌ها تزریق می‌شود
- **مدل‌ها**: `models/lesson-planner.models.ts` (~۷۰۰ خط)
- **زبان تمپلیت**: Angular `@for`, `@if` (control flow syntax)
