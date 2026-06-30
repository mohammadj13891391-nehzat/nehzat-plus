---
name: fullstack-change
description: "Use when the user requests a feature, bug fix, refactor, or any change that spans backend, frontend, and/or database layers. Covers ASP.NET Core (C#), Angular 21 (TypeScript), EF Core (SQL Server), and Capacitor. Also use for: new entity/model, new API endpoint, new page/component, schema change, DTO creation, service method, CRUD operations, or any task mentioning 'all layers', 'fullstack', 'end-to-end', 'backend and frontend', 'model and API and UI'."
---

# Fullstack Change Skill — Nehzat Plus (Lesson Planner)

This skill coordinates changes across **all layers** of the Nehzat Plus application:
- **Database**: EF Core models, `AppDbContext`, schema (Code-First, SQL Server)
- **Backend**: ASP.NET Core controllers, services, DTOs (C#)
- **Frontend**: Angular 21 standalone components, services, models, routes (TypeScript)
- **Mobile**: Capacitor (Android) — if build output changes

## Architecture Overview

```
nehzat-plus/
├── backend/LessonPlanner.Api/
│   ├── Models/              # EF Core entities (PascalCase, [Table], [Column])
│   ├── Data/AppDbContext.cs # DbSets + Fluent API in OnModelCreating
│   ├── DTOs/                # C# records (CreateXxxRequest, UpdateXxxRequest)
│   ├── Services/            # IXxxService interface + XxxService implementation
│   ├── Controllers/         # [ApiController] [Route("xxx")] ControllerBase
│   ├── Seeders/             # SampleDataSeeder.cs
│   └── Program.cs           # DI registration, middleware, DB init
├── frontend/src/app/
│   ├── core/
│   │   ├── models/lesson-planner.models.ts  # TS interfaces
│   │   ├── services/
│   │   │   ├── lesson-planner-api.interface.ts  # Abstract API class
│   │   │   ├── lesson-planner-api.token.ts      # DI token
│   │   │   ├── http-lesson-planner-api.service.ts    # Real HTTP impl
│   │   │   └── mock-lesson-planner-api.service.ts    # Mock impl
│   │   ├── guards/          # auth.guard.ts, admin.guard.ts
│   │   └── interceptors/    # auth.interceptor.ts
│   ├── features/
│   │   ├── auth/            # Login, Signup pages
│   │   ├── dashboard/       # Student dashboard
│   │   └── admin/           # Admin panel (courses, users, assignments)
│   └── app.routes.ts        # Root routing
└── docs/                    # AGENTS.md, API_ENDPOINTS.md, etc.
```

## Mandatory Execution Order

**Always follow this sequence. Never skip a layer.**

### Phase 1: Analysis
1. Read the user's request carefully
2. Identify which entities/tables are involved
3. Identify which API endpoints are needed
4. Identify which frontend pages/components need changes
5. Use `task` tool with `explore` agent to find existing related code

### Phase 2: Database Layer
1. **Model** (`backend/LessonPlanner.Api/Models/Xxx.cs`):
   - Use `[Table("tablename")]` with snake_case table names
   - Use `[Key]` + `[DatabaseGenerated(DatabaseGeneratedOption.Identity)]` for PK
   - Use `[Column(TypeName = "varchar(N)")]` or `[Column(TypeName = "text")]`
   - Use `string.Empty` as default for required strings
   - Use `?` nullable for optional strings
   - Navigation properties: `ICollection<T>` with `new List<T>()` default
   - Foreign keys: `[ForeignKey(nameof(XxxId))]` attribute
   - Timestamps: `CreatedAt` and `UpdatedAt` as `DateTime` with `DateTime.UtcNow` default

2. **DbContext** (`backend/LessonPlanner.Api/Data/AppDbContext.cs`):
   - Add `public DbSet<Xxx> Xxxs => Set<Xxx>();`
   - Add Fluent API config in `OnModelCreating`:
     - Unique indexes: `entity.HasIndex(e => e.Email).IsUnique();`
     - Relationships: `entity.HasOne(e => e.Xxx).WithMany(x => x.Yyy).HasForeignKey(e => e.XxxId);`
     - Cascade delete: `.OnDelete(DeleteBehavior.Cascade);` when needed

### Phase 3: Backend Layer
1. **DTOs** (`backend/LessonPlanner.Api/DTOs/XxxDtos.cs`):
   - Use C# `record` types
   - Pattern: `public record CreateXxxRequest(...);` and `public record UpdateXxxRequest(...);`
   - Make all fields in UpdateXxxRequest nullable (`?`)
   - Follow existing naming: `CreateCourseRequest`, `UpdateCourseRequest`, etc.

2. **Service Interface** (`backend/LessonPlanner.Api/Services/IXxxService.cs`):
   - Define all CRUD methods + any business logic methods
   - Return `Task<T>` for async operations
   - Use `Task<List<T>>` for collection returns
   - Pattern: `Task<Xxx> CreateAsync(Xxx xxx);`, `Task<List<Xxx>> GetAllAsync();`, etc.

3. **Service Implementation** (`backend/LessonPlanner.Api/Services/XxxService.cs`):
   - Inject `AppDbContext` via constructor
   - Use `_db.Xxxs.AddAsync()` / `.FindAsync()` / `.Remove()` / `.SaveChangesAsync()`
   - Include related entities with `.Include()` / `.ThenInclude()`
   - Throw `KeyNotFoundException` for not-found cases
   - Pattern: follow existing `CourseService.cs` conventions exactly

4. **Controller** (`backend/LessonPlanner.Api/Controllers/XxxController.cs`):
   - `[ApiController]` + `[Route("xxx")]` attributes
   - Inject service via constructor
   - Use `[HttpPost]`, `[HttpGet]`, `[HttpGet("{id}")]`, `[HttpPut("{id}")]`, `[HttpDelete("{id}")]`
   - Return `Ok(result)` for success, `NotFound()` for missing
   - Use `[FromBody]` for JSON payloads, `[FromForm]` for file uploads

5. **DI Registration** (`backend/LessonPlanner.Api/Program.cs`):
   - Add `builder.Services.AddScoped<IXxxService, XxxService>();`
   - Place near other service registrations

### Phase 4: Frontend Layer
1. **Models** (`frontend/src/app/core/models/lesson-planner.models.ts`):
   - Add TypeScript interfaces matching backend entities
   - Use camelCase property names (Angular convention)
   - Add payload interfaces for create/update operations
   - Follow existing pattern: `interface Course { ... }`, `interface CreateCoursePayload { ... }`

2. **API Interface** (`frontend/src/app/core/services/lesson-planner-api.interface.ts`):
   - Add abstract method signatures for new endpoints
   - Return `Observable<T>` types
   - Follow existing naming: `getXxx()`, `createXxx()`, `updateXxx()`, `deleteXxx()`

3. **HTTP Implementation** (`frontend/src/app/core/services/http-lesson-planner-api.service.ts`):
   - Implement the new abstract methods using `HttpClient`
   - Use `this.http.get<T>(url)`, `.post<T>(url, body)`, `.put<T>(url, body)`, `.delete<T>(url)`
   - Use `this.getUrl('xxx')` for API URLs
   - Follow existing patterns exactly

4. **Mock Implementation** (`frontend/src/app/core/services/mock-lesson-planner-api.service.ts`):
   - Add mock implementations for new methods
   - Use `of(result).pipe(delay(300))` for simulated async
   - Maintain in-memory data store pattern

5. **Components/Pages** (under `frontend/src/app/features/xxx/`):
   - Use standalone components (no NgModules)
   - Class-based with `@Component` decorator
   - SCSS styling with `--lp-*` CSS custom properties
   - RTL layout with `direction: rtl`
   - Use `inject()` for DI (not constructor injection)
   - Lazy-load via `loadChildren` in routes

6. **Routes** (`frontend/src/app/features/xxx/xxx.routes.ts`):
   - Export const `XXX_ROUTES: Routes = [...]`
   - Add route definitions for new pages

7. **App Routes** (`frontend/src/app/app.routes.ts`):
   - Add new feature route if it's a new section:
     ```ts
     { path: 'xxx', canActivate: [authGuard], loadChildren: () => import('./features/xxx/xxx.routes').then(m => m.XXX_ROUTES) }
     ```

## Code Conventions (MUST Follow)

### Backend (C# / ASP.NET Core)
- File-scoped namespaces: `namespace LessonPlanner.Api.Xxx;`
- Use `?` for nullable types
- Use `string.Empty` not `""` for string defaults
- Use `DateTime.UtcNow` not `DateTime.Now`
- Use `await` with async methods (never `.Result`)
- Use `?? throw new KeyNotFoundException("...")` pattern
- No comments in code unless explicitly requested
- Follow existing indentation (4 spaces)

### Frontend (TypeScript / Angular)
- Standalone components only (no NgModules)
- Use `inject()` function for DI
- Use `Observable` + `subscribe()` pattern (not async pipe in most cases)
- SCSS with `--lp-*` custom properties
- Persian/Farsi UI text (RTL)
- No comments in code unless explicitly requested
- Follow existing indentation (2 spaces)

### Database (EF Core / SQL Server)
- Code-First approach (no migrations in this project)
- Snake_case table names: `[Table("xxx_yyy")]`
- PascalCase C# property names
- `EnsureCreated()` is used (not migrations)
- SQL Server provider: `UseSqlServer()`

## Verification Checklist

After making all changes, verify:

- [ ] **Backend compiles**: Run `dotnet build` in `backend/LessonPlanner.Api/`
- [ ] **Frontend compiles**: Run `npm run build` in `frontend/`
- [ ] **DI registered**: New services added to `Program.cs`
- [ ] **DbContext updated**: New DbSets + Fluent API config added
- [ ] **DTOs created**: Request/Response records exist
- [ ] **API interface updated**: Abstract methods added to `lesson-planner-api.interface.ts`
- [ ] **HTTP service updated**: Real implementation added
- [ ] **Mock service updated**: Mock implementation added
- [ ] **Models added**: TypeScript interfaces in `lesson-planner.models.ts`
- [ ] **Routes configured**: Feature routes + app routes updated
- [ ] **No breaking changes**: Existing functionality preserved

## Error Handling Pattern

Backend:
```csharp
var xxx = await _db.Xxxs.FindAsync(id)
    ?? throw new KeyNotFoundException("Xxx not found");
```

Frontend:
```typescript
this.api.getXxx(id).subscribe({
  next: (xxx) => { /* handle success */ },
  error: (err) => { /* handle error */ }
});
```

## File Templates

### New Model
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LessonPlanner.Api.Models;

[Table("xxx")]
public class Xxx
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "varchar(200)")]
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

### New DTOs
```csharp
namespace LessonPlanner.Api.DTOs;

public record CreateXxxRequest(
    string Name,
    string? Description
);

public record UpdateXxxRequest(
    string? Name,
    string? Description
);
```

### New Service Interface
```csharp
namespace LessonPlanner.Api.Services;

public interface IXxxService
{
    Task<Xxx> CreateAsync(Xxx xxx);
    Task<List<Xxx>> GetAllAsync();
    Task<Xxx?> FindByIdAsync(int id);
    Task<Xxx> UpdateAsync(int id, Xxx xxx);
    Task DeleteAsync(int id);
}
```

### New Controller
```csharp
using Microsoft.AspNetCore.Mvc;
using LessonPlanner.Api.Models;
using LessonPlanner.Api.Services;

namespace LessonPlanner.Api.Controllers;

[ApiController]
[Route("xxx")]
public class XxxController : ControllerBase
{
    private readonly IXxxService _xxxService;

    public XxxController(IXxxService xxxService)
    {
        _xxxService = xxxService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Xxx xxx)
    {
        var result = await _xxxService.CreateAsync(xxx);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _xxxService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _xxxService.FindByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Xxx xxx)
    {
        try
        {
            var result = await _xxxService.UpdateAsync(id, xxx);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _xxxService.DeleteAsync(id);
        return NoContent();
    }
}
```

### New Frontend Model
```typescript
export interface Xxx {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateXxxPayload {
  name: string;
  description?: string;
}

export type UpdateXxxPayload = Partial<CreateXxxPayload>;
```

## Important Notes

1. **Never hardcode URLs**: Use `this.getUrl('xxx')` in HTTP service
2. **Never skip the mock service**: Every API method needs a mock implementation
3. **Always update the abstract class**: `lesson-planner-api.interface.ts` must have the new methods
4. **Always register DI**: New services must be added to `Program.cs`
5. **Always update DbContext**: New entities need DbSets and Fluent API config
6. **Follow existing patterns**: Read neighboring files before writing new ones
7. **Build verification**: Always run `dotnet build` and `npm run build` after changes
8. **No comments**: Do not add code comments unless explicitly requested
9. **Persian text**: UI strings should be in Persian/Farsi
10. **RTL support**: Frontend components must support RTL layout
