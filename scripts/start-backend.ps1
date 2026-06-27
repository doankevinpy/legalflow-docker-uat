# Start LegalFlow Backend Server (NestJS)
$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path "$PSScriptRoot\.."
$BackendDir = Join-Path $RootDir "legalflow-backend"
Set-Location $BackendDir

Write-Host "=== Starting LegalFlow Backend (NestJS) ===" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.postgres.example") {
        Write-Host "Creating .env from .env.postgres.example..." -ForegroundColor DarkYellow
        Copy-Item ".env.postgres.example" ".env" -Force
    } else {
        Write-Warning "No .env found in legalflow-backend and no .env.postgres.example present."
    }
}

Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Checking Database Migrations..." -ForegroundColor Yellow
try {
    npx prisma migrate deploy
} catch {
    Write-Warning "Prisma migrate deploy threw an warning/error. Ensure Docker Postgres is running."
}

Write-Host "`nStarting Backend Development Server on http://localhost:3000 ..." -ForegroundColor Green
npm run start:dev
