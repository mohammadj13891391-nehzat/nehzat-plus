using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class CurriculumService : ICurriculumService
{
    private readonly AppDbContext _db;

    public CurriculumService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SubjectArea>> GetAllSubjectAreasAsync()
    {
        return await _db.SubjectAreas
            .Include(s => s.Objectives)
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<SubjectArea?> FindSubjectAreaByIdAsync(int id)
    {
        return await _db.SubjectAreas
            .Include(s => s.Objectives)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<SubjectArea> CreateSubjectAreaAsync(CreateSubjectAreaRequest request)
    {
        if (await _db.SubjectAreas.AnyAsync(s => s.Key == request.Key))
            throw new InvalidOperationException("حوزه درسی با این کلید قبلاً ثبت شده است.");

        var entity = new SubjectArea
        {
            Key = request.Key.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            SortOrder = request.SortOrder
        };

        _db.SubjectAreas.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<SubjectArea> UpdateSubjectAreaAsync(int id, UpdateSubjectAreaRequest request)
    {
        var existing = await _db.SubjectAreas.FindAsync(id)
            ?? throw new KeyNotFoundException("حوزه درسی پیدا نشد.");

        if (request.Name != null) existing.Name = request.Name.Trim();
        if (request.Description != null) existing.Description = request.Description.Trim();
        if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteSubjectAreaAsync(int id)
    {
        var entity = await _db.SubjectAreas.FindAsync(id)
            ?? throw new KeyNotFoundException("حوزه درسی پیدا نشد.");
        _db.SubjectAreas.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<List<TeachingMethod>> GetAllTeachingMethodsAsync()
    {
        return await _db.TeachingMethods
            .OrderBy(t => t.SortOrder)
            .ThenBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<TeachingMethod?> FindTeachingMethodByIdAsync(int id)
    {
        return await _db.TeachingMethods.FindAsync(id);
    }

    public async Task<TeachingMethod> CreateTeachingMethodAsync(CreateTeachingMethodRequest request)
    {
        if (await _db.TeachingMethods.AnyAsync(t => t.Key == request.Key))
            throw new InvalidOperationException("روش تدریس با این کلید قبلاً ثبت شده است.");

        var entity = new TeachingMethod
        {
            Key = request.Key.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            SortOrder = request.SortOrder
        };

        _db.TeachingMethods.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<TeachingMethod> UpdateTeachingMethodAsync(int id, UpdateTeachingMethodRequest request)
    {
        var existing = await _db.TeachingMethods.FindAsync(id)
            ?? throw new KeyNotFoundException("روش تدریس پیدا نشد.");

        if (request.Name != null) existing.Name = request.Name.Trim();
        if (request.Description != null) existing.Description = request.Description.Trim();
        if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteTeachingMethodAsync(int id)
    {
        var entity = await _db.TeachingMethods.FindAsync(id)
            ?? throw new KeyNotFoundException("روش تدریس پیدا نشد.");
        _db.TeachingMethods.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<List<CurriculumObjective>> GetAllObjectivesAsync()
    {
        return await _db.CurriculumObjectives
            .Include(o => o.SubjectArea)
            .Include(o => o.ParentObjective)
            .Include(o => o.ChildObjectives)
            .OrderBy(o => o.SubjectAreaId)
            .ThenBy(o => o.SortOrder)
            .ToListAsync();
    }

    public async Task<CurriculumObjective?> FindObjectiveByIdAsync(int id)
    {
        return await _db.CurriculumObjectives
            .Include(o => o.SubjectArea)
            .Include(o => o.ParentObjective)
            .Include(o => o.ChildObjectives)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<CurriculumObjective> CreateObjectiveAsync(CreateCurriculumObjectiveRequest request)
    {
        if (await _db.CurriculumObjectives.AnyAsync(o => o.Key == request.Key))
            throw new InvalidOperationException("هدف تربیتی با این کلید قبلاً ثبت شده است.");

        var entity = new CurriculumObjective
        {
            Key = request.Key.Trim(),
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            SubjectAreaId = request.SubjectAreaId,
            ParentObjectiveId = request.ParentObjectiveId,
            SortOrder = request.SortOrder,
            Level = request.Level
        };

        _db.CurriculumObjectives.Add(entity);
        await _db.SaveChangesAsync();
        return (await FindObjectiveByIdAsync(entity.Id))!;
    }

    public async Task<CurriculumObjective> UpdateObjectiveAsync(int id, UpdateCurriculumObjectiveRequest request)
    {
        var existing = await _db.CurriculumObjectives.FindAsync(id)
            ?? throw new KeyNotFoundException("هدف تربیتی پیدا نشد.");

        if (request.Title != null) existing.Title = request.Title.Trim();
        if (request.Description != null) existing.Description = request.Description.Trim();
        if (request.SubjectAreaId.HasValue) existing.SubjectAreaId = request.SubjectAreaId.Value;
        if (request.ParentObjectiveId.HasValue) existing.ParentObjectiveId = request.ParentObjectiveId;
        if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;
        if (request.Level != null) existing.Level = request.Level;

        await _db.SaveChangesAsync();
        return (await FindObjectiveByIdAsync(id))!;
    }

    public async Task DeleteObjectiveAsync(int id)
    {
        var entity = await _db.CurriculumObjectives.FindAsync(id)
            ?? throw new KeyNotFoundException("هدف تربیتی پیدا نشد.");
        _db.CurriculumObjectives.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<List<Book>> GetAllBooksAsync()
    {
        return await _db.Books
            .Include(b => b.SubjectArea)
            .OrderBy(b => b.Title)
            .ToListAsync();
    }

    public async Task<Book?> FindBookByIdAsync(int id)
    {
        return await _db.Books
            .Include(b => b.SubjectArea)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Book> CreateBookAsync(CreateBookRequest request)
    {
        if (await _db.Books.AnyAsync(b => b.Key == request.Key))
            throw new InvalidOperationException("کتاب با این کلید قبلاً ثبت شده است.");

        var entity = new Book
        {
            Key = request.Key.Trim(),
            Title = request.Title.Trim(),
            Author = request.Author?.Trim(),
            SubjectAreaId = request.SubjectAreaId,
            Level = request.Level?.Trim(),
            Publisher = request.Publisher?.Trim(),
            Pages = request.Pages
        };

        _db.Books.Add(entity);
        await _db.SaveChangesAsync();
        return (await FindBookByIdAsync(entity.Id))!;
    }

    public async Task<Book> UpdateBookAsync(int id, UpdateBookRequest request)
    {
        var existing = await _db.Books.FindAsync(id)
            ?? throw new KeyNotFoundException("کتاب پیدا نشد.");

        if (request.Title != null) existing.Title = request.Title.Trim();
        if (request.Author != null) existing.Author = request.Author.Trim();
        if (request.SubjectAreaId.HasValue) existing.SubjectAreaId = request.SubjectAreaId.Value;
        if (request.Level != null) existing.Level = request.Level.Trim();
        if (request.Publisher != null) existing.Publisher = request.Publisher.Trim();
        if (request.Pages.HasValue) existing.Pages = request.Pages.Value;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteBookAsync(int id)
    {
        var entity = await _db.Books.FindAsync(id)
            ?? throw new KeyNotFoundException("کتاب پیدا نشد.");
        _db.Books.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
