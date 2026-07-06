# AGENTS.md — Nehzat Plus (Lesson Planner)

Two sub-projects: `backend/` (ASP.NET Core 10, Clean Architecture) and `frontend/` (Angular 21).

---

## @backend/ (ASP.NET Core 10 + EF Core + SQLite — Clean Architecture)

### Commands
```bash
cd backend/src/EducationalPlatform.Nehzat.API
dotnet run            # dev server on port 3000 (see launchSettings.json)
dotnet run --urls http://localhost:3000
dotnet build          # compile (root: EducationalPlatform.Nehzat.slnx)
dotnet test           # (no tests yet)
```

### Startup (automatic)
- SQLite DB `lesson-planner.db` created with `EnsureCreated()`
- Default manager user: `test` / `password` (userType: `manager`)
- Default branch: شعبه مرکزی / تهران
- Sample data auto-seeded if tables are empty
- CORS restricted to `http://localhost:4200` and `http://localhost:3000`
- Static files served from `public/` directory
- `EnsureDeleted()` only runs when `--seed` flag is passed

### Authentication & Authorization
- JWT authentication via `Microsoft.AspNetCore.Authentication.JwtBearer` (production)
- Mock auth via `MockAuthHandler` (development, controlled by `UseMockAuth: true` in `appsettings.Development.json`)
- Symmetric key from `appsettings.json` → `Jwt.Key`
- Token lifetime: 7 days (`Jwt.ExpireDays`)
- Claims: `sub` (username), `userId`, `ClaimTypes.Role` (maps to Microsoft role claim URI)
- `[Authorize]` applied to all controllers except `AuthController`
- Role policies:
  - `AdminOnly`: admin, manager, headquarters
  - `AllRoles`: admin, manager, headquarters, branch_manager, coach, parent, evaluator, trainee

### Supported Roles
`manager`, `headquarters`, `branch_manager`, `coach`, `parent`, `evaluator`, `trainee`, `admin` (legacy, migrated to `manager` on startup)

### Project structure — Clean Architecture (4 layers)
```
backend/
├── EducationalPlatform.Nehzat.slnx
└── src/
    ├── EducationalPlatform.Nehzat.Domain/          # Pure entities, no dependencies
    │   └── Entities/               # 15 entity classes (EF Core, [Table("Nehzat_*")])
    ├── EducationalPlatform.Nehzat.Application/     # DTOs + service interfaces
    │   ├── DTOs/                   # Request/response records
    │   └── Interfaces/             # IXxxService interfaces
    ├── EducationalPlatform.Nehzat.Infrastructure/  # EF Core, services, seeders
    │   ├── Data/AppDbContext.cs    # DbContext (SQLite)
    │   ├── Services/               # Service implementations
    │   └── Seeders/                # Sample data seeder
    └── EducationalPlatform.Nehzat.API/             # Controllers, auth, config
        ├── Controllers/            # Auth, Admin, Student, Course, Assessment, Seeder
        ├── Middleware/             # MockAuthHandler (dev only)
        ├── Helpers/                # FileUploadValidator
        ├── Program.cs              # DI, middleware, DB init, mock auth switch
        ├── appsettings.json
        └── appsettings.Development.json
```

### Architecture notes
- **Clean Architecture**: Domain → Application → Infrastructure → API (dependency flows inward)
- **Database schema prefix**: All table names use `Nehzat_` prefix (e.g., `Nehzat_users`, `Nehzat_courses`) for future multi-service isolation
- **Mock Auth**: Development mode uses `MockAuthHandler` when `UseMockAuth: true`; production uses real JWT Bearer
- Circular UserService ↔ StudentService resolved with interface-based DI
- `SensitiveDataLogging` enabled for dev
- BCrypt work factor: 12
- File upload validation: max 10MB, extension allowlist, magic byte checks
- Transactions used for multi-step operations (create/delete user+student)
- Error messages sanitized — `ex.Message` never returned to client

---

## @frontend/ (Angular 21 standalone + Capacitor)

### Commands
```bash
npm start             # ng serve on port 4200
npm run build         # production build to dist/frontend/browser
npm run build:capacitor  # build with capacitor baseHref
npm test              # Vitest unit tests
npx cap sync android  # sync Capacitor Android
npx cap open android  # open in Android Studio
```

### API URL resolution
1. `config.json` loaded at bootstrap from `/config.json` (source: `public/config.json`)
2. Falls back to `environment.ts` → `apiUrl`
3. Current dev value: `http://localhost:3000`

### Authentication
- `AuthService` stores JWT token + decoded payload in `localStorage`
- Token expiry checked via `exp` claim
- Functional interceptor attaches `Authorization: Bearer <token>` header
- 401 responses trigger auto-logout
- `authGuard` checks `isAuthenticated()`
- `adminGuard` allows `manager`, `headquarters`, `branch_manager`
- `roleGuard('role')` restricts specific role routes
- Development mode supports `useMockAuth: true` in `environment.ts`

### Project structure
- Standalone components, `app.ts` class-based
- `app.config.ts` bootstraps with `provideRouter`, `provideHttpClient`, `APP_INITIALIZER`
- Lazy-loaded feature routes: `auth`, `dashboard`, `admin`, `coach`, `parent`, `branch-manager`, `evaluator`, `headquarters`
- Shared `RoleStubComponent` used for coach/parent/evaluator/headquarters/branch-manager placeholder pages
- API layer uses `LESSON_PLANNER_API` token; `HttpLessonPlannerApi` is the real HTTP implementation

### Styling
- Custom SCSS with CSS custom properties prefixed `--lp-*`
- Font: `myNeirizi`, with `Vazirmatn` fallback
- RTL layout (`direction: rtl` on shell containers)
- Responsive via CSS Grid + auto-fit
- **Critical**: never use bare `--gold`, `--danger`, `--primary`, etc. Always use `--lp-gold`, `--lp-danger`, `--lp-primary`.

### Components & lifecycle
- `ChangeDetectionStrategy.OnPush` on admin and dashboard components
- All subscriptions use `takeUntilDestroyed`

### Mobile support
- Capacitor 8 with Android support (`@capacitor/android`)
- `capacitor.config.ts`: app ID `com.nsafari.lessonplanner`, webDir `dist/frontend/browser`

### Testing
- **Vitest** with `jsdom` (not Karma/Jasmine)
- Test runner: `ng test` via `@angular/build:unit-test` (Vitest)

### TypeScript config
- Frontend: strict mode on, target ES2022
- Backend: nullable enabled, `ImplicitUsings` enabled

---

## Test accounts

| Type    | Username         | Password     |
|---------|------------------|--------------|
| manager | test             | password     |
| student | ali.ahmadi       | password123  |
| student | fateme.mohammadi | password123  |
| student | mohammad.rezaei  | password123  |

> Note: backend seeds `test` as `manager`. To test admin-specific flows, sign in as `test`.

---

## Recent significant changes

- **Clean Architecture restructuring**: Backend split into 4 layers (Domain, Application, Infrastructure, API)
- **.NET 10 upgrade**: All projects target .NET 10
- **Mock auth**: `MockAuthHandler` for development mode (switched via `UseMockAuth: true`)
- **Database schema prefix**: All tables prefixed with `Nehzat_` (e.g., `Nehzat_users`)
- **Solution renamed**: `EducationalPlatform.Nehzat.slnx`
- Real JWT authentication implemented in backend + frontend
- `[Authorize(Roles)]` added to all non-auth controllers
- CORS restricted from `AllowAnyOrigin` to localhost origins
- `EnsureDeleted()` removed from normal startup (now behind `--seed`)
- Frontend `AuthService` rewritten to decode + validate JWT
- 5 identical stub components merged into `RoleStubComponent`
- All subscriptions migrated to `takeUntilDestroyed`
- CSS custom properties normalized to `--lp-*` prefix across admin and dashboard SCSS
- Backend/frontend ports aligned to 3000/4200

---

## Known issues

- **Process persistence**: Backend and frontend dev servers are started via `cmd.exe` minimized windows. They die when tool sessions end and must be restarted manually. There is no persistent daemon or process manager in this environment.
- **AdminController is large**: `AdminController.cs` is a single large controller. Future work should split it into sub-controllers (`BranchesController`, `CoachesController`, etc.).
- **CSV-line style columns**: Some tables still store comma-separated IDs (e.g., `Parent.StudentIds`). Future work should migrate these to junction tables.
- **Default branch**: The system seeds one default branch. Multi-branch workflows are partially implemented.

---

## Relevant files

### Backend
- `backend/src/EducationalPlatform.Nehzat.API/Program.cs` — middleware, JWT, CORS, DB init, mock auth switch
- `backend/src/EducationalPlatform.Nehzat.Infrastructure/Services/UserService.cs` — `GenerateJwtToken`, BCrypt
- `backend/src/EducationalPlatform.Nehzat.API/Controllers/AuthController.cs` — signin/signup
- `backend/src/EducationalPlatform.Nehzat.API/Controllers/AdminController.cs` — admin APIs (large)
- `backend/src/EducationalPlatform.Nehzat.API/Helpers/FileUploadValidator.cs`
- `backend/src/EducationalPlatform.Nehzat.API/appsettings.json` — JWT config + connection string
- `backend/src/EducationalPlatform.Nehzat.API/Middleware/MockAuthHandler.cs` — mock auth (dev mode)

### Frontend
- `frontend/src/app/core/services/auth.service.ts` — JWT decode, session
- `frontend/src/app/core/interceptors/auth.interceptor.ts` — Bearer token + 401
- `frontend/src/app/core/guards/` — auth, admin, role guards
- `frontend/src/app/features/admin/admin.component.ts` — main admin panel
- `frontend/src/app/features/shared/role-stub/role-stub.component.ts`
- `frontend/src/styles.scss` — CSS custom properties
- `frontend/src/environments/environment.ts` — fallback API URL
- `frontend/public/config.json` — runtime API URL
