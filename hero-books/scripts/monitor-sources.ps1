# monitor-sources.ps1 — پایش منابع قهرمان‌نگار
# هر اجرا: بررسی دسترس‌پذیری ۳ ویکی + URLهای کلیدی، لاگ در scripts/monitor-log.csv
# زمان‌بندی: هر ۵ دقیقه (Register-ScheduledTask)

$ErrorActionPreference = 'SilentlyContinue'
$root = 'D:\nehzat-plus\nehzat-plus\hero-books\scripts'
$logFile = Join-Path $root 'monitor-log.csv'
if (-not (Test-Path -LiteralPath $logFile)) {
    "timestamp,url,status,ms" | Set-Content -LiteralPath $logFile -Encoding UTF8
}

$urls = @(
    'https://fa.wikishia.net/',
    'https://wiki.ahlolbait.com/',
    'https://fa.wikifeqh.ir/',
    'https://fa.wikishia.net/view/پیامبر_اسلام',
    'https://fa.wikishia.net/view/امام_حسین',
    'https://fa.wikishia.net/view/امام_رضا',
    'https://fa.wikishia.net/view/زینب',
    'https://fa.wikishia.net/view/خدیجه',
    'https://fa.wikishia.net/view/مریم_دختر_عمران',
    'https://fa.wikishia.net/view/سکینه_دختر_امام_حسین(ع)',
    'https://wiki.ahlolbait.com/رده:ائمه_اطهار',
    'https://wiki.ahlolbait.com/رده:خاندان_اهل_البیت_علیهم_السلام',
    'https://wiki.ahlolbait.com/رده:پیامبران'
)

$ts = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
$lines = @()
foreach ($u in $urls) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $status = 'FAIL'
    try {
        $resp = Invoke-WebRequest -Uri $u -Method Head -TimeoutSec 15 -UserAgent 'Mozilla/5.0 (hero-books-monitor)' -UseBasicParsing
        if ($resp.StatusCode -eq 200 -or $resp.StatusCode -eq 301 -or $resp.StatusCode -eq 302) { $status = "OK($($resp.StatusCode))" }
        else { $status = "HTTP$($resp.StatusCode)" }
    }
    catch {
        try {
            $resp = Invoke-WebRequest -Uri $u -Method Get -TimeoutSec 20 -UserAgent 'Mozilla/5.0 (hero-books-monitor)' -UseBasicParsing
            if ($resp.StatusCode -eq 200) { $status = 'OK(GET)' } else { $status = "HTTP$($resp.StatusCode)" }
        }
        catch { $status = 'FAIL' }
    }
    $sw.Stop()
    $lines += "$ts,$($u),$($status),$([int]$sw.ElapsedMilliseconds)"
}
$lines | Add-Content -LiteralPath $logFile -Encoding UTF8

$failCount = (@($lines | Where-Object { $_ -match ',FAIL,' }).Count)
if ($failCount -gt 0) {
    "[$ts] ALERT: $failCount source(s) unreachable - check $logFile" | Add-Content -LiteralPath (Join-Path $root 'monitor-alerts.txt') -Encoding UTF8
}
