using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders
{
    public class ArabicLiteratureDataSeeder
    {
        private readonly AppDbContext _db;

        public ArabicLiteratureDataSeeder(AppDbContext db)
        {
            _db = db;
        }

        public async Task SeedAsync()
        {
            if (await _db.ArabicLiteraturePoets.AnyAsync())
                return;

            // ========== Poets ==========
            var poets = new List<ArabicPoet>
            {
                new()
                {
                    Name = "المتنبي",
                    Nasab = "أبو الطيب أحمد بن الحسين المتنبي",
                    PenName = "المتنبي",
                    BirthDate = new DateTime(915, 1, 1),
                    DeathDate = new DateTime(965, 1, 1),
                    BirthPlace = "الكوفة",
                    DeathPlace = "النعمانية",
                    Era = "classical",
                    Century = 4,
                    Biography = "أبو الطيب المتنبي، شاعر العرب الأكثر شهرة في العصر العباسي. تميز بقوة الأسلوب وجزالة اللفظ",
                    DifficultyLevel = "advanced",
                    Level = "advanced",
                    AgeRange = "15+",
                    SortOrder = 1
                },
                new()
                {
                    Name = "أبو نواس",
                    Nasab = "أبو نواس الحسن بن هانئ الحكمي",
                    PenName = "أبو نواس",
                    BirthDate = new DateTime(756, 1, 1),
                    DeathDate = new DateTime(814, 1, 1),
                    BirthPlace = "الأهواز",
                    DeathPlace = "بغداد",
                    Era = "classical",
                    Century = 2,
                    Biography = "أبو نواس، شاعر الخمرة واللهو في العصر العباسي. تميز بخفة الظل والجرأة في الشعر",
                    DifficultyLevel = "intermediate",
                    Level = "intermediate",
                    AgeRange = "10+",
                    SortOrder = 2
                },
                new()
                {
                    Name = "امرؤ القيس",
                    Nasab = "امرؤ القيس بن حجر بن الحارث الكندي",
                    PenName = "امرؤ القيس",
                    BirthDate = new DateTime(501, 1, 1),
                    DeathDate = new DateTime(544, 1, 1),
                    BirthPlace = "نجد",
                    DeathPlace = "أنقرة",
                    Era = "classical",
                    Century = 6,
                    Biography = "امرؤ القيس، أشهر شعراء العصر الجاهلي وصاحب المعلقة المشهورة",
                    DifficultyLevel = "beginner",
                    Level = "beginner",
                    AgeRange = "5+",
                    SortOrder = 3
                }
            };

            _db.ArabicLiteraturePoets.AddRange(poets);
            await _db.SaveChangesAsync();

            // ========== Poems ==========
            var poems = new List<ArabicPoem>
            {
                new()
                {
                    PoetId = poets[0].Id,
                    Title = "إذا غامرت في شرف مروم",
                    Bahr = "البحر الكامل",
                    Qafiya = "الميم",
                    Genre = "قصيدة",
                    Content = "إذا غامَرْتَ في شَرَفٍ مَرُومِ\r\nفلا تَقنَعْ بما دونَ النُّجومِ\r\nفَطَعْمُ المَوْتِ في أَمْرٍ حَقيرٍ\r\nكطَعْمِ المَوْتِ في أَمْرٍ عَظيمِ",
                    Translation = "When you venture for a noble goal, do not settle for less than the stars. The taste of death in a trivial matter is like the taste of death in a great matter.",
                    Interpretation = "يشجع المتنبي على السعي نحو المعالي وعدم الرضا بالدون، فالشرف لا يتحقق إلا بالمخاطرة",
                    SourceBook = "ديوان المتنبي",
                    VerseCount = 4,
                    DifficultyLevel = "advanced",
                    Theme = "الطموح",
                    SortOrder = 1
                },
                new()
                {
                    PoetId = poets[1].Id,
                    Title = "ألا فاسقني خمراً",
                    Bahr = "البحر الرمل",
                    Qafiya = "النون",
                    Genre = "خمرية",
                    Content = "ألا فاسْقِنِي خَمْراً وَقُلْ لي هيَ الخَمْرُ\r\nوَلا تَسْقِنِي سِرّاً إذَا أَمْكَنَ الجَهْرُ",
                    Translation = "Pour me wine and say it is wine, and do not give it to me secretly when openly is possible.",
                    Interpretation = "يتمنى الشاعر أن يشرب الخمر علناً دون خوف أو تمويه",
                    SourceBook = "ديوان أبي نواس",
                    VerseCount = 2,
                    DifficultyLevel = "intermediate",
                    Theme = "الخمر",
                    SortOrder = 1
                },
                new()
                {
                    PoetId = poets[2].Id,
                    Title = "قفا نبك من ذكرى حبيب ومنزل",
                    Bahr = "البحر الطويل",
                    Qafiya = "اللام",
                    Genre = "معلقة",
                    Content = "قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ\r\nبِسِقْطِ اللِّوَى بَيْنَ الدَّخُولِ فَحَوْمَلِ",
                    Translation = "Stop and let us weep at the memory of a beloved and an abode at the edge of the sands between Ad-Dakhul and Hawmal.",
                    Interpretation = "مطلع معلقة امرئ القيس الشهيرة، يصف فيها مشاعر الحنين إلى الأحبة والديار",
                    SourceBook = "المعلقات السبع",
                    VerseCount = 2,
                    DifficultyLevel = "beginner",
                    Theme = "الغزل",
                    SortOrder = 1
                }
            };

            _db.ArabicLiteraturePoems.AddRange(poems);
            await _db.SaveChangesAsync();

            // ========== Courses ==========
            var courses = new List<ArabicCourse>
            {
                new()
                {
                    Title = "مبتدی - آشنایی با شعر عربی",
                    Description = "دوره مقدماتی برای آشنایی با الفبای عربی، کلمات ساده، و اشعار کوتاه. مناسب برای همه سنین از ۵ سال به بالا.",
                    Level = "beginner",
                    AgeRange = "5+",
                    SortOrder = 1,
                    Icon = "book-open",
                    Color = "#4CAF50"
                },
                new()
                {
                    Title = "متوسط - عروض و قافیه",
                    Description = "دوره متوسط برای یادگیری بحرهای عروض، قافیه، و آشنایی با شاعران برجسته جاهلی، عباسی و اندلسی.",
                    Level = "intermediate",
                    AgeRange = "10+",
                    SortOrder = 2,
                    Icon = "library",
                    Color = "#2196F3"
                },
                new()
                {
                    Title = "منتهی - بلاغت و نقد ادبی",
                    Description = "دوره پیشرفته برای یادگیری بلاغت (بیان، معانی، بدیع)، نقد ادبی، سبک‌شناسی ادوار، و شعر معاصر عرب.",
                    Level = "advanced",
                    AgeRange = "15+",
                    SortOrder = 3,
                    Icon = "award",
                    Color = "#9C27B0"
                }
            };

            _db.ArabicCourses.AddRange(courses);
            await _db.SaveChangesAsync();

            // ========== Lessons ==========
            var lessons = new List<ArabicLesson>
            {
                // ---- Beginner course lessons ----
                new()
                {
                    CourseId = courses[0].Id,
                    Title = "الفبای عربی در شعر",
                    Description = "با حروف و صداهای عربی از طریق اشعار ساده آشنا می‌شویم.",
                    Objectives = "[\"شناخت حروف الفبای عربی\",\"تشخیص صداهای کوتاه و بلند\",\"خواندن اشعار ساده\"]",
                    Content = "در این درس با الفبای عربی و نحوه تلفظ حروف از طریق اشعار ساده آشنا می‌شوید. شعر عربی ریتم و آهنگ خاصی دارد که به یادگیری حروف کمک می‌کند.",
                    DurationMinutes = 30,
                    SortOrder = 1
                },
                new()
                {
                    CourseId = courses[0].Id,
                    Title = "اولین کلمات با شعر",
                    Description = "کلمات ساده عربی را با کمک اشعار کوتاه می‌آموزیم.",
                    Objectives = "[\"یادگیری ۲۰ کلمه پرکاربرد عربی\",\"تشخیص کلمات در متن شعر\",\"معنایابی کلمات ساده\"]",
                    DurationMinutes = 30,
                    SortOrder = 2
                },
                new()
                {
                    CourseId = courses[0].Id,
                    Title = "وزن و ریتم در شعر عربی",
                    Description = "با مفهوم بحر رَجَز و ریتم شعر عربی آشنا می‌شویم.",
                    Objectives = "[\"آشنایی با مفهوم وزن شعری\",\"شناسایی بحر رجز\",\"تشخیص ریتم در اشعار\"]",
                    PoemId = poems[2].Id,
                    Content = "شعر عربی دارای اوزان مشخصی است که به آنها 'بحر' گفته می‌شود. ساده‌ترین بحر، بحر رجز است که ریتم تند و شادابی دارد.",
                    DurationMinutes = 30,
                    SortOrder = 3
                },
                new()
                {
                    CourseId = courses[0].Id,
                    Title = "حفظ شعر کوتاه",
                    Description = "یک شعر ۲ بیتی را حفظ می‌کنیم و معنی آن را می‌آموزیم.",
                    Objectives = "[\"حفظ یک شعر ۲ بیتی\",\"درک معنی شعر\",\"تشخیص قافیه\"]",
                    PoemId = poems[2].Id,
                    Content = "شعر \"قفا نبک\" از امرؤ القیس یکی از معروف‌ترین اشعار عربی است. این شعر را حفظ کنید و به معنی آن دقت کنید.",
                    DurationMinutes = 30,
                    SortOrder = 4
                },
                new()
                {
                    CourseId = courses[0].Id,
                    Title = "شاعران کودک و نوجوان",
                    Description = "با احمد شوقی و اشعار کودکانه او آشنا می‌شویم.",
                    Objectives = "[\"شناخت احمد شوقی\",\"خواندن اشعار کودکانه\",\"تشخیص مضامین ساده\"]",
                    Content = "احمد شوقی از بزرگترین شاعران معاصر عرب است که اشعار زیبایی برای کودکان سروده است.",
                    DurationMinutes = 30,
                    SortOrder = 5
                },
                new()
                {
                    CourseId = courses[0].Id,
                    Title = "ارزشیابی مبتدی",
                    Description = "مرور و ارزیابی همه مفاهیم درس‌های گذشته.",
                    Objectives = "[\"مرور حروف و کلمات\",\"مرور وزن و ریتم\",\"ارزیابی حفظ اشعار\"]",
                    ExerciseData = "{\"type\":\"review\",\"questions\":[\"حروف الفبای عربی را نام ببرید\",\"بحر رجز چیست؟\",\"شعر حفظ شده را بخوانید\"]}",
                    DurationMinutes = 30,
                    SortOrder = 6
                },

                // ---- Intermediate course lessons ----
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "نَصَب و نسب‌شناسی در ادب عرب",
                    Description = "با مفهوم Nasab و نحوه نامگذاری شاعران عرب آشنا می‌شویم.",
                    Objectives = "[\"شناخت ساختار نام عربی\",\"تشخیص نسب شاعران\",\"درک اهمیت نسب در ادب عرب\"]",
                    Content = "نام‌های عربی معمولاً دارای نسب‌نامه (Nasab) هستند که نشان‌دهنده تبار فرد است. مثلاً: المتنبي = أبو الطيب أحمد بن الحسين المتنبي",
                    DurationMinutes = 40,
                    SortOrder = 1
                },
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "بحرهای اصلی عروض (۱)",
                    Description = "با بحرهای طویل، مدید و بسیط آشنا می‌شویم.",
                    Objectives = "[\"شناخت بحر طویل\",\"شناخت بحر مدید\",\"شناخت بحر بسیط\",\"تفکیک اوزان\"]",
                    PoemId = poems[2].Id,
                    Content = "بحر طویل یکی از رایج‌ترین بحرها در شعر عربی است. شعر معلقه امرؤ القیس در این بحر سروده شده است.",
                    DurationMinutes = 40,
                    SortOrder = 2
                },
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "بحرهای اصلی عروض (۲)",
                    Description = "با بحرهای کامل، وافر و هزج آشنا می‌شویم.",
                    Objectives = "[\"شناخت بحر کامل\",\"شناخت بحر وافر\",\"شناخت بحر هزج\",\"تشخیص وزن در اشعار\"]",
                    PoemId = poems[0].Id,
                    Content = "شعر المتنبي در بحر کامل سروده شده است. این بحر ریتم منظم و استواری دارد.",
                    DurationMinutes = 40,
                    SortOrder = 3
                },
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "قافیه و رَوی",
                    Description = "با مفهوم قافیه و حرف روی در شعر عربی آشنا می‌شویم.",
                    Objectives = "[\"شناخت قافیه\",\"تشخیص حرف روی\",\"تحلیل قافیه در اشعار\"]",
                    Content = "قافیه به حروف آخر بیت‌های شعر گفته می‌شود. حرف اصلی قافیه را 'روی' می‌نامند.",
                    DurationMinutes = 40,
                    SortOrder = 4
                },
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "شاعران جاهلی و معلّقات",
                    Description = "با امرؤ القیس و دیگر شاعران معلقات آشنا می‌شویم.",
                    Objectives = "[\"شناخت شعر جاهلی\",\"آشنایی با معلقات\",\"تحلیل شعر امرؤ القیس\"]",
                    PoemId = poems[2].Id,
                    Content = "معلقات هفت‌گانه از معروف‌ترین اشعار دوره جاهلی هستند که بر کعبه آویخته می‌شدند.",
                    DurationMinutes = 40,
                    SortOrder = 5
                },
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "شاعران عباسی",
                    Description = "با المتنبي، أبو نواس و دیگر شاعران عصر عباسی آشنا می‌شویم.",
                    Objectives = "[\"شناخت شعر عباسی\",\"تحلیل شعر المتنبي\",\"تحلیل شعر أبی نواس\"]",
                    PoemId = poems[0].Id,
                    Content = "عصر عباسی دوران طلایی شعر عربی است. المتنبي و أبو نواس از مشهورترین شاعران این دوره هستند.",
                    DurationMinutes = 40,
                    SortOrder = 6
                },
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "شاعران اندلس",
                    Description = "با ابن زیدون و موشحات اندلسی آشنا می‌شویم.",
                    Objectives = "[\"شناخت شعر اندلسی\",\"آشنایی با موشحات\",\"سبک‌شناسی اندلسی\"]",
                    Content = "شعر اندلسی با موشحات و زجل‌های خود شناخته می‌شود. ابن زیدون از برجسته‌ترین شاعران اندلس است.",
                    DurationMinutes = 40,
                    SortOrder = 7
                },
                new()
                {
                    CourseId = courses[1].Id,
                    Title = "ارزشیابی متوسط",
                    Description = "مرور و ارزیابی مفاهیم درس‌های سطح متوسط.",
                    ExerciseData = "{\"type\":\"exam\",\"questions\":[\"سه بحر عروض را نام ببرید\",\"فرق قافیه و روی چیست؟\",\"ویژگی‌های شعر جاهلی را توضیح دهید\"]}",
                    QuizData = "{\"questions\":[{\"q\":\"بحر چه معنایی در عروض دارد؟\",\"options\":[\"وزن شعر\",\"قافیه\",\"معنی\",\"تاریخ\"],\"answer\":0}]}",
                    DurationMinutes = 45,
                    SortOrder = 8
                },

                // ---- Advanced course lessons ----
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "عروض پیشرفته - زحافات و علل",
                    Description = "با زحافات و علل عروضی و تغییرات اوزان آشنا می‌شویم.",
                    Objectives = "[\"شناخت زحافات\",\"شناخت علل\",\"تحلیل تغییرات وزنی\"]",
                    DurationMinutes = 50,
                    SortOrder = 1
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "بلاغت: علم بیان",
                    Description = "با تشبیه، استعاره، کنایه و مجاز در شعر عربی آشنا می‌شویم.",
                    Objectives = "[\"شناخت تشبیه\",\"شناخت استعاره\",\"شناخت کنایه\",\"تحلیل صنایع بیانی\"]",
                    Content = "علم بیان به بررسی راه‌های مختلف بیان معنا می‌پردازد. تشبیه، استعاره، کنایه و مجاز از مهم‌ترین مباحث آن هستند.",
                    DurationMinutes = 50,
                    SortOrder = 2
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "بلاغت: علم معانی",
                    Description = "با جمله‌های خبری و انشایی و اغراض ثانوی آشنا می‌شویم.",
                    Objectives = "[\"تشخیص جمله خبری و انشایی\",\"شناخت اغراض ثانوی\",\"تحلیل بلاغی اشعار\"]",
                    DurationMinutes = 50,
                    SortOrder = 3
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "بلاغت: علم بدیع",
                    Description = "با محسنات لفظی و معنوی در شعر عربی آشنا می‌شویم.",
                    Objectives = "[\"شناخت محسنات لفظی\",\"شناخت محسنات معنوی\",\"تحلیل آرایه‌های بدیعی\"]",
                    DurationMinutes = 50,
                    SortOrder = 4
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "نقد ادبی کلاسیک",
                    Description = "با رویکردهای سنتی نقد ادبی در فرهنگ عربی آشنا می‌شویم.",
                    Objectives = "[\"شناخت نقد قدیم\",\"معیارهای نقد ادبی\",\"تحلیل تطبیقی\"]",
                    DurationMinutes = 50,
                    SortOrder = 5
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "سبک‌شناسی ادوار شعر عربی",
                    Description = "تطور شعر عربی از جاهلی تا معاصر را بررسی می‌کنیم.",
                    Objectives = "[\"شناخت سبک جاهلی\",\"شناخت سبک عباسی\",\"شناخت سبک اندلسی\",\"مقایسه سبک‌ها\"]",
                    DurationMinutes = 50,
                    SortOrder = 6
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "شعر معاصر عرب",
                    Description = "با جریان‌های نئوکلاسیک، رمانتیک و سمبلیک در شعر معاصر آشنا می‌شویم.",
                    Objectives = "[\"شناخت شعر معاصر\",\"آشنایی با شاعران معاصر\",\"تحلیل شعر معاصر\"]",
                    Content = "احمد شوقی (نئوکلاسیک)، جبران خلیل جبران (رمانتیک) و... از چهره‌های شاخص شعر معاصر عرب هستند.",
                    DurationMinutes = 50,
                    SortOrder = 7
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "شعر مقاومت و فلسطین",
                    Description = "با شعر مقاومت فلسطین و محمود درویش آشنا می‌شویم.",
                    Objectives = "[\"شناخت شعر مقاومت\",\"تحلیل شعر محمود درویش\",\"درک پیام‌های اجتماعی\"]",
                    Content = "محمود درویش شاعر نامدار فلسطینی، با اشعار مقاومت خود شهرت جهانی یافت.",
                    DurationMinutes = 50,
                    SortOrder = 8
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "پروژه مستقل - تحلیل قصیده",
                    Description = "یک قصیده کامل عربی را انتخاب کرده و به صورت مستقل تحلیل می‌کنید.",
                    Objectives = "[\"انتخاب قصیده\",\"تحلیل وزنی\",\"تحلیل بلاغی\",\"تحلیل محتوایی\",\"ارائه تحلیل کامل\"]",
                    ExerciseData = "{\"type\":\"project\",\"guidelines\":[\"یک قصیده از شاعر مورد علاقه انتخاب کنید\",\"وزن و بحر آن را مشخص کنید\",\"صنایع بدیعی آن را تحلیل کنید\",\"معنی و مفهوم آن را توضیح دهید\"]}",
                    DurationMinutes = 90,
                    SortOrder = 9
                },
                new()
                {
                    CourseId = courses[2].Id,
                    Title = "ارزشیابی نهایی",
                    Description = "ارزیابی جامع از تمام مفاهیم آموخته شده در سه سطح.",
                    ExerciseData = "{\"type\":\"final_exam\",\"sections\":[\"عروض و قافیه\",\"بلاغت\",\"سبک‌شناسی\",\"نقد ادبی\",\"تحلیل شعر\"]}",
                    QuizData = "{\"questions\":[{\"q\":\"المتنبي در کدام قرن می‌زیست؟\",\"options\":[\"قرن ۴\",\"قرن ۲\",\"قرن ۶\",\"قرن ۱\"],\"answer\":0},{\"q\":\"معلقات چند تاست؟\",\"options\":[\"۷\",\"۵\",\"۱۰\",\"۳\"],\"answer\":0}]}",
                    DurationMinutes = 90,
                    SortOrder = 10
                }
            };

            _db.ArabicLessons.AddRange(lessons);
            await _db.SaveChangesAsync();
        }
    }
}
