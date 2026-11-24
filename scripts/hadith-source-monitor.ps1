<#
  hadith-source-monitor.ps1
  -------------------------
  - Reads scripts\hadith-books-raw.txt (Author|DeathAH|Book, UTF-8)
  - Writes a chronological CSV
  - Monitors hadith/library sources every N seconds
  - Searches books in noorlib's search API (signal-based, self-healing)
  - Appends a CSV report and updates a JSON state file (full book ledger)
  - Does not stop on transient errors

  Book status:
    Pending    - not searched yet (or search failed, will retry next cycles)
    Unverified - searched, but noorlib returned its known broken baseline
                 (identical unfiltered result for any query) - source degraded
    Found      - searched, and the response differs from the broken baseline
                 (i.e. the search engine is actually filtering again)

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\hadith-source-monitor.ps1
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\hadith-source-monitor.ps1 -Once
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\hadith-source-monitor.ps1 -IntervalSeconds 60 -BooksPerCycle 10
#>

param(
    [int]$IntervalSeconds = 300,
    [int]$BooksPerCycle = 5,
    [int]$SourceTimeoutSec = 5,
    [int]$SearchTimeoutSec = 20,
    [switch]$Once
)

$ErrorActionPreference = 'Continue'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataFile  = Join-Path $scriptDir 'hadith-books-raw.txt'
$outDir    = Join-Path $scriptDir 'hadith-monitor-output'
$csvPath   = Join-Path $outDir 'hadith-books-chronology.csv'
$logPath   = Join-Path $outDir 'monitor-report.csv'
$statePath = Join-Path $outDir 'monitor-state.json'

if (-not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

# ---------------------------------------------------------------------------
# Load book list
# ---------------------------------------------------------------------------
if (-not (Test-Path -LiteralPath $dataFile)) {
    Write-Host "ERROR: data file not found: $dataFile" -ForegroundColor Red
    exit 1
}

$rawLines = [System.IO.File]::ReadAllLines($dataFile, [System.Text.Encoding]::UTF8)
$books = foreach ($line in $rawLines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $parts = $line.Split('|', 3)
    if ($parts.Count -lt 3) { continue }
    [PSCustomObject]@{
        Author  = $parts[0].Trim()
        DeathAH = [int]$parts[1]
        Book    = $parts[2].Trim()
    }
}

$sorted = @($books | Sort-Object -Property @{Expression='DeathAH'; Ascending=$true}, @{Expression='Author'; Ascending=$true})

# Write chronological CSV
$csvLines = @('Author,DeathAH,Book')
foreach ($b in $sorted) {
    $author = $b.Author -replace '"', '""' -replace ',', ' '
    $book   = $b.Book  -replace '"', '""' -replace ',', ' '
    $csvLines += ('"{0}","{1}","{2}"' -f $author, $b.DeathAH, $book)
}
[System.IO.File]::WriteAllLines($csvPath, $csvLines, [System.Text.Encoding]::UTF8)
Write-Host "Chronology CSV written: $csvPath" -ForegroundColor Green

# ---------------------------------------------------------------------------
# Source definitions
# ---------------------------------------------------------------------------
$sources = @(
    [PSCustomObject]@{ Name = 'noorlib';     Check = 'https://noorlib.com' }
    [PSCustomObject]@{ Name = 'wikisource';  Check = 'https://fa.wikisource.org/w/api.php?action=opensearch&search=test&format=json' }
    [PSCustomObject]@{ Name = 'shiaprophet'; Check = 'https://www.shiaprophet.com' }
    [PSCustomObject]@{ Name = 'hawzah';      Check = 'https://hawzah.com' }
    [PSCustomObject]@{ Name = 'marja';       Check = 'https://www.marja.com' }
    [PSCustomObject]@{ Name = 'archive.org'; Check = 'https://archive.org' }
    [PSCustomObject]@{ Name = 'hathitrust';  Check = 'https://babel.hathitrust.org' }
    [PSCustomObject]@{ Name = 'googlebooks'; Check = 'https://books.google.com' }
    [PSCustomObject]@{ Name = 'worldcat';    Check = 'https://search.worldcat.org' }
)

function Test-SourceHealth {
    param([PSCustomObject]$Source)
    try {
        $resp = Invoke-WebRequest -Uri $Source.Check -Method Head -TimeoutSec $SourceTimeoutSec -UseBasicParsing -ErrorAction Stop
        return [PSCustomObject]@{
            Status = 'Up'
            Detail = "$($resp.StatusCode)"
        }
    } catch [System.Net.WebException] {
        # Some sites block HEAD; fall back to GET with a short timeout
        try {
            $resp = Invoke-WebRequest -Uri $Source.Check -Method Get -TimeoutSec $SourceTimeoutSec -UseBasicParsing -ErrorAction Stop
            return [PSCustomObject]@{
                Status = 'Up'
                Detail = "GET $($resp.StatusCode)"
            }
        } catch {
            return [PSCustomObject]@{
                Status = 'Down'
                Detail = $_.Exception.Message
            }
        }
    } catch {
        return [PSCustomObject]@{
            Status = 'Down'
            Detail = $_.Exception.Message
        }
    }
}

# ---------------------------------------------------------------------------
# noorlib search (POST /api/search/generalSearchPhrase)
# The search microservice is currently degraded for external IPs: it returns
# the same unfiltered baseline for every query (total=110278, single
# 'special-authors' group). We detect that baseline and only trust responses
# that differ from it (self-healing when their service recovers).
# ---------------------------------------------------------------------------
$noorlibBaselineTotal = 110278

function Invoke-NoorlibSearch {
    param([string]$Title)
    $q = $Title | ConvertTo-Json -Compress
    $body = '{"origin":"noorlib.web.app","language":"fa","sp.display_type":"details","sort":"rank-desc","page_size":5,"page_number":1,"query":' + $q + '}'
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    for ($i = 1; $i -le 2; $i++) {
        try {
            $r = Invoke-WebRequest -Uri 'https://noorlib.com/api/search/generalSearchPhrase' `
                -Method Post -Body $bytes -ContentType 'application/json' `
                -UseBasicParsing -TimeoutSec $SearchTimeoutSec -Headers @{ UserAgent = 'Mozilla/5.0' }
            $j = $r.Content | ConvertFrom-Json
            if ($j.isSuccess -eq $true) {
                $groupTypes = @($j.data.resultList | ForEach-Object { $_.type })
                $groupText = @($j.data.resultList | ForEach-Object {
                    $t = $_.type
                    $n = @($_.itemList).Count
                    "$t($n)"
                }) -join ','
                return [PSCustomObject]@{
                    Ok           = $true
                    Total        = [int]$j.data.resultListTotalCount
                    Groups       = $groupText
                    RealGroups   = @($groupTypes | Where-Object { $_ -ne 'special-authors' -and $_ -ne 'special-books' })
                }
            }
        } catch { }
        Start-Sleep -Milliseconds 300
    }
    return [PSCustomObject]@{ Ok = $false; Total = $null; Groups = '' }
}

function Test-BookSearch {
    param([PSCustomObject]$Book)
    $res = Invoke-NoorlibSearch -Title $Book.Book
    if (-not $res.Ok) {
        return [PSCustomObject]@{ Status = 'Pending'; Detail = 'noorlib search failed (retries exhausted)' }
    }
    # A genuine hit means a real result group appears (not just the default
    # 'special-authors'/'special-books' suggestion widgets).
    if (@($res.RealGroups).Count -eq 0) {
        return [PSCustomObject]@{
            Status = 'Unverified'
            Detail = "noorlib no result group (total=$($res.Total) groups=$($res.Groups))"
        }
    }
    return [PSCustomObject]@{
        Status = 'Found'
        Detail = "noorlib result groups=$($res.RealGroups -join '+') (total=$($res.Total) groups=$($res.Groups))"
    }
}

# ---------------------------------------------------------------------------
# Load existing book ledger from state (so progress survives restarts)
# ---------------------------------------------------------------------------
$ledger = @{}
if (Test-Path -LiteralPath $statePath) {
    try {
        $prev = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($prev.PSObject.Properties.Name -contains 'Books') {
            foreach ($pb in $prev.Books) {
                $ledger[$pb.Book] = [PSCustomObject]@{
                    Book         = $pb.Book
                    Author       = $pb.Author
                    DeathAH      = [int]$pb.DeathAH
                    Status       = $pb.Status
                    Detail       = $pb.Detail
                    LastSearched = $pb.LastSearched
                }
            }
        }
    } catch {
        Write-Host "WARN: could not parse previous state, starting fresh ledger" -ForegroundColor DarkYellow
    }
}
foreach ($b in $sorted) {
    if (-not $ledger.ContainsKey($b.Book)) {
        $ledger[$b.Book] = [PSCustomObject]@{
            Book         = $b.Book
            Author       = $b.Author
            DeathAH      = $b.DeathAH
            Status       = 'Pending'
            Detail       = ''
            LastSearched = $null
        }
    }
}

# ---------------------------------------------------------------------------
# Monitoring loop
# ---------------------------------------------------------------------------
Write-Host "Hadith Source Monitor started." -ForegroundColor Cyan
Write-Host "Interval  : $IntervalSeconds seconds" -ForegroundColor Cyan
Write-Host "Books     : $($sorted.Count) ($BooksPerCycle searches/cycle)" -ForegroundColor Cyan
Write-Host "Report    : $logPath" -ForegroundColor Cyan
Write-Host "State     : $statePath" -ForegroundColor Cyan
if ($Once) { Write-Host "Mode      : single cycle (-Once)" -ForegroundColor Cyan }

$cycle = 0
do {
    $cycle++
    $ts = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    Write-Host ""
    Write-Host "[$ts] Cycle $cycle started" -ForegroundColor Yellow

    $rows = @()
    $sourceHealth = @()

    # 1) Check all sources
    foreach ($s in $sources) {
        $health = Test-SourceHealth -Source $s
        $sourceHealth += [PSCustomObject]@{
            Name   = $s.Name
            Status = $health.Status
            Detail = $health.Detail
        }
        $color = if ($health.Status -eq 'Up') { 'Green' } else { 'Red' }
        Write-Host ("  Source {0,-12} : {1} ({2})" -f $s.Name, $health.Status, $health.Detail) -ForegroundColor $color

        $rows += [PSCustomObject]@{
            Time    = $ts
            Cycle   = $cycle
            Type    = 'Source'
            Name    = $s.Name
            Status  = $health.Status
            Detail  = $health.Detail
        }
    }

    # 2) Search the next batch: Pending books first; once none remain, re-search
    #    Unverified books so they auto-upgrade to Found when a source recovers
    $queue = @($sorted | Where-Object { $ledger[$_.Book].Status -eq 'Pending' })
    if ($queue.Count -eq 0) {
        $queue = @($sorted | Where-Object { $ledger[$_.Book].Status -eq 'Unverified' })
    }
    $batch = @($queue | Select-Object -First $BooksPerCycle)
    foreach ($b in $batch) {
        $res = Test-BookSearch -Book $b
        $ledger[$b.Book].Status = $res.Status
        $ledger[$b.Book].Detail = $res.Detail
        $ledger[$b.Book].LastSearched = $ts
        $color = switch ($res.Status) { 'Found' { 'Green' } 'Unverified' { 'DarkYellow' } default { 'DarkGray' } }
        Write-Host ("  Book  {0,-40} : {1}" -f $b.Book, $res.Status) -ForegroundColor $color

        $rows += [PSCustomObject]@{
            Time    = $ts
            Cycle   = $cycle
            Type    = 'Book'
            Name    = $b.Book
            Status  = $res.Status
            Detail  = "Author=$($b.Author); DeathAH=$($b.DeathAH); $($res.Detail)"
        }
    }
    if ($batch.Count -eq 0) {
        Write-Host "  All books already Found - nothing to search." -ForegroundColor DarkGray
    }

    # 3) Append report
    if ($rows.Count -gt 0) {
        $rows | Export-Csv -LiteralPath $logPath -NoTypeInformation -Append -Encoding UTF8
    }

    # 4) Update state (full ledger)
    $sourceSummary = $sourceHealth | ForEach-Object {
        [PSCustomObject]@{ Name = $_.Name; Status = $_.Status }
    }
    $bookLedger = @($sorted | ForEach-Object { $ledger[$_.Book] })
    $foundCount      = @($bookLedger | Where-Object Status -eq 'Found').Count
    $unverifiedCount = @($bookLedger | Where-Object Status -eq 'Unverified').Count
    $pendingCount    = @($bookLedger | Where-Object Status -eq 'Pending').Count

    $state = [PSCustomObject]@{
        LastRun      = $ts
        Cycle        = $cycle
        TotalBooks   = $sorted.Count
        Interval     = $IntervalSeconds
        BooksFound   = $foundCount
        BooksUnverified = $unverifiedCount
        BooksPending = $pendingCount
        Sources      = $sourceSummary
        Books        = $bookLedger
    }
    $state | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statePath -Encoding UTF8

    Write-Host "[$ts] Cycle $cycle complete. Books: Found=$foundCount Unverified=$unverifiedCount Pending=$pendingCount" -ForegroundColor Green

    if ($Once) { break }
    Write-Host "Next check in $IntervalSeconds seconds..." -ForegroundColor DarkGray
    Start-Sleep -Seconds $IntervalSeconds
} while (-not $Once)
