using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class ExperimentalSciencesDataSeeder
{
    private readonly AppDbContext _db;

    public ExperimentalSciencesDataSeeder(AppDbContext db)
    {
        _db = db;
    }

    public async Task SeedAsync()
    {
        if (await _db.ExperimentalSciencesPhases.AnyAsync())
            return;

        // Phase 0: Scientific Method
        var phase0 = new Phase
        {
            Title = "روش علمی و تفکر انتقادی",
            Description = "مبانی علمی و روش‌های تحقیق",
            Order = 0,
            Icon = "science"
        };

        // Phase 1: Physics
        var phase1 = new Phase
        {
            Title = "فیزیک — نیرو و انرژی",
            Description = "آشنایی با قوانین فیزیک و انرژی",
            Order = 1,
            Icon = "physics"
        };

        // Phase 2: Chemistry
        var phase2 = new Phase
        {
            Title = "شیمی — مواد و تغییرات",
            Description = "شناخت مواد و واکنش‌های شیمیایی",
            Order = 2,
            Icon = "chemistry"
        };

        _db.ExperimentalSciencesPhases.AddRange(phase0, phase1, phase2);
        await _db.SaveChangesAsync();

        // Topics for Phase 0
        var topic0_1 = new Topic
        {
            PhaseId = phase0.Id,
            Title = "مشاهده و حواس پنج‌گانه",
            Description = "یادگیری نحوه مشاهده علمی با استفاده از حواس پنج‌گانه",
            Order = 1,
            DifficultyLevel = DifficultyLevel.Child,
            Icon = "eye"
        };

        var topic0_2 = new Topic
        {
            PhaseId = phase0.Id,
            Title = "سوال‌سازی و کنجکاوی",
            Description = "چگونه سوال‌های علمی بپرسیم",
            Order = 2,
            DifficultyLevel = DifficultyLevel.Child,
            Icon = "question"
        };

        var topic0_3 = new Topic
        {
            PhaseId = phase0.Id,
            Title = "فرضیه‌سازی",
            Description = "ساختن فرضیه بر اساس مشاهدات",
            Order = 3,
            DifficultyLevel = DifficultyLevel.Teen,
            Icon = "hypothesis"
        };

        // Topics for Phase 1
        var topic1_1 = new Topic
        {
            PhaseId = phase1.Id,
            Title = "حرکت و سرعت",
            Description = "آشنایی با مفاهیم حرکت، سرعت و شتاب",
            Order = 1,
            DifficultyLevel = DifficultyLevel.Teen,
            Icon = "motion"
        };

        var topic1_2 = new Topic
        {
            PhaseId = phase1.Id,
            Title = "نیرو و قوانین نیوتن",
            Description = "سه قانون نیوتن و کاربرد آن‌ها",
            Order = 2,
            DifficultyLevel = DifficultyLevel.Teen,
            Icon = "force"
        };

        // Topics for Phase 2
        var topic2_1 = new Topic
        {
            PhaseId = phase2.Id,
            Title = "اتم و مولکول",
            Description = "ساختار ماده در مقیاس اتمی",
            Order = 1,
            DifficultyLevel = DifficultyLevel.Teen,
            Icon = "atom"
        };

        _db.ExperimentalSciencesTopics.AddRange(topic0_1, topic0_2, topic0_3, topic1_1, topic1_2, topic2_1);
        await _db.SaveChangesAsync();

        // Lessons for Topic 0_1 (مشاهده)
        var lesson0_1_1 = new Lesson
        {
            TopicId = topic0_1.Id,
            Title = "حواس پنج‌گانه ما",
            Content = "انسان دارای پنج حس اصلی است: بینایی، شنوایی، بویایی، چشایی و لامسه. هر یک از این حواس ابزاری قدرتمند برای شناخت جهان اطراف ماست.",
            VideoUrl = "",
            Order = 1,
            EstimatedMinutes = 15
        };

        var lesson0_1_2 = new Lesson
        {
            TopicId = topic0_1.Id,
            Title = "مشاهده علمی",
            Content = "مشاهده علمی با مشاهده معمولی تفاوت دارد. در مشاهده علمی، ما با دقت و توجه بیشتری به جزئیات نگاه می‌کنیم و یادداشت‌برداری می‌کنیم.",
            VideoUrl = "",
            Order = 2,
            EstimatedMinutes = 20
        };

        // Lessons for Topic 1_1 (حرکت و سرعت)
        var lesson1_1_1 = new Lesson
        {
            TopicId = topic1_1.Id,
            Title = "حرکت چیست؟",
            Content = "حرکت تغییر مکان یک جسم نسبت به یک نقطه مرجع در طول زمان است. برای توصیف حرکت به سه چیز نیاز داریم: نقطه مرجع، مسافت و زمان.",
            VideoUrl = "",
            Order = 1,
            EstimatedMinutes = 25
        };

        _db.ExperimentalSciencesLessons.AddRange(lesson0_1_1, lesson0_1_2, lesson1_1_1);
        await _db.SaveChangesAsync();

        // Experiments
        var experiment1 = new Experiment
        {
            LessonId = lesson0_1_1.Id,
            Title = "آزمایش حس بویایی",
            Materials = "سه لیوان، سرکه، عطر، آب",
            Steps = "1. سه لیوان را آماده کنید\n2. در هر لیوان یکی از مایعات بریزید\n3. چشم‌هایتان را ببندید\n4. از همکلاسی‌تان بخواهید لیوان‌ها را جلوی بینی شما بگیرد\n5. حدس بزنید هر لیوان چیست",
            ExpectedResult = "با استفاده از حس بویایی می‌توانید مایعات مختلف را شناسایی کنید",
            SafetyNotes = "مایعات را بو نکشید، فقط نزدیک بینی نگه دارید",
            Order = 1,
            EstimatedMinutes = 15
        };

        var experiment2 = new Experiment
        {
            LessonId = lesson1_1_1.Id,
            Title = "اندازه‌گیری سرعت",
            Materials = "خط‌کش، کرنومتر، توپ کوچک",
            Steps = "1. مسافت یک متری را علامت‌گذاری کنید\n2. توپ را از نقطه شروع رها کنید\n3. زمان رسیدن توپ به نقطه پایان را اندازه بگیرید\n4. سرعت را حساب کنید: سرعت = مسافت ÷ زمان",
            ExpectedResult = "سرعت توپ را می‌توانید محاسبه کنید",
            SafetyNotes = "مراقب باشید توپ به کسی برخورد نکند",
            Order = 1,
            EstimatedMinutes = 20
        };

        _db.ExperimentalSciencesExperiments.AddRange(experiment1, experiment2);
        await _db.SaveChangesAsync();

        // Quizzes
        var quiz1 = new Quiz
        {
            LessonId = lesson0_1_1.Id,
            Title = "آزمون حواس پنج‌گانه",
            PassingScore = 60,
            TimeLimitMinutes = 5
        };

        _db.ExperimentalSciencesQuizzes.Add(quiz1);
        await _db.SaveChangesAsync();

        // Quiz Questions
        var q1 = new QuizQuestion
        {
            QuizId = quiz1.Id,
            QuestionText = "کدام یک از حواس پنج‌گانه نیست؟",
            Options = "[\"بینایی\", \"شنوایی\", \"فکر کردن\", \"بویایی\"]",
            CorrectAnswer = 2,
            Explanation = "فکر کردن یک حس نیست، بلکه یک فرآیند ذهنی است",
            Order = 1,
            Points = 10
        };

        var q2 = new QuizQuestion
        {
            QuizId = quiz1.Id,
            QuestionText = "با کدام حس می‌توانیم رنگ‌ها را تشخیص دهیم؟",
            Options = "[\"شنوایی\", \"بینایی\", \"لامسه\", \"بویایی\"]",
            CorrectAnswer = 1,
            Explanation = "حس بینایی به ما کمک می‌کند رنگ‌ها را ببینیم",
            Order = 2,
            Points = 10
        };

        var q3 = new QuizQuestion
        {
            QuizId = quiz1.Id,
            QuestionText = "برای اندازه‌گیری طول از کدام حس استفاده می‌کنیم؟",
            Options = "[\"بویایی\", \"شنوایی\", \"لامسه\", \"چشایی\"]",
            CorrectAnswer = 2,
            Explanation = "با لمس کردن اشیا می‌توانیم طول آن‌ها را اندازه بگیریم",
            Order = 3,
            Points = 10
        };

        _db.ExperimentalSciencesQuizQuestions.AddRange(q1, q2, q3);
        await _db.SaveChangesAsync();
    }
}
