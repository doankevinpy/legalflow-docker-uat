# Start LegalFlow Frontend Server (Vite)
$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path "$PSScriptRoot\.."
Set-Location $RootDir

Write-Host "=== Starting LegalFlow Frontend (Vite) ===" -ForegroundColor Cyan

if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env.local.example") {
        Write-Host "Creating .env.local from .env.local.example..." -ForegroundColor DarkYellow
        Copy-Item ".env.local.example" ".env.local" -Force
    }
}

Write-Host "`nStarting Frontend Development Server on http://localhost:5173 ..." -ForegroundColor Green
npm run dev
