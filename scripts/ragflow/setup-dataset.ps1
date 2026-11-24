# Creates a RAGFlow dataset and uploads the project's knowledge documents.
# Run AFTER start-server.ps1, with the API key you created in the RAGFlow UI.
#
#   .\setup-dataset.ps1 -ApiKey ragflow-xxxx -Dataset "Nehzat Docs"

param(
    [Parameter(Mandatory = $true)] [string] $ApiKey,
    [string] $Dataset = "Nehzat Docs",
    [string] $Base = "http://127.0.0.1:8080",
    [string] $DocRoot = "D:\nehzat-plus\nehzat-plus"
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$H = @{ Authorization = "Bearer $ApiKey" }

function Test-Health {
    try {
        $r = Invoke-RestMethod -Uri "$Base/api/v1/system/healthz" -Method Get -TimeoutSec 5
        return ($null -ne $r)
    } catch { return $false }
}
if (-not (Test-Health)) {
    "ERROR: RAGFlow is not reachable at $Base - run start-server.ps1 first."
    exit 1
}

# 1) Create the dataset (idempotent: reuse if it already exists by name).
$existing = Invoke-RestMethod -Uri "$Base/api/v1/datasets?page=1&page_size=100" -Method Get -Headers $H -TimeoutSec 15
$ds = $existing.data | Where-Object { $_.name -eq $Dataset } | Select-Object -First 1
if ($ds) {
    $dsId = $ds.id
    "Using existing dataset: $Dataset ($dsId)"
} else {
    $new = Invoke-RestMethod -Uri "$Base/api/v1/datasets" -Method Post -Headers $H -ContentType "application/json" -TimeoutSec 15 -Body (@{ name = $Dataset; description = "Nehzat/Morabbi knowledge base" } | ConvertTo-Json)
    if ($new.code -ne 0) { "ERROR creating dataset: $($new.message)"; exit 1 }
    $dsId = $new.data.id
    "Created dataset: $Dataset ($dsId)"
}

# 2) Documents to index (knowledge / architecture / Quran analysis).
$files = @(
    "AGENTS.md",
    "docs\AGENTS.md",
    "frontend\AGENTS.md",
    "docs\OTUH2_AUTH.md",
    "docs\PROJECT_INVENTORY.md",
    "docs\quran-analysis\01-text-4-surahs.md",
    "docs\quran-analysis\TADABBUR_METHOD.md"
) | ForEach-Object { Join-Path $DocRoot $_ } | Where-Object { Test-Path $_ }

if ($files.Count -eq 0) { "ERROR: no documents found under $DocRoot"; exit 1 }

# 3) Upload (multipart).
foreach ($f in $files) {
    "Uploading: $(Split-Path $f -Leaf)"
    try {
        $resp = Invoke-RestMethod -Uri "$Base/api/v1/datasets/$dsId/documents" -Method Post -Headers $H -TimeoutSec 120 -Form @{ file = Get-Item $f }
        if ($resp.code -eq 0) { "  OK: $($resp.data.document_ids -join ', ')" }
        else { "  WARN: $($resp.message)" }
    } catch {
        "  FAIL: $($_.Exception.Message)"
    }
}

"Done. Open http://127.0.0.1:8080  ->  Knowledge Base -> `$Dataset`  and run the parser (chunking) on the documents."
"The coach page ( /coach/knowledge-ragflow ) will list this dataset once docs are parsed."
