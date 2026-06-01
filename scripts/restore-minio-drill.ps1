param(
    [string]$EnvFile = ".env.docker.example",
    [string]$BackupDir,
    [string]$MinioService = "minio",
    [string]$TargetBucket = "legalflow-docs-restore-drill",
    [string]$NetworkName = "legalflow_network",
    [switch]$Execute,
    [switch]$Force
)

if ($env:NODE_ENV -eq "production" -or $env:LEGALFLOW_ENV -eq "production") {
    Write-Host "[ERROR] Safety Guard: Cannot run this script in production environment!" -ForegroundColor Red
    exit 1
}

if ($TargetBucket -ne "legalflow-docs-restore-drill") {
    Write-Host "[ERROR] Safety Guard: Target Bucket must be 'legalflow-docs-restore-drill'." -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Starting MinIO Restore Drill Script..."

if ([string]::IsNullOrEmpty($BackupDir) -and $Execute) {
    Write-Host "[ERROR] -BackupDir parameter is required when running with -Execute." -ForegroundColor Red
    exit 1
}

if ($Execute -and !(Test-Path $BackupDir)) {
    Write-Host "[ERROR] Backup directory $BackupDir not found." -ForegroundColor Red
    exit 1
}

$envVars = @{}
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^\s*([^#\s][^=]+)=(.*)$') {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

$HasAccessKey = [bool]$envVars["MINIO_ACCESS_KEY"]
$HasSecretKey = [bool]$envVars["MINIO_SECRET_KEY"]

if (-not $HasAccessKey -or -not $HasSecretKey) {
    Write-Host "[ERROR] MINIO_ACCESS_KEY or MINIO_SECRET_KEY not found in $EnvFile" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Target Bucket: $TargetBucket"

if (-not $Execute) {
    Write-Host "[DRY-RUN] Would prompt for confirmation if -Force is not used."
    Write-Host "[DRY-RUN] Would run minio/mc container to create bucket '$TargetBucket' and mirror from $BackupDir"
    Write-Host "[DRY-RUN] No changes were made. Use -Execute to run the restore." -ForegroundColor Yellow
    exit 0
}

if (-not $Force) {
    $title = "Confirm MinIO Restore Drill"
    $message = "Ban co chac chan muon tien hanh Restore Drill len Bucket '$TargetBucket' khong? [Y/N]"
    $response = Read-Host $message
    if ($response -notmatch '^[Yy]$') {
        Write-Host "[INFO] Restore cancelled by user."
        exit 0
    }
}

$AbsEnvFile = Resolve-Path $EnvFile | Select-Object -ExpandProperty Path
$AbsBackupDir = Resolve-Path $BackupDir | Select-Object -ExpandProperty Path

Write-Host "[INFO] Recreating and mirroring to target bucket $TargetBucket..."

$DockerCmd = "docker run --rm -v `"${AbsBackupDir}:/backup`" --env-file `"$AbsEnvFile`" --network $NetworkName minio/mc sh -c `"mc alias set myalias http://$MinioService:9000 `$MINIO_ACCESS_KEY `$MINIO_SECRET_KEY && mc mb myalias/$TargetBucket --ignore-existing && mc mirror /backup/ myalias/$TargetBucket`""

Invoke-Expression $DockerCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Restore completed successfully." -ForegroundColor Green
} else {
    Write-Host "[ERROR] Restore failed. Exit code: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}
