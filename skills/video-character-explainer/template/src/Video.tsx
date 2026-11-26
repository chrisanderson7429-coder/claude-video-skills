import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { Character, PoseCue } from "./components/Character";
import { S1, S2, S3, S4, S5, S6 } from "./scenes/ScenesA";
import { S7, S8, S9, S10, S11, S12 } from "./scenes/ScenesB";
import { sceneStart } from "./scenes/common";
import { phraseFrame, paraEnd, setTimeline, Word } from "./lib";
import wordsJson from "./data/words.json";
import loudJson from "./data/loudness.json";

export const OY_WORDS = wordsJson as Word[];
const OY_LOUD = loudJson as number[];
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { applyTheme } from "./theme";

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];
/** Đặt true sau khi đã có public/voice.mp3 (chạy nap-giong.ps1). */
export const HAS_VOICE = false;
export const TAIL = 45; // giữ khung cuối 1.5s sau giọng đọc

const P = phraseFrame;
const buildPoses = (): PoseCue[] => [
  { at: 0, pose: "wave" }, { at: P(0, "dù phía sau"), pose: "surprised" },
  { at: sceneStart(1), pose: "palm" }, { at: P(1, "nền tảng"), pose: "point" }, { at: P(1, "không phải"), pose: "shrug" },
  { at: sceneStart(2), pose: "point" }, { at: P(2, "Cách nói"), pose: "palm" }, { at: P(2, "thậm chí"), pose: "happy" },
  { at: sceneStart(3), pose: "palm" }, { at: P(3, "Những động tác"), pose: "point" }, { at: P(3, "không phải mọi"), pose: "shrug" },
  { at: sceneStart(4), pose: "point" }, { at: P(4, "Nguồn đọc chat"), pose: "palm" }, { at: P(4, "bộ mã không tự"), pose: "warn" },
  { at: sceneStart(5), pose: "think" }, { at: P(5, "Nhờ đó,"), pose: "happy" },
  { at: sceneStart(6), pose: "palm" }, { at: P(6, "Không phải chỉ"), pose: "warn" },
  { at: sceneStart(7), pose: "point" }, { at: P(7, "npm install,"), pose: "palm" },
  { at: sceneStart(8), pose: "warn" },
  { at: sceneStart(9), pose: "warn" }, { at: P(9, "Khuôn mặt số"), pose: "palm" }, { at: P(9, "hãy kiểm tra"), pose: "think" },
  { at: sceneStart(10), pose: "palm" }, { at: P(10, "Bạn cần"), pose: "point" },
  { at: sceneStart(11), pose: "think" }, { at: P(11, "Bình luận"), pose: "thumbs" },
];

// Hiệu ứng âm thanh (thư viện mẫu của Remotion; có thể thay bằng kho SFX riêng)
const SFX = {
  whoosh: "https://remotion.media/whoosh.wav",
  click: "https://remotion.media/mouse-click.wav",
  ding: "https://remotion.media/ding.wav",
  whip: "https://remotion.media/whip.wav",
  switch: "https://remotion.media/switch.wav",
};
type Sfx = { at: number; src: string; vol: number };
const buildSfx = (POSES: PoseCue[]): Sfx[] => [
  ...SCENES.map((_, p) => ({ at: sceneStart(p), src: SFX.whoosh, vol: 0.35 })),
  ...POSES.filter((c) => c.pose === "surprised" || c.pose === "warn").map((c) => ({ at: c.at, src: SFX.whip, vol: 0.3 })),
  { at: P(0, "trả lời chat"), src: SFX.click, vol: 0.45 }, { at: P(0, "người xem quen"), src: SFX.click, vol: 0.45 }, { at: P(0, "theo lịch"), src: SFX.click, vol: 0.45 },
  { at: P(0, "không có người dẫn"), src: SFX.switch, vol: 0.45 },
  { at: P(1, "nền tảng"), src: SFX.click, vol: 0.45 }, { at: P(1, "tải về là chạy."), src: SFX.switch, vol: 0.45 },
  { at: P(2, "sắc thái"), src: SFX.click, vol: 0.4 }, { at: P(2, "tiếng đệm"), src: SFX.click, vol: 0.4 },
  { at: P(3, "vẫy tay"), src: SFX.click, vol: 0.4 }, { at: P(3, "nhảy"), src: SFX.click, vol: 0.4 }, { at: P(3, "tự sinh tức thì."), src: SFX.switch, vol: 0.4 },
  { at: P(4, "API chính thức"), src: SFX.ding, vol: 0.3 }, { at: P(4, "chương trình"), src: SFX.ding, vol: 0.3 }, { at: P(4, "không tự đăng nhập"), src: SFX.switch, vol: 0.45 },
  { at: P(5, "tâm trạng,"), src: SFX.click, vol: 0.4 }, { at: P(5, "nhật ký,"), src: SFX.click, vol: 0.4 }, { at: P(5, "ghi chú"), src: SFX.click, vol: 0.4 }, { at: P(5, "số không."), src: SFX.switch, vol: 0.45 },
  { at: P(6, "bài đăng tự động"), src: SFX.click, vol: 0.4 }, { at: P(6, "mọi nền tảng."), src: SFX.switch, vol: 0.45 },
  { at: P(7, "npm install,"), src: SFX.click, vol: 0.4 }, { at: P(7, "npm test,"), src: SFX.click, vol: 0.4 },
  { at: P(8, "chưa hoạt động"), src: SFX.switch, vol: 0.4 },
  { at: P(9, "không đồng nghĩa"), src: SFX.whip, vol: 0.35 }, { at: P(9, "bảng chi phí"), src: SFX.ding, vol: 0.3 },
  { at: P(10, "nhân vật,"), src: SFX.ding, vol: 0.25 }, { at: P(10, "cấu hình"), src: SFX.ding, vol: 0.25 },
  { at: P(11, "Bình luận"), src: SFX.click, vol: 0.45 }, { at: P(11, "chia sẻ"), src: SFX.click, vol: 0.45 }, { at: P(11, "theo dõi"), src: SFX.ding, vol: 0.35 },
];

export const themeSchema = z.object({
  mauChuDao: zColor().describe("Màu chủ đạo (chữ nhấn, nhãn, dấu X, thẻ nổi bật)"),
  mauNen: zColor().describe("Màu nền video"),
});
export type ThemeProps = z.infer<typeof themeSchema>;

export const Video: React.FC<ThemeProps> = ({ mauChuDao, mauNen }) => {
  applyTheme(mauChuDao, mauNen);
  setTimeline(OY_WORDS, OY_LOUD);
  const POSES = useMemo(buildPoses, []);
  const sfx = useMemo(() => buildSfx(POSES), [POSES]);
  return (
    <AbsoluteFill style={{ backgroundColor: mauNen }}>
      <Background />
      {/* vùng nội dung phóng to 8% (nhân vật đã dời xuống nên có thêm chỗ) */}
      <AbsoluteFill style={{ scale: "1.08", transformOrigin: "540px 470px" }}>
        {SCENES.map((Scene, p) => {
          const from = sceneStart(p);
          const to = p + 1 < SCENES.length ? sceneStart(p + 1) : paraEnd(p) + TAIL;
          return (
            <Sequence key={p} from={from} durationInFrames={to - from} name={`Cảnh ${p + 1}`}>
              <SceneFrame dur={to - from}><Scene /></SceneFrame>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Character cues={POSES} />
      <Captions />
      {HAS_VOICE && <Audio src={staticFile("voice.mp3")} />}
      {HAS_VOICE && sfx.map((s, k) => (
        <Sequence key={k} from={Math.max(0, s.at)} durationInFrames={45} name="sfx">
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Mờ dần cảnh ở 5 frame cuối trước khi cảnh sau vào. */
const SceneFrame: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 5, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
