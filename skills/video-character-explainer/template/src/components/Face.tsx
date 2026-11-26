import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";
import type { Tuning } from "../data/poses";

const SoftDef: React.FC = () => (
  <defs>
    <filter id="softSkin" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="3.5" />
    </filter>
  </defs>
);

/** Miệng vẽ đè lên ảnh pose. o = độ mở 0..1. Vẽ quanh tâm (x,y), phóng theo scale. */
export const Mouth: React.FC<{ o: number; t: Tuning }> = ({ o, t }) => {
  if (t.mouthStyle === "none") return null;
  const { x, y, scale } = t.mouth;
  const round = t.mouthStyle === "round";
  const SKIN = t.skin;
  return (
    <g transform={`translate(${x} ${y}) rotate(${t.tilt}) scale(${scale}) translate(${-x} ${-y})`}>
      <SoftDef />
      {/* che miệng gốc */}
      <ellipse cx={x} cy={y + 2} rx={round ? 58 : 70} ry={round ? 30 : 26} fill={SKIN} filter="url(#softSkin)" />
      {round ? (
        <>
          <ellipse cx={x} cy={y + 6} rx={15 + 4 * o} ry={11 + 15 * o} fill="#6B2A25" stroke="#C0655A" strokeWidth={7} />
          <ellipse cx={x} cy={y + 12 + 8 * o} rx={8 + 2 * o} ry={3 + 4 * o} fill="#D0665C" />
        </>
      ) : o < 0.08 ? (
        <>
          <path d={`M${x - 44},${y - 3 - 3 * (1 - t.smile)} Q${x},${y + 12 * t.smile + 2 * (1 - t.smile)} ${x + 42},${y - 9 + 3 * (1 - t.smile)}`} fill="none" stroke="#8F3F32" strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={x} cy={y + 18} rx={22} ry={5} fill="#F2A57C" opacity={0.6} />
        </>
      ) : (
        <>
          <path
            d={`M${x - 42},${y - 4} Q${x},${y + 6} ${x + 40},${y - 8} Q${x + 30},${y + 8 + 26 * o} ${x},${y + 10 + 30 * o} Q${x - 30},${y + 10 + 26 * o} ${x - 42},${y - 4} Z`}
            fill="#5E2420" stroke="#8F3F32" strokeWidth={4} strokeLinejoin="round"
          />
          {o > 0.22 && <path d={`M${x - 32},${y - 1} Q${x},${y + 7} ${x + 30},${y - 5} L${x + 28},${y + 2 + 4 * o} Q${x},${y + 12 + 4 * o} ${x - 30},${y + 5 + 4 * o} Z`} fill="#FFFDF9" />}
          <ellipse cx={x} cy={y + 4 + 24 * o} rx={16} ry={3 + 5 * o} fill="#D0665C" />
          <ellipse cx={x} cy={y + 20 + 30 * o} rx={22} ry={5} fill="#F2A57C" opacity={0.55} />
        </>
      )}
    </g>
  );
};

export const Blink: React.FC<{ t: Tuning }> = ({ t }) => (
  <g>
    {t.eyes.map((e) => (
      <g key={e.x} transform={`rotate(${t.tilt} ${e.x} ${e.y})`}>
        <SoftDef />
        <ellipse cx={e.x} cy={e.y} rx={29} ry={13} fill={t.skin} filter="url(#softSkin)" />
        <path d={`M${e.x - 24},${e.y + 1} Q${e.x},${e.y + 9} ${e.x + 24},${e.y + 1}`} fill="none" stroke="#1C1512" strokeWidth={5} strokeLinecap="round" />
      </g>
    ))}
  </g>
);

/** Tia nhấn quanh đầu mỗi khi đổi pose. */
export const Burst: React.FC<{ t: number; head: { x: number; y: number } }> = ({ t, head }) => {
  if (t < 0 || t > 12) return null;
  const a = interpolate(t, [0, 4, 12], [0, 1, 0]);
  const grow = interpolate(t, [0, 12], [0.85, 1.15]);
  return (
    <g opacity={a}>
      {[-160, -125, -90, -55, -20].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const r1 = 250 * grow, r2 = 300 * grow;
        return <line key={deg} x1={head.x + Math.cos(r) * r1} y1={head.y + Math.sin(r) * r1} x2={head.x + Math.cos(r) * r2} y2={head.y + Math.sin(r) * r2} stroke={C.accent} strokeWidth={12} strokeLinecap="round" />;
      })}
    </g>
  );
};
