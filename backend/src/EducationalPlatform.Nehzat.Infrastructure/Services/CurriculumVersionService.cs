using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class CurriculumVersionService : ICurriculumVersionService
{
    private readonly AppDbContext _db;

    public CurriculumVersionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CurriculumVersion>> GetAllAsync()
    {
        return await _db.CurriculumVersions
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
    }

    public async Task<CurriculumVersion?> GetByIdAsync(int id)
    {
        return await _db.CurriculumVersions.FindAsync(id);
    }

    public async Task<CurriculumVersion> CreateAsync(CreateCurriculumVersionRequest request)
    {
        if (await _db.CurriculumVersions.AnyAsync(v => v.Key == request.Key))
            throw new InvalidOperationException("نسخه برنامه درسی با این کلید قبلاً ثبت شده است.");

        var entity = new CurriculumVersion
        {
            Key = request.Key.Trim(),
            VersionNumber = request.VersionNumber.Trim(),
            Description = request.Description?.Trim(),
            Status = request.Status,
            ValidFrom = request.ValidFrom ?? DateTime.UtcNow,
            ValidTo = request.ValidTo
        };

        _db.CurriculumVersions.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<CurriculumVersion> UpdateAsync(int id, UpdateCurriculumVersionRequest request)
    {
        var existing = await _db.CurriculumVersions.FindAsync(id)
            ?? throw new KeyNotFoundException("نسخه برنامه درسی پیدا نشد.");

        if (request.VersionNumber != null) existing.VersionNumber = request.VersionNumber.Trim();
        if (request.Description != null) existing.Description = request.Description.Trim();
        if (request.Status != null) existing.Status = request.Status;
        if (request.ValidFrom.HasValue) existing.ValidFrom = request.ValidFrom.Value;
        if (request.ValidTo.HasValue) existing.ValidTo = request.ValidTo.Value;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var existing = await _db.CurriculumVersions.FindAsync(id)
            ?? throw new KeyNotFoundException("نسخه برنامه درسی پیدا نشد.");

        _db.CurriculumVersions.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task<CurriculumVersion?> GetActiveVersionAsync()
    {
        var now = DateTime.UtcNow;
        return await _db.CurriculumVersions
            .Where(v => v.Status == "published" && v.ValidFrom <= now && (v.ValidTo == null || v.ValidTo >= now))
            .OrderByDescending(v => v.VersionNumber)
            .FirstOrDefaultAsync();
    }
}
