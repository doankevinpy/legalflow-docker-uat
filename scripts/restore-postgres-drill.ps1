param(
    [string]$EnvFile = ".env.docker.example",
    [string]$BackupFile,
    [string]$PostgresService = "postgres",
    [string]$TargetDB = "legalflow_restore_drill",
    [switch]$Execute,
    [switch]$Force
)

if ($env:NODE_ENV -eq "production" -or $env:LEGALFLOW_ENV -eq "production") {
    Write-Host "[ERROR] Safety Guard: Cannot run this script in production environment!" -ForegroundColor Red
    exit 1
}

if ($TargetDB -ne "legalflow_restore_drill") {
    Write-Host "[ERROR] Safety Guard: Target DB must be 'legalflow_restore_drill'." -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Starting PostgreSQL Restore Drill Script..."

if ([string]::IsNullOrEmpty($BackupFile) -and $Execute) {
    Write-Host "[ERROR] -BackupFile parameter is required when running with -Execute." -ForegroundColor Red
    exit 1
}

if ($Execute -and !(Test-Path $BackupFile)) {
    Write-Host "[ERROR] Backup file $BackupFile not found." -ForegroundColor Red
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

$PgUser = $envVars["POSTGRES_USER"]
$HasPassword = [bool]$envVars["POSTGRES_PASSWORD"]

if ([string]::IsNullOrEmpty($PgUser)) {
    Write-Host "[ERROR] POSTGRES_USER not found in $EnvFile" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Target DB: $TargetDB"

if (-not $Execute) {
    Write-Host "[DRY-RUN] Would prompt for confirmation if -Force is not used."
    Write-Host "[DRY-RUN] Would run: docker compose exec $PostgresService dropdb --if-exists -U <user> $TargetDB"
    Write-Host "[DRY-RUN] Would run: docker compose exec $PostgresService createdb -U <user> $TargetDB"
    Write-Host "[DRY-RUN] Would run: docker compose exec -T $PostgresService pg_restore -U <user> -d $TargetDB -1 < `"$BackupFile`""
    Write-Host "[DRY-RUN] No changes were made. Use -Execute to run the restore." -ForegroundColor Yellow
    exit 0
}

if (-not $Force) {
    $title = "Confirm Restore Drill"
    $message = "Ban co chac chan muon tien hanh Restore Drill len DB '$TargetDB' khong? [Y/N]"
    $response = Read-Host $message
    if ($response -notmatch '^[Yy]$') {
        Write-Host "[INFO] Restore cancelled by user."
        exit 0
    }
}

Write-Host "[INFO] Recreating target database $TargetDB..."
$DropCmd = "docker compose -f docker-compose.full.yml --env-file `"$EnvFile`" exec -T $PostgresService dropdb --if-exists -U $PgUser $TargetDB"
Invoke-Expression $DropCmd | Out-Null

$CreateCmd = "docker compose -f docker-compose.full.yml --env-file `"$EnvFile`" exec -T $PostgresService createdb -U $PgUser $TargetDB"
Invoke-Expression $CreateCmd | Out-Null

Write-Host "[INFO] Executing database restore to $TargetDB..."
$RestoreCmd = "docker compose -f docker-compose.full.yml --env-file `"$EnvFile`" exec -T $PostgresService pg_restore -U $PgUser -d $TargetDB -1"
$FullCmd = "cmd.exe /c `"$RestoreCmd < `"$BackupFile`"`""
Invoke-Expression $FullCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Restore completed successfully." -ForegroundColor Green
} else {
    Write-Host "[ERROR] Restore failed. Exit code: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}
