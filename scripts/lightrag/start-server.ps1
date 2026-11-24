$env:PYTHONIOENCODING = "utf-8"
$env:PYTHONUTF8 = "1"
$c = Get-NetTCPConnection -LocalPort 9621 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($c) {
  $old = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
  "Stopping existing (PID $($old.Id)): $($old.ProcessName)"
  Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 3
}
$p = Start-Process -FilePath "D:\opencode-data\bin\lightrag-server.exe" -WorkingDirectory "D:\lightrag" -WindowStyle Hidden -RedirectStandardOutput "D:\lightrag\server.log" -RedirectStandardError "D:\lightrag\server.err.log" -PassThru
"Started PID: $($p.Id)"
for ($i = 0; $i -lt 15; $i++) {
  Start-Sleep -Seconds 4
  try { $h = Invoke-WebRequest -Uri "http://127.0.0.1:9621/health" -UseBasicParsing -TimeoutSec 5; "HEALTH: $($h.StatusCode) $($h.Content)"; exit 0 } catch { }
}
"HEALTH CHECK FAILED - check D:\lightrag\server.err.log"
exit 1
