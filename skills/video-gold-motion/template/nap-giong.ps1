# Nạp file giọng đọc cho một video: nhận dạng giọng (Whisper), căn chữ theo kịch bản,
# đo độ lớn giọng, rồi bật âm thanh trong video.
# Ví dụ:
#   .\nap-giong.ps1 -Video example -Giong "C:\voice\giong.mp3"
#   .\nap-giong.ps1 -Video example -Giong "C:\voice\giong.mp3" -TocDo 0.9     (đọc chậm lại 0.9x)
param(
  [string]$Video = "example",
  [Parameter(Mandatory = $true)][string]$Giong,
  [double]$TocDo = 1.0,
  [string]$Ffmpeg = "ffmpeg"
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
# whisper.cpp không chạy được trong đường dẫn có dấu tiếng Việt → luôn dùng thư mục không dấu này
$whisper = "$env:LOCALAPPDATA\remotion-whisper"
$vdir = "src\videos\$Video"
if (-not (Test-Path "$vdir\script.ts")) { throw "Không thấy $vdir\script.ts" }
if (-not (Test-Path -LiteralPath $Giong)) { throw "Không thấy file giọng: $Giong" }
$ErrorActionPreference = "Continue"
function Test-Step($name) { if ($LASTEXITCODE -ne 0) { Write-Host "Lỗi ở bước: $name"; exit 1 } }

New-Item -ItemType Directory -Force "public\$Video", $whisper | Out-Null
$filter = if ($TocDo -ne 1.0) { @("-filter:a", "atempo=$TocDo") } else { @() }
Write-Host "1/4 Chép giọng vào public\$Video\voice.mp3 (tốc độ $TocDo)"
& $Ffmpeg -hide_banner -loglevel error -y -i $Giong @filter -codec:a libmp3lame -b:a 192k "public\$Video\voice.mp3"
Test-Step "chép giọng (cần ffmpeg trong PATH hoặc truyền -Ffmpeg)"

Write-Host "2/4 Nhận dạng giọng (lần đầu tải model, mất vài phút)"
& $Ffmpeg -hide_banner -loglevel error -y -i "public\$Video\voice.mp3" -ac 1 -ar 16000 "$whisper\voice16k.wav"
$proj = $PSScriptRoot
Push-Location $whisper
node "$proj\scripts\transcribe.mjs" $whisper "$whisper\voice16k.wav" "$whisper\whisper-raw.json" 2>&1 | Select-String -Pattern "segments:"
Test-Step "nhận dạng giọng"
Pop-Location

Write-Host "3/4 Căn chữ theo kịch bản + đo độ lớn giọng"
node scripts/align.mjs "$whisper\whisper-raw.json" "$vdir\script.ts" "$vdir\words.json"
Test-Step "căn chữ"
node scripts/loudness.mjs $Ffmpeg "public\$Video\voice.mp3" "$vdir\loudness.json"
Test-Step "đo độ lớn giọng"

Write-Host "4/4 Bật âm thanh"
$vt = Get-Content "$vdir\Video.tsx" -Raw -Encoding UTF8
$vt = $vt -replace 'export const HAS_VOICE = false;', 'export const HAS_VOICE = true;'
[System.IO.File]::WriteAllText((Resolve-Path "$vdir\Video.tsx"), $vt, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Xong. Xem trước: npm run dev    Xuất: .\xuat-video.ps1 -Composition <Id>"
