---
name: build-and-verify
description: Use when the user asks to build, run, start, or verify the backend and frontend together. Covers "bok and run", "build and serve", "start all", "verify connection", "بکند و فرانت", "بالا بیار", "بیلد کن". Triggers on requests to compile, launch, or health-check both services.
---

# Build & Verify — Backend + Frontend

Builds, starts, and verifies connectivity between the .NET backend and Angular frontend.
Optimized for speed: parallel starts, polling instead of fixed sleeps, no redundant builds.

## Prerequisites

- .NET 10 SDK (`dotnet --version`)
- Node.js + npm (`node --version`)
- SQL Server running on localhost with the connection string in `backend/LessonPlanner.Api/appsettings.json`

## Execution

Run ALL steps in a single script. Do NOT split into separate tool calls for each step.

### Step 1: Kill + Start Both Services in Parallel

```powershell
# Kill existing
@(3000, 4200) | ForEach-Object {
    $c = Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($c) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 1

# Start backend (dotnet run builds automatically)
Start-Job -ScriptBlock {
    Set-Location "D:\nehzat-plus\nehzat-plus\backend"
    dotnet run --project LessonPlanner.Api --urls "http://localhost:3000" 2>&1
} | Out-Null

# Start frontend
Start-Job -ScriptBlock {
    Set-Location "D:\nehzat-plus\nehzat-plus\frontend"
    npx ng serve 2>&1
} | Out-Null
```

### Step 2: Poll Until Both Are Ready (max 30s)

```powershell
$maxWait = 30
$backendOk = $false
$frontendOk = $false

for ($i = 0; $i -lt $maxWait; $i++) {
    Start-Sleep -Seconds 1

    if (-not $backendOk) {
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:3000/auth/signin" -Method POST -ContentType "application/json" -Body '{"username":"test","password":"password"}' -TimeoutSec 2 -ErrorAction Stop
            if ($r.StatusCode -eq 200) { $backendOk = $true; Write-Host "Backend UP (attempt $($i+1))" }
        } catch {}
    }

    if (-not $frontendOk) {
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:4200" -TimeoutSec 2 -ErrorAction Stop
            if ($r.StatusCode -eq 200) { $frontendOk = $true; Write-Host "Frontend UP (attempt $($i+1))" }
        } catch {}
    }

    if ($backendOk -and $frontendOk) { break }
}
```

### Step 3: Verify Connectivity + Print Summary

```powershell
$connectivity = "FAILED"
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000/auth/signin" -Method POST -ContentType "application/json" -Body '{"username":"test","password":"password"}' -TimeoutSec 3 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    if ($d.message -eq "Sign-in successful" -and $d.userType -eq "admin") { $connectivity = "OK" }
} catch {}

Write-Host ""
Write-Host "Backend:  http://localhost:3000  [$(if ($backendOk) {'RUNNING'} else {'FAILED'})]"
Write-Host "Frontend: http://localhost:4200  [$(if ($frontendOk) {'RUNNING'} else {'FAILED'})]"
Write-Host "API Auth: /auth/signin           [$connectivity]"
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `port already in use` | Kill existing process on that port (step 1) |
| `dotnet build` fails | Check .NET SDK version, restore packages: `dotnet restore` |
| `npm start` fails | Check `node_modules/` exists, run `npm install` if missing |
| Backend 404 on root `/` | Normal — backend has no root route. Use `/auth/signin` to test |
| SQL Server connection error | Verify SQL Server is running and credentials in `appsettings.json` are correct |
| Frontend can't reach backend | Check CORS is enabled (it is by default) and backend port matches `environment.ts` |

## Test Accounts

| Type | Username | Password |
|------|----------|----------|
| admin | test | password |
| student | ali.ahmadi | password123 |
| student | fateme.mohammadi | password123 |
| student | mohammad.rezaei | password123 |
