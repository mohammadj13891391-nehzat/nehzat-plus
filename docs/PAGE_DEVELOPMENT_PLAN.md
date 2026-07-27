# نقشه توسعه صفحات — Nehzat Plus (Lesson Planner) — نسخه فنی‌بازبینی‌شده

**تاریخ بازبینی:** 2026-07-18
**مبنا:** بازخوانی واقعی کد بک‌اند (کنترلرها) و `assessment-panel.component.ts`
**هدف:** واگذاری تکمیل هر صفحه به یک توسعه‌دهنده، بدون تداخل کار.

---

## ✅ وضعیت واقعی لایه API (تأیید‌شده از بک‌اند)

تمام متدهای زیر **در بک‌اند پیاده‌سازی شده‌اند** (نه فقط در interface):

| دامنه | متدهای واقعی در بک‌اند |
|------|------------------------|
| دانش‌آموزان | `GetAllStudents`, `GetProgress`, `GetAssignmentProgress`, `GetSubmissions` |
| والدین | `GetAllParents`, `GetParentStudents` |
| مربیان | `GetAllCoaches` |
| مدیران شعبه | `GetAllBranchManagers`, `GetAllBranches` |
| ارزیاب‌ها | `GetAllEvaluators` |
| ارزیابی‌ها | `GetAll`, `GetByCourse`, `GetByCourseAndDateRange`, `GetByStatus`, `GetQuestions`, `GetResults`, `GetResultsByStudent`, `GetAnalytics`, `GetStudentHistory` |
| آمار | `GetStatistics`, `GetCourseStatistics` |

**نتیجه:** هیچ هدر توخالی نیست — تمام صفحات می‌توانند موازی شروع شوند.

---

## ⚠️ کشف مهم درباره `assessment-panel`

`features/shared/assessment-panel/assessment-panel.component.ts` (۵۶۸ خط) یک پنل **مدیریت/تولید ارزیابی** است:
- دارد: `generateWeeklyAssessment`, `publishAssessment`, `deleteAssessment`, نمایش سوالات و نتایج
- **ندارد:** ثبت نمره دانش‌آموز توسط دانش‌آموز (`submitAssessmentResult`)

**تصحیح نقشه قبلی:** متد `submitAssessmentResult` متعلق به **دانش‌آموز در dashboard** است، نه ارزیاب.
ارزیاب باید از `getEvaluationRecords` + `createEvaluation` استفاده کند (ثبت ارزیابی توسط انسان، نه تولید هوشمند).

---

## قوانین مشترک (پیش از شروع)

- فقط در پوشه ماژول خودتان دست بزنید.
- استایل فقط با متغیرهای `--lp-*` (هرگز `--gold`/`--primary`/`--danger` لخت — نکته: خود `assessment-panel` جاهایی از `--lp-gold` استفاده کرده که طبق قرارداد باید `--lp-*` باشد؛ در بازنویسی‌های بعدی اصلاح شود).
- نقش کاربر را با `authService.hasRole()` چک کنید.
- تست: `cd frontend && ng test` (Vitest + jsdom).
- تمام کامپوننت‌ها standalone هستند.

---

## فایل‌های مشترک (قفل شده)

- `core/services/lesson-planner-api.interface.ts`
- `core/services/http-lesson-planner-api.service.ts`
- `core/services/mock-lesson-planner-api.service.ts`
- `core/models/lesson-planner.models.ts`
- `backend/.../API/Controllers/AdminController.cs`
- `features/shared/assessment-panel/` → **فقط مصرف، تغییر ممنوع** (تداخل evaluator/dashboard)

---

## صفحه ۱ — `coach` (پنل مربی)

**فایل:** `frontend/src/app/features/coach/`
**وضعیت:** ✅ کامل

**گام‌ها (عملیاتی):**
1. ✅ انتقال `template` درون‌خطی به `coach.component.html`.
2. ✅ `ngOnInit`: `api.getStudents()` → رندر لیست.
3. ✅ برای هر دانش‌آموز: `api.getStudentProgress(id)` در کارت (درخواست موازی، نه تو‌در‌تو).
4. ✅ دکمه "مشاهده تکالیف" → زیرصفحه `coach-student-detail` (در همین پوشه) با `getStudentSubmissions`.
5. ✅ فیلتر تاریخ با `shared/persian-date-input`.

**API تأییدشده:** `getStudents`, `getStudentProgress`, `getStudentSubmissions`, `getAssignmentProgress`.

---

## صفحه ۲ — `parent` (والدین)

**فایل:** `frontend/src/app/features/parent/`
**وضعیت:** ✅ کامل

**گام‌ها:**
1. ✅ ایجاد `parent-panel.component.html` — پنل اصلی والد با لیست فرزندان.
2. ✅ `api.getParentStudents(parentId)` → لیست فرزندان.
3. ✅ برای هر فرزند: `getAssignmentProgress(id, assignmentId)` (وضعیت lock/unlock) + `getStudentAssessmentResults(id)` (نمرات).
4. ✅ نمایش آیکون وضعیت تکلیف در `student-progress-card` کامپوننت.
5. ✅ لینک به جزئیات ارزیابی با `getStudentAssessmentHistory` + زیرصفحه `parent-student-detail`.
6. ✅ `monthly-booklet` برای مشاهده جزوات ماهانه.

**API تأییدشده:** `getParents`, `getParentStudents`, `getAssignmentProgress`, `getStudentAssessmentResults`, `getStudentAssessmentHistory`.

---

## صفحه ۳ — `branch-manager` (مدیر شعبه)

**فایل:** `frontend/src/app/features/branch-manager/`
**وضعیت:** ✅ کامل

**گام‌ها:**
1. ✅ ایجاد `branch-manager.component.html` + استایل جداگانه.
2. ✅ `api.getBranches()` + `api.getBranchManagers()` → نمایش شعبه جاری.
3. ✅ `api.getBranchPerformance()` → داشبورد عملکرد.
4. ✅ `api.getCoaches()` (فیلتر سمت کلاینت بر اساس شعبه) + `api.getCoachPerformance()`.
5. ✅ فرم مدیریت دانش‌آموزان شعبه: `getStudents` + `createStudent`/`updateStudent`.
6. ✅ استخراج `competition-management` + `league-management` به فایل‌های جداگانه html/scss.
7. ✅ مسیرهای `/competitions` و `/leagues` در `branch-manager.routes.ts` فعال.

**API تأییدشده:** `getBranches`, `getBranchManagers`, `getBranchPerformance`, `getCoaches`, `getCoachPerformance`, `getStudents`, `createStudent`, `updateStudent`, `getCompetitions`, `createCompetition`, `updateCompetition`, `deleteCompetition`, `getCompetitionById`, `registerParticipant`, `getCompetitionResults`, `updateParticipantScore`, `removeParticipant`, `getLeagues`, `createLeague`, `updateLeague`, `deleteLeague`, `getLeagueById`, `updateLeagueRanking`.

---

## صفحه ۴ — `evaluator` (ارزیاب)

**فایل:** `frontend/src/app/features/evaluator/`
**وضعیت:** ✅ کامل

**گام‌ها (تصحیح‌شده):**
1. ✅ رابط ارزیابی انسانی: لیست سوابق با `api.getEvaluationRecords()`.
2. ✅ فرم ثبت ارزیابی جدید (توسط ارزیاب): `api.createEvaluation()`.
3. ✅ استخراج template/style به فایل‌های جداگانه html/scss.
4. ✅ نمایش تحلیل‌ها با `api.getAssessmentAnalytics()`.
5. ✅ استفاده از `assessment-panel` فقط برای نمایش/تأیید ارزیابی‌های تولیدشده.

**نکته:** `submitAssessmentResult` متعلق به dashboard است؛ evaluator از آن استفاده نکند.

**API تأییدشده:** `getEvaluationRecords`, `createEvaluation`, `deleteEvaluation`, `getAssessmentAnalytics`, `getEvaluators`, `getAssessments`.

---

## صفحه ۵ — `headquarters` (ستاد مرکزی)

**فایل:** `frontend/src/app/features/headquarters/`
**وضعیت:** ✅ کامل

**گام‌ها:**
1. ✅ ایجاد `headquarters.component.html` + `.scss` — پنل اصلی با ۴ تب (خلاصه، عملکرد شعب، عملکرد مربیان، مدیریت مدارس).
2. ✅ `headquarters-dashboard.component.html` + `.scss` — داشبورد جداگانه با کارت‌های خلاصه و جداول عملکرد.
3. ✅ `monthly-booklet.component.html` + `.scss` — مدیریت دفترچه‌های ماهانه (CRUD، فرم، جداول).
4. ✅ `api.getHeadquartersSummary()` → هدر خلاصه و کارت‌های آمار.
5. ✅ دو بخش عملکرد: `getBranchPerformance()` + `getCoachPerformance()` (جدول/کارت).
6. ✅ مدیریت مدارس: `getMadrasahs`, `getMaktabBranches` (افزوده/بازشونده).
7. ✅ مسیرهای `/headquarters`، `/headquarters/spiritual`، `/headquarters/monthly-booklets` در `headquarters.routes.ts` فعال.

**API تأییدشده:** `getHeadquartersSummary`, `getBranchPerformance`, `getCoachPerformance`, `getMadrasahs`, `getMaktabBranches`, `getMonthlyBooklets`, `createMonthlyBooklet`, `updateMonthlyBooklet`, `deleteMonthlyBooklet`, `getStudents`.

---

## صفحه ۶ — `dashboard` (تکمیل)

**فایل:** `frontend/src/app/features/dashboard/`
**وضعیت:** نسبتاً کامل.

**گام‌ها:**
1. تکمیل `assessment-taker`: `startAssessment(id, studentId)` → نمایش سوالات → `submitAssessmentResult(id, payload)` (ثبت نمره دانش‌آموز).
2. تکمیل `dashboard-training-steps` با گام‌های تعاملی.
3. اتصال `getStudentAssessmentHistory` به تاریخچه نمرات.

**نکته:** `assessment-panel` را فقط برای نمایش تاریخچه مصرف کند، نه تولید.

**API تأییدشده:** `startAssessment`, `submitAssessmentResult`, `getStudentAssessmentHistory`, `getAssessmentQuestions`.

---

## صفحه ۷ — `admin` (فقط انتگریتور ارشد)

**فایل:** `frontend/src/app/features/admin/` + `AdminController.cs`
**هشدار:** بزرگ‌ترین زنگ خطر — همه از متدهایش استفاده می‌کنند.

**گام‌ها:**
1. **اولویت اول:** تقسیم `AdminController.cs` (~۱۰۳۰+ خط) به زیر-کنترلرها
   (Users, Courses, Branches, Assessments, Madrasahs) طبق `docs/AGENTS.md`.
2. استخراج `admin.component.ts` (~۲۳۷۵ خط) به زیرکامپوننت‌های تب‌محور.
3. انتقال به `admin-shell` با ناوبری تب‌محور.
4. اصلاح `--lp-gold` به `--lp-*` در استایل‌های جدید.

**مسئول:** فقط یک نفر.

---

## ترتیب موازی (بدون بلوکه شدن)

```
هفته ۱ (موازی — همه می‌توانند شروع کنند چون API آماده است):
  ├─ انتگریتور: admin (تقسیم Controller)
  ├─ Dev A: coach
  ├─ Dev B: parent
  ├─ Dev C: branch-manager
  ├─ Dev D: evaluator (مصرف assessment-panel)
  └─ Dev E: headquarters

هفته ۲:
  └─ تیم داشبورد: تکمیل assessment-taker + هماهنگی evaluator
```

**کلید عدم تداخل:** هر Dev فقط در `features/<role>/` + فایل `*.component.html` جدید.
لایه API، models، AdminController و `assessment-panel` قفل هستند.

---

## Definition of Done (برای پلاگین پلنر)

هر صفحه وقتی «تمام» است که:
- [ ] فایل `*.component.html` جداگانه دارد
- [ ] حداقل ۲ متد API واقعی را فراخوانی می‌کند (تأییدشده از لیست بالا)
- [ ] از `hasRole()` استفاده می‌کند
- [ ] استایل فقط `--lp-*`
- [ ] `ng test` سبز است
- [ ] PR فقط پوشه ماژول خودش را لمس می‌کند
