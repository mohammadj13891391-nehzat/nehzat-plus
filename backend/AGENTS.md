# BACKEND — AGENTS.md

ASP.NET Core 10 + EF Core + SQL Server. Clean Architecture: `Domain → Application → Infrastructure → API` (dependencies flow inward).

## OVERVIEW
Monolithic Web API. 4 csproj layers under `src/`. OTUH2 OIDC auth (Mock in dev). 10 domain services, 6 controllers.

## STRUCTURE
```
src/EducationalPlatform.Nehzat.API/
├── Program.cs              # entry: DI, auth scheme, CORS, middleware order, --seed
├── Controllers/            # Auth, Student, Course, Admin, Assessment, Seeder
└── Middleware/             # OidcSyncMiddleware
src/EducationalPlatform.Nehzat.Application/
├── DTOs/                   # one file per domain (AdminDtos, CourseDtos, ...)
└── Interfaces/             # I*Service contracts (10)
src/EducationalPlatform.Nehzat.Infrastructure/
├── Data/                   # AppDbContext
├── Services/               # I*Service implementations (10)
├── Seeders/                # SampleDataSeeder, Otuh2RoleSeeder
└── Clients/                # Refit IOtuh2AuthClient
src/EducationalPlatform.Nehzat.Domain/
└── Entities/               # 15 entities (User, Student, Course, Assignment, ...)
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| New endpoint | `API/Controllers/` — split by domain, do NOT grow `AdminController.cs` |
| Business logic | `Infrastructure/Services/` + interface in `Application/Interfaces` |
| New entity | `Domain/Entities/` + register in `Infrastructure/Data/AppDbContext` |
| DTO in/out | `Application/DTOs/` |
| Auth config | `Program.cs` (lines 26-63) + `appsettings*.json` (`UseMockAuth`, `Oidc`, `Otuh2Client`) |
| Seeding | `Infrastructure/Seeders/` |

## CONVENTIONS
- Entity tables use `Nehzat_` prefix (`Nehzat_users`, `Nehzat_courses`...).
- `User.OidcSubject` replaces old `PasswordHash` — no local passwords.
- JSON serialization: `IgnoreCycles` + `UnsafeRelaxedJsonEscaping` (Persian).
- Service registration is explicit per-interface in `Program.cs` (scoped).
- `Otuh2RoleSeeder` runs non-blocking on startup; failure is logged, not fatal.
- Auth is **redirect-based OIDC** (frontend redirects to OTUH2 `/auth/login`, tokens returned to `/auth/callback`). Backend only validates `at+jwt` via JWKS + syncs users in `OidcSyncMiddleware`. No credential handling here.
- Service-to-service client (confidential): `ClientId=nehzat-plus` (from `Otuh2Client` config). SPA client: `otuh2-spa-client` (password/refresh for signup path).

## ANTI-PATTERNS
- NEVER add EF Core Sqlite package — SQL Server only.
- NEVER return `ex.Message` to client.
- JWT `ValidTypes` MUST stay `["at+jwt"]`.
- Claims: `sub`=username, `userId`=id, `role` (NOT `ClaimTypes.Role`).
- `AdminController.cs` (~1130 lines) is a landmine — split before extending.

## COMMANDS
```bash
cd backend && dotnet run            # http://localhost:3000
cd backend && dotnet run --seed     # reset + reseed DB
```
Dev DB `LessonPlanner_Dev` (appsettings.Development.json). `EnsureCreated()` only — no migrations.
