using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities.Hadith;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class HadithDataSeeder
{
    private readonly AppDbContext _db;

    public HadithDataSeeder(AppDbContext db)
    {
        _db = db;
    }

    public async Task SeedAsync()
    {
        if (await _db.Set<HadithBook>().AnyAsync())
            return;

        var nawawiBook = new HadithBook
        {
            Title = "الأربعون النووية",
            TitleTranslation = "چهل حدیث نووی",
            Description = "مجموعه‌ای از ۴۲ حدیث از امام نووی که اصول کلی اسلام را پوشش می‌دهد",
            AuthorName = "النووی",
            HadithCount = 42,
            DisplayOrder = 1,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Set<HadithBook>().Add(nawawiBook);
        await _db.SaveChangesAsync();

        var chapter = new HadithChapter
        {
            HadithBookId = nawawiBook.Id,
            Title = "الأحاديث",
            TitleTranslation = "احادیث",
            Description = "چهل حدیث نووی",
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Set<HadithChapter>().Add(chapter);
        await _db.SaveChangesAsync();

        var hadiths = new List<Hadith>
        {
            new()
            {
                HadithNumber = 1,
                MatnArabic = "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا، أَوْ امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
                Translation = "همانا اعمال به نیت‌ها بستگی دارد و هر کس آنچه نیت کرده بهره می‌برد. پس هر که هجرتش به سوی خدا و رسول باشد، هجرتش به سوی خدا و رسول است و هر که هجرتش برای دنیایی باشد که به دست آورد یا زنی که با او ازدواج کند، هجرتش به سوی همان چیزی است که به سویش هجرت کرده است",
                Explanation = "این حدیث بنیادین نشان می‌دهد که ارزش اعمال به نیت انجام‌دهنده بستگی دارد. نیت شرط قبولی اعمال است و هر کس به نیت خود پاداش می‌گیرد",
                FiqhTakeaway = "نیت شرط قبولی اعمال است و اعمال بر اساس نیت‌ها ارزشگذاری می‌شوند",
                Grade = "Sahih",
                HadithChapterId = chapter.Id,
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                HadithNumber = 2,
                MatnArabic = "عَنْ عُمَرَ رَضِيَ اللَّهُ عَنْهُ أَيْضًا قَالَ: بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ، إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعْرِ... فَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنْ الْإِسْلَامِ...",
                Translation = "عمر بن خطاب روایت می‌کند: روزی نزد رسول خدا (ص) نشسته بودیم که مردی با لباس بسیار سفید و موی بسیار سیاه بر ما ظاهر شد... گفت: ای محمد مرا از اسلام خبر ده...",
                Explanation = "این حدیث معروف به حدیث جبرئیل است و ارکان اسلام، ایمان و احسان را توضیح می‌دهد. همچنین نشانه‌های قیامت را بیان می‌کند",
                FiqhTakeaway = "اسلام پنج رکن دارد: شهادتین، نماز، زکات، روزه، حج. ایمان شش رکن دارد. احسان عبارت است از عبادت خدا چنانکه گویا او را می‌بینی",
                Grade = "Sahih",
                HadithChapterId = chapter.Id,
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                HadithNumber = 3,
                MatnArabic = "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",
                Translation = "عبدالله بن عمر روایت می‌کند که رسول خدا (ص) فرمود: اسلام بر پنج پایه بنا شده است: شهادت اینکه معبودی جز خدا نیست و محمد رسول خداست، برپا داشتن نماز، پرداخت زکات، حج خانه خدا و روزه رمضان",
                Explanation = "این حدیث ارکان عملی اسلام را بیان می‌کند. این پنج رکن پایه‌های اصلی دین اسلام هستند",
                FiqhTakeaway = "اسلام پنج رکن اصلی دارد که هر مسلمانی باید به آنها پایبند باشد",
                Grade = "Sahih",
                HadithChapterId = chapter.Id,
                DisplayOrder = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                HadithNumber = 4,
                MatnArabic = "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: حَدَّثَنَا رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَهُوَ الصَّادِقُ الْمَصْدُوقُ: إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا نُطْفَةً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إِلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ...",
                Translation = "عبدالله بن مسعود روایت می‌کند که رسول خدا (ص) که راستگو و تصدیق شده است فرمود: همانا آفرینش هر یک از شما در شکم مادرش در چهل روز به صورت نطفه جمع می‌شود، سپس به همان اندازه علقه می‌گردد، سپس به همان اندازه مضغه می‌شود، سپس فرشته فرستاده می‌شود و در او روح می‌دمد...",
                Explanation = "این حدیث مراحل خلقت انسان در رحم مادر و سپس سرنوشت او را بر اساس قضای الهی بیان می‌کند",
                FiqhTakeaway = "خلقت انسان مراحل مشخصی دارد و سرنوشت سعادت و شقاوت به قضای الهی بستگی دارد اما انسان با اختیار خود عمل می‌کند",
                Grade = "Sahih",
                HadithChapterId = chapter.Id,
                DisplayOrder = 4,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                HadithNumber = 5,
                MatnArabic = "عَنْ أُمِّ الْمُؤْمِنِينَ أُمِّ عَبْدِ اللَّهِ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا قَالَتْ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ",
                Translation = "عایشه ام المؤمنین روایت می‌کند که رسول خدا (ص) فرمود: هر کس در امر (دین) ما چیزی را ایجاد کند که از آن نیست، مردود است",
                Explanation = "این حدیث اصلی مهم در رد بدعت‌ها را بیان می‌کند. هر عمل جدیدی که به دین نسبت داده شود در حالی که از دین نیست، پذیرفته نخواهد شد",
                FiqhTakeaway = "بدعت در دین مردود است و هر عمل عبادی باید بر اساس سنت رسول خدا (ص) باشد",
                Grade = "Sahih",
                HadithChapterId = chapter.Id,
                DisplayOrder = 5,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        _db.Set<Hadith>().AddRange(hadiths);
        await _db.SaveChangesAsync();
    }
}
