#Requires -Version 7.0
<#
Pexels client for local video production. Credentials never enter output/metadata.
Configure reads the key from stdin (or a secure interactive prompt), not an argument.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][ValidateSet('configure','status','search','download')][string]$Action,
    [ValidateSet('photo','video')][string]$Kind = 'photo',
    [string]$Query,
    [ValidateSet('landscape','portrait','square')][string]$Orientation = 'landscape',
    [ValidateRange(1,80)][int]$PerPage = 6,
    [ValidateRange(1,10000)][int]$Page = 1,
    [string]$Out,
    [string]$Candidates,
    [long]$AssetId,
    [string]$Variant,
    [switch]$ReadKeyFromStdin
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$credentialDir = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'ScienceVideoDirector/credentials'
$credentialFile = Join-Path $credentialDir 'pexels.dpapi'

function Emit($Value) { $Value | ConvertTo-Json -Depth 20 }
function Load-Key {
    if ($env:PEXELS_API_KEY) { return $env:PEXELS_API_KEY.Trim() }
    if (!(Test-Path -LiteralPath $credentialFile -PathType Leaf)) { throw 'credential_missing' }
    $secure = ConvertTo-SecureString ([IO.File]::ReadAllText($credentialFile))
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer); $secure.Dispose() }
}
function Write-NewJson([string]$Path, $Value) {
    $absolute = [IO.Path]::GetFullPath($Path)
    [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($absolute)) | Out-Null
    $bytes = [Text.Encoding]::UTF8.GetBytes(($Value | ConvertTo-Json -Depth 30))
    $stream = [IO.File]::Open($absolute, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write)
    try { $stream.Write($bytes, 0, $bytes.Length) } finally { $stream.Dispose() }
}
function Header-Value($Response, [string]$Name) {
    if ($Response.Headers.Contains($Name)) { return $Response.Headers.GetValues($Name) -join ',' }
    return $null
}

try {
    switch ($Action) {
        configure {
            if (!$IsWindows) { throw 'windows_required_for_dpapi' }
            if ($ReadKeyFromStdin) {
                $plain = [Console]::In.ReadLine()
                if ([string]::IsNullOrWhiteSpace($plain)) { throw 'empty_credential' }
                $secure = ConvertTo-SecureString $plain.Trim() -AsPlainText -Force
                $plain = $null
            } else { $secure = Read-Host 'Pexels API key' -AsSecureString }
            if ($secure.Length -eq 0) { $secure.Dispose(); throw 'empty_credential' }
            try { $ciphertext = ConvertFrom-SecureString $secure } finally { $secure.Dispose() }
            [IO.Directory]::CreateDirectory($credentialDir) | Out-Null
            $sid = [Security.Principal.WindowsIdentity]::GetCurrent().User
            $acl = [Security.AccessControl.DirectorySecurity]::new()
            $acl.SetOwner($sid)
            $acl.SetAccessRuleProtection($true, $false)
            $acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new(
                $sid, 'FullControl', 'ContainerInherit,ObjectInherit', 'None', 'Allow'))
            Set-Acl -LiteralPath $credentialDir -AclObject $acl
            $temp = Join-Path $credentialDir ([guid]::NewGuid().ToString() + '.tmp')
            try {
                [IO.File]::WriteAllText($temp, $ciphertext, [Text.UTF8Encoding]::new($false))
                [IO.File]::Move($temp, $credentialFile, $true)
            } finally { if ([IO.File]::Exists($temp)) { [IO.File]::Delete($temp) } }
            Emit @{ ok = $true; storage = 'Windows DPAPI / current user'; credential_file = $credentialFile }
        }
        status {
            $key = Load-Key
            $available = ![string]::IsNullOrWhiteSpace($key)
            $key = $null
            Emit @{ configured = $available; source = $(if ($env:PEXELS_API_KEY) {'environment'} else {'Windows DPAPI'}) }
        }
        search {
            if ([string]::IsNullOrWhiteSpace($Query)) { throw 'query_required' }
            if ($Out -and (Test-Path -LiteralPath $Out)) { throw 'output_exists' }
            $endpoint = if ($Kind -eq 'video') {'v1/videos/search'} else {'v1/search'}
            $uri = 'https://api.pexels.com/' + $endpoint + '?query=' + [uri]::EscapeDataString($Query) +
                '&orientation=' + $Orientation + '&per_page=' + $PerPage + '&page=' + $Page
            $handler = [Net.Http.HttpClientHandler]::new()
            $handler.AllowAutoRedirect = $false # Never forward Authorization to a different host.
            $client = [Net.Http.HttpClient]::new($handler)
            $client.Timeout = [TimeSpan]::FromSeconds(45)
            $request = [Net.Http.HttpRequestMessage]::new([Net.Http.HttpMethod]::Get, $uri)
            $key = Load-Key
            $null = $request.Headers.TryAddWithoutValidation('Authorization', $key)
            $key = $null
            $response = $null
            try {
                $response = $client.SendAsync($request).GetAwaiter().GetResult()
                $statusCode = [int]$response.StatusCode
                if (!$response.IsSuccessStatusCode) { throw "pexels_http_$statusCode" }
                $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult() | ConvertFrom-Json -AsHashtable
                $items = @(if ($Kind -eq 'video') { $body.videos } else { $body.photos })
                $result = [ordered]@{
                    provider = 'pexels'; provider_url = 'https://www.pexels.com/'
                    license_url = 'https://www.pexels.com/license/'
                    kind = $Kind; query = $Query; orientation = $Orientation
                    fetched_at = [DateTime]::UtcNow.ToString('o'); http_status = $statusCode
                    page = $Page; total_results = $body.total_results; count = $items.Count
                    rate_limit = @{
                        limit = Header-Value $response 'X-Ratelimit-Limit'
                        remaining = Header-Value $response 'X-Ratelimit-Remaining'
                        reset = Header-Value $response 'X-Ratelimit-Reset'
                    }
                    # Official response preserves creator, source page and selectable variants.
                    items = $items
                }
                if ($Out) {
                    Write-NewJson $Out $result
                    Emit @{ ok = $true; http_status = $statusCode; kind = $Kind; count = $items.Count; out = [IO.Path]::GetFullPath($Out); provider_url = $result.provider_url; rate_limit = $result.rate_limit }
                } else { Emit $result }
            } finally {
                if ($response) { $response.Dispose() }
                $request.Dispose(); $client.Dispose()
            }
        }
        download {
            if (!$Candidates -or !$AssetId -or !$Variant -or !$Out) { throw 'candidates_asset_id_variant_out_required' }
            $absolute = [IO.Path]::GetFullPath($Out)
            $metadataPath = $absolute + '.source.json'
            if ((Test-Path -LiteralPath $absolute) -or (Test-Path -LiteralPath $metadataPath)) { throw 'output_exists' }
            $catalog = Get-Content -LiteralPath $Candidates -Raw | ConvertFrom-Json -AsHashtable
            if ($catalog.provider -ne 'pexels') { throw 'not_pexels_candidates' }
            $matches = @($catalog.items | Where-Object { $_.id -eq $AssetId })
            if ($matches.Count -ne 1) { throw 'asset_not_found_or_ambiguous' }
            $item = $matches[0]
            if ($catalog.kind -eq 'video') {
                $files = @($item.video_files | Where-Object { [string]$_.id -eq $Variant })
                if ($files.Count -ne 1) { throw 'video_variant_not_found' }
                $selected = $files[0]; $url = $selected.link; $author = $item.user
            } elseif ($catalog.kind -eq 'photo') {
                if (!$item.src.ContainsKey($Variant)) { throw 'photo_variant_not_found' }
                $url = $item.src[$Variant]; $selected = @{ name = $Variant }
                $author = @{ name = $item.photographer; url = $item.photographer_url }
            } else { throw 'unsupported_media_kind' }
            $mediaUri = [uri]$url
            if ($mediaUri.Scheme -ne 'https' -or $mediaUri.DnsSafeHost -notin @('images.pexels.com','videos.pexels.com')) { throw 'unexpected_media_host' }
            [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($absolute)) | Out-Null
            $temp = $absolute + '.' + [guid]::NewGuid().ToString() + '.part'
            # Separate client with no auth header; only the selected CDN file is downloaded.
            $client = [Net.Http.HttpClient]::new()
            $client.Timeout = [TimeSpan]::FromMinutes(3)
            $response = $null
            try {
                $response = $client.GetAsync($mediaUri, [Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult()
                if (!$response.IsSuccessStatusCode) { throw ('media_http_' + [int]$response.StatusCode) }
                $contentType = [string]$response.Content.Headers.ContentType.MediaType
                if ($contentType -notmatch '^(image|video)/') { throw 'unexpected_media_content_type' }
                $stream = [IO.File]::Open($temp, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write)
                try { [void]$response.Content.CopyToAsync($stream).GetAwaiter().GetResult() } finally { $stream.Dispose() }
                $size = (Get-Item -LiteralPath $temp).Length
                if ($size -eq 0) { throw 'empty_media' }
                $hash = (Get-FileHash -LiteralPath $temp -Algorithm SHA256).Hash.ToLowerInvariant()
                [IO.File]::Move($temp, $absolute) # Never overwrite an existing asset.
                $metadata = [ordered]@{
                    provider = 'pexels'; provider_url = 'https://www.pexels.com/'
                    provider_asset_id = $item.id; source_url = $item.url; author = $author
                    license_url = 'https://www.pexels.com/license/'; origin = 'external'
                    kind = $catalog.kind; variant = $selected; download_url = $url
                    downloaded_at = [DateTime]::UtcNow.ToString('o'); content_type = $contentType
                    file = [IO.Path]::GetFileName($absolute); bytes = $size; sha256 = $hash
                    status = 'downloaded_unverified'; inspection = 'pending media probe and visual review'
                }
                Write-NewJson $metadataPath $metadata
                Emit @{ ok = $true; file = $absolute; source = $metadataPath; bytes = $size; status = 'downloaded_unverified' }
            } finally {
                if ($response) { $response.Dispose() }; $client.Dispose()
                if ([IO.File]::Exists($temp)) { [IO.File]::Delete($temp) }
            }
        }
    }
} catch {
    # Do not dump exception objects/requests: they may include credential-bearing state.
    $code = [string]$_.Exception.Message
    if ($code -notmatch '^[a-z][a-z0-9_]{2,80}$') { $code = 'operation_failed' }
    Emit @{ ok = $false; error = $code }
    exit 1
}
