@echo off
REM OpenCode Zen Pipeline - Auto Setup Script
REM Usage: setup.bat [path-to-project]
REM   If no path is given, sets up the current directory
REM Example: setup.bat          (in the project folder)
REM Example: setup.bat C:\my-project

echo ============================================================
echo   🌀 OpenCode Zen Pipeline - Setup
echo ============================================================
echo.

REM Determine target project path
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=%CD%"

echo Target project: %TARGET%
echo.

REM Check if target is a valid project (has opencode.jsonc or is empty/doesn't exist)
if not exist "%TARGET%" (
    echo Creating project directory...
    mkdir "%TARGET%"
)

REM Create .opencode directories
if not exist "%TARGET%\.opencode" mkdir "%TARGET%\.opencode"
if not exist "%TARGET%\.opencode\skills" mkdir "%TARGET%\.opencode\skills"
if not exist "%TARGET%\.opencode\command" mkdir "%TARGET%\.opencode\command"

REM Copy zen-pipeline skill to project
echo 📋 Installing zen-pipeline skill...
if exist "%TARGET%\.opencode\skills\zen-pipeline" rmdir /s /q "%TARGET%\.opencode\skills\zen-pipeline"
xcopy /E /I /Y "D:\nehzat-plus\Abzar\اسکیل مدل رایگان\docs" "%TARGET%\.opencode\skills\zen-pipeline" >nul
echo    ✅ Skill installed in %TARGET%\.opencode\skills\zen-pipeline\

REM Copy zen-pipeline command
echo 📋 Installing /zen-pipeline command...
copy /Y "D:\nehzat-plus\Abzar\اسکیل مدل رایگان\zen-commands.md" "%TARGET%\.opencode\command\zen-pipeline.md" >nul
echo    ✅ Command installed

REM Update opencode.jsonc with zen provider
echo 📋 Updating opencode.jsonc...
if exist "%TARGET%\opencode.jsonc" (
    REM Check if zen provider already exists
    findstr /C:"zen" "%TARGET%\opencode.jsonc" >nul 2>&1
    if errorlevel 1 (
        REM Zen provider not found - add it
        echo    (Will add zen provider to opencode.jsonc)
        powershell -Command ^
            "$config = Get-Content '%TARGET%\opencode.jsonc' -Raw | ConvertFrom-Json; ^
            if (-not $config.provider) { $config | Add-Member -NotePropertyName 'provider' -NotePropertyValue @{} }; ^
            $config.provider | Add-Member -NotePropertyName 'zen' -NotePropertyValue @{'npm'='@ai-sdk/openai-compatible';'name'='OpenCode Zen (Free)';'options'=@{baseURL='https://opencode.ai/zen/v1'};'models'=@{'ling-3.0-flash-free'=@{'name'='Ling 3.0 Flash Free'};'big-pickle'=@{'name'='Big Pickle'};'deepseek-v4-flash-free'=@{'name'='DeepSeek V4 Flash'};'mimo-v2.5-free'=@{'name'='MiMo V2.5'};'nemotron-3-ultra-free'=@{'name'='Nemotron 3 Ultra'};'north-mini-code-free'=@{'name'='North Mini Code'};'hy3-free'=@{'name'='Hy3 Preview'}}}; ^
            $config | ConvertTo-Json -Depth 10 | Set-Content '%TARGET%\opencode.jsonc'"
        echo    ✅ Zen provider added to opencode.jsonc
    ) else (
        echo    ⚠️  Zen provider already exists in opencode.jsonc (skipping)
    )
) else (
    REM No opencode.jsonc exists - create one
    echo    Creating new opencode.jsonc...
    copy /Y "D:\nehzat-plus\Abzar\اسکیل مدل رایگان\opencode.jsonc" "%TARGET%\opencode.jsonc" >nul
    echo    ✅ opencode.jsonc created
)

echo.
echo ============================================================
echo   ✅ Setup Complete!
echo ============================================================
echo.
echo Next steps:
echo   1. Run this ONCE per machine:
echo      opencode auth login
echo      (Select OpenCode Zen → Anonymous)
echo.
echo   2. Then in OpenCode:
echo      /zen-pipeline       (run full pipeline)
echo      /pipeline           (quick pipeline)
echo      or just type your task and it auto-runs
echo.
echo Files installed to:
echo   %TARGET%\.opencode\skills\zen-pipeline\SKILL.md
echo   %TARGET%\.opencode\command\zen-pipeline.md
echo   %TARGET%\opencode.jsonc (updated)
echo.