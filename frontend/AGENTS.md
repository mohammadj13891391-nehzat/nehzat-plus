# FRONTEND — AGENTS.md

Angular 21 standalone + Capacitor 8 (Android). ~137 files. 8 lazy role-feature modules + shared.

## OVERVIEW
Standalone-component SPA. Interface-based API layer (HTTP ⇄ Mock swap). OTUH2 password-grant auth. OnPush on admin/dashboard. Vitest + jsdom tests.

## STRUCTURE
```
src/
├── main.ts / config.loader.ts   # bootstrap, runtime /config.json load
├── environments/                # environment.ts (apiUrl, useMockApi)
├── app/
│   ├── core/
│   │   ├── services/            # auth, http/mock lesson-planner API, otuh2 API, notification
│   │   ├── guards/              # auth.guard, admin.guard, role.guard
│   │   ├── interceptors/        # auth interceptor (Bearer)
│   │   └── models/             # lesson-planner.models.ts (~700 lines)
│   └── features/
│       ├── auth/ dashboard/ admin/ coach/ parent/
│       ├── branch-manager/ evaluator/ headquarters/ shared/
└── public/config.json           # runtime apiUrl / otuh2Url override
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Auth/token logic | `core/services/auth.service.ts` (`hasRole()`), `core/guards/` |
| API calls | `core/services/lesson-planner-api.interface.ts` + `http-*` / `mock-*` impls |
| New page | `features/<role>/` (lazy module) |
| API URL resolution | `public/config.json` → `environment.ts` (cascade) |
| Styling | `--lp-*` CSS vars only |

## CONVENTIONS
- API layer is interface-based: `LessonPlannerApi` token swaps `HttpLessonPlannerApiService` / `MockLessonPlannerApiService` via `useMockApi`.
- Tokens: access+id in `sessionStorage`, refresh in `localStorage`; 401 → auto-logout.
- `hasRole()` is case-insensitive — use it, never compare roles manually.
- Routes lazy-loaded per role; `authGuard` supports `returnUrl`, `adminGuard`/`roleGuard('role')` for protection.
- OnPush CD on admin/dashboard components.

## ANTI-PATTERNS
- NEVER use bare CSS vars (`--gold/--primary/--danger`) — `--lp-*` only.
- NEVER compare roles by string — `hasRole()`.
- `admin.component.ts` (~2375 lines) and `mock-lesson-planner-api.service.ts` (~1555 lines) are landmines — extract before growing.

## COMMANDS
```bash
cd frontend && npm start        # ng serve → :4200
cd frontend && ng test          # Vitest + jsdom
cd frontend && npm run build:capacitor && npx cap sync android
```
Build output `dist/frontend/browser`. Prettier + .editorconfig enforced.
