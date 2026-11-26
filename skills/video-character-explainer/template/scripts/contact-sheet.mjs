// Vòng tự soát: trích khung hình tại các mốc thời gian và ghép thành ảnh tổng hợp (6 khung / ảnh) để xem nhanh.
// Usage: node scripts/contact-sheet.mjs <video.mp4> <t1,t2,...giây> [tiền tố] [ffmpeg]
// Kết quả: out/<tiền tố>_0.png, out/<tiền tố>_1.png, ...
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const [, , video, times, prefix = "sheet", ffmpeg = "ffmpeg"] = process.argv;
if (!video || !times) {
  console.error("Usage: node scripts/contact-sheet.mjs <video.mp4> <t1,t2,...> [prefix] [ffmpeg]");
  process.exit(1);
}
const ts = times.split(",").map((x) => x.trim()).filter(Boolean);
fs.mkdirSync("out/chk", { recursive: true });
const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

ts.forEach((t, i) => run(["-ss", t, "-i", video, "-frames:v", "1", `out/chk/${String(i).padStart(2, "0")}.png`]));
for (let s = 0; s * 6 < ts.length; s++) {
  const idx = ts.map((_, i) => i).slice(s * 6, s * 6 + 6);
  const inputs = idx.flatMap((i) => ["-i", `out/chk/${String(i).padStart(2, "0")}.png`]);
  const layout = idx.map((_, k) => (k === 0 ? "0_0" : Array.from({ length: k }, (_, j) => `w${j}`).join("+") + "_0")).join("|");
  const filter = idx.length === 1 ? "null" : `xstack=inputs=${idx.length}:layout=${layout}`;
  run([...inputs, "-filter_complex", filter, `out/${prefix}_${s}.png`]);
  console.log(`out/${prefix}_${s}.png`);
}
