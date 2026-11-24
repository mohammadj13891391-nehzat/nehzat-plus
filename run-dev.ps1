# Run backend and frontend for development
Start-Job -ScriptBlock {
  Set-Location "$PSScriptRoot\backend\src\EducationalPlatform.Nehzat.API"
  dotnet run
}
# Wait for backend to start
Start-Sleep -Seconds 5
Set-Location "$PSScriptRoot\frontend"
# Ensure dependencies installed
npm install
npm start
