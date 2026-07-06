namespace EducationalPlatform.Nehzat.API.Helpers;

public static class FileUploadValidator
{
    private static readonly long MaxFileSizeBytes = 10 * 1024 * 1024;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".gif",
        ".mp3", ".wav",
        ".mp4",
        ".pdf",
        ".doc", ".docx",
        ".txt"
    };

    private static readonly byte[] JpegMagic = [0xFF, 0xD8, 0xFF];
    private static readonly byte[] PngMagic = [0x89, 0x50, 0x4E, 0x47];
    private static readonly byte[] GifMagic = [0x47, 0x49, 0x46];

    public static bool IsValidFile(IFormFile? file, out string? errorMessage)
    {
        errorMessage = null;

        if (file == null || file.Length == 0)
        {
            errorMessage = "فایل خالی است یا ارسال نشده است";
            return false;
        }

        if (file.Length > MaxFileSizeBytes)
        {
            errorMessage = "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد";
            return false;
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
        {
            errorMessage = "نوع فایل مجاز نیست. فرمت‌های مجاز: jpg, jpeg, png, gif, mp3, wav, mp4, pdf, doc, docx, txt";
            return false;
        }

        if (IsImageExtension(extension))
        {
            if (!ValidateImageMagicBytes(file))
            {
                errorMessage = "محتوای فایل تصویری با فرمت اعلام‌شده مطابقت ندارد";
                return false;
            }
        }

        return true;
    }

    private static bool IsImageExtension(string extension)
    {
        return extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase)
            || extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase)
            || extension.Equals(".png", StringComparison.OrdinalIgnoreCase)
            || extension.Equals(".gif", StringComparison.OrdinalIgnoreCase);
    }

    private static bool ValidateImageMagicBytes(IFormFile file)
    {
        try
        {
            var header = new byte[8];
            using var stream = file.OpenReadStream();
            var bytesRead = stream.Read(header, 0, 8);

            if (bytesRead < 4)
                return false;

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (ext is ".jpg" or ".jpeg")
                return StartsWith(header, JpegMagic);

            if (ext == ".png")
                return StartsWith(header, PngMagic);

            if (ext == ".gif")
                return StartsWith(header, GifMagic);
        }
        catch
        {
            return false;
        }

        return true;
    }

    private static bool StartsWith(byte[] source, byte[] prefix)
    {
        if (source.Length < prefix.Length)
            return false;

        for (int i = 0; i < prefix.Length; i++)
        {
            if (source[i] != prefix[i])
                return false;
        }

        return true;
    }
}
