// Đo độ lớn giọng đọc (RMS dB) cho từng frame 30fps → src/data/loudness.json
// Usage: node scripts/loudness.mjs <ffmpeg.exe> <voice.mp3> [out.json]
import { spawnSync } from "child_process";
import fs from "fs";

const [, , ffmpeg, voice, outFile = "src/data/loudness.json"] = process.argv;
// 48000 Hz / 30 fps = 1600 mẫu mỗi frame; ametadata in kết quả ra stderr
const r = spawnSync(ffmpeg, [
  "-hide_banner", "-i", voice, "-ac", "1", "-ar", "48000",
  "-af", "aresample=48000,asetnsamples=n=1600:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level",
  "-f", "null", "-",
], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const txt = (r.stdout || "") + (r.stderr || "");
const vals = [...txt.matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map((m) => (m[1] === "-inf" ? -90 : Math.round(parseFloat(m[1]) * 10) / 10));
fs.writeFileSync(outFile, JSON.stringify(vals));
console.log("frames:", vals.length, "max:", Math.max(...vals), "median:", vals.slice().sort((a, b) => a - b)[Math.floor(vals.length / 2)]);
