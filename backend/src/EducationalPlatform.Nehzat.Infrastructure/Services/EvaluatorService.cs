using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class EvaluatorService : IEvaluatorService
{
    private readonly AppDbContext _db;

    public EvaluatorService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Evaluator>> GetAllAsync()
    {
        return await _db.Evaluators
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<Evaluator?> FindByIdAsync(int id)
    {
        return await _db.Evaluators.FindAsync(id);
    }

    public async Task<Evaluator> CreateAsync(CreateEvaluatorRequest request)
    {
        var entity = new Evaluator
        {
            Username = request.Username.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            Expertise = request.Expertise?.Trim(),
            BranchId = request.BranchId,
            AssignedMadrasahIds = string.Empty,
            NationalCode = request.NationalCode?.Trim(),
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Evaluators.Add(entity);
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(entity.Id))!;
    }

    public async Task<Evaluator> UpdateAsync(int id, UpdateEvaluatorRequest request)
    {
        var existing = await _db.Evaluators.FindAsync(id)
            ?? throw new KeyNotFoundException("ارزیاب پیدا نشد.");

        if (request.FirstName != null) existing.FirstName = request.FirstName.Trim();
        if (request.LastName != null) existing.LastName = request.LastName.Trim();
        if (request.Email != null) existing.Email = request.Email.Trim();
        if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber.Trim();
        if (request.Expertise != null) existing.Expertise = request.Expertise.Trim();
        if (request.BranchId != null) existing.BranchId = request.BranchId;
        if (request.NationalCode != null) existing.NationalCode = request.NationalCode.Trim();
        if (request.Status != null) existing.Status = request.Status;

        existing.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.Evaluators.FindAsync(id)
            ?? throw new KeyNotFoundException("ارزیاب پیدا نشد.");

        _db.Evaluators.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
