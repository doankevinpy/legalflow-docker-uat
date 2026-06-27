# Start Full LegalFlow Stack (Infra + Backend + Frontend)
$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path "$PSScriptRoot\.."
Set-Location $RootDir

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "     LAUNCHING FULL LEGALFLOW STACK" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Start Docker Infrastructure
Write-Host "`n[Step 1/3] Starting Docker Infrastructure..." -ForegroundColor Yellow
& "$PSScriptRoot\start-infra.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Infrastructure startup failed. Aborting full stack start."
    exit 1
}

Start-Sleep -Seconds 3

# 2. Launch Backend in a new PowerShell window
Write-Host "`n[Step 2/3] Launching Backend Server in a separate window..." -ForegroundColor Yellow
$backendScript = Join-Path $PSScriptRoot "start-backend.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$backendScript`""

Start-Sleep -Seconds 4

# 3. Launch Frontend in a new PowerShell window
Write-Host "`n[Step 3/3] Launching Frontend Server in a separate window..." -ForegroundColor Yellow
$frontendScript = Join-Path $PSScriptRoot "start-frontend.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$frontendScript`""

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "          LEGALFLOW IS LAUNCHING!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "-> Frontend Dashboard : http://localhost:5173" -ForegroundColor White
Write-Host "-> Backend API Server : http://localhost:3000" -ForegroundColor White
Write-Host "-> MinIO Console      : http://localhost:9001" -ForegroundColor White
Write-Host "=================================================" -ForegroundColor Green
