import React, { useMemo } from "react";
import { Img, spring, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "../theme";
import { WORDS, LOUD, msToF, popIn } from "../lib";
import { AVAILABLE, IMG_H, IMG_W, PoseName, resolvePose, tuningOf } from "../data/poses";
import { Blink, Burst, Mouth } from "./Face";

export type PoseCue = { at: number; pose: PoseName };


/** Độ mở miệng 0..1 theo độ lớn giọng đọc (làm mượt 3 frame). */
export const openness = (f: number) => {
  const v = (k: number) => LOUD[Math.max(0, Math.min(LOUD.length - 1, k))] ?? -90;
  const db = (v(f - 1) + 2 * v(f) + v(f + 1)) / 4;
  return Math.max(0, Math.min(1, (db + 44) / 22));
};


/** Nhân vật: miệng mấp máy theo voice, chớp mắt, nhún/nghiêng khi nói, chuyển động riêng theo từng pose, trượt vào lúc mở đầu. */
export const Character: React.FC<{ cues: PoseCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const EMPTY = Object.keys(AVAILABLE).length === 0; // chưa có ảnh pose nào trong public/poses → không vẽ nhân vật
  // frame bắt đầu của các từ được nhấn (để nhân vật "nhún" theo)
  const EMPH_FRAMES = useMemo(() => WORDS.filter((w, k) => w.em && !(WORDS[k - 1]?.em)).map((w) => msToF(w.s)), [WORDS]);
  let cur = cues[0];
  for (const c of cues) if (f >= c.at) cur = c;
  const since = f - cur.at;
  const shown = resolvePose(cur.pose); // ảnh thực sự dùng (có thể là ảnh thay thế)
  const tune = tuningOf(shown);
  const motion = tuningOf(cur.pose).motion; // chuyển động theo pose được yêu cầu
  const p = popIn(f, cur.at, 11);
  const o = openness(f);

  // hiệu ứng thân người (luôn có)
  const enter = spring({ frame: f, fps: FPS, config: { damping: 14, stiffness: 120 } });
  const breathe = 1 + Math.sin(f / 22) * 0.006;
  const talkBob = -o * 7 + Math.sin(f / 16) * 3;
  let tilt = Math.sin(f / 9) * o * 1.3;
  let dx = 0, dy = 0, sx = 1;

  // body language theo pose, diễn ra ngay sau khi đổi pose
  if (motion === "shake" && since < 14) dx = Math.sin(since * 2.6) * 9 * (1 - since / 14);
  if (motion === "bounce" && since < 18) dy = -Math.abs(Math.sin(since * 0.35)) * 20 * (1 - since / 18);
  if (motion === "shrug" && since < 22) { dy = -Math.sin((since / 22) * Math.PI) * 16; sx = 1 + Math.sin((since / 22) * Math.PI) * 0.025; }
  if (motion === "nod" && since < 18) tilt += Math.sin((since / 18) * Math.PI * 2) * 2.4 * (1 - since / 18);
  if (motion === "sway") tilt += Math.sin(f / 26) * 1.6;

  const lastEm = EMPH_FRAMES.filter((x) => x <= f).pop() ?? -99;
  const hop = f - lastEm < 10 ? -Math.sin(((f - lastEm) / 10) * Math.PI) * 12 : 0;
  const blink = tune.blink && (f % 96 < 4 || (f % 287 > 140 && f % 287 < 144));

  // Khung ảnh pose rộng 1220 nhưng vẫn giữ tỉ lệ cũ (820px ứng với 1120 đơn vị); phần rộng thêm ở bên phải dành cho bàn tay giơ ra.
  if (EMPTY) return null;
  const K = 820 / 1120, W = Math.round(IMG_W * K), H = Math.round(IMG_H * K);
  return (
    <div
      style={{
        position: "absolute", left: 1080 - 820 - 60, top: 1920 - H + 160, width: W, height: H,
        translate: `${dx}px ${talkBob + hop + dy + (1 - enter) * 500}px`, rotate: `${tilt}deg`,
        scale: `${breathe * sx * (0.95 + 0.05 * p)} ${breathe * (1.04 - 0.04 * p)}`, transformOrigin: `${0.62 * 820}px 100%`,
      }}
    >
      {Object.entries(AVAILABLE).map(([k, file]) => (
        <Img key={k} src={staticFile(`poses/${file}`)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: k === shown ? 1 : 0 }} />
      ))}
      <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} aria-hidden="true">
        <Mouth o={o} t={tune} />
        {blink && <Blink t={tune} />}
        <Burst t={since} head={tune.head} />
      </svg>
    </div>
  );
};
