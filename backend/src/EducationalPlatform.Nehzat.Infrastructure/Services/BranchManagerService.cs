using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class BranchManagerService : IBranchManagerService
{
    private readonly AppDbContext _db;

    public BranchManagerService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<BranchManager>> GetAllAsync()
    {
        return await _db.BranchManagers
            .Include(b => b.Branch)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<BranchManager?> FindByIdAsync(int id)
    {
        return await _db.BranchManagers
            .Include(b => b.Branch)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<BranchManager?> FindByUsernameAsync(string username)
    {
        return await _db.BranchManagers
            .Include(b => b.Branch)
            .FirstOrDefaultAsync(b => b.Username == username);
    }

    public async Task<BranchManager> CreateAsync(CreateBranchManagerRequest request)
    {
        var entity = new BranchManager
        {
            Username = request.Username.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            BranchId = request.BranchId,
            Gender = request.Gender,
            NationalCode = request.NationalCode?.Trim(),
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.BranchManagers.Add(entity);
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(entity.Id))!;
    }

    public async Task<BranchManager> UpdateAsync(int id, UpdateBranchManagerRequest request)
    {
        var existing = await _db.BranchManagers.FindAsync(id)
            ?? throw new KeyNotFoundException("مسئول شعبه پیدا نشد.");

        if (request.FirstName != null) existing.FirstName = request.FirstName.Trim();
        if (request.LastName != null) existing.LastName = request.LastName.Trim();
        if (request.Email != null) existing.Email = request.Email.Trim();
        if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber.Trim();
        if (request.BranchId != null) existing.BranchId = request.BranchId.Value;
        if (request.Gender != null) existing.Gender = request.Gender;
        if (request.NationalCode != null) existing.NationalCode = request.NationalCode.Trim();
        if (request.Status != null) existing.Status = request.Status;

        existing.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.BranchManagers.FindAsync(id)
            ?? throw new KeyNotFoundException("مسئول شعبه پیدا نشد.");

        _db.BranchManagers.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
