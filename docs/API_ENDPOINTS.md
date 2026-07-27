# Lesson Planner API Documentation

## Base URL
`http://localhost:3000` (Development)

## Authentication
All endpoints (except `/auth/*` and `/seeder/*`) require authentication. Include the auth token in the request headers:
```
Authorization: Bearer <token>
```
Token type: `at+jwt` (access token + ID token in sessionStorage, refresh token in localStorage)

---

## Controllers & Endpoints

### 1. Auth Controller (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user (requires admin approval) |
| POST | `/auth/signin` | Login (handled via OTUH2 redirect - see below) |

**Auth Flow (OTUH2 OIDC - Redirect Based):**
1. Frontend redirects to `https://api.nehzat128.ir/oauth/auth/login?client_id=otuh2-spa-client&redirect_uri=...&response_type=code&scope=openid profile roles`
2. User logs in on OTUH2 hosted page
3. OTUH2 redirects back to `/auth/callback?code=...`
4. Frontend exchanges code for tokens at OTUH2 token endpoint
5. Tokens stored: access+id in `sessionStorage`, refresh in `localStorage`

---

### 2. Seeder Controller (`/seeder`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/seeder/seed` | Reset and reseed database with sample data |

---

### 3. User Management (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/pending` | Get users pending approval |
| POST | `/users/{userId}/approve` | Approve user and create student profile |
| POST | `/users/{userId}/reject` | Reject pending user |
| POST | `/users` | Create new user (admin) |

**Approve Body:**
```json
{
  "firstName": "نام",
  "lastName": "نام خانوادگی",
  "email": "user@example.com",
  "phoneNumber": "09123456789",
  "studentId": "ST004",
  "courseIds": [1, 2]
}
```

---

### 4. Student Controller (`/students`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/active` | Get active students |
| GET | `/students/{id}` | Get student by ID |
| POST | `/students/findByEmail_Phone` | Find student by email or phone |
| GET | `/students/me/profile` | Get current student profile (from auth token) |
| GET | `/students/{id}/progress` | Get student progress (courses + submissions) |
| GET | `/students/{id}/progress/biweekly` | Get biweekly progress |
| GET | `/students/{id}/assignments/{assignmentId}/progress` | Get progress for specific assignment |
| GET | `/students/{id}/submissions` | List submissions (optional `?assignmentId=` filter) |
| POST | `/students/{id}/assignments/{assignmentId}/submit` | Submit daily work (multipart form-data with file) |
| POST | `/students/{id}/submissions/{submissionId}/upload` | Upload file for existing submission |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Delete student |

---

### 5. Course Controller (`/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Get all courses |
| GET | `/courses/active` | Get active courses |
| GET | `/courses/{id}` | Get course by ID |
| GET | `/courses/{id}/assignments` | Get course assignments (daily), ordered by date, includes attachments |
| POST | `/courses` | Create new course |
| POST | `/courses/{id}/assignments` | Create a daily assignment |
| PUT | `/courses/{id}` | Update course |
| DELETE | `/courses/{id}` | Delete course |

---

### 6. Admin Branches (`/admin/branches`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/branches` | Get all branches |
| POST | `/admin/branches` | Create branch |
| PUT | `/admin/branches/{id}` | Update branch |
| DELETE | `/admin/branches/{id}` | Delete branch |

---

### 7. Admin Branch Managers (`/admin/branch-managers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/branch-managers` | Get all branch managers (paginated, filterable) |
| GET | `/admin/branch-managers/{id}` | Get branch manager by ID |
| POST | `/admin/branch-managers` | Create branch manager |
| PUT | `/admin/branch-managers/{id}` | Update branch manager |
| DELETE | `/admin/branch-managers/{id}` | Delete branch manager |

---

### 8. Admin Coaches (`/admin/coaches`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/coaches` | Get all coaches (paginated, filterable) |
| GET | `/admin/coaches/{id}` | Get coach by ID |
| POST | `/admin/coaches` | Create coach |
| PUT | `/admin/coaches/{id}` | Update coach |
| DELETE | `/admin/coaches/{id}` | Delete coach |

---

### 8. Admin Courses (`/admin/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/courses` | Get all courses (admin view) |
| GET | `/admin/courses/search?q={query}` | Search courses |
| GET | `/admin/courses/filter?status={status}` | Filter courses by status |
| GET | `/admin/courses/{id}` | Get course by ID |
| POST | `/admin/courses` | Create course |
| PUT | `/admin/courses/{id}` | Update course |
| DELETE | `/admin/courses/{id}` | Delete course |
| GET | `/admin/courses/{courseId}/assignments` | Get course assignments |
| GET | `/admin/courses/assignments/{id}` | Get assignment by ID |
| POST | `/admin/courses/{courseId}/assignments` | Create assignment for course |
| PUT | `/admin/courses/assignments/{id}` | Update assignment |
| DELETE | `/admin/courses/assignments/{id}` | Delete assignment |
| POST | `/admin/courses/{courseId}/assignments/daily-series` | Create daily assignment series |
| GET | `/admin/courses/{courseId}/statistics` | Get course statistics |

---

### 9. Admin Assignments & Attachments (`/admin/assignments`, `/admin/attachments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/assignments/{assignmentId}/attachments` | Get assignment attachments |
| POST | `/admin/assignments/{assignmentId}/attachments` | Create attachment (with file upload) |
| POST | `/admin/attachments/{id}/upload` | Upload file for existing attachment |
| PUT | `/admin/attachments/{id}` | Update attachment |
| DELETE | `/admin/attachments/{id}` | Delete attachment |

---

### 10. Admin Evaluators (`/admin/evaluators`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/evaluators` | Get all evaluators |
| GET | `/admin/evaluators/{id}` | Get evaluator by ID |
| POST | `/admin/evaluators` | Create evaluator |
| PUT | `/admin/evaluators/{id}` | Update evaluator |
| DELETE | `/admin/evaluators/{id}` | Delete evaluator |

---

### 11. Admin Parents (`/admin/parents`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/parents` | Get all parents |
| GET | `/admin/parents/{id}` | Get parent by ID |
| POST | `/admin/parents` | Create parent |
| PUT | `/admin/parents/{id}` | Update parent |
| DELETE | `/admin/parents/{id}` | Delete parent |
| GET | `/admin/parents/{id}/students` | Get parent's students |

---

### 12. Admin Statistics (`/admin/statistics`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/statistics` | Get system-wide statistics |

---

### 13. Admin Students (`/admin/students`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/students` | Get all students (admin view) |
| GET | `/admin/students/{id}` | Get student by ID |
| POST | `/admin/students` | Create student |
| PUT | `/admin/students/{id}` | Update student |
| DELETE | `/admin/students/{id}` | Delete student |

---

### 14. Assessment Controller (`/assessments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/assessments` | Create assessment |
| GET | `/assessments` | Get all assessments |
| GET | `/assessments/{id}` | Get assessment by ID |
| PUT | `/assessments/{id}` | Update assessment |
| DELETE | `/assessments/{id}` | Delete assessment |
| GET | `/assessments/course/{courseId}` | Get assessments by course |
| GET | `/assessments/course/{courseId}/date-range` | Get assessments by date range |
| GET | `/assessments/status/{status}` | Get assessments by status |
| POST | `/assessments/generate-weekly` | Generate weekly assessment |
| GET | `/assessments/{id}/questions` | Get assessment questions |
| POST | `/assessments/{id}/questions` | Add question to assessment |
| PUT | `/assessments/questions/{questionId}` | Update question |
| DELETE | `/assessments/questions/{questionId}` | Delete question |
| POST | `/assessments/{id}/submit` | Submit assessment |
| POST | `/assessments/{id}/archive` | Archive assessment |
| POST | `/assessments/{id}/start/{studentId}` | Start assessment for student |
| GET | `/assessments/{id}/results` | Get assessment results |
| GET | `/assessments/student/{studentId}/results` | Get student's assessment results |
| GET | `/assessments/{id}/analytics` | Get assessment analytics |
| GET | `/assessments/student/{studentId}/course/{courseId}/history` | Get student assessment history |

---

### 15. Competitions (`/competitions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/competitions` | Get all competitions |
| GET | `/competitions/active` | Get active competitions |
| GET | `/competitions/{id}` | Get competition by ID |
| POST | `/competitions` | Create competition |
| PUT | `/competitions/{id}` | Update competition |
| DELETE | `/competitions/{id}` | Delete competition |
| POST | `/competitions/{id}/participants` | Register participant |
| DELETE | `/competitions/{id}/participants/{studentId}` | Remove participant |
| PUT | `/competitions/{id}/participants/{studentId}/score` | Update participant score |
| GET | `/competitions/{id}/results` | Get competition results |

---

### 16. Leagues (`/leagues`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leagues` | Get all leagues |
| GET | `/leagues/active` | Get active leagues |
| GET | `/leagues/{id}` | Get league by ID |
| POST | `/leagues` | Create league |
| PUT | `/leagues/{id}` | Update league |
| DELETE | `/leagues/{id}` | Delete league |
| GET | `/leagues/{id}/rankings` | Get league rankings |
| PUT | `/leagues/{id}/rankings` | Update league ranking |

---

### 17. Madrasah Controller (`/madrasahs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/madrasahs` | Get all madrasahs |
| GET | `/madrasahs/{id}` | Get madrasah by ID |
| POST | `/madrasahs` | Create madrasah |
| PUT | `/madrasahs/{id}` | Update madrasah |
| DELETE | `/madrasahs/{id}` | Delete madrasah |
| GET | `/madrasahs/{id}/branches` | Get madrasah branches |
| POST | `/madrasahs/{id}/branches` | Create branch for madrasah |
| DELETE | `/madrasahs/{id}/branches/{branchId}` | Delete branch from madrasah |

---

### 18. Curriculum Controller (`/curriculum`)

#### Subject Areas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/curriculum/subject-areas` | Get all subject areas |
| GET | `/curriculum/subject-areas/{id}` | Get subject area by ID |
| POST | `/curriculum/subject-areas` | Create subject area |
| PUT | `/curriculum/subject-areas/{id}` | Update subject area |
| DELETE | `/curriculum/subject-areas/{id}` | Delete subject area |

#### Teaching Methods
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/curriculum/teaching-methods` | Get all teaching methods |
| GET | `/curriculum/teaching-methods/{id}` | Get teaching method by ID |
| POST | `/curriculum/teaching-methods` | Create teaching method |
| PUT | `/curriculum/teaching-methods/{id}` | Update teaching method |
| DELETE | `/curriculum/teaching-methods/{id}` | Delete teaching method |

#### Curriculum Objectives
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/curriculum/objectives` | Get all objectives |
| GET | `/curriculum/objectives/{id}` | Get objective by ID |
| POST | `/curriculum/objectives` | Create objective |
| PUT | `/curriculum/objectives/{id}` | Update objective |
| DELETE | `/curriculum/objectives/{id}` | Delete objective |

#### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/curriculum/books` | Get all books |
| GET | `/curriculum/books/{id}` | Get book by ID |
| POST | `/curriculum/books` | Create book |
| PUT | `/curriculum/books/{id}` | Update book |
| DELETE | `/curriculum/books/{id}` | Delete book |

---

### 19. Curriculum Version Controller (`/curriculum-versions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/curriculum-versions` | Get all versions |
| GET | `/curriculum-versions/{id}` | Get version by ID |
| GET | `/curriculum-versions/active` | Get active version |
| POST | `/curriculum-versions` | Create version |
| PUT | `/curriculum-versions/{id}` | Update version |
| DELETE | `/curriculum-versions/{id}` | Delete version |

---

### 20. Issue/Survey Controller (`/issues`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/issues` | Create issue survey |
| GET | `/issues` | Get all issue surveys |
| GET | `/issues/{id}` | Get issue by ID |
| PUT | `/issues/{id}` | Update issue |
| DELETE | `/issues/{id}` | Delete issue |
| POST | `/issues/{id}/publish` | Publish issue |
| POST | `/issues/{id}/close` | Close issue |
| POST | `/issues/{id}/duplicate` | Duplicate issue |
| GET | `/issues/{id}/questions` | Get issue questions |
| POST | `/issues/{id}/questions` | Add question |
| PUT | `/issues/{id}/questions/{qid}` | Update question |
| DELETE | `/issues/{id}/questions/{qid}` | Delete question |
| POST | `/issues/{id}/questions/reorder` | Reorder questions |
| GET | `/issues/{id}/respond` | Get response form |
| POST | `/issues/{id}/respond` | Submit response |
| GET | `/issues/{id}/analytics` | Get analytics |
| GET | `/issues/{id}/analytics/categories` | Get category analytics |
| GET | `/issues/{id}/analytics/trends` | Get trend analytics |
| GET | `/issues/{id}/export/json` | Export as JSON |
| GET | `/issues/{id}/comments` | Get comments |
| POST | `/issues/{id}/comments` | Add comment |
| GET | `/issues/{id}/actions` | Get actions |
| POST | `/issues/{id}/actions` | Create action |

#### Issue Item Pool
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/issues/pool` | Get all pool items |
| POST | `/issues/pool` | Create pool item |
| POST | `/issues/pool/{poolItemId}/use-in-survey` | Use in survey |

#### Issue Actions
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/issues/actions/{id}` | Update action |
| PATCH | `/issues/actions/{id}/status` | Update action status |
| GET | `/issues/actions/summary` | Get action summary |

---

### 21. Monthly Booklet Controller (`/monthly-booklets`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/monthly-booklets` | Get all booklets |
| GET | `/monthly-booklets/{id}` | Get booklet by ID |
| GET | `/monthly-booklets/by-student/{studentId}` | Get booklets by student |
| GET | `/monthly-booklets/by-student/{studentId}/{year}/{month}` | Get specific month |
| POST | `/monthly-booklets` | Create booklet |
| PUT | `/monthly-booklets/{id}` | Update booklet |
| DELETE | `/monthly-booklets/{id}` | Delete booklet |

---

### 22. Progression Controller (`/progression`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/progression/check/{studentId}` | Check progression eligibility |
| GET | `/progression/check-ring/{ringId}` | Check ring progression |
| POST | `/progression/record` | Record progression |

---

### 23. Quran Controller (`/quran`)

#### Surahs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/surahs` | Get all surahs |
| GET | `/quran/surahs/{id}` | Get surah by ID |
| POST | `/quran/surahs` | Create surah |
| PUT | `/quran/surahs/{id}` | Update surah |
| DELETE | `/quran/surahs/{id}` | Delete surah |

#### Ayahs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/ayahs` | Get all ayahs |
| GET | `/quran/ayahs/surah/{surahId}` | Get ayahs by surah |
| GET | `/quran/ayahs/{id}` | Get ayah by ID |
| POST | `/quran/ayahs` | Create ayah |
| PUT | `/quran/ayahs/{id}` | Update ayah |
| DELETE | `/quran/ayahs/{id}` | Delete ayah |

#### Tajweed Rules
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/tajweed-rules` | Get all tajweed rules |
| GET | `/quran/tajweed-rules/{id}` | Get rule by ID |
| POST | `/quran/tajweed-rules` | Create rule |
| PUT | `/quran/tajweed-rules/{id}` | Update rule |
| DELETE | `/quran/tajweed-rules/{id}` | Delete rule |

#### Student Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/student-courses` | Get all student courses |
| GET | `/quran/student-courses/{id}` | Get by ID |
| POST | `/quran/student-courses` | Create |
| PUT | `/quran/student-courses/{id}` | Update |
| DELETE | `/quran/student-courses/{id}` | Delete |

#### Recitation Levels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/recitation-levels` | Get all levels |
| GET | `/quran/recitation-levels/{id}` | Get by ID |
| POST | `/quran/recitation-levels` | Create level |
| PUT | `/quran/recitation-levels/{id}` | Update level |
| DELETE | `/quran/recitation-levels/{id}` | Delete level |

#### Curricula
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/curricula` | Get all curricula |
| GET | `/quran/curricula/{id}` | Get by ID |
| POST | `/quran/curricula` | Create |
| PUT | `/quran/curricula/{id}` | Update |
| DELETE | `/quran/curricula/{id}` | Delete |

#### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/progress/student/{studentId}` | Get student progress |
| GET | `/quran/progress/{id}` | Get progress by ID |
| POST | `/quran/progress` | Record progress |

---

### 24. Rings Controller (`/rings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rings` | Get all rings |
| GET | `/rings/{id}` | Get ring by ID |
| POST | `/rings` | Create ring |
| PUT | `/rings/{id}` | Update ring |
| DELETE | `/rings/{id}` | Delete ring |
| GET | `/rings/{id}/students` | Get ring students |
| POST | `/rings/{id}/students` | Add student to ring |
| DELETE | `/rings/{id}/students/{studentId}` | Remove student from ring |
| POST | `/rings/{id}/books` | Add book to ring |
| DELETE | `/rings/{id}/books/{bookId}` | Remove book from ring |
| POST | `/rings/{id}/teaching-methods` | Add teaching method to ring |
| DELETE | `/rings/{id}/teaching-methods/{teachingMethodId}` | Remove teaching method |

---

### 25. Skill Progress Controller (`/skill-progress`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skill-progress/age-groups` | Get all age groups |
| POST | `/skill-progress/age-groups` | Create age group |
| GET | `/skill-progress/students/{studentId}` | Get student skill progress |
| GET | `/skill-progress/rings/{ringId}` | Get ring skill progress |
| PUT | `/skill-progress/{id}` | Update skill progress |
| GET | `/skill-progress/students/{studentId}/summary` | Get student summary |
| POST | `/skill-progress/sync-from-submission/{submissionId}` | Sync from submission |

---

### 26. Spiritual Catalog Controller (`/spiritual-catalog`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/spiritual-catalog/practices` | Get spiritual practices (filtered) |
| GET | `/spiritual-catalog/practices/all` | Get all practices |
| GET | `/spiritual-catalog/occasions` | Get occasions |
| GET | `/spiritual-catalog/occasions/{occasionId}` | Get occasion by ID |

---

### 27. Spiritual Entry Controller (`/spiritual-entries`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/spiritual-entries` | Create entry |
| GET | `/spiritual-entries/user/{userId}` | Get user's latest entry |
| GET | `/spiritual-entries/user/{userId}/history` | Get user's entry history |
| GET | `/spiritual-entries/user/{userId}/streak` | Get user's streak |

---

### 28. Spiritual Occasion Controller (`/spiritual-occasions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/spiritual-occasions/progress/user/{userId}` | Get user's occasion progress |
| POST | `/spiritual-occasions/progress/mark` | Mark occasion practice |

---

### 29. Spiritual Path Controller (`/spiritual-paths`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/spiritual-paths/available/{studentId}` | Get available paths for student |
| POST | `/spiritual-paths/ranking/{studentId}` | Submit path ranking |
| POST | `/spiritual-paths/finalize` | Finalize path selection |
| POST | `/spiritual-paths/switch` | Switch path |
| GET | `/spiritual-paths/selection/{studentId}` | Get student's path selection |
| GET | `/spiritual-paths/history/{studentId}` | Get student's path history |

---

### 30. Teacher Controller (`/teachers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teachers` | Get all teachers |
| GET | `/teachers/{id}` | Get teacher by ID |
| POST | `/teachers` | Create teacher |
| PUT | `/teachers/{id}` | Update teacher |
| DELETE | `/teachers/{id}` | Delete teacher |
| GET | `/teachers/by-course/{courseId}` | Get teachers by course |
| GET | `/teachers/dashboard-summary/{teacherId}` | Get teacher dashboard summary |
| POST | `/teachers/grade` | Grade submission |
| GET | `/teachers/gradings/{teacherId}` | Get teacher's gradings |
| GET | `/teachers/pending-gradings/{teacherId}` | Get pending gradings |

---

## Common Response Formats

### Success Response
```json
{
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": {}
}
```

### Paginated Response
```json
{
  "items": [],
  "totalCount": 0,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

---

## File Upload

For file uploads, use `multipart/form-data`:
- Max file size: 10MB
- Allowed extensions: .pdf, .doc, .docx, .mp3, .wav, .jpg, .png, .jpeg
- Magic byte validation applied

---

## Rate Limiting & CORS

- CORS: `localhost:4200`, `localhost:4201`, `localhost:3000`
- No explicit rate limiting configured (add in production)

---

## Database Notes

- SQL Server with `Nehzat_` table prefix
- `EnsureCreated()` on startup (no migrations)
- `--seed` flag drops and recreates database

---

## Version
Current API Version: v2.5.0
Last Updated: 2026-07-28