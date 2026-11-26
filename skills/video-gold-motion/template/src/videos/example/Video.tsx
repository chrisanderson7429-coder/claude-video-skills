import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { sceneStart } from "../../scenes/common";
import { phraseFrame, paraEnd, setTimeline, Word } from "../../lib";
import { DarkBg, DarkCaptions, OVERLAP, K } from "../../components/motion/kit";
import { MOTION5_SCENES as SCENES } from "./Scenes";
import wordsJson from "./words.json";
import loudJson from "./loudness.json";

// Bản motion graphics nền tối của video "5 công cụ". Giọng: bản giọng fivetools làm chậm 0.9x (public/motion5/voice.mp3), mốc thời gian giãn theo cùng tỉ lệ.
export const M5_WORDS = wordsJson as Word[];
const M5_LOUD = loudJson as number[];
/** Đặt true sau khi đã có public/example/voice.mp3 và đã chạy nap-giong.ps1 (căn chữ theo giọng thật). */
export const HAS_VOICE = false;
const TAIL = 45;
export const M5_DURATION = Math.round((M5_WORDS[M5_WORDS.length - 1].e / 1000) * 30) + TAIL;

const SFX = {
  whoosh: "https://remotion.media/whoosh.wav",
  click: "https://remotion.media/mouse-click.wav",
  ding: "https://remotion.media/ding.wav",
  switch: "https://remotion.media/switch.wav",
};
type Sfx = { at: number; src: string; vol: number };
/** Cụm từ mở đầu mỗi cảnh ngắn (trùng với Scenes.tsx), để đặt tiếng "vút" đúng lúc chuyển cảnh. */
export const CUTS: string[][] = [
  ["Năm công cụ", "tìm skill,", "lập kế hoạch code,", "giữ ngữ cảnh,", "thiết kế giao diện,", "rút kinh nghiệm"],
  ["Bạn mô tả", "agent sẽ tìm", "Tiện ở chỗ", "Nhưng tìm thấy", "hãy kiểm tra"],
  ["Đây là", "làm rõ yêu cầu", "kiểm thử,", "chia việc", "Một số bước", "Giá trị", "chứ không phải"],
  ["Nó ghi lại", "rồi đưa", "Nhưng nó", "Với việc nhạy cảm,", "lưu ở đâu,"],
  ["Nó cung cấp", "giúp agent", "Nhưng đẹp", "nên hãy"],
  ["Có nhiều", "nên hãy xem", "Nó quan sát", "ghi lại", "rồi đề xuất", "Quan trọng là", "bạn rà soát", "Cài xong"],
  ["và không phải", "Hãy bắt đầu", "kiểm tra quyền", "Không cần cài", "và đừng lấy"],
  ["Bình luận", "và theo dõi"],
];
const buildSfx = (): Sfx[] => {
  const P = phraseFrame;
  const c = (p: number, ph: string, src = SFX.click, vol = 0.35, off = 0) => ({ at: P(p, ph) + off, src, vol });
  return [
    ...SCENES.map((_, p) => ({ at: sceneStart(p), src: SFX.whoosh, vol: 0.32 })),
    ...CUTS.flatMap((phs, p) => phs.map((ph) => ({ at: P(p, ph) - 7, src: SFX.whoosh, vol: 0.2 }))),
    c(0, "cả kho skill", SFX.switch, 0.35, 4), c(0, "tìm skill,"), c(0, "lập kế hoạch code,"), c(0, "giữ ngữ cảnh,"), c(0, "thiết kế giao diện,"), c(0, "rút kinh nghiệm"),
    c(1, "Bạn mô tả", SFX.whoosh, 0.22, -4), c(1, "trình bày lựa chọn"), c(1, "hỗ trợ cài.", SFX.click, 0.5), c(1, "Tiện ở chỗ", SFX.whoosh, 0.25, -4), c(1, "nguồn,"), c(1, "nội dung"), c(1, "quyền trước"),
    c(2, "làm rõ yêu cầu"), c(2, "thiết kế trước,"), c(2, "lập kế hoạch,"), c(2, "kiểm thử,"), c(2, "agent phụ"), c(2, "rà soát kết quả."), c(2, "Giá trị", SFX.ding, 0.25), c(2, "code luôn đúng.", SFX.switch, 0.35),
    c(3, "tổng hợp", SFX.ding, 0.22), c(3, "phiên sau,", SFX.switch, 0.35), c(3, "dữ liệu nào"), c(3, "lưu ở đâu,"), c(3, "nhà cung cấp"), c(3, "chi phí ra sao"),
    c(4, "phong cách,"), c(4, "màu sắc,"), c(4, "kiểu chữ"), c(4, "điện thoại", SFX.ding, 0.25), c(4, "khả năng tiếp cận."),
    c(5, "đúng repo"), c(5, "điểm vướng"), c(5, "thao tác lặp lại,"), c(5, "đề xuất", SFX.ding, 0.25), c(5, "bạn rà soát"), c(5, "duyệt,", SFX.click, 0.5), c(5, "cài bản cập nhật.", SFX.switch, 0.35), c(5, "cấu hình kích hoạt", SFX.switch, 0.35, 5),
    c(6, "năm nút thắt", SFX.ding, 0.25), c(6, "chỗ bạn đang vướng,"), c(6, "dữ liệu không nhạy cảm,"), c(6, "kiểm tra quyền"), c(6, "dùng rộng hơn."), c(6, "cả năm cùng lúc,", SFX.switch, 0.35, 4), c(6, "an toàn.", SFX.switch, 0.35),
    c(7, "tìm skill,"), c(7, "code,"), c(7, "ghi nhớ"), c(7, "thiết kế?"), c(7, "Bình luận"), c(7, "theo dõi", SFX.click, 0.5), c(7, "theo dõi", SFX.ding, 0.3, 3),
  ];
};

export const Motion5Video: React.FC = () => {
  setTimeline(M5_WORDS, M5_LOUD);
  const sfx = useMemo(buildSfx, []);
  return (
    <AbsoluteFill style={{ backgroundColor: K.bg }}>
      <DarkBg />
      {SCENES.map((Scene, p) => {
        const from = sceneStart(p);
        const to = p + 1 < SCENES.length ? sceneStart(p + 1) : paraEnd(p) + TAIL;
        return (
          <Sequence key={p} from={from} durationInFrames={to - from + OVERLAP} name={`Đoạn ${p + 1}`}>
            <Scene end={to - from} />
          </Sequence>
        );
      })}
      <DarkCaptions />
      {HAS_VOICE && <Audio src={staticFile("example/voice.mp3")} />}
      {HAS_VOICE && sfx.map((s, k) => (
        <Sequence key={k} from={Math.max(0, s.at)} durationInFrames={45} name="sfx">
          <Audio src={s.src} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
