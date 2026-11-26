import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Khuôn mặt MC số: chớp mắt + miệng mấp máy. */
export const LiveFace: React.FC<{ size: number; talking?: boolean }> = ({ size, talking = true }) => {
  const f = useCurrentFrame();
  const blink = f % 75 < 4 ? 0.15 : 1;
  const mouth = talking ? 6 + Math.abs(Math.sin(f / 3.2)) * 16 : 6;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="86" fill="#F7D3B4" stroke={C.ink} strokeWidth="5" />
      <path d="M22,92 C24,40 60,16 100,16 C140,16 176,40 178,92 C160,70 130,58 100,60 C70,58 40,70 22,92 Z" fill="#2A2320" stroke={C.ink} strokeWidth="5" />
      <ellipse cx="72" cy="104" rx="9" ry={11 * blink} fill={C.ink} />
      <ellipse cx="128" cy="104" rx="9" ry={11 * blink} fill={C.ink} />
      <ellipse cx="100" cy="146" rx="20" ry={mouth / 2} fill={C.accent} stroke={C.ink} strokeWidth="4" />
      <ellipse cx="58" cy="132" rx="12" ry="7" fill="#EC9C86" opacity="0.6" />
      <ellipse cx="142" cy="132" rx="12" ry="7" fill="#EC9C86" opacity="0.6" />
    </svg>
  );
};

export const Waveform: React.FC<{ w: number; h: number; active: boolean; bars?: number; color?: string }> = ({ w, h, active, bars = 34, color = C.accent }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, width: w, height: h }}>
      {Array.from({ length: bars }).map((_, i) => {
        const v = active ? 0.25 + 0.75 * Math.abs(Math.sin(f / 4 + i * 0.7) * Math.cos(f / 9 + i * 0.3)) : 0.12;
        return <div key={i} style={{ flex: 1, height: h * v, background: color, borderRadius: 6 }} />;
      })}
    </div>
  );
};

export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 44, color = C.ink }) => {
  const p: Record<string, React.ReactNode> = {
    play: <path d="M9 6 L19 12 L9 18 Z" {...S} fill="currentColor" />,
    key: <><circle cx="8" cy="12" r="4" {...S} /><path d="M12 12 H21 M18 12 V15 M15 12 V14" {...S} /></>,
    server: <><rect x="4" y="4" width="16" height="7" rx="2" {...S} /><rect x="4" y="13" width="16" height="7" rx="2" {...S} /><path d="M8 7.5h.01M8 16.5h.01" {...S} /></>,
    file: <><path d="M6 3h8l4 4v14H6z" {...S} /><path d="M14 3v4h4M9 12h6M9 16h6" {...S} /></>,
    person: <><circle cx="12" cy="8" r="4" {...S} /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" {...S} /></>,
    download: <><path d="M12 4v11M7 10l5 5 5-5M5 20h14" {...S} /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" {...S} /><path d="M3 10h18M8 3v4M16 3v4" {...S} /></>,
    comment: <path d="M4 5h16v11H9l-5 4z" {...S} />,
    share: <><circle cx="6" cy="12" r="2.5" {...S} /><circle cx="18" cy="6" r="2.5" {...S} /><circle cx="18" cy="18" r="2.5" {...S} /><path d="M8.2 11l7.6-4M8.2 13l7.6 4" {...S} /></>,
    bell: <><path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" {...S} /><path d="M10 20a2 2 0 004 0" {...S} /></>,
    coin: <><circle cx="12" cy="12" r="8" {...S} /><path d="M12 7v10M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6c0 2.4-5 1.4-5 3.8 0 1 1 1.6 2.5 1.6s2.5-.5 2.5-1.5" {...S} /></>,
    shield: <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" {...S} /><path d="M8.5 12l2.5 2.5 4.5-5" {...S} /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" {...S} /><path d="M5 11a7 7 0 0014 0M12 18v3" {...S} /></>,
    repo: <><path d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2z" {...S} /><path d="M5 18a2 2 0 012-2h12" {...S} /></>,
    star: <path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z" {...S} />,
    brain: <><path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 1V5a2 2 0 00-3-1zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 1" {...S} /></>,
    clock: <><circle cx="12" cy="12" r="8" {...S} /><path d="M12 8v4l3 2" {...S} /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ color, flexShrink: 0 }} aria-hidden="true">
      {p[name]}
    </svg>
  );
};
