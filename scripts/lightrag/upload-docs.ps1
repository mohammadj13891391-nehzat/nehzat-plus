param([Parameter(Mandatory)][string[]]$Files)
Add-Type -AssemblyName System.Net.Http
$client = New-Object System.Net.Http.HttpClient
$client.DefaultRequestHeaders.Add("X-API-Key", "lightrag-local-test")
foreach ($f in $Files) {
  if (-not (Test-Path -LiteralPath $f)) { "MISSING: $f"; continue }
  $ms = New-Object System.IO.MemoryStream
  $bytes = [System.IO.File]::ReadAllBytes($f)
  $ms.Write($bytes, 0, $bytes.Length)
  $ms.Position = 0
  $content = New-Object System.Net.Http.StreamContent($ms)
  $md = New-Object System.Net.Http.MultipartFormDataContent
  $md.Add($content, "file", (Split-Path $f -Leaf))
  $r = $client.PostAsync("http://127.0.0.1:9621/documents/upload", $md).Result
  $body = $r.Content.ReadAsStringAsync().Result
  "UPLOAD $(Split-Path $f -Leaf): $($r.StatusCode) | $body"
}
