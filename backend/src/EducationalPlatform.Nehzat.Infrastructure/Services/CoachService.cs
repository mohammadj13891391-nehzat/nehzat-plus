using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class CoachService : ICoachService
{
    private readonly AppDbContext _db;

    public CoachService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Coach>> GetAllAsync()
    {
        return await _db.Coaches
            .Include(c => c.CoachCourses)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Coach?> FindByIdAsync(int id)
    {
        return await _db.Coaches
            .Include(c => c.CoachCourses)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Coach> CreateAsync(CreateCoachRequest request)
    {
        var coach = new Coach
        {
            Username = request.Username.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            Specialization = request.Specialization?.Trim(),
            NationalCode = request.NationalCode?.Trim(),
            BranchId = request.BranchId,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Coaches.Add(coach);
        await _db.SaveChangesAsync();

        return (await FindByIdAsync(coach.Id))!;
    }

    public async Task<Coach> UpdateAsync(int id, UpdateCoachRequest request)
    {
        var existing = await _db.Coaches.FindAsync(id)
            ?? throw new KeyNotFoundException("مربی پیدا نشد.");

        if (request.FirstName != null) existing.FirstName = request.FirstName.Trim();
        if (request.LastName != null) existing.LastName = request.LastName.Trim();
        if (request.Email != null) existing.Email = request.Email.Trim();
        if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber.Trim();
        if (request.Specialization != null) existing.Specialization = request.Specialization.Trim();
        if (request.NationalCode != null) existing.NationalCode = request.NationalCode.Trim();
        if (request.BranchId != null) existing.BranchId = request.BranchId;
        if (request.Status != null) existing.Status = request.Status;

        existing.UpdatedAt = DateTime.UtcNow;

        if (request.AssignedCourseIds != null)
        {
            var existingLinks = await _db.CoachCourses
                .Where(cc => cc.CoachId == id)
                .ToListAsync();
            _db.CoachCourses.RemoveRange(existingLinks);

            foreach (var courseId in request.AssignedCourseIds.Where(cid => cid > 0))
            {
                _db.CoachCourses.Add(new CoachCourse
                {
                    CoachId = id,
                    CourseId = courseId
                });
            }
        }

        await _db.SaveChangesAsync();
        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var coach = await _db.Coaches.FindAsync(id)
            ?? throw new KeyNotFoundException("مربی پیدا نشد.");

        var links = await _db.CoachCourses.Where(cc => cc.CoachId == id).ToListAsync();
        _db.CoachCourses.RemoveRange(links);

        _db.Coaches.Remove(coach);
        await _db.SaveChangesAsync();
    }
}
