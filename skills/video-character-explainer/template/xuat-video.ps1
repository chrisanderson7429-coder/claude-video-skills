# Xuáº¥t má»™t composition ra out\<Id>.mp4
# VÃ­ dá»¥:  .\xuat-video.ps1 -Composition CharacterExample
param(
  [string]$Composition = "CharacterExample",
  [int]$Crf = 18
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force out | Out-Null
$outFile = "out\$Composition.mp4"
if (Test-Path "scripts\scan-poses.mjs") { node scripts/scan-poses.mjs }
npx remotion render $Composition $outFile --concurrency=6 --crf=$Crf
Write-Host "ÄÃ£ xuáº¥t: $outFile"

