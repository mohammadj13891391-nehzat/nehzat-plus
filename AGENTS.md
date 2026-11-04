# AGENTS.md — nehzat-plus (Lesson Planner)

ASP.NET Core 10 backend + Angular 21 frontend. See [docs/AGENTS.md](docs/AGENTS.md) (bible), [backend/AGENTS.md](backend/AGENTS.md), [frontend/AGENTS.md](frontend/AGENTS.md) for domain depth.

## Commands (zero-infra dev)
```bash
# Backend — http://localhost:3000
cd backend && dotnet run            # dev server (MockAuth on in Development)
cd backend && dotnet run --seed     # drop + recreate DB + seed

# Frontend — http://localhost:4201
cd frontend && npm install && npm start   # ng serve
cd frontend && ng test              # Vitest + jsdom
cd frontend && npm run build:capacitor && npx cap sync android  # APK

# Backend tests (xUnit, 147 tests) — stop the dev API first or bin/ is locked
cd backend && dotnet test
```

## Layout
| Layer | Path | Responsibility |
|-------|------|----------------|
| API | `backend/src/EducationalPlatform.Nehzat.API/` | Program.cs (DI, auth, CORS, middleware), Controllers, Middleware |
| Application | `backend/src/EducationalPlatform.Nehzat.Application/` | DTOs, service interfaces |
| Domain | `backend/src/EducationalPlatform.Nehzat.Domain/` | Entities |
| Infrastructure | `backend/src/EducationalPlatform.Nehzat.Infrastructure/` | EF Data, Services, Seeders, Clients |
| Frontend | `frontend/src/app/` | `core/` (services/guards/interceptors) + `features/<role>/` (lazy routes) |

## Backend — Critical facts
- **Framework**: ASP.NET Core 10 (`net10.0`). EF Core + **SQL Server** (Windows auth). Startup DB lifecycle (Program.cs): missing DB → `Migrate()`; existing DB with EF history → apply pending migrations; legacy `EnsureCreated` DB that already has tables → **adopted as-is** (no migration applied); existing empty DB → `Migrate()`. `--seed` drops + recreates.
- **Dev DB**: `LessonPlanner_Dev` — `Server=.;Database=LessonPlanner_Dev;Trusted_Connection=True;TrustServerCertificate=True;` (in `appsettings.Development.json`).
- **Auth**: Redirect-based OIDC via OTUH2. **Production** validates `at+jwt` against `https://api.nehzat128.ir/oauth` (JWKS). **Dev** uses `DevAuth:UseMockAuth` (in `appsettings.Development.json`, under the `DevAuth` section — NOT a top-level `UseMockAuth` flag) with HMAC symmetric key. Mock `SignIn` is hard-gated on `Development` env + `DevAuth:UseMockAuth`; dev accounts come from `DevAuth:Accounts` in config (10 accounts); `DevAuthKey` can be overridden by the `NEHZAT_DEV_AUTH_KEY` env var. Claims: `sub`→username, `role`→role (NOT `ClaimTypes.Role`).
- **Middleware order** (Program.cs): `GlobalException` → `Cors` → `Authentication` → `OidcSyncMiddleware` → `Authorization` → `StaticFiles` → `MapControllers` → `MapHub`.
- **OidcSyncMiddleware**: auto-creates local `User` row on first authenticated request from OTUH2.
- **Controllers**: All `[Authorize]` except `AuthController` (`/login` dev-mock sign-in gated on Development + `DevAuth:UseMockAuth`, plus `/signup`, `/register`, `/qr/*`). **Default-deny**: a `FallbackPolicy` (`RequireAuthenticatedUser`) is registered in Program.cs, so any endpoint without explicit `[Authorize]` still requires authentication. Course endpoints require `admin,manager,headquarters` (class-level `[Authorize(Roles = ...)]` on `CourseController` — role lists live in `Application/Constants/RoleNames.cs`; canonical role is `branch_manager` with underscore; hyphen form only appears in URL route paths). Admin endpoints split into 8 domain controllers (`AdminBranches*`, `AdminCourses*`, `AdminCoaches*`, `AdminBranchManagers*`, `AdminParents*`, `AdminEvaluators*`, `AdminStudents*`, `AdminStatistics*`) — **never append to one admin controller**.
- **Services**: ~70 scoped `I*-Service` interfaces registered explicitly in Program.cs. Add new ones there.

## Frontend — Critical facts
- **Framework**: Angular 21 standalone + Capacitor 8 (Android only, app ID `com.nsafari.lessonplanner`).
- **Auth**: Redirect-based OIDC. `auth.guard` sends browser to OTUH2 `/auth/login`; tokens return to `/auth/callback`. Access+ID tokens in `sessionStorage`; refresh in `localStorage`; 401→auto-logout.
- **`hasRole()`** in `AuthService` is case-insensitive — always use it, never compare roles manually.
- **API layer**: Interface-based. `useMockApi` flag in `environment.ts` swaps `HttpLessonPlannerApiService` ⇄ `MockLessonPlannerApiService`. Also `useMockAuth` for mock auth mode.
- **API URL**: Runtime `/config.json` → fallback to `environment.ts` → `apiUrl`. Same cascade for `otuh2Url`.
- **Styling**: CSS custom properties prefixed `--lp-*` only. Never bare `--gold`, `--primary`, `--danger`.
- **Shared models**: `core/models/lesson-planner.models.ts` is a **barrel** that re-exports 31 domain files `lp-*.models.ts` (split from the former ~4500-line monolith). Edit the relevant `lp-*.models.ts` — never the barrel.
- **Routes**: lazy per feature — ~45 feature routes (`auth`, `dashboard`, `admin`, `coach`, `parent`, `branch-manager`, `evaluator`, `headquarters`, `teacher`, `quran`, `vocabulary`, ...). OnPush on admin/dashboard.

## Morabbi — second system living inside `/coach`
- The `/coach` route hosts the **Morabbi** product (independent backend) integrated into this SPA: `frontend/src/app/features/coach/morabbi/` (shell + 12 lazy pages, `Morabbi`-prefixed classes). Old nehzat coach routes (`students`, `rings`, `spiritual`) are siblings in `coach.routes.ts`.
- **Morabbi backend source is NOT in this repo** — it lives at `D:\morabbi` (no git). API on `:3010`, DB `Morabbi_Dev`. Run: `cd D:\morabbi\backend\src\EducationalPlatform.Morabbi.API && dotnet run`. Its `appsettings.Development.json` CORS must include `http://localhost:4201`.
- **`MorabbiApiService` MUST stay `new HttpClient(inject(HttpBackend))`** — a plain DI `HttpClient` gets Nehzat's global `authInterceptor`, which overwrites `Authorization` with the Nehzat token → 401 on :3010 → force-logout.
- Session bridge: `ensureSession(nehzatRole)` auto-logs in to `/api/auth/local` on :3010 using a role→phone map (coach→`09120000005`, admin→`09120000001`, manager→`09120000002`, branch_manager→`09120000003`, evaluator→`09120000004`; dev password `password123`). Morabbi tokens live in `localStorage` (`morabbi_token`/`morabbi_user`) — separate from Nehzat's sessionStorage tokens.
- Base URL cascade: `public/config.json` → `morabbiApiBase` → `environment.morabbiApiUrl` → fallback `http://localhost:3010` (`resolveMorabbiApiBaseUrl()` in `core/services/api-url.util.ts`).
- A standalone Morabbi SPA exists at `D:\morabbi\frontend` (`:4210`, zoneless, hash routing) — the source the components were ported from. Keep it running alongside; don't modify from this repo.

## Where to look (task → file)
| Need | Go to |
|------|-------|
| New endpoint | `backend/.../API/Controllers/` (domain-split, not AdminController) |
| Business logic | `backend/.../Infrastructure/Services/` + interface in `Application/Interfaces` |
| New entity | `Domain/Entities/` + register in `Infrastructure/Data/AppDbContext` |
| New DTO | `Application/DTOs/` |
| Auth/token/interceptor | `frontend/src/app/core/services/`, `core/guards/`, `core/interceptors/` |
| New page/feature | `frontend/src/app/features/<role>/` |
| Styling variables | `--lp-*` CSS custom props only |

## Test accounts (MockAuth — defined in `DevAuth:Accounts`, `appsettings.Development.json`)
| Role | Username | Password |
|------|----------|----------|
| manager | `test` | `password` |
| trainee | `ali.ahmadi` | `password123` |
| trainee | `fateme.mohammadi` | `password123` |
| trainee | `mohammad.rezaei` | `password123` |
| coach | `coach` | `password123` |
| parent | `parent` | `password123` |
| branch_manager | `branch.manager` | `password123` |
| headquarters | `headquarters` | `password123` |
| evaluator | `evaluator` | `password123` |
| teacher | `teacher` | `password123` |

## Anti-patterns (will break things)
- NEVER add `Microsoft.EntityFrameworkCore.Sqlite` — SQL Server only.
- NEVER return `ex.Message` to client (global handler returns generic Persian error).
- NEVER use bare CSS vars — `--lp-*` only.
- NEVER compare roles by string — use `hasRole()`.
- NEVER append to one admin controller — split by domain.
- JWT `ValidTypes` MUST stay `["at+jwt"]` (gateway rejects other types).
- `AdminController.cs` was ~1130 lines — already split into 8 sub-controllers; don't re-grow it.
- `admin.component.ts` (~103 lines after refactor) — uses lazy routes + `AdminNavigationComponent`. `mock-lesson-planner-api.service.ts` (~285 lines) — thin facade delegating to 40+ domain services via mixin pattern. Both well-structured; follow existing patterns when extending.

## Landmines & quirks
- User works in **Persian** — reply in Persian. UI copy is Persian/RTL; code identifiers stay English.
- `README.md` at root is **partly stale** (historically claimed .NET 8 / NestJS / SQLite / `dummy-token`). Trust this file and actual code over README. Other docs like `docs/FRONTEND_PRD.md` and `docs/SYSTEM_ARCHITECTURE.md` may also contain legacy references.
- No process manager — dev servers die with the session.
- Multi-branch workflows partially implemented; one default branch ("شعبه مرکزی") auto-created on startup.
- Version archive system: `scripts/archive-version.ps1` + `docs/PROJECT_INVENTORY.md` (runs via pre-push hook on tag push).
- Deploy: GitHub Pages on push to `main`; APK on `v*` tags (see `.github/workflows/deploy.yml`).