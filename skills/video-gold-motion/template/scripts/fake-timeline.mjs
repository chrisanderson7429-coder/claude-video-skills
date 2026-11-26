// Tạo mốc thời gian ƯỚC LƯỢNG (khi chưa có file giọng) để dựng và xem trước cảnh.
// Khi có giọng thật: chạy transcribe → align → loudness để thay thế.
// Usage: node scripts/fake-timeline.mjs <script.ts> <out-words.json> <out-loudness.json>
import fs from "fs";

const [, , scriptPath, outWords, outLoud] = process.argv;
const src = fs.readFileSync(scriptPath, "utf8");
const grab = (name) => new Function("return " + src.split(`export const ${name}: string[] =`)[1].split("];")[0] + "]")();
const PARAGRAPHS = grab("PARAGRAPHS"), EMPHASIS = grab("EMPHASIS");
const norm = (s) => s.normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

const S = [];
PARAGRAPHS.forEach((p, pi) => p.split(/\s+/).forEach((t) => S.push({ t, p: pi })));
for (const ph of EMPHASIS) {
  const parts = ph.split(/\s+/);
  for (let i = 0; i + parts.length <= S.length; i++)
    if (parts.every((x, k) => norm(S[i + k].t) === norm(x))) for (let k = 0; k < parts.length; k++) S[i + k].em = true;
}

let t = 400;
const out = S.map((w, i) => {
  if (i > 0 && S[i - 1].p !== w.p) t += 450;
  const dur = 230 + 18 * Math.max(0, norm(w.t).length - 3);
  const s = t, e = t + dur;
  t = e + 40 + (/[.?!]$/.test(w.t) ? 320 : /[,;:]$/.test(w.t) ? 180 : 0);
  return { i, t: w.t, p: w.p, s, e, em: !!w.em };
});
fs.writeFileSync(outWords, JSON.stringify(out));

const frames = Math.ceil((t / 1000) * 30) + 10;
const loud = Array.from({ length: frames }, (_, f) => {
  const ms = (f / 30) * 1000;
  const w = out.find((x) => ms >= x.s && ms <= x.e);
  return w ? Math.round((-24 + 8 * Math.abs(Math.sin(f / 2.3))) * 10) / 10 : -70;
});
fs.writeFileSync(outLoud, JSON.stringify(loud));
console.log(`words ${out.length}, ~${(t / 1000).toFixed(1)}s (ước lượng)`);
