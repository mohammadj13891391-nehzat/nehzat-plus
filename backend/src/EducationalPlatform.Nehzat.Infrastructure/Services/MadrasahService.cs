using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class MadrasahService : IMadrasahService
{
    private readonly AppDbContext _db;

    public MadrasahService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Madrasah>> GetAllAsync()
    {
        return await _db.Madrasahs
            .Include(m => m.Section)
            .Include(m => m.Branches)
            .OrderBy(m => m.Name)
            .ToListAsync();
    }

    public async Task<Madrasah?> FindByIdAsync(int id)
    {
        return await _db.Madrasahs
            .Include(m => m.Section)
            .Include(m => m.Branches)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<Madrasah> CreateAsync(CreateMadrasahRequest request)
    {
        if (await _db.Madrasahs.AnyAsync(m => m.Key == request.Key))
            throw new InvalidOperationException("مکتب با این کلید قبلاً ثبت شده است.");

        var entity = new Madrasah
        {
            Key = request.Key.Trim(),
            Name = request.Name.Trim(),
            Label = request.Label?.Trim(),
            Level = request.Level?.Trim(),
            Gender = request.Gender,
            Grade = request.Grade,
            Capacity = request.Capacity,
            Status = request.Status,
            SectionId = request.SectionId,
            ManagerId = request.ManagerId
        };

        _db.Madrasahs.Add(entity);
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(entity.Id))!;
    }

    public async Task<Madrasah> UpdateAsync(int id, UpdateMadrasahRequest request)
    {
        var existing = await _db.Madrasahs.FindAsync(id)
            ?? throw new KeyNotFoundException("مکتب پیدا نشد.");

        if (request.Name != null) existing.Name = request.Name.Trim();
        if (request.Label != null) existing.Label = request.Label.Trim();
        if (request.Level != null) existing.Level = request.Level.Trim();
        if (request.Gender != null) existing.Gender = request.Gender;
        if (request.Grade.HasValue) existing.Grade = request.Grade.Value;
        if (request.Capacity.HasValue) existing.Capacity = request.Capacity.Value;
        if (request.Status != null) existing.Status = request.Status;
        if (request.SectionId.HasValue) existing.SectionId = request.SectionId.Value;
        if (request.ManagerId.HasValue) existing.ManagerId = request.ManagerId.Value;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.Madrasahs.FindAsync(id)
            ?? throw new KeyNotFoundException("مکتب پیدا نشد.");

        _db.Madrasahs.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<List<MadrasahBranch>> GetBranchesAsync(int madrasahId)
    {
        return await _db.MadrasahBranches
            .Include(b => b.SubSections)
            .Where(b => b.MadrasahId == madrasahId)
            .OrderBy(b => b.Name)
            .ToListAsync();
    }

    public async Task<MadrasahBranch> CreateBranchAsync(CreateMadrasahBranchRequest request)
    {
        if (await _db.Madrasahs.FindAsync(request.MadrasahId) == null)
            throw new KeyNotFoundException("مکتب پیدا نشد.");

        var entity = new MadrasahBranch
        {
            Name = request.Name.Trim(),
            Province = request.Province?.Trim(),
            City = request.City?.Trim(),
            Address = request.Address?.Trim(),
            Phone = request.Phone?.Trim(),
            Capacity = request.Capacity,
            Status = request.Status,
            MadrasahId = request.MadrasahId
        };

        _db.MadrasahBranches.Add(entity);
        await _db.SaveChangesAsync();

        return entity;
    }

    public async Task DeleteBranchAsync(int madrasahId, int branchId)
    {
        var entity = await _db.MadrasahBranches
            .FirstOrDefaultAsync(b => b.Id == branchId && b.MadrasahId == madrasahId)
            ?? throw new KeyNotFoundException("شعبه پیدا نشد.");

        _db.MadrasahBranches.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
