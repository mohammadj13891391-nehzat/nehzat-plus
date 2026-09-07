# Known Issues (pre-existing — NOT caused by recent fixes)

Recorded per user request so these don't get lost. Recent fixes pushed to `main`:
- `911ce09` fix(backend): resolve real user/student in dev signin (trainee `/api/profile` 200)
- `a0dc50c` fix(backend): allow trainee to access only their own student endpoints (fixes 403 on `GET /students/{id}/submissions`)
- `ed087f3` fix(frontend): fix NG0203 by passing explicit destroyRef to takeUntilDestroyed
- `2e87807` fix(backend): allow trainee to access own assessment history (fixes 403 on `GET /assessments/student/{studentId}/course/{courseId}/history`)

## Frontend

### 1. NG0203 — `takeUntilDestroyed()` outside injection context — RESOLVED
- Location: `frontend/src/app/features/dashboard/dashboard.component.ts` → `loadBiweeklyProgress` (called from `selectCourse`).
- **Fixed**: `.pipe(takeUntilDestroyed())` → `.pipe(takeUntilDestroyed(this.destroyRef))`. `takeUntilDestroyed()` with no argument grabs `DestroyRef` from the injection context, but `loadBiweeklyProgress` runs outside it (plain method via subscribe callback). Verified: NG0203 no longer appears in the console after trainee login.

### 2. 404s (endpoints/assets not implemented or missing)
- `GET /assets/nehzat.png` — missing image asset.
- `GET /api/quran/dashboard/stats` — endpoint not implemented.
- `GET /daily-nudges` — endpoint not implemented.

### 3. Trainee 403 on assessment history — RESOLVED
- `GET /assessments/student/1/course/1/history` → 403 for trainee. 
- **Fixed**: `AssessmentController` class-level `[Authorize(Roles="manager,headquarters,branch_manager,coach,evaluator")]` → `[Authorize]`; added `StaffRoles`/`IsStaff()`/`CanAccessStudent()`; staff-only `[Authorize(Roles=...)]` on Create/GetAll/GetById/Update/Delete/GetByCourse/GetByCourseAndDateRange/GetByStatus/GenerateWeekly/GetQuestions/CreateQuestion/UpdateQuestion/DeleteQuestion/Archive/GetResults/GetAnalytics; `CanAccessStudent` guards on SubmitResult/StartAssessment/GetResultsByStudent/GetStudentHistory. Verified: `GET /assessments/student/1/course/1/history` returns 200 for trainee.

### 4. Admin-widget errors on dashboard (pre-existing)
- `403` on `/admin/students` and `/admin/branch-managers`, and `TypeError: data.coaches.filter is not a function`. These appear in the trainee dashboard console; investigation needed to determine which widget fetches admin data on the trainee view.

## Untracked-in-worktree (not ours, do not stage)

### 3. Admin-nav refactor TS2339 `activeMenu`
- Working tree has an uncommitted admin-nav refactor (`admin.component.*`, `admin-navigation.component.*`, `admin/services/`, `test-results/.last-run.json`) with TS2339 `activeMenu` error at `admin.component.html:52`.
- NOT part of this work; left untouched and never staged.
