# Known Issues (pre-existing — NOT caused by recent fixes)

Recorded per user request so these don't get lost. Recent fixes pushed to `main`:
- `911ce09` fix(backend): resolve real user/student in dev signin (trainee `/api/profile` 200)
- `a0dc50c` fix(backend): allow trainee to access only their own student endpoints (fixes 403 on `GET /students/{id}/submissions`)

## Frontend

### 1. NG0203 — `takeUntilDestroyed()` outside injection context
- Location: `frontend/src/app/features/dashboard/dashboard.component.ts` → `loadBiweeklyProgress` (called from `selectCourse`).
- Error: `NG0203 takeUntilDestroyed() can only be used within an injection context`.
- Likely cause: calling `signal()`/`computed()` or `takeUntilDestroyed` outside an injection context. Confirm the call site of `loadBiweeklyProgress` and whether it runs outside injection context.

### 2. 404s (endpoints/assets not implemented or missing)
- `GET /assets/nehzat.png` — missing image asset.
- `GET /api/quran/dashboard/stats` — endpoint not implemented.
- `GET /daily-nudges` — endpoint not implemented.

## Untracked-in-worktree (not ours, do not stage)

### 3. Admin-nav refactor TS2339 `activeMenu`
- Working tree has an uncommitted admin-nav refactor (`admin.component.*`, `admin-navigation.component.*`, `admin/services/`, `test-results/.last-run.json`) with TS2339 `activeMenu` error at `admin.component.html:52`.
- NOT part of this work; left untouched and never staged.
