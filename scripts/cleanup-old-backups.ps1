param(
    [string]$LocalBackupRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups",
    [string]$RemoteMockRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_REMOTE_BACKUPS",
    [int]$LocalRetentionDays = 7,
    [int]$RemoteRetentionDays = 30,
    [switch]$Execute,
    [switch]$UseDummyFixture
)

# 1. Real execute guard for Phase 9.3C
if ($Execute -and -not $UseDummyFixture) {
    Write-Host "[ERROR] Real cleanup execution is reserved for a future phase." -ForegroundColor Red
    exit 1
}

# 2. Dummy fixture setup
if ($UseDummyFixture) {
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $FixtureRoot = Join-Path $env:TEMP "LegalFlow_CleanupFixture_$Timestamp"
    $LocalBackupRoot = Join-Path $FixtureRoot "local"
    $RemoteMockRoot = Join-Path $FixtureRoot "remote"

    New-Item -ItemType Directory -Path $LocalBackupRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $RemoteMockRoot -Force | Out-Null

    # Create dummy folders
    $Now = Get-Date
    
    # Generate folders for local (7 days retention)
    $LocalOld = $Now.AddDays(-10).ToString("yyyyMMdd_HHmmss")
    $LocalRecent = $Now.AddDays(-2).ToString("yyyyMMdd_HHmmss")
    $LocalLatest = $Now.AddMinutes(-5).ToString("yyyyMMdd_HHmmss")
    
    $dir1 = New-Item -ItemType Directory -Path (Join-Path $LocalBackupRoot $LocalOld) -Force
    $dir1.CreationTime = $Now.AddDays(-10)
    $dir2 = New-Item -ItemType Directory -Path (Join-Path $LocalBackupRoot $LocalRecent) -Force
    $dir2.CreationTime = $Now.AddDays(-2)
    $latestLocalDir = New-Item -ItemType Directory -Path (Join-Path $LocalBackupRoot $LocalLatest) -Force
    $latestLocalDir.CreationTime = $Now.AddMinutes(-5)
    New-Item -ItemType File -Path (Join-Path $latestLocalDir.FullName "status.success") -Force | Out-Null
    
    # Generate folders for remote (30 days retention)
    $RemoteOld = $Now.AddDays(-40).ToString("yyyyMMdd_HHmmss")
    $RemoteRecent = $Now.AddDays(-15).ToString("yyyyMMdd_HHmmss")
    $RemoteLatest = $Now.AddMinutes(-5).ToString("yyyyMMdd_HHmmss")
    
    $dir3 = New-Item -ItemType Directory -Path (Join-Path $RemoteMockRoot $RemoteOld) -Force
    $dir3.CreationTime = $Now.AddDays(-40)
    $dir4 = New-Item -ItemType Directory -Path (Join-Path $RemoteMockRoot $RemoteRecent) -Force
    $dir4.CreationTime = $Now.AddDays(-15)
    $latestRemoteDir = New-Item -ItemType Directory -Path (Join-Path $RemoteMockRoot $RemoteLatest) -Force
    $latestRemoteDir.CreationTime = $Now.AddMinutes(-5)
    New-Item -ItemType File -Path (Join-Path $latestRemoteDir.FullName "status.success") -Force | Out-Null

    Write-Host "[INFO] Dummy fixture created at $FixtureRoot" -ForegroundColor Cyan
}

if (-not $Execute) {
    Write-Host "[DRY-RUN] Starting cleanup plan." -ForegroundColor Cyan
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

Function Invoke-Cleanup {
    param (
        [string]$Path,
        [int]$RetentionDays,
        [string]$Type
    )
    
    if (-not (Test-Path -LiteralPath $Path)) {
        Write-Host "[WARNING] Path does not exist: $Path"
        return
    }

    $Folders = Get-ChildItem -LiteralPath $Path -Directory | Where-Object { $_.Name -match "^\d{8}_\d{6}$" } | Sort-Object Name -Descending
    
    if ($Folders.Count -eq 0) {
        Write-Host "[INFO] No valid backup folders found in $Path."
        return
    }
    
    $Latest = $Folders[0]
    Write-Host "[INFO] Latest backup in ${Type}: $($Latest.Name)"
    
    $StatusSuccessPath = Join-Path $Latest.FullName "status.success"
    $StatusFailedPath = Join-Path $Latest.FullName "status.failed"
    
    if (Test-Path -LiteralPath $StatusFailedPath) {
        Write-Host "[WARNING] Latest backup failed. Aborting cleanup to protect history." -ForegroundColor Yellow
        return
    }
    
    if (-not (Test-Path -LiteralPath $StatusSuccessPath)) {
        Write-Host "[WARNING] No status.success in latest backup. Aborting cleanup." -ForegroundColor Yellow
        return
    }
    
    $Now = Get-Date
    foreach ($f in $Folders) {
        # Never delete the newest
        if ($f.FullName -eq $Latest.FullName) {
            continue
        }
        
        $diff = $Now - $f.CreationTime
        if ($diff.TotalDays -gt $RetentionDays) {
            if ($Execute) {
                Write-Host "[INFO] Deleting $Type backup: $($f.Name) (older than $RetentionDays days)"
                Remove-Item -LiteralPath $f.FullName -Recurse -Force
            } else {
                Write-Host "[DRY-RUN] Would delete $Type backup: $($f.Name) (older than $RetentionDays days)"
            }
        }
    }
}

Write-Host "--- Local Cleanup ($LocalRetentionDays days) ---"
Invoke-Cleanup -Path $LocalBackupRoot -RetentionDays $LocalRetentionDays -Type "Local"

Write-Host "--- Remote Mock Cleanup ($RemoteRetentionDays days) ---"
Invoke-Cleanup -Path $RemoteMockRoot -RetentionDays $RemoteRetentionDays -Type "Remote"

# 4. Clean up fixture if execute
if ($UseDummyFixture -and $Execute) {
    Write-Host "[INFO] Cleaning up dummy fixture..."
    Remove-Item -LiteralPath $FixtureRoot -Recurse -Force
}

if (-not $Execute) {
    Write-Host "[DRY-RUN] No filesystem changes were made." -ForegroundColor Cyan
} else {
    Write-Host "[INFO] Cleanup script completed successfully." -ForegroundColor Green
}
