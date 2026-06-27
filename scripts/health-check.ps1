# LegalFlow Health Check Script
$ErrorActionPreference = "Continue"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         LEGALFLOW SYSTEM HEALTH CHECK" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$allHealthy = $true

# 1. Check Docker Containers
Write-Host "`n[1/4] Checking Docker Containers..." -ForegroundColor Yellow
$containers = @("legalflow_postgres", "legalflow_minio", "legalflow_caddy")
foreach ($c in $containers) {
    $status = docker inspect -f '{{.State.Status}}' $c 2>$null
    if ($status -eq "running") {
        Write-Host "  [PASS] Container $c is running" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Container $c is NOT running (Status: $status)" -ForegroundColor Red
        $allHealthy = $false
    }
}

# 2. Check Backend API
Write-Host "`n[2/4] Checking Backend API (Port 3000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/login" -Method Options -TimeoutSec 3 -UseBasicParsing 2>$null
    Write-Host "  [PASS] Backend API is responsive on port 3000" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -ne $null) {
        Write-Host "  [PASS] Backend API reachable (HTTP $($_.Exception.Response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Backend API not responding on http://localhost:3000" -ForegroundColor Red
        $allHealthy = $false
    }
}

# 3. Check Frontend UI Server
Write-Host "`n[3/4] Checking Frontend Server (Port 5173)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 3 -UseBasicParsing 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "  [PASS] Frontend Dev Server responsive on port 5173" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Frontend responded with status $($response.StatusCode)" -ForegroundColor DarkYellow
    }
} catch {
    Write-Host "  [FAIL] Frontend Dev Server not responding on http://localhost:5173" -ForegroundColor Red
    $allHealthy = $false
}

# 4. Check MinIO Storage Service
Write-Host "`n[4/4] Checking MinIO Storage (Port 9000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:9000/minio/health/live" -Method Get -TimeoutSec 3 -UseBasicParsing 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Host "  [PASS] MinIO Storage live on port 9000" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] MinIO responded with status $($response.StatusCode)" -ForegroundColor DarkYellow
    }
} catch {
    Write-Host "  [FAIL] MinIO Storage not responding on port 9000" -ForegroundColor Red
    $allHealthy = $false
}

Write-Host "`n=================================================" -ForegroundColor Cyan
if ($allHealthy) {
    Write-Host " STATUS: ALL SYSTEMS HEALTHY & OPERATIONAL" -ForegroundColor Green
} else {
    Write-Host " STATUS: SOME COMPONENTS REQUIRE ATTENTION" -ForegroundColor Red
}
Write-Host "=================================================" -ForegroundColor Cyan
