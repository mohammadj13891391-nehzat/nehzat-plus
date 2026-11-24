# Kill existing processes on 3000 and 4200/4201
@(3000, 4200, 4201) | ForEach-Object {
    $c = Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($c) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 2

# Start backend as a detached process
Start-Process -FilePath "dotnet" -ArgumentList "run","--project","D:\nehzat-plus\nehzat-plus\backend\src\EducationalPlatform.Nehzat.API\EducationalPlatform.Nehzat.API.csproj" -WorkingDirectory "D:\nehzat-plus\nehzat-plus\backend" -NoNewWindow

# Start frontend as a detached process
Start-Process -FilePath "cmd.exe" -ArgumentList "/c","cd /d D:\nehzat-plus\nehzat-plus\frontend && npm start" -NoNewWindow

# Poll for up to 60s
$backendOk = $false
$frontendOk = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 2
    if (-not $backendOk) {
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:3000/auth/signin" -Method POST -ContentType "application/json" -Body '{"username":"test","password":"password"}' -ErrorAction Stop
            if ($r.StatusCode -eq 200) { $backendOk = $true; Write-Host "Backend UP (attempt $($i+1))" }
        } catch {}
    }
    if (-not $frontendOk) {
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:4201" -ErrorAction Stop
            if ($r.StatusCode -eq 200) { $frontendOk = $true; Write-Host "Frontend UP (attempt $($i+1))" }
        } catch {}
    }
    if ($backendOk -and $frontendOk) { break }
}

Write-Host ""
Write-Host "Backend:  http://localhost:3000  [$(if ($backendOk) {'RUNNING'} else {'FAILED'})]"
Write-Host "Frontend: http://localhost:4201  [$(if ($frontendOk) {'RUNNING'} else {'FAILED'})]"
