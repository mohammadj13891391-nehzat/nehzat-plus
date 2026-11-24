Write-Host "Processes:"
Get-Process dotnet,node -ErrorAction SilentlyContinue | Format-Table Id,ProcessName,Path -AutoSize

Write-Host "Ports 3000/4200/4201:"
Get-NetTCPConnection -LocalPort 3000,4200,4201 -State Listen -ErrorAction SilentlyContinue | Format-Table LocalAddress,LocalPort,OwningProcess -AutoSize

Write-Host "Jobs:"
Get-Job | Format-Table Id,Name,State -AutoSize

foreach ($job in Get-Job) {
    Write-Host "Output for Job $job.Id ($job.Name):"
    Receive-Job -Job $job -Keep -ErrorAction SilentlyContinue | Select-Object -Last 30
}
