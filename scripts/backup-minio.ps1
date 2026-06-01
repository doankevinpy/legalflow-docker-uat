param(
    [string]$EnvFile = ".env.docker.example",
    [string]$BackupRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups",
    [string]$MinioService = "minio",
    [string]$BucketName = "legalflow-docs",
    [string]$NetworkName = "legalflow_network",
    [switch]$Execute
)

if ($env:NODE_ENV -eq "production" -or $env:LEGALFLOW_ENV -eq "production") {
    Write-Host "[ERROR] Safety Guard: Cannot run this script in production environment!" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Starting MinIO Backup Script..."

if (!(Test-Path $EnvFile)) {
    Write-Host "[ERROR] Environment file $EnvFile not found." -ForegroundColor Red
    exit 1
}

$envVars = @{}
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*([^#\s][^=]+)=(.*)$') {
        $envVars[$matches[1].Trim()] = $matches[2].Trim()
    }
}

$HasAccessKey = [bool]$envVars["MINIO_ACCESS_KEY"]
$HasSecretKey = [bool]$envVars["MINIO_SECRET_KEY"]

if (-not $HasAccessKey -or -not $HasSecretKey) {
    Write-Host "[ERROR] MINIO_ACCESS_KEY or MINIO_SECRET_KEY not found in $EnvFile" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Env keys present - AccessKey: True, SecretKey: True"

# We must resolve to an absolute path for docker volume mapping
$AbsEnvFile = Resolve-Path $EnvFile | Select-Object -ExpandProperty Path
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = Join-Path $BackupRoot "minio\$Timestamp"

if (-not $Execute) {
    Write-Host "[DRY-RUN] Would create directory: $BackupDir"
    Write-Host "[DRY-RUN] Would run minio/mc container to mirror bucket '$BucketName' to $BackupDir"
    Write-Host "[DRY-RUN] No changes were made. Use -Execute to run the backup." -ForegroundColor Yellow
    exit 0
}

Write-Host "[INFO] Creating backup directory: $BackupDir"
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

$AbsBackupDir = Resolve-Path $BackupDir | Select-Object -ExpandProperty Path

# Format the path for docker if on windows (Convert \ to / or just let docker handle it)
# Docker on windows usually handles absolute paths well in recent versions.
$DockerCmd = "docker run --rm -v `"${AbsBackupDir}:/backup`" --env-file `"$AbsEnvFile`" --network $NetworkName minio/mc sh -c `"mc alias set myalias http://$MinioService:9000 `$MINIO_ACCESS_KEY `$MINIO_SECRET_KEY && mc mirror myalias/$BucketName /backup/`""

Write-Host "[INFO] Executing MinIO mirror..."
Invoke-Expression $DockerCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Backup completed. Files saved to: $BackupDir" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backup failed. Exit code: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}
