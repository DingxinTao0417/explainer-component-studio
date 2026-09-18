[CmdletBinding(SupportsShouldProcess = $true)]
param()

# -WhatIf validates identity and reports the exact process without stopping it.
$ErrorActionPreference = 'Stop'
$savedWhatIfPreference = $WhatIfPreference
try {
    $WhatIfPreference = $false
    Import-Module CimCmdlets -ErrorAction Stop
} finally { $WhatIfPreference = $savedWhatIfPreference }
$libraryRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\')
$serverScript = Join-Path $libraryRoot 'scripts\server.mjs'
$statePath = Join-Path $libraryRoot '.runtime\server.json'
$scriptPattern = '(?i)(?:^|\s)"?' + [regex]::Escape($serverScript) + '"?(?:\s|$)'
if (-not (Test-Path -LiteralPath $statePath -PathType Leaf)) {
    Write-Output 'No preview state exists; no process was changed.'
    return
}
$state = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
if ([IO.Path]::GetFullPath([string]$state.root).TrimEnd('\') -ne $libraryRoot -or [int]$state.port -ne 3031) {
    throw 'The preview state belongs to a different project or port; no process was changed.'
}
$recordPid = [int]$state.pid
if ($recordPid -le 0) { throw 'The preview state contains an invalid PID.' }
$candidate = Get-CimInstance Win32_Process -Filter "ProcessId = $recordPid" -ErrorAction SilentlyContinue
if ($null -eq $candidate) {
    Write-Output "Recorded PID $recordPid has exited; no process was changed."
    return
}
if ($candidate.Name -ne 'node.exe' -or [string]$candidate.CommandLine -notmatch $scriptPattern -or
    [string]$candidate.CommandLine -notmatch '(?:^|\s)--port\s+3031(?:\s|$)') {
    throw "PID $recordPid is not this library's preview server; refusing to stop it."
}
$dateProperty = $state.PSObject.Properties['processCreatedAt']
$dateText = if ($null -ne $dateProperty) {  $dateProperty.Value } else { $state.startedAt }
$recordedDate = $(if ($dateText -is [DateTimeOffset]) { $dateText.UtcDateTime } elseif ($dateText -is [DateTime]) { $dateText.ToUniversalTime() } else { [DateTimeOffset]::Parse([string]$dateText).UtcDateTime })
$tolerance = if ($null -ne $dateProperty) { 1 } else { 30 }
if ([Math]::Abs(($candidate.CreationDate.ToUniversalTime() - $recordedDate).TotalSeconds) -gt $tolerance) {
    throw 'The recorded PID has a different creation time; refusing to stop it.'
}
$verifiedProcess = Get-Process -Id $recordPid -ErrorAction Stop
if ([Math]::Abs(($verifiedProcess.StartTime.ToUniversalTime() - $candidate.CreationDate.ToUniversalTime()).TotalSeconds) -gt 1) {
    throw 'Process identity changed during verification; no process was stopped.'
}
Write-Output "Identity verified: PID $recordPid, $serverScript, 127.0.0.1:3031."
if ($PSCmdlet.ShouldProcess("PID $recordPid ($serverScript)", 'Stop component library preview')) {
    Stop-Process -InputObject $verifiedProcess -ErrorAction Stop
    Wait-Process -Id $recordPid -Timeout 5 -ErrorAction SilentlyContinue
    $state | Add-Member -NotePropertyName status -NotePropertyValue 'stopped' -Force
    $state | Add-Member -NotePropertyName stoppedAt -NotePropertyValue ([DateTime]::UtcNow.ToString('o')) -Force
    [IO.File]::WriteAllText($statePath, ($state | ConvertTo-Json -Depth 5), [Text.UTF8Encoding]::new($false))
    Write-Output 'Preview stopped. Project files and the last process record were retained.'
}
