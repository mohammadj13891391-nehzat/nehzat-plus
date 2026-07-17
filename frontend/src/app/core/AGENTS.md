# FRONTEND CORE — AGENTS.md

Cross-cutting Angular services, guards, interceptors, models. The shared spine every feature module depends on.

## OVERVIEW
`src/app/core/` holds auth, the HTTP⇄Mock API abstraction, route guards, the auth interceptor, and the central models file. Edit here only for cross-feature concerns.

## STRUCTURE
```
core/
├── services/
│   ├── auth.service.ts                 # AuthService: login, hasRole(), token storage
│   ├── lesson-planner-api.interface.ts # LessonPlannerApi token + interface
│   ├── http-lesson-planner-api.service.ts   # real HTTP impl (~512 lines)
│   ├── mock-lesson-planner-api.service.ts   # in-browser mock (~1555 lines) — LANDMINE
│   ├── http-otuh2-api.service.ts / otuh2-api.interface.ts / otuh2-api.token.ts
│   ├── api-url.util.ts                 # /config.json → environment cascade
│   └── notification.service.ts
├── guards/   auth.guard.ts  admin.guard.ts  role.guard.ts
├── interceptors/  (Bearer injection)
└── models/   lesson-planner.models.ts  (~700 lines — central types)
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Login / role checks | `auth.service.ts` (`hasRole()`) |
| Add API method | `lesson-planner-api.interface.ts` + BOTH http & mock impls |
| Change token storage | `auth.service.ts` (sessionStorage access/id, localStorage refresh) |
| Route protection | `guards/` |
| Shared TS types | `models/lesson-planner.models.ts` |

## CONVENTIONS
- API methods MUST be added to the interface AND both `http-*` and `mock-*` implementations to stay in sync.
- `api-url.util.ts` resolves URL: runtime `/config.json` → `environment.ts` (apiUrl/otuh2Url).
- Auth interceptor attaches Bearer from sessionStorage.

## ANTI-PATTERNS
- NEVER add an API method to only one impl — both http and mock must match the interface.
- NEVER read roles by string — `hasRole()`.
- `mock-lesson-planner-api.service.ts` is ~1555 lines; extract helpers before extending.
