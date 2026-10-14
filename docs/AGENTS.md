# AGENTS.md — Nehzat Plus (Lesson Planner)

Two sub-projects: `backend/` (ASP.NET Core 10, Clean Architecture) and `frontend/` (Angular 21). Both run with zero infrastructure — `dotnet run` and `npm start` are all you need.

---

## Backend — ASP.NET Core 10 + EF Core + SQL Server

### Database
- SQL Server via Windows auth: `Server=.;Database=LessonPlanner;Trusted_Connection=True;TrustServerCertificate=True`
- Dev database: `LessonPlanner_Dev` (in `appsettings.Development.json`)
- Startup DB lifecycle (Program.cs): missing DB → `Migrate()`; existing DB with EF history → apply pending migrations; legacy `EnsureCreated` DB that already has tables → adopted as-is; existing empty DB → `Migrate()`. `--seed` flag drops + recreates.

### Auth — OTUH2 OIDC (CRITICAL)
- **Production**: JWT Bearer validated against OTUH2 Authority (`https://api.nehzat128.ir/oauth`)
- **Development**: `MockAuthHandler` when `UseMockAuth: true` in `appsettings.Development.json`
- **Login flow is redirect-based** — see [OTUH2_AUTH.md](OTUH2_AUTH.md) for the exact flow, client IDs, and scopes. `auth.guard` redirects to OTUH2's hosted `/auth/login`; tokens return to `/auth/callback`.
- Token type MUST be `at+jwt` (gateway rejects typed JWT)
- Claims mapping: `sub` → username, `userId` → user ID, `role` (NOT `ClaimTypes.Role`)
- `OidcSyncMiddleware` auto-creates a local `User` row on first authenticated request
- `AuthController` has only `SignUp` — sign-in is entirely delegated to OTUH2

### User entity quirks
- `OidcSubject` field replaces the old `PasswordHash` — users have no local password
- Table names use `Nehzat_` prefix: `Nehzat_users`, `Nehzat_courses`, etc.

### Service-to-service (OTUH2)
- `IOtuh2AuthClient` (Refit) for user provisioning, role management, registration
- Configured via `Otuh2Client` section (BaseUrl, ClientId, ClientSecret, ApiKey)
- `Otuh2RoleSeeder` runs non-blocking on startup to ensure Nehzat roles exist in OTUH2

### Clean Architecture layers
- `Domain` → `Application` → `Infrastructure` → `API` (dependency flows inward)
- Entity classes in `Domain.Entities`, DTOs in `Application.DTOs`, services in `Infrastructure.Services`
- `AdminController.cs` is large — split by domain if you need to touch it

### Guardrails
- All controllers require `[Authorize]` except `AuthController`
- CORS: `localhost:4200`, `localhost:4201`, `localhost:3000`
- File uploads: max 10MB, extension allowlist, magic byte validation
- Never return `ex.Message` to the client

---

## Frontend — Angular 21 standalone + Capacitor

### Auth flow
- **Redirect-based OIDC** via EhrazHoviat (OTUH2) — `auth.guard` sends the browser to OTUH2's hosted `/auth/login`; tokens return to `/auth/callback`. See [OTUH2_AUTH.md](OTUH2_AUTH.md).
- `OTUH2_API` injection token → `HttpOtuh2Api` is still used for the signup/registration path (`/api/register`) and service-to-service calls.
- **Access + ID tokens** → `sessionStorage` (lost on tab close)
- **Refresh token** → `localStorage` (persists)
- 401 responses trigger auto-logout
- `hasRole()` in `AuthService` is case-insensitive — always use it, never compare roles manually

### API URL resolution
1. `/config.json` (runtime, from `public/config.json`)
2. Falls back to `environment.ts` → `apiUrl`
3. Same cascade for `otuh2Url`

### Styling (agents always get this wrong)
- CSS custom properties are prefixed `--lp-*` — NEVER use bare `--gold`, `--primary`, `--danger`

### Guards
- `authGuard` supports `returnUrl` query param
- `adminGuard` uses `hasRole()` internally
- `roleGuard('role')` for fine-grained route protection

### Routes (lazy-loaded)
`auth`, `dashboard`, `admin`, `coach`, `parent`, `branch-manager`, `evaluator`, `headquarters`

### Tech notes
- Standalone components, `ChangeDetectionStrategy.OnPush` on admin/dashboard
- Tests: Vitest with `jsdom` (not Karma/Jasmine) — run with `ng test`
- Build output: `dist/frontend/browser`
- Mobile: Capacitor 8, Android only, app ID `com.nsafari.lessonplanner`

---

## Test accounts

| Type | Username | Password |
|------|----------|----------|
| manager | test | password |
| student | ali.ahmadi | password123 |
| student | fateme.mohammadi | password123 |
| student | mohammad.rezaei | password123 |

With `MockAuthHandler` enabled, any username/password works — the handler always returns manager claims.

---

## Known landmines

- **No process manager**: dev servers die when the session ends and must be restarted
- **`AdminController.cs`**: was ~1K+ lines, now split into 8 domain sub-controllers (`AdminBranches*`, `AdminCourses*`, `AdminCoaches*`, `AdminBranchManagers*`, `AdminParents*`, `AdminEvaluators*`, `AdminStudents*`, `AdminStatistics*`)
- **CSV columns**: `Parent.StudentIds` was a comma-separated CSV column — already migrated to `ParentStudent` junction table (`Nehzat_parent_students`).
- **One default branch**: multi-branch workflows are only partially implemented
- **DB lifecycle**: migrations apply on startup (missing DB or existing EF history); legacy `EnsureCreated` DBs with tables are adopted, not migrated. `--seed` drops + recreates.
- **Backend csproj**: had `Microsoft.EntityFrameworkCore.Sqlite` — replaced with `SqlServer`. If you see Sqlite package added back, remove it.

---

## Version Archive System

`docs/PROJECT_INVENTORY.md` auto-archives each tagged release with Persian commit grouping and section-level version labels.

### How it works
- **Pre-push hook** (`.git/hooks/pre-push`) triggers `scripts/archive-version.ps1` on every `git push`
- Script detects **new tags** since the last archived version, groups commits by type (feature/fix/refactor/etc.) in Persian, computes file change stats, and updates section-level version labels via git diff path analysis
- **Never blocks push** — silent no-op when no new tags exist

### Install (one-time, per machine)
```powershell
.\scripts\install-hooks.ps1
```

### Manual run
```powershell
.\scripts\archive-version.ps1              # archive new tags
.\scripts\archive-version.ps1 -WhatIf      # preview without writing
```

### Key files
| File | Purpose |
|------|---------|
| `docs/PROJECT_INVENTORY.md` | The inventory document (15 sections, versioned labels) |
| `scripts/archive-version.ps1` | Archive engine (Persian grouping, stats, section labels) |
| `scripts/hooks/pre-push` | Trackable hook source (copied to `.git/hooks/` by installer) |
| `scripts/install-hooks.ps1` | One-command hook installer (PS 5.1 compatible) |

### Limitations
- Commits are translated by **prefix only** (`feat:` → `ویژگی`); full sentence translation requires AI (ask "تحلیل کن" for a polished Persian version)

---

## Quranic Analysis — منبع تحلیل قرآنی

### منبع معتبر (اجباری)
برای هرگونه تحلیل لغوی، صرفی، نحوی، یا آماری قرآن کریم، **حتماً** از [Quranic Arabic Corpus](https://corpus.quran.com/) استفاده کنید.

**دلیل**: تحلیل‌های rule-based ساده (مثل regex برای تشخیص فعل/اسم) خطاهای زیادی دارند. مثال‌های خطای تحلیل قبلی:
- `نوح`، `نساء`، `نذیر`، `نفس` → اشتباهی "فعل" طبقه‌بندی شدند
- نرمال‌سازی تهاجمی همزه‌ها باعث ادغام کلمات مختلف شد

### نحوه استفاده
1. **Word-by-Word**: `https://corpus.quran.com/wordbyword.jsp?chapter={surah}&verse={ayah}`
2. **POS Tags**: هر کلمه دارای برچسب دقیق است:
   - `N` = Noun (اسم)
   - `V` = Verb (فعل)
   - `P` = Preposition (حرف جر)
   - `CONJ` = Conjunction (حرف عطف)
   - `SUB` = Subordinating conjunction (حرف مصدري)
   - `ADJ` = Adjective (صفت)
   - `PN` = Proper noun (اسم علم)
   - `PRON` = Pronoun (ضمیر)
   - `VOC` = Vocative (نداء)
   - `ACC` = Accusative particle (حرف نصب)
   - `EMPH` = Emphasis (حرف تأکید)
   - `IMPV` = Imperative (حرف أمر)

### فایل‌های تحلیل قرآنی
| File | Purpose |
|------|---------|
| `docs/quran-analysis/01-text-4-surahs.md` | متن کامل ۴ سوره (رسم‌الخط عثمانی) |
| `docs/quran-analysis/analyze.py` | اسکریپت تحلیل (نیاز به بازنویسی با Quranic Arabic Corpus) |
| `docs/quran-analysis/analysis-results.json` | نتایج خام تحلیل |

### ۴ سوره اصلی حلقه‌ها
- نوح (۷۱) | حشر (۵۹) | فتح (۴۸) | حجرات (۴۹)
