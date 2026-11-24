# Starts RAGFlow v1.0.0 via Docker on port 8080 (port 80 is taken by HTTP.sys).
# Prereq: install-docker.ps1 already ran + Docker Desktop is running.

$Repo = "D:\ragflow"
$Port = 8080
$RepoUrl = "https://github.com/infiniflow/ragflow.git"
$Tag = "v1.0.0"
$FrontendConfig = "D:\nehzat-plus\nehzat-plus\frontend\public\config.json"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    "ERROR: docker not found in PATH. Run install-docker.ps1 first and start Docker Desktop."
    exit 1
}

if (-not (Test-Path $Repo)) {
    "Cloning RAGFlow $Tag to $Repo ..."
    git clone --depth 1 --branch $Tag $RepoUrl $Repo
    if (-not $?) { "CLONE FAILED"; exit 1 }
}

# Port 80 is taken on this machine -> republish 8080:80 in the compose file.
$compose = Join-Path $Repo "docker\docker-compose.yml"
$c = Get-Content $compose -Raw
if ($c -match '"80:80"') {
    $c = $c -replace '"80:80"', "`"8080:80`""
    Set-Content -LiteralPath $compose -Value $c -NoNewline
    "Rewrote docker-compose.yml: 80 -> 8080"
}
elseif ($c -notmatch '8080:80') {
    "WARNING: could not find a '80:80' port mapping in docker-compose.yml - check it manually."
}

Set-Location -LiteralPath "$Repo\docker"
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") { Copy-Item ".env.example" ".env"; "Created .env from .env.example" }
    else { ".env exists in the repo - using it as-is" }
}

"Starting RAGFlow (docker compose)..."
docker compose -f docker-compose.yml up -d
if (-not $?) { "DOCKER COMPOSE FAILED"; exit 1 }

for ($i = 0; $i -lt 45; $i++) {
    Start-Sleep -Seconds 10
    try {
        $h = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/api/v1/system/healthz" -UseBasicParsing -TimeoutSec 5
        "HEALTH: $($h.StatusCode) $($h.Content)"
        break
    } catch { }
}

# Point the frontend at this RAGFlow instance.
$cfg = Get-Content $FrontendConfig -Raw | ConvertFrom-Json
$cfg.ragflowApiBase = "http://127.0.0.1:$Port"
$cfg | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $FrontendConfig -Encoding utf8
"Wrote ragflowApiBase=http://127.0.0.1:$Port into $FrontendConfig"

"RAGFlow is up on http://127.0.0.1:$Port"
"Next: register in the UI, create an API key (User -> API Keys), then run:"
"  .\setup-dataset.ps1 -ApiKey <your-key>"
