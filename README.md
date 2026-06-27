# راهنمای پروژه درس‌پلنر (Lesson Planner) — nehzat-plus

این مخزن شامل دو بخش اصلی است: بک‌اند ASP.NET Core و فرانت‌اند Angular. هدف سیستم مدیریت دانش‌آموز، درس، تکلیف روزانه و ارسال روزانه است، با نمودارهای پیشرفت هر دو هفته.

## 🎯 هدف پروژه

سیستم درس‌پلنر برای مدیریت فرآیند آموزش روزانه دانش‌آموزان طراحی شده است:
- **تکالیف روزانه**: هر دانش‌آموز تکالیف روزانه دریافت می‌کند
- **ارسال فایل**: امکان آپلود فایل‌های صوتی و مستندات
- **نمودار پیشرفت**: نمایش پیشرفت هر دو هفته
- **مدیریت دوره‌ها**: سیستم مدیریت کامل دوره‌ها و تکالیف
- **پشتیبانی موبایل**: قابلیت اجرا روی اندروید با Capacitor

## ساختار کلی پروژه

```
nehzat-plus/
├─ backend/                 # سرویس بک‌اند ASP.NET Core 8 (EF Core + SQLite)
│  └─ LessonPlanner.Api/
│     ├─ Models/            # موجودیت‌های EF Core
│     ├─ Data/              # AppDbContext
│     ├─ DTOs/              # مدل‌های درخواست/پاسخ
│     ├─ Services/          # منطق تجاری (interface + implementation)
│     ├─ Controllers/       # ۵ کنترلر (auth, student, course, admin, seeder)
│     ├─ Seeders/           # داده‌های نمونه
│     └─ Program.cs         # راه‌اندازی برنامه
│
├─ frontend/                # فرانت‌اند Angular 21 (standalone + Capacitor)
│  ├─ src/app/
│  │  ├─ core/              # Models, Services, Guards, Interceptors
│  │  │  ├─ models/         # LessonPlanner models (TypeScript interfaces)
│  │  │  ├─ services/       # AuthService + API interface (HTTP/Mock)
│  │  │  ├─ guards/         # authGuard, adminGuard (functional)
│  │  │  └─ interceptors/   # authInterceptor (Bearer token)
│  │  ├─ features/          # auth, dashboard, admin (lazy modules)
│  │  └─ config.loader.ts   # بارگیری پویای API URL از config.json
│  └─ README.md
│
└─ docs/                    # مستندات تکمیلی
   ├─ AGENTS.md             # راهنمای معماری سیستم
   ├─ FRONTEND_PRD.md       # سند نیازمندی محصول فرانت‌اند
   ├─ user-stories-student.md
   ├─ API_ENDPOINTS.md      # مستندات کامل API
   ├─ SIGNUP_APPROVAL_WORKFLOW.md
   ├─ USER_STUDENT_RELATIONSHIP.md
   ├─ STUDENT_FILE_UPLOAD_GUIDE.md
   └─ ADMIN_API_EXAMPLES.md
```

## 🛠️ نحوه اجرا (توسعه)

### پیش‌نیازها
- Node.js 18+
- npm 9+
- .NET 8 SDK
- سیستم‌عامل سازگار (Linux/WSL توصیه می‌شود)

### اجرای بک‌اند ASP.NET Core (`backend/`)
```bash
cd backend/LessonPlanner.Api
dotnet run
```
- سرور روی `http://localhost:5253` اجرا می‌شود (پورت در `Properties/launchSettings.json`)
- پایگاه‌داده SQLite `lesson-planner.db` با `EnsureCreated()` ساخته می‌شود
- کاربر ادمین `test` / `password` و داده‌های نمونه به‌صورت خودکار ایجاد می‌شوند
- CORS کاملاً باز است (`AllowAnyOrigin`)
- API کاملاً مشابه نسخه NestJS است (همان endpointها، همان رفتار)

### اجرای فرانت‌اند Angular (`frontend/`)
```bash
cd frontend
npm install
npm start
```
- سرور روی `http://localhost:4200` اجرا می‌شود
- فرانت‌اند از Angular 21 با معماری standalone components استفاده می‌کند
- **API لایه**: مبتنی بر اینترفیس با قابلیت جابه‌جایی بین HTTP واقعی و Mock (تغییر با `environment.useMockApi`)
- **بارگیری پویای API URL**: فایل `config.json` در bootstrap برنامه بارگذاری می‌شود (`config.loader.ts`)
- **استایل**: CSS سفارشی با متغیرهای `--lp-*` و فونت وزیرمتن (بدون Bootstrap)
- **تست**: Vitest با jsdom (جایگزین Karma/Jasmine)
- **پشتیبانی موبایل**: Capacitor 8 برای اجرا روی اندروید

## 🧪 تست سیستم

### کاربران نمونه موجود
سیستم به‌صورت خودکار کاربران زیر را ایجاد می‌کند:

| نوع | Username | Password | توضیحات |
|-----|----------|----------|---------|
| **دانش‌آموز** | `ali.ahmadi` | `password123` | علی احمدی |
| **دانش‌آموز** | `fateme.mohammadi` | `password123` | فاطمه محمدی |
| **دانش‌آموز** | `mohammad.rezaei` | `password123` | محمد رضایی |
| **مدیر** | `test` | `password` | مدیر سیستم |

### مراحل تست
1. **راه‌اندازی بک‌اند**: `dotnet run` در پوشه `backend/LessonPlanner.Api`
2. **راه‌اندازی فرانت‌اند**: `npm start` در پوشه `frontend`
3. **تست ورود**: از کاربران نمونه استفاده کنید
4. **تست ثبت‌نام**: کاربر جدید ثبت‌نام کنید
5. **تست تایید**: به عنوان مدیر وارد شوید و کاربر را تایید کنید
6. **تست تکالیف**: به عنوان دانش‌آموز وارد شوید و تکالیف را مشاهده کنید

## 📊 مدل داده

### موجودیت‌های اصلی
- **Student** (دانش‌آموز) - اطلاعات شخصی و تحصیلی
- **Course** (درس) - دوره‌های آموزشی
- **Assignment** (تکلیف روزانه) - فیلد کلیدی: `assignmentDate`
- **AssignmentAttachment** (ضمیمه تکلیف) - چند فایل/لینک برای هر تکلیف
- **AssignmentSubmission** (ارسال روزانه) - نمره روزانه، وضعیت تکمیل، فایل ارسال‌شده
- **StudentCourse** (ثبت‌نام دانش‌آموز در درس) - رابطه دانش‌آموز-دوره
- **User** (کاربر) - احراز هویت و تایید

### وضعیت‌های کاربر
- **pending**: در انتظار تایید مدیر
- **approved**: تایید شده و دانش‌آموز ایجاد شده
- **rejected**: رد شده

## 🔌 نقاط انتهایی مهم (API)

> تمام endpointها در بک‌اند ASP.NET Core پیاده‌سازی شده‌اند. مستندات کامل API در `docs/API_ENDPOINTS.md` موجود است.

### 🔐 احراز هویت
- `POST /auth/signin` - ورود کاربر (بررسی وضعیت تایید)
- `POST /auth/signup` - ثبت‌نام کاربر جدید (وضعیت pending)

### 👨‍🎓 دانش‌آموزان
- `GET /students/:id/progress` - پیشرفت دانش‌آموز
- `GET /students/me/profile` - پروفایل دانش‌آموز (username در body)
- `POST /students/:id/assignments/:assignmentId/submit` - ارسال کار روزانه (با آپلود فایل)

### 📚 دوره‌ها
- `GET /courses` - همه دوره‌ها
- `GET /courses/active` - دوره‌های فعال
- `GET /courses/:id/assignments` - تکالیف دوره
- `POST /courses/:id/assignments/daily-series` - ایجاد سری تکالیف روزانه

### 👨‍💼 مدیریت (Admin)
- `GET /admin/courses` - مدیریت دوره‌ها
- `GET /admin/users/pending` - کاربران در انتظار تایید
- `POST /admin/users/:userId/approve` - تایید کاربر و ایجاد دانش‌آموز
- `POST /admin/users/:userId/reject` - رد کردن کاربر
- `POST /admin/courses/:courseId/assignments/daily-series` - ایجاد سری تکالیف
- `POST /admin/assignments/:assignmentId/attachments` - آپلود فایل ضمیمه
- `GET /admin/statistics` - آمار سیستم

## 📚 مستندات تکمیلی

تمامی مستندات در پوشه `docs/` قرار دارند:
- `AGENTS.md` - راهنمای معماری سیستم و نکات توسعه
- `FRONTEND_PRD.md` - سند نیازمندی محصول فرانت‌اند
- `API_ENDPOINTS.md` - مستندات کامل API با جزئیات درخواست/پاسخ
- `SIGNUP_APPROVAL_WORKFLOW.md` - فرآیند ثبت‌نام و تایید کاربران
- `USER_STUDENT_RELATIONSHIP.md` - رابطه کاربر و دانش‌آموز
- `STUDENT_FILE_UPLOAD_GUIDE.md` - راهنمای آپلود فایل
- `ADMIN_API_EXAMPLES.md` - مثال‌های عملی API مدیریت
- `user-stories-student.md` - داستان‌های کاربری دانش‌آموز

## 🧪 حالت توسعه با Mock API

فرانت‌اند از معماری API دوگانه پشتیبانی می‌کند:
- **HTTP واقعی**: اتصال به بک‌اند ASP.NET Core
- **Mock**: داده‌های نمونه درون‌مرورگری بدون نیاز به بک‌اند

تغییر حالت با `useMockApi: true/false` در `frontend/src/environments/environment.ts` انجام می‌شود.
در حالت Mock، کلیه عملیات‌های CRUD، احراز هویت و آپلود فایل بدون سرور قابل تست هستند.

## 🔧 پیکربندی API URL

برنامه `config.json` را در ریشه (`/config.json`) در زمان اجرا بارگذاری می‌کند:
```json
{ "apiUrl": "http://localhost:5253" }
```
این فایل می‌تواند در هر محیط (توسعه، استیجینگ، production) متفاوت باشد.
در صورت نبود فایل، برنامه همچنان کار می‌کند (API URL خالی می‌ماند).

## 📱 پشتیبانی موبایل

پروژه از Capacitor برای اجرا روی اندروید پشتیبانی می‌کند:
```bash
cd frontend
npm run build:capacitor
npx cap sync android
npx cap open android
```

## نکات امنیتی
- تمام APIها نیاز به احراز هویت دارند (به جز auth)
- کاربران pending نمی‌توانند وارد شوند
- فایل‌ها محدودیت نوع و حجم دارند
- دسترسی‌ها بر اساس نوع کاربر کنترل می‌شود
- **توجه**: توکن احراز هویت فعلی صرفاً یک `dummy-token` در localStorage است و امنیت واقعی ندارد — بک‌اند نیز middleware احراز هویت ندارد
