param(
    [switch]$Execute,
    [string]$EnvFile = ".env.docker.example",
    [string]$LocalBackupRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups",
    [string]$RemoteMockRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_REMOTE_BACKUPS"
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

$PgBackupScript = Join-Path $ScriptDir "backup-postgres.ps1"
$MinioBackupScript = Join-Path $ScriptDir "backup-minio.ps1"

$ScriptVersion = "1.1.0"
$StatusSuccess = $null
$StatusFailed = $null

if (-not $Execute) {
    Write-Host "[DRY-RUN] Starting scheduled backup plan." -ForegroundColor Cyan
} else {
    Write-Host "[INFO] Starting scheduled backup execution." -ForegroundColor Cyan
}

# 1. Preflight Checks
Write-Host "--- Preflight Checks ---"
if (-not (Test-Path $PgBackupScript)) {
    Write-Host "[ERROR] Missing script: $PgBackupScript" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $MinioBackupScript)) {
    Write-Host "[ERROR] Missing script: $MinioBackupScript" -ForegroundColor Red
    exit 1
}

if ($Execute) {
    # Check Docker daemon
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Docker is not running or not accessible. Aborting." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[DRY-RUN] Would check if Docker is running."
}

# 2. Output Folders
Write-Host "--- Output Folders Setup ---"
$CurrentBackupDir = Join-Path $LocalBackupRoot $Timestamp
$StatusSuccess = Join-Path $CurrentBackupDir "status.success"
$StatusFailed = Join-Path $CurrentBackupDir "status.failed"

if ($Execute) {
    if (-not (Test-Path $CurrentBackupDir)) {
        New-Item -ItemType Directory -Path $CurrentBackupDir | Out-Null
    }
    Write-Host "[INFO] Created backup directory: $CurrentBackupDir"
} else {
    Write-Host "[DRY-RUN] Would create directory: $CurrentBackupDir"
    Write-Host "[DRY-RUN] Would write status.success if backup succeeds."
}

# 3. Run Sub-Scripts
Function Write-StatusFailed {
    param([string]$Reason)
    if ($StatusFailed) {
        @(
            "timestamp=$((Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ'))",
            "status=failed",
            "reason=$Reason",
            "script_version=$ScriptVersion"
        ) | Out-File -FilePath $StatusFailed -Encoding ASCII
        if (Test-Path $StatusSuccess) { Remove-Item -LiteralPath $StatusSuccess -Force }
        Write-Host "[INFO] Written status.failed marker." -ForegroundColor Red
    }
}

Write-Host "--- Running PostgreSQL Backup ---"
if ($Execute) {
    & powershell -ExecutionPolicy Bypass -File $PgBackupScript -EnvFile $EnvFile -BackupRoot $CurrentBackupDir -Execute
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] PostgreSQL backup failed. Aborting." -ForegroundColor Red
        Write-StatusFailed -Reason "postgres_backup_failed"
        exit 1
    }
} else {
    Write-Host "[DRY-RUN] Would run: powershell -ExecutionPolicy Bypass -File $PgBackupScript -EnvFile $EnvFile -BackupRoot $CurrentBackupDir"
    & powershell -ExecutionPolicy Bypass -File $PgBackupScript -EnvFile $EnvFile -BackupRoot $CurrentBackupDir
}

Write-Host "--- Running MinIO Backup ---"
if ($Execute) {
    & powershell -ExecutionPolicy Bypass -File $MinioBackupScript -EnvFile $EnvFile -BackupRoot $CurrentBackupDir -Execute
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] MinIO backup failed. Aborting." -ForegroundColor Red
        Write-StatusFailed -Reason "minio_backup_failed"
        exit 1
    }
} else {
    Write-Host "[DRY-RUN] Would run: powershell -ExecutionPolicy Bypass -File $MinioBackupScript -EnvFile $EnvFile -BackupRoot $CurrentBackupDir"
    & powershell -ExecutionPolicy Bypass -File $MinioBackupScript -EnvFile $EnvFile -BackupRoot $CurrentBackupDir
}

# 4. Write status marker
if ($Execute) {
    Write-Host "--- Writing Status Marker ---"
    # Mutual exclusion: remove status.failed if it somehow exists
    if (Test-Path $StatusFailed) { Remove-Item -LiteralPath $StatusFailed -Force }
    @(
        "timestamp=$((Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ'))",
        "status=success",
        "script_version=$ScriptVersion"
    ) | Out-File -FilePath $StatusSuccess -Encoding ASCII
    Write-Host "[INFO] Written status.success marker." -ForegroundColor Green
}

# 5. Verify & Remote Sync
Write-Host "--- Verification & Remote Sync ---"
Write-Host "[INFO] Verify step reserved for Phase 9.3C/9.3D"

if ($Execute) {
    Write-Host "[INFO] Skipping physical remote sync until verify step is implemented."
} else {
    Write-Host "[DRY-RUN] Would sync $CurrentBackupDir to $RemoteMockRoot upon verification success."
}

# 6. Cleanup
Write-Host "--- Cleanup ---"
Write-Host "[INFO] Cleanup step reserved for future phase"

if (-not $Execute) {
    Write-Host "[DRY-RUN] No filesystem changes were made." -ForegroundColor Cyan
} else {
    Write-Host "[INFO] Scheduled backup execution completed successfully." -ForegroundColor Green
}
