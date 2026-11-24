param(
  [string]$Query,
  [string]$QueryFile,
  [ValidateSet("local", "global", "hybrid", "naive", "mix")][string]$Mode = "hybrid"
)
if ($QueryFile) { $Query = (Get-Content -LiteralPath $QueryFile -Raw -Encoding UTF8).Trim() }
if (-not $Query) { "ERROR: provide -Query or -QueryFile"; exit 1 }
Add-Type -AssemblyName System.Net.Http
$client = New-Object System.Net.Http.HttpClient
$client.Timeout = [System.TimeSpan]::FromSeconds(600)
$client.DefaultRequestHeaders.Add("X-API-Key", "lightrag-local-test")
$payload = @{ query = $Query; mode = $Mode } | ConvertTo-Json -Compress
$sw = [System.Diagnostics.Stopwatch]::StartNew()
try {
  $r = $client.PostAsync("http://127.0.0.1:9621/query", [System.Net.Http.StringContent]::new($payload, [System.Text.Encoding]::UTF8, "application/json")).Result
  $j = $r.Content.ReadAsStringAsync().Result | ConvertFrom-Json
  "### [$Mode] $($sw.Elapsed.TotalSeconds.ToString('F1'))s | $($j.response.Length) chars"
  $j.response
  "REFS: " + (($j.references | ForEach-Object { $_.file_path }) -join "; ")
} catch {
  "### [$Mode] $($sw.Elapsed.TotalSeconds.ToString('F1'))s ERROR: $($_.Exception.Message)"
  exit 1
}
