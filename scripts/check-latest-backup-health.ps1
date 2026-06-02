param(
    [string]$BackupRoot = "C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups",
    [switch]$UseDummyFixture,
    [datetime]$NowOverride,
    [int]$WeekdayWarningHours = 36,
    [int]$MondayGraceHour = 10,
    [string]$Scenario = "FreshWeekday",
    [switch]$VerboseReport
)

$ScriptVersion = "1.0.0"

# 1. Dummy Fixture Setup
$FixtureRoot = $null
if ($UseDummyFixture) {
    $TempTimestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
    $FixtureRoot = Join-Path $env:TEMP "LegalFlow_HealthFixture_${TempTimestamp}"
    $BackupRoot = Join-Path $FixtureRoot "local"
    
    New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null
    
    # Configure mock datetime based on Scenario
    switch ($Scenario) {
        "FreshWeekday" {
            # Tuesday June 2, 2026 09:30
            $NowOverride = [datetime]"2026-06-02T09:30:00"
            $SuccessFolder = "20260602_070000" # 2.5 hours old success
            
            $SuccessPath = Join-Path $BackupRoot $SuccessFolder
            New-Item -ItemType Directory -Path $SuccessPath -Force | Out-Null
            Set-Content -Path (Join-Path $SuccessPath "status.success") -Value "status=success"
            
            $DumpDir = Join-Path $SuccessPath "postgres"
            New-Item -ItemType Directory -Path $DumpDir -Force | Out-Null
            $DumpFile = Join-Path $DumpDir "legalflow.dump"
            Set-Content -Path $DumpFile -Value "fake postgres data"
            
            $Hash = (Get-FileHash -Path $DumpFile -Algorithm SHA256).Hash
            Set-Content -Path (Join-Path $SuccessPath "manifest.sha256") -Value "$Hash  *postgres/legalflow.dump"
        }
        "StaleWeekday" {
            # Wednesday June 3, 2026 09:30
            $NowOverride = [datetime]"2026-06-03T09:30:00"
            $SuccessFolder = "20260601_090000" # 48.5 hours old success (> 36 hours warning)
            
            $SuccessPath = Join-Path $BackupRoot $SuccessFolder
            New-Item -ItemType Directory -Path $SuccessPath -Force | Out-Null
            Set-Content -Path (Join-Path $SuccessPath "status.success") -Value "status=success"
            
            $DumpDir = Join-Path $SuccessPath "postgres"
            New-Item -ItemType Directory -Path $DumpDir -Force | Out-Null
            $DumpFile = Join-Path $DumpDir "legalflow.dump"
            Set-Content -Path $DumpFile -Value "fake postgres data"
            
            $Hash = (Get-FileHash -Path $DumpFile -Algorithm SHA256).Hash
            Set-Content -Path (Join-Path $SuccessPath "manifest.sha256") -Value "$Hash  *postgres/legalflow.dump"
        }
        "MondayBeforeGrace" {
            # Monday June 1, 2026 08:30 AM
            $NowOverride = [datetime]"2026-06-01T08:30:00"
            $SuccessFolder = "20260529_090000" # Friday May 29, 2026 09:00 AM (71.5 hours old <= 73.5 hours grace)
            
            $SuccessPath = Join-Path $BackupRoot $SuccessFolder
            New-Item -ItemType Directory -Path $SuccessPath -Force | Out-Null
            Set-Content -Path (Join-Path $SuccessPath "status.success") -Value "status=success"
            
            $DumpDir = Join-Path $SuccessPath "postgres"
            New-Item -ItemType Directory -Path $DumpDir -Force | Out-Null
            $DumpFile = Join-Path $DumpDir "legalflow.dump"
            Set-Content -Path $DumpFile -Value "fake postgres data"
            
            $Hash = (Get-FileHash -Path $DumpFile -Algorithm SHA256).Hash
            Set-Content -Path (Join-Path $SuccessPath "manifest.sha256") -Value "$Hash  *postgres/legalflow.dump"
        }
        "MondayAfterGrace" {
            # Monday June 1, 2026 11:30 AM (no Monday success yet, latest is Friday)
            $NowOverride = [datetime]"2026-06-01T11:30:00"
            $SuccessFolder = "20260529_090000" # Friday May 29, 2026 09:00 AM (74.5 hours old)
            
            $SuccessPath = Join-Path $BackupRoot $SuccessFolder
            New-Item -ItemType Directory -Path $SuccessPath -Force | Out-Null
            Set-Content -Path (Join-Path $SuccessPath "status.success") -Value "status=success"
            
            $DumpDir = Join-Path $SuccessPath "postgres"
            New-Item -ItemType Directory -Path $DumpDir -Force | Out-Null
            $DumpFile = Join-Path $DumpDir "legalflow.dump"
            Set-Content -Path $DumpFile -Value "fake postgres data"
            
            $Hash = (Get-FileHash -Path $DumpFile -Algorithm SHA256).Hash
            Set-Content -Path (Join-Path $SuccessPath "manifest.sha256") -Value "$Hash  *postgres/legalflow.dump"
        }
        "FailedNewer" {
            # Tuesday June 2, 2026 09:30
            $NowOverride = [datetime]"2026-06-02T09:30:00"
            $SuccessFolder = "20260602_050000" # Success at 05:00
            $FailedFolder = "20260602_070000"  # Failed at 07:00 (newer)
            
            $SuccessPath = Join-Path $BackupRoot $SuccessFolder
            New-Item -ItemType Directory -Path $SuccessPath -Force | Out-Null
            Set-Content -Path (Join-Path $SuccessPath "status.success") -Value "status=success"
            
            $DumpDir = Join-Path $SuccessPath "postgres"
            New-Item -ItemType Directory -Path $DumpDir -Force | Out-Null
            $DumpFile = Join-Path $DumpDir "legalflow.dump"
            Set-Content -Path $DumpFile -Value "fake postgres data"
            
            $Hash = (Get-FileHash -Path $DumpFile -Algorithm SHA256).Hash
            Set-Content -Path (Join-Path $SuccessPath "manifest.sha256") -Value "$Hash  *postgres/legalflow.dump"
            
            $FailedPath = Join-Path $BackupRoot $FailedFolder
            New-Item -ItemType Directory -Path $FailedPath -Force | Out-Null
            Set-Content -Path (Join-Path $FailedPath "status.failed") -Value "status=failed"
        }
        "ManifestMismatch" {
            # Tuesday June 2, 2026 09:30
            $NowOverride = [datetime]"2026-06-02T09:30:00"
            $SuccessFolder = "20260602_050000"
            
            $SuccessPath = Join-Path $BackupRoot $SuccessFolder
            New-Item -ItemType Directory -Path $SuccessPath -Force | Out-Null
            Set-Content -Path (Join-Path $SuccessPath "status.success") -Value "status=success"
            
            $DumpDir = Join-Path $SuccessPath "postgres"
            New-Item -ItemType Directory -Path $DumpDir -Force | Out-Null
            $DumpFile = Join-Path $DumpDir "legalflow.dump"
            Set-Content -Path $DumpFile -Value "fake postgres data"
            
            # Write a wrong hash
            Set-Content -Path (Join-Path $SuccessPath "manifest.sha256") -Value "wronghash1234567890abcdefabcdefab  *postgres/legalflow.dump"
        }
        default {
            Write-Host "Status: FAIL" -ForegroundColor Red
            Write-Host "[ERROR] Unknown Scenario: $Scenario"
            if ($FixtureRoot) { Remove-Item -LiteralPath $FixtureRoot -Recurse -Force -ErrorAction SilentlyContinue }
            exit 1
        }
    }
    
    if ($VerboseReport) {
        Write-Host "[INFO] Dummy fixture generated for scenario: $Scenario at $FixtureRoot" -ForegroundColor Cyan
    }
}

# 2. Main Validation Logic
$Now = if ($NowOverride) { $NowOverride } else { Get-Date }

# Cleanup Helper Block
Function Cleanup-Fixture {
    if ($UseDummyFixture -and $FixtureRoot -and (Test-Path -LiteralPath $FixtureRoot)) {
        Remove-Item -LiteralPath $FixtureRoot -Recurse -Force -ErrorAction SilentlyContinue
        if ($VerboseReport) { Write-Host "[INFO] Cleaned up dummy fixture." -ForegroundColor Gray }
    }
}

# Check 1: Backup root verification
if (-not $UseDummyFixture) {
    if ($BackupRoot -notmatch "LegalFlow_ARTIFACTS") {
        Write-Host "Status: FAIL" -ForegroundColor Red
        Write-Host "[ERROR] BackupRoot must contain LegalFlow_ARTIFACTS (path: $BackupRoot)"
        Cleanup-Fixture
        exit 1
    }
}

if (-not (Test-Path -LiteralPath $BackupRoot)) {
    Write-Host "Status: FAIL" -ForegroundColor Red
    Write-Host "[ERROR] BackupRoot directory does not exist: $BackupRoot"
    Cleanup-Fixture
    exit 1
}

# Get folders matching timestamp format yyyyMMdd_HHmmss
$Folders = Get-ChildItem -LiteralPath $BackupRoot -Directory | Where-Object { $_.Name -match "^\d{8}_\d{6}$" } | Sort-Object Name -Descending

# Check 2: At least one backup folder must exist
if ($Folders.Count -eq 0) {
    Write-Host "Status: FAIL" -ForegroundColor Red
    Write-Host "[ERROR] No valid backup folders found in $BackupRoot."
    Cleanup-Fixture
    exit 1
}

# Identify latest success and latest failed
$LatestSuccess = $null
$LatestFailed = $null

foreach ($f in $Folders) {
    if (Test-Path -LiteralPath (Join-Path $f.FullName "status.success")) {
        if (-not $LatestSuccess) { $LatestSuccess = $f }
    }
    if (Test-Path -LiteralPath (Join-Path $f.FullName "status.failed")) {
        if (-not $LatestFailed) { $LatestFailed = $f }
    }
}

# Check 3: At least one successful backup folder must exist
if (-not $LatestSuccess) {
    Write-Host "Status: FAIL" -ForegroundColor Red
    Write-Host "[ERROR] No successful backups found in $BackupRoot."
    Cleanup-Fixture
    exit 1
}

# Check 4: No failed backup newer than the latest success
if ($LatestFailed -and $LatestSuccess) {
    if ($LatestFailed.Name -gt $LatestSuccess.Name) {
        Write-Host "Status: FAIL" -ForegroundColor Red
        Write-Host "[ERROR] A failed backup ($($LatestFailed.Name)) is newer than the latest successful backup ($($LatestSuccess.Name))."
        Cleanup-Fixture
        exit 1
    }
}

# Check 5: Checksum Manifest Verification
$ManifestPath = Join-Path $LatestSuccess.FullName "manifest.sha256"
if (-not (Test-Path -LiteralPath $ManifestPath)) {
    Write-Host "Status: FAIL" -ForegroundColor Red
    Write-Host "[ERROR] Checksum file missing (manifest.sha256) in $($LatestSuccess.Name)."
    Cleanup-Fixture
    exit 1
}

$ChecksumLines = Get-Content $ManifestPath
$ChecksumMatch = $true
foreach ($line in $ChecksumLines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    
    # Parse format: hash  *relative_path (using 2 spaces or tabs)
    if ($line -match '^([a-fA-F0-9]{64})\s+\*(.+)$') {
        $ExpectedHash = $Matches[1].Trim()
        $RelPath = $Matches[2].Trim()
        
        # Verify relative path constraints
        if ($RelPath -match '^[a-zA-Z]:' -or $RelPath -match '^\\\\' -or $RelPath -contains '..') {
            Write-Host "Status: FAIL" -ForegroundColor Red
            Write-Host "[ERROR] Manifest contains absolute or unsafe path: $RelPath"
            $ChecksumMatch = $false
            break
        }
        
        $FilePath = Join-Path $LatestSuccess.FullName $RelPath
        if (Test-Path -LiteralPath $FilePath) {
            $ActualHash = (Get-FileHash $FilePath -Algorithm SHA256).Hash
            if ($ActualHash -ne $ExpectedHash) {
                Write-Host "[ERROR] Checksum mismatch for $RelPath. Expected: $ExpectedHash, Got: $ActualHash" -ForegroundColor Red
                $ChecksumMatch = $false
            }
        } else {
            Write-Host "[ERROR] File listed in manifest not found on disk: $RelPath" -ForegroundColor Red
            $ChecksumMatch = $false
        }
    } else {
        Write-Host "Status: FAIL" -ForegroundColor Red
        Write-Host "[ERROR] Invalid manifest line format: $line"
        $ChecksumMatch = $false
        break
    }
}

if (-not $ChecksumMatch) {
    Write-Host "Status: FAIL" -ForegroundColor Red
    Write-Host "[ERROR] Checksum validation failed for manifest.sha256 in $($LatestSuccess.Name)."
    Cleanup-Fixture
    exit 1
}

# Check 6: Backup Age Validation (Weekday-aware)
if ($LatestSuccess.Name -match "^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})$") {
    $SuccessTime = [datetime]::new($Matches[1], $Matches[2], $Matches[3], $Matches[4], $Matches[5], $Matches[6])
} else {
    Write-Host "Status: FAIL" -ForegroundColor Red
    Write-Host "[ERROR] Invalid backup folder name format: $($LatestSuccess.Name)"
    Cleanup-Fixture
    exit 1
}

$Diff = $Now - $SuccessTime
$AgeHours = $Diff.TotalHours
$DayOfWeek = $Now.DayOfWeek
$Hour = $Now.Hour

$Status = "PASS"
$StatusMessage = "Latest successful backup: $($LatestSuccess.Name) ($($AgeHours.ToString('F1')) hours old)."

if ($DayOfWeek -eq [System.DayOfWeek]::Saturday -or $DayOfWeek -eq [System.DayOfWeek]::Sunday) {
    Write-Host "[INFO] Weekend policy: no scheduled backup expected."
}
elseif ($DayOfWeek -eq [System.DayOfWeek]::Monday) {
    if ($Hour -lt $MondayGraceHour) {
        # Before Monday 10:00, Friday backup is allowed (age <= 73.5h)
        if ($AgeHours -gt 73.5) {
            $Status = "WARNING"
            $StatusMessage = "[WARNING] Monday before grace: Latest successful backup ($($LatestSuccess.Name)) is $($AgeHours.ToString('F1')) hours old (exceeds Friday backup grace of 73 hours)."
        }
    } else {
        # After Monday 10:00, we expect a backup from Monday (same calendar day)
        $IsSuccessFromToday = ($SuccessTime.Year -eq $Now.Year -and $SuccessTime.Month -eq $Now.Month -and $SuccessTime.Day -eq $Now.Day)
        if (-not $IsSuccessFromToday) {
            $Status = "WARNING"
            $StatusMessage = "[WARNING] Monday after grace: No successful backup found for Monday (latest is $($LatestSuccess.Name), $($AgeHours.ToString('F1')) hours old)."
        }
    }
}
else {
    # Tuesday - Friday
    if ($AgeHours -gt $WeekdayWarningHours) {
        $Status = "WARNING"
        $StatusMessage = "[WARNING] Latest backup ($($LatestSuccess.Name)) is $($AgeHours.ToString('F1')) hours old (exceeds limit of $WeekdayWarningHours hours)."
    }
}

# 3. Print Final Output
if ($Status -eq "PASS") {
    Write-Host "Status: PASS" -ForegroundColor Green
    Write-Host "[INFO] $StatusMessage"
    Cleanup-Fixture
    exit 0
}
elseif ($Status -eq "WARNING") {
    Write-Host "Status: WARNING" -ForegroundColor Yellow
    Write-Host "$StatusMessage"
    Cleanup-Fixture
    exit 2
}
else {
    Write-Host "Status: FAIL" -ForegroundColor Red
    Write-Host "[ERROR] $StatusMessage"
    Cleanup-Fixture
    exit 1
}
