using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class ParentService : IParentService
{
    private readonly AppDbContext _db;

    public ParentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Parent>> GetAllAsync()
    {
        return await _db.Parents
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Parent?> FindByIdAsync(int id)
    {
        return await _db.Parents.FindAsync(id);
    }

    public async Task<Parent> CreateAsync(CreateParentRequest request)
    {
        var entity = new Parent
        {
            Username = request.Username.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            Address = request.Address?.Trim(),
            NationalCode = request.NationalCode?.Trim(),
            BranchId = request.BranchId,
            StudentIds = request.StudentIds ?? string.Empty,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Parents.Add(entity);
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(entity.Id))!;
    }

    public async Task<Parent> UpdateAsync(int id, UpdateParentRequest request)
    {
        var existing = await _db.Parents.FindAsync(id)
            ?? throw new KeyNotFoundException("والد پیدا نشد.");

        if (request.FirstName != null) existing.FirstName = request.FirstName.Trim();
        if (request.LastName != null) existing.LastName = request.LastName.Trim();
        if (request.Email != null) existing.Email = request.Email.Trim();
        if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber.Trim();
        if (request.Address != null) existing.Address = request.Address.Trim();
        if (request.NationalCode != null) existing.NationalCode = request.NationalCode.Trim();
        if (request.BranchId != null) existing.BranchId = request.BranchId;
        if (request.StudentIds != null) existing.StudentIds = request.StudentIds;
        if (request.Status != null) existing.Status = request.Status;

        existing.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.Parents.FindAsync(id)
            ?? throw new KeyNotFoundException("والد پیدا نشد.");

        _db.Parents.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
