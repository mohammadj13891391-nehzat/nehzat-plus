using Microsoft.EntityFrameworkCore;
using LessonPlanner.Api.Data;
using LessonPlanner.Api.DTOs;
using LessonPlanner.Api.Models;

namespace LessonPlanner.Api.Services;

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
            AssignedMadrasahIds = request.AssignedMadrasahIds != null ? string.Join(",", request.AssignedMadrasahIds) : string.Empty,
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

        if (request.Username != null) existing.Username = request.Username.Trim();
        if (request.FirstName != null) existing.FirstName = request.FirstName.Trim();
        if (request.LastName != null) existing.LastName = request.LastName.Trim();
        if (request.Email != null) existing.Email = request.Email.Trim();
        if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber.Trim();
        if (request.Expertise != null) existing.Expertise = request.Expertise.Trim();
        if (request.AssignedMadrasahIds != null) existing.AssignedMadrasahIds = string.Join(",", request.AssignedMadrasahIds);
        if (request.NationalCode != null) existing.NationalCode = request.NationalCode.Trim();
        if (request.Status != null) existing.Status = request.Status;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

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
