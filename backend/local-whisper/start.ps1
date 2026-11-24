# Local keyless Persian audio->text transcription server (dev tool).
#
# One-time setup (uses Python 3.12; 3.15 breaks the 'av' build):
#   & "D:\Python312\python.exe" -m venv .venv
#   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
#
# Run:
#   .\start.ps1
#
# Env overrides: WHISPER_MODEL (default small), WHISPER_COMPUTE (int8), PORT (9500).
# The backend reads it via AI:TranscribeUrl in appsettings.Development.json.

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

# Pick a compatible Python (3.10-3.13). Prefer D:\Python312 if present.
$py = $null
foreach ($cand in @("D:\Python312\python.exe")) {
    if (Test-Path $cand) { $py = $cand; break }
}
if (-not $py) {
    $ver = (python --version 2>&1)
    if ($ver -match "3\.(1[0-3])\.") { $py = "python" }
}
if (-not $py) { throw "Need Python 3.10-3.13 (e.g. D:\Python312). Found a version that cannot build 'av'." }

$venv = Join-Path $here ".venv"
$pyexe = Join-Path $venv "Scripts\python.exe"
if (-not (Test-Path $pyexe)) {
    Write-Host "Creating venv..."
    & $py -m venv $venv
    & $pyexe -m pip install --upgrade pip -q
    & $pyexe -m pip install -r (Join-Path $here "requirements.txt") -q
}

$env:WHISPER_MODEL = if ($env:WHISPER_MODEL) { $env:WHISPER_MODEL } else { "small" }
$env:WHISPER_COMPUTE = if ($env:WHISPER_COMPUTE) { $env:WHISPER_COMPUTE } else { "int8" }
$env:PORT = if ($env:PORT) { $env:PORT } else { "9500" }

$log = Join-Path $env:TEMP "nehzat-whisper-server.log"
$err = Join-Path $env:TEMP "nehzat-whisper-server.err.log"
Start-Process -FilePath $pyexe -ArgumentList (Join-Path $here "transcribe_server.py") `
    -WindowStyle Hidden -RedirectStandardOutput $log -RedirectStandardError $err

Start-Sleep -Seconds 15
$listen = Get-NetTCPConnection -LocalPort ([int]$env:PORT) -State Listen -ErrorAction SilentlyContinue
if ($listen) {
    Write-Host "Whisper server up on http://127.0.0.1:$($env:PORT) (model: $($env:WHISPER_MODEL))"
    Write-Host "Logs: $log"
} else {
    Write-Warning "Server not listening yet. First start downloads the model; check $err"
}
