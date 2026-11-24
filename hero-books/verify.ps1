[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$dir = "D:\nehzat-plus\nehzat-plus\hero-books"
$anchor = ([System.IO.File]::ReadAllText("$dir\_ref_anchor.txt",[System.Text.Encoding]::UTF8)).Trim()
$act    = ([System.IO.File]::ReadAllText("$dir\_ref_act.txt",[System.Text.Encoding]::UTF8)).Trim()
$close  = ([System.IO.File]::ReadAllText("$dir\_ref_closing.txt",[System.Text.Encoding]::UTF8)).Trim()
$qword  = ([System.IO.File]::ReadAllText("$dir\_ref_qhead.txt",[System.Text.Encoding]::UTF8)).Trim()
$files = @(
"79-ghavaher-4-6.md","79-ghavaher-7-9.md","79-ghavaher-10-12.md","79-ghavaher-13-15.md","79-ghavaher-16-18.md",
"80-mirza-shirazi-4-6.md","80-mirza-shirazi-7-9.md","80-mirza-shirazi-10-12.md","80-mirza-shirazi-13-15.md","80-mirza-shirazi-16-18.md"
)
# word-count min/max per filename age
function GetRange($n){
  if($n -match '4-6')  { return @(300,700) }
  if($n -match '7-9')  { return @(700,1500) }
  if($n -match '10-12'){ return @(1500,4000) }
  if($n -match '13-15'){ return @(4000,12000) }
  if($n -match '16-18'){ return @(4000,12000) }
}
function GetQRange($n){
  if($n -match '4-6')  { return @(1,2) }
  if($n -match '7-9')  { return @(2,3) }
  if($n -match '10-12'){ return @(3,5) }
  if($n -match '13-15'){ return @(5,8) }
  if($n -match '16-18'){ return @(5,8) }
}
$allOk = $true
foreach ($nf in $files) {
  $f = "$dir\books\$nf"
  $lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)
  $raw = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
  $h1 = ([regex]::Matches($raw,'(?m)^# ')).Count
  $nonEmpty = @($lines | Where-Object { $_.Trim() -ne '' })
  $last = $nonEmpty[-1]
  $closeOk = ($last -eq $close)
  # word count between anchor and next H1
  $idx = -1
  for ($i=0; $i -lt $lines.Count; $i++) { if ($lines[$i] -eq $anchor) { $idx=$i; break } }
  $wc = 0; $found = ($idx -ge 0)
  if ($found) {
    $j = $idx+1
    while ($j -lt $lines.Count -and -not ($lines[$j] -match '^#\s')) {
      $wc += @($lines[$j] -split '\s+' | Where-Object { $_ -ne '' }).Count
      $j++
    }
  }
  # question count: only numbered items under the "## <qword>" heading until next "## " or "# "
  $qfound = $false; $qc = 0
  for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^##\s' -and $lines[$i] -like "*$qword*") {
      $qfound = $true; $j = $i+1
      while ($j -lt $lines.Count -and -not ($lines[$j] -match '^#{1,2}\s')) {
        if ($lines[$j] -match '^\s*\d+[.]\s') { $qc++ }
        $j++
      }
      break
    }
  }
  $wr = GetRange $nf; $qr = GetQRange $nf
  $wcOk = ($found -and ($wc -ge $wr[0]) -and ($wc -le $wr[1]))
  $qcOk = ($qfound -and ($qc -ge $qr[0]) -and ($qc -le $qr[1]))
  $ok = ($h1 -eq 11) -and $closeOk -and $wcOk -and $qcOk
  if (-not $ok) { $allOk = $false }
  $flag = if ($ok) { "OK  " } else { "FAIL" }
  Write-Host ("{0,-28} {1} H1={2} close={3} words={4} (min{5},max{6}) wOK={7} q={8} (min{9},max{10}) qOK={11}" -f `
    $nf,$flag,$h1,$closeOk,$wc,$wr[0],$wr[1],$wcOk,$qc,$qr[0],$qr[1],$qcOk)
  if (-not $closeOk) { Write-Host "   LAST: $last" }
}
Write-Host "==="
if ($allOk) { Write-Host "ALL OK" } else { Write-Host "SOME FAILED" }
