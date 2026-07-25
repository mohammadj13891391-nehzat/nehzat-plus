using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class MonthlyBookletService : IMonthlyBookletService
{
    private readonly AppDbContext _db;

    public MonthlyBookletService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<MonthlyBooklet>> GetAllAsync(int? studentId = null)
    {
        var query = _db.MonthlyBooklets.AsQueryable();

        if (studentId.HasValue)
            query = query.Where(b => b.StudentId == studentId.Value);

        return await query
            .Include(b => b.Student)
            .OrderByDescending(b => b.Year).ThenByDescending(b => b.Month)
            .ToListAsync();
    }

    public async Task<MonthlyBooklet?> GetByIdAsync(int id)
    {
        return await _db.MonthlyBooklets
            .Include(b => b.Student)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<List<MonthlyBooklet>> GetByStudentAsync(int studentId)
    {
        return await _db.MonthlyBooklets
            .Where(b => b.StudentId == studentId)
            .OrderByDescending(b => b.Year).ThenByDescending(b => b.Month)
            .ToListAsync();
    }

    public async Task<MonthlyBooklet?> GetByStudentAndPeriodAsync(int studentId, int month, int year)
    {
        return await _db.MonthlyBooklets
            .FirstOrDefaultAsync(b => b.StudentId == studentId && b.Month == month && b.Year == year);
    }

    public async Task<MonthlyBooklet> CreateAsync(CreateMonthlyBookletRequest request)
    {
        if (await _db.MonthlyBooklets.AnyAsync(b =>
            b.StudentId == request.StudentId && b.Month == request.Month && b.Year == request.Year))
            throw new InvalidOperationException("دفترچه ماهانه برای این دوره قبلاً ثبت شده است.");

        if (!await _db.Students.AnyAsync(s => s.Id == request.StudentId))
            throw new KeyNotFoundException("دانش‌آموز پیدا نشد.");

        var entity = new MonthlyBooklet
        {
            StudentId = request.StudentId,
            Month = request.Month,
            Year = request.Year,
            Title = request.Title.Trim(),
            Content = request.Content,
            Status = "draft",
            CreatedByUserId = request.CreatedByUserId
        };

        _db.MonthlyBooklets.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<MonthlyBooklet> UpdateAsync(int id, UpdateMonthlyBookletRequest request)
    {
        var existing = await _db.MonthlyBooklets.FindAsync(id)
            ?? throw new KeyNotFoundException("دفترچه ماهانه پیدا نشد.");

        if (request.Title != null) existing.Title = request.Title.Trim();
        if (request.Content != null) existing.Content = request.Content;
        if (request.Status != null) existing.Status = request.Status;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var existing = await _db.MonthlyBooklets.FindAsync(id)
            ?? throw new KeyNotFoundException("دفترچه ماهانه پیدا نشد.");

        _db.MonthlyBooklets.Remove(existing);
        await _db.SaveChangesAsync();
    }
}
