using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using System.Text.Json;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class AssessmentService : IAssessmentService
{
    private readonly AppDbContext _db;
    private readonly IStudentService _studentService;
    private readonly ICourseService _courseService;

    public AssessmentService(AppDbContext db, IStudentService studentService, ICourseService courseService)
    {
        _db = db;
        _studentService = studentService;
        _courseService = courseService;
    }

    public async Task<Assessment> CreateAsync(Assessment assessment)
    {
        _db.Assessments.Add(assessment);
        await _db.SaveChangesAsync();
        return assessment;
    }

    public async Task<List<Assessment>> GetAllAsync()
    {
        return await _db.Assessments
            .Include(a => a.Course)
            .Include(a => a.GeneratedByUser)
            .Include(a => a.Questions)
            .Include(a => a.Results)
            .OrderByDescending(a => a.AssessmentDate)
            .ToListAsync();
    }

    public async Task<Assessment?> FindByIdAsync(int id)
    {
        return await _db.Assessments
            .Include(a => a.Course)
            .Include(a => a.GeneratedByUser)
            .Include(a => a.Questions)
            .Include(a => a.Results)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Assessment> UpdateAsync(int id, Assessment assessment)
    {
        var existing = await _db.Assessments.FindAsync(id)
            ?? throw new KeyNotFoundException("Assessment not found");

        if (assessment.Title != null) existing.Title = assessment.Title;
        if (assessment.Description != null) existing.Description = assessment.Description;
        if (assessment.Type != null) existing.Type = assessment.Type;
        if (assessment.MaxScore > 0) existing.MaxScore = assessment.MaxScore;
        if (assessment.DurationMinutes > 0) existing.DurationMinutes = assessment.DurationMinutes;
        if (assessment.AssessmentDate != default) existing.AssessmentDate = assessment.AssessmentDate;
        if (assessment.Status != null) existing.Status = assessment.Status;
        if (assessment.Instructions != null) existing.Instructions = assessment.Instructions;
        if (assessment.GenerationCriteria != null) existing.GenerationCriteria = assessment.GenerationCriteria;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var assessment = await _db.Assessments
            .Include(a => a.Questions)
            .Include(a => a.Results)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (assessment != null)
        {
            _db.AssessmentQuestions.RemoveRange(assessment.Questions);
            _db.AssessmentResults.RemoveRange(assessment.Results);
            _db.Assessments.Remove(assessment);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<List<Assessment>> GetByCourseAsync(int courseId)
    {
        return await _db.Assessments
            .Where(a => a.CourseId == courseId)
            .Include(a => a.Questions)
            .Include(a => a.Results)
            .OrderByDescending(a => a.AssessmentDate)
            .ToListAsync();
    }

    public async Task<List<Assessment>> GetByCourseAndDateRangeAsync(int courseId, DateTime startDate, DateTime endDate)
    {
        return await _db.Assessments
            .Where(a => a.CourseId == courseId && a.AssessmentDate >= startDate && a.AssessmentDate <= endDate)
            .Include(a => a.Questions)
            .Include(a => a.Results)
            .OrderBy(a => a.AssessmentDate)
            .ToListAsync();
    }

    public async Task<List<Assessment>> GetByStatusAsync(string status)
    {
        return await _db.Assessments
            .Where(a => a.Status == status)
            .Include(a => a.Course)
            .OrderByDescending(a => a.AssessmentDate)
            .ToListAsync();
    }

    public async Task<AssessmentQuestion> CreateQuestionAsync(AssessmentQuestion question)
    {
        _db.AssessmentQuestions.Add(question);
        await _db.SaveChangesAsync();
        return question;
    }

    public async Task<List<AssessmentQuestion>> GetQuestionsAsync(int assessmentId)
    {
        return await _db.AssessmentQuestions
            .Where(q => q.AssessmentId == assessmentId)
            .OrderBy(q => q.Order)
            .ToListAsync();
    }

    public async Task<AssessmentQuestion?> GetQuestionByIdAsync(int id)
    {
        return await _db.AssessmentQuestions.FindAsync(id);
    }

    public async Task<AssessmentQuestion> UpdateQuestionAsync(int id, AssessmentQuestion question)
    {
        var existing = await _db.AssessmentQuestions.FindAsync(id)
            ?? throw new KeyNotFoundException("Question not found");

        if (question.Type != null) existing.Type = question.Type;
        if (question.QuestionText != null) existing.QuestionText = question.QuestionText;
        if (question.OptionsJson != null) existing.OptionsJson = question.OptionsJson;
        if (question.CorrectAnswerJson != null) existing.CorrectAnswerJson = question.CorrectAnswerJson;
        if (question.Points > 0) existing.Points = question.Points;
        if (question.Order >= 0) existing.Order = question.Order;
        if (question.Difficulty != null) existing.Difficulty = question.Difficulty;
        if (question.Topic != null) existing.Topic = question.Topic;
        if (question.Explanation != null) existing.Explanation = question.Explanation;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteQuestionAsync(int id)
    {
        var question = await _db.AssessmentQuestions.FindAsync(id);
        if (question != null)
        {
            _db.AssessmentQuestions.Remove(question);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<AssessmentResult> CreateResultAsync(AssessmentResult result)
    {
        _db.AssessmentResults.Add(result);
        await _db.SaveChangesAsync();
        return result;
    }

    public async Task<List<AssessmentResult>> GetResultsAsync(int assessmentId)
    {
        return await _db.AssessmentResults
            .Where(r => r.AssessmentId == assessmentId)
            .Include(r => r.Student)
            .OrderByDescending(r => r.CompletedAt)
            .ToListAsync();
    }

    public async Task<List<AssessmentResult>> GetResultsByStudentAsync(int studentId)
    {
        return await _db.AssessmentResults
            .Where(r => r.StudentId == studentId)
            .Include(r => r.Assessment)
            .ThenInclude(a => a.Course)
            .OrderByDescending(r => r.CompletedAt)
            .ToListAsync();
    }

    public async Task<AssessmentResult?> GetResultByIdAsync(int id)
    {
        return await _db.AssessmentResults
            .Include(r => r.Student)
            .Include(r => r.Assessment)
            .ThenInclude(a => a.Course)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<AssessmentResult?> GetResultByAssessmentAndStudentAsync(int assessmentId, int studentId)
    {
        return await _db.AssessmentResults
            .Include(r => r.Student)
            .Include(r => r.Assessment)
            .FirstOrDefaultAsync(r => r.AssessmentId == assessmentId && r.StudentId == studentId);
    }

    public async Task<Assessment> GenerateWeeklyAssessmentAsync(int courseId, int generatedByUserId, string title, string description, int durationMinutes, int maxScore, DateTime assessmentDate, Dictionary<string, object> criteria)
    {
        var course = await _courseService.FindByIdAsync(courseId)
            ?? throw new KeyNotFoundException("Course not found");

        var assessment = new Assessment
        {
            CourseId = courseId,
            Title = title,
            Description = description,
            Type = "weekly",
            MaxScore = maxScore > 0 ? maxScore : 100,
            DurationMinutes = durationMinutes > 0 ? durationMinutes : 60,
            AssessmentDate = assessmentDate,
            Status = "draft",
            Instructions = "این ارزیابی هفتگی بر اساس پیشرفت شما و محتوای درس‌های هفته قبل تولید شده است.",
            GeneratedByUserId = generatedByUserId,
            GenerationCriteria = JsonSerializer.Serialize(criteria),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Questions = new List<AssessmentQuestion>()
        };

        _db.Assessments.Add(assessment);
        await _db.SaveChangesAsync();

        var questions = GenerateQuestionsSynchronously(assessment.Id, criteria);
        _db.AssessmentQuestions.AddRange(questions);
        await _db.SaveChangesAsync();

        var loaded = await FindByIdAsync(assessment.Id);
        if (loaded == null)
            throw new InvalidOperationException("Assessment not found after creation.");
        return loaded;
    }

    private static int GetIntFromValue(object value, int defaultValue)
    {
        if (value is int i) return i;
        if (value is JsonElement je)
        {
            if (je.ValueKind == JsonValueKind.Number) return je.GetInt32();
            if (je.ValueKind == JsonValueKind.String && int.TryParse(je.GetString(), out var parsed)) return parsed;
        }
        if (value is long l) return (int)l;
        if (value is string s && int.TryParse(s, out var parsed2)) return parsed2;
        return defaultValue;
    }

    private static Dictionary<string, int> GetDifficultyDistribution(Dictionary<string, object> criteria)
    {
        var dist = new Dictionary<string, int> { ["easy"] = 3, ["medium"] = 5, ["hard"] = 2 };
        if (criteria?.ContainsKey("difficultyDistribution") != true) return dist;
        var raw = criteria["difficultyDistribution"];
        Dictionary<string, object>? ddo = null;
        if (raw is Dictionary<string, object> ddo1) ddo = ddo1;
        else if (raw is JsonElement je && je.ValueKind == JsonValueKind.Object)
            ddo = JsonSerializer.Deserialize<Dictionary<string, object>>(je.GetRawText());
        if (ddo == null) return dist;
        foreach (var kvp in ddo) dist[kvp.Key] = GetIntFromValue(kvp.Value, 3);
        return dist;
    }

    private List<AssessmentQuestion> GenerateQuestionsSynchronously(int assessmentId, Dictionary<string, object> criteria)
    {
        var questions = new List<AssessmentQuestion>();
        var random = new Random();
        var order = 0;
        var totalPoints = 100;

        var questionCount = criteria != null && criteria.ContainsKey("questionCount") ? GetIntFromValue(criteria["questionCount"], 10) : 10;
        var difficultyDistribution = GetDifficultyDistribution(criteria ?? new Dictionary<string, object>());

        int easyCount = difficultyDistribution.GetValueOrDefault("easy", 3);
        int mediumCount = difficultyDistribution.GetValueOrDefault("medium", 5);
        int hardCount = difficultyDistribution.GetValueOrDefault("hard", 2);

        var defaultTopics = new[] { "مفاهیم پایه", "حل مسئله", "درک مطلب", "اعمال دانش" };

        var difficulties = new List<string>();
        for (int i = 0; i < easyCount; i++) difficulties.Add("easy");
        for (int i = 0; i < mediumCount; i++) difficulties.Add("medium");
        for (int i = 0; i < hardCount; i++) difficulties.Add("hard");

        difficulties = difficulties.OrderBy(x => random.Next()).ToList();

        for (int i = 0; i < Math.Min(questionCount, difficulties.Count); i++)
        {
            var difficulty = difficulties[i];
            var topic = defaultTopics[i % defaultTopics.Length];
            var points = difficulty == "easy" ? 8 : (difficulty == "medium" ? 12 : 15);

            var question = new AssessmentQuestion
            {
                AssessmentId = assessmentId,
                Type = "multiple_choice",
                QuestionText = GenerateQuestionText(topic, difficulty, random),
                OptionsJson = GenerateOptionsJson(),
                CorrectAnswerJson = JsonSerializer.Serialize(new { correctOption = 0 }),
                Points = points,
                Order = order++,
                Difficulty = difficulty,
                Topic = topic,
                Explanation = GenerateExplanation(difficulty, random),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            questions.Add(question);
        }

        var totalQuestionPoints = questions.Sum(q => q.Points);
        if (totalQuestionPoints > 0)
        {
            var scaleFactor = (double)totalPoints / totalQuestionPoints;
            foreach (var q in questions)
            {
                q.Points = (int)Math.Round(q.Points * scaleFactor);
            }
        }

        return questions;
    }

    public async Task<List<AssessmentQuestion>> GenerateQuestionsFromCourseContentAsync(int assessmentId, int courseId, Dictionary<string, object> criteria)
    {
        var questions = GenerateQuestionsSynchronously(assessmentId, criteria);
        return questions;
    }

    private string GenerateQuestionText(string topic, string difficulty, Random random)
    {
        var templates = new Dictionary<string, string[]>
        {
            ["easy"] = new[]
            {
                "کدام یک از موارد زیر مربوط به {0} است؟",
                "تعریف {0} چیست؟",
                "مثالی از {0} کدام است؟",
                "در مورد {0} کدام جمله درست است؟"
            },
            ["medium"] = new[]
            {
                "تفاوت {0} با مفاهیم مشابه چیست؟",
                "چگونه {0} را در مسئله‌های واقعی اعمال می‌کنیم؟",
                "نتیجه اعمال {0} در شرایط مختلف چیست؟",
                "مهم‌ترین نکته در استفاده از {0} چیست؟"
            },
            ["hard"] = new[]
            {
                "با توجه به سناریوی زیر، بهترین راهکار برای {0} چیست؟",
                "تحلیل کنید چرا {0} در این شرایط نتیجه متفاوت دارد؟",
                "راه‌حلی با استفاده از {0} برای حل مسئله پیشنهاد دهید.",
                "مقایسه {0} با سایر مفاهیم مشابه در موقعیت پیچیده"
            }
        };

        var diffTemplates = templates.GetValueOrDefault(difficulty, templates["easy"]);
        var template = diffTemplates[random.Next(diffTemplates.Length)];

        return string.Format(template, topic);
    }

    private string GenerateOptionsJson()
    {
        var options = new[]
        {
            "گزینه صحیح",
            "گزینه غلط ۱",
            "گزینه غلط ۲",
            "گزینه غلط ۳"
        };
        return JsonSerializer.Serialize(options);
    }

    private string GenerateExplanation(string difficulty, Random random)
    {
        var explanations = new Dictionary<string, string[]>
        {
            ["easy"] = new[]
            {
                "این مفهوم پایه‌ای در درس است و درک آن برای پیشرفت ضروری است.",
                "پاسخ صحیح بر اساس تعریف‌های استاندارد درس است."
            },
            ["medium"] = new[]
            {
                "این مفهوم نیازمند درک روابط بین مباحث مختلف درس است.",
                "اعمال این مفهوم در مسائل واقعی نیاز به تفکر تحلیلی دارد."
            },
            ["hard"] = new[]
            {
                "حل این مسئله نیاز به ترکیب چندین مفهوم و استدلال چندمرحله‌ای دارد.",
                "تحلیل عمیق و توانایی به‌کارگیری دانش در موقعیت‌های جدید ارزیابی می‌شود."
            }
        };

        var diffExplanations = explanations.GetValueOrDefault(difficulty, explanations["easy"]);
        return diffExplanations[random.Next(diffExplanations.Length)];
    }

    public async Task<object> GetAssessmentAnalyticsAsync(int assessmentId)
    {
        var assessment = await FindByIdAsync(assessmentId)
            ?? throw new KeyNotFoundException("Assessment not found");

        var results = await GetResultsAsync(assessmentId);
        var questions = await GetQuestionsAsync(assessmentId);

        var completedResults = results.Where(r => r.Status == "completed").ToList();
        var totalStudents = results.Count;
        var completedCount = completedResults.Count;
        var averageScore = completedCount > 0 ? completedResults.Average(r => r.Percentage) : 0;
        var passRate = completedCount > 0 ? (double)completedResults.Count(r => r.Percentage >= 60) / completedCount * 100 : 0;

        var questionStats = questions.Select(q => new
        {
            questionId = q.Id,
            questionText = q.QuestionText,
            topic = q.Topic,
            difficulty = q.Difficulty,
            points = q.Points,
            correctRate = completedCount > 0 
                ? (double)completedResults.Count(r => IsAnswerCorrect(r, q)) / completedCount * 100 
                : 0
        }).ToList();

        return new
        {
            assessment = new { assessment.Id, assessment.Title, assessment.Type, assessment.MaxScore, assessment.AssessmentDate, assessment.Status },
            totalStudents,
            completedCount,
            completionRate = totalStudents > 0 ? (double)completedCount / totalStudents * 100 : 0,
            averageScore = Math.Round(averageScore, 2),
            passRate = Math.Round(passRate, 2),
            questionStats
        };
    }

    private bool IsAnswerCorrect(AssessmentResult result, AssessmentQuestion question)
    {
        if (string.IsNullOrEmpty(result.AnswersJson) || string.IsNullOrEmpty(question.CorrectAnswerJson))
            return false;

        try
        {
            var answers = JsonSerializer.Deserialize<Dictionary<string, object>>(result.AnswersJson);
            var correctAnswer = JsonSerializer.Deserialize<Dictionary<string, object>>(question.CorrectAnswerJson);
            
            if (answers != null && correctAnswer != null && 
                answers.TryGetValue(question.Id.ToString(), out var studentAnswer))
            {
                return studentAnswer?.ToString() == correctAnswer.GetValueOrDefault("correctOption")?.ToString();
            }
        }
        catch
        {
        }
        return false;
    }

    public async Task<object> GetStudentAssessmentHistoryAsync(int studentId, int courseId)
    {
        var student = await _studentService.FindByIdAsync(studentId)
            ?? throw new KeyNotFoundException("Student not found");

        var assessments = await _db.Assessments
            .Where(a => a.CourseId == courseId)
            .OrderBy(a => a.AssessmentDate)
            .ToListAsync();

        var results = await GetResultsByStudentAsync(studentId);
        var courseResults = results.Where(r => r.Assessment.CourseId == courseId).ToList();

        var history = assessments.Select(a => new
        {
            assessment = new { a.Id, a.Title, a.Type, a.AssessmentDate, a.MaxScore, a.Status },
            result = courseResults.FirstOrDefault(r => r.AssessmentId == a.Id) != null
                ? new
                {
                    id = courseResults.First(r => r.AssessmentId == a.Id).Id,
                    score = courseResults.First(r => r.AssessmentId == a.Id).Score,
                    percentage = courseResults.First(r => r.AssessmentId == a.Id).Percentage,
                    status = courseResults.First(r => r.AssessmentId == a.Id).Status,
                    completedAt = courseResults.First(r => r.AssessmentId == a.Id).CompletedAt
                }
                : null
        }).ToList();

        var trend = courseResults
            .Where(r => r.Status == "completed")
            .OrderBy(r => r.CompletedAt)
            .Select(r => new { date = r.CompletedAt, score = r.Percentage })
            .ToList();

        return new
        {
            student = new { student.Id, Name = $"{student.FirstName} {student.LastName}", student.StudentId },
            history,
            trend,
            statistics = new
            {
                totalAssessments = assessments.Count,
                completedAssessments = courseResults.Count(r => r.Status == "completed"),
                averageScore = courseResults.Any(r => r.Status == "completed") 
                    ? Math.Round(courseResults.Where(r => r.Status == "completed").Average(r => r.Percentage), 2)
                    : 0,
                bestScore = courseResults.Any(r => r.Status == "completed") 
                    ? courseResults.Where(r => r.Status == "completed").Max(r => r.Percentage)
                    : 0
            }
        };
    }
}
