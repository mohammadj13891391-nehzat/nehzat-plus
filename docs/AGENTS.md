# AGENTS.md — Nehzat Plus (Lesson Planner)

Two sub-projects: `backend/` (ASP.NET Core 10, Clean Architecture) and `frontend/` (Angular 21). Both run with zero infrastructure — `dotnet run` and `npm start` are all you need.

---

## Backend — ASP.NET Core 10 + EF Core + SQL Server

### Database
- SQL Server via Windows auth: `Server=.;Database=LessonPlanner;Trusted_Connection=True;TrustServerCertificate=True`
- Dev database: `LessonPlanner_Dev` (in `appsettings.Development.json`)
- `EnsureCreated()` on startup (no migrations). `--seed` flag drops + recreates.

### Auth — OTUH2 OIDC (CRITICAL)
- **Production**: JWT Bearer validated against OTUH2 Authority (`https://api.nehzat128.ir/oauth`)
- **Development**: `MockAuthHandler` when `UseMockAuth: true` in `appsettings.Development.json`
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
- OTUH2 OAuth2 password grant via `OTUH2_API` injection token → `HttpOtuh2Api`
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
- **`AdminController.cs`**: single large file (~1K+ lines), split into sub-controllers before adding more endpoints
- **CSV columns**: `Parent.StudentIds` stores comma-separated IDs. Migrate to junction tables.
- **One default branch**: multi-branch workflows are only partially implemented
- **`EnsureCreated()`**: no migration history; schema changes require manual DB drops or `--seed`
- **Backend csproj**: had `Microsoft.EntityFrameworkCore.Sqlite` — replaced with `SqlServer`. If you see Sqlite package added back, remove it.
