using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class SampleDataSeeder
{
    private readonly AppDbContext _db;
    private readonly IUserService _userService;

    public SampleDataSeeder(AppDbContext db, IUserService userService)
    {
        _db = db;
        _userService = userService;
    }

    public async Task SeedAsync()
    {
        if (await _db.Students.AnyAsync())
        {
            Console.WriteLine("⚠️ داده‌های نمونه قبلاً ایجاد شده‌اند");
            return;
        }

        var students = await CreateStudentsAsync();
        // Users are created through OTUH2 — sample user seeding is disabled for centralized auth.
        // await CreateUsersForStudentsAsync(students);
        var courses = await CreateCoursesAsync();
        var assignments = await CreateDailyAssignmentsForCoursesAsync(courses, 36);
        await EnrollStudentsAsync(students, courses);
        await CreateSampleSubmissionsAsync(students, assignments);
        await SeedSubjectAreasAsync();
        await SeedTeachingMethodsAsync();
        await SeedSpiritualPracticeItemsAsync();
        await SeedSpiritualOccasionsAsync();
        await SeedSpiritualPathsAsync();
        await new SurveyDataSeeder(_db).SeedAsync();
    }

    private async Task<List<Student>> CreateStudentsAsync()
    {
        var studentData = new[]
        {
            new { FirstName = "علی", LastName = "احمدی", Email = "ali.ahmadi@example.com", StudentId = "ST001", Phone = "09123456789", Address = "تهران، خیابان ولیعصر", DoB = new DateTime(2005, 3, 15), Gender = "male" },
            new { FirstName = "فاطمه", LastName = "محمدی", Email = "fateme.mohammadi@example.com", StudentId = "ST002", Phone = "09123456790", Address = "تهران، خیابان انقلاب", DoB = new DateTime(2005, 7, 22), Gender = "female" },
            new { FirstName = "محمد", LastName = "رضایی", Email = "mohammad.rezaei@example.com", StudentId = "ST003", Phone = "09123456791", Address = "تهران، خیابان آزادی", DoB = new DateTime(2005, 11, 8), Gender = "male" }
        };

        var students = new List<Student>();
        foreach (var data in studentData)
        {
            var student = new Student
            {
                FirstName = data.FirstName,
                LastName = data.LastName,
                Email = data.Email,
                StudentId = data.StudentId,
                PhoneNumber = data.Phone,
                Address = data.Address,
                DateOfBirth = data.DoB,
                Gender = data.Gender,
                Status = "active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Students.Add(student);
            students.Add(student);
        }
        await _db.SaveChangesAsync();
        return students;
    }

    private async Task CreateUsersForStudentsAsync(List<Student> students)
    {
        var userData = new[]
        {
            new { Username = "ali.ahmadi", Password = "password123", StudentIndex = 0 },
            new { Username = "fateme.mohammadi", Password = "password123", StudentIndex = 1 },
            new { Username = "mohammad.rezaei", Password = "password123", StudentIndex = 2 }
        };

        foreach (var data in userData)
        {
            try
            {
                await _userService.CreateUserAsync(data.Username, data.Password, null, students[data.StudentIndex].Id, "trainee");
            }
            catch
            {
            }
        }
    }

    private async Task<List<Course>> CreateCoursesAsync()
    {
        var courseData = new[]
        {
            new { Title = "قرآن پایه دهم", Description = "درس قرآن برای پایه دهم با تمرکز بر تلاوت و ضبط صدا", Code = "QUR101", Credits = 1, Instructor = "استاد قرآنی", Start = new DateTime(2024, 9, 1), End = new DateTime(2024, 12, 31) },
            new { Title = "ریاضی پایه دهم", Description = "درس ریاضی برای پایه دهم شامل جبر، هندسه و مثلثات", Code = "MATH101", Credits = 3, Instructor = "دکتر محمدی", Start = new DateTime(2024, 9, 1), End = new DateTime(2024, 12, 31) }
        };

        var courses = new List<Course>();
        foreach (var data in courseData)
        {
            var course = new Course
            {
                Title = data.Title,
                Description = data.Description,
                CourseCode = data.Code,
                Credits = data.Credits,
                Instructor = data.Instructor,
                Status = "active",
                StartDate = data.Start,
                EndDate = data.End,
                MaxStudents = 30,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Courses.Add(course);
            courses.Add(course);
        }
        await _db.SaveChangesAsync();
        return courses;
    }

    private async Task<List<Assignment>> CreateDailyAssignmentsForCoursesAsync(List<Course> courses, int days)
    {
        var created = new List<Assignment>();
        var startBase = new DateTime(2024, 9, 1);

        foreach (var course in courses)
        {
            for (int i = 0; i < days; i++)
            {
                var date = startBase.AddDays(i);
                var assignment = new Assignment
                {
                    CourseId = course.Id,
                    Title = $"تکلیف روز {i + 1} {course.Title}",
                    Description = i == 0
                        ? "گوش کن و ضبط کن: صوت روز اول را ۳ بار گوش کن؛ سپس صدای خود را ضبط و ارسال کن"
                        : $"تمرین روز {i + 1} را مطابق دستورالعمل انجام دهید",
                    Type = "homework",
                    MaxScore = 100,
                    AssignmentDate = date,
                    Status = "active",
                    Instructions = i == 0
                        ? "۱) ۳ بار گوش کن ۲) سپس ضبط کن و ارسال کن"
                        : "مطابق دستورالعمل اعلام‌شده در کلاس انجام شود",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Assignments.Add(assignment);
                await _db.SaveChangesAsync();
                created.Add(assignment);

                if (i == 0)
                {
                    var attachments = new[]
                    {
                        new AssignmentAttachment { AssignmentId = assignment.Id, Title = "صوت روز اول (نسخه ۱)", Description = "فایل صوتی راهنما - بار اول", Kind = "audio", Url = "assets/audio/day1_guide_1.mp3", DisplayOrder = 1, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new AssignmentAttachment { AssignmentId = assignment.Id, Title = "صوت روز اول (نسخه ۲)", Description = "فایل صوتی راهنما - بار دوم", Kind = "audio", Url = "assets/audio/day1_guide_2.mp3", DisplayOrder = 2, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                        new AssignmentAttachment { AssignmentId = assignment.Id, Title = "صوت روز اول (نسخه ۳)", Description = "فایل صوتی راهنما - بار سوم", Kind = "audio", Url = "assets/audio/day1_guide_3.mp3", DisplayOrder = 3, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                    };
                    _db.AssignmentAttachments.AddRange(attachments);
                    await _db.SaveChangesAsync();
                }
            }
        }
        return created;
    }

    private async Task EnrollStudentsAsync(List<Student> students, List<Course> courses)
    {
        foreach (var student in students)
        {
            foreach (var course in courses)
            {
                var enrollment = new StudentCourse
                {
                    StudentId = student.Id,
                    CourseId = course.Id,
                    EnrollmentDate = DateTime.UtcNow,
                    Status = "enrolled",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.StudentCourses.Add(enrollment);
            }
        }
        await _db.SaveChangesAsync();
    }

    private async Task CreateSampleSubmissionsAsync(List<Student> students, List<Assignment> assignments)
    {
        var today = DateTime.UtcNow;
        var rng = new Random();

        foreach (var student in students)
        {
            foreach (var assignment in assignments)
            {
                if (assignment.AssignmentDate > today) continue;

                var isCompleted = rng.NextDouble() > 0.2;
                var dailyScore = rng.Next(70, 101);

                var submission = new AssignmentSubmission
                {
                    StudentId = student.Id,
                    AssignmentId = assignment.Id,
                    SubmissionDate = assignment.AssignmentDate,
                    DailyScore = dailyScore,
                    CumulativeScore = dailyScore,
                    Status = isCompleted ? "submitted" : "pending",
                    IsCompleted = isCompleted,
                    TimeSpent = isCompleted ? rng.Next(30, 90) : 0,
                    Notes = isCompleted ? "تمرین روزانه تکمیل شد" : null,
                    AudioFileUrl = isCompleted ? $"uploads/audio/{student.Id}_{assignment.Id}.mp3" : null,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.AssignmentSubmissions.Add(submission);
            }
        }
        await _db.SaveChangesAsync();
    }

    private async Task SeedSubjectAreasAsync()
    {
        if (await _db.SubjectAreas.AnyAsync()) return;

        var areas = new[]
        {
            new { Key = "quran", Name = "قرآن", Description = "آموزش قرآن کریم شامل روخوانی، روان‌خوانی، تجوید و حفظ", SortOrder = 1 },
            new { Key = "ahkam", Name = "احکام", Description = "آموزش احکام شرعی بر اساس رساله مرجع تقلید", SortOrder = 2 },
            new { Key = "aqayed", Name = "عقاید", Description = "آموزش مبانی اعتقادی و اصول دین", SortOrder = 3 },
            new { Key = "akhlaq", Name = "اخلاق", Description = "آموزش مبانی اخلاقی و تهذیب نفس", SortOrder = 4 },
            new { Key = "tarikh", Name = "تاریخ", Description = "آموزش تاریخ اسلام و تشیع", SortOrder = 5 },
            new { Key = "sireh", Name = "سیره معصومین", Description = "آموزش سیره و زندگی معصومین علیهم السلام", SortOrder = 6 },
            new { Key = "manteq", Name = "منطق", Description = "آموزش علم منطق و قواعد استدلال", SortOrder = 7 },
            new { Key = "falsafeh", Name = "فلسفه", Description = "آموزش مبانی فلسفه اسلامی", SortOrder = 8 },
            new { Key = "feqh", Name = "فقه", Description = "آموزش فقه استدلالی و مسائل شرعی", SortOrder = 9 },
            new { Key = "osul", Name = "اصول", Description = "آموزش اصول فقه و مبانی استنباط", SortOrder = 10 },
            new { Key = "tajvid", Name = "تجوید", Description = "آموزش قواعد تجوید و قرائت صحیح قرآن", SortOrder = 11 },
            new { Key = "tfsir", Name = "تفسیر", Description = "آموزش تفسیر قرآن کریم", SortOrder = 12 },
            new { Key = "hadith", Name = "حدیث", Description = "آموزش علوم حدیث و متون روایی", SortOrder = 13 },
            new { Key = "erfan", Name = "عرفان", Description = "آموزش عرفان اسلامی و سیر و سلوک", SortOrder = 14 },
            new { Key = "lughat", Name = "لغت عربی", Description = "آموزش لغت و صرف و نحو عربی", SortOrder = 15 },
            new { Key = "balaghah", Name = "بلاغت", Description = "آموزش علوم بلاغی (معانی، بیان، بدیع)", SortOrder = 16 },
            new { Key = "tarbiat", Name = "تربیت", Description = "آموزش مبانی تربیتی و روش‌های پرورش", SortOrder = 17 },
            new { Key = "ejtemae", Name = "اجتماعی", Description = "آموزش مبانی اجتماعی و سیاسی اسلام", SortOrder = 18 },
            new { Key = "tarbiat-badani", Name = "تربیت بدنی", Description = "آموزش ورزش و تربیت بدنی متناسب با فرهنگ اسلامی", SortOrder = 19 },
            new { Key = "fani-va-herfeh", Name = "فنی و حرفه‌ای", Description = "آموزش مهارت‌های فنی و حرفه‌ای", SortOrder = 20 }
        };

        foreach (var a in areas)
        {
            _db.SubjectAreas.Add(new SubjectArea
            {
                Key = a.Key,
                Name = a.Name,
                Description = a.Description,
                SortOrder = a.SortOrder
            });
        }
        await _db.SaveChangesAsync();
        Console.WriteLine($"✅ {areas.Length} حوزه درسی ایجاد شد");
    }

    private async Task SeedTeachingMethodsAsync()
    {
        if (await _db.TeachingMethods.AnyAsync()) return;

        var methods = new[]
        {
            new { Key = "lecture", Name = "سخنرانی", Description = "ارائه مطالب توسط مربی به صورت شفاهی", SortOrder = 1 },
            new { Key = "qa", Name = "پرسش و پاسخ", Description = "تعامل دوسویه مربی و متربی با پرسش و پاسخ", SortOrder = 2 },
            new { Key = "discussion", Name = "بحث گروهی", Description = "بحث و گفتگوی گروهی درباره یک موضوع مشخص", SortOrder = 3 },
            new { Key = "memorization", Name = "حفظ", Description = "حفظ آیات، روایات یا اشعار", SortOrder = 4 },
            new { Key = "practice", Name = "تمرین عملی", Description = "انجام تمرین عملی توسط متربی", SortOrder = 5 },
            new { Key = "storytelling", Name = "قصه‌گویی", Description = "بیان داستان‌های آموزنده و تربیتی", SortOrder = 6 },
            new { Key = "roleplay", Name = "نقش‌آفرینی", Description = "ایفای نقش توسط متربیان برای درک بهتر مفاهیم", SortOrder = 7 },
            new { Key = "project", Name = "پروژه تحقیقاتی", Description = "انجام تحقیق و پروژه توسط متربی", SortOrder = 8 },
            new { Key = "visual", Name = "تصویری", Description = "استفاده از تصاویر، نمودارها و فیلم‌های آموزشی", SortOrder = 9 },
            new { Key = "recitation", Name = "تلاوت", Description = "تلاوت و شنیدن قرآن و متون دینی", SortOrder = 10 },
            new { Key = "writing", Name = "نوشتاری", Description = "انجام تکالیف کتبی و انشا", SortOrder = 11 },
            new { Key = "gamification", Name = "بازی و سرگرمی", Description = "آموزش از طریق بازی و مسابقه", SortOrder = 12 },
            new { Key = "field-trip", Name = "بازدید و اردو", Description = "آموزش در محیط بیرون از کلاس", SortOrder = 13 },
            new { Key = "peer-learning", Name = "یادگیری همتا", Description = "آموزش توسط هم‌کلاسی‌ها و مربی‌گری همتا", SortOrder = 14 },
            new { Key = "questionnaire", Name = "پرسشنامه", Description = "استفاده از پرسشنامه برای سنجش و یادگیری", SortOrder = 15 },
            new { Key = "demonstration", Name = "نمایش عملی", Description = "اجرای عملی توسط مربی و مشاهده متربی", SortOrder = 16 },
            new { Key = "brainstorming", Name = "طوفان فکری", Description = "تولید ایده توسط گروه درباره یک موضوع", SortOrder = 17 },
            new { Key = "problem-solving", Name = "حل مسئله", Description = "ارائه مسئله و یافتن راه حل توسط متربی", SortOrder = 18 }
        };

        foreach (var m in methods)
        {
            _db.TeachingMethods.Add(new TeachingMethod
            {
                Key = m.Key,
                Name = m.Name,
                Description = m.Description,
                SortOrder = m.SortOrder
            });
        }
        await _db.SaveChangesAsync();
        Console.WriteLine($"✅ {methods.Length} روش تدریس ایجاد شد");
    }

    private async Task SeedSpiritualPracticeItemsAsync()
    {
        if (await _db.SpiritualPracticeItems.AnyAsync()) return;

        var items = new (string Key, string TitleFa, string? DescriptionFa, string StepKind, int? MinAge, int? MaxAge, string GenderMask, string RoleMask, int SortOrder)[]
        {
            ("pledge.child.daily", "تعهد روزانه", "تعهد می‌کنم امروز نمازهایم را اول وقت بخوانم", "pledge", 6, 9, "mixed", "*", 1),
            ("pledge.child.quran", "تعهد قرآنی", "تعهد می‌کنم امروز حداقل ۵ آیه از قرآن را بخوانم", "pledge", 6, 9, "mixed", "*", 2),
            ("pledge.child.parents", "تعهد به والدین", "تعهد می‌کنم امروز به پدر و مادرم احترام بگذارم و اطاعت کنم", "pledge", 6, 9, "mixed", "*", 3),
            ("pledge.youth.morning", "تعهد صبحگاهی", "تعهد می‌کنم امروز نماز صبح را اول وقت بخوانم و اذکار صبح را بگویم", "pledge", 10, 14, "mixed", "*", 4),
            ("pledge.youth.study", "تعهد تحصیلی", "تعهد می‌کنم امروز حداقل ۲ ساعت مطالعه مفید داشته باشم", "pledge", 10, 14, "mixed", "*", 5),
            ("pledge.youth.help", "تعهد کمک به دیگران", "تعهد می‌کنم امروز به یکی از نیازمندان یا اعضای خانواده کمک کنم", "pledge", 10, 14, "mixed", "*", 6),
            ("pledge.adult.self", "تعهد خودسازی", "تعهد می‌کنم امروز یک گام در مسیر خودسازی بردارم", "pledge", 15, null, "mixed", "*", 7),
            ("monitor.child.prayer", "مراقبه نماز", "آیا نمازهای امروز را اول وقت خواندی؟", "monitoring", 6, 9, "mixed", "*", 8),
            ("monitor.child.behavior", "مراقبه رفتار", "آیا امروز با دیگران مهربان بودی و احترام کردی؟", "monitoring", 6, 9, "mixed", "*", 9),
            ("monitor.youth.prayer", "مراقبه نماز اول وقت", "آیا تمام نمازهای امروز را در اول وقت خواندی؟", "monitoring", 10, 14, "mixed", "*", 10),
            ("monitor.youth.screen", "مراقبه فضای مجازی", "آیا استفاده از فضای مجازی امروز در حد مجاز بود؟", "monitoring", 10, 14, "mixed", "*", 11),
            ("monitor.youth.study", "مراقبه مطالعه", "آیا به تعهد تحصیلی امروز عمل کردی؟", "monitoring", 10, 14, "mixed", "*", 12),
            ("account.daily", "حساب‌کشی روزانه", "امروز را محاسبه کن: چند ساعت مفید، چند ساعت بیهوده؟", "accounting", 8, null, "mixed", "*", 13),
            ("account.goals", "محاسبه اهداف", "چند درصد از اهداف امروز را محقق کردی؟", "accounting", 10, null, "mixed", "*", 14),
            ("reprimand.self", "عاتبه نفس", "آیا از عملکرد امروز خود راضی هستی؟ اگر نه، خود را ملامت کن", "reprimand", 8, null, "mixed", "*", 15),
            ("reprimand.repent", "توبه و استغفار", "برای کوتاهی‌های امروز استغفار کن و تصمیم بر اصلاح بگیر", "reprimand", 10, null, "mixed", "*", 16),
            ("discipline.extra", "عمل اضافه", "یک کار نیک اضافی امروز انجام بده (مثل تسبیح، صدقه، کمک)", "discipline", 6, null, "mixed", "*", 17),
            ("discipline.penance", "جبران کوتاهی", "اگر در وظیفه‌ای کوتاهی کردی، یک کار جبرانی انجام بده", "discipline", 8, null, "mixed", "*", 18),
        };

        foreach (var item in items)
        {
            _db.SpiritualPracticeItems.Add(new SpiritualPracticeItem
            {
                Key = item.Key,
                TitleFa = item.TitleFa,
                DescriptionFa = item.DescriptionFa,
                StepKind = item.StepKind,
                MinAge = item.MinAge,
                MaxAge = item.MaxAge,
                GenderMask = item.GenderMask,
                RoleMask = item.RoleMask,
                SortOrder = item.SortOrder,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }
        await _db.SaveChangesAsync();
        Console.WriteLine($"✅ {items.Length} آیین نامه معنوی ایجاد شد");
    }

    private async Task SeedSpiritualOccasionsAsync()
    {
        if (await _db.SpiritualOccasions.AnyAsync()) return;

        var occasions = new (string Key, string TitleFa, string? DescriptionFa, int? HijriMonth, int? HijriDay, string GenderMask, int SortOrder)[]
        {
            ("ramadan", "ماه رمضان", "ماه مبارک رمضان، ماه نزول قرآن و ضیافت الهی", 9, 1, "mixed", 1),
            ("qadr-night-1", "شب قدر (۱۹ رمضان)", "شب ضربت خوردن حضرت علی (ع)", 9, 19, "mixed", 2),
            ("qadr-night-2", "شب قدر (۲۱ رمضان)", "شب شهادت حضرت علی (ع)", 9, 21, "mixed", 3),
            ("qadr-night-3", "شب قدر (۲۳ رمضان)", "احیا شب ۲۳ رمضان", 9, 23, "mixed", 4),
            ("eid-fitr", "عید فطر", "عید پایان ماه رمضان", 10, 1, "mixed", 5),
            ("eid-adha", "عید قربان", "عید قربان، روز عبادت و بندگی", 12, 10, "mixed", 6),
            ("eid-ghadir", "عید غدیر", "عید بزرگ غدیر خم، روز ولایت", 12, 18, "mixed", 7),
            ("ashura", "عاشورا", "روز شهادت امام حسین (ع) و یاران باوفایش", 1, 10, "mixed", 8),
            ("arbaeen", "اربعین", "چهلمین روز شهادت امام حسین (ع)", 2, 20, "mixed", 9),
            ("mabath", "مبعث", "مبعث رسول اکرم (ص) به پیامبری", 7, 27, "mixed", 10),
            ("norooz", "نوروز باستانی", "آغاز سال جدید شمسی، تحول و نوآوری", null, null, "mixed", 11),
            ("15-shaban", "نیمه شعبان", "ولادت حضرت مهدی (عج)", 8, 15, "mixed", 12),
        };

        foreach (var o in occasions)
        {
            _db.SpiritualOccasions.Add(new SpiritualOccasion
            {
                Key = o.Key,
                TitleFa = o.TitleFa,
                DescriptionFa = o.DescriptionFa,
                HijriMonth = o.HijriMonth,
                HijriDay = o.HijriDay,
                GenderMask = o.GenderMask,
                SortOrder = o.SortOrder,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }
        await _db.SaveChangesAsync();
        Console.WriteLine($"✅ {occasions.Length} مناسبت معنوی ایجاد شد");
    }

    private async Task SeedSpiritualPathsAsync()
    {
        if (await _db.SpiritualPaths.AnyAsync()) return;

        // پسران: قرآن، طلبگی، مربی‌گری، کسب و کار، آینده تحصیلی متعارف
        var paths = new[]
        {
            new { Key = "quran", TitleFa = "مسیر قرآنی", DescriptionFa = "حفظ، تفسیر و آموزش قرآن کریم و فعالیت‌های قرآنی", GenderMask = "mixed", SortOrder = 1, AgeEntryPoint = 9, AgeFinalizePoint = 10, Status = "active" },
            new { Key = "talabgi", TitleFa = "مسیر طلبگی", DescriptionFa = "تحصیل علوم حوزوی و مقدمات اجتهاد", GenderMask = "mixed", SortOrder = 2, AgeEntryPoint = 9, AgeFinalizePoint = 10, Status = "active" },
            new { Key = "morabbegi", TitleFa = "مسیر مربی‌گری", DescriptionFa = "تربیت مربی و آموزش روش‌های تربیتی برای نسل آینده", GenderMask = "mixed", SortOrder = 3, AgeEntryPoint = 9, AgeFinalizePoint = 10, Status = "active" },
            new { Key = "business", TitleFa = "مسیر کسب و کار", DescriptionFa = "کارآفرینی، مهارت‌های کسب و کار و مدیریت اقتصادی", GenderMask = "male", SortOrder = 4, AgeEntryPoint = 9, AgeFinalizePoint = 10, Status = "active" },
            new { Key = "standard_academic", TitleFa = "مسیر تحصیلی متعارف", DescriptionFa = "تحصیل در رشته‌های دانشگاهی و علمی مرسوم", GenderMask = "mixed", SortOrder = 5, AgeEntryPoint = 9, AgeFinalizePoint = 10, Status = "active" },
            new { Key = "home_children", TitleFa = "مسیر خانه‌داری و تربیت فرزند", DescriptionFa = "مهارت‌های همسرداری، خانه‌داری و تربیت فرزندان صالح", GenderMask = "female", SortOrder = 1, AgeEntryPoint = 9, AgeFinalizePoint = 10, Status = "active" },
        };

        foreach (var p in paths)
        {
            _db.SpiritualPaths.Add(new SpiritualPath
            {
                Key = p.Key,
                TitleFa = p.TitleFa,
                DescriptionFa = p.DescriptionFa,
                GenderMask = p.GenderMask,
                SortOrder = p.SortOrder,
                AgeEntryPoint = p.AgeEntryPoint,
                AgeFinalizePoint = p.AgeFinalizePoint,
                Status = p.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }
        await _db.SaveChangesAsync();
        Console.WriteLine($"✅ {paths.Length} مسیر آینده‌سازی ایجاد شد");
    }
}
