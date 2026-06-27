# Start LegalFlow Docker Infrastructure
$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path "$PSScriptRoot\.."
Set-Location $RootDir

Write-Host "=== Starting LegalFlow Docker Infrastructure ===" -ForegroundColor Cyan
Write-Host "Starting container services (PostgreSQL, MinIO, Caddy)..." -ForegroundColor Yellow

if (-not (Test-Path ".env.docker")) {
    if (Test-Path ".env.docker.example") {
        Write-Host "Creating .env.docker from example..." -ForegroundColor DarkYellow
        Copy-Item ".env.docker.example" ".env.docker" -Force
    }
}

docker compose -f docker-compose.infra.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDocker infrastructure started successfully!" -ForegroundColor Green
    Write-Host "Active containers:" -ForegroundColor Yellow
    docker ps --filter "name=legalflow_" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
} else {
    Write-Error "Failed to start Docker infrastructure. Check Docker service."
    exit $LASTEXITCODE
}
