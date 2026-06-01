param(
  [string]$Root = ".",
  [int]$Port = 5173
)

$resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg" = "image/svg+xml"
  ".ico" = "image/x-icon"
}

function Send-Response {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [string]$ContentType,
    [byte[]]$Body
  )

  $headers = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  $Stream.Write($Body, 0, $Body.Length)
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  $stream = $client.GetStream()
  $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
  $requestLine = $reader.ReadLine()

  while ($reader.Peek() -gt -1) {
    $line = $reader.ReadLine()
    if ([string]::IsNullOrEmpty($line)) {
      break
    }
  }

  if (-not $requestLine) {
    $client.Close()
    continue
  }

  $parts = $requestLine.Split(" ")
  $requestPath = "/"

  if ($parts.Length -ge 2) {
    $requestPath = $parts[1].Split("?")[0]
  }

  $requestPath = [Uri]::UnescapeDataString($requestPath.TrimStart("/"))

  if ([string]::IsNullOrWhiteSpace($requestPath)) {
    $requestPath = "index.html"
  }

  $filePath = Join-Path -Path $resolvedRoot -ChildPath $requestPath
  $resolvedFile = $null

  if (Test-Path -LiteralPath $filePath -PathType Leaf) {
    $resolvedFile = (Resolve-Path -LiteralPath $filePath).Path
  }

  if ($resolvedFile -and $resolvedFile.StartsWith($resolvedRoot)) {
    $extension = [System.IO.Path]::GetExtension($resolvedFile).ToLowerInvariant()
    $contentType = $mimeTypes[$extension]

    if (-not $contentType) {
      $contentType = "application/octet-stream"
    }

    $body = [System.IO.File]::ReadAllBytes($resolvedFile)
    Send-Response -Stream $stream -StatusCode 200 -StatusText "OK" -ContentType $contentType -Body $body
  } else {
    $body = [System.Text.Encoding]::UTF8.GetBytes("Arquivo nao encontrado.")
    Send-Response -Stream $stream -StatusCode 404 -StatusText "Not Found" -ContentType "text/plain; charset=utf-8" -Body $body
  }

  $stream.Close()
  $client.Close()
}
