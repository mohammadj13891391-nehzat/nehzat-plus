# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-17
**Project:** nehzat-plus (Lesson Planner)

## OVERVIEW
Two-project monorepo: `backend/` (ASP.NET Core 10, EF Core + SQL Server, Clean Architecture) and `frontend/` (Angular 21 standalone + Capacitor 8). Student daily-assignment / progress-tracking platform with OTUH2 OIDC auth. Zero-infra dev: `dotnet run` + `npm start`.

The detailed architecture and conventions bible lives at [docs/AGENTS.md](docs/AGENTS.md) — read it first for auth, DB, styling, and landmine details. This root file is the navigation layer + code map not covered there.

## STRUCTURE
```
nehzat-plus/
├── backend/                 # ASP.NET Core 10 (see backend/AGENTS.md)
│   └── src/
│       ├── EducationalPlatform.Nehzat.Domain/         # Entities only
│       ├── EducationalPlatform.Nehzat.Application/     # DTOs + service Interfaces
│       ├── EducationalPlatform.Nehzat.Infrastructure/  # EF Data + Service impls + Seeders + Clients
│       └── EducationalPlatform.Nehzat.API/             # Program.cs, Controllers, Middleware
├── frontend/                # Angular 21 (see frontend/AGENTS.md)
│   └── src/app/
│       ├── core/            # services, guards, interceptors, models (see frontend/src/app/core/AGENTS.md)
│       └── features/        # lazy route modules: auth, dashboard, admin, coach, parent, branch-manager, evaluator, headquarters, shared
└── docs/                    # AGENTS.md (bible), API_ENDPOINTS.md, SYSTEM_ARCHITECTURE.md, etc.
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add/edit API endpoint | `backend/.../API/Controllers/` (split by domain — see landmines) |
| Add business logic | `backend/.../Infrastructure/Services/` + interface in `Application/Interfaces` |
| New entity | `backend/.../Domain/Entities/` + DbContext in `Infrastructure/Data` |
| New DTO | `backend/.../Application/DTOs/` |
| Frontend page/feature | `frontend/src/app/features/<role>/` |
| Auth/token/interceptor | `frontend/src/app/core/services/`, `core/guards/`, `core/interceptors/` |
| Styling variables | `--lp-*` CSS custom props only (see docs/AGENTS.md) |
| Architecture/conventions | `docs/AGENTS.md` |

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `Program.cs` | entry | `backend/.../API/Program.cs` | DI, auth (Mock vs JWT `at+jwt`), CORS, middleware order, `--seed` |
| `AppDbContext` | DbContext | `backend/.../Infrastructure/Data` | EF model, `EnsureCreated()` |
| `OidcSyncMiddleware` | middleware | `backend/.../API/Middleware` | auto-creates local `User` on first auth request |
| `MockAuthHandler` | auth scheme | `backend/.../API` | dev auth when `UseMockAuth:true` (returns manager claims) |
| `AdminController` | controller | `backend/.../API/Controllers/AdminController.cs` | ~1130 lines — LARGEST landmine |
| `IUserService`..`IAssessmentService` | interfaces | `backend/.../Application/Interfaces` | 10 domain service contracts |
| `AuthService` | service | `frontend/.../core/services/auth.service.ts` | `hasRole()` (case-insensitive) — use instead of manual compare |
| `LessonPlannerApi` (interface) | token | `frontend/.../core/services/lesson-planner-api.interface.ts` | HTTP + Mock swappable impls |
| `admin.component.ts` | component | `frontend/.../features/admin/admin.component.ts` | ~2375 lines — largest FE file |
| `mock-lesson-planner-api.service.ts` | service | `frontend/.../core/services` | ~1555 lines, in-browser mock API |

## CONVENTIONS (deviations from standard)
- Backend namespace prefix `EducationalPlatform.Nehzat.*`; table prefix `Nehzat_` (e.g. `Nehzat_users`).
- Service interfaces in `Application`, implementations in `Infrastructure` (Clean Architecture dependency inward).
- JSON: `ReferenceHandler.IgnoreCycles`, `UnsafeRelaxedJsonEscaping` (Persian text).
- Frontend API layer is interface-based — swap HTTP/Mock via `environment.ts` `useMockApi` (per docs; confirm current flag name before editing).
- Tokens: access+id in `sessionStorage`, refresh in `localStorage`; 401 → auto-logout.

## ANTI-PATTERNS (THIS PROJECT)
- NEVER add `Microsoft.EntityFrameworkCore.Sqlite` back — backend is SQL Server only (was replaced).
- NEVER return `ex.Message` to client (global handler returns generic Persian error).
- NEVER use bare CSS vars `--gold/--primary/--danger` — use `--lp-*` prefixed.
- NEVER compare roles manually — use `hasRole()`.
- NEVER edit `AdminController.cs` by appending — split into sub-controllers by domain first.
- Token type MUST be `at+jwt` (gateway rejects typed JWT).

## COMMANDS
```bash
# Backend (port 3000 per docs; verify launchSettings)
cd backend && dotnet run            # dev
cd backend && dotnet run --seed     # drop+recreate DB + sample data

# Frontend (port 4200)
cd frontend && npm install
cd frontend && npm start           # ng serve
cd frontend && ng test             # Vitest + jsdom
cd frontend && npm run build:capacitor && npx cap sync android   # mobile
```

## NOTES
- `docs/AGENTS.md` is the authoritative convention bible (auth, DB, test accounts, landmines). This file is the nav/code-map layer.
- `README.md` at root is PARTLY STALE (mentions SQLite / NestJS / Angular 8 / `dummy-token`) — trust `docs/AGENTS.md` and the actual code over it.
- `EnsureCreated()` only — no migrations; schema change needs manual DB drop or `--seed`.
- No process manager: dev servers die with the session, must restart.
- Root `AGENTS.md` (this file) is the canonical agent entry; `docs/AGENTS.md` is the deep-dive.
