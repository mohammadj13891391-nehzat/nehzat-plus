# 📦 گزارش کامل دارایی‌های پروژه — نهضت‌پلاس (Nehzat Plus)

> **نسخه:** v3.6.0 (baseline — همگام با آخرین تگ گیت) — 2026-11-05
> **هدف فایل:** آرشیو مرجع از تمام صفحات، دارایی‌ها و ساختار پروژه. پس از هر مرحله توسعه، یک نسخه جدید با شماره نسخه افزایش‌یافته در همین فایل اضافه شود.
>
> **قاعده آرشیو:** هر تغییر = یک سکشن `## تغییرات نسخه X` در انتهای فایل (بدون حذف تاریخچه قبلی).
>
> **قاعده نسخه‌گذاری سکشن‌ها:** هر سکشن اصلی یک برچسب `> آخرین تغییر: vX.Y.Z` دارد. هنگام ویرایش هر سکشن، برچسب آن به نسخه جاری به‌روز می‌شود.

---

## ۱. نمای کلی معماری
> آخرین تغییر: v3.6.0

| لایه | تکنولوژی | توضیح |
|------|----------|-------|
| Backend | ASP.NET Core 10 + EF Core + SQL Server | Clean Architecture: `Domain → Application → Infrastructure → API` |
| Frontend | Angular 21 (Standalone) + Capacitor 8 | SPA با lazy-loading ماژول‌های نقش‌محور |
| Auth | OTUH2 OIDC (EhrazHoviat) | Redirect-based: `auth.guard` → OTUH2 `/auth/login` → `/auth/callback` |
| API Layer | Interface-based | `LessonPlannerApi` token → HTTP/Mock swap via `useMockApi` |
| DB | SQL Server | `EnsureCreated()` بدون migration — schema change = drop DB یا `--seed` |
| موبایل | Capacitor 8 | Android only, app ID: `com.nsafari.lessonplanner` |

### ساختار دایرکتوری
```
nehzat-plus/
├── backend/
│   └── src/
│       ├── EducationalPlatform.Nehzat.Domain/         # Entities فقط
│       ├── EducationalPlatform.Nehzat.Application/    # DTOs + Interfaces
│       ├── EducationalPlatform.Nehzat.Infrastructure/ # EF Data + Services + Seeders + Clients
│       └── EducationalPlatform.Nehzat.API/            # Program.cs + Controllers + Middleware
├── frontend/
│   └── src/
│       ├── main.ts / config.loader.ts   # bootstrap + runtime /config.json
│       ├── environments/                # environment.ts (apiUrl, useMockApi)
│       ├── public/config.json           # runtime apiUrl/otuh2Url override
│       └── app/
│           ├── core/                    # services, guards, interceptors, models
│           └── features/                # 30+ lazy feature modules
└── docs/                                # مستندات (AGENTS.md بیبل است)
```

---

## ۲. فرانت‌اند — تمام مسیرها و صفحات
> آخرین تغییر: v3.6.0

### ۲.۱ احراز هویت — `/auth`
| مسیر | کامپوننت | گارد |
|------|-----------|------|
| `/auth/login` | `LoginComponent` (pages/login/) | ندارد |
| `/auth/register` | `RegisterComponent` (pages/register/) | ندارد |
| `/auth/callback` | `AuthCallbackComponent` (pages/callback/) | ندارد |

### ۲.۲ داشبورد متربی — `/dashboard` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/dashboard` | `DashboardComponent` (OnPush) |
| `/dashboard/spiritual` | `TraineeSpiritualPageComponent` → `SpiritualShellComponent` |

### ۲.۳ مدیریت — `/admin` (نقش `manager`، گارد `adminGuard`)
| مسیر | کامپوننت |
|------|-----------|
| `/admin` | `AdminComponent` (~2375 خط — لندمین #1) |
| `/admin/spiritual` | `AdminSpiritualPageComponent` |
| `/admin/surveys` | `AdminSurveysComponent` (admin-surveys/) |

### ۲.۴ مربی — `/coach` (نقش `coach`)
| مسیر | کامپوننت |
|------|-----------|
| `/coach` | `CoachComponent` |
| `/coach/student/:id` | `CoachStudentDetailComponent` |
| `/coach/rings` | `CoachDashboardComponent` |
| `/coach/spiritual` | `CoachSpiritualPageComponent` |

### ۲.۵ والد — `/parent` (نقش `parent`)
| مسیر | کامپوننت |
|------|-----------|
| `/parent` | `ParentPanelComponent` |
| `/parent/spiritual` | `ParentSpiritualPageComponent` |
| `/parent/monthly-booklets` | `ParentMonthlyBookletPageComponent` |
| `/parent/student/:id` | `ParentStudentDetailComponent` |

### ۲.۶ مدیر شعبه — `/branch-manager` (نقش `branch_manager`)
| مسیر | کامپوننت |
|------|-----------|
| `/branch-manager` | `BranchManagerComponent` |
| `/branch-manager/assessment` | `BranchManagerAssessmentComponent` → `AssessmentPanelComponent` |
| `/branch-manager/spiritual` | `BranchManagerSpiritualPageComponent` |
| `/branch-manager/competitions` | `CompetitionManagementComponent` (competition-management/) |
| `/branch-manager/leagues` | `LeagueManagementComponent` (league-management/) |

### ۲.۷ ارزیاب — `/evaluator` (نقش `evaluator`)
| مسیر | کامپوننت |
|------|-----------|
| `/evaluator` | `EvaluatorComponent` (شل با redirect به queue) |
| `/evaluator/queue` | `EvaluatorQueuePageComponent` |
| `/evaluator/form` | `EvaluatorFormPageComponent` |
| `/evaluator/form/:id` | `EvaluatorFormPageComponent` |
| `/evaluator/review` | `EvaluatorReviewPageComponent` |
| `/evaluator/analytics` | `EvaluatorAnalyticsPageComponent` |
| `/evaluator/spiritual` | `EvaluatorSpiritualPageComponent` |

### ۲.۸ ستاد مرکزی — `/headquarters` (نقش `headquarters`)
| مسیر | کامپوننت |
|------|-----------|
| `/headquarters` | `HeadquartersDashboardComponent` |
| `/headquarters/management` | `HeadquartersManagementPageComponent` → `HeadquartersComponent` |
| `/headquarters/spiritual` | `HeadquartersSpiritualPageComponent` |
| `/headquarters/monthly-booklets` | `HeadquartersMonthlyBookletPageComponent` |

### ۲.۹ معلم — `/teacher` (نقش `teacher`)
| مسیر | کامپوننت |
|------|-----------|
| `/teacher` | `TeacherPageComponent` → `TeacherComponent` (سکشن‌ها: dashboard, courses, gradings, pending) |
| `/teacher/spiritual` | `TeacherSpiritualPageComponent` |

### ۲.۱۰ قرآن — `/quran`
| مسیر | نقش مجاز | کامپوننت |
|------|----------|-----------|
| `/quran/surahs` | trainee | `QuranListComponent` (pages/surah-list/) |
| `/quran/surahs/:id` | trainee | `SurahDetailComponent` (pages/surah-detail/) |
| `/quran/tajweed-rules` | trainee | `TajweedRulesComponent` (pages/tajweed-rules/) |
| `/quran/recitation-levels` | trainee | `RecitationLevelsComponent` (pages/recitation-levels/) |
| `/quran/curricula` | admin, coach | `QuranCurriculumComponent` (pages/quran-curriculum/) |
| `/quran/student-progress/:studentId` | coach, parent | `StudentProgressComponent` (pages/student-progress/) |
| `/quran/lesson-plans` | admin, coach | `LessonPlansComponent` (pages/lesson-plans/) |

### ۲.۱۱ حدیث — `/hadith` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/hadith/books` | `HadithBooksComponent` (pages/hadith-books/) |
| `/hadith/books/:bookId/chapters` | `HadithChaptersComponent` (pages/hadith-chapters/) |
| `/hadith/chapters/:chapterId/hadiths` | `HadithListComponent` (pages/hadith-list/) |
| `/hadith/hadith/:id` | `HadithDetailComponent` (pages/hadith-detail/) |
| `/hadith/review` | `HadithReviewComponent` (pages/hadith-review/) |

### ۲.۱۲ ادبیات فارسی — `/persian-literature` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/persian-literature/learning` | `LearningDashboardComponent` (learning-dashboard/) |
| `/persian-literature/learning/:id` | `PathDetailComponent` (path-detail/) |
| `/persian-literature/lesson/:id` | `LessonViewComponent` (lesson-view/) |
| `/persian-literature/quiz/:id` | `QuizViewComponent` (quiz-view/) |
| `/persian-literature/poets` | `PoetListComponent` (pages/poet-list/) |
| `/persian-literature/poets/:id` | `PoetDetailComponent` (pages/poet-detail/) |
| `/persian-literature/poems` | `PoemListComponent` (pages/poem-list/) |
| `/persian-literature/poems/:id` | `PoemDetailComponent` (pages/poem-detail/) |

### ۲.۱۳ ادبیات عربی — `/arabic-literature` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/arabic-literature/courses` | `CourseListComponent` (pages/course-list/) |
| `/arabic-literature/courses/:id` | `CourseDetailComponent` (pages/course-detail/) |
| `/arabic-literature/lessons/:id` | `LessonViewComponent` (pages/lesson-view/) |
| `/arabic-literature/poets` | `PoetListComponent` (pages/poet-list/) |
| `/arabic-literature/poets/:id` | `PoetDetailComponent` (pages/poet-detail/) |
| `/arabic-literature/poems` | `PoemListComponent` (pages/poem-list/) |
| `/arabic-literature/poems/:id` | `PoemDetailComponent` (pages/poem-detail/) |

### ۲.۱۴ ریاضی — `/math` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/math/topics` | `MathTopicListComponent` (pages/math-topic-list/) |
| `/math/topics/:topicId/lessons` | `MathLessonListComponent` (pages/math-lesson-list/) |
| `/math/lessons/:lessonId` | `MathLessonDetailComponent` (pages/math-lesson-detail/) |
| `/math/lessons/:lessonId/practice` | `MathPracticeComponent` (pages/math-practice/) |
| `/math/scholars` | `MathScholarsComponent` (pages/math-scholars/) |
| `/math/scholars/:scholarId` | `MathScholarDetailComponent` (pages/math-scholar-detail/) |
| `/math/progress` | `MathProgressComponent` (pages/math-progress/) |

### ۲.۱۵ علوم تجربی — `/experimental-sciences` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/experimental-sciences/topics` | `TopicListComponent` (pages/topic-list/) |
| `/experimental-sciences/topics/:topicId/lessons` | `LessonViewComponent` (pages/lesson-view/) |
| `/experimental-sciences/lessons/:lessonId/experiments` | `ExperimentGuideComponent` (pages/experiment-guide/) |
| `/experimental-sciences/lessons/:lessonId/quiz` | `QuizComponent` (pages/quiz/) |
| `/experimental-sciences/progress` | `ProgressDashboardComponent` (pages/progress-dashboard/) |

### ۲.۱۶ یادگیری — `/learning` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/learning` | `LearningDashboardComponent` (pages/learning-dashboard/) |
| `/learning/paths/:id` | `PathDetailComponent` (pages/path-detail/) |
| `/learning/lessons/:id` | `LessonViewComponent` (pages/lesson-view/) |
| `/learning/quizzes/:id` | `QuizViewComponent` (pages/quiz-view/) |

### ۲.۱۷ دوره‌های آموزشی — `/training-courses` (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/training-courses` | `TrainingCoursesComponent` |
| `/training-courses/:id` | `TrainingCourseDetailComponent` (training-course-detail/) |
| `/training-courses/:id/sessions/:sessionId` | `TrainingSessionDetailComponent` (training-session-detail/) |

### ۲.۱۸ نظرسنجی‌ها
| مسیر | کامپوننت | گارد |
|------|-----------|------|
| `/survey` | redirect → `respond` | `serviceSurveyGuard` |
| `/survey/respond` | `SurveyRespondComponent` | `serviceSurveyGuard` |
| `/survey/manage` | `SurveyManageComponent` | `serviceSurveyGuard` |
| `/survey/analytics` | `SurveyAnalyticsComponent` | `serviceSurveyGuard` |
| `/survey/financial` | `SurveyFinancialComponent` | `serviceSurveyGuard` |
| `/surveys` | `SurveyListComponent` (shared/surveys/) | `authGuard` |
| `/surveys/take/:id` | `SurveyTakerComponent` (shared/surveys/) | `authGuard` |

### ۲.۱۹ تک‌صفحه‌ای‌های متربی (نقش `trainee`)
| مسیر | کامپوننت |
|------|-----------|
| `/activity` | `ActivityComponent` |
| `/arts` | `ArtsComponent` |
| `/social` | `SocialComponent` |
| `/career` | `CareerComponent` |
| `/career-pathways` | `CareerPathwaysComponent` |
| `/portfolio` | `PortfolioComponent` |
| `/project-defense` | `ProjectDefenseComponent` |
| `/community-metrics` | `CommunityMetricsComponent` |

### ۲.۲۰ Fallback
| مسیر | رفتار |
|------|-------|
| `/` | redirect → `/auth/login` |
| `**` | redirect → `/auth/login` |

---

## ۳. کامپوننت‌های اشتراکی — `features/shared/`
> آخرین تغییر: v3.4.0

| کامپوننت | مسیر | کاربرد |
|-----------|------|-------|
| `SpiritualShellComponent` | `shared/spiritual-shell/` | شل صفحه روحانی (استفاده در همه نقش‌ها) |
| `SpiritualPathPanelComponent` | `shared/spiritual-shell/` | پنل مسیر روحانی |
| `SpiritualOccasionPanelComponent` | `shared/spiritual-shell/` | پنل مناسبت‌ها |
| `SpiritualHistoryPanelComponent` | `shared/spiritual-shell/` | پنل تاریخچه |
| `AssessmentPanelComponent` | `shared/assessment-panel/` | پنل ارزیابی (~568 خط، استفاده: branch-manager) |
| `PersianDateInputComponent` | `shared/persian-date-input/` | ورودی تاریخ شمسی |
| `RoleStubComponent` | `shared/role-stub/` | استاب نقش برای توسعه/تست |
| `SurveyListComponent` | `shared/surveys/` | لیست نظرسنجی‌ها |
| `SurveyTakerComponent` | `shared/surveys/` | شرکت در نظرسنجی |
| `testing-utils.ts` | `shared/` | ابزارهای تست مشترک |

---

## ۴. سرویس‌های هسته — `core/services/`
> آخرین تغییر: v3.6.0

| سرویس/فایل | وظیفه |
|--------|-------|
| `auth.service.ts` | `hasRole()` (case-insensitive)، مدیریت توکن (sessionStorage/localStorage)، logout در 401 |
| `lesson-planner-api.interface.ts` | اینترفیس `LessonPlannerApi` — قرارداد API |
| `lesson-planner-api.token.ts` | Injection token برای swap HTTP/Mock |
| `http-lesson-planner-api.service.ts` | پیاده‌سازی واقعی HTTP |
| `mock-lesson-planner-api.service.ts` | Mock کامل درون‌مرورگر (~1555 خط — لندمین #2) |
| `mock-lesson-planner-data.ts` / `-seed.ts` / `-helpers.ts` | داده و ابزار Mock |
| `otuh2-api.interface.ts` / `token.ts` | اینترفیس + token برای OTUH2 |
| `http-otuh2-api.service.ts` | Client OTUH2 (signup/registration path) |
| `notification.service.ts` | نوتیفیکیشن‌ها |
| `streak.service.ts` | محاسبه زنجیره فعالیت |
| `api-url.util.ts` | آبشار apiUrl: `config.json` → `environment.ts` |

### مدل‌ها — `core/models/`
| فایل | محتوا |
|------|-------|
| `lesson-planner.models.ts` | ~700 خط — تمام TS interfaces دامنه |
| `otuh2.models.ts` | مدل‌های OTUH2 |

### گاردها — `core/guards/`
| گارد | وظیفه |
|------|-------|
| `auth.guard.ts` | ریدایرکت به OTUH2 اگر احراز نشده؛ پشتیبانی `returnUrl` |
| `admin.guard.ts` | `hasRole('manager')` |
| `role.guard.ts` | `roleGuard('role')` — محافظت نقش‌ای دقیق |
| `service-survey.guard.ts` | گارد اختصاصی نظرسنجی |

### اینترسپتورها — `core/interceptors/`
| اینترسپتور | وظیفه |
|------------|-------|
| `auth.interceptor.ts` | تزریق Bearer token |

### ابزارها — `core/utils/`
| فایل | وظیفه |
|------|-------|
| `xp.ts` | محاسبات XP |
| `srs.ts` | الگوریتم تکرار فاصله‌دار |
| `radar-chart.ts` | نمودار رادار |
| `mastery.ts` | محاسبه mastery |

### کامپوننت‌های هسته — `core/components/`
| کامپوننت | وظیفه |
|-----------|-------|
| `NotificationComponent` | نمایش نوتیفیکیشن‌ها |

---

## ۵. بک‌اند — تمام کنترلرها (۴۱ عدد)
> آخرین تغییر: v3.5.0

### ۵.۱ احراز هویت و کاربران
| کنترلر | مسیر پایه | نکات |
|--------|-----------|------|
| `AuthController` | `/api/auth` | فقط `SignUp` — signin کاملاً به OTUH2 واگذار شده |
| `UserManagementController` | `/api/users` | مدیریت کاربران |

### ۵.۲ مدیریت — ۸ کنترلر تفکیک‌شده (ضد-الگو: یکپارچه‌سازی مجدد)
| کنترلر | مسیر پایه |
|--------|-----------|
| `AdminBranchesController` | `/api/admin/branches` |
| `AdminBranchManagersController` | `/api/admin/branch-managers` |
| `AdminCoachesController` | `/api/admin/coaches` |
| `AdminCoursesController` | `/api/admin/courses` |
| `AdminEvaluatorsController` | `/api/admin/evaluators` |
| `AdminParentsController` | `/api/admin/parents` |
| `AdminStudentsController` | `/api/admin/students` |
| `AdminStatisticsController` | `/api/admin/statistics` |

### ۵.۳ محتوای آموزشی
| کنترلر | مسیر پایه |
|--------|-----------|
| `CourseController` | `/api/courses` |
| `CurriculumController` | `/api/curriculum` |
| `CurriculumVersionController` | `/api/curriculum-versions` |
| `DailyActivityController` | `/api/daily-activity` |
| `LearningController` | `/api/learning` |
| `TrainingController` | `/api/training` |
| `MonthlyBookletController` | `/api/monthly-booklet` |

### ۵.۴ موضوعات تحصیلی
| کنترلر | مسیر پایه |
|--------|-----------|
| `ArabicLiteratureController` | `/api/arabic-literature` |
| `PersianLiteratureController` | `/api/persian-literature` |
| `MathController` | `/api/math` |
| `ExperimentalScienceController` | `/api/experimental-science` |
| `QuranController` | `/api/quran` |
| `HadithController` | `/api/hadith` |
| `ArtsController` | `/api/arts` |

### ۵.۵ پیشرفت و گیمیفیکیشن
| کنترلر | مسیر پایه |
|--------|-----------|
| `ProgressionController` | `/api/progression` |
| `SkillProgressController` | `/api/skill-progress` |
| `SrsController` | `/api/srs` |
| `XpController` | `/api/xp` |
| `RingsController` | `/api/rings` |
| `SpiritualPathController` | `/api/spiritual-path` |
| `SpiritualOccasionController` | `/api/spiritual-occasion` |
| `SpiritualEntryController` | `/api/spiritual-entry` |
| `SpiritualCatalogController` | `/api/spiritual-catalog` |

### ۵.۶ نقش‌های کاربری
| کنترلر | مسیر پایه |
|--------|-----------|
| `StudentController` | `/api/students` |
| `TeacherController` | `/api/teachers` |
| `ParentController` | `/api/parents` |
| `BranchManagerController` | `/api/branch-managers` |
| `EvaluatorController` | `/api/evaluators` |

### ۵.۷ ارزیابی، رقابت، موسسه، متفرقه
| کنترلر | مسیر پایه |
|--------|-----------|
| `AssessmentController` | `/api/assessment` |
| `IssueController` | `/api/issues` |
| `CompetitionsController` | `/api/competitions` |
| `LeaguesController` | `/api/leagues` |
| `MadrasahController` | `/api/madrasah` |
| `SeederController` | `/api/seeder` |

---

## ۶. موجودیت‌های دامنه — `Domain/Entities/` (۱۰۰+)
> آخرین تغییر: v3.4.0

### ۶.۱ کاربران و نقش‌ها
`User` (دارای `OidcSubject` — بدون PasswordHash)، `Student`، `Teacher`، `Coach`، `Parent`، `BranchManager`، `Evaluator`، `Branch`، `Madrasah`، `MadrasahBranch`، `NehzatSection`، `MaktabSubSection`، `ParentStudent` (junction)، `AgeGroup`

### ۶.۲ دوره و تکلیف
`Course`، `Assignment`، `AssignmentAttachment`، `AssignmentSubmission`، `StudentCourse`، `Curriculum`، `CurriculumVersion`، `CurriculumObjective`، `TrainingCourse`، `TrainingContent`، `TrainingAssignment`، `TrainingEnrollment`، `TrainingProgress`، `TrainingSession`، `TrainingStage`، `TrainingSubmission`، `TeachingMethod`، `SubjectArea`

### ۶.۳ قرآن (زیرپوشه `Quran/`)
`QuranCurriculum`، `QuranStudentCourse`، `QuranStudentProgress`، `Ayah`، `Surah`، `RecitationLevel`، `TajweedRule`

### ۶.۴ ادبیات فارسی (زیرپوشه `PersianLiterature/`)
`LearningPath`، `LearningLevel`، `StudyModule`، `StudyLesson`، `LessonContentBlock`، `Poet`، `Poem`، `PoemAnalysis`، `Quiz`، `QuizQuestion`، `QuizOption`، `UserEnrollment`، `UserLessonProgress`، `UserQuizAttempt`

### ۶.۵ ریاضی (زیرپوشه `Math/`)
`MathLesson`، `MathTopic`، `MathQuestion`، `MathProgress`، `MathScholar`، `MathContribution`

### ۶.۶ حدیث (زیرپوشه `Hadith/`)
`Hadith`، `HadithBook`، `HadithChapter`، `HadithAssessment`، `UserHadithProgress`

### ۶.۷ هنر
`Artwork`، `CalligraphySample`، `MusicRecord`، `Book`

### ۶.۸ گیمیفیکیشن و پیشرفت
`XpBadge`، `UserXp`، `UserXpTransaction`، `SpacedRepetitionCard`، `Ring`، `RingBook`، `RingStudent`، `RingTeachingMethod`، `StudentSkillProgress`، `DailyActivity`

### ۶.۹ روحانی
`SpiritualPath`، `SpiritualOccasion`، `SpiritualOccasionPractice`، `SpiritualPracticeItem`، `DailySpiritualEntry`، `UserOccasionProgress`، `StudentPathSelection`، `StudentPathRanking`، `StudentPathHistory`

### ۶.۱۰ ارزیابی و نظرسنجی
`Assessment`، `AssessmentQuestion`، `AssessmentResult`، `IssueSurvey`، `IssueSurveyQuestion`، `IssueSurveyResponse`، `IssueSurveyComment`، `IssueItemPool`، `IssueAction`، `IssueActionUpdate`

### ۶.۱۱ رقابت و متفرقه
`Competition`، `League`، `MonthlyBooklet`، `LogEntry`

---

## ۷. سرویس‌های بک‌اند
> آخرین تغییر: v3.6.0

### ۷.۱ پیاده‌سازی‌ها — `Infrastructure/Services/` (۴۰+)
`UserService`، `CourseService`، `AssessmentService`، `AssignmentSubmissionService`، `BranchService`، `BranchManagerService`، `CoachService`، `CompetitionService`، `CurriculumService`، `CurriculumVersionService`، `DailyActivityService`، `EvaluatorService`، `ExperimentalScienceService`، `HadithService`، `IssueSurveyService`، `LeagueService`، `LearningService`، `LogService`، `MadrasahService`، `MathService`، `MonthlyBookletService`، `ParentService`، `PersianLiteratureService`، `ProgressionService`، `QuranService`، `RingService`، `SkillProgressService`، `SpiritualCatalogService`، `SpiritualEntryService`، `SpiritualOccasionService`، `SpiritualPathService`، `SrsService`، `StudentService`، `TeacherService`، `TrainingService`، `XpService`، `ArabicLiteratureService`، `ArtsService`

### ۷.۲ اینترفیس‌ها — `Application/Interfaces/` (۱۰+)
`IUserService`، `ICourseService`، `IAssessmentService`، `IDailyActivityService`، `ISpiritualService`، `IXpService`، `ISrsService`، `ITrainingService`، `IQuranService`، `IHadithService`...

### ۷.۳ DTOها — `Application/DTOs/` (۳۰+ فایل)
`*Dtos.cs` به ازای هر دامنه: `CourseDtos`، `StudentDtos`، `AssessmentDtos`، `QuranDtos`، `AyahDtos`، `TajweedDtos`، `RecitationDtos`، `QuranStudentCourseDtos`، `QuranCurriculumDtos`، `HadithDtos`، `MathDtos`، `ExperimentalScienceDtos`، `PersianLiteratureDtos`، `ArabicLiteratureDtos`، `XpDtos`، `SrsDtos`، `TrainingDtos`، `TeacherDtos`، `ParentDtos`، `CoachDtos`، `BranchManagerDtos`، `EvaluatorDtos`، `CompetitionDtos`، `LeagueDtos`، `CurriculumDtos`، `CurriculumVersionDtos`، `DailyActivityDtos`، `LearningDtos`، `ProgressionDtos`، `SkillProgressDtos`، `MonthlyBookletDtos`، `SpiritualDtos`، `MadrasahDtos`، `IssueDtos`

---

## ۸. زیرساخت بک‌اند
> آخرین تغییر: v3.4.0

### ۸.۱ DbContext — `Infrastructure/Data/AppDbContext.cs`
- `EnsureCreated()` فقط (بدون migration)
- جداول با پیشوند `Nehzat_` (مثلاً `Nehzat_users`)
- JSON: `ReferenceHandler.IgnoreCycles` + `UnsafeRelaxedJsonEscaping` (متن فارسی)

### ۸.۲ سیدرها — `Infrastructure/Seeders/`
| سیدر | وظیفه |
|------|-------|
| `SampleDataSeeder` | داده‌های نمونه اصلی (`--seed`) |
| `Otuh2RoleSeeder` | ایجاد نقش‌های Nehzat در OTUH2 (non-blocking در startup) |
| `XpDataSeeder` | داده XP |
| `TrainingDataSeeder` | داده دوره‌های آموزشی |
| `SurveyDataSeeder` | داده نظرسنجی |
| `QuranDataSeeder` | داده قرآن |
| `MathDataSeeder` | داده ریاضی |
| `HadithDataSeeder` | داده حدیث |
| `ExperimentalScienceDataSeeder` | داده علوم تجربی |
| `ArabicLiteratureDataSeeder` | داده ادبیات عربی |

### ۸.۳ میدلور — `API/Middleware/`
| میدلور | وظیفه |
|--------|-------|
| `OidcSyncMiddleware` | **حیاتی**: auto-create ردیف `User` لوکال از claims OTUH2 در اولین request احرازشده |
| `MockAuthHandler` | Auth scheme توسعه وقتی `UseMockAuth:true` — همیشه claim های manager برمی‌گرداند |

### ۸.۴ کلاینت OTUH2 — `Infrastructure/Clients/`
- `IOtuh2AuthClient` (Refit) — user provisioning، role management، registration
- `Otuh2AuthClientExtensions` — ثبت Refit client
- Config: `Otuh2Client` section (BaseUrl، ClientId، ClientSecret، ApiKey)

### ۸.۵ نکات Program.cs
- Auth: JWT Bearer (`at+jwt`) + MockAuthHandler توسعه
- CORS: `localhost:4200`، `localhost:4201`، `localhost:3000`
- همه کنترلرها `[Authorize]` به جز `AuthController`
- File upload: max 10MB، extension allowlist، magic byte validation
- `--seed` flag: drop + recreate + seed

---

## ۹. استایل و دارایی‌ها
> آخرین تغییر: v3.3.0

- **CSS Variables**: فقط پیشوند `--lp-*` (ممنوع: `--gold`، `--primary`، `--danger`)
- **فونت**: وزیرمتن (Vazirmatn)
- **استایل سراسری**: `src/app/app.scss`
- **ChangeDetection**: OnPush روی admin/dashboard
- **دارایی‌ها**: `frontend/src/assets/` (تصاویر، آیکون‌ها، فونت‌ها)
- **Prettier + .editorconfig** اعمال شده

### پیکربندی محیط
| فایل | اولویت |
|------|--------|
| `public/config.json` (runtime) | ۱ — بالاترین |
| `environments/environment.ts` | ۲ — fallback |
| کلیدها: `apiUrl`، `otuh2Url`، `useMockApi` | |

---

## ۱۰. موبایل و استقرار
> آخرین تغییر: v2.8.0

### Capacitor 8
- App ID: `com.nsafari.lessonplanner`
- Platform: Android only
- Build: `npm run build:capacitor && npx cap sync android`
- Build output: `dist/frontend/browser`

### CI/CD — GitHub Actions (`.github/workflows/deploy.yml`)
- Build & deploy → GitHub Pages
- Build APK
- Create Release on Tags
- Pages: https://mohammadj13891391-nehzat.github.io/nehzat-plus/
- Releases: https://github.com/mohammadj13891391-nehzat/nehzat-plus/releases
- نسخه جاری: **v2.5.0**

---

## ۱۱. تست
> آخرین تغییر: v3.6.0

| لایه | فریم‌ورک | فرمان |
|------|----------|-------|
| Frontend | Vitest + jsdom | `ng test` |
| Backend | xUnit | `dotnet test` |

### حساب‌های تست
| نقش | Username | Password |
|-----|----------|----------|
| manager | `test` | `password` |
| student | `ali.ahmadi` | `password123` |
| student | `fateme.mohammadi` | `password123` |
| student | `mohammad.rezaei` | `password123` |
| *MockAuth* | *هر چیزی* | *هر چیزی* → همیشه manager |

---

## ۱۲. لندمین‌ها و ضدالگوها (هرگز نقض نشود)
> آخرین تغییر: v2.8.0

| # | قانون | دلیل |
|---|-------|------|
| 1 | `admin.component.ts` (~2375 خط) — هرگز append نکن، extract کن | بزرگ‌ترین فایل FE |
| 2 | `mock-lesson-planner-api.service.ts` (~1555 خط) — extract قبل از رشد | دومین فایل بزرگ |
| 3 | `EnsureCreated()` فقط — schema change = drop DB یا `--seed` | بدون migration history |
| 4 | `Microsoft.EntityFrameworkCore.Sqlite` هرگز برنگردد | SQL Server only |
| 5 | مقایسه نقش دستی ممنوع — فقط `hasRole()` | case-insensitive |
| 6 | Token type باید `at+jwt` باشد | گیت‌وэй JWT تایپ‌شده را رد می‌کند |
| 7 | `ex.Message` هرگز به client برنگردد | global handler پیام فارسی عمومی می‌دهد |
| 8 | CSS var بدون پیشوند `--lp-*` ممنوع | قرارداد استایل |
| 9 | `as any` / `@ts-ignore` ممنوع | type safety |
| 10 | Controller ادمین یکپارچه ممنوع — domain sub-controllers | ۸ کنترلر تفکیک‌شده |

---

## ۱۳. مستندات مرجع — `docs/`
> آخرین تغییر: v3.6.0

| فایل | محتوا |
|------|-------|
| `AGENTS.md` | **بیبل**: auth، DB، تست، landmines |
| `API_ENDPOINTS.md` | تمام endpointها با request/response |
| `OTUH2_AUTH.md` | جریان دقیق OIDC، client IDs، scopes |
| `SYSTEM_ARCHITECTURE.md` | معماری جامع سیستم |
| `FRONTEND_PRD.md` | PRD فرانت‌اند |
| `ADMIN_API_EXAMPLES.md` | مثال‌های API ادمین |
| `SIGNUP_APPROVAL_WORKFLOW.md` | فرآیند ثبت‌نام و تایید |
| `USER_STUDENT_RELATIONSHIP.md` | رابطه کاربر-متربی |
| `STUDENT_FILE_UPLOAD_GUIDE.md` | راهنمای آپلود فایل |
| `EHRAZHOVIAT_INTEGRATION_GUIDE.md` | راهنمای یکپارچه‌سازی EhrazHoviat |
| `AUTH_MIGRATION_CHECKLIST.md` | چک‌لیست مهاجرت auth |
| `NTM_ARCHITECTURE.md` | معماری NTM |
| `PAGE_STATUS.md` / `PAGE_LAYER_REPORT.md` | وضعیت صفحات |
| `PAGE_DEVELOPMENT_PLAN.md` | طرح توسعه صفحات |
| `TRAINEE_PAGE_DESIGN.md` | طراحی صفحه متربی |
| `USER_FEEDBACK_ANALYSIS.md` | تحلیل بازخورد کاربران |
| `admin-refactoring-report.md` | گزارش ری‌فکتورینگ admin |
| `roadmaps/` | ۳۰+ roadmap ماژولار (quran، math، hadith، career، spiritual، ...) |
| `ntm/` | ماژول‌های آموزشی NTM (W0-FOUNDATIONS تا W6-DIGITAL) |
| `plans/` | طرح‌های پیاده‌سازی (branch-manager، parent، coach، 14-steps، nehzat-curriculum) |

---

## ۱۴. دستورات اجرا
> آخرین تغییر: v2.8.0

```bash
# Backend (پورت 3000)
cd backend && dotnet run           # dev
cd backend && dotnet run --seed    # drop+recreate DB + sample data

# Frontend (پورت 4200)
cd frontend && npm install
cd frontend && npm start           # ng serve
cd frontend && ng test             # Vitest + jsdom
cd frontend && npm run build:capacitor && npx cap sync android   # mobile
```

---

## ۱۵. خلاصه آماری (Snapshot)
> آخرین تغییر: v2.8.0

| آیتم | تعداد |
|------|-------|
| Feature modules فرانت‌اند | ۳۰+ |
| صفحات/مسیرهای فرانت‌اند | ۹۰+ |
| کنترلرهای API | ۴۱ |
| موجودیت‌های دامنه | ۱۰۰+ |
| سرویس‌های پیاده‌سازی بک‌اند | ۴۰+ |
| فایل‌های DTO | ۳۰+ |
| سیدرها | ۱۰ |
| گاردهای فرانت‌اند | ۴ |
| سرویس‌های هسته فرانت‌اند | ۱۰+ |
| نقش‌های کاربری | ۸ (manager, trainee, coach, parent, branch_manager, evaluator, headquarters, teacher) |

---

<!-- ============================================================ -->
<!-- تاریخچه تغییرات — هر مرحله توسعه یک سکشن جدید زیر این خط       -->
<!-- ============================================================ -->

## تاریخچه نسخه‌ها (backfill از گیت — 2026-08-12)

> **توضیح:** تا زمان ساخت این آرشیو، پروژه ۲۶ تگ گیت داشته (v1.0.0 تا v2.8.0). این سکشن تاریخچه آن‌ها را بازسازی می‌کند. ترتیب تگ‌گذاری در گیت غیرترتیبی بود: بعد از v3.1.0، تگ‌های v2.7.0 و v2.8.0 زده شدند (آخرین تگ گیت: v2.8.0 — 2026-07-25).

### نسخه v1.0.0 → v2.0.1 — 2026-06-26 تا 2026-06-29 (عصر پنل ادمین)
- شروع پنل ادمین: منوی ۸ سکشنی، دوره‌ها با toggle فعال/غیرفعال
- تکمیل سکشن متربیان (pending/all + جزئیات متربی)، مربیان (CRUD + تخصیص دوره + جستجو)، مدیران شعبه (استان/جنسیت)، دوره‌ها (ثبت‌نام، کد دعوت، آمار)
- سکشن مکتبر: مدارس دخترانه/پسرانه، ۶ تب مستقل، مدیریت شعبه با localStorage
- تم مذهبی شیعی سبز/طلایی + فونت myNeirizi
- جایگزینی واژه «دانش‌آموز» با «متربی»
- اضافه شدن بک‌اند ASP.NET Core 8 اولیه (Lesson Planner API)
- اسناد: SYSTEM_ARCHITECTURE.md (فارسی)، README کامل

### نسخه v2.1.0 — 2026-06-29
- تکمیل سکشن مکتبر: سایدبار داینامیک، CRUD مدرسه، مدیریت شعبه مبتنی بر API
- رفع باگ: جلوگیری از request تکراری هنگام toggle وضعیت دوره

### نسخه v2.2.0 — 2026-06-29
- تکمیل سکشن اولیا در پنل ادمین: CRUD، نمایش اطلاعات متربی، dual API

### نسخه v2.3.0 — 2026-06-29
- تکمیل سکشن ارزیابان در پنل ادمین: CRUD، سوابق ارزیابی، dual API

### نسخه v2.4.0 — 2026-06-29
- تکمیل سکشن ستاد: داشبورد خلاصه، جدول عملکرد شعبه/مربی، dual API

### نسخه v2.5.0 — 2026-07-06 (انتشار بزرگ)
- **سیستم ۷ نقشی**: 7-role types + role guard + auth service؛ lazy-loaded routes برای ۵ نقش جدید
- **مدل Branch**: BranchId FK به Student/Coach/Parent/Evaluator/BranchManager؛ admin نقش‌آگاه
- **JWT Auth زیرساخت**: DTO validation، CORS محدود، authorization policies
- **ماژول ارزیابی بک‌اند**: Assessment models + DTOs + DbContext + AssessmentService (تولید هوشمند) + AssessmentController
- **ماژول ارزیابی فرانت‌اند**: AssessmentPanelComponent + types + API interface + HTTP/Mock
- PersianDateInput shared component؛ بازطراحی RoleStubComponent با برند نهضت
- سیستم toast notification؛ آپلود فایل با magic byte validation؛ رفع N+1 و DateTime parsing
- فرم مربی: تکمیل خودکار nationalCode؛ رفع باگ change detection (markForCheck)

### نسخه v2.6.0 — 2026-07-06
- جریان شرکت متربی در ارزیابی (smart exam)

### نسخه v3.0.0 — 2026-07-06
- **مهاجرت Clean Architecture**: حذف monolith قدیمی `LessonPlanner.Api`، ایجاد ۴ لایه Domain/Application/Infrastructure/API
- افزودن solution file

### نسخه v3.1.0 — 2026-07-11
- **یکپارچه‌سازی OTUH2 OIDC** (بزرگ):
  - بک‌اند: مهاجرت User از PasswordHash به OidcSubject، Refit client، Otuh2RoleSeeder، ساده‌سازی AuthController، migrate UserService به OIDC
  - فرانت‌اند: بازنویسی AuthService برای OTUH2، login/callback flow، guards/interceptor برای OIDC
- حذف پکیج Sqlite (مهاجرت به SQL Server)
- اسناد: EhrazHoviat integration guide، چک‌لیست مهاجرت auth

### نسخه v2.7.0 — 2026-07-19
- auth: DB logging + رفع نگاشت OTUH2 role claim + همگام‌سازی کاربر
- تغییر به login flow ریدایرکت‌محور OTUH2
- اسناد: AGENTS.md سلسله‌مراتبی (root + backend/frontend/core/admin)

### نسخه v2.8.0 — 2026-07-25 (آخرین تگ گیت = baseline این فایل)
- **حذف فیچر survey** از فرانت‌اند + رفع گارد والد
- فاز ۵–۸: مسیرهای teacher، ماژول‌های competition/league، رفع تست‌های auth

## تغییرات نسخه آرشیو 1 — 2026-08-12
- **ایجاد اولیه گزارش**: نقشه‌برداری کامل از تمام صفحات، کنترلرها، موجودیت‌ها، سرویس‌ها و دارایی‌های پروژه.
- **Backfill تاریخچه گیت**: بازسازی تاریخچه کامل v1.0.0 تا v2.8.0 از git log.

## تغییرات نسخه v3.2.0 — خودکار (archive-version.ps1)

### نسخه v3.2.0 — 2026-08-18 (86 کامیت)
>  636 files changed, 102033 insertions(+), 11634 deletions(-)

#### ویژگی‌ها (28)
- feat(backend): add dev accounts for parent, branch_manager, headquarters, evaluator, teacher roles
- feat(backend): add training module controllers, services, entities + data seeders
- feat(training): seed NTM coach training content + fix progress endpoint
- feat(auth): add coach dev account
- feat(auth): add dev-only centralized /auth/signin with at+jwt issuance
- feat(hadith): add complete Hadith module (back-end + front-end)
- feat(frontend): add Hadith module, update Quran and PersianLit API
- feat(frontend): add Learning System components and API integration
- feat(backend): add Learning System entities, services, and API
- feat(frontend): add Experimental Sciences Angular module
- feat(backend): add Experimental Sciences service layer
- feat(backend): add Experimental Sciences domain entities
- feat(frontend): add Math widget to dashboard
- feat(frontend): add Math API interface and feature module
- feat(backend): add Math API controller
- feat(backend): add Math service and seeder
- feat(backend): add Math DTOs and service interface
- feat(backend): add Math domain entities
- feat(backend): enhance Quran module with additional endpoints and seed data
- feat(teacher): extract inline template, complete tabs, add routing
- feat(auth): auto token refresh on 401 and OTUH2 logout redirect
- feat(config): config-driven CORS, auto DB schema on startup, fix prod environment
- feat(survey): add complete survey feature with 4 pages
- feat(dashboard): connect assessment history with getStudentAssessmentHistory
- feat(frontend): complete evaluator + headquarters pages
- feat(frontend): extract inline templates/styles for evaluator and headquarters pages
- feat(frontend): extract inline templates/styles for branch-manager page
- feat(auth): enable real OTUH2 OIDC authentication in development

#### اصلاحات (8)
- fix(security+quality): resolve all 50 defects (10 Critical, 14 High, 16 Medium, 5 Low, 5 Docs/Git)
- fix(frontend): resolve TS compilation errors in API services
- fix(backend): replace EnsureCreated with Migrate + clean InitialCreate migration
- fix(coach): enable coach panel with coach-accessible student endpoint
- fix(backend): repair compilation after domain refactoring
- fix(frontend): extract complex template expression in arabic-literature course-detail
- fix(styles): replace bare CSS vars with --lp- prefix in persian-date-input
- fix(frontend): resolve pre-existing survey build errors

#### بازسازی (11)
- refactor(frontend): decompose dashboard into shell + 3 sub-components
- refactor(frontend): full UI component library for nehzat-plus
- refactor(backend): rename ExperimentalSciences to ExperimentalScience, add Hadith module, update Math entities
- refactor(dashboard): extract inline templates, remove dead code, fix role checks
- refactor(quran): extract 8 components to html/scss with --lp-* vars
- refactor(quran): add types, interface methods, and service implementations
- refactor(backend): disable local user creation, cleanup dead configs
- refactor(frontend): add local environment config with safe prod defaults
- refactor(backend): remove MockAuth, add nehzat schema, centralize auth
- refactor(backend): remove mock auth, clean up OTUH2 integration
- refactor(admin): extract courses/assignments/attachments into admin-courses sub-component

#### مستندات (7)
- docs(roadmaps): wave 4-5 QA report + README regen
- docs(roadmaps): wave 3 subject roadmaps
- docs(roadmaps): wave 2 core role roadmaps
- docs(roadmaps): wave 1 pilot validation
- docs(roadmaps): wave 0 cross-cutting foundations
- docs(roadmaps): wave 0 foundation + bug fixes
- docs(coach): mark coach panel complete + add getCoachStudents API

#### نگهداری (1)
- chore(opencode): enable 3 plugins + compaction

#### سایر (31)
- docs: compact AGENTS.md with verified facts, fix DevAuth config claim
- docs: add Version Archive System section to AGENTS.md
- chore: add install-hooks.ps1 + move pre-push to scripts/hooks/
- docs: add PROJECT_INVENTORY.md + archive-version.ps1 script
- test: add negative access tests for 5 course paths
- feat: add dev accounts for parent, branch_manager, headquarters, evaluator roles
- fix: add roleGuard('trainee') to 5 subject routes + teacher role to TeacherController
- chore: gitignore node_modules
- docs: add Fiqh/Ahkam educational module template (┘à╪د┌ء┘ê┘ ┘┘é┘ç ┘ê ╪د╪ص┌ر╪د┘à)
- docs: add NTM Coach Training system (┘╪╕╪د┘à ╪ز╪▒╪ذ█î╪ز ┘à╪▒╪ذ█î)
- feat: Arabic Literature module with curriculum system
- chore: fix zen HA pipeline CLI invocation and update dependencies
- feat: add Persian Literature (╪د╪»╪ذ█î╪د╪ز ┘╪د╪▒╪│█î) module
- chore: add small_model, reorder plugins, update fallback chain
- fix: add missing import { vi } from vitest in testing-utils.ts
- fix: revert EnsureCreated back to Migrate for auto DB migrations
- feat: complete remaining technical items
- test: enhance smoke tests with TestBed + shared mock utilities
- feat: comprehensive refactor and feature completion
- feat: add competitions, issue surveys, leagues, teachers CRUD + survey feature modules
- refactor: restructure parent feature into panel, monthly booklet, student detail and progress card components
- chore: add backend build artifacts to gitignore
- chore: remove legacy parent component and ignore backend build artifacts
- refactor: extract coach inline template to external files and add student detail component
- feat: add IssueSurvey HTTP and mock service implementations
- feat: add IssueSurvey frontend types and API interface
- feat: register IssueSurveyService in DI container
- feat: add IssueSurvey service implementation and controller
- feat: add IssueSurvey DTOs and service interface
- feat: add IssueSurvey domain entities and DbContext configuration
- fix: align Otuh2Client config with otuh2 registration (client-id, secret)

## تغییرات نسخه v3.3.0 — خودکار (archive-version.ps1)

### نسخه v3.3.0 — 2026-08-24 (5 کامیت)
>  552 files changed, 55658 insertions(+), 184 deletions(-)

#### سایر (5)
- fix: resolve vocabulary module TypeScript errors and enable frontend build
- auth: add OIDC state param + warn-only callback check; soft 401 logout via logoutToLogin
- W1-W5: Backend study path system + backend EducationalProcess/Feedback/MaktabLookup/PhaseTransition + frontend mock API layer and mock services
- feat: add Ai, Calendar, Conversation, CourierReport, Evaluation, Gamification, Halgheh, Maktab, Map, Message, Notification, Profile, Progress, Workflow features
- chore: PROJECT_INVENTORY.md updated by archive script

## تغییرات نسخه v3.4.0 — خودکار (archive-version.ps1)

### نسخه v3.4.0 — 2026-09-13 (19 کامیت)
>  305 files changed, 114079 insertions(+), 1920 deletions(-)

#### ویژگی‌ها (5)
- feat(frontend): extract shared header component for admin and branch-manager dashboards
- feat(frontend): activate 5-phase system with dev phase switcher
- feat(dashboard): wire lessons card to learning-path route
- feat(frontend): responsive design for 11 pages (mobile/tablet/desktop)
- feat(vocabulary): add book-marker module for word extraction

#### اصلاحات (7)
- fix(frontend): wire branch-manager component to use branch-scoped API methods\n\n- Update loadData() to use getMyBranch(), getMyBranchPerformance(), getMyCoaches(), getMyBranchManagers(), getMyCoachPerformance(), getMyStudents()\n- Update mock-lesson-planner-api.service.ts to delegate to domain services\n- Update mock-admin-coaches.service.ts with getMyCoaches() and getMyBranchManagers()\n- Update mock-student-progress.service.ts with getMyStudents()\n- Update mock-headquarters.service.ts with getMyCoachPerformance()
- fix(backend): allow trainee to access own assessment history
- fix(frontend): fix NG0203 by passing explicit destroyRef to takeUntilDestroyed
- fix(backend): allow trainee to access only their own student endpoints
- fix(backend): resolve real user/student in dev signin so trainee /api/profile returns 200
- fix(frontend): notification-bell 401 guard + correct dev role logins + e2e test selectors
- fix(backend): null type fixes in admin controllers + add Playwright test config

#### بازسازی (1)
- refactor(backend): split LearningController into 3 domain controllers + fix Program.cs

#### مستندات (1)
- docs(backend): mark trainee assessment-history 403 as resolved in KNOWN_ISSUES

#### سایر (5)
- feat: lesson detail page + learning path navigation
- feat: Coach CRUD for branch-manager + Student CRUD fixes + AdminCoachesController 403 fix
- docs: record pre-existing frontend issues (NG0203 + 404s) as tracked known-issues note
- fix: role-based dashboard + controller auth + responsive + e2e tests
- feat: quran rings, vocabulary SRS, study paths, tadabbor, and responsive UI

## تغییرات نسخه v3.5.0 — خودکار (archive-version.ps1)

### نسخه v3.5.0 — 2026-11-04 (11 کامیت)
>  1987 files changed, 265328 insertions(+), 21085 deletions(-)

#### ویژگی‌ها (1)
- feat(coach): integrate Morabbi system at /coach with shared-session bridge

#### اصلاحات (4)
- fix(backend): dev sign-in 401 (DevAccount record not config-bindable) + structured startup logging
- fix(backend): startup crash - HasTables disposed EF-managed connection
- fix(backend): default-deny auth, role hardening, safe migration lifecycle, test suite green
- fix(frontend): BranchManager CRUD - resolve 9 build errors

#### بازسازی (1)
- refactor(frontend): split lesson-planner.models.ts into 29 lp-* domain files

#### نگهداری (1)
- chore(frontend): drop debug console logs, unused profile route; --lp-* vars in lesson-detail theme

#### سایر (4)
- docs: role-features and asnad content; AGENTS refresh; frontend brand asset
- chore: remove scratch files and ignore build/runtime outputs
- docs: refresh AGENTS.md files (auth, DB lifecycle, models barrel, tests); bump PROJECT_INVENTORY to v3.4.0
- docs: add project SPEC + .env.example template; mark BranchManager fix as done (84b13ed)

## تغییرات نسخه v3.6.0 — خودکار (archive-version.ps1)

### نسخه v3.6.0 — 2026-11-05 (5 کامیت)
>  40 files changed, 955 insertions(+), 264 deletions(-)

#### ویژگی‌ها (1)
- feat(coach): upgrade ظ¤ grouped nav + mobile bottom bar, stacked mobile tables, combined dashboard, SignalR live notifications, OnPush + tests

#### مستندات (3)
- docs(asnad): content updates from extraction queue
- docs(asnad): content updates from extraction queue
- docs(asnad): content updates from extraction queue

#### سایر (1)
- docs: AGENTS refresh (Morabbi integration, AuthController endpoints, Persian) + v3.5.0 inventory archive
