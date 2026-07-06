using Microsoft.EntityFrameworkCore;
using LessonPlanner.Api.Data;
using LessonPlanner.Api.Models;
using System.Text.Json;

namespace LessonPlanner.Api.Services;

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

        var assignments = await _courseService.GetCourseAssignmentsAsync(courseId);

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
            UpdatedAt = DateTime.UtcNow
        };

        _db.Assessments.Add(assessment);
        await _db.SaveChangesAsync();

        var questions = await GenerateQuestionsFromCourseContentAsync(assessment.Id, courseId, criteria);
        
        return (await FindByIdAsync(assessment.Id))!;
    }

    public async Task<List<AssessmentQuestion>> GenerateQuestionsFromCourseContentAsync(int assessmentId, int courseId, Dictionary<string, object> criteria)
    {
        var course = await _courseService.FindByIdAsync(courseId)
            ?? throw new KeyNotFoundException("Course not found");

        var assignments = await _courseService.GetCourseAssignmentsAsync(courseId);
        var criteriaDate = criteria?.ContainsKey("assessmentDate") == true ? Convert.ToDateTime(criteria["assessmentDate"]) : DateTime.UtcNow;
        var recentAssignments = assignments
            .Where(a => a.AssignmentDate >= criteriaDate.AddDays(-14) && a.AssignmentDate <= criteriaDate)
            .ToList();

        var questions = new List<AssessmentQuestion>();
        var order = 0;
        var totalPoints = 100;
        var questionCount = criteria?.ContainsKey("questionCount") == true ? Convert.ToInt32(criteria["questionCount"]) : 10;
        var difficultyDistributionObj = criteria?.ContainsKey("difficultyDistribution") == true ? criteria["difficultyDistribution"] : null;
        var difficultyDistribution = new Dictionary<string, int>
        {
            ["easy"] = 3,
            ["medium"] = 5,
            ["hard"] = 2
        };
        
        if (difficultyDistributionObj is Dictionary<string, int> dd)
        {
            difficultyDistribution = dd;
        }
        else if (difficultyDistributionObj is Dictionary<string, object> ddo)
        {
            foreach (var kvp in ddo)
            {
                difficultyDistribution[kvp.Key] = Convert.ToInt32(kvp.Value);
            }
        }

        int easyCount = difficultyDistribution.GetValueOrDefault("easy", 3);
        int mediumCount = difficultyDistribution.GetValueOrDefault("medium", 5);
        int hardCount = difficultyDistribution.GetValueOrDefault("hard", 2);

        var topics = recentAssignments
            .SelectMany(a => ExtractTopicsFromAssignment(a))
            .GroupBy(t => t)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .ToList();

        if (!topics.Any())
        {
            topics.AddRange(new[] { "مفاهیم پایه", "حل مسئله", "درک مطلب", "اعمال دانش" });
        }

        var difficulties = new List<string>();
        for (int i = 0; i < easyCount; i++) difficulties.Add("easy");
        for (int i = 0; i < mediumCount; i++) difficulties.Add("medium");
        for (int i = 0; i < hardCount; i++) difficulties.Add("hard");

        var random = new Random();
        difficulties = difficulties.OrderBy(x => random.Next()).ToList();

        for (int i = 0; i < Math.Min(questionCount, difficulties.Count()); i++)
        {
            var difficulty = difficulties[i];
            var topic = topics[i % topics.Count];
            var points = difficulty == "easy" ? 8 : (difficulty == "medium" ? 12 : 15);

            var question = new AssessmentQuestion
            {
                AssessmentId = assessmentId,
                Type = "multiple_choice",
                QuestionText = GenerateQuestionText(topic, difficulty),
                OptionsJson = GenerateOptionsJson(),
                CorrectAnswerJson = JsonSerializer.Serialize(new { correctOption = 0 }),
                Points = points,
                Order = order++,
                Difficulty = difficulty,
                Topic = topic,
                Explanation = GenerateExplanation(topic, difficulty),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            questions.Add(question);
        }

        var totalQuestionPoints = questions.Sum(q => q.Points);
        var scaleFactor = (double)totalPoints / totalQuestionPoints;
        
        foreach (var q in questions)
        {
            q.Points = (int)Math.Round(q.Points * scaleFactor);
        }

        _db.AssessmentQuestions.AddRange(questions);
        await _db.SaveChangesAsync();

        return questions;
    }

    private List<string> ExtractTopicsFromAssignment(Assignment assignment)
    {
        var topics = new List<string>();
        var words = assignment.Title.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var word in words)
        {
            if (word.Length > 2 && !word.All(char.IsDigit))
            {
                topics.Add(word);
            }
        }

        if (assignment.Description.Length > 0)
        {
            var descWords = assignment.Description.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3)
                .Take(3);
            topics.AddRange(descWords);
        }

        return topics.Distinct().ToList();
    }

    private string GenerateQuestionText(string topic, string difficulty)
    {
        var templates = new Dictionary<string, Dictionary<string, string[]>>
        {
            ["easy"] = new Dictionary<string, string[]>
            {
                ["default"] = new[]
                {
                    "کدام یک از موارد زیر مربوط به {0} است؟",
                    "تعریف {0} چیست؟",
                    "مثالی از {0} کدام است؟",
                    "در مورد {0} کدام جمله درست است؟"
                }
            },
            ["medium"] = new Dictionary<string, string[]>
            {
                ["default"] = new[]
                {
                    "تفاوت {0} با مفاهیم مشابه چیست؟",
                    "چگونه {0} را در مسئله‌های واقعی اعمال می‌کنیم؟",
                    "نتیجه اعمال {0} در شرایط {1} چیست؟",
                    "مهم‌ترین نکته در استفاده از {0} چیست؟"
                }
            },
            ["hard"] = new Dictionary<string, string[]>
            {
                ["default"] = new[]
                {
                    "با توجه به سناریوی زیر، بهترین راهکار برای {0} چیست؟",
                    "تحلیل کنید چرا {0} در این شرایط نتیجه {1} را دارد؟",
                    "طراحی یک راه‌حل با استفاده از {0} برای حل مسئله {1}?",
                    "مقایسه و تقابل {0} و {1} در موقعیت پیچیده چیست؟"
                }
            }
        };

        var diffTemplates = templates.GetValueOrDefault(difficulty, templates["easy"]);
        var topicTemplates = diffTemplates.GetValueOrDefault("default", diffTemplates["default"]);
        var random = new Random();
        var template = topicTemplates[random.Next(topicTemplates.Length)];

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

    private string GenerateExplanation(string topic, string difficulty)
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
        var random = new Random();
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