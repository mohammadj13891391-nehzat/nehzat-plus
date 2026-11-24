$c = Get-NetTCPConnection -LocalPort 9621 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $c) { "lightrag-server not running (port 9621 free)"; exit 0 }
$p = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
"Stopping $($p.ProcessName) (PID $($c.OwningProcess))"
Stop-Process -Id $c.OwningProcess -Force
Start-Sleep -Seconds 2
$c2 = Get-NetTCPConnection -LocalPort 9621 -State Listen -ErrorAction SilentlyContinue
if ($c2) { "STILL LISTENING"; exit 1 } else { "Stopped" }
