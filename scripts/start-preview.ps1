[CmdletBinding(SupportsShouldProcess = $true)]
param()

# Start or reuse this library only. The server binds to 127.0.0.1, not the LAN.
$ErrorActionPreference = 'Stop'
# Load read-only management commands before the caller's WhatIf preference can
# produce noise for the module's temporary session aliases.
$savedWhatIfPreference = $WhatIfPreference
try {
    $WhatIfPreference = $false
    Import-Module CimCmdlets, NetTCPIP -ErrorAction Stop
} finally { $WhatIfPreference = $savedWhatIfPreference }
$libraryRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\')
$serverScript = Join-Path $libraryRoot 'scripts\server.mjs'
$runtimeDir = Join-Path $libraryRoot '.runtime'
$statePath = Join-Path $runtimeDir 'server.json'
$previewPort = 3031
$previewUrl = 'http://127.0.0.1:3031/catalog.html'
$scriptPattern = '(?i)(?:^|\s)"?' + [regex]::Escape($serverScript) + '"?(?:\s|$)'

function Get-LibraryProcess([int] $ProcessId) {
    $candidate = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
    if ($null -eq $candidate) { return $null }
    if ($candidate.Name -ne 'node.exe' -or [string]$candidate.CommandLine -notmatch $scriptPattern -or
        [string]$candidate.CommandLine -notmatch '(?:^|\s)--port\s+3031(?:\s|$)') {
        throw "PID $ProcessId is not this library's preview server; no process was changed."
    }
    return $candidate
}

function Confirm-StateProcess($State, $Process) {
    if ([IO.Path]::GetFullPath([string]$State.root).TrimEnd('\') -ne $libraryRoot -or [int]$State.port -ne $previewPort) {
        throw 'The preview state belongs to a different project or port; no process was changed.'
    }
    $dateProperty = $State.PSObject.Properties['processCreatedAt']
    $dateText = if ($null -ne $dateProperty) {  $dateProperty.Value } else { $State.startedAt }
    $recordedDate = $(if ($dateText -is [DateTimeOffset]) { $dateText.UtcDateTime } elseif ($dateText -is [DateTime]) { $dateText.ToUniversalTime() } else { [DateTimeOffset]::Parse([string]$dateText).UtcDateTime })
    $tolerance = if ($null -ne $dateProperty) { 1 } else { 30 }
    if ([Math]::Abs(($Process.CreationDate.ToUniversalTime() - $recordedDate).TotalSeconds) -gt $tolerance) {
        throw 'The recorded PID has a different creation time; refusing to reuse it.'
    }
}

if (-not (Test-Path -LiteralPath $serverScript -PathType Leaf)) { throw "Missing server: $serverScript" }
if (-not (Test-Path -LiteralPath (Join-Path $libraryRoot 'catalog.html') -PathType Leaf)) {
    throw 'The catalog has not been built. Run npm run build in the component-library directory first.'
}
$mutexHasher = [Security.Cryptography.SHA256]::Create()
try { $mutexBytes = $mutexHasher.ComputeHash([Text.Encoding]::UTF8.GetBytes($libraryRoot.ToLowerInvariant())) }
finally { $mutexHasher.Dispose() }
$mutexSuffix = ([BitConverter]::ToString($mutexBytes)).Replace('-', '').Substring(0, 20)
$previewMutex = [Threading.Mutex]::new($false, "Local\ComponentLibraryPreview_$mutexSuffix")
$mutexTaken = $false
try {
    try { $mutexTaken = $previewMutex.WaitOne(0) } catch [Threading.AbandonedMutexException] { $mutexTaken = $true }
    if (-not $mutexTaken) { throw 'Another preview start is in progress. Try again after it completes.' }
    if (Test-Path -LiteralPath $statePath -PathType Leaf) {
        $state = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ([IO.Path]::GetFullPath([string]$state.root).TrimEnd('\') -ne $libraryRoot -or [int]$state.port -ne $previewPort) {
            throw 'The preview state belongs to a different project or port; no process was changed.'
        }
        $existing = Get-LibraryProcess -ProcessId ([int]$state.pid)
        if ($null -ne $existing) {
            Confirm-StateProcess $state $existing
            $listener = @(Get-NetTCPConnection -State Listen -LocalPort $previewPort -ErrorAction SilentlyContinue |
                Where-Object { $_.OwningProcess -eq $existing.ProcessId -and $_.LocalAddress -eq '127.0.0.1' })
            if ($listener.Count -eq 0) { throw "The recorded server PID $($existing.ProcessId) exists but is not listening on 127.0.0.1:$previewPort. It was left untouched." }
            $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 3
            if ($response.StatusCode -ne 200) { throw "Preview returned HTTP $($response.StatusCode)." }
            [pscustomobject]@{ Status = 'AlreadyRunning'; PID = $existing.ProcessId; URL = $previewUrl; Root = $libraryRoot }
            return
        }
    }
    $occupied = @(Get-NetTCPConnection -State Listen -LocalPort $previewPort -ErrorAction SilentlyContinue)
    if ($occupied.Count -gt 0) { throw "Port $previewPort is occupied. No listener was stopped and no duplicate server was launched." }
    $nodeCommand = Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1
    if (-not $PSCmdlet.ShouldProcess($previewUrl, 'Start hidden local component preview')) { return }
    [IO.Directory]::CreateDirectory($runtimeDir) | Out-Null
    $launched = Start-Process -FilePath $nodeCommand.Source -ArgumentList @(('"' + $serverScript + '"'), '--port', '3031') `
        -WorkingDirectory $libraryRoot -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $runtimeDir 'server.stdout.log') `
        -RedirectStandardError (Join-Path $runtimeDir 'server.stderr.log')
    $ready = $false
    for ($attempt = 0; $attempt -lt 24; $attempt++) {
        Start-Sleep -Milliseconds 250
        $launched.Refresh()
        if ($launched.HasExited) { throw "Preview exited with code $($launched.ExitCode). See .runtime/server.stderr.log." }
        if (Test-Path -LiteralPath $statePath -PathType Leaf) {
            try {
                $fresh = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
                if ([int]$fresh.pid -eq $launched.Id) {
                    $ownedProcess = Get-LibraryProcess -ProcessId $launched.Id
                    Confirm-StateProcess $fresh $ownedProcess
                    $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 1
                    if ($response.StatusCode -eq 200) { $ready = $true; break }
                }
            } catch { if ($attempt -eq 23) { throw } }
        }
    }
    if (-not $ready) { throw "PID $($launched.Id) was launched but readiness could not be verified. The process was left running; inspect .runtime/server.stderr.log before retrying." }
    $fresh | Add-Member -NotePropertyName processCreatedAt -NotePropertyValue $ownedProcess.CreationDate.ToUniversalTime().ToString('o') -Force
    $fresh | Add-Member -NotePropertyName url -NotePropertyValue $previewUrl -Force
    $fresh | Add-Member -NotePropertyName status -NotePropertyValue 'running' -Force
    [IO.File]::WriteAllText($statePath, ($fresh | ConvertTo-Json -Depth 5), [Text.UTF8Encoding]::new($false))
    [pscustomobject]@{ Status = 'Started'; PID = $launched.Id; URL = $previewUrl; Root = $libraryRoot }
} finally {
    if ($mutexTaken) { $previewMutex.ReleaseMutex() }
    $previewMutex.Dispose()
}
