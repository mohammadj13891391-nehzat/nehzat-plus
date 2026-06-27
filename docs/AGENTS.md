# AGENTS.md — Nehzat Plus (Lesson Planner)

Two sub-projects: `backend/` (ASP.NET Core 8) and `frontend/` (Angular 21).

---

## @backend/ (ASP.NET Core 8 + EF Core + SQLite)

Same API surface as the original NestJS version. Same SQLite database, same auto-seed on startup.

### Commands
```bash
cd backend/LessonPlanner.Api
dotnet run          # dev server on port 5253
dotnet build        # compile
dotnet test         # (no tests yet)
```

### Startup (automatic)
- SQLite DB `lesson-planner.db` created with `EnsureCreated()` (tables recreated each startup)
- Default admin user: `test` / `password` (userType: `admin`)
- Sample data auto-seeded: 3 students + linked users, 2 courses, 36 daily assignments per course, attachments for day 1, sample submissions
- CORS is wide open (`AllowAnyOrigin`)
- Static files served from `public/` directory

### Key differences from NestJS version
- Uses `[FromForm]` for auth signin (to support both JSON and multipart like the original `FileInterceptor` pattern)
- File uploads use `IFormFile` parameters instead of Multer
- `Guid.NewGuid():N` (32 hex chars) for random filenames instead of 32-char random hex
- Same API routes, same entity names, same behavior for all endpoints
- BCrypt.Net-Next 4.0.3 for password hashing

### Project structure
```
backend/
└── LessonPlanner.Api/
    ├── Models/          # EF Core entities (same 7 tables)
    ├── Data/            # AppDbContext
    ├── DTOs/            # Request/response records
    ├── Services/        # Service interfaces + implementations
    ├── Controllers/     # 5 controllers (auth, student, course, admin, seeder)
    └── Seeders/         # Sample data seeder
```

### Architecture notes
- Circular UserService ↔ StudentService resolved with interface-based DI (no `forwardRef` needed)
- `SensitiveDataLogging` enabled for dev (matches NestJS `logging: true`)
- No auth middleware (matches the no-op `AuthGuard` in NestJS)

### Test accounts
| Type    | Username         | Password     |
|---------|------------------|--------------|
| student | ali.ahmadi       | password123  |
| student | fateme.mohammadi | password123  |
| student | mohammad.rezaei  | password123  |
| admin   | test             | password     |

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

### Project structure
- Standalone components, `app.ts` class-based (not `AppComponent`)
- `app.config.ts` bootstraps with `provideRouter`, `provideHttpClient` (functional interceptor), `APP_INITIALIZER`
- Lazy-loaded feature routes: `auth` (login, register), `dashboard` (student), `admin` (dashboard, users, courses, assignments)
- Guards: `authGuard` (checks localStorage token), `adminGuard` (checks userType)

### API layer (interface-based DI)
- `LESSON_PLANNER_API` injection token switches between `HttpLessonPlannerApi` (real HTTP) and `MockLessonPlannerApi` (in-memory)
- Selected via `environment.useMockApi` in `lesson-planner-api.token.ts`
- `HttpLessonPlannerApi` — `HttpClient`-based implementation
- `MockLessonPlannerApi` — in-memory store + `delay(300)`, supports full CRUD

### Config loader
- `config.loader.ts` fetches `config.json` at app bootstrap via `APP_INITIALIZER`
- Sets `window.__apiBase` dynamically — no hardcoded localhost
- Falls back gracefully if `config.json` is missing

### Services
- `AuthService` — login/register/logout, localStorage-based session (`token`, `current-user`)
- `LessonPlannerApi` interface — full CRUD matching backend endpoints

### Key quirks
- Auth is localStorage-based: stores `dummy-token` and `CurrentUser` JSON (no real JWT)
- `AuthService.signin()` posts to `api.signin()` then stores `'dummy-token'`
- `AuthService.register()` posts to `api.signup()`
- Functional interceptor (`auth.interceptor.ts`) attaches `Authorization: Bearer <token>` header

### Styling
- Custom SCSS with CSS custom properties (`--lp-*`) — no Bootstrap dependency
- Vazirmatn Persian font via `font-family` in `styles.scss`
- RTL layout (`direction: rtl` on shell containers)
- Responsive via CSS Grid + auto-fit

### Mobile support
- Capacitor 8 with Android support (`@capacitor/android`)
- `capacitor.config.ts`: app ID `com.nsafari.lessonplanner`, webDir `dist/frontend/browser`

### Testing
- **Vitest** with `jsdom` (not Karma/Jasmine)
- Test runner: `ng test` via `@angular/build:unit-test` (Vitest)

### TypeScript config
- Frontend: strict mode on, target ES2022
- Backend: nullable enabled, `ImplicitUsings` enabled
