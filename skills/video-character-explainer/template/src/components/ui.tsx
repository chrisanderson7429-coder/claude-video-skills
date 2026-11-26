import React from "react";
import { useCurrentFrame } from "remotion";
import { C, MONO, SANS, SERIF } from "../theme";
import { between, popIn } from "../lib";

/** Trắng, viền đen, bóng đổ cứng – kiểu thẻ của video gốc. */
export const Card: React.FC<{
  at: number; x: number; y: number; w: number; h?: number; rot?: number; children?: React.ReactNode;
  bg?: string; pad?: number; dark?: boolean; out?: number;
}> = ({ at, x, y, w, h, rot = 0, children, bg, pad = 28, dark, out }) => {
  const f = useCurrentFrame();
  const p = popIn(f, at);
  const o = out !== undefined ? between(f, out, out + 8, 1, 0) : 1;
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", padding: pad,
        background: bg ?? (dark ? C.dark : C.card), color: dark ? "#F4F1EA" : C.ink,
        border: `4px solid ${C.ink}`, borderRadius: 22, boxShadow: `10px 10px 0 ${C.shadow}`,
        fontFamily: SANS, opacity: Math.min(1, p * 1.4) * o,
        scale: String(0.6 + 0.4 * p), rotate: `${rot}deg`, translate: `0px ${(1 - p) * 40}px`,
      }}
    >
      {children}
    </div>
  );
};

/** Nhãn nhỏ dạng pill. */
export const Tag: React.FC<{ at: number; x: number; y: number; children: React.ReactNode; tone?: "accent" | "ink" | "light"; size?: number; rot?: number; mono?: boolean }> = ({
  at, x, y, children, tone = "accent", size = 34, rot = 0, mono,
}) => {
  const f = useCurrentFrame();
  const p = popIn(f, at, 10);
  if (f < at) return null;
  const bg = tone === "accent" ? C.accent : tone === "ink" ? C.ink : C.card;
  const fg = tone === "light" ? C.ink : "#fff";
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, padding: "12px 24px", borderRadius: 999, background: bg, color: fg,
        border: `3px solid ${C.ink}`, boxShadow: `6px 6px 0 ${C.shadow}`, fontFamily: mono ? MONO : SANS, fontWeight: 700,
        fontSize: size, whiteSpace: "nowrap", scale: String(p), rotate: `${rot}deg`, opacity: Math.min(1, p * 1.5),
      }}
    >
      {children}
    </div>
  );
};

/** Dấu X đỏ vẽ dần. */
export const Cross: React.FC<{ at: number; x: number; y: number; size: number; until?: number }> = ({ at, x, y, size, until }) => {
  const f = useCurrentFrame();
  const a = between(f, at, at + 6, 0, 1);
  const b = between(f, at + 4, at + 10, 0, 1);
  if (f < at || (until !== undefined && f >= until)) return null;
  const L = size * 1.42;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", left: x, top: y }} aria-hidden="true">
      <line x1={8} y1={8} x2={size - 8} y2={size - 8} stroke={C.accent} strokeWidth={16} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - a)} />
      <line x1={size - 8} y1={8} x2={8} y2={size - 8} stroke={C.accent} strokeWidth={16} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - b)} />
    </svg>
  );
};

/** Gạch ngang chữ (strike) vẽ dần. */
export const Strike: React.FC<{ at: number; x: number; y: number; w: number }> = ({ at, x, y, w }) => {
  const f = useCurrentFrame();
  const a = between(f, at, at + 8, 0, 1);
  if (f < at) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w * a, height: 10, background: C.accent, borderRadius: 6, rotate: "-3deg" }} />;
};

/** Dấu tick tròn. */
export const Check: React.FC<{ at: number; x: number; y: number; size?: number }> = ({ at, x, y, size = 56 }) => {
  const f = useCurrentFrame();
  const p = popIn(f, at, 9);
  if (f < at) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" style={{ position: "absolute", left: x, top: y, scale: String(p) }} aria-hidden="true">
      <circle cx="28" cy="28" r="25" fill={C.accent} stroke={C.ink} strokeWidth="3" />
      <path d="M16 29 L25 38 L41 19" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Mũi tên đứt nét vẽ dần (đường cong bậc hai). */
export const Arrow: React.FC<{ at: number; from: [number, number]; to: [number, number]; bend?: number; dur?: number }> = ({ at, from, to, bend = 0, dur = 12 }) => {
  const f = useCurrentFrame();
  const a = between(f, at, at + dur, 0, 1);
  if (f < at) return null;
  const mx = (from[0] + to[0]) / 2 - (to[1] - from[1]) * bend, my = (from[1] + to[1]) / 2 + (to[0] - from[0]) * bend;
  const d = `M${from[0]},${from[1]} Q${mx},${my} ${to[0]},${to[1]}`;
  const ang = Math.atan2(to[1] - my, to[0] - mx);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }} aria-hidden="true">
      <defs>
        <mask id={`m${at}${from[0]}`}>
          <path d={d} fill="none" stroke="#fff" strokeWidth={14} strokeDasharray={2000} strokeDashoffset={2000 * (1 - a)} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray="18 14" strokeLinecap="round" mask={`url(#m${at}${from[0]})`} />
      {a > 0.95 && (
        <path d={`M${to[0]},${to[1]} l${-26 * Math.cos(ang - 0.45)},${-26 * Math.sin(ang - 0.45)} M${to[0]},${to[1]} l${-26 * Math.cos(ang + 0.45)},${-26 * Math.sin(ang + 0.45)}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      )}
    </svg>
  );
};

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 26, color = C.muted }) => (
  <span style={{ fontFamily: MONO, fontSize: size, color }}>{children}</span>
);

export const Em: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size }) => (
  <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.accent, fontSize: size }}>{children}</span>
);
