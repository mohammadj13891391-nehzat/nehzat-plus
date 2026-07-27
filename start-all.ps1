param(
  [switch]$NoBuild,
  [switch]$Seed
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend
$backendArgs = @()
if ($Seed) { $backendArgs += '--seed' }
$backendJob = Start-Process -WindowStyle Normal -FilePath 'dotnet' -ArgumentList @(
  'run', '--project', "$root\backend\src\EducationalPlatform.Nehzat.API"
) @backendArgs -PassThru -NoNewWindow:$false

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
$frontendArgs = @('run', 'serve')
if ($NoBuild) { $frontendArgs += '--no-hmr' }
$frontendJob = Start-Process -WindowStyle Normal -FilePath 'npx.cmd' -ArgumentList @(
  'ng', 'serve'
) -WorkingDirectory "$root\frontend" -PassThru -NoNewWindow:$false

Write-Host "`n=== Nehzat Plus — Backend (port 3000) + Frontend (port 4201) ===" -ForegroundColor Green
Write-Host "Backend PID: $($backendJob.Id)" -ForegroundColor Cyan
Write-Host "Frontend PID: $($frontendJob.Id)" -ForegroundColor Cyan
Write-Host "`nPress any key to stop both servers..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

# Cleanup
Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
Write-Host "Servers stopped." -ForegroundColor Yellow
