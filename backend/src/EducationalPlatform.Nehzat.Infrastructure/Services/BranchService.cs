using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class BranchService : IBranchService
{
    private readonly AppDbContext _db;

    public BranchService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Branch>> GetAllAsync()
    {
        return await _db.Branches
            .OrderBy(b => b.Name)
            .ToListAsync();
    }

    public async Task<Branch?> FindByIdAsync(int id)
    {
        return await _db.Branches.FindAsync(id);
    }

    public async Task<Branch> CreateAsync(string name, string province, string? description)
    {
        var entity = new Branch
        {
            Name = name.Trim(),
            Province = province.Trim(),
            Description = description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _db.Branches.Add(entity);
        await _db.SaveChangesAsync();

        return entity;
    }

    public async Task<Branch> UpdateAsync(int id, string name, string province, string? description)
    {
        var existing = await _db.Branches.FindAsync(id)
            ?? throw new KeyNotFoundException("شعبه پیدا نشد.");

        existing.Name = name.Trim();
        existing.Province = province.Trim();
        existing.Description = description?.Trim();

        await _db.SaveChangesAsync();

        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.Branches.FindAsync(id)
            ?? throw new KeyNotFoundException("شعبه پیدا نشد.");

        _db.Branches.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
