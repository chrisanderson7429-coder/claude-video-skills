import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { AVAILABLE, IMG_H, IMG_W, POSE_NAMES, tuningOf } from "./data/poses";
import { Blink, Mouth } from "./components/Face";

export const calibSchema = z.object({
  pose: z.enum(POSE_NAMES).describe("Chọn pose cần canh miệng"),
  mouthX: z.number().min(0).max(IMG_W).step(1).describe("Miệng: vị trí ngang (x)"),
  mouthY: z.number().min(0).max(IMG_H).step(1).describe("Miệng: vị trí dọc (y)"),
  tilt: z.number().min(-20).max(20).step(0.1).describe("Độ nghiêng đầu (độ)"),
  mouthScale: z.number().min(0.4).max(2).step(0.05).describe("Miệng: độ to"),
  open: z.number().min(0).max(1).step(0.05).describe("Độ mở miệng thử (0 = ngậm, 1 = há to)"),
  skin: zColor().describe("Màu da che miệng/mắt gốc (lấy màu da vùng mặt)"),
  showEyes: z.boolean().describe("Hiện hình mắt nhắm (kiểm tra chớp mắt)"),
  eyeLX: z.number().min(0).max(IMG_W).step(1).describe("Mắt trái x"),
  eyeLY: z.number().min(0).max(IMG_H).step(1).describe("Mắt trái y"),
  eyeRX: z.number().min(0).max(IMG_W).step(1).describe("Mắt phải x"),
  eyeRY: z.number().min(0).max(IMG_H).step(1).describe("Mắt phải y"),
});
export type CalibProps = z.infer<typeof calibSchema>;

const d = tuningOf("point");
export const calibDefaults: CalibProps = {
  pose: "point", mouthX: d.mouth.x, mouthY: d.mouth.y, mouthScale: d.mouth.scale, tilt: d.tilt, open: 0.6, skin: d.skin,
  showEyes: false, eyeLX: d.eyes[0].x, eyeLY: d.eyes[0].y, eyeRX: d.eyes[1].x, eyeRY: d.eyes[1].y,
};

/** Công cụ canh miệng/mắt cho ảnh pose mới: kéo số bên phải Studio, rồi chép dòng hiện trên khung vào src/data/poses.ts. */
export const MouthCalib: React.FC<CalibProps> = (p) => {
  const base = tuningOf(p.pose);
  const t = {
    ...base,
    skin: p.skin,
    tilt: p.tilt,
    mouth: { x: p.mouthX, y: p.mouthY, scale: p.mouthScale },
    eyes: [{ x: p.eyeLX, y: p.eyeLY }, { x: p.eyeRX, y: p.eyeRY }],
  };
  const file = AVAILABLE[p.pose];
  return (
    <AbsoluteFill style={{ background: "#CFCFCF" }}>
      {file ? (
        <Img src={staticFile(`poses/${file}`)} style={{ position: "absolute", left: 0, top: 0, width: IMG_W, height: IMG_H }} />
      ) : (
        <div style={{ position: "absolute", left: 40, top: 40, font: "600 34px sans-serif", color: "#B00020" }}>
          Chưa có ảnh public/poses/{p.pose}.png (chạy lại scripts/scan-poses.mjs sau khi thêm ảnh)
        </div>
      )}
      <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} width={IMG_W} height={IMG_H} style={{ position: "absolute", left: 0, top: 0 }}>
        <Mouth o={p.open} t={t} />
        {p.showEyes && <Blink t={t} />}
        {/* chữ thập định vị */}
        <g stroke="#FF2D55" strokeWidth={2} opacity={0.85}>
          <line x1={p.mouthX - 70} y1={p.mouthY} x2={p.mouthX + 70} y2={p.mouthY} />
          <line x1={p.mouthX} y1={p.mouthY - 50} x2={p.mouthX} y2={p.mouthY + 50} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 24, bottom: 24, right: 24, padding: "14px 18px", background: "rgba(20,20,20,.85)", color: "#fff", font: "500 24px/1.4 monospace", borderRadius: 12 }}>
        {p.pose}: {"{"} mouth: {"{"} x: {p.mouthX}, y: {p.mouthY}, scale: {p.mouthScale} {"}"}, tilt: {p.tilt}, skin: "{p.skin}", eyes: [{"{"}x: {p.eyeLX}, y: {p.eyeLY}{"}"}, {"{"}x: {p.eyeRX}, y: {p.eyeRY}{"}"}] {"}"}
      </div>
    </AbsoluteFill>
  );
};
