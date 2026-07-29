using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using EducationalPlatform.Nehzat.Infrastructure.Services;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Tests;

public class QuranServiceTest : IDisposable
{
    private readonly AppDbContext _db;
    private readonly IQuranService _service;

    public QuranServiceTest()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _service = new QuranService(_db);
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    [Fact]
    public async Task GetAllSurahsAsync_EmptyDatabase_ReturnsEmptyList()
    {
        var result = await _service.GetAllSurahsAsync();
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateAndGetSurah_Works()
    {
        var created = await _service.CreateSurahAsync(new CreateSurahRequest(
            Number: "1", Name: "الفاتحة", TranslatedName: "حمد"));
        Assert.Equal("1", created.Number);

        var found = await _service.FindSurahByIdAsync(created.Id);
        Assert.NotNull(found);
        Assert.Equal("الفاتحة", found.Name);
    }

    [Fact]
    public async Task GetSurahById_NotFound_ReturnsNull()
    {
        var result = await _service.FindSurahByIdAsync(999);
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAyah_WithSurah_Works()
    {
        var surah = await _service.CreateSurahAsync(new CreateSurahRequest(
            Number: "1", Name: "الفاتحة"));
        var ayah = await _service.CreateAyahAsync(new CreateAyahRequest(
            SurahId: surah.Id, VerseNumber: 1, Text: "بِسْمِ اللَّهِ"));

        Assert.Equal(1, ayah.VerseNumber);
        Assert.Equal("بِسْمِ اللَّهِ", ayah.Text);
    }

    [Fact]
    public async Task GetAllRecitationLevels_ReturnsSeededData()
    {
        _db.RecitationLevels.Add(new RecitationLevel
        {
            LevelNumber = 1,
            Name = "Test Level",
            Description = "Test",
            Criteria = "Test",
            ColorCode = "#000",
            PointsRequired = 100,
            EstimatedWeeks = 4,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();

        var levels = await _service.GetAllRecitationLevelsAsync();
        Assert.Single(levels);
        Assert.Equal("Test Level", levels[0].Name);
    }
}