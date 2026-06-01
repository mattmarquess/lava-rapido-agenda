param(
  [string]$Output = "lava-rapido-agenda-site.zip"
)

$root = (Resolve-Path -LiteralPath ".").Path
$packageDir = Join-Path $root ".publish"
$zipPath = Join-Path $root $Output

if (Test-Path -LiteralPath $packageDir) {
  Remove-Item -LiteralPath $packageDir -Recurse -Force
}

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Path $packageDir | Out-Null

$itemsToCopy = @(
  "index.html",
  "painel.html",
  "configuracoes.html",
  "README.md",
  ".nojekyll",
  ".gitignore",
  "css",
  "js",
  "docs"
)

foreach ($item in $itemsToCopy) {
  $source = Join-Path $root $item
  $destination = Join-Path $packageDir $item

  if (Test-Path -LiteralPath $source -PathType Container) {
    Copy-Item -LiteralPath $source -Destination $destination -Recurse
  } elseif (Test-Path -LiteralPath $source -PathType Leaf) {
    Copy-Item -LiteralPath $source -Destination $destination
  }
}

$packageContent = Join-Path $packageDir "*"
Compress-Archive -Path $packageContent -DestinationPath $zipPath -Force
Remove-Item -LiteralPath $packageDir -Recurse -Force

Write-Host "Pacote criado em: $zipPath"
