param(
    [string[]]$Containers = @("legalflow_backend", "legalflow_frontend"),
    [int]$Tail = 500,
    [string]$Since = "",
    [switch]$FailOnFinding,
    [switch]$Json
)

$Patterns = @{
    "BearerToken" = "Bearer\s+[A-Za-z0-9\-\._~\+\/]+={0,2}"
    "JWT" = "ey" + "J[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+"
    "DatabaseUrl" = "DATABASE_URL\s*="
    "MinioAccessKey" = "MINIO_ACCESS_KEY"
    "MinioSecretKey" = "MINIO_SECRET_KEY"
    "Password" = "(?i)password\s*(=|:)"
    "AmzCredential" = "X-Amz-Credential="
    "AmzSignature" = "X-Amz-Signature="
    "PresignedUrl" = "AWSAccessKeyId=|Signature="
    "MinioKey" = "minioKey"
}

$Findings = @()

foreach ($Container in $Containers) {
    # Check if container exists
    $Exists = docker ps -a --format "{{.Names}}" --filter "name=^${Container}$"
    if (-not $Exists) {
        Write-Warning "Container $Container does not exist. Skipping."
        continue
    }

    $DockerArgs = @("logs")
    if ($Tail -gt 0) {
        $DockerArgs += "--tail", "$Tail"
    }
    if ($Since) {
        $DockerArgs += "--since", "$Since"
    }
    $DockerArgs += $Container

    # Capture logs avoiding error stream breaks
    $Logs = & docker $DockerArgs 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to fetch logs for $Container. Continuing..."
        continue
    }

    foreach ($Name in $Patterns.Keys) {
        $Regex = $Patterns[$Name]
        $MatchCount = 0

        foreach ($Line in $Logs) {
            # Convert to string to safely match
            $LineStr = $Line -as [string]
            if ($LineStr -match $Regex) {
                $MatchCount++
            }
        }

        if ($MatchCount -gt 0) {
            $Findings += @{
                Container = $Container
                Pattern = $Name
                Count = $MatchCount
                Status = "FAIL"
            }
        }
    }
}

if ($Json) {
    $Findings | ConvertTo-Json -Depth 2
} else {
    if ($Findings.Count -eq 0) {
        Write-Output "Status: PASS. No secrets found in container logs."
    } else {
        Write-Output "Status: FAIL. Secrets detected!"
        foreach ($Finding in $Findings) {
            Write-Output "Container: $($Finding.Container) | Pattern: $($Finding.Pattern) | Count: $($Finding.Count)"
        }
    }
}

if ($Findings.Count -gt 0 -and $FailOnFinding) {
    exit 1
}

exit 0
