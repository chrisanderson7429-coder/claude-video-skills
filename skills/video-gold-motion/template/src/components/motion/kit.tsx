// Bộ thành phần motion graphics nền tối, màu nhấn cam (phong cách reel "xưởng phim motion").
// Mọi chuyển động đều tính theo frame (spring / interpolate), không dùng CSS animation.
import React, { useId, useMemo } from "react";
import { AbsoluteFill, Img, interpolate, interpolateColors, random, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/BeVietnamPro";
import { MONO, FPS } from "../../theme";
import { WORDS, msToF, Word } from "../../lib";

export const FONT = loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin", "latin-ext", "vietnamese"] }).fontFamily;
export { MONO };

export const K = {
  bg: "#0C0A07",
  text: "#F5F1EA",
  muted: "#8F877C",
  dim: "#5C564F",
  line: "rgba(255,255,255,0.12)",
  accent: "#D4A843",
  accentHi: "#F0CE80",
  accentGlow: "rgba(212,168,67,0.45)",
  warn: "#FF4D4D",
  ok: "#3DDC84",
};

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lerp = (f: number, a: number, b: number, from: number, to: number) => interpolate(f, [a, b], [from, to], { ...clamp, easing: EASE });
export const spr = (f: number, at: number, damping = 14, stiffness = 120) =>
  spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 0.8 } });

/* ───────────── Nền ───────────── */

/** Ô họa tiết art-deco: lưới hình thoi mảnh, hình thoi nhỏ lồng trong, chấm ở giao điểm (vàng, rất nhạt). */
const DECO_TILE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><g fill="none" stroke="#D4A843" stroke-width="1.2">' +
  '<path d="M70 0L140 70L70 140L0 70Z"/><path d="M70 30L110 70L70 110L30 70Z" stroke-opacity="0.55"/></g>' +
  '<g fill="#F0CE80"><circle cx="70" cy="0" r="2.4"/><circle cx="0" cy="70" r="2.4"/><circle cx="140" cy="70" r="2.4"/><circle cx="70" cy="140" r="2.4"/><circle cx="70" cy="70" r="1.6"/></g></svg>',
)}")`;

/** Nền đen ấm, họa tiết art-deco vàng rất nhạt trôi chậm, tia nắng quạt từ đáy, quầng vàng "thở", bụi vàng bay lên, vignette. */
export const DarkBg: React.FC = () => {
  const f = useCurrentFrame();
  const b = 0.85 + 0.15 * Math.sin(f / 50);
  const dx = Math.sin(f / 140) * 6;
  const parts = useMemo(() => Array.from({ length: 46 }, (_, k) => ({ x: random(`px${k}`) * 1080, y: random(`py${k}`) * 1920, s: 1.5 + random(`ps${k}`) * 3.5, v: 0.4 + random(`pv${k}`) * 1.4, a: 0.15 + random(`pa${k}`) * 0.5 })), []);
  return (
    <AbsoluteFill style={{ backgroundColor: K.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: DECO_TILE, backgroundSize: "140px 140px", backgroundPosition: `${(f * 0.35) % 140}px ${(f * 0.6) % 140}px`, opacity: 0.14, maskImage: "radial-gradient(ellipse 75% 60% at 50% 42%, transparent 25%, black 80%)" }} />
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.04}deg at 50% 112%, rgba(212,168,67,0.07) 0deg 1.4deg, transparent 1.4deg 7deg)`, maskImage: "radial-gradient(ellipse 90% 55% at 50% 100%, black 0%, transparent 85%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 38% at ${50 + dx}% 104%, rgba(212,168,67,${0.36 * b}) 0%, rgba(110,82,24,${0.16 * b}) 45%, transparent 75%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 15% 0%, rgba(245,218,150,0.07) 0%, transparent 70%)" }} />
      {parts.map((p, k) => {
        const y = (((p.y - f * p.v) % 1920) + 1920) % 1920;
        return <div key={k} style={{ position: "absolute", left: p.x + Math.sin(f / 40 + k) * 12, top: y, width: p.s, height: p.s, borderRadius: 9, background: K.accentHi, opacity: p.a * (0.6 + 0.4 * Math.sin(f / 20 + k)), boxShadow: `0 0 ${p.s * 3}px ${K.accent}` }} />;
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ───────────── Cảnh ngắn (beat) + chuyển cảnh ───────────── */

export type Tr = "whipL" | "whipR" | "zoom" | "rise" | "tilt" | "spin";
export type BeatDef = { a: number; t: Tr; el: React.ReactNode; name?: string };

/** Biến đổi của chuyển cảnh. p = 0..1; dir = 1 khi vào, -1 khi ra. Trả về style + độ nhòe theo hướng. */
const trStyle = (t: Tr, p: number, entering: boolean): { st: React.CSSProperties; bx: number; by: number } => {
  const k = entering ? 1 - p : p; // 0 = đứng yên, 1 = xa nhất
  const sgn = entering ? 1 : -1;
  const o = entering ? Math.min(1, p * 1.8) : Math.min(1, (1 - p) * 1.8);
  switch (t) {
    case "whipL": return { st: { translate: `${sgn * 900 * k}px 0px`, opacity: o }, bx: 60 * k, by: 0 };
    case "whipR": return { st: { translate: `${-sgn * 900 * k}px 0px`, opacity: o }, bx: 60 * k, by: 0 };
    case "rise": return { st: { translate: `0px ${sgn * 700 * k}px`, opacity: o }, bx: 0, by: 50 * k };
    case "zoom": return { st: { scale: String(entering ? 1 - 0.55 * k : 1 + 1.2 * k), opacity: o }, bx: 22 * k, by: 22 * k };
    case "tilt": return { st: { transform: `perspective(1400px) rotateY(${sgn * 70 * k}deg)`, opacity: o }, bx: 14 * k, by: 0 };
    case "spin": return { st: { rotate: `${sgn * -14 * k}deg`, scale: String(1 - 0.3 * k), opacity: o }, bx: 16 * k, by: 16 * k };
  }
};

/** Một cảnh ngắn từ frame a tới b (trong Sequence của đoạn), có chuyển cảnh vào/ra và camera trôi nhẹ. */
const Beat: React.FC<{ a: number; b: number; tin: Tr; tout: Tr; first: boolean; children: React.ReactNode }> = ({ a, b, tin, tout, first, children }) => {
  const f = useCurrentFrame();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const H = 7;
  if (f < a - H || f >= b + H) return null;
  let st: React.CSSProperties = {}, bx = 0, by = 0;
  if (!first && f < a + H) ({ st, bx, by } = trStyle(tin, lerp(f, a - H, a + H, 0, 1), true));
  else if (f >= b - H) ({ st, bx, by } = trStyle(tout, lerp(f, b - H, b + H, 0, 1), false));
  const push = 1 + 0.045 * interpolate(f, [a, b], [0, 1], clamp);
  const blur = bx > 0.3 || by > 0.3;
  return (
    <AbsoluteFill style={{ ...st, filter: blur ? `url(#${id})` : undefined }}>
      {blur && <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={`${bx.toFixed(1)} ${by.toFixed(1)}`} /></filter></svg>}
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "540px 800px" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Chuỗi cảnh ngắn: cảnh k chạy từ list[k].a tới list[k+1].a (cảnh cuối tới `end`). Ra bằng kiểu vào của cảnh sau. */
export const Beats: React.FC<{ list: BeatDef[]; end: number; exit?: Tr; noIntro?: boolean }> = ({ list, end, exit = "zoom", noIntro }) => (
  <>
    {list.map((x, k) => (
      <Beat key={k} a={x.a} b={k + 1 < list.length ? list[k + 1].a : end} tin={x.t} tout={k + 1 < list.length ? list[k + 1].t : exit} first={k === 0 && !!noIntro}>
        {x.el}
      </Beat>
    ))}
  </>
);

/* ───────────── Vào / ra ───────────── */

/** Kiểu vào cảnh: nảy lên bằng spring, kèm mờ → nét (cảm giác motion blur). */
export const enter = (f: number, at: number, o: { y?: number; x?: number; s?: number; blur?: number; damping?: number } = {}): React.CSSProperties => {
  const { y = 46, x = 0, s = 0.9, blur = 14, damping = 14 } = o;
  const p = spr(f, at, damping);
  const q = Math.min(1, p * 1.35);
  return {
    opacity: f < at ? 0 : q,
    translate: `${x * (1 - p)}px ${y * (1 - p)}px`,
    scale: String(s + (1 - s) * p),
    filter: blur ? `blur(${(blur * (1 - q)).toFixed(2)}px)` : undefined,
  };
};

/** Mọi thứ bên trong biến mất (mờ + nhòe + thu nhỏ) từ frame `at`. */
export const Gone: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const t = lerp(f, at, at + 10, 0, 1);
  if (t >= 1) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - t, filter: t > 0 ? `blur(${t * 16}px)` : undefined, scale: String(1 - 0.05 * t), translate: `0px ${-30 * t}px` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Bọc một phần tử đặt tuyệt đối, cho nó vào cảnh tại `at`. */
export const In: React.FC<{ at: number; x: number; y: number; w?: number; style?: React.CSSProperties; dy?: number; dx?: number; s?: number; children: React.ReactNode }> = ({ at, x, y, w, style, dy, dx, s, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, ...enter(f, at, { y: dy, x: dx, s }), ...style }}>{children}</div>;
};

/* ───────────── Thẻ kính ───────────── */

/** Thẻ kính tối. `on` = frame bắt đầu sáng viền cam (đang được nói tới). */
export const Glass: React.FC<{
  at: number; x: number; y: number; w: number; h?: number; pad?: number; r?: number; on?: number; off?: number;
  tone?: "glass" | "accent" | "warn"; children?: React.ReactNode; style?: React.CSSProperties; dy?: number;
}> = ({ at, x, y, w, h, pad = 28, r = 30, on, off, tone = "glass", children, style, dy }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  let a = on !== undefined ? lerp(f, on, on + 8, 0, 1) : 0;
  if (off !== undefined) a *= 1 - lerp(f, off, off + 8, 0, 1);
  const edge = tone === "warn" ? K.warn : K.accent;
  const fill =
    tone === "accent" ? `linear-gradient(160deg, ${K.accentHi} 0%, ${K.accent} 55%, #B08425 100%)`
      : tone === "warn" ? "linear-gradient(180deg, rgba(255,77,77,0.16), rgba(255,77,77,0.06))"
        : "linear-gradient(180deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.025) 100%)";
  const border = tone === "glass" ? interpolateColors(a, [0, 1], ["rgba(255,255,255,0.13)", edge]) : tone === "warn" ? "rgba(255,77,77,0.7)" : "rgba(246,226,170,0.6)";
  const glowA = tone === "accent" ? 0.55 : a * 0.55;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", padding: pad, borderRadius: r,
        background: fill, border: `2px solid ${border}`, lineHeight: 1.3, color: tone === "accent" ? "#1A1306" : K.text, fontFamily: FONT,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 30px 70px rgba(0,0,0,0.5), 0 0 ${50 * (tone === "glass" ? a : 1)}px rgba(${tone === "warn" ? "255,77,77" : "212,168,67"},${glowA})`,
        ...enter(f, at, { y: dy }), ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ───────────── Chữ ───────────── */

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = K.accent, size = 26 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: size * 0.16, textTransform: "uppercase", color }}>{children}</div>
);

export const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 64, color = K.text, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.26, letterSpacing: -size * 0.01, textTransform: "uppercase", color, ...style }}>{children}</div>
);

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 24, color = K.muted, style }) => (
  <span style={{ fontFamily: MONO, fontSize: size, color, ...style }}>{children}</span>
);

/** Viên thuốc nhỏ (nhãn). */
export const Chip: React.FC<{ at: number; x: number; y: number; tone?: "accent" | "warn" | "glass" | "ok"; size?: number; children: React.ReactNode; rot?: number }> = ({ at, x, y, tone = "accent", size = 30, children, rot = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const st: Record<string, React.CSSProperties> = {
    accent: { background: K.accent, color: "#1A1306", boxShadow: `0 0 40px ${K.accentGlow}` },
    warn: { background: "rgba(255,77,77,0.14)", color: "#FFB3B3", border: `2px solid ${K.warn}` },
    ok: { background: "rgba(61,220,132,0.14)", color: "#B9F5D2", border: `2px solid ${K.ok}` },
    glass: { background: "rgba(255,255,255,0.07)", color: K.text, border: `2px solid ${K.line}` },
  };
  return (
    <div style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg`, ...enter(f, at, { y: 20, s: 0.7, damping: 11 }) }}>
      <div style={{ padding: `${size * 0.36}px ${size * 0.8}px`, borderRadius: 999, fontFamily: FONT, fontWeight: 700, fontSize: size, whiteSpace: "nowrap", ...st[tone] }}>{children}</div>
    </div>
  );
};

/** Chữ gõ dần từng ký tự, có con trỏ nhấp nháy. */
export const Typed: React.FC<{ at: number; text: string; cps?: number; caret?: boolean }> = ({ at, text, cps = 1.4, caret = true }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <span>
      {text.slice(0, n)}
      {caret && <span style={{ display: "inline-block", width: 3, height: "1em", marginLeft: 4, background: K.accent, verticalAlign: "-0.12em", opacity: n < text.length || blink ? 1 : 0 }} />}
    </span>
  );
};

/** Số chạy từ a → b. */
export const Counter: React.FC<{ at: number; dur: number; from: number; to: number; fmt?: (n: number) => string }> = ({ at, dur, from, to, fmt = (n) => Math.round(n).toLocaleString("vi-VN") }) => {
  const f = useCurrentFrame();
  return <>{fmt(lerp(f, at, at + dur, from, to))}</>;
};

/* ───────────── Biểu tượng (nét mảnh) ───────────── */

const SS = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ICONS: Record<string, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="6.5" {...SS} /><path d="M16 16l4.5 4.5" {...SS} /></>,
  plan: <><rect x="4" y="4" width="16" height="16" rx="3" {...SS} /><path d="M8 9h8M8 13h8M8 17h5" {...SS} /></>,
  brain: <><path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 1V5a2 2 0 00-3-1zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 1" {...SS} /></>,
  palette: <><path d="M12 3a9 9 0 100 18c1.2 0 1.6-1 1.1-1.9-.6-1 .1-2.1 1.3-2.1H17a4 4 0 004-4c0-5.5-4-10-9-10z" {...SS} /><circle cx="7.5" cy="11" r="1.2" {...SS} /><circle cx="11" cy="7.5" r="1.2" {...SS} /><circle cx="15.5" cy="8.5" r="1.2" {...SS} /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...SS} /><circle cx="12" cy="12" r="3" {...SS} /></>,
  file: <><path d="M6 3h8l4 4v14H6z" {...SS} /><path d="M14 3v4h4M9 12h6M9 16h6" {...SS} /></>,
  user: <><circle cx="12" cy="8" r="4" {...SS} /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" {...SS} /></>,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" {...SS} />,
  shield: <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" {...SS} /><path d="M8.5 12l2.5 2.5 4.5-5" {...SS} /></>,
  key: <><circle cx="8" cy="12" r="4" {...SS} /><path d="M12 12H21M18 12v3M15 12v2" {...SS} /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" {...SS} /><path d="M8 10V7a4 4 0 018 0v3" {...SS} /></>,
  gear: <><circle cx="12" cy="12" r="3" {...SS} /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" {...SS} /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" {...SS} />,
  bell: <><path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" {...SS} /><path d="M10 20a2 2 0 004 0" {...SS} /></>,
  star: <path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z" {...SS} />,
  test: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" {...SS} /><path d="M7 15h10" {...SS} /></>,
  split: <><circle cx="6" cy="6" r="2.5" {...SS} /><circle cx="6" cy="18" r="2.5" {...SS} /><circle cx="18" cy="12" r="2.5" {...SS} /><path d="M8.5 6.5c4 1 5 3 7 4.5M8.5 17.5c4-1 5-3 7-4.5" {...SS} /></>,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" {...SS} /><path d="M11 18.5h2" {...SS} /></>,
  access: <><circle cx="12" cy="4.5" r="1.8" {...SS} /><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3 6M12 15l3 6" {...SS} /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" {...SS} /><path d="M3 13l9 5 9-5" {...SS} /></>,
  share: <><circle cx="6" cy="12" r="2.5" {...SS} /><circle cx="18" cy="6" r="2.5" {...SS} /><circle cx="18" cy="18" r="2.5" {...SS} /><path d="M8.2 11l7.6-4M8.2 13l7.6 4" {...SS} /></>,
  coin: <><circle cx="12" cy="12" r="8.5" {...SS} /><path d="M12 7v10M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6c0 2.4-5 1.4-5 3.8 0 1 1 1.6 2.5 1.6s2.5-.5 2.5-1.5" {...SS} /></>,
  loop: <><path d="M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5" {...SS} /><path d="M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5" {...SS} /></>,
  play: <path d="M8 5.5l11 6.5-11 6.5z" {...SS} />,
  warn: <><path d="M12 3.5l9.5 16.5h-19z" {...SS} /><path d="M12 10v4.5M12 17.2v.01" {...SS} /></>,
  git: <><circle cx="6" cy="5.5" r="2.3" {...SS} /><circle cx="6" cy="18.5" r="2.3" {...SS} /><circle cx="18" cy="9" r="2.3" {...SS} /><path d="M6 7.8v8.4M18 11.3c0 3-4 3.2-11 5.5" {...SS} /></>,
  folder: <path d="M3 6.5a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2z" {...SS} />,
  cloud: <path d="M7 18.5a4.5 4.5 0 01-.6-9 6 6 0 0111.4 1.7A3.7 3.7 0 0117.5 18.5z" {...SS} />,
  bug: <><rect x="7.5" y="7" width="9" height="12" rx="4.5" {...SS} /><path d="M12 7v12M9 5l1.5 2M15 5l-1.5 2M4 11h3.5M16.5 11H20M4 16h3.5M16.5 16H20" {...SS} /></>,
  puzzle: <path d="M5 8h3a2 2 0 114 0h3v3a2 2 0 110 4v3h-3a2 2 0 10-4 0H5v-3a2 2 0 100-4z" {...SS} />,
  target: <><circle cx="12" cy="12" r="8.5" {...SS} /><circle cx="12" cy="12" r="4.5" {...SS} /><circle cx="12" cy="12" r="1" {...SS} /></>,
  box: <><path d="M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5z" {...SS} /><path d="M3 7.5l9 4.5 9-4.5M12 12v9" {...SS} /></>,
};
export const Ico: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 40, color = K.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ color, flexShrink: 0, display: "block" }} aria-hidden="true">{ICONS[name]}</svg>
);

/** Ô vuông kính chứa icon (giống ô icon trong video mẫu). */
export const IcoTile: React.FC<{ name: string; size?: number; on?: boolean; color?: string }> = ({ name, size = 72, on, color }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: on ? "rgba(212,168,67,0.16)" : "rgba(255,255,255,0.06)", border: `1.5px solid ${on ? "rgba(212,168,67,0.7)" : K.line}`,
      boxShadow: on ? `0 0 26px ${K.accentGlow}` : "none",
    }}
  >
    <Ico name={name} size={size * 0.56} color={color ?? (on ? K.accentHi : K.text)} />
  </div>
);

/* ───────────── Nét vẽ: đường nối, tick, gạch ───────────── */

/**
 * Đường nối tự vẽ ra (kiểu sơ đồ trong video mẫu), sau đó có chấm sáng chạy dọc đường.
 * `d` là path SVG theo toạ độ khung 1080x1920.
 */
export const Wire: React.FC<{ at: number; d: string; dur?: number; dots?: number; width?: number; color?: string; until?: number }> = ({ at, d, dur = 14, dots = 1, width = 3, color = K.accent, until }) => {
  const f = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  if (f < at || (until !== undefined && f >= until + 8)) return null;
  const fadeOut = until !== undefined ? 1 - lerp(f, until, until + 8, 0, 1) : 1;
  const p = lerp(f, at, at + dur, 0, 1);
  const ev = evolvePath(p, d);
  const pts = p >= 1 ? Array.from({ length: dots }, (_, k) => getPointAtLength(d, (((f - at - dur) / 40 + k / dots) % 1) * len)).filter((pt): pt is { x: number; y: number } => pt !== null) : [];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: fadeOut }}>
      <path d={d} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={width + 6} strokeLinecap="round" style={{ filter: "blur(6px)" }} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      {pts.map((pt, k) => (
        <g key={k}>
          <circle cx={pt.x} cy={pt.y} r={14} fill={color} opacity={0.35} style={{ filter: "blur(6px)" }} />
          <circle cx={pt.x} cy={pt.y} r={5.5} fill="#FFF5D9" />
        </g>
      ))}
    </svg>
  );
};

/** Dấu tick tự vẽ trong vòng tròn (xanh lá = đạt, cam = đã xong). */
export const Tick: React.FC<{ at: number; size?: number; color?: string }> = ({ at, size = 46, color = K.accent }) => {
  const f = useCurrentFrame();
  if (f < at) return <div style={{ width: size, height: size, borderRadius: size, border: `2px solid ${K.line}`, boxSizing: "border-box", flexShrink: 0 }} />;
  const s = spr(f, at, 10, 160);
  const d = "M7 12.5l3.2 3.2L17 9";
  const ev = evolvePath(lerp(f, at + 2, at + 10, 0, 1), d);
  return (
    <div style={{ width: size, height: size, borderRadius: size, background: color, scale: String(0.5 + 0.5 * s), flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px ${color}88` }}>
      <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24"><path d={d} fill="none" stroke="#120A05" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} /></svg>
    </div>
  );
};

/** Dấu gạch chéo đỏ tự vẽ, đặt tuyệt đối. */
export const XMark: React.FC<{ at: number; x: number; y: number; size: number; until?: number }> = ({ at, x, y, size, until }) => {
  const f = useCurrentFrame();
  if (f < at || (until !== undefined && f >= until)) return null;
  const a = evolvePath(lerp(f, at, at + 7, 0, 1), "M4 4L20 20");
  const b = evolvePath(lerp(f, at + 5, at + 12, 0, 1), "M20 4L4 20");
  const st = { fill: "none", stroke: K.warn, strokeWidth: 2.6, strokeLinecap: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, overflow: "visible", filter: `drop-shadow(0 0 12px ${K.warn})` }}>
      <path d="M4 4L20 20" {...st} strokeDasharray={a.strokeDasharray} strokeDashoffset={a.strokeDashoffset} />
      <path d="M20 4L4 20" {...st} strokeDasharray={b.strokeDasharray} strokeDashoffset={b.strokeDashoffset} />
    </svg>
  );
};

/* ───────────── Cảnh tiêu đề đề mục ───────────── */

/** Cảnh tiêu đề riêng: số "01" thật to phát sáng, vòng tia quay phía sau, dưới là tên đề mục và link GitHub. */
export const TitleCard: React.FC<{ at: number; n: number; name: string; repo: string }> = ({ at, n, name, repo }) => {
  const f = useCurrentFrame();
  const t = f - at;
  const num = spr(f, at, 13, 90);
  const ring = lerp(f, at, at + 24, 0, 1);
  const rays = Array.from({ length: 36 });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 420, top: 700 - 420, width: 840, height: 840, borderRadius: 999, background: `radial-gradient(circle, rgba(212,168,67,${0.35 * ring}) 0%, rgba(212,168,67,0.08) 40%, transparent 68%)`, scale: String(0.6 + 0.4 * ring) }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(540 700) rotate(${t * 0.6})`} opacity={ring}>
          <circle r={330} fill="none" stroke={K.accent} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="4 14" />
          <circle r={372} fill="none" stroke={K.accent} strokeOpacity={0.18} strokeWidth={1.5} />
          {rays.map((_, k) => {
            const ln = k % 3 === 0 ? 34 : 16;
            return <line key={k} x1={0} y1={-392} x2={0} y2={-392 - ln * ring} stroke={K.accentHi} strokeOpacity={k % 3 === 0 ? 0.8 : 0.35} strokeWidth={3} strokeLinecap="round" transform={`rotate(${k * 10})`} />;
          })}
        </g>
      </svg>
      <div
        style={{
          position: "absolute", left: 0, top: 410, width: 1080, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 470, lineHeight: 1, letterSpacing: -12,
          background: "linear-gradient(180deg, #FFF1CC 0%, #E6BE63 38%, #D4A843 62%, #7E5C17 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          filter: `drop-shadow(0 0 ${40 * num}px rgba(212,168,67,0.55)) blur(${(1 - Math.min(1, num * 1.2)) * 20}px)`,
          scale: String(1.6 - 0.6 * num), opacity: Math.min(1, num * 1.6), translate: `0px ${(1 - num) * -60}px`,
        }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 90, top: 1085, width: 900, textAlign: "center" }}>
        <div style={{ display: "inline-flex", gap: 2 }}>
          {name.split("").map((ch, k) => (
            <span key={k} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, textTransform: "uppercase", color: K.text, whiteSpace: "pre", ...enter(f, at + 8 + k * 1.1, { y: 60, s: 0.6, blur: 12, damping: 13 }) }}>{ch}</span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 1235, width: 1080, display: "flex", justifyContent: "center", ...enter(f, at + 18, { y: 30, blur: 8 }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 28px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: `1.5px solid ${K.line}` }}>
          <Ico name="git" size={34} color={K.accentHi} />
          <Mono size={30} color="#D8D1C7"><Typed at={at + 20} text={repo} cps={2.4} caret={false} /></Mono>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Chữ lớn bay vào từng từ (kinetic typography). Từ nằm trong `hot` tô cam. */
export const KWords: React.FC<{ at: number; text: string; size?: number; y: number; hot?: string[]; step?: number; align?: "center" | "left" }> = ({ at, text, size = 104, y, hot = [], step = 3, align = "center" }) => {
  const f = useCurrentFrame();
  const lines = text.split("\n");
  let idx = 0;
  return (
    <div style={{ position: "absolute", left: 80, top: y, width: 920, textAlign: align }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ lineHeight: 1.24 }}>
          {ln.split(" ").map((w, k) => {
            const i = idx++;
            const isHot = hot.includes(w);
            return (
              <span key={k} style={{ display: "inline-block", margin: `0 ${size * 0.12}px`, fontFamily: FONT, fontWeight: 800, fontSize: size, textTransform: "uppercase", color: isHot ? K.accent : K.text, textShadow: isHot ? `0 0 40px ${K.accentGlow}` : undefined, ...enter(f, at + i * step, { y: size * 0.8, s: 0.5, blur: 16, damping: 12 }) }}>{w}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ───────────── Ảnh repo trong khung trình duyệt tối ───────────── */

export type Look = { at: number; fx: number; fy: number; z: number };
export type Mark = { at: number; x: number; y: number; w: number; h: number; until?: number };

export const DarkShot: React.FC<{ src: string; url: string; ar: number; at: number; x: number; y: number; w: number; h: number; looks?: Look[]; marks?: Mark[] }> = ({ src, url, ar, at, x, y, w, h, looks, marks = [] }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const BAR = 54;
  const vw = w - 4, vh = h - BAR - 4;
  const L = looks && looks.length ? looks : [{ at, fx: 0.5, fy: 0, z: 1 }];
  let cur = { fx: L[0].fx, fy: L[0].fy, z: L[0].z };
  for (let k = 1; k < L.length; k++) {
    const t = lerp(f, L[k].at, L[k].at + 26, 0, 1);
    cur = { fx: cur.fx + (L[k].fx - cur.fx) * t, fy: cur.fy + (L[k].fy - cur.fy) * t, z: cur.z + (L[k].z - cur.z) * t };
  }
  const drift = 1 + interpolate(f - at, [0, 300], [0, 0.05], clamp);
  const iw = vw * cur.z * drift, ih = iw * ar;
  const left = Math.min(0, Math.max(vw - iw, vw / 2 - cur.fx * iw));
  const top = Math.min(0, Math.max(vh - ih, vh / 2 - cur.fy * ih));
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, overflow: "hidden", background: "#121010",
        border: "2px solid rgba(255,255,255,0.14)", boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,67,0.18)`,
        ...enter(f, at, { y: 60, s: 0.88, blur: 18 }), rotate: `${(1 - spr(f, at, 16)) * -3}deg`,
      }}
    >
      <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#1A1715", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85 }} />)}
        <div style={{ marginLeft: 12, flex: 1, height: 32, borderRadius: 10, background: "#26221F", display: "flex", alignItems: "center", padding: "0 14px", fontFamily: MONO, fontSize: 20, color: "#B5ADA3", whiteSpace: "nowrap", overflow: "hidden" }}>
          <Ico name="lock" size={18} color="#8F877C" /><span style={{ marginLeft: 10 }}>{url}</span>
        </div>
      </div>
      <div style={{ position: "relative", width: vw, height: vh, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left, top, width: iw, height: ih }} />
        {marks.map((m, k) => {
          if (f < m.at || (m.until !== undefined && f >= m.until)) return null;
          const a = spr(f, m.at, 12, 160);
          return (
            <div
              key={k}
              style={{
                position: "absolute", left: left + m.x * iw - 10, top: top + m.y * ih - 10, width: m.w * iw + 20, height: m.h * ih + 20,
                border: `4px solid ${K.accent}`, borderRadius: 14, scale: String(1.15 - 0.15 * a), opacity: Math.min(1, a * 1.5),
                boxShadow: `0 0 30px ${K.accentGlow}, 0 0 0 9999px rgba(8,6,5,${0.55 * a})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ───────────── Con trỏ chuột ───────────── */

/** Con trỏ bay từ (x0,y0) tới (x1,y1) rồi bấm (gợn sóng) tại frame `click`. */
export const Cursor: React.FC<{ at: number; click: number; from: [number, number]; to: [number, number] }> = ({ at, click, from, to }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = lerp(f, at, click - 2, 0, 1);
  const x = from[0] + (to[0] - from[0]) * t, y = from[1] + (to[1] - from[1]) * t;
  const press = f >= click && f < click + 6 ? 0.85 : 1;
  const r = lerp(f, click, click + 16, 0, 1);
  return (
    <>
      {f >= click && r < 1 && <div style={{ position: "absolute", left: to[0] - 60 * r, top: to[1] - 60 * r, width: 120 * r, height: 120 * r, borderRadius: 999, border: `3px solid ${K.accentHi}`, opacity: 1 - r }} />}
      <svg width={54} height={54} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 4, scale: String(press), opacity: lerp(f, at, at + 6, 0, 1), filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
        <path d="M5 3l14 8-6 1.5L10 19z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/* ───────────── Phụ đề ───────────── */

type Chunk = { words: Word[]; from: number; to: number };
/** Gom từ thành cụm phụ đề ngắn: ngắt ở dấu câu, tối đa 7 từ, hoặc khi giọng nghỉ dài. */
const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => { if (cur.length) chunks.push({ words: cur, from: msToF(cur[0].s), to: 0 }); cur = []; };
  WORDS.forEach((w, k) => {
    const next = WORDS[k + 1];
    if (cur.length && cur[0].p !== w.p) flush();
    cur.push(w);
    const gap = next ? next.s - w.e : 9999;
    if (/[,.;:?!]$/.test(w.t) || cur.length >= 7 || gap > 450) flush();
  });
  flush();
  chunks.forEach((c, k) => {
    const n = chunks[k + 1];
    const lastEnd = msToF(c.words[c.words.length - 1].e);
    c.to = n && n.from - lastEnd < 36 ? n.from : lastEnd + 18;
  });
  return chunks;
};

/** Phụ đề trắng ở giữa dưới, từ khoá tô cam; mỗi từ hiện ra mờ → nét. */
export const DarkCaptions: React.FC<{ top?: number }> = ({ top = 1400 }) => {
  const f = useCurrentFrame();
  const chunks = useMemo(buildChunks, [WORDS]);
  const c = chunks.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const outO = lerp(f, c.to - 4, c.to, 1, 0);
  return (
    <div style={{ position: "absolute", left: 70, top, width: 940, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 54, lineHeight: 1.4, color: K.text, opacity: outO, textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>
      {c.words.map((w) => {
        const st = msToF(w.s);
        const a = lerp(f, st - 2, st + 4, 0, 1);
        return (
          <span
            key={w.i}
            style={{
              display: "inline-block", margin: "0 9px", opacity: a, translate: `0px ${(1 - a) * 10}px`, filter: a < 1 ? `blur(${(1 - a) * 6}px)` : undefined,
              color: w.em ? K.accent : K.text, fontWeight: w.em ? 800 : 600, textShadow: w.em ? `0 0 24px ${K.accentGlow}, 0 4px 18px rgba(0,0,0,0.8)` : undefined,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

/** Thời lượng chuyển cảnh chồng lên đoạn sau (frame): Sequence của mỗi đoạn kéo dài thêm chừng này để cảnh ra kịp chạy hết. */
export const OVERLAP = 8;
