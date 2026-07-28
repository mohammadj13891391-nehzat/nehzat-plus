using EducationalPlatform.Nehzat.Domain.Entities.Math;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class MathDataSeeder
{
    private readonly AppDbContext _db;

    public MathDataSeeder(AppDbContext db)
    {
        _db = db;
    }

    public async Task SeedAsync()
    {
        if (await _db.MathTopics.AnyAsync())
            return;

        var algebra = new MathTopic
        {
            Title = "جبر",
            Description = "شاخه‌ای از ریاضیات که با نمادها و قواعد عملیات روی آن‌ها سر و کار دارد",
            DifficultyLevel = "ابتدایی",
            DisplayOrder = 1,
            IsActive = true,
            IconUrl = "assets/math/algebra.png"
        };

        var geometry = new MathTopic
        {
            Title = "هندسه",
            Description = "شاخه‌ای از ریاضیات که با اشکال، اندازه‌ها و ویژگی‌های فضایی سر و کار دارد",
            DifficultyLevel = "متوسط",
            DisplayOrder = 2,
            IsActive = true,
            IconUrl = "assets/math/geometry.png"
        };

        var calculus = new MathTopic
        {
            Title = "حسابان",
            Description = "شاخه‌ای از ریاضیات که با تغییرات پیوسته سر و کار دارد",
            DifficultyLevel = "پیشرفته",
            DisplayOrder = 3,
            IsActive = true,
            IconUrl = "assets/math/calculus.png"
        };

        _db.MathTopics.AddRange(algebra, geometry, calculus);
        await _db.SaveChangesAsync();

        var algebraLesson1 = new MathLesson
        {
            Title = "مقدمه‌ای بر جبر",
            Content = "جبر شاخه‌ای از ریاضیات است که در آن از حروف و نمادها برای نشان دادن اعداد استفاده می‌شود.",
            Summary = "آشنایی با مفاهیم پایه جبر",
            DurationMinutes = 30,
            DisplayOrder = 1,
            IsPublished = true,
            MathTopicId = algebra.Id
        };

        var algebraLesson2 = new MathLesson
        {
            Title = "معادلات خطی",
            Content = "معادله خطی معادله‌ای است که در آن بیشترین توان متغیر، یک است.",
            Summary = "حل معادلات خطی در یک متغیر",
            DurationMinutes = 45,
            DisplayOrder = 2,
            IsPublished = true,
            MathTopicId = algebra.Id
        };

        var geometryLesson1 = new MathLesson
        {
            Title = "هندسه اقلیدسی",
            Content = "هندسه اقلیدسی سیستم ریاضی است که توسط اقلیدس بنا نهاده شده است.",
            Summary = "مفاهیم پایه هندسه اقلیدسی",
            DurationMinutes = 40,
            DisplayOrder = 1,
            IsPublished = true,
            MathTopicId = geometry.Id
        };

        var geometryLesson2 = new MathLesson
        {
            Title = "مثلثات",
            Content = "مثلثات شاخه‌ای از ریاضیات است که روابط بین زوایا و اضلاع مثلث‌ها را بررسی می‌کند.",
            Summary = "آشنایی با توابع مثلثاتی",
            DurationMinutes = 50,
            DisplayOrder = 2,
            IsPublished = true,
            MathTopicId = geometry.Id
        };

        var calculusLesson1 = new MathLesson
        {
            Title = "لگاریتم و توان",
            Content = "لگاریتم تابعی است که توان مورد نیاز برای رسیدن به یک عدد را مشخص می‌کند.",
            Summary = "مفاهیم لگاریتم و توان",
            DurationMinutes = 35,
            DisplayOrder = 1,
            IsPublished = true,
            MathTopicId = calculus.Id
        };

        var calculusLesson2 = new MathLesson
        {
            Title = "مشتق",
            Content = "مشتق سرعت تغییر یک تابع نسبت به متغیر مستقل است.",
            Summary = "آشنایی با مفهوم مشتق",
            DurationMinutes = 55,
            DisplayOrder = 2,
            IsPublished = true,
            MathTopicId = calculus.Id
        };

        _db.MathLessons.AddRange(algebraLesson1, algebraLesson2, geometryLesson1, geometryLesson2, calculusLesson1, calculusLesson2);
        await _db.SaveChangesAsync();

        var algebraQuestion1 = new MathQuestion
        {
            QuestionText = "اگر x + 5 = 12 باشد، x چقدر است؟",
            OptionA = "5",
            OptionB = "6",
            OptionC = "7",
            OptionD = "8",
            CorrectOption = "C",
            Explanation = "x = 12 - 5 = 7",
            DifficultyLevel = "ابتدایی",
            Points = 10,
            MathLessonId = algebraLesson1.Id
        };

        var algebraQuestion2 = new MathQuestion
        {
            QuestionText = "حل معادله 2x - 3 = 7",
            OptionA = "4",
            OptionB = "5",
            OptionC = "6",
            OptionD = "3",
            CorrectOption = "B",
            Explanation = "2x = 10, x = 5",
            DifficultyLevel = "ابتدایی",
            Points = 10,
            MathLessonId = algebraLesson2.Id
        };

        var geometryQuestion1 = new MathQuestion
        {
            QuestionText = "مجموع زوایای داخلی یک مثلث چقدر است؟",
            OptionA = "90 درجه",
            OptionB = "180 درجه",
            OptionC = "270 درجه",
            OptionD = "360 درجه",
            CorrectOption = "B",
            Explanation = "مجموع زوایای داخلی مثلث همیشه 180 درجه است",
            DifficultyLevel = "متوسط",
            Points = 10,
            MathLessonId = geometryLesson1.Id
        };

        var geometryQuestion2 = new MathQuestion
        {
            QuestionText = "sin(30°) چقدر است؟",
            OptionA = "1/2",
            OptionB = "1",
            OptionC = "√3/2",
            OptionD = "1/√2",
            CorrectOption = "A",
            Explanation = "sin(30°) = 1/2",
            DifficultyLevel = "متوسط",
            Points = 10,
            MathLessonId = geometryLesson2.Id
        };

        var calculusQuestion1 = new MathQuestion
        {
            QuestionText = "log₂(8) چقدر است؟",
            OptionA = "2",
            OptionB = "3",
            OptionC = "4",
            OptionD = "8",
            CorrectOption = "B",
            Explanation = "2³ = 8 پس log₂(8) = 3",
            DifficultyLevel = "پیشرفته",
            Points = 15,
            MathLessonId = calculusLesson1.Id
        };

        var calculusQuestion2 = new MathQuestion
        {
            QuestionText = "مشتق تابع x² چقدر است؟",
            OptionA = "x",
            OptionB = "2x",
            OptionC = "x²",
            OptionD = "2",
            CorrectOption = "B",
            Explanation = "d/dx(x²) = 2x",
            DifficultyLevel = "پیشرفته",
            Points = 15,
            MathLessonId = calculusLesson2.Id
        };

        _db.MathQuestions.AddRange(algebraQuestion1, algebraQuestion2, geometryQuestion1, geometryQuestion2, calculusQuestion1, calculusQuestion2);
        await _db.SaveChangesAsync();

        var scholars = new List<MathScholar>
        {
            new MathScholar
            {
                Name = "محمد بن موسی خوارزمی",
                NameArabic = "الخوارزمي",
                BirthYear = "780",
                DeathYear = "850",
                BirthPlace = "خوارزم",
                Biography = "ریاضیدان و ستاره‌شناس ایرانی که به پدر علم جبر معروف است",
                ImageUrl = "assets/scholars/khwarizmi.jpg",
                KnownFor = "جبر، الگوریتم"
            },
            new MathScholar
            {
                Name = "ابوعلی حسن بن هیثم",
                NameArabic = "ابن الهيثم",
                BirthYear = "965",
                DeathYear = "1040",
                BirthPlace = "بصره",
                Biography = "فیزیک‌دان و ریاضیدان عرب که به پدر علم اپتیک معروف است",
                ImageUrl = "assets/scholars/ibn_alhaytham.jpg",
                KnownFor = "اپتیک، هندسه"
            },
            new MathScholar
            {
                Name = "ابوریحان بیرونی",
                NameArabic = "البيروني",
                BirthYear = "973",
                DeathYear = "1048",
                BirthPlace = "خوارزم",
                Biography = "دانشمند ایرانی که در زمینه‌های نجوم، ریاضیات و جغرافیا فعالیت می‌کرد",
                ImageUrl = "assets/scholars/biruni.jpg",
                KnownFor = "نجوم، ریاضیات، جغرافیا"
            },
            new MathScholar
            {
                Name = "ابنسینا",
                NameArabic = "ابن سينا",
                BirthYear = "980",
                DeathYear = "1037",
                BirthPlace = "بخارا",
                Biography = "فیلسوف و پزشک و ریاضیدان ایرانی که به پدر علم پزشکی معروف است",
                ImageUrl = "assets/scholars/avicenna.jpg",
                KnownFor = "پزشکی، فلسفه، ریاضیات"
            }
        };

        _db.MathScholars.AddRange(scholars);
        await _db.SaveChangesAsync();

        var contributions = new List<MathContribution>
        {
            new MathContribution
            {
                MathScholarId = scholars[0].Id,
                MathTopicId = algebra.Id,
                Title = "تالیف کتاب المختصر در حساب الجبر و المقابلة",
                Description = "اولین کتاب در زمینه جبر که مفاهیم پایه این شاخه را بنا نهاد",
                YearRange = "820-830"
            },
            new MathContribution
            {
                MathScholarId = scholars[1].Id,
                MathTopicId = geometry.Id,
                Title = "کتاب المناظر",
                Description = "اثر بزرگ در زمینه اپتیک که پایه‌های علم اپتیک مدرن را بنیان نهاد",
                YearRange = "1011-1021"
            },
            new MathContribution
            {
                MathScholarId = scholars[2].Id,
                MathTopicId = calculus.Id,
                Title = "کتاب التنجیم",
                Description = "اثر بزرگ در زمینه نجوم و ریاضیات کاربردی",
                YearRange = "1020-1030"
            }
        };

        _db.MathContributions.AddRange(contributions);
        await _db.SaveChangesAsync();
    }
}
