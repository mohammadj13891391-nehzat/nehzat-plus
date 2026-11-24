param([string[]]$Files)

function P([int[]]$c){ [string]::new([char[]]$c) }

$anchor = "# " + (P @(0x0645,0x062A,0x0646)) + " " + (P @(0x062A,0x0623,0x0644,0x06CC,0x0641,0x06CC)) + " (" + (P @(0x0646,0x0647,0x0627,0x06CC,0x06CC)) + ")"

# required H1s in order (indices 1..10)
$req = @(
  "# " + (P @(0x0634,0x0646,0x0627,0x0633,0x0646,0x0627,0x0645,0x0647,0x0646,0x0627,0x0645)),
  "# " + (P @(0x067E,0x0631,0x0648,0x0646,0x062F,0x0647)) + " " + (P @(0x0642,0x0647,0x0631,0x0645,0x0627,0x0646)),
  "# " + (P @(0x0647,0x062F,0x0641)) + " " + (P @(0x062A,0x0631,0x0628,0x06CC,0x062A,0x06CC)),
  "# " + (P @(0x0633,0x0627,0x062E,0x062A,0x0627,0x0631)) + " " + (P @(0x0631,0x0648,0x0627,0x06CC,0x06CC)) + " (" + (P @(0x06F9)) + " " + (P @(0x0628,0x062E,0x0634)) + ")",
  $anchor,
  "# " + (P @(0x062A,0x0635,0x0648,0x06CC,0x0631,0x06AF,0x0631,0x06CC)),
  "# " + (P @(0x0641,0x0639,0x0627,0x0644,0x06CC,0x062A)) + " " + (P @(0x0622,0x0645,0x0648,0x0632,0x0634,0x06CC)),
  "# " + (P @(0x0645,0x0646,0x0627,0x0628,0x0639)) + " (" + (P @(0x0645,0x0633,0x062A,0x0646,0x062F)) + ")",
  "# " + (P @(0x0627,0x0631,0x0630,0x06CC,0x0627,0x0628,0x06CC)),
  "# " + (P @(0x0627,0x0646,0x062A,0x0634,0x0627,0x0631))
)

# closing line: compare against reference file's last non-empty line
$refFile = "D:\nehzat-plus\nehzat-plus\hero-books\books\83-kouhkenari-4-6.md"
$refText = [System.IO.File]::ReadAllText($refFile, [System.Text.Encoding]::UTF8)
$refLines = @($refText -split "`n")
$refClosing = @($refLines | Where-Object { $_.Trim() -ne '' })[-1]

# source URL checks
$tpl = [System.IO.File]::ReadAllText("D:\nehzat-plus\nehzat-plus\hero-books\TEMPLATE.md", [System.Text.Encoding]::UTF8)
$tplLines = @($tpl -split "`n")
$url83 = $null; $url84 = $null
foreach($l in $tplLines){
  if($l -match "83-kouhkenari"){ $m = [regex]::Match($l, 'https://fa\.wikishia\.net/view/\S+'); if($m.Success){ $url83 = $m.Value } }
  if($l -match "84-shariat"){ $m = [regex]::Match($l, 'https://fa\.wikishia\.net/view/\S+'); if($m.Success){ $url84 = $m.Value } }
}

foreach($f in $Files){
  $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
  $lines = @($text -split "`n")
  $h1s = @($lines | Where-Object { $_ -match '^# ' })
  $h1ok = ($h1s.Count -eq 11)
  $orderOk = $true
  for($i=0;$i -lt 10;$i++){ if($h1s[$i+1].Trim() -ne $req[$i]){ $orderOk=$false } }
  $start = -1
  for($i=0;$i -lt $lines.Count;$i++){ if($lines[$i].Trim() -eq $anchor){ $start=$i; break } }
  $wcount = 0
  for($i=$start+1;$i -lt $lines.Count;$i++){ if($lines[$i] -match '^# '){break}; $wcount += ($lines[$i] -split '\s+').Count }
  $nonEmpty = @($lines | Where-Object { $_.Trim() -ne '' })
  $closingOk = ($nonEmpty[-1] -eq $refClosing)
  $bytes = [System.IO.File]::ReadAllBytes($f)
  $bomOk = (-not ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF))
  # question count: between "## سوالات" heading and "## فعاليت عملي" heading
  $qsec = -1; $qend = -1
  $qhead = "## " + (P @(0x0633,0x0648,0x0627,0x0627,0x0644,0x0627,0x062A)) + " " + (P @(0x0622,0x0645,0x0648,0x0632,0x0634,0x06CC))
  $ahead = "## " + (P @(0x0641,0x0639,0x0627,0x0644,0x06CC,0x062A)) + " " + (P @(0x0639,0x0645,0x0645,0x06CC))
  for($i=0;$i -lt $lines.Count;$i++){ if($lines[$i] -match '^## '){ $t=$lines[$i].Trim()
      if($qsec -eq -1 -and $t.StartsWith($qhead)){ $qsec=$i }
      elseif($qsec -ne -1 -and $qend -eq -1 -and $t.StartsWith($ahead)){ $qend=$i } } }
  if($qsec -ne -1 -and $qend -eq -1){ $qend = $lines.Count }
  $qcount = 0
  if($qsec -ne -1){ for($i=$qsec+1;$i -lt $qend;$i++){ if($lines[$i] -match '^\s*\d+[\.\u066B]\s'){ $qcount++ } } }
  # source url present?
  $is84 = $f -like "*84-shariat*"
  $url = if($is84){ $url84 } else { $url83 }
  $urlOk = $text.Contains($url)
  $name = Split-Path $f -Leaf
  $allOk = ($h1ok -and $orderOk -and $closingOk -and $bomOk -and $urlOk)
  $status = if($allOk){ "OK" } else { "CHECK" }
  "{0} | H1={1} order={2} words={3} closing={4} BOMnone={5} url={6} qcount={7} => {8}" -f $name, $h1s.Count, $orderOk, $wcount, $closingOk, $bomOk, $urlOk, $qcount, $status
}
