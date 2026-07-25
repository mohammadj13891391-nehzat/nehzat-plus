using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class SpiritualCatalogService : ISpiritualCatalogService
{
    private readonly AppDbContext _db;

    public SpiritualCatalogService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SpiritualPracticeItem>> GetPracticesForUserAsync(int? userId, int? age, string? gender, string? role)
    {
        var query = _db.SpiritualPracticeItems.AsQueryable();

        if (age.HasValue)
        {
            query = query.Where(p => p.MinAge == null || p.MinAge <= age.Value);
            query = query.Where(p => p.MaxAge == null || p.MaxAge >= age.Value);
        }

        if (!string.IsNullOrWhiteSpace(gender))
        {
            query = query.Where(p => p.GenderMask == "mixed" || p.GenderMask == gender);
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            query = query.Where(p => p.RoleMask == "*" || p.RoleMask == role);
        }

        return await query
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.Id)
            .ToListAsync();
    }

    public async Task<List<SpiritualPracticeItem>> GetAllPracticesAsync()
    {
        return await _db.SpiritualPracticeItems
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.Id)
            .ToListAsync();
    }

    public async Task<List<SpiritualOccasion>> GetAllOccasionsAsync()
    {
        return await _db.SpiritualOccasions
            .OrderBy(o => o.SortOrder)
            .ThenBy(o => o.Id)
            .ToListAsync();
    }

    public async Task<SpiritualOccasion?> GetOccasionDetailAsync(int occasionId)
    {
        return await _db.SpiritualOccasions
            .Include(o => o.Practices)
            .ThenInclude(op => op.PracticeItem)
            .FirstOrDefaultAsync(o => o.Id == occasionId);
    }
}