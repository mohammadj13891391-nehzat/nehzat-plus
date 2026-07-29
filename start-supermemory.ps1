# Start Supermemory local server
# Prerequisites: download once with: Invoke-WebRequest -Uri "https://github.com/supermemoryai/supermemory/releases/download/server-v0.0.6/supermemory-server-windows-x64.exe" -OutFile "$env:TEMP\supermemory-server.exe"

$serverPath = "$env:TEMP\supermemory-server.exe"
if (-not (Test-Path $serverPath)) {
  Write-Host "Downloading supermemory-server..." -ForegroundColor Yellow
  $url = "https://github.com/supermemoryai/supermemory/releases/download/server-v0.0.6/supermemory-server-windows-x64.exe"
  Invoke-WebRequest -Uri $url -OutFile $serverPath -UseBasicParsing
}

# Read API key if exists
$apiKeyFile = "$env:USERPROFILE\.supermemory\api-key"
if (Test-Path $apiKeyFile) {
  $env:SUPERMEMORY_API_KEY = Get-Content $apiKeyFile
  Write-Host "API Key: $($env:SUPERMEMORY_API_KEY.Substring(0, 15))..." -ForegroundColor Green
}

$env:PORT = "6767"
$env:SUPERMEMORY_DISABLE_TELEMETRY = "1"

Write-Host "Starting supermemory on http://localhost:6767" -ForegroundColor Cyan
Start-Process -FilePath $serverPath -WindowStyle Normal -PassThru
Write-Host "Dashboard: http://localhost:6767" -ForegroundColor Cyan
