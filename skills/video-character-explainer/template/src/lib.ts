import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./theme";

export type Word = { i: number; t: string; p: number; s: number; e: number; em: boolean };
/** Mốc thời gian từng từ của video đang dựng (mỗi video gọi setTimeline trước khi vẽ). */
export let WORDS: Word[] = [];
export let LOUD: number[] = [];
export const setTimeline = (words: Word[], loud: number[]) => { WORDS = words; LOUD = loud; };
export const msToF = (ms: number) => Math.round((ms / 1000) * FPS);

const norm = (s: string) => s.normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

/** Start/end frame of paragraph p (absolute). */
export const paraStart = (p: number) => msToF(WORDS.find((w) => w.p === p)!.s);
export const paraEnd = (p: number) => {
  const ws = WORDS.filter((w) => w.p === p);
  return msToF(ws[ws.length - 1].e);
};

/** Absolute frame where `phrase` starts inside paragraph p (nth occurrence, 0-based). */
export const phraseFrame = (p: number, phrase: string, nth = 0) => {
  const ws = WORDS.filter((w) => w.p === p);
  const parts = phrase.split(/\s+/).map(norm);
  let seen = 0;
  for (let i = 0; i + parts.length <= ws.length; i++) {
    if (parts.every((x, k) => norm(ws[i + k].t) === x)) {
      if (seen === nth) return msToF(ws[i].s);
      seen++;
    }
  }
  throw new Error(`phrase not found in P${p + 1}: ${phrase}`);
};

/** Spring-based pop-in (0→1). */
export const popIn = (frame: number, at: number, damping = 12) =>
  spring({ frame: frame - at, fps: FPS, config: { damping, stiffness: 170, mass: 0.7 } });

export const fadeIn = (frame: number, at: number, dur = 8) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

export const between = (frame: number, a: number, b: number, from: number, to: number) =>
  interpolate(frame, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
