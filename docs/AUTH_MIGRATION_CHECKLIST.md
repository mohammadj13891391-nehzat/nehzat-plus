# ✅ کارهای انجام شده — یکپارچه‌سازی احراز هویت OTUH2

## بک‌اند (ASP.NET Core)

| # | کار | فایل | وضعیت |
|---|-----|------|--------|
| 1 | حذف JWT self-issued، اضافه شدن OIDC Authority-based validation | `appsettings.json`, `Program.cs` | ✅ |
| 2 | MockAuthHandler با claims سازگار OTUH2 | `Middleware/MockAuthHandler.cs` | ✅ |
| 3 | حذف `PasswordHash` از `User`، اضافه شدن `OidcSubject` | `Domain/Entities/User.cs` | ✅ |
| 4 | حذف `GenerateJwtToken` و BCrypt از `UserService` | `Infrastructure/Services/UserService.cs` | ✅ |
| 5 | متدهای جدید: `FindByOidcSubjectAsync`, `CreateLocalUserAsync`, `SyncOidcSubjectAsync` | `IUserService.cs`, `UserService.cs` | ✅ |
| 6 | حذف `SignIn` از `AuthController` (انتقال به OTUH2) | `Controllers/AuthController.cs` | ✅ |
| 7 | اضافه شدن `[Authorize]` به `AssessmentController` | `Controllers/AssessmentController.cs` | ✅ |
| 8 | `OidcSubject` unique filtered index | `Data/AppDbContext.cs` | ✅ |
| 9 | `IOtuh2AuthClient` Refit client برای ارتباط service-to-service | `Infrastructure/Clients/IOtuh2AuthClient.cs` | ✅ |
| 10 | `AddOtuh2AuthClient()` با Polly retry | `Infrastructure/Clients/Otuh2AuthClientExtensions.cs` | ✅ |
| 11 | `OidcSyncMiddleware` — auto-sync کاربران OTUH2 به DB محلی | `Middleware/OidcSyncMiddleware.cs` | ✅ |
| 12 | کانفیگ `Otuh2Client` در appsettings | `appsettings.json`, `appsettings.Development.json` | ✅ |

## فرانت‌اند (Angular 21)

| # | کار | فایل | وضعیت |
|---|-----|------|--------|
| 1 | مدل‌های OTUH2 (`AuthTokenResponse`, `UserInfoResponse`, `RegisterPayload`) | `core/models/otuh2.models.ts` | ✅ |
| 2 | `Otuh2Api` abstract class | `core/services/otuh2-api.interface.ts` | ✅ |
| 3 | `HttpOtuh2Api` — پیاده‌سازی HTTP با OAuth2 password grant | `core/services/http-otuh2-api.service.ts` | ✅ |
| 4 | `OTUH2_API` injection token + `provideOtuh2Api()` | `core/services/otuh2-api.token.ts` | ✅ |
| 5 | `resolveOtuh2BaseUrl()` + `setOtuh2Url()` | `core/services/api-url.util.ts` | ✅ |
| 6 | بازنویسی `AuthService` — `sessionStorage` توکن، `hasRole()`, case-insensitive | `core/services/auth.service.ts` | ✅ |
| 7 | `auth.interceptor.ts` — استفاده از `AuthService.getAccessToken()` | `core/interceptors/auth.interceptor.ts` | ✅ |
| 8 | `admin.guard.ts` — `hasRole()` pattern | `core/guards/admin.guard.ts` | ✅ |
| 9 | `role.guard.ts` — پارامتر `string` | `core/guards/role.guard.ts` | ✅ |
| 10 | `auth.guard.ts` — `returnUrl` support | `core/guards/auth.guard.ts` | ✅ |
| 11 | `CurrentUser` — `roles: string[]` + `userType: string` | `core/models/lesson-planner.models.ts` | ✅ |
| 12 | `login.component.ts` — OTUH2 flow + `returnUrl` | `features/auth/pages/login/login.component.ts` | ✅ |
| 13 | `environment.ts` / `environment.prod.ts` — `otuh2Url` | `environments/` | ✅ |
| 14 | `config.json` — `otuh2Url` runtime override | `public/config.json` | ✅ |
| 15 | `config.loader.ts` — بارگذاری `otuh2Url` | `config.loader.ts` | ✅ |
| 16 | `app.config.ts` — `provideOtuh2Api()` | `app.config.ts` | ✅ |
| 17 | Fix type در `assessment-panel.component.ts` | `features/shared/assessment-panel/` | ✅ |

---

# ⚠️ کارهای باقی‌مانده — OTUH2 (Identity Provider)

## ۱. اضافه کردن نقش‌های Nehzat Plus به OTUH2

**اولویت: 🔴 بالا** | **وضعیت: 🟢 خودکار شده**

نقش‌های زیر باید در سیستم OTUH2 وجود داشته باشند:

| نقش | نام | توضیح |
|-----|-----|-------|
| `manager` | مدیر سیستم | دسترسی کامل |
| `headquarters` | ستاد | مدیریت چند شعبه |
| `branch_manager` | مدیر شعبه | مدیریت یک شعبه |
| `coach` | مربی | ارزیابی دانش‌آموزان |
| `parent` | والدین | مشاهده وضعیت فرزند |
| `evaluator` | ارزیاب | ارزیابی تخصصی |
| `trainee` | دانش‌آموز | داشبورد شخصی |

**🟢 خودکار:** `Otuh2RoleSeeder` در startup نقش‌های missing رو از طریق `/api/admin/roles` ایجاد می‌کنه.

**نحوه دستی (در صورت نیاز):**

```bash
# دریافت admin token
curl -X POST http://localhost:5000/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=nehzat-plus&client_secret=nehzat-plus-secret-2026&scope=openid"

# ایجاد نقش
curl -X POST http://localhost:5000/api/admin/roles \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "manager", "description": "مدیر سیستم - دسترسی کامل"}'

# مشاهده نقش‌های موجود
curl http://localhost:5000/api/admin/roles \
  -H "Authorization: Bearer <admin_token>"
```

> **توجه:** OTUH2 نقش‌ها رو در جدول `RoleDefinitions` ذخیره می‌کنه. `coach` از قبل وجود داره. Nehzat Plus نقش‌ها رو **case-insensitive** بررسی می‌کنه.

---

## ۲. ثبت Client `nehzat-plus` در OTUH2

**اولویت: 🔴 بالا** | **وضعیت: ✅ انجام شده**

کلاینت `nehzat-plus` با مشخصات زیر در OTUH2 ثبت شده:

| فیلد | مقدار |
|------|-------|
| ClientId | `nehzat-plus` |
| ClientSecret | `nehzat-plus-secret-2026` |
| نوع | Confidential |
| Grant Types | `client_credentials` |
| Permissions | `ept:token` |

**کانفیگ سمت Nehzat Plus** (به‌روز شده):
```json
// appsettings.json
"Otuh2Client": {
  "BaseUrl": "https://api.nehzat128.ir/oauth",
  "ClientId": "nehzat-plus",
  "ClientSecret": "nehzat-plus-secret-2026",
  "ApiKey": "otuh2-nehzat-key"
}
```

**نحوه استفاده (service-to-service):**
```bash
curl -X POST http://localhost:5000/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=nehzat-plus&client_secret=nehzat-plus-secret-2026&scope=openid"
```

---

## ۳. پیاده‌سازی `POST /api/auth/register` در OTUH2

**اولویت: 🟡 متوسط**

**مشکل:** این endpoint در مستندات OTUH2 ذکر شده. فرانت‌اند Nehzat Plus هم از `/api/register` برای ثبت‌نام استفاده می‌کنه.

**راه‌حل پیشنهادی:** پیاده‌سازی `AuthController` با `/api/auth/register` در OTUH2.

> **توجه:** `CreateServiceUserAsync` کاربر رو **auto-approved** می‌سازه. اگر workflow تأیید نیازه، باید `/api/auth/register` با `ApprovalStatus = "pending"` پیاده‌سازی بشه.

---

## ۴. پیاده‌سازی `POST /connect/introspect` در OTUH2

**اولویت: 🟢 پایین**

**مشکل:** این endpoint در `Program.cs` تعریف شده (`SetIntrospectionEndpointUris`) اما Controller نداره.

**راه‌حل:**
OpenIddict می‌تونه خودش introspection رو handle کنه با `EnableIntrospectionEndpointPassthrough()`. کافیه توی `Program.cs`:

```csharp
options.UseAspNetCore()
       .EnableTokenEndpointPassthrough()
       .EnableIntrospectionEndpointPassthrough()  // ← این رو اضافه کنید
       // ...
```

و یه `TokenController` یا handler برای introspection claims اضافه کنید. برای نیاز فعلی Nehzat Plus **ضروری نیست** — فقط در صورت نیاز به اعتبارسنجی real-time توکن.

---

## ۵. یکسان‌سازی پورت OTUH2 در مستندات و کد

**اولویت: 🟢 پایین**

| منبع | پورت |
|------|------|
| `AUTH_INTEGRATION.md` | `http://localhost:5000` |
| `INTEGRATION_GUIDE.md` | `https://localhost:5001` |
| `INTEGRATION_TEST.ps1` | `https://localhost:5001` |
| `appsettings.Development.json` (OTUH2) | `http://localhost:5000` |
| `appsettings.Development.json` (Nehzat Plus) | `http://localhost:5000` |

**توصیه:** همه رو روی `http://localhost:5000` یکسان کنید.

---

## ۶. ثبت client `personality` در OTUH2

**اولویت: 🟢 پایین**

اگر سرویس `personality` هم قراره از OTUH2 استفاده کنه، باید مثل `nehzat-plus` یک client با `client_credentials` براش ثبت بشه:

```csharp
ClientId = "personality",
ClientSecret = "personality-secret-2026"
```

---

# ⚠️ کارهای باقی‌مانده — Nehzat Plus

## ۷. به‌روزرسانی `SampleDataSeeder` برای OTUH2

**اولویت: 🟡 متوسط**

**مشکل:** `SampleDataSeeder` کاربران نمونه (`ali.ahmadi`, `fateme.mohammadi`, `mohammad.rezaei`) رو با `CreateUserAsync` می‌سازه که قبلاً `PasswordHash` ذخیره می‌کرد. الان PasswordHash حذف شده و `CreateUserAsync` دیگه پسورد رو ذخیره نمی‌کنه.

**راه‌حل‌ها:**

### گزینه A: حذف creation کاربران نمونه
```csharp
// توی SampleDataSeeder، بخش ایجاد کاربران رو حذف یا کامنت کنید
// کاربران حالا باید از طریق OTUH2 ساخته بشن
```

### گزینه B: استفاده از OTUH2 Internal API
```csharp
// کاربران نمونه رو از طریق IOtuh2AuthClient توی OTUH2 بسازید
var otuh2Client = serviceProvider.GetRequiredService<IOtuh2AuthClient>();
var apiKey = configuration["Otuh2Client:ApiKey"];
await otuh2Client.CreateServiceUserAsync(apiKey, new CreateServiceUserRequest(
    Username: "ali.ahmadi",
    Password: "password123",
    FirstName: "علی",
    LastName: "احمدی",
    Role: "trainee"
));
```

---

## ۸. به‌روزرسانی `CreateUserAsync` در `AdminController`

**اولویت: 🟡 متوسط**

`AdminController` هنوز `CreateUserAsync` رو با پارامتر `password` صدا می‌زنه. هرچند `UserService.CreateUserAsync` الان password رو ignore می‌کنه، ولی بهتره:

1. **در Nehzat Plus:** کاربر از طریق `IOtuh2AuthClient.CreateServiceUserAsync` توی OTUH2 ساخته بشه
2. **در Nehzat Plus:** یه رکورد محلی با `OidcSubject` ذخیره بشه

```csharp
// AdminController - CreateUser action
var otuh2User = await _otuh2Client.CreateServiceUserAsync(apiKey, new CreateServiceUserRequest(
    Username: request.Username,
    Password: request.Password,
    FirstName: request.FirstName,
    LastName: request.LastName,
    Email: request.Email,
    PhoneNumber: request.PhoneNumber,
    Role: request.UserType
));

await _userService.CreateLocalUserAsync(
    username: request.Username,
    userType: request.UserType,
    oidcSubject: otuh2User.Id.ToString()
);
```

---

## ۹. رفع `ApprovalStatus` workflow

**اولویت: 🟡 متوسط**

**مشکل:** workflow تأیید/رد کاربر قبلاً hybrid بود (هم OTUH2، هم Nehzat Plus). الان Nehzat Plus هنوز `ApprovalStatus` رو توی `User` entity داره و `AuthController.SignUp` کاربر رو با `pending` می‌سازه. ولی OTUH2 از طریق Internal API کاربر رو `approved` می‌سازه.

**راه‌حل (طبق تصمیم):** workflow تأیید کاملاً به OTUH2 منتقل بشه:

1. حذف فیلد `ApprovalStatus` از `User` entity در Nehzat Plus
2. حذف `AdminController` endpointهای `users/pending`, `users/{id}/approve`, `users/{id}/reject`
3. انتقال این منطق به OTUH2 Admin API (از قبل وجود داره)

---

## ۱۰. حذف `PasswordHash` از موجودیت‌های جانبی

**اولویت: 🟢 پایین**

چهار موجودیت `Coach`, `Parent`, `Evaluator`, `BranchManager` هنوز `PasswordHash` دارن. اینها برای لاگین استفاده **نمی‌شن** (فقط رکوردهای مدیریتی هستن). می‌تونید:

- **گزینه A:** `PasswordHash` رو نگه دارید (تأثیری نداره، فقط فضای مرده است)
- **گزینه B:** حذف کنید و migration بدید

---

## ۱۱. تست end-to-end

**اولویت: 🔴 بالا — قبل از deploy**

### سناریوهای تست:

```
1. Mock Auth (UseMockAuth: true)
   □ فرانت‌اند → لاگین هر username/password → دریافت Mock claims
   □ دسترسی به /admin با role manager
   □ دسترسی به /dashboard با role trainee

2. OTUH2 Real Auth (UseMockAuth: false)
   □ راه‌اندازی OTUH2 روی http://localhost:5000
   □ POST /connect/token با test/Admin@123 → دریافت token
   □ فرانت‌اند با توکن OTUH2 → API call → 200
   □ منقضی شدن توکن → 401 → redirect به login
   □ refresh_token → دریافت توکن جدید
   □ hasRole('manager') → دسترسی به admin panel
   □ hasRole('trainee') → دسترسی به dashboard

3. OidcSyncMiddleware
   □ اولین درخواست با sub جدید → ایجاد User در DB محلی
   □ درخواست دوم با همان sub → بدون ایجاد duplicate
   □ OidcSubject در DB آپدیت بشه

4. Service-to-Service (IOtuh2AuthClient)
   □ CreateServiceUserAsync → کاربر در OTUH2 ساخته بشه
   □ GetUserByUsernameAsync → کاربر پیدا بشه
   □ AssignRoleAsync → نقش اضافه بشه

5. Frontend
   □ توکن در sessionStorage ذخیره بشه (نه localStorage)
   □ refresh_token در localStorage ذخیره بشه
   □ logout → پاک شدن هر دو
   □ returnUrl بعد از login کار کنه
   □ صفحه محافظت‌شده بدون login → redirect به /auth/login?returnUrl=...
```

### دستورات تست:

```powershell
# تست OTUH2 token endpoint
curl -X POST http://localhost:5000/connect/token `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "grant_type=password&client_id=otuh2-spa-client&username=admin&password=Admin@123&scope=openid email profile roles offline_access"

# تست OTUH2 userinfo
curl http://localhost:5000/connect/userinfo `
  -H "Authorization: Bearer <access_token>"

# تست Nehzat Plus با توکن OTUH2
curl http://localhost:3000/admin/courses `
  -H "Authorization: Bearer <access_token>"
```

---

# 📋 جمع‌بندی اولویت‌ها

| # | کار | لایه | اولویت | وضعیت |
|---|-----|------|--------|--------|
| ۱ | اضافه کردن نقش‌های Nehzat Plus به OTUH2 | OTUH2 | 🔴 بالا | 🟢 خودکار (Otuh2RoleSeeder) |
| ۲ | ثبت client `nehzat-plus` در OTUH2 | OTUH2 | 🔴 بالا | ✅ انجام شده |
| ۳ | تست end-to-end کامل | هر دو | 🔴 بالا | ⚠️ در انتظار |
| ۴ | پیاده‌سازی `/api/auth/register` در OTUH2 | OTUH2 | 🟡 متوسط | ⚠️ در انتظار |
| ۵ | به‌روزرسانی `SampleDataSeeder` | Nehzat Plus | 🟡 متوسط | ⚠️ در انتظار |
| ۶ | رفع workflow تأیید کاربر | هر دو | 🟡 متوسط | ⚠️ در انتظار |
| ۷ | `CreateUserAsync` در `AdminController` | Nehzat Plus | 🟡 متوسط | ⚠️ در انتظار |
| ۸ | پیاده‌سازی `/connect/introspect` | OTUH2 | 🟢 پایین | ⚠️ در انتظار |
| ۹ | یکسان‌سازی پورت OTUH2 | OTUH2 | 🟢 پایین | ⚠️ در انتظار |
| ۱۰ | حذف `PasswordHash` از موجودیت‌های جانبی | Nehzat Plus | 🟢 پایین | ⚠️ در انتظار |

### 🟢 خودکار شده در این آپدیت:

| قابلیت | فایل |
|---------|------|
| ایجاد خودکار نقش‌های Nehzat Plus در OTUH2 | `Seeders/Otuh2RoleSeeder.cs` |
| همگام‌سازی UserType از token roleها | `Middleware/OidcSyncMiddleware.cs` |
| endpointهای مدیریت نقش (`/api/admin/roles`) | `Clients/IOtuh2AuthClient.cs` |
| endpointهای مدیریت کلاینت (`/api/admin/clients`) | `Clients/IOtuh2AuthClient.cs` |
| endpoint ثبت‌نام (`/api/auth/register`) | `Clients/IOtuh2AuthClient.cs` |
| کانفیگ `ClientId` + `ClientSecret` | `appsettings.json` |
| ۵ | به‌روزرسانی `SampleDataSeeder` | Nehzat Plus | 🟡 متوسط |
| ۶ | رفع workflow تأیید کاربر | هر دو | 🟡 متوسط |
| ۷ | `CreateUserAsync` در `AdminController` | Nehzat Plus | 🟡 متوسط |
| ۸ | پیاده‌سازی `/connect/introspect` | OTUH2 | 🟢 پایین |
| ۹ | یکسان‌سازی پورت OTUH2 | OTUH2 | 🟢 پایین |
| ۱۰ | حذف `PasswordHash` از موجودیت‌های جانبی | Nehzat Plus | 🟢 پایین |

---

# 📞 پشتیبانی

- OTUH2 مستندات: `D:\nehzat-plus\EhrazHoviat\docs\AUTH_INTEGRATION.md`
- Nehzat Plus مستندات: `D:\nehzat-plus\nehzat-plus\docs\AGENTS.md`
- Nehzat Plus راهنمای یکپارچه‌سازی: `D:\nehzat-plus\nehzat-plus\docs\AGENTS.md`
