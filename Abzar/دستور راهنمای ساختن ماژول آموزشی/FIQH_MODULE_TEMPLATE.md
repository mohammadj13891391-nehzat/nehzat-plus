# الگوی ماژول آموزش احکام و فقه — اختصاصی نهضت پلاس
## نسخه ۱.۰ — مبتنی بر تحقیقات جهانی + ساختار حوزه + کدبیس موجود

> این الگو بر اساس تحقیق روی ۷ منبع موازی طراحی شده است:
> 1. پلتفرم‌های آموزش دینی جهان (SeekersGuidance, Bayyinah, Zaytuna, Quran.com, Muslim Pro)
> 2. الگوهای طراحی آموزشی پیشرو (Khan Academy, Duolingo, Coursera, ALEKS, Carnegie)
> 3. ساختار درسی حوزه‌های علمیه (۵۲ باب استاندارد فقه جعفری)
> 4. برنامه درسی ملی ایران (دین و زندگی + احکام تخصصی علوم معارف)
> 5. تحقیقات آکادمیک آموزش فقه (Kurikulum Berbasis Cinta, BKT, PBL)
> 6. ارزیابی و گیمیفیکیشن در آموزش دینی (۱۰ نوع ارزشیابی + ۵ سطح Tier)
> 7. تحلیل کدبیس نهضت پلاس (الگوی ۶ فایلی + ۵ ماژول موجود)

---

## فهرست محتوا
1. [مرور معماری](#۱-مرور-معماری)
2. [درخت محتوای فقه — ۵۲ باب + سطوح سنی](#۲-درخت-محتوای-فقه)
3. [موجودیت‌های دامنه (۱۵+ موجودیت)](#۳-موجودیتهای-دامنه)
4. [سیستم ارجاع مراجع (Marja' Reference)](#۴-سیستم-ارجاع-مراجع)
5. [پایپلاین تولید محتوا (Fiqh Content Pipeline)](#۵-پایپلاین-تولید-محتوا)
6. [DTOها](#۶-dtoها)
7. [سرویس و اینترفیس](#۷-سرویس-و-اینترفیس)
8. [موتور ارزشیابی فقهی (۱۰ نوع)](#۸-موتور-ارزیابی-فقهی)
9. [سیستم ردیابی بیزی (BKT) و تسلط](#۹-سیستم-ردیابی-بیزی)
10. [سیستم گیمیفیکیشن (۵ سطح Tier + Streak + Badge)](#۱۰-سیستم-گیمیفیکیشن)
11. [مدل ۳ حلقه‌ای یادگیری](#۱۱-مدل-۳-حلقهای-یادگیری)
12. [کنترلر API](#۱۲-کنترلر-api)
13. [ثبت در DI و DbContext](#۱۳-ثبت-در-di-و-dbcontext)
14. [ماژول Angular](#۱۴-ماژول-angular)
15. [API Interface + Mock (فرانت‌اند)](#۱۵-api-interface--mock)
16. [Seeder](#۱۶-seeder)
17. [چک‌لیست نهایی پیاده‌سازی](#۱۷-چکلیست-نهایی-پیادهسازی)
18. [ضمیمه: بهبودهای پیشنهادی برای MODULE_TEMPLATE اصلی](#۱۸-ضمیمه)

---

## ۱. مرور معماری

### معماری ۴ لایه + ۲ مسیر + ۳ حلقه (Duolingo + SeekersGuidance + Khan Academy)

```
                            ┌─────────────────────────────────────┐
                            │      OFFLINE CONTENT PIPELINE       │
                            │  (تولید محتوا — آفلاین، زمان‌بر)    │
                            │                                     │
                            │  Prompt Template → LLM → Candidate  │
                            │       → Human Review (محتوا نویس)   │
                            │       → Content Store (Immutable)   │
                            └──────────────┬──────────────────────┘
                                           │ Deploy
                                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     ONLINE SERVING PATH                          │
│  (سرویس به کاربر — آنلاین، زیر ۱۰۰ms)                           │
│                                                                  │
│  Content Store → Adaptive Engine (BKT + Difficulty)              │
│       → ۳ حلقه یادگیری (Outer/Middle/Inner)                     │
│       → Gamification Layer (Tier/Points/Badges)                  │
│       → API → User                                               │
└──────────────────────────────────────────────────────────────────┘
```

### ساختار پوشه‌ها (مطابق با کدبیس موجود)

```
فرانت‌اند (Angular 21)                   بک‌اند (.NET 10 Clean Architecture)
─────────────────────                    ─────────────────────────────────────
features/fiqh/                           Domain/Entities/Fiqh/
  pages/                                   ├── FiqhCourse.cs
    ├── course-list/                        ├── FiqhBook.cs
    ├── book-detail/                        ├── FiqhChapter.cs
    ├── lesson-detail/                      ├── FiqhLesson.cs
    ├── scenario-simulator/                 ├── FiqhContent.cs
    ├── fatwa-workshop/                     ├── FiqhScenario.cs
    ├── quiz/                               ├── FiqhQuestion.cs
    └── progress/                           ├── FiqhQuiz.cs
  services/                                ├── FiqhAttempt.cs
    └── fiqh.service.ts                    ├── FiqhFatwaResponse.cs
  fiqh.routes.ts                           ├── FiqhStudentProgress.cs
  fiqh.module.ts                           ├── FiqhMasteryRecord.cs
                                           ├── FiqhMarja.cs
core/                                      ├── FiqhHukm.cs
  models/                                  └── FiqhEvidence.cs
    lesson-planner.models.ts
  services/                              Application/DTOs/FiqhDtos.cs
    lesson-planner-api.interface.ts
    http-lesson-planner-api.service.ts    Application/Interfaces/IFiqhService.cs
    mock-lesson-planner-api.service.ts    Application/Interfaces/IFiqhAssessmentService.cs
                                         Infrastructure/Services/FiqhService.cs
                                         Infrastructure/Services/FiqhAssessmentService.cs
                                         Infrastructure/Services/FiqhGamificationService.cs
                                         Infrastructure/Seeders/FiqhDataSeeder.cs
                                         API/Controllers/FiqhController.cs
                                         API/Program.cs
                                         Infrastructure/Data/AppDbContext.cs
```

---

## ۲. درخت محتوای فقه — ۵۲ باب + سطوح سنی

### منطق پیش‌نیازی (Necessity → Frequency → Complexity)

```
سطح ۱ (مبتدی ۱ — ۷ تا ۹ سال)

  کتاب طهارت (بخش مقدماتی)
  ├── انواع آب (مطلق/مضاف)
  ├── وضو (شرایط + واجبات + مبطلات)
  ├── نجاسات (۱۱ مورد)
  └── مطهرات (مقدماتی)
  
  کتاب صلاة (بخش مقدماتی)
  ├── اوقات نماز
  ├── قبله
  ├── واجبات نماز (۱۱ مورد)
  ├── اذان و اقامه
  └── نماز جماعت
  
  مفاهیم پایه
  ├── احکام پنج‌گانه (واجب/حرام/مستحب/مکروه/مباح)
  ├── تقلید (مفهوم ساده)
  └── بلوغ و تکلیف

──────────────────────────────────────────────────────────────

سطح ۲ (مبتدی ۲ — ۱۰ تا ۱۲ سال)

  کتاب طهارت (تکمیلی)
  ├── غسل‌های واجب (جنابت/حیض/استحاضه/نفاس/مس میت)
  ├── تیمم (موارد/شرایط/کیفیت)
  └── جبیره
  
  کتاب صلاة (تکمیلی)
  ├── نماز قضا
  ├── نماز مسافر
  ├── مبطلات نماز
  ├── شک و سهو (خلل در نماز)
  └── نماز آیات
  
  کتاب صوم
  ├── نیت روزه
  ├── مفطرات (۱۰ مورد)
  ├── کفارات
  └── قضای روزه
  
  کتاب خمس
  ├── موارد وجوب (۷ مورد)
  └── تقسیم خمس

──────────────────────────────────────────────────────────────

سطح ۳ (متوسط — ۱۳ تا ۱۵ سال)

  کتاب زکات
  ├── زکات ۹ چیز
  ├── نصاب‌ها
  └── مصرف زکات
  
  کتاب حج
  ├── استطاعت
  ├── انواع حج
  └── اعمال عمره و حج
  
  کتاب امر به معروف و نهی از منکر
  ├── شرایط وجوب
  └── مراحل سه‌گانه
  
  کتاب تجارت (مقدماتی)
  ├── شرایط عقد
  ├── خیارات
  └── ربای معاملی و قرضی
  
  کتاب نکاح (مقدماتی)
  ├── عقد دائم و موقت
  ├── محارم
  └── مهر و نفقه

──────────────────────────────────────────────────────────────

سطح ۴ (متوسط ۲ — ۱۶ تا ۱۸ سال)

  کتاب تجارت (تکمیلی)
  ├── شرکت و مضاربه
  ├── اجاره
  ├── وکالت
  └── معاملات باطل
  
  کتاب طلاق
  ├── شرایط طلاق
  ├── اقسام طلاق
  └── عده
  
  کتاب ارث
  ├── طبقات ارث
  └── سهم‌الباقی و حجب
  
  کتاب قضاء و شهادات
  ├── شرایط قاضی
  └── بینه و قسم
  
  کتاب غصب و احیاء موات

──────────────────────────────────────────────────────────────

سطح ۵ (پیشرفته — ۱۸+ و حوزوی)

  کتاب حدود و تعزیرات
  کتاب قصاص
  کتاب دیات
  کتاب ایمان و نذر
  کتاب وقف و وصیت
  کتاب اصول فقه مقدماتی
    ├── کتاب (قرآن)
    ├── سنت
    ├── اجماع
    ├── عقل
    └── ادله فقاهتی (اصول عملیه)
```

### نقشه کامل ۵۲ باب (برای داده‌های پایه Seeder)

| کد | بخش | کتاب | سطح سنی | پیش‌نیاز |
|:--:|:----:|:----:|:-------:|:--------:|
| IB-01 | عبادات | طهارت | ۱ | — |
| IB-02 | عبادات | صلاة | ۱ | IB-01 |
| IB-03 | عبادات | زکات | ۳ | IB-02 |
| IB-04 | عبادات | خمس | ۲ | IB-02 |
| IB-05 | عبادات | صوم | ۲ | IB-01 |
| IB-06 | عبادات | اعتکاف | ۴ | IB-05 |
| IB-07 | عبادات | حج | ۳ | IB-04 |
| IB-08 | عبادات | عمره | ۳ | IB-07 |
| IB-09 | عبادات | جهاد | ۴ | — |
| IB-10 | عبادات | امر به معروف | ۳ | — |
| UQ-01 | عقود | تجارت | ۳ | — |
| UQ-02 | عقود | رهن | ۴ | UQ-01 |
| UQ-03 | عقود | مفلس | ۵ | UQ-01 |
| UQ-04 | عقود | حجر | ۴ | — |
| UQ-05 | عقود | ضمان | ۴ | UQ-01 |
| UQ-06 | عقود | صلح | ۴ | UQ-01 |
| UQ-07 | عقود | شرکت | ۴ | UQ-01 |
| UQ-08 | عقود | مضاربه | ۴ | UQ-01 |
| UQ-09 | عقود | مزارعه و مساقات | ۵ | UQ-01 |
| UQ-10 | عقود | ودیعه | ۴ | — |
| UQ-11 | عقود | عاریه | ۳ | — |
| UQ-12 | عقود | اجاره | ۴ | UQ-01 |
| UQ-13 | عقود | وکالت | ۴ | — |
| UQ-14 | عقود | وقف و صدقات | ۴ | — |
| UQ-15 | عقود | سکنی و حبس | ۵ | — |
| UQ-16 | عقود | هبه | ۳ | — |
| UQ-17 | عقود | سبق و رمایه | ۵ | — |
| UQ-18 | عقود | وصیت | ۴ | — |
| UQ-19 | عقود | نکاح | ۳ | — |
| IQ-01 | ایقاعات | طلاق | ۴ | UQ-19 |
| IQ-02 | ایقاعات | خلع و مبارات | ۵ | IQ-01 |
| IQ-03 | ایقاعات | ظهار | ۵ | UQ-19 |
| IQ-04 | ایقاعات | ایلاء | ۵ | UQ-19 |
| IQ-05 | ایقاعات | لعان | ۵ | UQ-19 |
| IQ-06 | ایقاعات | عتق | ۵ | — |
| IQ-07 | ایقاعات | تدبیر و مکاتبه | ۵ | IQ-06 |
| IQ-08 | ایقاعات | اقرار | ۴ | — |
| IQ-09 | ایقاعات | جعاله | ۴ | — |
| IQ-10 | ایقاعات | ایمان | ۴ | — |
| IQ-11 | ایقاعات | نذر | ۴ | — |
| AH-01 | احکام | صید و ذباحه | ۴ | — |
| AH-02 | احکام | اطعمة و اشربه | ۳ | — |
| AH-03 | احکام | غصب | ۳ | — |
| AH-04 | احکام | شفعه | ۵ | — |
| AH-05 | احکام | احیاء موات | ۵ | — |
| AH-06 | احکام | لقطه | ۴ | — |
| AH-07 | احکام | فرائض (ارث) | ۴ | — |
| AH-08 | احکام | قضاء | ۵ | — |
| AH-09 | احکام | شهادات | ۵ | — |
| AH-10 | احکام | حدود و تعزیرات | ۵ | — |
| AH-11 | احکام | قصاص | ۵ | — |
| AH-12 | احکام | دیات | ۵ | — |

---

## ۳. موجودیت‌های دامنه

### ۳.۱ هسته اصلی (Core Hierarchy)

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Fiqh
{
    /// <summary>
    /// کورس فقهی سطح بالا — مثل "فقه العبادات"، "فقه المعاملات"
    /// </summary>
    [Table("Nehzat_fiqh_courses")]
    public class FiqhCourse
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(200)")]
        public string TitleFa { get; set; } = string.Empty;  // عنوان فارسی

        [Column(TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(20)")]
        public string Level { get; set; } = "beginner"; // beginner, intermediate, advanced, hawzah

        [Column(TypeName = "int")]
        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [JsonIgnore]
        public ICollection<FiqhBook> Books { get; set; } = new List<FiqhBook>();
    }

    /// <summary>
    /// کتاب فقهی — مثل "کتاب طهارت"، "کتاب صلاة"
    /// </summary>
    [Table("Nehzat_fiqh_books")]
    public class FiqhBook
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int CourseId { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        public string Code { get; set; } = string.Empty; // IB-01, IB-02, ...

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(200)")]
        public string TitleFa { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(20)")]
        public string SectionType { get; set; } = "ibadat"; // ibadat, uqud, iqaat, ahkam

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLevel { get; set; } = "beginner";

        [Column(TypeName = "int")]
        public int MinAge { get; set; } = 7; // حداقل سن مناسب

        [Column(TypeName = "int")]
        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(CourseId))]
        [JsonIgnore]
        public FiqhCourse Course { get; set; } = null!;

        [JsonIgnore]
        public ICollection<FiqhChapter> Chapters { get; set; } = new List<FiqhChapter>();
    }

    /// <summary>
    /// باب فقهی — مثل "ابواب وضو"، "ابواب نجاسات"
    /// </summary>
    [Table("Nehzat_fiqh_chapters")]
    public class FiqhChapter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int BookId { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(200)")]
        public string TitleFa { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(BookId))]
        [JsonIgnore]
        public FiqhBook Book { get; set; } = null!;

        [JsonIgnore]
        public ICollection<FiqhLesson> Lessons { get; set; } = new List<FiqhLesson>();
    }

    /// <summary>
    /// درس فقهی — مثل "شرایط وضو"، "مبطلات وضو"
    /// </summary>
    [Table("Nehzat_fiqh_lessons")]
    public class FiqhLesson
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ChapterId { get; set; }

        [Column(TypeName = "nvarchar(300)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(300)")]
        public string TitleFa { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Summary { get; set; } = string.Empty; // خلاصه درس

        [Column(TypeName = "nvarchar(20)")]
        public string ContentType { get; set; } = "text"; // text, video, interactive, scenario

        [Column(TypeName = "int")]
        public int EstimatedMinutes { get; set; } = 10;

        [Column(TypeName = "int")]
        public int SortOrder { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string RequiredMasteryLevel { get; set; } = "attempted"; // attempted, familiar, proficient, mastered

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(ChapterId))]
        [JsonIgnore]
        public FiqhChapter Chapter { get; set; } = null!;

        [JsonIgnore]
        public ICollection<FiqhContent> Contents { get; set; } = new List<FiqhContent>();
        [JsonIgnore]
        public ICollection<FiqhScenario> Scenarios { get; set; } = new List<FiqhScenario>();
    }
}
```

### ۳.۲ محتوا و سناریو

```csharp
/// <summary>
/// محتوای یک درس — می‌تواند چندین قطعه محتوا داشته باشد
/// </summary>
[Table("Nehzat_fiqh_contents")]
public class FiqhContent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int LessonId { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string ContentType { get; set; } = "text"; // text, video, image, audio, interactive

    [Column(TypeName = "nvarchar(100)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string ContentJson { get; set; } = string.Empty; // محتوای ساختاریافته JSON

    [Column(TypeName = "text")]
    public string BodyText { get; set; } = string.Empty; // متن اصلی برای نوع text

    [Column(TypeName = "nvarchar(500)")]
    public string VideoUrl { get; set; } = string.Empty; // برای نوع video

    [Column(TypeName = "int")]
    public int SortOrder { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "draft"; // draft, published, archived

    [Column(TypeName = "int")]
    public int Version { get; set; } = 1;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(LessonId))]
    [JsonIgnore]
    public FiqhLesson Lesson { get; set; } = null!;
}

/// <summary>
/// سناریوی فقهی — قلب یادگیری مسئله‌محور
/// </summary>
[Table("Nehzat_fiqh_scenarios")]
public class FiqhScenario
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int LessonId { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string ScenarioType { get; set; } = "case-study"; // case-study, branching, fatwa-writing, comparative

    [Column(TypeName = "text")]
    public string ScenarioText { get; set; } = string.Empty; // شرح سناریو

    [Column(TypeName = "text")]
    public string Hints { get; set; } = string.Empty; // راهنمایی‌های JSON

    [Column(TypeName = "text")]
    public string ExpectedAnswer { get; set; } = string.Empty; // پاسخ مورد انتظار JSON

    [Column(TypeName = "text")]
    public string RubricJson { get; set; } = string.Empty; // معیارهای نمره‌دهی JSON

    [Column(TypeName = "nvarchar(500)")]
    public string MarjaReferences { get; set; } = string.Empty; // ارجاعات به مراجع JSON

    [Column(TypeName = "int")]
    public int DifficultyRating { get; set; } = 1; // 1-5

    [Column(TypeName = "int")]
    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(LessonId))]
    [JsonIgnore]
    public FiqhLesson Lesson { get; set; } = null!;
}
```

### ۳.۳ ارزشیابی و تلاش

```csharp
/// <summary>
/// سؤال فقهی — با قابلیت پارامتری (Duolingo-style)
/// </summary>
[Table("Nehzat_fiqh_questions")]
public class FiqhQuestion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int? LessonId { get; set; } // nullable برای سوالات میان‌دوره‌ای
    public int? ScenarioId { get; set; } // nullable برای سوالات وابسته به سناریو

    [Column(TypeName = "nvarchar(50)")]
    public string QuestionType { get; set; } = "multiple-choice";
    // multiple-choice: ۴ گزینه‌ای
    // true-false: صحیح/غلط
    // categorization: دسته‌بندی (واجب/حرام/...)
    // ordering: ترتیب‌بندی
    // matching: تطبیق
    // scenario: سناریو محور
    // fatwa: فتوا نویسی (با rubric)

    [Column(TypeName = "text")]
    public string QuestionText { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string OptionsJson { get; set; } = string.Empty;
    // برای MCQ: [{ "text": "...", "isCorrect": true, "marjaRef": "..." }, ...]
    // برای categorization: { "categories": {...}, "items": [...] }

    [Column(TypeName = "text")]
    public string CorrectAnswerJson { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Explanation { get; set; } = string.Empty; // توضیح پاسخ

    [Column(TypeName = "int")]
    public int Points { get; set; } = 1;

    [Column(TypeName = "int")]
    public int DifficultyRating { get; set; } = 1; // 1-5

    [Column(TypeName = "nvarchar(100)")]
    public string TopicTag { get; set; } = string.Empty; // برچسب موضوعی، e.g. "tahara.wudu.nullifiers"

    [Column(TypeName = "nvarchar(500)")]
    public string MarjaTagsJson { get; set; } = string.Empty; // ["sistani", "khamenei", "makarem"]

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// آزمون فقهی
/// </summary>
[Table("Nehzat_fiqh_quizzes")]
public class FiqhQuiz
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int? LessonId { get; set; }
    public int? ChapterId { get; set; }
    public int? BookId { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string QuizType { get; set; } = "lesson-quiz";
    // lesson-quiz: بعد از هر درس
    // chapter-quiz: بعد از هر باب
    // book-quiz: بعد از هر کتاب
    // mastery-challenge: آزمون ترکیبی از چند مهارت
    // comprehensive: جامع

    [Column(TypeName = "int")]
    public int QuestionCount { get; set; } = 10;

    [Column(TypeName = "int")]
    public int PassingScore { get; set; } = 70; // درصد قبولی

    [Column(TypeName = "int")]
    public int MaxAttempts { get; set; } = 3;

    [Column(TypeName = "int")]
    public int TimeLimitMinutes { get; set; } = 0; // 0 = unlimited

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "draft"; // draft, published, archived

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// تلاش دانش‌آموز برای یک سؤال
/// </summary>
[Table("Nehzat_fiqh_attempts")]
public class FiqhAttempt
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }
    public int QuestionId { get; set; }
    public int? QuizId { get; set; }

    [Column(TypeName = "text")]
    public string SelectedAnswerJson { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }

    [Column(TypeName = "int")]
    public int AttemptNumber { get; set; }

    [Column(TypeName = "int")]
    public int TimeSpentSeconds { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string LearningPhase { get; set; } = "practice"; // practice, quiz, mastery-challenge, scenario

    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// پاسخ فتوا نویسی (برای سوالات از نوع fatwa)
/// </summary>
[Table("Nehzat_fiqh_fatwa_responses")]
public class FiqhFatwaResponse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }
    public int ScenarioId { get; set; }

    [Column(TypeName = "text")]
    public string ResponseText { get; set; } = string.Empty; // متن فتوا

    [Column(TypeName = "text")]
    public string EvidenceJson { get; set; } = string.Empty; // ادله استفاده شده

    [Column(TypeName = "text")]
    public string SelfAssessment { get; set; } = string.Empty; // خودارزیابی JSON

    public double? PeerScore { get; set; } // نمره همتا
    public double? MentorScore { get; set; } // نمره استاد

    [Column(TypeName = "text")]
    public string MentorFeedback { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "submitted"; // submitted, peer-reviewed, mentor-graded

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? GradedAt { get; set; }
}
```

### ۳.۴ پیشرفت، تسلط و ردیابی

```csharp
/// <summary>
/// پیشرفت دانش‌آموز در هر درس — با داده‌های BKT
/// </summary>
[Table("Nehzat_fiqh_student_progress")]
public class FiqhStudentProgress
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }
    public int LessonId { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "not_started";
    // not_started, in_progress, completed

    [Column(TypeName = "int")]
    public int TotalAttempts { get; set; } = 0;

    [Column(TypeName = "int")]
    public int CorrectAttempts { get; set; } = 0;

    [Column(TypeName = "int")]
    public int ConsecutiveCorrect { get; set; } = 0;

    [Column(TypeName = "int")]
    public int TimeSpentMinutes { get; set; } = 0;

    // پارامترهای BKT
    [Column(TypeName = "float")]
    public double PKnown { get; set; } = 0.0; // احتمال یادگیری واقعی

    [Column(TypeName = "datetime2")]
    public DateTime? LastPracticedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// رکورد تسلط (Mastery Record) — منطبق با ۵ سطح Khan Academy
/// </summary>
[Table("Nehzat_fiqh_mastery_records")]
public class FiqhMasteryRecord
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }
    public int SkillId { get; set; } // می‌تواند LessonId یا TopicTag باشد

    [Column(TypeName = "nvarchar(20)")]
    public string Level { get; set; } = "not_started";
    // not_started, struggling, needs_practice, proficient, mastered

    [Column(TypeName = "float")]
    public double ProficiencyScore { get; set; } = 0.0; // 0.0 - 1.0

    [Column(TypeName = "int")]
    public int TotalAttemptsCrossModule { get; set; } = 0;

    [Column(TypeName = "int")]
    public int CorrectInMasteryChallenges { get; set; } = 0; // تعداد صحیح در آزمون‌های ترکیبی

    public DateTime? LastMasteryChallengeAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

### ۳.۵ مرجع و حکم

```csharp
/// <summary>
/// مرجع تقلید — برای سیستم تطبیق فتوا
/// </summary>
[Table("Nehzat_fiqh_marjas")]
public class FiqhMarja
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string FullName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string FullNameFa { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string ShortCode { get; set; } = string.Empty; // sistani, khamenei, makarem, ...

    [Column(TypeName = "text")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(500)")]
    public string PhotoUrl { get; set; } = string.Empty;

    [Column(TypeName = "int")]
    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// نوع حکم شرعی — واجب، حرام، مستحب، مکروه، مباح
/// </summary>
[Table("Nehzat_fiqh_ahkam_types")]
public class FiqhHukm
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Code { get; set; } = string.Empty; // wajib, haram, mustahab, makruh, mubah

    [Column(TypeName = "nvarchar(100)")]
    public string TitleFa { get; set; } = string.Empty; // واجب، حرام، ...

    [Column(TypeName = "nvarchar(500)")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string ColorHex { get; set; } = string.Empty; // رنگ نمایشی
}

/// <summary>
/// دلیل فقهی — قرآن، حدیث، اجماع، عقل
/// </summary>
[Table("Nehzat_fiqh_evidences")]
public class FiqhEvidence
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int LessonId { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string EvidenceType { get; set; } = "quran"; // quran, hadith, ijma, aql

    [Column(TypeName = "nvarchar(500)")]
    public string SourceReference { get; set; } = string.Empty; // سوره/آیه، کتاب حدیث، ...

    [Column(TypeName = "nvarchar(50)")]
    public string SourceLanguage { get; set; } = "ar"; // ar, fa

    [Column(TypeName = "text")]
    public string OriginalText { get; set; } = string.Empty; // متن اصلی (عربی)

    [Column(TypeName = "text")]
    public string TranslationFa { get; set; } = string.Empty; // ترجمه فارسی

    [Column(TypeName = "int")]
    public int SortOrder { get; set; }

    [ForeignKey(nameof(LessonId))]
    [JsonIgnore]
    public FiqhLesson Lesson { get; set; } = null!;
}
```

### ۳.۶ گیمیفیکیشن

```csharp
/// <summary>
/// امتیازات و دستاوردهای گیمیفیکیشن
/// </summary>
[Table("Nehzat_fiqh_gamification")]
public class FiqhGamification
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }

    [Column(TypeName = "int")]
    public int TotalPoints { get; set; } = 0;

    [Column(TypeName = "nvarchar(20)")]
    public string Tier { get; set; } = "bronze"; // bronze, silver, gold, platinum, diamond

    [Column(TypeName = "int")]
    public int CurrentStreak { get; set; } = 0; // روزهای متوالی

    [Column(TypeName = "int")]
    public int LongestStreak { get; set; } = 0;

    [Column(TypeName = "int")]
    public int LessonsCompleted { get; set; } = 0;

    [Column(TypeName = "int")]
    public int QuizzesPassed { get; set; } = 0;

    [Column(TypeName = "int")]
    public int ScenariosSolved { get; set; } = 0;

    [Column(TypeName = "int")]
    public int PerfectQuizzes { get; set; } = 0; // 100% در آزمون

    [Column(TypeName = "text")]
    public string EarnedBadges { get; set; } = "[]"; // JSON array نشان‌های کسب شده

    [Column(TypeName = "datetime2")]
    public DateTime LastActivityDate { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

---

## ۴. سیستم ارجاع مراجع (Marja' Reference)

### معماری تطبیق فتوا

یکی از نوآوری‌های کلیدی ماژول فقه — نمایش یک مسئله با فتاوای مراجع مختلف:

```
سؤال: "آیا قصد ماندن ۱۰ روز در سفر برای تمام بودن نماز کافی است؟"

📋 پاسخ بر اساس مرجع تقلید شما:

┌──────────────────────────────────────────────────┐
│ مرجع: حضرت آیت‌الله العظمی سیستانی (مدظله)      │
│ حکم: بله، اگر قصد ماندن ۱۰ روز کامل داشته باشد. │
│ دلیل: منهاج الصالحین، ج۱، ص۲۴۵                   │
├──────────────────────────────────────────────────┤
│ مرجع: حضرت آیت‌الله العظمی خامنه‌ای (مدظله)     │
│ حکم: بله، کافی است.                              │
│ دلیل: رساله آموزشی، مسأله ۱۳۴۵                   │
├──────────────────────────────────────────────────┤
│ مرجع: حضرت آیت‌الله العظمی مکارم شیرازی (مدظله) │
│ حکم: قصد ۱۰ روز کافی است.                       │
│ دلیل: رساله توضیح المسائل، مسأله ۱۳۸۸            │
└──────────────────────────────────────────────────┘
```

### طراحی داده (JSON داخل FiqhQuestion.OptionsJson و FiqhScenario.MarjaReferences)

```json
{
  "question": "آیا دست زدن به نامحرم وضو را باطل می‌کند؟",
  "options": [
    {
      "text": "بله، مطلقاً وضو را باطل می‌کند",
      "isCorrect": false,
      "marjaVerdicts": {
        "sistani": "haram",
        "khamenei": "haram",
        "makarem": "haram"
      }
    },
    {
      "text": "خیر، به تنهایی وضو را باطل نمی‌کند",
      "isCorrect": true,
      "marjaVerdicts": {
        "sistani": "sahih",
        "khamenei": "sahih",
        "makarem": "sahih"
      },
      "evidence": {
        "quran": "",
        "hadith": "وسائل الشیعه، ج۱، ص۲۵۶",
        "marjaRef": "سیستانی: منهاج الصالحین، ج۱، مسأله ۳۴۲"
      }
    }
  ],
  "noteForAdvanced": "برخی فقهای اهل سنت معتقدند تماس با نامحرم وضو را باطل می‌کند (شافعی)"
}
```

---

## ۵. پایپلاین تولید محتوا

### مسیر آفلاین (تولید محتوا توسط LLM + بازبینی متخصص)

```
محتوا نویس (حوزوی/معلم) 
    ↓
انتخاب: موضوع + سطح + نوع سؤال + مرجع
    ↓
Prompt Template → LLM → N کاندیدا
    ↓
بازبینی متخصص (Second Opinion):
  ✅ تائید → Content Store (immutable, versioned)
  ✏️ ویرایش → بازگشت به LLM با corrections
  ❌ رد → حذف + ثبت دلیل
    ↓
وضعیت: draft → review → published → archived
```

### قالب‌های Prompt Template (برای تولید سؤال)

```csharp
// قالب تولید سؤال چهارگزینه‌ای فقهی
public static class FiqhPromptTemplates
{
    public const string MCQ_TEMPLATE = @"
موضوع: {topic}
سطح: {difficulty}
مرجع: {marja}
نوع: چهارگزینه‌ای فقهی

لطفاً یک سؤال چهارگزینه‌ای با موارد زیر تولید کن:
۱. سناریوی واقعی و ملموس
۲. ۴ گزینه که فقط یکی صحیح است
۳. گزینه‌های انحرافی قانع‌کننده
۴. ارجاع به منبع فتوای صحیح
۵. توضیح پاسخ

متن سؤال باید:
- متناسب با رده سنی {ageGroup} باشد
- شامل {learningObjective} باشد
- از کلمات {forbiddenTerms} استفاده نشود
";

    public const string SCENARIO_TEMPLATE = @"
برای آموزش {topic} در سطح {difficulty} یک سناریوی فقهی طراحی کن:

سناریو باید:
- یک موقعیت واقعی از زندگی روزمره را توصیف کند
- شامل {minDecisions} تصمیم‌گیری فقهی باشد
- پاسخ طبق فتوای {marja} داده شود
- شامل ادله (قرآن یا حدیث) باشد

خروجی به صورت JSON:
{
  ""title"": ""..."",
  ""scenario"": ""..."",
  ""questions"": [ ],
  ""expectedRuling"": ""..."",
  ""evidence"": ""..."",
  ""marjaRef"": ""...""
}
";
}
```

---

## ۶. DTOها

```csharp
using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    // ==================== درخت محتوا ====================

    public record CreateFiqhCourseRequest(
        [Required] string Title,
        [Required] string TitleFa,
        string Description = "",
        string Level = "beginner",
        int SortOrder = 0
    );

    public record CreateFiqhBookRequest(
        [Required] string TitleFa,
        [Required] string Code,
        string SectionType = "ibadat",
        string DifficultyLevel = "beginner",
        int MinAge = 7,
        int SortOrder = 0
    );

    public record CreateFiqhChapterRequest(
        [Required] string TitleFa,
        int SortOrder = 0
    );

    public record CreateFiqhLessonRequest(
        [Required] string TitleFa,
        string ContentType = "text",
        int EstimatedMinutes = 10,
        int SortOrder = 0
    );

    // ==================== پاسخ‌ها ====================

    public record FiqhCourseDto(
        int Id, string Title, string TitleFa, string Level, int SortOrder, DateTime CreatedAt
    );

    public record FiqhCourseDetailDto(
        int Id, string Title, string TitleFa, string Description, string Level,
        int SortOrder, DateTime CreatedAt, List<FiqhBookDto> Books
    );

    public record FiqhBookDto(
        int Id, string Code, string Title, string TitleFa, string SectionType,
        string DifficultyLevel, int MinAge, int SortOrder
    );

    public record FiqhChapterDto(
        int Id, int BookId, string Title, string TitleFa, int SortOrder
    );

    public record FiqhLessonDto(
        int Id, int ChapterId, string Title, string TitleFa, string ContentType,
        int EstimatedMinutes, int SortOrder, int ProgressPercent
    );

    public record FiqhLessonDetailDto(
        int Id, string Title, string TitleFa, string Summary, string ContentType,
        int EstimatedMinutes, int SortOrder,
        List<FiqhContentDto> Contents,
        List<FiqhScenarioDto> Scenarios,
        List<FiqhEvidenceDto> Evidences
    );

    public record FiqhContentDto(
        int Id, string ContentType, string Title, string BodyText,
        string VideoUrl, string ContentJson, int SortOrder
    );

    public record FiqhScenarioDto(
        int Id, string ScenarioType, string ScenarioText, int DifficultyRating
    );

    public record FiqhEvidenceDto(
        int Id, string EvidenceType, string SourceReference,
        string OriginalText, string TranslationFa
    );

    // ==================== ارزشیابی ====================

    public record FiqhQuestionDto(
        int Id, int? LessonId, string QuestionType, string QuestionText,
        string OptionsJson, string TopicTag, int DifficultyRating, int Points
    );

    public record QuizSubmissionRequest(
        [Required] int QuizId,
        [Required] int StudentId,
        [Required] List<AnswerItem> Answers
    );

    public record AnswerItem(
        int QuestionId,
        string SelectedAnswerJson,
        int TimeSpentSeconds
    );

    public record QuizResultDto(
        int QuizId, int StudentId, int Score, int MaxScore,
        double Percentage, bool Passed, List<AnswerResultDto> Details
    );

    public record AnswerResultDto(
        int QuestionId, bool IsCorrect, string CorrectAnswer,
        string Explanation, string MarjaRef
    );

    // ==================== پیشرفت ====================

    public record ProgressSummaryDto(
        int StudentId, int TotalLessons, int CompletedLessons,
        double OverallPercent, int CurrentStreak,
        string Tier, int TotalPoints, string[] EarnedBadges,
        double AveragePKnown
    );

    public record MasteryDto(
        string SkillId, string SkillName, string Level,
        double ProficiencyScore, DateTime LastPracticed
    );

    // ==================== سناریو و فتوا ====================

    public record FatwaSubmissionRequest(
        [Required] int ScenarioId,
        [Required] int StudentId,
        [Required] string ResponseText,
        string EvidenceJson = "{}"
    );

    public record FatwaReviewRequest(
        double? PeerScore = null,
        double? MentorScore = null,
        string MentorFeedback = ""
    );

    // ==================== جستجو ====================

    public record SearchByTopicRequest(
        string Query = "",
        string Difficulty = "",
        string BookCode = "",
        string SectionType = "",
        string MarjaCode = ""
    );
}
```

### DTOهای به‌روزرسانی (همه فیلدها nullable)

```csharp
public record UpdateFiqhCourseRequest(
    string? Title = null,
    string? TitleFa = null,
    string? Description = null,
    string? Level = null,
    int? SortOrder = null
);
// به همین ترتیب برای همه موجودیت‌ها
public record UpdateFiqhBookRequest(
    string? TitleFa = null,
    string? DifficultyLevel = null,
    int? MinAge = null,
    int? SortOrder = null
);
public record UpdateFiqhLessonRequest(
    string? TitleFa = null,
    string? Summary = null,
    string? ContentType = null,
    int? EstimatedMinutes = null,
    int? SortOrder = null
);
```

---

## ۷. سرویس و اینترفیس

### اینترفیس اصلی

```csharp
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IFiqhService
    {
        // ==================== درخت محتوا ====================

        // کورس‌ها
        Task<List<FiqhCourseDto>> GetCoursesAsync();
        Task<FiqhCourseDetailDto?> GetCourseByIdAsync(int id);

        // کتاب‌ها
        Task<List<FiqhBookDto>> GetBooksAsync(int? courseId = null);
        Task<List<FiqhBookDto>> GetBooksBySectionAsync(string sectionType); // ibadat, uqud, ...
        Task<List<FiqhBookDto>> GetBooksByAgeAsync(int age);

        // فصل‌ها
        Task<List<FiqhChapterDto>> GetChaptersAsync(int bookId);

        // درس‌ها
        Task<List<FiqhLessonDto>> GetLessonsAsync(int chapterId);
        Task<FiqhLessonDetailDto?> GetLessonByIdAsync(int id);
        Task<List<FiqhLessonDto>> GetLessonsByMasteryAsync(int studentId, string level);

        // محتوا
        Task<FiqhContentDto> CreateContentAsync(int lessonId, CreateFiqhContentRequest request);
        Task PublishContentAsync(int contentId);

        // ==================== جستجو و فیلتر ====================

        Task<List<FiqhBookDto>> SearchBooksAsync(string query);
        Task<List<FiqhLessonDto>> SearchLessonsAsync(string query);
        Task<List<FiqhLessonDto>> GetRecommendedLessonsAsync(int studentId, int count = 5);

        // ==================== پیشرفت ====================

        Task<ProgressSummaryDto> GetStudentProgressAsync(int studentId);
        Task<List<MasteryDto>> GetStudentMasteryAsync(int studentId);
        Task<double> GetOverallProgressAsync(int studentId, int courseId);

        // ==================== مراجع ====================

        Task<List<FiqhMarjaDto>> GetMarjasAsync();
        Task<FiqhMarjaDto?> GetMarjaByCodeAsync(string code);

        // ==================== گیمیفیکیشن ====================

        Task<string> GetStudentTierAsync(int studentId);
        Task<int> GetStudentStreakAsync(int studentId);
        Task<List<string>> GetEarnedBadgesAsync(int studentId);

        // ==================== CRUD استاندارد ====================

        Task<FiqhCourseDto> CreateCourseAsync(CreateFiqhCourseRequest request);
        Task<FiqhBookDto> CreateBookAsync(int courseId, CreateFiqhBookRequest request);
        Task<FiqhChapterDto> CreateChapterAsync(int bookId, CreateFiqhChapterRequest request);
        Task<FiqhLessonDto> CreateLessonAsync(int chapterId, CreateFiqhLessonRequest request);

        Task<FiqhCourseDto> UpdateCourseAsync(int id, UpdateFiqhCourseRequest request);
        Task<FiqhLessonDto> UpdateLessonAsync(int id, UpdateFiqhLessonRequest request);

        Task DeleteCourseAsync(int id);
        Task DeleteLessonAsync(int id);
    }
}
```

### اینترفیس ارزشیابی

```csharp
namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IFiqhAssessmentService
    {
        // ==================== سؤال و آزمون ====================

        Task<List<FiqhQuestionDto>> GetQuestionsForLessonAsync(int lessonId, int count = 10);
        Task<List<FiqhQuestionDto>> GenerateQuizAsync(int quizId, int studentId);
        // تولید تطبیقی بر اساس BKT — سوالاتی که P_known نزدیک ۰.۵ است

        Task<QuizResultDto> SubmitQuizAsync(QuizSubmissionRequest request);

        // ==================== سناریو ====================

        Task<FiqhScenarioDto> GetScenarioAsync(int scenarioId);
        Task<List<FiqhScenarioDto>> GetScenariosForLessonAsync(int lessonId);
        Task<FiqhFatwaResponse> SubmitFatwaAsync(FatwaSubmissionRequest request);
        Task<FiqhFatwaResponse> ReviewFatwaAsync(int responseId, FatwaReviewRequest request);

        // ==================== Mastery Challenge ====================
        // آزمون ترکیبی از چند مهارت مختلف (به سبک Khan Academy)

        Task<MasteryChallengeDto> GenerateMasteryChallengeAsync(int studentId);
        // انتخاب ۴-۶ مهارت که:
        // 1. بیش از همه از آخرین تمرینشان گذشته (decay)
        // 2. نزدیک به Mastering هستند
        // 3. پیش‌نیاز مباحث بعدی هستند

        Task<QuizResultDto> SubmitMasteryChallengeAsync(int studentId, QuizSubmissionRequest request);

        // ==================== تحلیل ====================

        Task<double> GetStudentWeaknessAreasAsync(int studentId);
        // تشخیص مباحثی که P_known پایین دارند

        Task<List<FiqhQuestionDto>> GetRemedialQuestionsAsync(int studentId, string topicTag);
        // سوالات جبرانی برای مباحث ضعیف
    }
}
```

### پیاده‌سازی

```csharp
// FiqlService.cs — الگوی پیاده‌سازی (بخشی از کلاس)

public class FiqhService : IFiqhService
{
    private readonly AppDbContext _db;
    private readonly ILogger<FiqhService> _logger;

    public FiqhService(AppDbContext db, ILogger<FiqhService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<List<FiqhBookDto>> GetBooksByAgeAsync(int age)
    {
        return await _db.Set<FiqhBook>()
            .Where(b => b.MinAge <= age)
            .OrderBy(b => b.SortOrder)
            .Select(b => new FiqhBookDto(
                b.Id, b.Code, b.Title, b.TitleFa,
                b.SectionType, b.DifficultyLevel, b.MinAge, b.SortOrder))
            .ToListAsync();
    }

    public async Task<List<FiqhLessonDto>> GetRecommendedLessonsAsync(int studentId, int count)
    {
        // توصیه درس بعدی بر اساس:
        // 1. درس‌هایی که پیش‌نیازشان Mastered شده
        // 2. درس‌هایی که بیش از همه از آخرین تمرینشان گذشته
        // 3. درس‌هایی که Outer Fringe دانش‌آموز هستند

        var completedLessons = await _db.Set<FiqhStudentProgress>()
            .Where(p => p.StudentId == studentId && p.Status == "completed")
            .Select(p => p.LessonId)
            .ToListAsync();

        return await _db.Set<FiqhLesson>()
            .Where(l => !completedLessons.Contains(l.Id))
            .OrderBy(l => l.SortOrder)
            .Take(count)
            .Select(l => new FiqhLessonDto(
                l.Id, l.ChapterId, l.Title, l.TitleFa,
                l.ContentType, l.EstimatedMinutes, l.SortOrder, 0))
            .ToListAsync();
    }

    public async Task<ProgressSummaryDto> GetStudentProgressAsync(int studentId)
    {
        var totalLessons = await _db.Set<FiqhLesson>().CountAsync();
        var completed = await _db.Set<FiqhStudentProgress>()
            .CountAsync(p => p.StudentId == studentId && p.Status == "completed");

        var gam = await _db.Set<FiqhGamification>()
            .FirstOrDefaultAsync(g => g.StudentId == studentId);

        var avgPKnown = await _db.Set<FiqhStudentProgress>()
            .Where(p => p.StudentId == studentId)
            .AverageAsync(p => (double?)p.PKnown) ?? 0.0;

        return new ProgressSummaryDto(
            studentId, totalLessons, completed,
            totalLessons > 0 ? Math.Round((double)completed / totalLessons * 100, 1) : 0.0,
            gam?.CurrentStreak ?? 0,
            gam?.Tier ?? "bronze",
            gam?.TotalPoints ?? 0,
            string.IsNullOrEmpty(gam?.EarnedBadges)
                ? Array.Empty<string>()
                : System.Text.Json.JsonSerializer.Deserialize<string[]>(gam.EarnedBadges) ?? Array.Empty<string>(),
            Math.Round(avgPKnown, 2)
        );
    }
}
```

---

## ۸. موتور ارزشیابی فقهی

### ۱۰ نوع سؤال قابل پیاده‌سازی

| نوع | enum | مناسب برای | منطق تصحیح |
|-----|------|-----------|----------|
| **چهارگزینه‌ای** | multiple-choice | حقایق و احکام واضح | تطابق با CorrectAnswerJson |
| **صحیح/غلط** | true-false | باورهای غلط رایج | boolean |
| **دسته‌بندی** | categorization | واجب/حرام/مستحب/مکروه/مباح | تطبیق آیتم‌ها با دسته‌ها |
| **ترتیب‌بندی** | ordering | مراحل وضو، نماز، حج | بررسی ترتیب صحیح |
| **تطبیق** | matching | تطبیق عمل با حکم | جفت‌های صحیح |
| **سناریو** | scenario | موقعیت‌های زندگی واقعی | پاسخ کلید + rubric |
| **شاخه‌ای** | branching | انتخاب → پیامد متفاوت | مسیر درخت تصمیم |
| **فتوا نویسی** | fatwa | تحلیل + استدلال | rubric (همتا + استاد) |
| **چند-مرجعی** | multi-marja | مقایسه فتوای مراجع | تطبیق با هر مرجع جداگانه |
| **عملی (تصویری)** | visual-practical | تشخیص درست/غلط در تصویر | تطبیق نقاط داغ تصویر |

### سرویس ارزشیابی — متدهای کلیدی

```csharp
public class FiqhAssessmentService : IFiqhAssessmentService
{
    private readonly AppDbContext _db;
    private readonly ILogger<FiqhAssessmentService> _logger;

    public FiqhAssessmentService(AppDbContext db, ILogger<FiqhAssessmentService> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <summary>
    /// انتخاب تطبیقی سوالات بر اساس مدل BKT
    /// سوالاتی که P(correct) نزدیک ۰.۵ است = بهترین برای یادگیری
    /// </summary>
    public async Task<List<FiqhQuestionDto>> GenerateQuizAsync(int quizId, int studentId)
    {
        var quiz = await _db.Set<FiqhQuiz>().FindAsync(quizId)
            ?? throw new KeyNotFoundException("Quiz not found");

        var allQuestions = await _db.Set<FiqhQuestion>()
            .Where(q => q.LessonId == quiz.LessonId || q.LessonId == null)
            .ToListAsync();

        var studentProgresses = await _db.Set<FiqhStudentProgress>()
            .Where(p => p.StudentId == studentId)
            .ToDictionaryAsync(p => p.LessonId);

        // BKT-based selection: prefer questions where student is ~50% likely to know
        var scored = allQuestions.Select(q =>
        {
            var pKnown = studentProgresses.GetValueOrDefault(q.LessonId ?? 0)?.PKnown ?? 0.0;
            // Ideal difficulty: P(correct) ≈ 0.7
            var idealScore = 1.0 - Math.Abs(0.7 - (pKnown * 0.6 + 0.2 * (1.0 - q.DifficultyRating / 5.0)));
            return (Question: q, Score: idealScore);
        })
        .OrderByDescending(x => x.Score)
        .Take(quiz.QuestionCount)
        .Select(x => new FiqhQuestionDto(
            x.Question.Id, x.Question.LessonId, x.Question.QuestionType,
            x.Question.QuestionText, x.Question.OptionsJson,
            x.Question.TopicTag, x.Question.DifficultyRating, x.Question.Points
        ))
        .ToList();

        return scored;
    }

    /// <summary>
    /// تصحیح آزمون و به‌روزرسانی BKT
    /// </summary>
    public async Task<QuizResultDto> SubmitQuizAsync(QuizSubmissionRequest request)
    {
        var details = new List<AnswerResultDto>();
        int score = 0, maxScore = 0;

        foreach (var answer in request.Answers)
        {
            var question = await _db.Set<FiqhQuestion>().FindAsync(answer.QuestionId);
            if (question == null) continue;

            maxScore += question.Points;
            bool isCorrect = NormalizeAnswer(answer.SelectedAnswerJson) == NormalizeAnswer(question.CorrectAnswerJson);

            if (isCorrect) score += question.Points;

            // ثبت تلاش
            _db.Set<FiqhAttempt>().Add(new FiqhAttempt
            {
                StudentId = request.StudentId,
                QuestionId = question.Id,
                QuizId = request.QuizId,
                SelectedAnswerJson = answer.SelectedAnswerJson,
                IsCorrect = isCorrect,
                AttemptNumber = await _db.Set<FiqhAttempt>()
                    .CountAsync(a => a.StudentId == request.StudentId && a.QuestionId == question.Id) + 1,
                TimeSpentSeconds = answer.TimeSpentSeconds,
                LearningPhase = "quiz",
                AttemptedAt = DateTime.UtcNow
            });

            // به‌روزرسانی BKT
            await UpdateBKTAsync(request.StudentId, question, isCorrect);

            details.Add(new AnswerResultDto(
                question.Id, isCorrect, question.CorrectAnswerJson,
                question.Explanation, question.MarjaTagsJson
            ));
        }

        await _db.SaveChangesAsync();

        // به‌روزرسانی Streak و امتیازات
        await UpdateGamificationAsync(request.StudentId, score, maxScore);

        double percentage = maxScore > 0 ? (double)score / maxScore * 100 : 0;
        var quizEntity = await _db.Set<FiqhQuiz>().FindAsync(request.QuizId);
        bool passed = percentage >= (quizEntity?.PassingScore ?? 70);

        return new QuizResultDto(
            request.QuizId, request.StudentId, score, maxScore,
            Math.Round(percentage, 1), passed, details
        );
    }

    /// <summary>
    /// به‌روزرسانی پارامترهای BKT بعد از هر تلاش
    /// </summary>
    private async Task UpdateBKTAsync(int studentId, FiqhQuestion question, bool isCorrect)
    {
        var progress = await _db.Set<FiqhStudentProgress>()
            .FirstOrDefaultAsync(p => p.StudentId == studentId && p.LessonId == (question.LessonId ?? 0));

        if (progress == null)
        {
            progress = new FiqhStudentProgress
            {
                StudentId = studentId,
                LessonId = question.LessonId ?? 0,
                Status = "in_progress",
                PKnown = 0.1,
                CreatedAt = DateTime.UtcNow
            };
            _db.Set<FiqhStudentProgress>().Add(progress);
        }

        progress.TotalAttempts++;
        if (isCorrect) progress.CorrectAttempts++;

        // BKT Update Formula (simplified):
        // P(L|evidence) = P(L) * (1-P_slip) / [P(L)*(1-P_slip) + (1-P(L))*P_guess]
        // where P_slip = 0.1, P_guess = 0.15 (default parameters)
        const double P_SLIP = 0.10;
        const double P_GUESS = 0.15;
        const double P_TRANSIT = 0.05; // probability of learning per attempt

        double pKnown = progress.PKnown;

        if (isCorrect)
        {
            // P(L | correct)
            pKnown = (pKnown * (1 - P_SLIP)) / (pKnown * (1 - P_SLIP) + (1 - pKnown) * P_GUESS);
            progress.ConsecutiveCorrect++;
        }
        else
        {
            // P(L | incorrect)
            pKnown = (pKnown * P_SLIP) / (pKnown * P_SLIP + (1 - pKnown) * (1 - P_GUESS));
            progress.ConsecutiveCorrect = 0;
        }

        // Add learning transition
        pKnown = pKnown + (1 - pKnown) * P_TRANSIT;

        progress.PKnown = Math.Round(Math.Max(0.0, Math.Min(1.0, pKnown)), 4);
        progress.LastPracticedAt = DateTime.UtcNow;
        progress.UpdatedAt = DateTime.UtcNow;

        // Check if mastered (P_known > 0.95)
        if (progress.PKnown > 0.95 && progress.ConsecutiveCorrect >= 3)
        {
            progress.Status = "completed";
        }
    }

    /// <summary>
    /// تولید Mastery Challenge (ترکیبی از چند مهارت)
    /// </summary>
    public async Task<MasteryChallengeDto> GenerateMasteryChallengeAsync(int studentId)
    {
        // 1. مهارت‌هایی که اخیراً تمرین نشده‌اند (decay)
        // 2. مهارت‌هایی که نزدیک به Mastering هستند (P_known 0.6-0.9)
        // 3. مهارت‌هایی که پیش‌نیاز مباحث بعدی هستند

        var progressList = await _db.Set<FiqhStudentProgress>()
            .Where(p => p.StudentId == studentId && p.PKnown > 0.3 && p.PKnown < 0.95)
            .OrderBy(p => p.LastPracticedAt) // oldest first (decay)
            .ThenByDescending(p => p.PKnown) // nearest to mastery
            .Take(3) // 3 skills
            .ToListAsync();

        var questions = new List<FiqhQuestion>();
        foreach (var prog in progressList)
        {
            var qs = await _db.Set<FiqhQuestion>()
                .Where(q => q.LessonId == prog.LessonId && q.QuestionType == "multiple-choice")
                .OrderBy(q => Guid.NewGuid()) // random
                .Take(2) // 2 questions per skill
                .ToListAsync();
            questions.AddRange(qs);
        }

        // Shuffle all questions
        questions = questions.OrderBy(q => Guid.NewGuid()).ToList();

        return new MasteryChallengeDto(
            questions.Select(q => new FiqhQuestionDto(
                q.Id, q.LessonId, q.QuestionType, q.QuestionText,
                q.OptionsJson, q.TopicTag, q.DifficultyRating, q.Points
            )).ToList()
        );
    }

    private string NormalizeAnswer(string json) =>
        System.Text.Json.JsonSerializer.Serialize(
            System.Text.Json.JsonSerializer.Deserialize<object>(json)
        ); // canonical JSON

    private async Task UpdateGamificationAsync(int studentId, int score, int maxScore)
    {
        var gam = await _db.Set<FiqhGamification>()
            .FirstOrDefaultAsync(g => g.StudentId == studentId);

        if (gam == null)
        {
            gam = new FiqhGamification { StudentId = studentId };
            _db.Set<FiqhGamification>().Add(gam);
        }

        // امتیاز: ۱۰ پایه + امتیاز اضافه بر اساس درصد
        double pct = maxScore > 0 ? (double)score / maxScore : 0;
        int pointsEarned = 10 + (int)(pct * 15);
        gam.TotalPoints += pointsEarned;

        if (pct >= 1.0) gam.PerfectQuizzes++;
        gam.QuizzesPassed += pct >= 0.7 ? 1 : 0;

        // بررسی Tier
        gam.Tier = gam.TotalPoints switch
        {
            >= 5000 => "diamond",
            >= 3000 => "platinum",
            >= 1500 => "gold",
            >= 500 => "silver",
            _ => "bronze"
        };

        // بررسی Streak
        var today = DateTime.UtcNow.Date;
        if (gam.LastActivityDate.Date == today.AddDays(-1))
            gam.CurrentStreak++;
        else if (gam.LastActivityDate.Date < today.AddDays(-1))
            gam.CurrentStreak = 1;

        if (gam.CurrentStreak > gam.LongestStreak)
            gam.LongestStreak = gam.CurrentStreak;

        gam.LastActivityDate = DateTime.UtcNow;
        gam.UpdatedAt = DateTime.UtcNow;

        // بررسی Badgeهای جدید
        await CheckBadgesAsync(gam);
    }

    private async Task CheckBadgesAsync(FiqhGamification gam)
    {
        var badges = string.IsNullOrEmpty(gam.EarnedBadges)
            ? new List<string>()
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(gam.EarnedBadges) ?? new();

        var newBadges = new List<string>();

        if (gam.CurrentStreak >= 7 && !badges.Contains("7_day_streak"))
            newBadges.Add("7_day_streak");
        if (gam.CurrentStreak >= 30 && !badges.Contains("30_day_streak"))
            newBadges.Add("30_day_streak");
        if (gam.LessonsCompleted >= 10 && !badges.Contains("ten_lessons"))
            newBadges.Add("ten_lessons");
        if (gam.PerfectQuizzes >= 1 && !badges.Contains("perfect_quiz"))
            newBadges.Add("perfect_quiz");
        if (gam.ScenariosSolved >= 5 && !badges.Contains("scenario_solver"))
            newBadges.Add("scenario_solver");
        if (gam.Tier == "gold" && !badges.Contains("gold_tier"))
            newBadges.Add("gold_tier");
        if (gam.Tier == "diamond" && !badges.Contains("diamond_tier"))
            newBadges.Add("diamond_tier");

        if (newBadges.Any())
        {
            badges.AddRange(newBadges);
            gam.EarnedBadges = System.Text.Json.JsonSerializer.Serialize(badges);
        }
    }
}
```

---

## ۹. سیستم ردیابی بیزی

### الگوریتم کامل BKT

```csharp
/// <summary>
/// موتور ردیابی دانش بیزی — محاسبه احتمال واقعی یادگیری
/// منابع: Carnegie Learning Cognitive Tutor + Khan Academy
/// </summary>
public class BKTEngine
{
    // چهار پارامتر اصلی
    public double PInit { get; set; }   // Prior: P(L₀) — احتمال اینکه از قبل بلد است
    public double PTransit { get; set; } // P(T) — احتمال یادگیری در هر تلاش
    public double PGuess { get; set; }  // P(G) — احتمال حدس درست
    public double PSlip { get; set; }   // P(S) — احتمال لغزش (بلد است ولی اشتباه می‌کند)

    public BKTEngine(double pInit = 0.15, double pTransit = 0.10,
                     double pGuess = 0.20, double pSlip = 0.10)
    {
        PInit = pInit;
        PTransit = pTransit;
        PGuess = pGuess;
        PSlip = pSlip;
    }

    /// <summary>
    /// به‌روزرسانی بعد از یک پاسخ
    /// </summary>
    public double Update(double pKnown, bool isCorrect)
    {
        // مرحله ۱: به‌روزرسانی با شواهد (Bayesian)
        double posterior;
        if (isCorrect)
        {
            // P(L | correct) = P(L) * (1-P(S)) / [P(L)*(1-P(S)) + (1-P(L))*P(G)]
            posterior = (pKnown * (1 - PSlip)) /
                       (pKnown * (1 - PSlip) + (1 - pKnown) * PGuess);
        }
        else
        {
            // P(L | incorrect) = P(L) * P(S) / [P(L)*P(S) + (1-P(L))*(1-P(G))]
            posterior = (pKnown * PSlip) /
                       (pKnown * PSlip + (1 - pKnown) * (1 - PGuess));
        }

        // مرحله ۲: اضافه کردن احتمال یادگیری در این تلاش
        double updated = posterior + (1 - posterior) * PTransit;

        return Math.Max(0.0, Math.Min(1.0, updated));
    }

    /// <summary>
    /// پیش‌بینی احتمال پاسخ صحیح
    /// </summary>
    public double PredictCorrect(double pKnown)
    {
        // P(correct) = P(L) * (1-P(S)) + (1-P(L)) * P(G)
        return pKnown * (1 - PSlip) + (1 - pKnown) * PGuess;
    }

    /// <summary>
    /// آیا مهارت کسب شده؟ (P_known > 0.95)
    /// </summary>
    public bool IsMastered(double pKnown) => pKnown >= 0.95;
}
```

### Half-Life Regression برای Spaced Repetition

```csharp
/// <summary>
/// محاسبه فاصله زمانی بهینه برای مرور بعدی
/// بر اساس FSRS (Free Spaced Repetition Scheduler)
/// </summary>
public class FiqhSpacedRepetition
{
    public DateTime GetNextReviewDate(FiqhStudentProgress progress)
    {
        if (progress.LastPracticedAt == null)
            return DateTime.UtcNow;

        double stability = CalculateStability(progress);
        double difficulty = GetDifficulty(progress);

        // Desired retention: 90%
        double desiredRetention = 0.9;
        double intervalDays = stability * (Math.Pow(desiredRetention, 1.0 / difficulty) - 1);

        return progress.LastPracticedAt.Value.AddDays(Math.Max(1, intervalDays));
    }

    private double CalculateStability(FiqhStudentProgress progress)
    {
        double s = 1.0; // initial stability = 1 day

        // در دنیای واقعی، از تاریخچه کامل تلاش‌ها استفاده می‌کنیم
        // اینجا نسخه ساده‌شده:
        if (progress.PKnown > 0.8)
            s = 30; // mastered items: monthly review
        else if (progress.PKnown > 0.6)
            s = 7; // familiar: weekly review
        else if (progress.PKnown > 0.3)
            s = 3; // struggling: every 3 days
        else
            s = 1; // new: daily

        return s;
    }

    private double GetDifficulty(FiqhStudentProgress progress)
    {
        // Higher difficulty = slower forgetting
        // Based on ConsecutiveCorrect ratio
        double ratio = progress.TotalAttempts > 0
            ? (double)progress.CorrectAttempts / progress.TotalAttempts
            : 0.5;
        return 1.0 + ratio * 4.0; // 1.0 (hard) to 5.0 (easy)
    }
}
```

---

## ۱۰. سیستم گیمیفیکیشن

### ۵ سطح Tier

| سطح | عنوان | عنوان انگلیسی | امتیاز مورد نیاز | شرط اضافه |
|:---:|:-----:|:------------:|:----------------:|:---------:|
| ۱ | **مبتدی** | Bronze | ۰ - ۴۹۹ | شروع دوره |
| ۲ | **آشنا** | Silver | ۵۰۰ - ۱,۴۹۹ | اتمام ۱ کتاب |
| ۳ | **مسلط** | Gold | ۱,۵۰۰ - ۲,۹۹۹ | اتمام ۳ کتاب + Streak ۷ روزه |
| ۴ | **متقن** | Platinum | ۳,۰۰۰ - ۴,۹۹۹ | اتمام ۱ دوره + Streak ۳۰ روزه |
| ۵ | **فقیه** | Diamond | ۵,۰۰۰+ | اتمام ۲ دوره + ۱۰ سناریو |

### سیستم امتیازدهی

| اقدام | امتیاز | حداکثر/روز |
|-------|:-----:|:----------:|
| تکمیل یک درس | +۱۰ | نامحدود |
| قبولی در quiz (۷۰٪+) | +۱۵ | ۱۰ بار |
| Quiz عالی (۱۰۰٪) | +۲۵ | ۵ بار |
| روز متوالی (Streak) | +۲۰ | ۱ بار |
| حل سناریوی فقهی | +۳۰ | ۵ بار |
| شرکت در مباحثه | +۲۰ | ۳ بار |
| توضیح مطلب به هم‌کلاسی | +۱۵ | ۳ بار |
| فتوا نویسی (تائید شده) | +۵۰ | ۲ بار |
| مرور درس‌های قدیمی (Spaced Rep) | +۵ | ۱۰ بار |

### نشان‌های ویژه (Badges)

| نشان | عنوان فارسی | شرط |
|:----:|:----------:|:----:|
| 🏆 | **پیشتاز** | اولین نفری باش که یک کتاب را تمام می‌کند |
| 💧 | **وضوگیر طلایی** | آزمون عملی وضو را ۱۰۰٪ بزن |
| 🕌 | **نمازخوان** | همه احکام نماز را Mastered کن |
| 🌙 | **ماه خدا** | احکام روزه را کامل بلد باش |
| 🤝 | **محرم‌شناس** | احکام محرم و نامحرم را ۱۰۰٪ بزن |
| 💰 | **متخصص خمس** | مسائل خمس را در سناریوهای مختلف حل کن |
| 📜 | **فقیه کوچک** | یک سناریوی فقهی را با استدلال کامل تحلیل کن |
| 🔥 | **مداوم** | Streak ۷ روزه |
| 🔥🔥 | **استقامت** | Streak ۳۰ روزه |
| 💎 | **جامع‌الشرایع** | کل ۵۲ باب را کامل کن (نادرترین) |
| ⚖️ | **مقارن** | ۱۰ مسئله را با ۳ مرجع مختلف مقایسه کن |
| 🧠 | **محقق** | ۵ فتوا با استدلال کامل بنویس |

---

## ۱۱. مدل ۳ حلقه‌ای یادگیری

برگرفته از SeekersGuidance — یک محتوا در ۳ عمق مختلف:

```
حلقه بیرونی (Outer — عمومی)
━━━━━━━━━━━━━━━━━━━━━━━━━
مناسب: دانش‌آموز عادی که می‌خواهد احکام را یاد بگیرد
فعالیت: تماشای ویدئو + خواندن متن + MCQ
ارزیابی: auto-graded
حمایت: تالار گفتگو

حلقه میانی (Middle — فعال)
━━━━━━━━━━━━━━━━━━━━━━━━━
شرط: اتمام حلقه بیرونی
فعالیت: سناریوهای فقهی + تحلیل موردی
ارزیابی: auto + همتا
حمایت: گروه مطالعاتی

حلقه درونی (Inner — عمیق)
━━━━━━━━━━━━━━━━━━━━━━━━━
شرط: اتمام حلقه میانی
فعالیت: فتوا نویسی + مباحثه + تحقیق
ارزیابی: استاد + oral
حمایت: منتور مستقیم
```

### پیاده‌سازی تعیین حلقه

```csharp
// تعیین حلقه دانش‌آموز بر اساس P_known و تعدادlessonهای تکمیل شده
public string DetermineStudentRing(int studentId)
{
    var progress = _db.Set<FiqhStudentProgress>()
        .Where(p => p.StudentId == studentId);

    int completed = progress.Count(p => p.Status == "completed");
    double avgPKnown = progress.Average(p => (double?)p.PKnown) ?? 0;

    if (avgPKnown > 0.8 && completed >= 20) return "inner";
    if (avgPKnown > 0.5 && completed >= 5) return "middle";
    return "outer";
}
```

---

## ۱۲. کنترلر API

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("api/fiqh")]
    [Authorize]
    public class FiqhController : ControllerBase
    {
        private readonly IFiqhService _service;
        private readonly IFiqhAssessmentService _assessment;
        private readonly ILogger<FiqhController> _logger;

        public FiqhController(
            IFiqhService service,
            IFiqhAssessmentService assessment,
            ILogger<FiqhController> logger)
        {
            _service = service;
            _assessment = assessment;
            _logger = logger;
        }

        // ========== کورس‌ها ==========
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
            => Ok(await _service.GetCoursesAsync());

        [HttpGet("courses/{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var result = await _service.GetCourseByIdAsync(id);
            if (result == null) return NotFound(new { message = "دوره یافت نشد." });
            return Ok(result);
        }

        // ========== کتاب‌ها ==========
        [HttpGet("books")]
        public async Task<IActionResult> GetBooks(
            [FromQuery] int? courseId,
            [FromQuery] string? section,
            [FromQuery] int? age)
        {
            if (age.HasValue) return Ok(await _service.GetBooksByAgeAsync(age.Value));
            if (!string.IsNullOrEmpty(section)) return Ok(await _service.GetBooksBySectionAsync(section));
            return Ok(await _service.GetBooksAsync(courseId));
        }

        [HttpGet("books/search")]
        public async Task<IActionResult> SearchBooks([FromQuery] string q)
            => Ok(await _service.SearchBooksAsync(q));

        // ========== فصل‌ها ==========
        [HttpGet("books/{bookId}/chapters")]
        public async Task<IActionResult> GetChapters(int bookId)
            => Ok(await _service.GetChaptersAsync(bookId));

        // ========== درس‌ها ==========
        [HttpGet("chapters/{chapterId}/lessons")]
        public async Task<IActionResult> GetLessons(int chapterId)
            => Ok(await _service.GetLessonsAsync(chapterId));

        [HttpGet("lessons/{id}")]
        public async Task<IActionResult> GetLessonById(int id)
        {
            var result = await _service.GetLessonByIdAsync(id);
            if (result == null) return NotFound(new { message = "درس یافت نشد." });
            return Ok(result);
        }

        [HttpGet("lessons/recommended")]
        public async Task<IActionResult> GetRecommendedLessons(
            [FromQuery] int studentId,
            [FromQuery] int count = 5)
            => Ok(await _service.GetRecommendedLessonsAsync(studentId, count));

        // ========== ارزشیابی ==========
        [HttpGet("lessons/{lessonId}/questions")]
        public async Task<IActionResult> GetQuestions(
            int lessonId,
            [FromQuery] int count = 10)
            => Ok(await _assessment.GetQuestionsForLessonAsync(lessonId, count));

        [HttpPost("quizzes/generate")]
        public async Task<IActionResult> GenerateQuiz(
            [FromBody] GenerateQuizRequest request)
            => Ok(await _assessment.GenerateQuizAsync(request.QuizId, request.StudentId));

        [HttpPost("quizzes/submit")]
        public async Task<IActionResult> SubmitQuiz(
            [FromBody] QuizSubmissionRequest request)
            => Ok(await _assessment.SubmitQuizAsync(request));

        // ========== Mastery Challenge ==========
        [HttpGet("mastery-challenge/{studentId}")]
        public async Task<IActionResult> GetMasteryChallenge(int studentId)
            => Ok(await _assessment.GenerateMasteryChallengeAsync(studentId));

        [HttpPost("mastery-challenge/submit")]
        public async Task<IActionResult> SubmitMasteryChallenge(
            [FromBody] QuizSubmissionRequest request)
            => Ok(await _assessment.SubmitMasteryChallengeAsync(request.StudentId, request));

        // ========== سناریو ==========
        [HttpGet("scenarios/{lessonId}")]
        public async Task<IActionResult> GetScenarios(int lessonId)
            => Ok(await _assessment.GetScenariosForLessonAsync(lessonId));

        [HttpPost("fatwa/submit")]
        public async Task<IActionResult> SubmitFatwa(
            [FromBody] FatwaSubmissionRequest request)
            => Ok(await _assessment.SubmitFatwaAsync(request));

        [HttpPut("fatwa/{id}/review")]
        [Authorize(Roles = "admin,coach")]
        public async Task<IActionResult> ReviewFatwa(
            int id,
            [FromBody] FatwaReviewRequest request)
            => Ok(await _assessment.ReviewFatwaAsync(id, request));

        // ========== پیشرفت ==========
        [HttpGet("progress/{studentId}")]
        public async Task<IActionResult> GetProgress(int studentId)
            => Ok(await _service.GetStudentProgressAsync(studentId));

        [HttpGet("mastery/{studentId}")]
        public async Task<IActionResult> GetMastery(int studentId)
            => Ok(await _service.GetStudentMasteryAsync(studentId));

        // ========== مراجع ==========
        [HttpGet("marjas")]
        public async Task<IActionResult> GetMarjas()
            => Ok(await _service.GetMarjasAsync());

        // ========== گیمیفیکیشن ==========
        [HttpGet("gamification/{studentId}/tier")]
        public async Task<IActionResult> GetTier(int studentId)
            => Ok(await _service.GetStudentTierAsync(studentId));

        [HttpGet("gamification/{studentId}/badges")]
        public async Task<IActionResult> GetBadges(int studentId)
            => Ok(await _service.GetEarnedBadgesAsync(studentId));

        // ========== CRUD ==========
        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourse([FromBody] CreateFiqhCourseRequest r)
            => Ok(await _service.CreateCourseAsync(r));

        [HttpPost("books")]
        public async Task<IActionResult> CreateBook(
            [FromQuery] int courseId,
            [FromBody] CreateFiqhBookRequest r)
            => Ok(await _service.CreateBookAsync(courseId, r));

        [HttpPost("chapters")]
        public async Task<IActionResult> CreateChapter(
            [FromQuery] int bookId,
            [FromBody] CreateFiqhChapterRequest r)
            => Ok(await _service.CreateChapterAsync(bookId, r));

        [HttpPost("lessons")]
        public async Task<IActionResult> CreateLesson(
            [FromQuery] int chapterId,
            [FromBody] CreateFiqhLessonRequest r)
            => Ok(await _service.CreateLessonAsync(chapterId, r));

        [HttpPut("courses/{id}")]
        public async Task<IActionResult> UpdateCourse(
            int id, [FromBody] UpdateFiqhCourseRequest r)
            => Ok(await _service.UpdateCourseAsync(id, r));

        [HttpDelete("courses/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            await _service.DeleteCourseAsync(id);
            return NoContent();
        }

        [HttpDelete("lessons/{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            await _service.DeleteLessonAsync(id);
            return NoContent();
        }
    }
}
```

---

## ۱۳. ثبت در DI و DbContext

### Program.cs

```csharp
// ========== ماژول فقه ==========
builder.Services.AddScoped<IFiqhService, FiqhService>();
builder.Services.AddScoped<IFiqhAssessmentService, FiqhAssessmentService>();
services.AddScoped<FiqhDataSeeder>();

// ... (در بخش Seeder):
var fiqhSeeder = scope.ServiceProvider.GetRequiredService<FiqhDataSeeder>();
await fiqhSeeder.SeedAsync();
```

### AppDbContext.cs

```csharp
// ========== ماژول فقه ==========
public DbSet<FiqhCourse> FiqhCourses => Set<FiqhCourse>();
public DbSet<FiqhBook> FiqhBooks => Set<FiqhBook>();
public DbSet<FiqhChapter> FiqhChapters => Set<FiqhChapter>();
public DbSet<FiqhLesson> FiqhLessons => Set<FiqhLesson>();
public DbSet<FiqhContent> FiqhContents => Set<FiqhContent>();
public DbSet<FiqhScenario> FiqhScenarios => Set<FiqhScenario>();
public DbSet<FiqhQuestion> FiqhQuestions => Set<FiqhQuestion>();
public DbSet<FiqhQuiz> FiqhQuizzes => Set<FiqhQuiz>();
public DbSet<FiqhAttempt> FiqhAttempts => Set<FiqhAttempt>();
public DbSet<FiqhFatwaResponse> FiqhFatwaResponses => Set<FiqhFatwaResponse>();
public DbSet<FiqhStudentProgress> FiqhStudentProgressList => Set<FiqhStudentProgress>();
public DbSet<FiqhMasteryRecord> FiqhMasteryRecords => Set<FiqhMasteryRecord>();
public DbSet<FiqhMarja> FiqhMarjas => Set<FiqhMarja>();
public DbSet<FiqhHukm> FiqhHukms => Set<FiqhHukm>();
public DbSet<FiqhEvidence> FiqhEvidences => Set<FiqhEvidence>();
public DbSet<FiqhGamification> FiqhGamificationRecords => Set<FiqhGamification>();
```

---

## ۱۴. ماژول Angular

### مسیرها (fiqh.routes.ts)

```typescript
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const FIQH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/course-list/course-list.component')
          .then(m => m.CourseListComponent),
        title: 'دوره‌های فقه'
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./pages/course-detail/course-detail.component')
          .then(m => m.CourseDetailComponent),
        title: 'جزئیات دوره'
      },
      {
        path: 'books/:bookId',
        loadComponent: () => import('./pages/book-detail/book-detail.component')
          .then(m => m.BookDetailComponent),
        title: 'کتاب فقهی'
      },
      {
        path: 'lessons/:id',
        loadComponent: () => import('./pages/lesson-detail/lesson-detail.component')
          .then(m => m.LessonDetailComponent),
        title: 'درس'
      },
      {
        path: 'scenarios/:lessonId',
        loadComponent: () => import('./pages/scenario-simulator/scenario-simulator.component')
          .then(m => m.ScenarioSimulatorComponent),
        title: 'سناریوی فقهی'
      },
      {
        path: 'fatwa-workshop/:scenarioId',
        loadComponent: () => import('./pages/fatwa-workshop/fatwa-workshop.component')
          .then(m => m.FatwaWorkshopComponent),
        title: 'کارگاه فتوا'
      },
      {
        path: 'quiz/:id',
        loadComponent: () => import('./pages/quiz/quiz.component')
          .then(m => m.QuizComponent),
        title: 'آزمون'
      },
      {
        path: 'mastery-challenge',
        loadComponent: () => import('./pages/mastery-challenge/mastery-challenge.component')
          .then(m => m.MasteryChallengeComponent),
        title: 'آزمون ترکیبی'
      },
      {
        path: 'progress',
        loadComponent: () => import('./pages/progress/progress.component')
          .then(m => m.ProgressComponent),
        title: 'پیشرفت من',
        canActivate: [roleGuard('student')]
      },
      {
        path: 'progress/:studentId',
        loadComponent: () => import('./pages/progress/progress.component')
          .then(m => m.ProgressComponent),
        title: 'پیشرفت دانش‌آموز',
        canActivate: [roleGuard('admin', 'coach')]
      },
      {
        path: 'marjas',
        loadComponent: () => import('./pages/marja-reference/marja-reference.component')
          .then(m => m.MarjaReferenceComponent),
        title: 'مراجع تقلید'
      },
      {
        path: '',
        redirectTo: '/fiqh',
        pathMatch: 'full'
      }
    ]
  }
];
```

### سرویس Angular (fiqh.service.ts)

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LESSON_PLANNER_API } from '../../core/services/lesson-planner-api.token';
import { LessonPlannerApi } from '../../core/services/lesson-planner-api.interface';
import type {
  // Types imported from lesson-planner.models.ts
} from '../../core/models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class FiqhService {
  private readonly api = inject(LESSON_PLANNER_API);

  // ========== کورس‌ها ==========
  getCourses(): Observable<any[]> {
    return this.api.getFiqhCourses();
  }

  getCourseById(id: number): Observable<any> {
    return this.api.getFiqhCourseById(id);
  }

  // ========== کتاب‌ها ==========
  getBooks(courseId?: number, section?: string, age?: number): Observable<any[]> {
    return this.api.getFiqhBooks(courseId, section, age);
  }

  searchBooks(query: string): Observable<any[]> {
    return this.api.searchFiqhBooks(query);
  }

  // ========== درس‌ها ==========
  getLessons(chapterId: number): Observable<any[]> {
    return this.api.getFiqhLessons(chapterId);
  }

  getLessonById(id: number): Observable<any> {
    return this.api.getFiqhLessonById(id);
  }

  getRecommendedLessons(studentId: number, count?: number): Observable<any[]> {
    return this.api.getRecommendedFiqhLessons(studentId, count);
  }

  // ========== آزمون ==========
  getQuestions(lessonId: number, count?: number): Observable<any[]> {
    return this.api.getFiqhQuestions(lessonId, count);
  }

  generateQuiz(quizId: number, studentId: number): Observable<any> {
    return this.api.generateFiqhQuiz(quizId, studentId);
  }

  submitQuiz(data: any): Observable<any> {
    return this.api.submitFiqhQuiz(data);
  }

  // ========== Mastery Challenge ==========
  getMasteryChallenge(studentId: number): Observable<any> {
    return this.api.getFiqhMasteryChallenge(studentId);
  }

  // ========== سناریو و فتوا ==========
  getScenarios(lessonId: number): Observable<any[]> {
    return this.api.getFiqhScenarios(lessonId);
  }

  submitFatwa(data: any): Observable<any> {
    return this.api.submitFiqhFatwa(data);
  }

  // ========== پیشرفت ==========
  getProgress(studentId: number): Observable<any> {
    return this.api.getFiqhProgress(studentId);
  }

  getMastery(studentId: number): Observable<any[]> {
    return this.api.getFiqhMastery(studentId);
  }

  // ========== مراجع ==========
  getMarjas(): Observable<any[]> {
    return this.api.getFiqhMarjas();
  }

  // ========== گیمیفیکیشن ==========
  getTier(studentId: number): Observable<string> {
    return this.api.getFiqhTier(studentId);
  }

  getBadges(studentId: number): Observable<string[]> {
    return this.api.getFiqhBadges(studentId);
  }
}
```

### کامپوننت‌های پیشنهادی

| کامپوننت | مسیر | شرح |
|---------|:-----|:-----|
| `CourseListComponent` | `/fiqh` | لیست دوره‌ها با فیلتر سنی |
| `CourseDetailComponent` | `/fiqh/courses/:id` | جزئیات دوره + کتاب‌ها |
| `BookDetailComponent` | `/fiqh/books/:bookId` | کتاب با فصل‌ها و درس‌ها |
| `LessonDetailComponent` | `/fiqh/lessons/:id` | محتوای درس + سوالات + سناریو |
| `ScenarioSimulatorComponent` | `/fiqh/scenarios/:lessonId` | سناریو تعاملی با شاخه‌های تصمیم |
| `FatwaWorkshopComponent` | `/fiqh/fatwa-workshop/:scenarioId` | فتوا نویسی با ادله + rubric |
| `QuizComponent` | `/fiqh/quiz/:id` | آزمون با ۱۰ نوع سؤال |
| `MasteryChallengeComponent` | `/fiqh/mastery-challenge` | آزمون ترکیبی ۶ سؤالی |
| `ProgressComponent` | `/fiqh/progress` | داشبورد پیشرفت + Tier + Badges |
| `MarjaReferenceComponent` | `/fiqh/marjas` | معرفی مراجع + تطبیق فتوا |

---

## ۱۵. API Interface + Mock

### اضافه کردن به lesson-planner-api.interface.ts

```typescript
// ========== ماژول فقه ==========

abstract getFiqhCourses(): Observable<FiqhCourseDto[]>;
abstract getFiqhCourseById(id: number): Observable<FiqhCourseDetailDto>;

abstract getFiqhBooks(
  courseId?: number,
  section?: string,
  age?: number
): Observable<FiqhBookDto[]>;
abstract searchFiqhBooks(query: string): Observable<FiqhBookDto[]>;

abstract getFiqhChapters(bookId: number): Observable<FiqhChapterDto[]>;

abstract getFiqhLessons(chapterId: number): Observable<FiqhLessonDto[]>;
abstract getFiqhLessonById(id: number): Observable<FiqhLessonDetailDto>;
abstract getRecommendedFiqhLessons(
  studentId: number,
  count?: number
): Observable<FiqhLessonDto[]>;

abstract getFiqhQuestions(
  lessonId: number,
  count?: number
): Observable<FiqhQuestionDto[]>;

abstract generateFiqhQuiz(
  quizId: number,
  studentId: number
): Observable<FiqhQuestionDto[]>;

abstract submitFiqhQuiz(data: QuizSubmissionRequest): Observable<QuizResultDto>;

abstract getFiqhMasteryChallenge(
  studentId: number
): Observable<FiqhQuestionDto[]>;

abstract getFiqhScenarios(lessonId: number): Observable<FiqhScenarioDto[]>;
abstract submitFiqhFatwa(data: FatwaSubmissionRequest): Observable<any>;

abstract getFiqhProgress(studentId: number): Observable<ProgressSummaryDto>;
abstract getFiqhMastery(studentId: number): Observable<MasteryDto[]>;

abstract getFiqhMarjas(): Observable<MarjaDto[]>;
abstract getFiqhTier(studentId: number): Observable<string>;
abstract getFiqhBadges(studentId: number): Observable<string[]>;
```

### TypeScript Models (اضافه کردن به lesson-planner.models.ts)

```typescript
// ==================== ماژول فقه ====================

export interface FiqhCourseDto {
  id: number;
  title: string;
  titleFa: string;
  level: string;
  sortOrder: number;
  createdAt: string;
}

export interface FiqhCourseDetailDto extends FiqhCourseDto {
  description: string;
  books: FiqhBookDto[];
}

export interface FiqhBookDto {
  id: number;
  code: string;
  title: string;
  titleFa: string;
  sectionType: string;
  difficultyLevel: string;
  minAge: number;
  sortOrder: number;
}

export interface FiqhChapterDto {
  id: number;
  bookId: number;
  title: string;
  titleFa: string;
  sortOrder: number;
}

export interface FiqhLessonDto {
  id: number;
  chapterId: number;
  title: string;
  titleFa: string;
  contentType: string;
  estimatedMinutes: number;
  sortOrder: number;
  progressPercent: number;
}

export interface FiqhLessonDetailDto extends FiqhLessonDto {
  summary: string;
  contents: FiqhContentDto[];
  scenarios: FiqhScenarioDto[];
  evidences: FiqhEvidenceDto[];
}

export interface FiqhContentDto {
  id: number;
  contentType: string;
  title: string;
  bodyText: string;
  videoUrl: string;
  contentJson: string;
  sortOrder: number;
}

export interface FiqhScenarioDto {
  id: number;
  scenarioType: string;
  scenarioText: string;
  difficultyRating: number;
}

export interface FiqhEvidenceDto {
  id: number;
  evidenceType: string;
  sourceReference: string;
  originalText: string;
  translationFa: string;
}

export interface FiqhQuestionDto {
  id: number;
  lessonId?: number;
  questionType: string;
  questionText: string;
  optionsJson: string;
  topicTag: string;
  difficultyRating: number;
  points: number;
}

export interface QuizSubmissionRequest {
  quizId: number;
  studentId: number;
  answers: AnswerItem[];
}

export interface AnswerItem {
  questionId: number;
  selectedAnswerJson: string;
  timeSpentSeconds: number;
}

export interface QuizResultDto {
  quizId: number;
  studentId: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  details: AnswerResultDto[];
}

export interface AnswerResultDto {
  questionId: number;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  marjaRef: string;
}

export interface ProgressSummaryDto {
  studentId: number;
  totalLessons: number;
  completedLessons: number;
  overallPercent: number;
  currentStreak: number;
  tier: string;
  totalPoints: number;
  earnedBadges: string[];
  averagePKnown: number;
}

export interface MasteryDto {
  skillId: string;
  skillName: string;
  level: string;
  proficiencyScore: number;
  lastPracticed: string;
}

export interface MarjaDto {
  id: number;
  fullName: string;
  fullNameFa: string;
  shortCode: string;
  description: string;
  photoUrl: string;
  sortOrder: number;
}

export interface FatwaSubmissionRequest {
  scenarioId: number;
  studentId: number;
  responseText: string;
  evidenceJson: string;
}
```

---

## ۱۶. Seeder

```csharp
public class FiqhDataSeeder
{
    private readonly AppDbContext _db;
    private const int BATCH_SIZE = 200;

    public FiqhDataSeeder(AppDbContext db) => _db = db;

    public async Task SeedAsync()
    {
        if (await _db.Set<FiqhCourse>().AnyAsync())
            return; // داده از قبل وجود دارد

        // مرحله ۱: مراجع تقلید
        var marjas = GetMarjas();
        _db.Set<FiqhMarja>().AddRange(marjas);
        await _db.SaveChangesAsync();

        // مرحله ۲: انواع حکم
        var ahkam = GetAhkamTypes();
        _db.Set<FiqhHukm>().AddRange(ahkam);
        await _db.SaveChangesAsync();

        // مرحله ۳: کورس‌ها
        var courses = new List<FiqhCourse>
        {
            new() { Title = "Fiqh al-Ibadat", TitleFa = "فقه العبادات", Level = "beginner", SortOrder = 1, Description = "احکام عبادی: طهارت، نماز، روزه، خمس، زکات، حج" },
            new() { Title = "Fiqh al-Muamalat", TitleFa = "فقه المعاملات", Level = "intermediate", SortOrder = 2, Description = "احکام معاملات: تجارت، اجاره، شرکت، مضاربه، نکاح، طلاق" },
            new() { Title = "Fiqh al-Ahkam", TitleFa = "فقه الاحکام", Level = "advanced", SortOrder = 3, Description = "احکام متفرقه: ارث، قضاء، حدود، قصاص، دیات" },
            new() { Title = "Usul al-Fiqh", TitleFa = "اصول فقه", Level = "hawzah", SortOrder = 4, Description = "مبانی استنباط احکام: کتاب، سنت، اجماع، عقل" },
        };
        _db.Set<FiqhCourse>().AddRange(courses);
        await _db.SaveChangesAsync();
        _db.ChangeTracker.Clear();

        // مرحله ۴: کتاب‌ها — نمونه کامل از کتاب طهارت
        var taharaBook = new FiqhBook
        {
            CourseId = courses[0].Id,
            Code = "IB-01",
            Title = "Kitab al-Tahara",
            TitleFa = "کتاب طهارت",
            SectionType = "ibadat",
            DifficultyLevel = "beginner",
            MinAge = 7,
            SortOrder = 1
        };
        _db.Set<FiqhBook>().Add(taharaBook);
        await _db.SaveChangesAsync();

        // مرحله ۵: فصل‌های کتاب طهارت
        var taharaChapters = new List<FiqhChapter>
        {
            new() { BookId = taharaBook.Id, TitleFa = "انواع آب", SortOrder = 1, Description = "آب مطلق و مضاف، آب کر و قلیل، آب جاری و باران" },
            new() { BookId = taharaBook.Id, TitleFa = "احکام تخلی", SortOrder = 2, Description = "آداب و احکام دستشویی" },
            new() { BookId = taharaBook.Id, TitleFa = "نجاسات", SortOrder = 3, Description = "۱۱ نجاست: ادرار، مدفوع، منی، خون، سگ، خوک، کافر، ..." },
            new() { BookId = taharaBook.Id, TitleFa = "مطهرات", SortOrder = 4, Description = "۱۲ پاک‌کننده: آب، زمین، آفتاب، استحاله، انتقال، اسلام، ..." },
            new() { BookId = taharaBook.Id, TitleFa = "وضو", SortOrder = 5, Description = "شرایط، واجبات، مستحبات، مبطلات وضو" },
            new() { BookId = taharaBook.Id, TitleFa = "غسل", SortOrder = 6, Description = "غسل‌های واجب: جنابت، حیض، استحاضه، نفاس، مس میت، اموات" },
            new() { BookId = taharaBook.Id, TitleFa = "تیمم", SortOrder = 7, Description = "موارد جواز، شرایط، کیفیت تیمم" },
        };
        _db.Set<FiqhChapter>().AddRange(taharaChapters);
        await _db.SaveChangesAsync();

        // مرحله ۶: درس‌های باب وضو (نمونه)
        var wuduLessons = new List<FiqhLesson>
        {
            new() { ChapterId = taharaChapters[4].Id, TitleFa = "شرایط وضو", Summary = "آب مطلق و مباح بودن، طهارت اعضا، عدم مانع، ترتیب", ContentType = "text", EstimatedMinutes = 10, SortOrder = 1 },
            new() { ChapterId = taharaChapters[4].Id, TitleFa = "واجبات وضو", Summary = "شستن صورت و دست‌ها، مسح سر و پاها", ContentType = "video", EstimatedMinutes = 8, SortOrder = 2 },
            new() { ChapterId = taharaChapters[4].Id, TitleFa = "مبطلات وضو", Summary = "۱۰ مورد: خروج بول و مدفوع، خواب، جنون، حیض، ...", ContentType = "text", EstimatedMinutes = 12, SortOrder = 3 },
            new() { ChapterId = taharaChapters[4].Id, TitleFa = "شک در وضو", Summary = "قواعد شک در وضو و نماز", ContentType = "scenario", EstimatedMinutes = 15, SortOrder = 4 },
        };
        _db.Set<FiqhLesson>().AddRange(wuduLessons);
        await _db.SaveChangesAsync();

        // مرحله ۷: سوالات نمونه
        var wuduQuestions = new List<FiqhQuestion>
        {
            new()
            {
                LessonId = wuduLessons[0].Id,
                QuestionType = "multiple-choice",
                QuestionText = "کدام یک از آب‌های زیر برای وضو مناسب نیست؟",
                OptionsJson = "[{\"text\":\"آب لوله کشی\",\"isCorrect\":false},{\"text\":\"آب باران\",\"isCorrect\":false},{\"text\":\"آب گلاب\",\"isCorrect\":true},{\"text\":\"آب چاه\",\"isCorrect\":false}]",
                CorrectAnswerJson = "\"آب گلاب\"",
                Explanation = "آب مضاف (گلاب) برای وضو مناسب نیست. آب وضو باید مطلق باشد.",
                Points = 1,
                DifficultyRating = 1,
                TopicTag = "tahara.wudu.water",
            },
            new()
            {
                LessonId = wuduLessons[2].Id,
                QuestionType = "true-false",
                QuestionText = "خوابیدن وضو را باطل می‌کند.",
                OptionsJson = "[{\"text\":\"صحیح\",\"isCorrect\":true},{\"text\":\"غلط\",\"isCorrect\":false}]",
                CorrectAnswerJson = "\"صحیح\"",
                Explanation = "خوابی که عقل را زایل کند (هر چند کوتاه) وضو را باطل می‌کند.",
                Points = 1,
                DifficultyRating = 1,
                TopicTag = "tahara.wudu.nullifiers",
            },
            new()
            {
                LessonId = wuduLessons[0].Id,
                QuestionType = "categorization",
                QuestionText = "موارد زیر را دسته‌بندی کنید: واجبات وضو کدامند؟",
                OptionsJson = "{\"categories\":[\"واجب\",\"مستحب\"],\"items\":[{\"text\":\"شستن صورت\",\"category\":\"واجب\"},{\"text\":\"شستن دست‌ها\",\"category\":\"واجب\"},{\"text\":\"مسح سر\",\"category\":\"واجب\"},{\"text\":\"مسح پاها\",\"category\":\"واجب\"},{\"text\":\"شستن سه بار\",\"category\":\"مستحب\"},{\"text\":\"مضمضه\",\"category\":\"مستحب\"}]}",
                CorrectAnswerJson = "\"done\"",
                Explanation = "واجبات وضو: شستن صورت و دست‌ها از آرنج، مسح سر و مسح پاها",
                Points = 2,
                DifficultyRating = 1,
                TopicTag = "tahara.wudu.obligations",
            },
            new()
            {
                LessonId = wuduLessons[3].Id,
                QuestionType = "scenario",
                QuestionText = "سناریو: علی بعد از نماز صبح شک می‌کند که وضویش گرفته بوده یا نه. وظیفه او چیست؟",
                OptionsJson = "[{\"text\":\"دوباره وضو بگیرد و نماز را قضا کند\",\"isCorrect\":false},{\"text\":\"اعضا را بررسی کند، اگر شک دارد وضو بگیرد\",\"isCorrect\":false},{\"text\":\"نمازش صحیح است، به شک اعتنا نکند\",\"isCorrect\":true},{\"text\":\"نماز را دوباره بخواند\",\"isCorrect\":false}]",
                CorrectAnswerJson = "\"نمازش صحیح است، به شک اعتنا نکند\"",
                Explanation = "قاعده فراغ: اگر بعد از نماز شک کند وضو داشته یا نه، به شک اعتنا نمی‌کند و نمازش صحیح است.",
                Points = 2,
                DifficultyRating = 2,
                TopicTag = "tahara.wudu.doubt",
            },
        };
        _db.Set<FiqhQuestion>().AddRange(wuduQuestions);
        await _db.SaveChangesAsync();

        // مرحله ۸: شش کتاب دیگر نمونه (بقیه کتاب‌های عبادات)
        var remainingBooks = new List<FiqhBook>
        {
            new() { CourseId = courses[0].Id, Code = "IB-02", TitleFa = "کتاب صلاة", SectionType = "ibadat", DifficultyLevel = "beginner", MinAge = 7, SortOrder = 2 },
            new() { CourseId = courses[0].Id, Code = "IB-03", TitleFa = "کتاب زکات", SectionType = "ibadat", DifficultyLevel = "intermediate", MinAge = 13, SortOrder = 3 },
            new() { CourseId = courses[0].Id, Code = "IB-04", TitleFa = "کتاب خمس", SectionType = "ibadat", DifficultyLevel = "beginner", MinAge = 10, SortOrder = 4 },
            new() { CourseId = courses[0].Id, Code = "IB-05", TitleFa = "کتاب صوم", SectionType = "ibadat", DifficultyLevel = "beginner", MinAge = 10, SortOrder = 5 },
            new() { CourseId = courses[0].Id, Code = "IB-06", TitleFa = "کتاب اعتکاف", SectionType = "ibadat", DifficultyLevel = "intermediate", MinAge = 16, SortOrder = 6 },
            new() { CourseId = courses[0].Id, Code = "IB-07", TitleFa = "کتاب حج", SectionType = "ibadat", DifficultyLevel = "intermediate", MinAge = 13, SortOrder = 7 },
        };
        _db.Set<FiqhBook>().AddRange(remainingBooks);
        await _db.SaveChangesAsync();

        // مرحله ۹: سناریوی نمونه
        var sampleScenario = new FiqhScenario
        {
            LessonId = wuduLessons[3].Id,
            ScenarioType = "branching",
            ScenarioText = @"مسافری در هواپیماست. وقت نماز مغرب نزدیک است و اثری از آب نیست. راهنمای پرواز اعلام کرده که نماز در هواپیما اشکال ندارد. او: 
۱. آب ندارد 
۲. شک دارد که وضویش باقی است یا نه 
۳. در حال سفر است (قصد ۱۰ روز ندارد)

چه وظیفه‌ای دارد؟",
            Hints = "[\"به قاعده فراغ مراجعه کن\", \"شرایط تیمم را بررسی کن\", \"احکام نماز مسافر را به خاطر بیاور\"]",
            ExpectedAnswer = "{\"ruling\":\"تیمم کند و نماز را شکسته بخواند\",\"evidence\":\"قاعده فراغ + آیه تیمم + احادیث قصر\",\"marjaRef\":\"سیستانی: منهاج، ج۱، مسأله ۸۵۰\"}",
            RubricJson = "{\"correctRuling\":4,\"evidence\":3,\"marjaRef\":3}",
            DifficultyRating = 3,
            SortOrder = 1
        };
        _db.Set<FiqhScenario>().Add(sampleScenario);
        await _db.SaveChangesAsync();

        // مرحله ۱۰: شش کتاب دیگر عقود + ایقاعات + احکام (به صورت summary)
        // در پیاده‌سازی واقعی، بقیه کتاب‌ها و فصل‌ها و درس‌های ۵۲ باب کامل اضافه شود
        _logger.LogInformation("Fiqh seeder completed: {Courses} courses, {Books} books, {Chapters} chapters, {Lessons} lessons",
            courses.Count, remainingBooks.Count + 1, taharaChapters.Count, wuduLessons.Count);
    }

    private static List<FiqhMarja> GetMarjas() => new()
    {
        new() { FullName = "Ayatollah al-Udhma Sayyid Ali al-Sistani", FullNameFa = "آیت‌الله العظمی سیستانی", ShortCode = "sistani", SortOrder = 1 },
        new() { FullName = "Ayatollah al-Udhma Sayyid Ali Khamenei", FullNameFa = "آیت‌الله العظمی خامنه‌ای", ShortCode = "khamenei", SortOrder = 2 },
        new() { FullName = "Ayatollah al-Udhma Nasir Makarem Shirazi", FullNameFa = "آیت‌الله العظمی مکارم شیرازی", ShortCode = "makarem", SortOrder = 3 },
        new() { FullName = "Ayatollah al-Udhma Mousa Shubairi Zanjani", FullNameFa = "آیت‌الله العظمی شبیری زنجانی", ShortCode = "shubairi", SortOrder = 4 },
        new() { FullName = "Ayatollah al-Udhma Sayyid Muhammad Saeed al-Hakim", FullNameFa = "آیت‌الله العظمی سید محمد سعید حکیم", ShortCode = "hakim", SortOrder = 5 },
    };

    private static List<FiqhHukm> GetAhkamTypes() => new()
    {
        new() { Code = "wajib", TitleFa = "واجب", Description = "عملی که انجام آن الزامی است و ترک آن گناه دارد.", ColorHex = "#E53935" },
        new() { Code = "haram", TitleFa = "حرام", Description = "عملی که ترک آن الزامی است و انجام آن گناه دارد.", ColorHex = "#B71C1C" },
        new() { Code = "mustahab", TitleFa = "مستحب", Description = "عملی که انجام آن خوب است ولی واجب نیست.", ColorHex = "#43A047" },
        new() { Code = "makruh", TitleFa = "مکروه", Description = "عملی که ترک آن بهتر است ولی حرام نیست.", ColorHex = "#FB8C00" },
        new() { Code = "mubah", TitleFa = "مباح", Description = "عملی که انجام و ترک آن یکسان است.", ColorHex = "#757575" },
    };
}
```

---

## ۱۷. چک‌لیست نهایی پیاده‌سازی

### بک‌اند (Backend)

- [ ] **گام ۱:** Domain entities (۱۵ فایل در `Domain/Entities/Fiqh/`)
  - [ ] FiqhCourse.cs, FiqhBook.cs, FiqhChapter.cs, FiqhLesson.cs
  - [ ] FiqhContent.cs, FiqhScenario.cs
  - [ ] FiqhQuestion.cs, FiqhQuiz.cs, FiqhAttempt.cs, FiqhFatwaResponse.cs
  - [ ] FiqhStudentProgress.cs, FiqhMasteryRecord.cs
  - [ ] FiqhMarja.cs, FiqhHukm.cs, FiqhEvidence.cs
  - [ ] FiqhGamification.cs
- [ ] **گام ۲:** DTOs در `Application/DTOs/FiqhDtos.cs`
- [ ] **گام ۳:** Interface `IFiqhService.cs` + `IFiqhAssessmentService.cs`
- [ ] **گام ۴:** Service `FiqhService.cs` + `FiqhAssessmentService.cs` + `FiqhGamificationService.cs`
- [ ] **گام ۵:** Controller `FiqhController.cs` با `[Route("api/fiqh")]`
- [ ] **گام ۶:** DI در `Program.cs` (AddScoped)
- [ ] **گام ۷:** DbSet در `AppDbContext.cs` (۱۵ DbSet)
- [ ] **گام ۸:** Seeder `FiqhDataSeeder.cs`
- [ ] **گام ۹:** BKT Engine + Spaced Repetition
- [ ] **گام ۱۰:** تست‌های واحد (xUnit + InMemory)

### فرانت‌اند (Angular)

- [ ] **گام ۱۱:** Models در `lesson-planner.models.ts`
- [ ] **گام ۱۲:** API methods در `lesson-planner-api.interface.ts`
- [ ] **گام ۱۳:** HTTP implementation در `http-lesson-planner-api.service.ts`
- [ ] **گام ۱۴:** Mock implementation در `mock-lesson-planner-api.service.ts`
- [ ] **گام ۱۵:** ماژول Angular `features/fiqh/`
  - [ ] `fiqh.module.ts`
  - [ ] `fiqh.routes.ts`
  - [ ] `services/fiqh.service.ts`
- [ ] **گام ۱۶:** کامپوننت‌ها
  - [ ] CourseListComponent
  - [ ] CourseDetailComponent
  - [ ] BookDetailComponent
  - [ ] LessonDetailComponent
  - [ ] ScenarioSimulatorComponent
  - [ ] FatwaWorkshopComponent
  - [ ] QuizComponent
  - [ ] MasteryChallengeComponent
  - [ ] ProgressComponent
  - [ ] MarjaReferenceComponent

### زیرساخت

- [ ] **گام ۱۷:** ثبت مسیر در `app.routes.ts`: `{ path: 'fiqh', loadChildren: ... }`
- [ ] **گام ۱۸:** بیلد بک‌اند: `dotnet build`
- [ ] **گام ۱۹:** بیلد فرانت: `ng build`
- [ ] **گام ۲۰:** تست نهایی سرو + اعتبارسنجی

---

## ۱۸. ضمیمه: بهبودهای پیشنهادی برای الگوی اصلی

بر اساس تحقیقات این پروژه، پیشنهاد می‌شود الگوی اصلی `MODULE_TEMPLATE.md` در نسخه بعدی خود این بهبودها را دریافت کند:

### بهبودهای معماری

| بخش | بهبود | منبع الهام |
|-----|-------|-----------|
| **Mastery Learning** | جایگزینی وضعیت ساده با ۵ سطح Khan Academy | Khan Academy |
| **BKT** | اضافه کردن Bayesian Knowledge Tracing به جای درصد ساده | Carnegie Learning |
| **Spaced Repetition** | الگوریتم FSRS برای مرور بهینه | Duolingo HLR |
| **Content Versioning** | immutable content با SHA-256 hash | CurricMesh |
| **Adaptive Selection** | انتخاب سؤال با P(correct) ≈ ۰.۷ | Birdbrain + ALEKS |
| **3-Circle Model** | سه عمق برای یک محتوا | SeekersGuidance |
| **Gamification** | Tier + Streak + Badge | Quran Courses + Duolingo |

### بهبودهای فنی

| بخش | بهبود |
|-----|-------|
| **Question Generation** | قالب‌های پارامتری برای تولید انبوه سؤال |
| **Content Pipeline** | جداسازی کامل Offline/Online با Review workflow |
| **Search** | جستجوی فازی با پشتیبانی از کلمات کلیدی فارسی |
| **Progress** | Inner/Outer Fringe از ALEKS |
| **Assessment** | ۱۰ نوع سؤال به جای ۴ نوع |

---

> **نکته نهایی:** این الگو با بیش از ۱۵ موجودیت دامنه، ۱۰ نوع ارزشیابی، موتور BKT، سیستم گیمیفیکیشن ۵ سطحی، مدل ۳ حلقه‌ای و ۵۲ باب استاندارد فقهی، یک ماژول کامل و پیشرو برای آموزش احکام و فقه در نهضت پلاس است. برای شروع، می‌توان از **فقه العبادات** (سطح مبتدی) شروع کرد و به تدریج سطوح بعدی را اضافه نمود.
