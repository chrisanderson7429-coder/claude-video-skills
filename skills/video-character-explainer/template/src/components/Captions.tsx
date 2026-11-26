import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { C, SANS, SERIF } from "../theme";
import { WORDS, Word, msToF, between } from "../lib";

type Chunk = { words: Word[]; from: number; to: number };

/** Gom từ thành cụm ngắn (ngắt ở dấu câu hoặc tối đa 7 từ), giống nhịp phụ đề video gốc. */
export const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => { if (cur.length) chunks.push({ words: cur, from: msToF(cur[0].s), to: 0 }); cur = []; };
  WORDS.forEach((w, k) => {
    const next = WORDS[k + 1];
    if (cur.length && cur[0].p !== w.p) flush();
    cur.push(w);
    const punct = /[,.;:?!]$/.test(w.t);
    const gap = next ? next.s - w.e : 9999;
    if (punct || cur.length >= 7 || gap > 450) flush();
  });
  flush();
  chunks.forEach((c, k) => {
    const n = chunks[k + 1];
    const lastEnd = msToF(c.words[c.words.length - 1].e);
    c.to = n && n.from - lastEnd < 36 ? n.from : lastEnd + 18;
  });
  return chunks;
};

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const chunks = useMemo(buildChunks, [WORDS]);
  const c = chunks.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const outO = between(f, c.to - 4, c.to, 1, 0.0);
  return (
    <div
      style={{
        position: "absolute", left: 84, top: 250, width: 900, fontFamily: SANS, fontWeight: 600, fontSize: 70,
        lineHeight: 1.14, color: C.ink, letterSpacing: -0.5, opacity: outO,
      }}
    >
      {c.words.map((w, k) => {
        const st = msToF(w.s);
        const o = between(f, st - 1, st + 3, 0, 1);
        const y = between(f, st - 1, st + 5, 14, 0);
        const fading = k === c.words.length - 1 && f < st + 4 ? 0.45 : 1;
        return (
          <span
            key={w.i}
            style={{
              display: "inline-block", marginRight: 18, opacity: o * fading, translate: `0px ${y}px`,
              fontFamily: w.em ? SERIF : SANS, fontStyle: w.em ? "italic" : "normal", fontWeight: w.em ? 500 : 600,
              fontSize: w.em ? 78 : 70, color: w.em ? C.accent : C.ink,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
