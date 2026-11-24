# Fine-tune a Persian Whisper model from the Nehzat training corpus.
#
# Pipeline (all local, no API key):
#   1. prepare_dataset.py  - resample collected audio to 16 kHz WAV + train/val jsonl
#   2. finetune_whisper.py - fine-tune an HF Whisper model on that dataset
#   3. ctranslate2.converters.whisper - convert the HF checkpoint to CTranslate2
#   4. POST /reload to the running transcribe server (hot-swap, optional)
#
# Output:  models\nehzat-fa-vN\   (N = next version; the transcribe server auto-
#         picks the newest one on restart, or you hot-swap with /reload).
#
# Usage:
#   .\train.ps1                                  # full pipeline, tiny model, 4 epochs
#   .\train.ps1 -ModelSize small -Epochs 6       # bigger base model
#   .\train.ps1 -Steps 2000 -NoReload            # limit steps, skip hot-swap
#   .\manifest.jsonl -> pass via -Manifest
#
# First run downloads PyTorch + a Whisper base model (hundreds of MB) and can
# take a while. Training on CPU is slow; prefer -ModelSize tiny for quick tests.

param(
    [string]$DatasetDir = (Join-Path $PSScriptRoot "dataset"),
    [string]$ModelSize  = "tiny",
    [int]$Epochs        = 4,
    [int]$Steps         = -1,
    [int]$BatchSize     = 4,
    [double]$Lr         = 1e-5,
    [int]$MinSamples    = 20,
    [string]$Manifest   = "",
    [string]$BackendBase = "http://localhost:3000",
    [string]$Token      = $env:NEHZAT_TOKEN,
    [string]$ServerUrl  = "http://127.0.0.1:9500",
    [switch]$SkipPrep,
    [switch]$SkipTrain,
    [switch]$NoReload
)

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot

# ---- Python selection (3.10-3.13; 3.15 breaks torch/av builds) -------------
$py = $null
if (Test-Path "D:\Python312\python.exe") { $py = "D:\Python312\python.exe" }
if (-not $py) {
    $ver = (python --version 2>&1)
    if ($ver -match "3\.(1[0-3])\.") { $py = "python" }
}
if (-not $py) { throw "Need Python 3.10-3.13 (e.g. D:\Python312)." }

$venv = Join-Path $here ".venv-train"
$pyexe = Join-Path $venv "Scripts\python.exe"
if (-not (Test-Path $pyexe)) {
    Write-Host "Creating training venv..." -ForegroundColor Cyan
    & $py -m venv $venv
}

$need = @("torch", "transformers", "datasets", "soundfile", "accelerate", "ctranslate2", "tiktoken", "huggingface_hub", "av")
function Test-Missing($mods) {
    $out = & $pyexe -c "import importlib.util,sys; missing=[m for m in $mods if importlib.util.find_spec(m) is None]; print(' '.join(missing))"
    return -not [string]::IsNullOrWhiteSpace($out.Trim())
}
if (Test-Missing $need) {
    Write-Host "Installing training dependencies (one-time, may be large)..." -ForegroundColor Cyan
    & $pyexe -m pip install --upgrade pip -q
    & $pyexe -m pip install torch -q
    & $pyexe -m pip install transformers datasets accelerate soundfile ctranslate2 tiktoken huggingface_hub av -q
}

$modelsDir = Join-Path $here "models"
New-Item -ItemType Directory -Force -Path $modelsDir | Out-Null

# ---- 1. Prepare dataset -----------------------------------------------------
if (-not $SkipPrep) {
    Write-Host "==> Preparing dataset into $DatasetDir" -ForegroundColor Cyan
    $prepArgs = @("prepare_dataset.py", "--out", $DatasetDir, "--min-samples", $MinSamples)
    if ($Manifest) {
        $prepArgs += @("--manifest", $Manifest)
    } else {
        if (-not $Token) { $Token = (Get-Content "C:\Users\$env:USERNAME\AppData\Local\Temp\opencode\token.txt" -Raw -ErrorAction SilentlyContinue | ForEach-Object { $_.Trim() }) }
        if (-not $Token) { throw "No token. Pass -Token or -Manifest, or set NEHZAT_TOKEN (used to fetch the corpus from the backend)." }
        $prepArgs += @("--base", $BackendBase, "--token", $Token)
    }
    & $pyexe (Join-Path $here "prepare_dataset.py") @prepArgs
    if ($LASTEXITCODE -ne 0) { throw "prepare_dataset.py failed (exit $LASTEXITCODE)." }
}

# ---- 2. Fine-tune ------------------------------------------------------------
$hfOut = Join-Path $DatasetDir "hf-finetuned"
if (-not $SkipTrain) {
    Write-Host "==> Fine-tuning $ModelSize Whisper on $DatasetDir" -ForegroundColor Cyan
    $ftArgs = @("finetune_whisper.py", "--dataset_dir", $DatasetDir, "--model_size", $ModelSize, "--out_dir", $hfOut, "--epochs", $Epochs, "--batch_size", $BatchSize, "--lr", $Lr)
    if ($Steps -gt 0) { $ftArgs += @("--max_steps", $Steps) }
    & $pyexe (Join-Path $here "finetune_whisper.py") @ftArgs
    if ($LASTEXITCODE -ne 0) { throw "finetune_whisper.py failed (exit $LASTEXITCODE)." }
}

# ---- 3. Convert to CTranslate2 ----------------------------------------------
$existing = Get-ChildItem $modelsDir -Directory -Filter "nehzat-fa*" -ErrorAction SilentlyContinue
$next = 1
if ($existing) { $next = (($existing | ForEach-Object { [int]($_.Name -replace "nehzat-fa-v?(\d+)$", '$1') } | Measure-Object -Maximum).Maximum) + 1 }
$target = Join-Path $modelsDir "nehzat-fa-v$next"
Write-Host "==> Converting HF checkpoint -> CTranslate2 at $target" -ForegroundColor Cyan
& $pyexe -m ctranslate2.converters.whisper $hfOut --output_dir $target
if ($LASTEXITCODE -ne 0) { throw "ctranslate2 conversion failed (exit $LASTEXITCODE)." }

Write-Host ""
Write-Host "Fine-tuned Persian Whisper model ready: $target" -ForegroundColor Green

# ---- 4. Hot-swap the running server -----------------------------------------
if (-not $NoReload) {
    try {
        $body = '{"model":"latest"}'
        $resp = Invoke-WebRequest -Uri "$ServerUrl/reload" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing -TimeoutSec 120
        if ($resp.StatusCode -eq 200) {
            Write-Host "==> Server reloaded with the new model. Active: $($resp.Content)" -ForegroundColor Green
        } else {
            Write-Warning "Reload returned $($resp.StatusCode)."
        }
    } catch {
        Write-Warning "Could not hot-reload the server (is it running on $ServerUrl?). Restart it to use the new model:  .\start.ps1"
    }
}

Write-Host ""
Write-Host "Done. Version v$next will be auto-selected on the next server start." -ForegroundColor Green
