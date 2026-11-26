// Căn từng từ của kịch bản (src/data/script.ts) với mốc thời gian của Whisper → src/data/words.json
// Usage: node scripts/align.mjs <whisper-raw.json> [script.ts] [out-words.json]
import fs from "fs";

const raw = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const src = fs.readFileSync(process.argv[3] || "src/data/script.ts", "utf8");
const grab = name => new Function("return " + src.split(`export const ${name}: string[] =`)[1].split("];")[0] + "]")();
const PARAGRAPHS = grab("PARAGRAPHS"), EMPHASIS = grab("EMPHASIS");

const norm = s => s.normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

// whisper words (merge sub-word tokens; a token starting with a space starts a new word)
const ww = [];
for (const seg of raw.transcription) {
  for (const tok of seg.tokens) {
    if (tok.text.startsWith("[_") || tok.text.startsWith("[")) continue;
    const from = tok.offsets.from, to = tok.offsets.to;
    if (tok.text.startsWith(" ") || ww.length === 0) ww.push({ text: tok.text.trim(), from, to });
    else { const w = ww[ww.length - 1]; w.text += tok.text; w.to = to; }
  }
}
const W = ww.map(w => ({ ...w, n: norm(w.text) })).filter(w => w.n.length);

// script words
const S = [];
PARAGRAPHS.forEach((p, pi) => p.split(/\s+/).forEach(t => S.push({ t, p: pi, n: norm(t) })));

// emphasis marks
for (const ph of EMPHASIS) {
  const parts = ph.split(/\s+/);
  for (let i = 0; i + parts.length <= S.length; i++) {
    if (parts.every((x, k) => norm(S[i + k].t) === norm(x))) for (let k = 0; k < parts.length; k++) S[i + k].em = true;
  }
}

// similarity of two normalized words (0..1)
const sim = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const strip = s => s.normalize("NFD").replace(/\p{M}/gu, "");
  const A = strip(a), B = strip(b);
  if (A === B) return 0.85;
  if (A.includes(B) || B.includes(A)) return 0.6;
  return 0;
};

// DP alignment
const n = S.length, m = W.length, GAP = 0.45;
const dp = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
const bt = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1));
for (let i = 1; i <= n; i++) { dp[i][0] = dp[i - 1][0] - GAP; bt[i][0] = 1; }
for (let j = 1; j <= m; j++) { dp[0][j] = dp[0][j - 1] - GAP; bt[0][j] = 2; }
for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
  const s = sim(S[i - 1].n, W[j - 1].n);
  const diag = dp[i - 1][j - 1] + (s > 0 ? s : -0.6);
  const up = dp[i - 1][j] - GAP, left = dp[i][j - 1] - GAP;
  if (diag >= up && diag >= left) { dp[i][j] = diag; bt[i][j] = 0; }
  else if (up >= left) { dp[i][j] = up; bt[i][j] = 1; }
  else { dp[i][j] = left; bt[i][j] = 2; }
}
let i = n, j = m, matched = 0;
while (i > 0 || j > 0) {
  const b = bt[i][j];
  if (i > 0 && j > 0 && b === 0) {
    if (sim(S[i - 1].n, W[j - 1].n) > 0) { S[i - 1].s = W[j - 1].from; S[i - 1].e = W[j - 1].to; matched++; }
    else { S[i - 1].s = W[j - 1].from; S[i - 1].e = W[j - 1].to; S[i - 1].weak = true; }
    i--; j--;
  } else if (i > 0 && (j === 0 || b === 1)) i--;
  else j--;
}
// interpolate the words without a time
for (let k = 0; k < n; k++) {
  if (S[k].s !== undefined) continue;
  let a = k - 1; while (a >= 0 && S[a].s === undefined) a--;
  let b = k + 1; while (b < n && S[b].s === undefined) b++;
  const t0 = a >= 0 ? S[a].e : 0, t1 = b < n ? S[b].s : t0 + 400 * (b - a);
  const span = b - a, pos = k - a;
  S[k].s = Math.round(t0 + (t1 - t0) * (pos - 0.5) / span + 0);
  S[k].e = Math.round(t0 + (t1 - t0) * (pos + 0.5) / span);
}
// keep monotonic
for (let k = 1; k < n; k++) if (S[k].s < S[k - 1].s) S[k].s = S[k - 1].s + 20;

const out = S.map((w, k) => ({ i: k, t: w.t, p: w.p, s: w.s, e: Math.max(w.e, w.s + 60), em: !!w.em }));
fs.writeFileSync(process.argv[4] || "src/data/words.json", JSON.stringify(out));
console.log(`script words ${n}, whisper words ${m}, exact/approx matched ${matched}`);
PARAGRAPHS.forEach((_, pi) => {
  const ws = out.filter(w => w.p === pi);
  console.log(`P${pi + 1}: ${(ws[0].s / 1000).toFixed(2)}s → ${(ws[ws.length - 1].e / 1000).toFixed(2)}s  "${ws.slice(0, 4).map(w => w.t).join(" ")}…"`);
});
