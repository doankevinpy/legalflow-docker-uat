# Stop LegalFlow Stack and background services
$ErrorActionPreference = "Continue"

$RootDir = Resolve-Path "$PSScriptRoot\.."
Set-Location $RootDir

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "           STOPPING LEGALFLOW STACK" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Stop Node servers on ports 3000 and 5173
Write-Host "`n[1/2] Stopping Backend (3000) and Frontend (5173) servers..." -ForegroundColor Yellow
$ports = @(3000, 5173)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $pidToKill = $conn.OwningProcess
            if ($pidToKill -gt 0) {
                Write-Host "  Stopping Node process PID $pidToKill on port $port..." -ForegroundColor Yellow
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Host "  No active server listening on port $port." -ForegroundColor DarkGray
    }
}

# 2. Stop Docker containers
Write-Host "`n[2/2] Stopping Docker infrastructure containers..." -ForegroundColor Yellow
if (Test-Path "docker-compose.infra.yml") {
    docker compose -f docker-compose.infra.yml down
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Docker containers stopped successfully." -ForegroundColor Green
    } else {
        Write-Warning "  Docker compose down encountered issues."
    }
} else {
    Write-Warning "  docker-compose.infra.yml not found."
}

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "       LEGALFLOW STOPPED SUCCESSFULLY" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
