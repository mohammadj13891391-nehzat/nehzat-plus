using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class RingService : IRingService
{
    private readonly AppDbContext _db;

    public RingService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Ring>> GetAllAsync()
    {
        return await _db.Rings
            .Include(r => r.Madrasah)
            .Include(r => r.RingStudents)
            .Include(r => r.RingBooks).ThenInclude(rb => rb.Book)
            .Include(r => r.RingTeachingMethods).ThenInclude(rtm => rtm.TeachingMethod)
            .OrderBy(r => r.Name)
            .ToListAsync();
    }

    public async Task<Ring?> FindByIdAsync(int id)
    {
        return await _db.Rings
            .Include(r => r.Madrasah)
            .Include(r => r.RingStudents)
            .Include(r => r.RingBooks).ThenInclude(rb => rb.Book)
            .Include(r => r.RingTeachingMethods).ThenInclude(rtm => rtm.TeachingMethod)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Ring> CreateAsync(CreateRingRequest request)
    {
        if (await _db.Rings.AnyAsync(r => r.Key == request.Key))
            throw new InvalidOperationException("حلقه با این کلید قبلاً ثبت شده است.");

        if (!await _db.Madrasahs.AnyAsync(m => m.Id == request.MadrasahId))
            throw new KeyNotFoundException("مکتب پیدا نشد.");

        var entity = new Ring
        {
            Key = request.Key.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            MadrasahId = request.MadrasahId,
            CoachId = request.CoachId,
            CourseId = request.CourseId,
            Status = request.Status,
            Gender = request.Gender
        };

        _db.Rings.Add(entity);
        await _db.SaveChangesAsync();
        return (await FindByIdAsync(entity.Id))!;
    }

    public async Task<Ring> UpdateAsync(int id, UpdateRingRequest request)
    {
        var existing = await _db.Rings.FindAsync(id)
            ?? throw new KeyNotFoundException("حلقه پیدا نشد.");

        if (request.Name != null) existing.Name = request.Name.Trim();
        if (request.Description != null) existing.Description = request.Description.Trim();
        if (request.MadrasahId.HasValue) existing.MadrasahId = request.MadrasahId.Value;
        if (request.CoachId.HasValue) existing.CoachId = request.CoachId.Value;
        if (request.CourseId.HasValue) existing.CourseId = request.CourseId.Value;
        if (request.Status != null) existing.Status = request.Status;
        if (request.Gender != null) existing.Gender = request.Gender;

        await _db.SaveChangesAsync();
        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db.Rings.FindAsync(id)
            ?? throw new KeyNotFoundException("حلقه پیدا نشد.");
        _db.Rings.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<List<RingStudent>> GetStudentsAsync(int ringId)
    {
        return await _db.RingStudents
            .Where(rs => rs.RingId == ringId)
            .ToListAsync();
    }

    public async Task<RingStudent> AddStudentAsync(CreateRingStudentRequest request)
    {
        if (await _db.RingStudents.AnyAsync(rs => rs.RingId == request.RingId && rs.StudentId == request.StudentId))
            throw new InvalidOperationException("دانش‌آموز قبلاً در این حلقه ثبت شده است.");

        var entity = new RingStudent
        {
            RingId = request.RingId,
            StudentId = request.StudentId,
            Status = request.Status
        };

        _db.RingStudents.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task RemoveStudentAsync(int ringId, int studentId)
    {
        var entity = await _db.RingStudents
            .FirstOrDefaultAsync(rs => rs.RingId == ringId && rs.StudentId == studentId)
            ?? throw new KeyNotFoundException("دانش‌آموز در این حلقه پیدا نشد.");
        _db.RingStudents.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task AddBookAsync(CreateRingBookRequest request)
    {
        if (await _db.RingBooks.AnyAsync(rb => rb.RingId == request.RingId && rb.BookId == request.BookId))
            throw new InvalidOperationException("کتاب قبلاً به این حلقه اضافه شده است.");

        _db.RingBooks.Add(new RingBook
        {
            RingId = request.RingId,
            BookId = request.BookId,
            SortOrder = request.SortOrder
        });
        await _db.SaveChangesAsync();
    }

    public async Task RemoveBookAsync(int ringId, int bookId)
    {
        var entity = await _db.RingBooks
            .FirstOrDefaultAsync(rb => rb.RingId == ringId && rb.BookId == bookId)
            ?? throw new KeyNotFoundException("کتاب در این حلقه پیدا نشد.");
        _db.RingBooks.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task AddTeachingMethodAsync(CreateRingTeachingMethodRequest request)
    {
        if (await _db.RingTeachingMethods.AnyAsync(rtm => rtm.RingId == request.RingId && rtm.TeachingMethodId == request.TeachingMethodId))
            throw new InvalidOperationException("روش تدریس قبلاً به این حلقه اضافه شده است.");

        _db.RingTeachingMethods.Add(new RingTeachingMethod
        {
            RingId = request.RingId,
            TeachingMethodId = request.TeachingMethodId
        });
        await _db.SaveChangesAsync();
    }

    public async Task RemoveTeachingMethodAsync(int ringId, int teachingMethodId)
    {
        var entity = await _db.RingTeachingMethods
            .FirstOrDefaultAsync(rtm => rtm.RingId == ringId && rtm.TeachingMethodId == teachingMethodId)
            ?? throw new KeyNotFoundException("روش تدریس در این حلقه پیدا نشد.");
        _db.RingTeachingMethods.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
