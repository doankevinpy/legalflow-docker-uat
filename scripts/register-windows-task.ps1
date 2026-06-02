param(
    [string]$TaskName = "LegalFlow_AutomatedBackup",
    [string]$ScriptPath = "$((Split-Path -Parent $MyInvocation.MyCommand.Path))\scheduled-backup.ps1",
    [string]$Time = "09:00",
    [string]$Frequency = "Weekdays",
    [int]$RetryCount = 3,
    [int]$RetryIntervalMinutes = 30,
    [int]$ExecutionTimeLimitHours = 2,
    [switch]$Execute,
    [switch]$TaskExecuteMode,
    [switch]$Force,
    [switch]$Unregister
)

if (-not $Execute) {
    Write-Host "[DRY-RUN] Starting task registration script." -ForegroundColor Cyan
}

Function Test-IsLegalFlowTask {
    param ([string]$Name)
    $task = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
    if (-not $task) { return $false }

    $actionPath = ""
    if ($task.Actions) {
        $actionPath = $task.Actions.Arguments + " " + $task.Actions.Execute
    }
    
    if ($Name -match "LegalFlow" -or $actionPath -match "scheduled-backup.ps1") {
        return $true
    }
    return $false
}

# Unregister Mode
if ($Unregister) {
    $exists = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($exists) {
        if (-not (Test-IsLegalFlowTask -Name $TaskName)) {
            Write-Host "[ERROR] Task '$TaskName' does not appear to be a LegalFlow task. Aborting safety guard." -ForegroundColor Red
            exit 1
        }
        
        if ($Execute) {
            Write-Host "[INFO] Unregistering existing task '$TaskName'."
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
            Write-Host "[INFO] Task unregistered." -ForegroundColor Green
        } else {
            Write-Host "[DRY-RUN] Would unregister existing LegalFlow task '$TaskName'."
        }
    } else {
        Write-Host "[INFO] Task '$TaskName' not found."
    }
    
    if (-not $Execute) { Write-Host "[DRY-RUN] No Windows Task Scheduler changes were made." -ForegroundColor Cyan }
    exit 0
}

# Register Mode

# 1. Existing Task Guard
$exists = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($exists) {
    if (-not $Force) {
        Write-Host "[ERROR] Task '$TaskName' already exists. Use -Force to overwrite." -ForegroundColor Red
        exit 1
    }
    
    if (-not (Test-IsLegalFlowTask -Name $TaskName)) {
        Write-Host "[ERROR] Task '$TaskName' does not appear to be a LegalFlow task. Cannot force overwrite. Aborting." -ForegroundColor Red
        exit 1
    }
    
    if ($Execute) {
        Write-Host "[INFO] Overwriting existing task '$TaskName'."
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    } else {
        Write-Host "[DRY-RUN] Would unregister existing LegalFlow task '$TaskName' before recreating."
    }
}

# 2. Setup Action
if (-not (Test-Path -LiteralPath $ScriptPath)) {
    Write-Host "[WARNING] ScriptPath does not exist on disk: $ScriptPath. Proceeding with registration anyway." -ForegroundColor Yellow
}

$Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""
if ($TaskExecuteMode) {
    $Arguments += " -Execute"
    Write-Host "[INFO] Task is configured to execute physical backups (-TaskExecuteMode is ON)." -ForegroundColor Yellow
} else {
    Write-Host "[INFO] Task is configured for Dry-run backups only (no physical changes)." -ForegroundColor Green
}

# 3. Apply Schedule
if ($Execute) {
    Write-Host "[INFO] Registering task '$TaskName'..."
    $Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $Arguments
    
    if ($Frequency -eq "Weekdays") {
        $Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At $Time
    } else {
        $Trigger = New-ScheduledTaskTrigger -Daily -At $Time
    }
    
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable `
        -MultipleInstances IgnoreNew `
        -ExecutionTimeLimit (New-TimeSpan -Hours $ExecutionTimeLimitHours) `
        -RestartCount $RetryCount `
        -RestartInterval (New-TimeSpan -Minutes $RetryIntervalMinutes)
    
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -User $env:USERNAME | Out-Null
    
    Write-Host "[INFO] Task '$TaskName' registered successfully." -ForegroundColor Green
} else {
    Write-Host "--- Task Configuration Preview ---"
    Write-Host "Task Name : $TaskName"
    if ($Frequency -eq "Weekdays") {
        Write-Host "Trigger   : $Frequency at $Time"
        Write-Host "Days      : Monday-Friday"
    } else {
        Write-Host "Trigger   : $Frequency at $Time"
    }
    Write-Host "Retry     : $RetryCount times every $RetryIntervalMinutes minutes on failure"
    Write-Host "Timeout   : $ExecutionTimeLimitHours hours limit"
    Write-Host "MultipleInstances : IgnoreNew"
    Write-Host "Action    : powershell.exe $Arguments"
    Write-Host "User      : $env:USERNAME (Interactive, No secret stored)"
    Write-Host "----------------------------------"
    Write-Host "[DRY-RUN] No Windows Task Scheduler changes were made." -ForegroundColor Cyan
}
