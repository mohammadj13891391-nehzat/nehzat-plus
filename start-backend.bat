@echo off
cd /d "%~dp0backend"
dotnet run --project src/EducationalPlatform.Nehzat.API --launch-profile http
