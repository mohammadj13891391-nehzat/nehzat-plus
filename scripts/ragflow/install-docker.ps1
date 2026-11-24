# One-time elevated installer: WSL2 + Docker Desktop for RAGFlow.
# Run from a NORMAL terminal; the script re-launches itself elevated.
# Requires: 1) CPU virtualization ENABLED in BIOS (VT-x / AMD-V), 2) a reboot at the end.

$ErrorActionPreference = "Stop"

# 1) Re-launch elevated if needed
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Requesting administrator rights..." -ForegroundColor Yellow
    $arg = "-NoProfile -ExecutionPolicy Bypass -File `"$($MyInvocation.MyCommand.Path)`""
    Start-Process powershell -Verb RunAs -ArgumentList $arg
    exit 0
}

# 2) Check CPU virtualization (hard blocker)
$vsm = Get-CimInstance Win32_Processor | Select-Object -First 1
if (-not $vsm.VirtualizationFirmwareEnabled) {
    Write-Host ""
    Write-Host "ERROR: CPU virtualization is DISABLED in BIOS." -ForegroundColor Red
    Write-Host "Docker Desktop / WSL2 cannot work without it."
    Write-Host ""
    Write-Host "  1. Reboot the PC."
    Write-Host "  2. Enter BIOS setup (F2 / Del / F10 at power-on)."
    Write-Host "  3. Enable: Intel Virtualization Technology (VT-x)  OR  SVM / AMD-Virtualization."
    Write-Host "  4. Save & reboot, then run this script again."
    Write-Host ""
    exit 1
}
Write-Host "OK: CPU virtualization enabled." -ForegroundColor Green

# 3) Enable Windows features (WSL2 backend)
foreach ($f in "Microsoft-Windows-Subsystem-Linux", "VirtualMachinePlatform") {
    $st = Get-WindowsOptionalFeature -Online -FeatureName $f
    if ($st.State -ne "Enabled") {
        Write-Host "Enabling $f ..."
        Enable-WindowsOptionalFeature -Online -FeatureName $f -NoRestart | Out-Null
    } else {
        Write-Host "OK: $f already enabled." -ForegroundColor Green
    }
}

# 4) WSL2 + Ubuntu (no auto-launch)
wsl --set-default-version 2 2>$null
wsl --install -d Ubuntu --no-launch
if ($LASTEXITCODE -ne 0) {
    Write-Host "WSL install reported an issue - check output above. It may already be installed; continuing." -ForegroundColor Yellow
}

# 5) Docker Desktop (silent install if missing)
$dd = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (-not (Test-Path $dd)) {
    $arch = if ($env:PROCESSOR_ARCHITECTURE -eq "ARM64") { "arm64" } else { "amd64" }
    $dlDir = "D:\opencode-data\downloads"
    if (-not (Test-Path $dlDir)) { New-Item -ItemType Directory -Path $dlDir | Out-Null }
    $exe = Join-Path $dlDir "docker-desktop-stable.exe"
    $url = "https://desktop.docker.com/win/main/$arch/docker-desktop-stable.exe"
    Write-Host "Downloading Docker Desktop from $url ..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $exe -UseBasicParsing
    Write-Host "Installing Docker Desktop (silent, no restart)..."
    Start-Process -FilePath $exe -ArgumentList "/verysilent","/norestart" -Wait
    Write-Host "Docker Desktop installed." -ForegroundColor Green
} else {
    Write-Host "OK: Docker Desktop already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "================ REBOOT NOW ================" -ForegroundColor Cyan
Write-Host "Windows features need a reboot to finish installing."
Write-Host "After reboot:"
Write-Host "  1. Launch Docker Desktop once and accept the terms (WSL backend)."
Write-Host "  2. Run:  .\scripts\ragflow\start-server.ps1"
Write-Host "  3. Register in RAGFlow UI:  http://127.0.0.1:8080"
Write-Host "  4. Create an API key (User -> API Keys), then run setup-dataset.ps1 with it."
Write-Host "============================================"
exit 0
