import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, MONO, SANS } from "../theme";
import { between, popIn } from "../lib";

/** Điểm nhìn của camera trên ảnh: fx, fy = vị trí (0..1) đặt vào giữa khung; z = độ phóng (1 = vừa chiều ngang). */
export type Look = { at: number; fx: number; fy: number; z: number };
/** Khung nhấn trên ảnh (toạ độ 0..1 theo ảnh). */
export type Mark = { at: number; x: number; y: number; w: number; h: number; until?: number };

/**
 * Ảnh chụp màn hình trang nguồn, đặt trong khung trình duyệt có bóng cứng.
 * Camera trượt/phóng mượt giữa các điểm nhìn (looks), có thể khoanh vùng (marks).
 */
export const Shot: React.FC<{
  src: string; url: string; ar: number; at: number; x: number; y: number; w: number; h: number;
  looks?: Look[]; marks?: Mark[]; out?: number; rot?: number; dark?: boolean;
}> = ({ src, url, ar, at, x, y, w, h, looks, marks = [], out, rot = 0, dark }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = popIn(f, at, 13);
  const o = out !== undefined ? between(f, out, out + 8, 1, 0) : 1;
  if (o <= 0) return null;

  const BAR = 50;
  const vw = w - 8, vh = h - BAR - 8;
  const L = looks && looks.length ? looks : [{ at, fx: 0.5, fy: 0, z: 1 }];
  let cur = { fx: L[0].fx, fy: L[0].fy, z: L[0].z };
  for (let k = 1; k < L.length; k++) {
    const t = between(f, L[k].at, L[k].at + 26, 0, 1);
    cur = { fx: cur.fx + (L[k].fx - cur.fx) * t, fy: cur.fy + (L[k].fy - cur.fy) * t, z: cur.z + (L[k].z - cur.z) * t };
  }
  const drift = 1 + interpolate(f - at, [0, 400], [0, 0.04], { extrapolateRight: "clamp" });
  const iw = vw * cur.z * drift, ih = iw * ar;
  const left = Math.min(0, Math.max(vw - iw, vw / 2 - cur.fx * iw));
  const top = Math.min(0, Math.max(vh - ih, vh / 2 - cur.fy * ih));

  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, overflow: "hidden",
        border: `4px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.shadow}`, background: dark ? "#111" : "#fff",
        opacity: Math.min(1, p * 1.4) * o, scale: String(0.7 + 0.3 * p), rotate: `${rot}deg`, translate: `0px ${(1 - p) * 40}px`,
      }}
    >
      <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: dark ? "#1E1E22" : "#F1EFEA", borderBottom: `3px solid ${C.ink}` }}>
        {["#E0614B", "#E9B949", "#5BB36A"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
        ))}
        <div style={{ marginLeft: 12, flex: 1, height: 30, borderRadius: 15, background: dark ? "#2C2C31" : "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontFamily: MONO, fontSize: 19, color: dark ? "#C9C5BD" : "#6B665E", whiteSpace: "nowrap", overflow: "hidden" }}>
          {url}
        </div>
      </div>
      <div style={{ position: "relative", width: vw, height: vh, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left, top, width: iw, height: ih }} />
        {marks.map((m, k) => {
          if (f < m.at || (m.until !== undefined && f >= m.until)) return null;
          const a = popIn(f, m.at, 11);
          return (
            <div
              key={k}
              style={{
                position: "absolute", left: left + m.x * iw - 8, top: top + m.y * ih - 8, width: m.w * iw + 16, height: m.h * ih + 16,
                border: `6px solid ${C.accent}`, borderRadius: 14, scale: String(0.85 + 0.15 * a), opacity: Math.min(1, a * 1.5),
                boxShadow: `0 0 0 9999px rgba(20,20,20,${0.28 * a})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Dòng chú thích nguồn nhỏ dưới ảnh. */
export const Source: React.FC<{ at: number; x: number; y: number; children: React.ReactNode }> = ({ at, x, y, children }) => {
  const f = useCurrentFrame();
  const o = between(f, at, at + 10, 0, 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: SANS, fontSize: 22, fontWeight: 600, color: C.muted, opacity: o, whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
};
