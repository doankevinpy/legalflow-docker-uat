param(
    [string]$EnvFile = ".env.docker.example",
    [string]$BackupRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups",
    [string]$PostgresService = "postgres",
    [switch]$Execute
)

if ($env:NODE_ENV -eq "production" -or $env:LEGALFLOW_ENV -eq "production") {
    Write-Host "[ERROR] Safety Guard: Cannot run this script in production environment!" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Starting PostgreSQL Backup Drill Script..."

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

$PgUser = $envVars["POSTGRES_USER"]
$PgDb = $envVars["POSTGRES_DB"]
$HasPassword = [bool]$envVars["POSTGRES_PASSWORD"]

if ([string]::IsNullOrEmpty($PgUser) -or [string]::IsNullOrEmpty($PgDb)) {
    Write-Host "[ERROR] POSTGRES_USER or POSTGRES_DB not found in $EnvFile" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Env keys present - User: True, DB: True, Password: $HasPassword"

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = Join-Path $BackupRoot "postgres"
$BackupFile = Join-Path $BackupDir "legalflow_postgres_$Timestamp.dump"
$ChecksumFile = "$BackupFile.sha256.txt"

$DockerCmd = "docker compose -f docker-compose.full.yml --env-file `"$EnvFile`" exec -T $PostgresService pg_dump -U $PgUser -d $PgDb -F c"

if (-not $Execute) {
    Write-Host "[DRY-RUN] Would create directory: $BackupDir"
    Write-Host "[DRY-RUN] Would run: docker compose ... exec -T $PostgresService pg_dump -U <user> -d <db> -F c > $BackupFile"
    Write-Host "[DRY-RUN] Would generate SHA256 checksum for backup file."
    Write-Host "[DRY-RUN] No changes were made. Use -Execute to run the backup." -ForegroundColor Yellow
    exit 0
}

Write-Host "[INFO] Creating backup directory if not exists: $BackupDir"
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

Write-Host "[INFO] Executing database dump to $BackupFile..."
$FullCmd = "$DockerCmd > `"$BackupFile`""
cmd.exe /c $FullCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Backup completed." -ForegroundColor Green
    $Hash = (Get-FileHash -Path $BackupFile -Algorithm SHA256).Hash
    Set-Content -Path $ChecksumFile -Value $Hash
    Write-Host "[SUCCESS] Checksum generated: $ChecksumFile" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backup failed. Exit code: $LASTEXITCODE" -ForegroundColor Red
    if (Test-Path $BackupFile) {
        Remove-Item $BackupFile -Force
        Write-Host "[INFO] Cleaned up failed backup file."
    }
    exit 1
}
