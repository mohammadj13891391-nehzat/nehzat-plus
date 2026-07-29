using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders
{
    public class ExperimentalScienceDataSeeder
    {
        private readonly AppDbContext _db;
        private const int BATCH_SIZE = 500;

        public ExperimentalScienceDataSeeder(AppDbContext db)
        {
            _db = db;
        }

        public async Task SeedAsync()
        {
            if (await _db.Set<ExperimentTopic>().AnyAsync())
                return;

            // ===== Topics =====

            var physics = new ExperimentTopic
            {
                Title = "فیزیک",
                Description = "مطالعهٔ طبیعت، نیروها، انرژی و قوانین حاکم بر جهان مادی",
                DifficultyLevel = "intermediate",
                IconUrl = "physics",
                SortOrder = 1
            };

            var chemistry = new ExperimentTopic
            {
                Title = "شیمی",
                Description = "مطالعهٔ مواد، ساختار اتمی، واکنش‌های شیمیایی و تغییرات ماده",
                DifficultyLevel = "intermediate",
                IconUrl = "chemistry",
                SortOrder = 2
            };

            var biology = new ExperimentTopic
            {
                Title = "زیست‌شناسی",
                Description = "مطالعهٔ موجودات زنده، سلول‌ها، ژنتیک و اکوسیستم",
                DifficultyLevel = "intermediate",
                IconUrl = "biology",
                SortOrder = 3
            };

            var geology = new ExperimentTopic
            {
                Title = "زمین‌شناسی",
                Description = "مطالعهٔ ساختار زمین، سنگ‌ها، کانی‌ها و پدیده‌های زمین‌شناختی",
                DifficultyLevel = "beginner",
                IconUrl = "geology",
                SortOrder = 4
            };

            var astronomy = new ExperimentTopic
            {
                Title = "نجوم",
                Description = "مطالعهٔ کیهان، ستارگان، سیارات و پدیده‌های نجومی",
                DifficultyLevel = "beginner",
                IconUrl = "astronomy",
                SortOrder = 5
            };

            _db.Set<ExperimentTopic>().AddRange(physics, chemistry, biology, geology, astronomy);
            await _db.SaveChangesAsync();
            _db.ChangeTracker.Clear();

            // ===== Experiments =====

            // Physics experiments
            var exp1 = new Experiment
            {
                TopicId = physics.Id,
                Title = "آزمایش آونگ ساده",
                Objective = "بررسی رابطه بین طول آونگ و زمان نوسان آن",
                MaterialsNeeded = "یک نخ به طول ۱ متر، یک وزنه کوچک، کرنومتر، پایه نگهدارنده، خط‌کش",
                Procedure = "1. نخ را به پایه نگهدارنده وصل کنید.\n2. وزنه را به انتهای نخ ببندید.\n3. آونگ را ۱۵ درجه از حالت تعادل منحرف کنید.\n4. زمان ۱۰ نوسان کامل را با کرنومتر اندازه بگیرید.\n5. آزمایش را با طول‌های مختلف نخ (۸۰، ۶۰، ۴۰ سانتی‌متر) تکرار کنید.\n6. نتایج را در جدول ثبت کنید.",
                ExpectedResult = "با کاهش طول آونگ، زمان نوسان کاهش می‌یابد. رابطه مستقیم بین طول و مجذور زمان نوسان وجود دارد.",
                Content = "آونگ ساده یکی از اساسی‌ترین آزمایش‌های فیزیک است که به درک مفاهیم نوسان، انرژی پتانسیل و جنبشی کمک می‌کند. گالیله اولین بار با مشاهده نوسان چراغ کلیسا به این پدیده علاقه‌مند شد.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 30,
                SortOrder = 1,
                VideoUrl = null
            };

            var exp2 = new Experiment
            {
                TopicId = physics.Id,
                Title = "آزمایش چگالی مایعات",
                Objective = "تعیین چگالی مایعات مختلف و مقایسه آن‌ها",
                MaterialsNeeded = "استوانه مدرج، ترازوی دیجیتال، آب، روغن، الکل، عسل",
                Procedure = "1. استوانه مدرج را روی ترازو قرار داده و صفر کنید.\n2. ۱۰۰ میلی‌لیتر آب به استوانه اضافه کنید و جرم آن را یادداشت کنید.\n3. چگالی = جرم / حجم را محاسبه کنید.\n4. همین مراحل را برای روغن، الکل و عسل تکرار کنید.\n5. نتایج را مقایسه کنید.",
                ExpectedResult = "چگالی عسل بیشتر از آب، چگالی روغن کمتر از آب، و چگالی الکل نیز کمتر از آب است.",
                Content = "چگالی یک خاصیت فیزیکی است که نشان می‌دهد چه مقدار جرم در یک واحد حجم قرار دارد. این مفهوم در بسیاری از پدیده‌های روزمره مانند شناور شدن چوب روی آب کاربرد دارد.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 25,
                SortOrder = 2
            };

            var exp3 = new Experiment
            {
                TopicId = physics.Id,
                Title = "آزمایش القای الکترومغناطیسی",
                Objective = "ایجاد جریان الکتریکی با استفاده از میدان مغناطیسی متغیر",
                MaterialsNeeded = "یک عدد آهنربای قوی، یک سیم پیچ ۲۰۰ دور، گالوانومتر یا مولتی‌متر حساس، سیم‌های رابط",
                Procedure = "1. سیم پیچ را به گالوانومتر وصل کنید.\n2. آهنربا را به آرامی داخل سیم پیچ فرو کنید.\n3. حرکت عقربه گالوانومتر را مشاهده کنید.\n4. آهنربا را سریع‌تر حرکت دهید.\n5. جهت حرکت آهنربا را تغییر دهید.\n6. نتایج را ثبت کنید.",
                ExpectedResult = "با حرکت آهنربا درون سیم پیچ، جریان الکتریکی القا می‌شود. هرچه سرعت حرکت بیشتر باشد، جریان قوی‌تر است.",
                Content = "این پدیده توسط مایکل فارادی کشف شد و اساس کار ژنراتورهای برق و دینام دوچرخه است. تغییر میدان مغناطیسی باعث ایجاد نیروی محرکه الکتریکی می‌شود.",
                DifficultyLevel = "advanced",
                EstimatedMinutes = 35,
                SortOrder = 3
            };

            // Chemistry experiments
            var exp4 = new Experiment
            {
                TopicId = chemistry.Id,
                Title = "آزمایش فوران آتشفشان شیمیایی",
                Objective = "ایجاد واکنش شیمیایی تولید گاز و مشاهده فوران",
                MaterialsNeeded = "جوش شیرین، سرکه، ظرف پلاستیکی، رنگ خوراکی قرمز، مایع ظرفشویی، سینی",
                Procedure = "1. جوش شیرین را در ظرف پلاستیکی بریزید.\n2. چند قطره رنگ خوراکی قرمز و مایع ظرفشویی اضافه کنید.\n3. در سینی قرار دهید.\n4. سرکه را به آرامی به ظرف اضافه کنید.\n5. فوران کف قرمز رنگ را مشاهده کنید.",
                ExpectedResult = "واکنش جوش شیرین (بی‌کربنات سدیم) با سرکه (اسید استیک) تولید گاز کربن دی‌اکسید می‌کند که باعث ایجاد کف و فوران می‌شود.",
                Content = "این یک واکنش اسید-باز است. در این واکنش، اسید استیک با بی‌کربنات سدیم واکنش داده و استات سدیم، آب و گاز کربن دی‌اکسید تولید می‌شود.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 15,
                SortOrder = 1
            };

            var exp5 = new Experiment
            {
                TopicId = chemistry.Id,
                Title = "آزمایش کروماتوگرافی کاغذی",
                Objective = "جداسازی رنگ‌های موجود در جوهر خودکار",
                MaterialsNeeded = "کاغذ کروماتوگرافی یا کاغذ صافی، لیوان آب، خودکارهای رنگی مختلف، الکل",
                Procedure = "1. نوار کاغذ صافی به ابعاد ۲×۱۵ سانتی‌متر ببرید.\n2. در فاصله ۲ سانتی‌متری از پایین، یک نقطه جوهر بزنید.\n3. ته نوار را در آب قرار دهید (نقطه جوهر بالای سطح آب باشد).\n4. صبر کنید تا آب در کاغذ بالا برود.\n5. الگوهای رنگی جدا شده را مشاهده کنید.",
                ExpectedResult = "رنگ‌های مختلف جوهر با سرعت‌های متفاوت در کاغذ حرکت می‌کنند و از یکدیگر جدا می‌شوند.",
                Content = "کروماتوگرافی یک روش جداسازی است که بر اساس تفاوت در حلالیت و جذب مواد مختلف عمل می‌کند. این روش در آزمایشگاه‌های داروسازی و شیمی کاربرد فراوان دارد.",
                DifficultyLevel = "intermediate",
                EstimatedMinutes = 25,
                SortOrder = 2
            };

            var exp6 = new Experiment
            {
                TopicId = chemistry.Id,
                Title = "آزمایش رشد بلورهای نمک",
                Objective = "ایجاد بلورهای نمک از محلول فوق اشباع",
                MaterialsNeeded = "نمک طعام، آب داغ، ظرف شیشه‌ای، نخ، مداد، قاشق",
                Procedure = "1. آب را بجوشانید و در ظرف شیشه‌ای بریزید.\n2. به تدریج نمک اضافه کنید تا جایی که دیگر حل نشود.\n3. یک نخ را به مداد ببندید و در محلول آویزان کنید.\n4. ظرف را در جای آرام قرار دهید.\n5. هر روز بلورها را مشاهده کنید.",
                ExpectedResult = "پس از چند روز، بلورهای نمک به شکل مکعب‌های کوچک روی نخ تشکیل می‌شوند.",
                Content = "بلورها ساختارهای جامدی هستند که اتم‌ها یا مولکول‌های آن‌ها به صورت منظم و دوره‌ای چیده شده‌اند. بلورهای نمک دارای ساختار مکعبی هستند.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 20,
                SortOrder = 3
            };

            // Biology experiments
            var exp7 = new Experiment
            {
                TopicId = biology.Id,
                Title = "آزمایش مشاهده سلول پیاز",
                Objective = "مشاهده سلول‌های گیاهی زیر میکروسکوپ",
                MaterialsNeeded = "پیاز، میکروسکوپ، لام و لامل، محلول ید، چاقو، قطره‌چکان",
                Procedure = "1. یک لایه نازک از پوست داخلی پیاز جدا کنید.\n2. آن را روی لام قرار دهید.\n3. یک قطره محلول ید روی آن بریزید.\n4. لامل را به آرامی روی نمونه قرار دهید.\n5. زیر میکروسکوپ با بزرگنمایی ۱۰× و ۴۰× مشاهده کنید.",
                ExpectedResult = "سلول‌های مستطیلی شکل با دیواره ضخیم و هسته مشخص قابل مشاهده هستند.",
                Content = "سلول‌های پیاز جزو سلول‌های گیاهی هستند که دیواره سلولی ضخیم و شکل منظمی دارند. هسته سلول پس از رنگ‌آمیزی با ید به وضوح دیده می‌شود.",
                DifficultyLevel = "intermediate",
                EstimatedMinutes = 30,
                SortOrder = 1
            };

            var exp8 = new Experiment
            {
                TopicId = biology.Id,
                Title = "آزمایش فتوسنتز و تولید اکسیژن",
                Objective = "مشاهده تولید اکسیژن توسط گیاه آبزی",
                MaterialsNeeded = "گیاه آبزی (باریک‌برگ یا آب‌تنیا)، آب، بشر شیشه‌ای، قیف شیشه‌ای، لوله آزمایش، نور",
                Procedure = "1. بشر را تا نیمه از آب پر کنید.\n2. گیاه آبزی را درون بشر قرار دهید.\n3. قیف را روی گیاه قرار دهید.\n4. لوله آزمایش را پر از آب کرده و وارونه روی قیف قرار دهید.\n5. بشر را در معرض نور مستقیم قرار دهید.\n6. حباب‌های گاز را در لوله آزمایش جمع‌آوری کنید.",
                ExpectedResult = "حباب‌های اکسیژن از سطح گیاه خارج شده و در لوله آزمایش جمع می‌شوند.",
                Content = "فتوسنتز فرآیندی است که در آن گیاهان با استفاده از نور خورشید، دی‌اکسید کربن و آب را به گلوکز و اکسیژن تبدیل می‌کنند. اکسیژن تولید شده به صورت حباب دیده می‌شود.",
                DifficultyLevel = "intermediate",
                EstimatedMinutes = 40,
                SortOrder = 2
            };

            var exp9 = new Experiment
            {
                TopicId = biology.Id,
                Title = "آزمایش جوانه زدن دانه",
                Objective = "بررسی عوامل مؤثر بر جوانه زدن دانه",
                MaterialsNeeded = "دانه لوبیا یا نخود، پنبه، نعلبکی، آب",
                Procedure = "1. پنبه را خیس کرده و در نعلبکی قرار دهید.\n2. چند دانه لوبیا را روی پنبه قرار دهید.\n3. نعلبکی را در جای گرم و روشن قرار دهید.\n4. هر روز به پنبه آب بدهید (نه زیاد).\n5. مراحل رشد: شکستن پوسته، بیرون آمدن ریشه، رشد ساقه.",
                ExpectedResult = "پس از ۳ تا ۷ روز، دانه‌ها شروع به جوانه زدن می‌کنند و ریشه و ساقه ظاهر می‌شود.",
                Content = "جوانه زدن اولین مرحله رشد یک گیاه است. برای این کار سه عامل اصلی لازم است: آب، اکسیژن و دمای مناسب. برخی دانه‌ها به نور نیز نیاز دارند.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 15,
                SortOrder = 3
            };

            // Geology experiments
            var exp10 = new Experiment
            {
                TopicId = geology.Id,
                Title = "آزمایش لایه‌های رسوبی",
                Objective = "ساخت مدل لایه‌های رسوبی زمین",
                MaterialsNeeded = "ظرف شیشه‌ای بزرگ، ماسه، شن، خاک رس، آب، سنگ ریزه",
                Procedure = "1. ظرف شیشه‌ای را تا نیمه از آب پر کنید.\n2. یک لایه شن کف ظرف بریزید.\n3. یک لایه ماسه روی آن بریزید.\n4. یک لایه خاک رس اضافه کنید.\n5. لایه سنگ ریزه روی همه.\n6. صبر کنید تا مواد تهنشین شوند.",
                ExpectedResult = "مواد بر اساس اندازه ذرات، لایه‌لایه تهنشین می‌شوند: سنگ‌ریزه در پایین، شن، ماسه و خاک رس در بالا.",
                Content = "لایه‌های رسوبی در طبیعت طی میلیون‌ها سال تشکیل می‌شوند. دیرینه‌شناسان با مطالعه این لایه‌ها می‌توانند قدمت فسیل‌ها را تعیین کنند.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 20,
                SortOrder = 1
            };

            var exp11 = new Experiment
            {
                TopicId = geology.Id,
                Title = "آزمایش حل شدن سنگ‌های آهکی",
                Objective = "بررسی اثر اسید بر سنگ آهک",
                MaterialsNeeded = "سنگ آهک یا گچ، سرکه، لیوان شیشه‌ای، قطره‌چکان",
                Procedure = "1. یک قطعه سنگ آهک را در لیوان قرار دهید.\n2. با قطره‌چکان چند قطره سرکه روی آن بریزید.\n3. حباب‌های ایجاد شده را مشاهده کنید.\n4. سنگ را در سرکه غوطه‌ور کنید.\n5. پس از ۲۴ ساعت تغییرات را بررسی کنید.",
                ExpectedResult = "سرکه باعث حل شدن تدریجی سنگ آهک می‌شود و گاز کربن دی‌اکسید تولید می‌کند.",
                Content = "سنگ آهک عمدتاً از کربنات کلسیم تشکیل شده است. باران‌های اسیدی می‌توانند باعث فرسایش سنگ‌های آهکی و تشکیل غارها شوند.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 20,
                SortOrder = 2
            };

            // Astronomy experiments
            var exp12 = new Experiment
            {
                TopicId = astronomy.Id,
                Title = "مدل حرکت سیارات به دور خورشید",
                Objective = "ساخت مدل ساده منظومه شمسی",
                MaterialsNeeded = "یک عدد توپ بزرگ (خورشید)، توپ‌های کوچک (سیارات)، نخ، پایه نگهدارنده",
                Procedure = "1. توپ بزرگ را در مرکز قرار دهید (خورشید).\n2. توپ‌های کوچک را با نخ به پایه وصل کنید.\n3. سیارات را در فواصل مختلف از خورشید قرار دهید.\n4. سیارات را به آرامی بچرخانید.\n5. حرکت مداری سیارات را مشاهده کنید.",
                ExpectedResult = "سیارات در مدارهای بیضوی به دور خورشید می‌چرخند. هرچه سیاره دورتر باشد، مدار بزرگ‌تری دارد.",
                Content = "منظومه شمسی شامل خورشید و ۸ سیاره است که به دور آن می‌چرخند. این مدل توسط کوپرنیک در قرن شانزدهم ارائه شد و انقلابی در علم نجوم ایجاد کرد.",
                DifficultyLevel = "beginner",
                EstimatedMinutes = 25,
                SortOrder = 1
            };

            var exp13 = new Experiment
            {
                TopicId = astronomy.Id,
                Title = "رصد دهانه‌های ماه",
                Objective = "مشاهده سطح ماه و شناسایی دهانه‌ها با دوربین دوچشمی",
                MaterialsNeeded = "دوربین دوچشمی یا تلسکوپ ساده، نقشه ماه، دفترچه یادداشت",
                Procedure = "1. شب‌های ماه کامل یا نیمه‌ماه را انتخاب کنید.\n2. دوربین دوچشمی را روی سه‌پایه قرار دهید.\n3. ماه را در مرکز دید قرار دهید.\n4. دهانه‌ها، کوه‌ها و دریاهای ماه را رسم کنید.\n5. با نقشه ماه مقایسه کنید.",
                ExpectedResult = "سطح ماه پوشیده از دهانه‌های برخوردی، کوه‌ها و مناطق تیره به نام «دریا» است.",
                Content = "دهانه‌های ماه در اثر برخورد شهاب‌سنگ‌ها در میلیاردها سال پیش ایجاد شده‌اند. به دلیل نبود جو و فرسایش، این دهانه‌ها همچنان intact باقی مانده‌اند.",
                DifficultyLevel = "intermediate",
                EstimatedMinutes = 30,
                SortOrder = 2
            };

            _db.Set<Experiment>().AddRange(exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8, exp9, exp10, exp11, exp12, exp13);
            await _db.SaveChangesAsync();
            _db.ChangeTracker.Clear();

            // ===== Analyses =====
            var analyses = new List<ExperimentAnalysis>
            {
                // Physics analyses
                new() { ExperimentId = exp1.Id, Title = "تحلیل علمی آونگ ساده", Content = "در این آزمایش، آونگ یک نوسان‌گر ساده محسوب می‌شود. دوره تناوب آونگ از رابطه T = 2π√(L/g) پیروی می‌کند که در آن L طول آونگ و g شتاب گرانش است. بنابراین دوره تناوب به جرم وزنه وابسته نیست و تنها به طول آونگ بستگی دارد.", AnalysisType = "scientific", DifficultyLevel = "intermediate", SortOrder = 1 },
                new() { ExperimentId = exp1.Id, Title = "نکات ایمنی", Content = "از وزنه‌های سنگین استفاده نکنید. مطمئن شوید پایه نگهدارنده محکم است تا از سقوط وزنه جلوگیری شود.", AnalysisType = "safety", DifficultyLevel = "beginner", SortOrder = 2 },

                new() { ExperimentId = exp2.Id, Title = "تحلیل علمی چگالی", Content = "چگالی یک خاصیت ذاتی ماده است و به دما و فشار وابسته است. چگالی آب خالص در دمای ۴ درجه سانتی‌گراد برابر ۱ g/cm³ است. مواد با چگالی کمتر از آب روی آن شناور می‌شوند.", AnalysisType = "scientific", DifficultyLevel = "beginner", SortOrder = 1 },

                new() { ExperimentId = exp3.Id, Title = "تحلیل علمی القا", Content = "بر اساس قانون القای فارادی، نیروی محرکه القایی با آهنگ تغییر شار مغناطیسی نسبت مستقیم دارد. ε = -dΦ/dt. علامت منفی نشان‌دهنده قانون لنز است که جهت جریان مخالف تغییر شار است.", AnalysisType = "scientific", DifficultyLevel = "advanced", SortOrder = 1 },

                // Chemistry analyses
                new() { ExperimentId = exp4.Id, Title = "تحلیل علمی واکنش", Content = "واکنش شیمیایی: NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. این یک واکنش خنثی‌سازی بین اسید ضعیف و باز ضعیف است.", AnalysisType = "scientific", DifficultyLevel = "beginner", SortOrder = 1 },

                new() { ExperimentId = exp5.Id, Title = "تحلیل کروماتوگرافی", Content = "اصل جداسازی در کروماتوگرافی بر اساس دو فاز است: فاز ثابت (کاغذ) و فاز متحرک (حلال). مواد مختلف بر اساس میزان حلالیت در حلال و تمایل به جذب روی کاغذ از هم جدا می‌شوند.", AnalysisType = "scientific", DifficultyLevel = "intermediate", SortOrder = 1 },

                new() { ExperimentId = exp6.Id, Title = "تحلیل بلورها", Content = "بلورهای نمک طعام دارای ساختار مکعبی (Cubic) هستند. هر یون سدیم توسط ۶ یون کلرید احاطه شده و بالعکس. رشد بلور از محلول فوق اشباع صورت می‌گیرد.", AnalysisType = "scientific", DifficultyLevel = "beginner", SortOrder = 1 },

                // Biology analyses
                new() { ExperimentId = exp7.Id, Title = "تحلیل سلول گیاهی", Content = "سلول‌های پیاز فاقد کلروپلاست هستند چون پیاز در زیر زمین رشد می‌کند. دیواره سلولی از جنس سلولز است و پس از رنگ‌آمیزی با ید هسته به وضوح دیده می‌شود.", AnalysisType = "scientific", DifficultyLevel = "intermediate", SortOrder = 1 },
                new() { ExperimentId = exp7.Id, Title = "نکات ایمنی میکروسکوپ", Content = "از لنزها با دستمال مخصوص تمیز کنید. هرگز از لنز با بزرگنمایی بالا بدون کاور استفاده نکنید. لام را با دو دست حمل کنید.", AnalysisType = "safety", DifficultyLevel = "beginner", SortOrder = 2 },

                new() { ExperimentId = exp8.Id, Title = "تحلیل فتوسنتز", Content = "فتوسنتز در کلروپلاست‌های سلول‌های گیاهی انجام می‌شود. واکنش کلی: ۶CO₂ + ۶H₂O → C₆H₁₂O₆ + ۶O₂. نور محرک اصلی این فرآیند است.", AnalysisType = "scientific", DifficultyLevel = "intermediate", SortOrder = 1 },

                new() { ExperimentId = exp9.Id, Title = "تحلیل جوانه زدن", Content = "مراحل جوانه زدن: ۱) جذب آب (ایمیبیشن) ۲) فعال شدن آنزیم‌ها ۳) شکستن پوسته دانه ۴) رشد ریشه اولیه ۵) رشد ساقه. دمای ایده‌آل برای بیشتر دانه‌ها ۲۰-۲۵ درجه سانتی‌گراد است.", AnalysisType = "scientific", DifficultyLevel = "beginner", SortOrder = 1 },

                // Geology analyses
                new() { ExperimentId = exp10.Id, Title = "تحلیل لایه‌ها", Content = "اصل رسوب‌گذاری می‌گوید ذرات بزرگ‌تر سریع‌تر تهنشین می‌شوند. این پدیده در طبیعت باعث تشکیل سنگ‌های رسوبی لایه‌لایه مانند ماسه‌سنگ و کنگلومرا می‌شود.", AnalysisType = "scientific", DifficultyLevel = "beginner", SortOrder = 1 },

                new() { ExperimentId = exp11.Id, Title = "تحلیل انحلال", Content = "CaCO₃ + ۲CH₃COOH → Ca(CH₃COO)₂ + H₂O + CO₂. باران اسیدی (pH ~ ۴-۵) می‌تواند سنگ آهک را حل کرده و اشکال کارستی مانند غارها را ایجاد کند.", AnalysisType = "scientific", DifficultyLevel = "beginner", SortOrder = 1 },

                // Astronomy analyses
                new() { ExperimentId = exp12.Id, Title = "تحلیل حرکت سیارات", Content = "قوانین کپلر: ۱) سیارات در مدار بیضوی به دور خورشید حرکت می‌کنند. ۲) شعاع‌های واصل سیاره و خورشید در زمان‌های مساوی مساحت‌های مساوی می‌روبند. ۳) مربع دوره تناوب با مکعب نیم‌قطر بزرگ مدار متناسب است.", AnalysisType = "scientific", DifficultyLevel = "intermediate", SortOrder = 1 },

                new() { ExperimentId = exp13.Id, Title = "تحلیل دهانه‌های ماه", Content = "دهانه‌های ماه عمدتاً در دوره بمباران سنگین اخیر (حدود ۳.۹ میلیارد سال پیش) ایجاد شده‌اند. بزرگ‌ترین دهانه ماه «قطب جنوب-آیتکن» با قطر ۲۵۰۰ کیلومتر است.", AnalysisType = "scientific", DifficultyLevel = "intermediate", SortOrder = 1 }
            };

            _db.Set<ExperimentAnalysis>().AddRange(analyses);
            await _db.SaveChangesAsync();
            _db.ChangeTracker.Clear();

            // ===== Questions =====
            var questions = new List<ExperimentQuestion>();

            // Questions for exp1 (آونگ ساده)
            questions.Add(new() { ExperimentId = exp1.Id, QuestionType = "multiple-choice", QuestionText = "دوره تناوب آونگ ساده به کدام عامل بستگی دارد؟", OptionsJson = "[\"جرم وزنه\", \"طول نخ\", \"رنگ وزنه\", \"جنس نخ\"]", Points = 10, DifficultyRating = 2, CorrectAnswerJson = "1" });
            questions.Add(new() { ExperimentId = exp1.Id, QuestionType = "true-false", QuestionText = "دوره تناوب آونگ به جرم وزنه وابسته نیست.", OptionsJson = "[\"درست\", \"نادرست\"]", Points = 5, DifficultyRating = 1, CorrectAnswerJson = "0" });

            // Questions for exp2 (چگالی)
            questions.Add(new() { ExperimentId = exp2.Id, QuestionType = "multiple-choice", QuestionText = "کدام یک از مایعات زیر چگالی بیشتری دارد؟", OptionsJson = "[\"آب\", \"روغن\", \"عسل\", \"الکل\"]", Points = 10, DifficultyRating = 1, CorrectAnswerJson = "2" });
            questions.Add(new() { ExperimentId = exp2.Id, QuestionType = "fill-blank", QuestionText = "فرمول محاسبه چگالی چیست؟", OptionsJson = "[]", Points = 10, DifficultyRating = 2, CorrectAnswerJson = "جرم تقسیم بر حجم" });

            // Questions for exp3 (القا)
            questions.Add(new() { ExperimentId = exp3.Id, QuestionType = "multiple-choice", QuestionText = "چه عاملی باعث القای جریان الکتریکی می‌شود؟", OptionsJson = "[\"ثابت بودن میدان مغناطیسی\", \"تغییر میدان مغناطیسی\", \"وجود آهنربای قوی\", \"افزایش دما\"]", Points = 10, DifficultyRating = 3, CorrectAnswerJson = "1" });

            // Questions for exp4 (آتشفشان)
            questions.Add(new() { ExperimentId = exp4.Id, QuestionType = "multiple-choice", QuestionText = "در آزمایش آتشفشان شیمیایی، گاز تولید شده چیست؟", OptionsJson = "[\"اکسیژن\", \"نیتروژن\", \"کربن دی‌اکسید\", \"هیدروژن\"]", Points = 10, DifficultyRating = 1, CorrectAnswerJson = "2" });
            questions.Add(new() { ExperimentId = exp4.Id, QuestionType = "true-false", QuestionText = "واکنش جوش شیرین و سرکه یک واکنش اسید-باز است.", OptionsJson = "[\"درست\", \"نادرست\"]", Points = 5, DifficultyRating = 1, CorrectAnswerJson = "0" });

            // Questions for exp5 (کروماتوگرافی)
            questions.Add(new() { ExperimentId = exp5.Id, QuestionType = "multiple-choice", QuestionText = "در کروماتوگرافی کاغذی، فاز ثابت چیست؟", OptionsJson = "[\"آب\", \"کاغذ\", \"جوهر\", \"الکل\"]", Points = 10, DifficultyRating = 2, CorrectAnswerJson = "1" });

            // Questions for exp6 (بلور نمک)
            questions.Add(new() { ExperimentId = exp6.Id, QuestionType = "fill-blank", QuestionText = "شکل بلورهای نمک طعام چیست؟", OptionsJson = "[]", Points = 10, DifficultyRating = 1, CorrectAnswerJson = "مکعبی" });
            questions.Add(new() { ExperimentId = exp6.Id, QuestionType = "multiple-choice", QuestionText = "برای رشد بلور، محلول باید چه حالتی داشته باشد؟", OptionsJson = "[\"رقیق\", \"فوق اشباع\", \"سرد\", \"اسیدی\"]", Points = 10, DifficultyRating = 2, CorrectAnswerJson = "1" });

            // Questions for exp7 (سلول پیاز)
            questions.Add(new() { ExperimentId = exp7.Id, QuestionType = "multiple-choice", QuestionText = "برای رنگ‌آمیزی سلول پیاز از چه ماده‌ای استفاده می‌شود؟", OptionsJson = "[\"متیلن بلو\", \"ید\", \"استون\", \"اتانول\"]", Points = 10, DifficultyRating = 2, CorrectAnswerJson = "1" });
            questions.Add(new() { ExperimentId = exp7.Id, QuestionType = "true-false", QuestionText = "سلول‌های پیاز دارای کلروپلاست هستند.", OptionsJson = "[\"درست\", \"نادرست\"]", Points = 5, DifficultyRating = 1, CorrectAnswerJson = "1" });

            // Questions for exp8 (فتوسنتز)
            questions.Add(new() { ExperimentId = exp8.Id, QuestionType = "multiple-choice", QuestionText = "گیاهان در فتوسنتز چه گازی تولید می‌کنند؟", OptionsJson = "[\"کربن دی‌اکسید\", \"نیتروژن\", \"اکسیژن\", \"هیدروژن\"]", Points = 10, DifficultyRating = 1, CorrectAnswerJson = "2" });
            questions.Add(new() { ExperimentId = exp8.Id, QuestionType = "true-false", QuestionText = "فتوسنتز فقط در حضور نور انجام می‌شود.", OptionsJson = "[\"درست\", \"نادرست\"]", Points = 5, DifficultyRating = 1, CorrectAnswerJson = "0" });

            // Questions for exp9 (جوانه زدن)
            questions.Add(new() { ExperimentId = exp9.Id, QuestionType = "multiple-choice", QuestionText = "کدام یک از عوامل زیر برای جوانه زدن ضروری است؟", OptionsJson = "[\"خاک\", \"کود\", \"آب\", \"نور مستقیم\"]", Points = 10, DifficultyRating = 1, CorrectAnswerJson = "2" });

            // Questions for exp10 (لایه‌های رسوبی)
            questions.Add(new() { ExperimentId = exp10.Id, QuestionType = "multiple-choice", QuestionText = "کدام ذره زودتر تهنشین می‌شود؟", OptionsJson = "[\"خاک رس\", \"ماسه\", \"شن\", \"سنگ ریزه\"]", Points = 10, DifficultyRating = 1, CorrectAnswerJson = "3" });

            // Questions for exp11 (حل شدن سنگ آهک)
            questions.Add(new() { ExperimentId = exp11.Id, QuestionType = "multiple-choice", QuestionText = "سنگ آهک عمدتاً از چه ماده‌ای تشکیل شده است؟", OptionsJson = "[\"سیلیس\", \"کربنات کلسیم\", \"اکسید آهن\", \"گوگرد\"]", Points = 10, DifficultyRating = 2, CorrectAnswerJson = "1" });

            // Questions for exp12 (منظومه شمسی)
            questions.Add(new() { ExperimentId = exp12.Id, QuestionType = "multiple-choice", QuestionText = "منظومه شمسی چند سیاره دارد؟", OptionsJson = "[\"۷\", \"۸\", \"۹\", \"۱۰\"]", Points = 10, DifficultyRating = 1, CorrectAnswerJson = "1" });

            // Questions for exp13 (دهانه‌های ماه)
            questions.Add(new() { ExperimentId = exp13.Id, QuestionType = "fill-blank", QuestionText = "دهانه‌های ماه در اثر برخورد چه چیزی ایجاد شده‌اند؟", OptionsJson = "[]", Points = 10, DifficultyRating = 2, CorrectAnswerJson = "شهاب سنگ" });
            questions.Add(new() { ExperimentId = exp13.Id, QuestionType = "true-false", QuestionText = "به دلیل نبود جو در ماه، دهانه‌ها فرسایش نمی‌یابند.", OptionsJson = "[\"درست\", \"نادرست\"]", Points = 5, DifficultyRating = 1, CorrectAnswerJson = "0" });

            _db.Set<ExperimentQuestion>().AddRange(questions);
            await _db.SaveChangesAsync();
            _db.ChangeTracker.Clear();
        }
    }
}