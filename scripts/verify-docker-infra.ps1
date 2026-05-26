$ErrorActionPreference = "Continue"
$global:hasError = $false
$results = [ordered]@{
    "Docker version" = "PENDING"
    "Compose config" = "PENDING"
    "Up containers" = "PENDING"
    "Healthcheck" = "PENDING"
    "Caddy validate" = "PENDING"
    "Caddy HTTP" = "PENDING"
    "MinIO Console" = "PENDING"
    "Down without volume deletion" = "PENDING"
}

function Set-Result {
    param([string]$Step, [bool]$Pass)
    if ($Pass) {
        $results[$Step] = "PASS"
    } else {
        $results[$Step] = "FAIL"
        $global:hasError = $true
    }
}

Write-Host "--- PHASE 7.1.1: DOCKER INFRA VERIFICATION ---"

# 1. Docker version
try {
    Write-Host "`n1. Checking Docker versions..."
    docker --version
    if ($LASTEXITCODE -ne 0) { throw "docker failed" }
    docker compose version
    if ($LASTEXITCODE -ne 0) { throw "docker compose failed" }
    Set-Result "Docker version" $true
} catch {
    Set-Result "Docker version" $false
    Write-Error "Docker is not available or failed."
}

# 2. Validate Compose
try {
    Write-Host "`n2. Validating compose config..."
    docker compose -f docker-compose.infra.yml --env-file .env.docker.example config > $null
    if ($LASTEXITCODE -ne 0) { throw "config validate failed" }
    Set-Result "Compose config" $true
} catch {
    Set-Result "Compose config" $false
    Write-Error "Docker compose config validation failed."
}

# 3. Start infra
try {
    Write-Host "`n3. Starting infra..."
    docker compose -f docker-compose.infra.yml --env-file .env.docker.example up -d
    if ($LASTEXITCODE -ne 0) { throw "up failed" }
    Set-Result "Up containers" $true
} catch {
    Set-Result "Up containers" $false
    Write-Error "Docker compose up failed."
}

# 4. Wait for healthcheck
try {
    Write-Host "`n4. Waiting for healthchecks (up to 60s)..."
    $maxWait = 60
    $passed = $false
    for ($i = 0; $i -lt $maxWait; $i += 2) {
        $psOutput = docker compose -f docker-compose.infra.yml ps | Out-String
        if (($psOutput -match "postgres.*\(healthy\)") -and ($psOutput -match "minio.*\(healthy\)")) {
            $passed = $true
            break
        }
        Start-Sleep -Seconds 2
    }
    if ($passed) {
        Set-Result "Healthcheck" $true
        Write-Host "All healthchecks passed!"
    } else {
        Set-Result "Healthcheck" $false
        Write-Host "Healthcheck failed or timed out. Status:"
        docker compose -f docker-compose.infra.yml ps
    }
} catch {
    Set-Result "Healthcheck" $false
}

# 5. Caddy validate
try {
    Write-Host "`n5. Validating Caddy config..."
    docker compose -f docker-compose.infra.yml --env-file .env.docker.example exec caddy caddy validate --config /etc/caddy/Caddyfile
    if ($LASTEXITCODE -ne 0) { throw "caddy validate failed" }
    Set-Result "Caddy validate" $true
} catch {
    Set-Result "Caddy validate" $false
}

# 6. Test Caddy HTTP
try {
    Write-Host "`n6. Testing Caddy HTTP..."
    $caddyRes = Invoke-WebRequest -Uri "http://127.0.0.1:8080" -UseBasicParsing -ErrorAction Stop
    if ($caddyRes.Content -match "LegalFlow Caddy Proxy is running") {
        Set-Result "Caddy HTTP" $true
    } else {
        Set-Result "Caddy HTTP" $false
        Write-Host "Caddy response content did not match."
    }
} catch {
    Set-Result "Caddy HTTP" $false
    Write-Error $_
}

# 7. Test MinIO Console
try {
    Write-Host "`n7. Testing MinIO Console..."
    $minioRes = Invoke-WebRequest -Uri "http://127.0.0.1:9001" -UseBasicParsing -MaximumRedirection 10 -ErrorAction Stop
    if ($minioRes.StatusCode -eq 200) {
        Set-Result "MinIO Console" $true
    } else {
        Set-Result "MinIO Console" $false
    }
} catch {
    Set-Result "MinIO Console" $false
    Write-Error $_
}

# 8. Stop infra
try {
    Write-Host "`n8. Stopping infra..."
    docker compose -f docker-compose.infra.yml --env-file .env.docker.example down
    if ($LASTEXITCODE -ne 0) { throw "down failed" }
    Set-Result "Down without volume deletion" $true
} catch {
    Set-Result "Down without volume deletion" $false
    Write-Error "Failed to stop infra."
}

# 9. Results
Write-Host "`n=================================="
Write-Host "          TEST RESULTS            "
Write-Host "=================================="
$results.GetEnumerator() | ForEach-Object {
    $status = $_.Value
    if ($status -eq "PASS") {
        Write-Host "$($_.Name.PadRight(30)): [PASS]" -ForegroundColor Green
    } else {
        Write-Host "$($_.Name.PadRight(30)): [FAIL]" -ForegroundColor Red
    }
}
Write-Host "=================================="

# 10. Exit code
if ($global:hasError) {
    Write-Host "`nStatus: FAILED" -ForegroundColor Red
    exit 1
} else {
    Write-Host "`nStatus: PASSED" -ForegroundColor Green
    exit 0
}
