param(
    [string]$LocalBackupRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups",
    [string]$RemoteMockRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_REMOTE_BACKUPS",
    [switch]$UseDummyFixture,
    [switch]$Execute,
    [switch]$Force
)

# 1. Real execute guard for Phase 9.3E
if ($Execute -and -not $UseDummyFixture) {
    Write-Host "[ERROR] Real remote sync execution is reserved for a future phase." -ForegroundColor Red
    exit 1
}

# 2. Dummy fixture setup
if ($UseDummyFixture) {
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $FixtureRoot = Join-Path $env:TEMP "LegalFlow_VerifyFixture_$Timestamp"
    $LocalBackupRoot = Join-Path $FixtureRoot "local"
    $RemoteMockRoot = Join-Path $FixtureRoot "remote"

    New-Item -ItemType Directory -Path $LocalBackupRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $RemoteMockRoot -Force | Out-Null

    # Create dummy latest folder
    $BackupName = $Timestamp
    $LatestDir = New-Item -ItemType Directory -Path (Join-Path $LocalBackupRoot $BackupName) -Force
    
    # Create fake files
    $DumpFile = Join-Path $LatestDir.FullName "postgres.dump"
    "fake data" | Out-File -FilePath $DumpFile -Encoding ASCII
    
    $MinioDir = New-Item -ItemType Directory -Path (Join-Path $LatestDir.FullName "minio") -Force
    "minio data" | Out-File -FilePath (Join-Path $MinioDir.FullName "minio_object.txt") -Encoding ASCII

    # Create status.success
    New-Item -ItemType File -Path (Join-Path $LatestDir.FullName "status.success") -Force | Out-Null
    
    # Create valid checksum
    $Hash = (Get-FileHash $DumpFile -Algorithm SHA256).Hash
    "$Hash *postgres.dump" | Out-File -FilePath (Join-Path $LatestDir.FullName "manifest.sha256") -Encoding ASCII

    Write-Host "[INFO] Dummy fixture created at $FixtureRoot" -ForegroundColor Cyan
}

if (-not $Execute) {
    Write-Host "[DRY-RUN] Starting verification and sync plan." -ForegroundColor Cyan
}

# 3. Path Guard
if (-not $UseDummyFixture) {
    if ($LocalBackupRoot -notmatch "LegalFlow_ARTIFACTS") {
        Write-Host "[ERROR] Safety Guard: LocalBackupRoot must be inside LegalFlow_ARTIFACTS." -ForegroundColor Red
        exit 1
    }
    if ($RemoteMockRoot -notmatch "LegalFlow_REMOTE_BACKUPS") {
        Write-Host "[ERROR] Safety Guard: RemoteMockRoot must be inside LegalFlow_REMOTE_BACKUPS." -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path -LiteralPath $LocalBackupRoot)) {
    Write-Host "[INFO] Local backup root does not exist. Nothing to verify."
    if (-not $Execute) { Write-Host "[DRY-RUN] No filesystem changes were made." -ForegroundColor Cyan }
    exit 0
}

$Folders = Get-ChildItem -LiteralPath $LocalBackupRoot -Directory | Where-Object { $_.Name -match "^\d{8}_\d{6}$" } | Sort-Object Name -Descending

if ($Folders.Count -eq 0) {
    Write-Host "[INFO] No backup folders found in $LocalBackupRoot."
    if (-not $Execute) { Write-Host "[DRY-RUN] No filesystem changes were made." -ForegroundColor Cyan }
    exit 0
}

$Latest = $Folders[0]
Write-Host "[INFO] Validating latest backup: $($Latest.Name)"

$StatusSuccessPath = Join-Path $Latest.FullName "status.success"
$StatusFailedPath = Join-Path $Latest.FullName "status.failed"

if (Test-Path -LiteralPath $StatusFailedPath) {
    Write-Host "[ERROR] Latest backup contains status.failed. Sync aborted." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path -LiteralPath $StatusSuccessPath)) {
    Write-Host "[ERROR] Latest backup missing status.success. Sync aborted." -ForegroundColor Red
    exit 1
}

$ChecksumPath = Join-Path $Latest.FullName "manifest.sha256"
if (-not (Test-Path -LiteralPath $ChecksumPath)) {
    Write-Host "[ERROR] Checksum file missing (manifest.sha256). Sync aborted." -ForegroundColor Red
    exit 1
}

# Simple checksum verification (only if execute for real checks, or just mock it)
# In Phase 9.3E, we actually verify the checksum file.
$ChecksumLines = Get-Content $ChecksumPath
$ChecksumMatch = $true
foreach ($line in $ChecksumLines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $parts = $line -split '\s+\*', 2
    if ($parts.Length -eq 2) {
        $ExpectedHash = $parts[0].Trim()
        $FileName = $parts[1].Trim()
        $FilePath = Join-Path $Latest.FullName $FileName
        if (Test-Path -LiteralPath $FilePath) {
            $ActualHash = (Get-FileHash $FilePath -Algorithm SHA256).Hash
            if ($ActualHash -ne $ExpectedHash) {
                Write-Host "[ERROR] Checksum mismatch for $FileName. Expected: $ExpectedHash, Got: $ActualHash" -ForegroundColor Red
                $ChecksumMatch = $false
            }
        } else {
            Write-Host "[ERROR] File listed in checksum not found: $FileName" -ForegroundColor Red
            $ChecksumMatch = $false
        }
    }
}

if (-not $ChecksumMatch) {
    Write-Host "[ERROR] Checksum verification failed. Sync aborted." -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Checksum verified successfully." -ForegroundColor Green

# 4. Remote Sync
$RemoteDest = Join-Path $RemoteMockRoot $Latest.Name

if (Test-Path -LiteralPath $RemoteDest) {
    if (-not $Force) {
        Write-Host "[ERROR] Remote destination already exists: $RemoteDest. Use -Force to overwrite." -ForegroundColor Red
        exit 1
    }
    if ($Execute) {
        Write-Host "[WARNING] -Force specified. Removing existing remote destination: $RemoteDest" -ForegroundColor Yellow
        Remove-Item -LiteralPath $RemoteDest -Recurse -Force
    }
}

if ($Execute) {
    Write-Host "[INFO] Copying local backup to remote mock: $RemoteDest"
    Copy-Item -LiteralPath $Latest.FullName -Destination $RemoteDest -Recurse
    
    # 5. File count verification
    $SourceFiles = Get-ChildItem -LiteralPath $Latest.FullName -Recurse -File
    $DestFiles = Get-ChildItem -LiteralPath $RemoteDest -Recurse -File
    
    if ($SourceFiles.Count -ne $DestFiles.Count) {
        Write-Host "[ERROR] Post-sync file count mismatch! Source: $($SourceFiles.Count), Dest: $($DestFiles.Count)" -ForegroundColor Red
        exit 1
    }
    Write-Host "[INFO] Sync completed and verified. Copied $($SourceFiles.Count) files." -ForegroundColor Green
    
    if ($UseDummyFixture) {
        Write-Host "[INFO] Cleaning up dummy fixture..."
        Remove-Item -LiteralPath $FixtureRoot -Recurse -Force
    }
} else {
    Write-Host "[DRY-RUN] Would verify steps and copy local backup set $($Latest.Name) to remote mock $RemoteDest"
    Write-Host "[DRY-RUN] No filesystem changes were made." -ForegroundColor Cyan
}
