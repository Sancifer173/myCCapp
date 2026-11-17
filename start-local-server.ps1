param(
  [int]$Port = 8080
)

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Prefix = "http://localhost:$Port/"

$MimeTypes = @{
  ".html"        = "text/html; charset=utf-8"
  ".css"         = "text/css; charset=utf-8"
  ".js"          = "application/javascript; charset=utf-8"
  ".json"        = "application/json; charset=utf-8"
  ".webmanifest" = "application/manifest+json; charset=utf-8"
  ".svg"         = "image/svg+xml"
  ".png"         = "image/png"
  ".jpg"         = "image/jpeg"
  ".jpeg"        = "image/jpeg"
  ".webp"        = "image/webp"
  ".gif"         = "image/gif"
  ".ico"         = "image/x-icon"
}

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add($Prefix)
$Listener.Start()

Write-Host "CCNA 200-301 Study Hub running at $Prefix" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray

try {
  while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $ReqPath = $Context.Request.Url.AbsolutePath
    if ($ReqPath -eq "/") { $ReqPath = "/index.html" }

    $RelPath = $ReqPath.TrimStart("/") -replace "/", "\"
    $FullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $RelPath))

    if (-not $FullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $FullPath -PathType Leaf)) {
      $Context.Response.StatusCode = 404
      $Bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $Context.Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
      $Context.Response.Close()
      continue
    }

    $Ext = [System.IO.Path]::GetExtension($FullPath).ToLowerInvariant()
    $Context.Response.ContentType = if ($MimeTypes.ContainsKey($Ext)) { $MimeTypes[$Ext] } else { "application/octet-stream" }
    if ($Ext -in @(".html", ".js", ".css", ".webmanifest")) {
      $Context.Response.Headers["Cache-Control"] = "no-cache"
    }
    $Bytes = [System.IO.File]::ReadAllBytes($FullPath)
    $Context.Response.ContentLength64 = $Bytes.Length
    $Context.Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
    $Context.Response.Close()
  }
} finally {
  $Listener.Stop()
}
