# FRONTEND — ADMIN FEATURE — AGENTS.md

Largest, highest-risk frontend module. The admin dashboard component is the single biggest file in the repo.

## OVERVIEW
`features/admin/` is the manager/administrator surface (courses, users, approvals, assignments, statistics). Dominated by one ~2375-line component.

## STRUCTURE
```
features/admin/
├── admin.component.ts        # ~2375 lines — THE landmine
├── admin.component.html
├── admin.component.scss
├── admin.routes.ts           # lazy route def
└── (sub-components as extracted)
```
Adjacent: `features/dashboard/` (OnPush, ~563 lines), `features/shared/assessment-panel/` (~568 lines).

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Admin UI change | `admin.component.ts` — but EXTRACT first, don't append |
| Admin routing | `admin.routes.ts` |
| Shared admin widgets | `features/shared/` (assessment-panel, persian-date-input, role-stub) |

## CONVENTIONS
- OnPush CD strategy (per docs) — inputs immutable, use signals/async pipe.
- Reuses `core/services` and `core/models`; no feature-local API duplication.

## ANTI-PATTERNS
- NEVER append logic to `admin.component.ts` — it is already ~2375 lines. Extract into sub-components/directives/services by domain (users, courses, assignments, stats) before adding.
- This is the #1 maintainability landmine in the repo (docs/AGENTS.md flags it).
