namespace EducationalPlatform.Nehzat.Application.DTOs;

public class ProgressionResultDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string CurrentLevel { get; set; } = string.Empty;
    public string CurrentRing { get; set; } = string.Empty;
    public string? NextLevel { get; set; }
    public string? NextRing { get; set; }
    public bool CanProgress { get; set; }
    public List<string> BlockingReasons { get; set; } = new();
    public Dictionary<string, int> SkillMasteryRates { get; set; } = new();
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
}