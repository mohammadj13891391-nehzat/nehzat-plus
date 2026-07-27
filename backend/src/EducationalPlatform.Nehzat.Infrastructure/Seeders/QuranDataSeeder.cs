using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class QuranDataSeeder
{
    private readonly AppDbContext _db;
    private readonly string _quranDataPath;
    private const int BATCH_SIZE = 500;

    public QuranDataSeeder(AppDbContext db)
    {
        _db = db;
        // The quran_text.json is located in the Quran project folder relative to the repo root
        var solutionDir = AppContext.BaseDirectory;
        // Walk up until we find the Quran folder or reach a reasonable limit
        var candidate = solutionDir;
        for (int i = 0; i < 10; i++)
        {
            var testPath = Path.Combine(candidate, "Quran", "quran_text.json");
            if (File.Exists(testPath))
            {
                _quranDataPath = testPath;
                return;
            }
            candidate = Path.GetDirectoryName(candidate)!;
        }
        // Fallback: try well-known paths
        _quranDataPath = Path.Combine("D:", "nehzat-plus", "Quran", "quran_text.json");
    }

    public async Task SeedAsync()
    {
        if (await _db.Surahs.AnyAsync())
            return;

        await SeedRecitationLevelsAsync();
        await _db.SaveChangesAsync();
        _db.ChangeTracker.Clear();

        await SeedTajweedRulesAsync();
        await _db.SaveChangesAsync();
        _db.ChangeTracker.Clear();

        await SeedCurriculaAsync();
        await _db.SaveChangesAsync();
        _db.ChangeTracker.Clear();

        await SeedSurahsAndAyahsAsync();
    }

    private async Task SeedRecitationLevelsAsync()
    {
        var levels = new[]
        {
            new RecitationLevel
            {
                LevelNumber = 1,
                Name = "مبتدی - حفظ سوره‌های کوتاه",
                Description = "سطح مبتدیانه برای آشنایی اولیه با قرآن و حفظ سوره‌های کوتاه",
                Criteria = "قراءت صحیح حرف‌ها، حفظ 5 سوره کوتاه اول",
                ColorCode = "#4CAF50",
                PointsRequired = 100,
                EstimatedWeeks = 4,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new RecitationLevel
            {
                LevelNumber = 2,
                Name = "متوسط - حفظ سوره‌های متوسط",
                Description = "ادامه حفظ سوره‌های متوسط و تمرین تجوید اولیه",
                Criteria = "حفظ 10 سوره متوسط، تجوید اصولی",
                ColorCode = "#2196F3",
                PointsRequired = 300,
                EstimatedWeeks = 8,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new RecitationLevel
            {
                LevelNumber = 3,
                Name = "پیشرفته - حفظ سوره‌های بلند",
                Description = "حفظ سوره‌های بلند و ارتقای تجوید پیشرفته",
                Criteria = "حفظ 5 سوره بلند، تجوید کامل",
                ColorCode = "#FF9800",
                PointsRequired = 600,
                EstimatedWeeks = 16,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new RecitationLevel
            {
                LevelNumber = 4,
                Name = "پیشرفته - حفظ کامل قرآن",
                Description = "حفظ کامل قرآن کریم و تسلط کامل بر تجوید",
                Criteria = "حفظ 30 جزء قرآن، تجوید حرفه‌ای",
                ColorCode = "#9C27B0",
                PointsRequired = 1500,
                EstimatedWeeks = 40,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _db.RecitationLevels.AddRangeAsync(levels);
    }

    private async Task SeedTajweedRulesAsync()
    {
        var rules = new[]
        {
            new TajweedRule
            {
                RuleCode = "T01",
                Name = "قوانین الف",
                Description = "قوانین مربوط به حرف الف و صداهای آن",
                ExampleText = "آ",
                RuleLevel = 1,
                AffectedRecitationType = "all",
                Guidelines = "الف‌های مقدر و مجرور",
                SurahId = 1,
                AyahNumber = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new TajweedRule
            {
                RuleCode = "T02",
                Name = "قوانین ضمه و فتحه",
                Description = "قوانین مربوط به ضمه و فتحه و اثرات آن‌ها",
                ExampleText = "ضمه، فتحه",
                RuleLevel = 1,
                AffectedRecitationType = "all",
                Guidelines = "الماثلة والمعتلة",
                SurahId = 1,
                AyahNumber = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new TajweedRule
            {
                RuleCode = "T03",
                Name = "قوانین راء",
                Description = "قوانین مربوط به حرف راء و صدای آن",
                ExampleText = "ر",
                RuleLevel = 1,
                AffectedRecitationType = "all",
                Guidelines = "راء غنة و راء تکرار",
                SurahId = 1,
                AyahNumber = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new TajweedRule
            {
                RuleCode = "T04",
                Name = "قانون ایخاء",
                Description = "قانون ادغام حروف همزه با حروف قبلی",
                ExampleText = "ایخاء غنة و ایخاء مشدول",
                RuleLevel = 2,
                AffectedRecitationType = "all",
                Guidelines = "ایخاء بین دو ساکن یا ساکن و متحرک",
                SurahId = 1,
                AyahNumber = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new TajweedRule
            {
                RuleCode = "T05",
                Name = "قانون المد",
                Description = "قوانین مد و انواع آن",
                ExampleText = "مد طویل، مد مفتوح، مد بحری",
                RuleLevel = 2,
                AffectedRecitationType = "all",
                Guidelines = "مدهای فعلی و مدهای غیر فعلی",
                SurahId = 1,
                AyahNumber = 3,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new TajweedRule
            {
                RuleCode = "T06",
                Name = "قانون القلب",
                Description = "قانون تغییر مخرج حرف بدون تغییر صدا",
                ExampleText = "ب را به م را تبدیل کنید",
                RuleLevel = 3,
                AffectedRecitationType = "all",
                Guidelines = "القلب من لام به لام و غیره",
                SurahId = 1,
                AyahNumber = 4,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new TajweedRule
            {
                RuleCode = "T07",
                Name = "قانون الإخفاء",
                Description = "قانون پنهان کردن صدای حرف معجمی",
                ExampleText = "إخفاء شده و إخفاء مشدول",
                RuleLevel = 2,
                AffectedRecitationType = "all",
                Guidelines = "إخفاء بین ساکن و متحرک",
                SurahId = 1,
                AyahNumber = 5,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new TajweedRule
            {
                RuleCode = "T08",
                Name = "قانون الإدغام",
                Description = "قانون ادغام صداها",
                ExampleText = "إدغام مشابه و إدغام غیر مشابه",
                RuleLevel = 3,
                AffectedRecitationType = "all",
                Guidelines = "الإدغام بين الحروف المتصلة",
                SurahId = 1,
                AyahNumber = 6,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _db.TajweedRules.AddRangeAsync(rules);
    }

    private async Task SeedCurriculaAsync()
    {
        var curricula = new[]
        {
            new QuranCurriculum
            {
                Title = "برنامه حفظ سوره‌های کوتاه (۱-۱۰)",
                Description = "برنامه حفظ 10 سوره کوتاه اول قرآن برای مبتدیان",
                Language = "fa",
                StartSurah = 1,
                EndSurah = 10,
                TotalAyahs = 108,
                EstimatedDays = 28,
                DifficultyLevel = "beginner",
                LearningObjectives = "آشنایی با حروف قرآن، قراءت صحیح، حفظ سوره‌های کوتاه",
                TeacherId = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new QuranCurriculum
            {
                Title = "برنامه حفظ سوره‌های متوسط (۱۱-۵۰)",
                Description = "برنامه حفظ سوره‌های متوسط قرآن برای دانش‌آموزان متوسط",
                Language = "fa",
                StartSurah = 11,
                EndSurah = 50,
                TotalAyahs = 1230,
                EstimatedDays = 60,
                DifficultyLevel = "intermediate",
                LearningObjectives = "تقویت تجوید، حفظ سوره‌های متوسط، درک معانی",
                TeacherId = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new QuranCurriculum
            {
                Title = "برنامه حفظ سوره‌های بلند (۵۱-۱۱۴)",
                Description = "برنامه حفظ سوره‌های بلند قرآن برای پیشرفته‌ها",
                Language = "fa",
                StartSurah = 51,
                EndSurah = 114,
                TotalAyahs = 4930,
                EstimatedDays = 120,
                DifficultyLevel = "advanced",
                LearningObjectives = "تسلط کامل بر تجوید، حفظ سوره‌های بلند، تفسیر مقدماتی",
                TeacherId = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new QuranCurriculum
            {
                Title = "برنامه جامع حفظ کامل قرآن",
                Description = "برنامه جامع حفظ کل قرآن کریم در 30 جزء",
                Language = "fa",
                StartSurah = 1,
                EndSurah = 114,
                TotalAyahs = 6236,
                EstimatedDays = 365,
                DifficultyLevel = "expert",
                LearningObjectives = "حفظ کامل قرآن، تجوید حرفه‌ای، درک عمیق معانی",
                TeacherId = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _db.QuranCurricula.AddRangeAsync(curricula);
    }

    private async Task SeedSurahsAndAyahsAsync()
    {
        if (!File.Exists(_quranDataPath))
        {
            Console.WriteLine($"⚠️ Quran data file not found at: {_quranDataPath}");
            return;
        }

        var json = await File.ReadAllTextAsync(_quranDataPath);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        var chapters = root.GetProperty("chapters").EnumerateArray().ToList();
        var surahNames = GetPersianSurahNames();

        foreach (var chapter in chapters)
        {
            var chapterNumber = chapter.GetProperty("chapter_number").GetInt32();
            var nameArabic = chapter.GetProperty("name_arabic").GetString() ?? "";
            var revelationPlace = chapter.GetProperty("revelation_place").GetString() ?? "makkah";
            var versesCount = chapter.GetProperty("verses_count").GetInt32();

            var surah = new Surah
            {
                Number = chapterNumber.ToString(),
                Name = nameArabic,
                TranslatedName = surahNames.GetValueOrDefault(chapterNumber, nameArabic),
                RevelationPlace = revelationPlace == "makkah" ? "مکه" : "مدینه",
                RevelationOrder = chapterNumber,
                TotalAyahs = versesCount,
                Type = revelationPlace,
                Bismillah = chapterNumber > 1 ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" : "",
                HizbBegin = ((chapterNumber - 1) / 4) + 1,
                HizbEnd = ((chapterNumber - 1) / 4) + 1,
                JuzBegin = ((chapterNumber - 1) / 8) + 1,
                JuzEnd = ((chapterNumber - 1) / 8) + 1,
                Ruqyah = "",
                Summary = "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Surahs.Add(surah);
            await _db.SaveChangesAsync();

            var verses = chapter.GetProperty("verses").EnumerateArray().ToList();
            var ayahBatch = new List<Ayah>(verses.Count);

            foreach (var verse in verses)
            {
                var verseKey = verse.GetProperty("verse_key").GetString() ?? "";
                var textUthmani = verse.GetProperty("text_uthmani").GetString() ?? "";
                var verseId = verse.GetProperty("id").GetInt32();

                var verseParts = verseKey.Split(':');
                var verseNumber = int.TryParse(verseParts.LastOrDefault(), out var vn) ? vn : verseId;

                ayahBatch.Add(new Ayah
                {
                    SurahId = surah.Id,
                    VerseNumber = verseNumber,
                    Text = textUthmani,
                    Translation = "",
                    Transliteration = "",
                    Footnote = "",
                    Ruku = "",
                    Sajda = "",
                    AyaNumber = verseNumber,
                    Juz = "",
                    HizbQuarter = "",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            for (int i = 0; i < ayahBatch.Count; i += BATCH_SIZE)
            {
                var batch = ayahBatch.Skip(i).Take(BATCH_SIZE).ToList();
                await _db.Ayahs.AddRangeAsync(batch);
                await _db.SaveChangesAsync();
                _db.ChangeTracker.Clear();
            }

            if (chapterNumber % 10 == 0)
                Console.WriteLine($"✅ Seeded {chapterNumber}/114 surahs");
        }
    }

    private static Dictionary<int, string> GetPersianSurahNames()
    {
        return new Dictionary<int, string>
        {
            { 1, "الحمد" }, { 2, "بقره" }, { 3, "آل عمران" }, { 4, "نساء" },
            { 5, "مائده" }, { 6, "انعام" }, { 7, "اعراف" }, { 8, "انفال" },
            { 9, "توبه" }, { 10, "یونس" }, { 11, "هود" }, { 12, "یوسف" },
            { 13, "رعد" }, { 14, "ابراهیم" }, { 15, "حجر" }, { 16, "نحل" },
            { 17, "اسراء" }, { 18, "کهف" }, { 19, "مریم" }, { 20, "طه" },
            { 21, "انبیاء" }, { 22, "حج" }, { 23, "مؤمنون" }, { 24, "نور" },
            { 25, "فرقان" }, { 26, "شعراء" }, { 27, "نمل" }, { 28, "قصص" },
            { 29, "عنکبوت" }, { 30, "روم" }, { 31, "لقمان" }, { 32, "سجده" },
            { 33, "احزاب" }, { 34, "سبا" }, { 35, "فاطر" }, { 36, "یس" },
            { 37, "صافات" }, { 38, "ص" }, { 39, "زمر" }, { 40, "غافر" },
            { 41, "فصلت" }, { 42, "شوری" }, { 43, "زخرف" }, { 44, "دخان" },
            { 45, "جاثیه" }, { 46, "احقاف" }, { 47, "محمد" }, { 48, "فتح" },
            { 49, "حجرات" }, { 50, "قد" }, { 51, "ذاریات" }, { 52, "طور" },
            { 53, "نجم" }, { 54, "قمر" }, { 55, "رحمان" }, { 56, "واقعه" },
            { 57, "حدید" }, { 58, "مجادله" }, { 59, "هاشمی" }, { 60, "ممتحنه" },
            { 61, "صف" }, { 62, "جمعه" }, { 63, "منافقون" }, { 64, "تغابن" },
            { 65, "تلاق" }, { 66, "تحریم" }, { 67, "ملک" }, { 68, "قلم" },
            { 69, "حاقه" }, { 70, "معارج" }, { 71, "نوح" }, { 72, "جن" },
            { 73, "مزمل" }, { 74, "قیامت" }, { 75, "هیر" }, { 76, "انسان" },
            { 77, "مرسلات" }, { 78, "نبأ" }, { 79, "نازعات" }, { 80, "عبس" },
            { 81, "تکریر" }, { 82, "انفطار" }, { 83, "مطفین" }, { 84, "قضاء" },
            { 85, "بروج" }, { 86, "طارق" }, { 87, "اعلی" }, { 88, "غاشیه" },
            { 89, "فجر" }, { 90, "بلد" }, { 91, "شمس" }, { 92, "لیل" },
            { 93, "ضحی" }, { 94, "شرح" }, { 95, "تین" }, { 96, "علق" },
            { 97, "قدر" }, { 98, "بیان" }, { 99, "زلزله" }, { 100, "عادیات" },
            { 101, "قارعه" }, { 102, "تکاثر" }, { 103, "عصر" }, { 104, "همزه" },
            { 105, "فیل" }, { 106, "قریش" }, { 107, "ماعون" }, { 108, "کوثر" },
            { 109, "کافرون" }, { 110, "نصر" }, { 111, "لهب" }, { 112, "ایکه" },
            { 113, "فلق" }, { 114, "ناس" }
        };
    }
}