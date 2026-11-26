# Xuất một composition ra out\<Id>.mp4
# Ví dụ:  .\xuat-video.ps1 -Composition GoldExample
param(
  [string]$Composition = "GoldExample",
  [int]$Crf = 18
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force out | Out-Null
$outFile = "out\$Composition.mp4"
if (Test-Path "scripts\scan-poses.mjs") { node scripts/scan-poses.mjs }
npx remotion render $Composition $outFile --concurrency=6 --crf=$Crf
Write-Host "Đã xuất: $outFile"
