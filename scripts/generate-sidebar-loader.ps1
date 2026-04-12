param(
  [string]$RootPath = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$templatePath = Join-Path $RootPath "templates/sidebar-loader-template.html"
if (-not (Test-Path $templatePath)) {
  throw "Template not found: $templatePath"
}

$template = Get-Content -Path $templatePath -Raw
$files = Get-ChildItem -Path $RootPath -Recurse -Filter *.html | Where-Object {
  $_.FullName -notmatch "[\\/]\.git[\\/]" -and $_.Name -ne "sidebar-loader-template.html"
}

foreach ($file in $files) {
  $content = Get-Content -Path $file.FullName -Raw

  # Remove legacy inline loader script blocks.
  $content = [regex]::Replace(
    $content,
    "<script>\s*\(function\s*\(\)\s*\{[\s\S]*?document\.head\.appendChild\(script\);[\s\S]*?\}\)\(\);\s*</script>",
    "",
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )

  $relative = [System.IO.Path]::GetRelativePath($file.DirectoryName, $RootPath).Replace('\', '/')
  $rootRel = if ($relative -eq ".") { "" } else { "$relative/" }
  $snippet = $template.Replace("{{ROOT_REL}}", $rootRel)

  if ($content -match "<!-- SIDEBAR_LOADER_START -->[\s\S]*?<!-- SIDEBAR_LOADER_END -->") {
    $content = [regex]::Replace(
      $content,
      "<!-- SIDEBAR_LOADER_START -->[\s\S]*?<!-- SIDEBAR_LOADER_END -->",
      $snippet,
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
  } else {
    $content = $content -replace "</body>", "$snippet`r`n</body>"
  }

  Set-Content -Path $file.FullName -Value $content -Encoding utf8
}

Write-Output ("Sidebar loader generated for " + $files.Count + " HTML files.")
