import poseFiles from "./poseFiles.json";

/**
 * DANH SÁCH TÊN POSE (tên file ảnh = tên pose + .png, đặt trong public/poses/).
 * Anh chỉ cần làm ảnh rồi thả vào đúng tên; thiếu ảnh nào thì pose đó tự dùng ảnh thay thế (FALLBACK).
 */
export const POSE_NAMES = [
  "neutral",   // đứng yên, mặt bình thường, tay buông/khoanh nhẹ  (tư thế chờ)
  "point",     // chỉ tay vào nội dung                              (đã có)
  "palm",      // xoè bàn tay giới thiệu / giải thích               (đã có)
  "surprised", // ngạc nhiên, miệng tròn "O"                       (đã có)
  "thumbs",    // giơ ngón cái - like                              (đã có)
  "think",     // tay chống cằm, nhìn lên suy nghĩ
  "warn",      // giơ tay "dừng lại / lưu ý"
  "shrug",     // nhún vai, hai tay xoè - "tuỳ bạn / chưa chắc"
  "happy",     // cười tươi, hai tay nắm vui vẻ
  "ok",        // ngón tay OK - "chạy được rồi" (chưa có ảnh → dùng thumbs)
  "wave",      // vẫy tay chào
] as const;
export type PoseName = (typeof POSE_NAMES)[number];

/** Chuyển động thân người khi vừa đổi sang pose. */
export type Motion = "none" | "shake" | "bounce" | "shrug" | "nod" | "sway";

export type Tuning = {
  /** Tâm miệng (toạ độ theo ảnh pose gốc) và độ to của miệng vẽ đè. */
  mouth: { x: number; y: number; scale: number };
  /** talk = miệng mấp máy theo giọng, round = miệng tròn (ngạc nhiên), none = không vẽ đè miệng. */
  mouthStyle: "talk" | "round" | "none";
  /** Màu da dùng để che miệng/mắt gốc khi vẽ đè (lấy màu da vùng mặt trong ảnh). */
  skin: string;
  /** Vị trí hai mắt để chớp mắt. Đặt blink=false nếu pose nhắm mắt/đeo kính che mắt. */
  eyes: { x: number; y: number }[];
  blink: boolean;
  /** Tâm đầu (cho tia nhấn). */
  head: { x: number; y: number };
  /** Độ nghiêng đầu (độ, âm = nghiêng sang trái) để miệng/mắt vẽ đè khớp. */
  tilt: number;
  /** Độ cong của miệng khi ngậm: 1 = cười, 0 = môi phẳng (mặt nghiêm). */
  smile: number;
  motion: Motion;
};

/** Ảnh pose chuẩn: 1220 x 1150 px, nền trong suốt, nhân vật cắt từ đầu gối/bụng trở lên. */
export const IMG_W = 1220;
export const IMG_H = 1150;

const BASE: Tuning = {
  mouth: { x: 694, y: 452, scale: 1 },
  mouthStyle: "talk",
  skin: "#FCC49E",
  eyes: [{ x: 630, y: 346 }, { x: 747, y: 344 }],
  blink: true,
  head: { x: 690, y: 250 },
  tilt: 0,
  smile: 1,
  motion: "none",
};

/**
 * Chỉnh riêng cho từng pose (chỉ ghi phần khác mặc định BASE).
 * Cách lấy toạ độ miệng/mắt cho ảnh mới: mở Remotion Studio → composition "CanhMieng".
 */
const OVERRIDES: Partial<Record<PoseName, Partial<Tuning>>> = {
  neutral: {
    mouth: { x: 694, y: 466, scale: 1 }, eyes: [{ x: 630, y: 346 }, { x: 747, y: 345 }],
    tilt: -0.7, skin: "#fdc096", motion: "none",
  },
  point: {
    // ảnh chỉ tay cũ
    mouth: { x: 694, y: 452, scale: 1 }, eyes: [{ x: 630, y: 346 }, { x: 747, y: 344 }],
    tilt: 0, skin: "#FCC49E", motion: "nod",
  },
  palm: {
    mouth: { x: 704, y: 455, scale: 1 }, eyes: [{ x: 631, y: 350 }, { x: 747, y: 339 }],
    tilt: -5.3, skin: "#fcbe94", motion: "none",
  },
  surprised: {
    mouth: { x: 699, y: 483, scale: 1.3 }, eyes: [{ x: 630, y: 347 }, { x: 746, y: 342 }],
    tilt: -2.4, skin: "#fbbf98", motion: "shake", mouthStyle: "round", blink: false,
  },
  thumbs: {
    mouth: { x: 688, y: 467, scale: 1 }, eyes: [{ x: 630, y: 346 }, { x: 747, y: 344 }],
    tilt: -1.2, skin: "#fdc5a0", motion: "bounce",
  },
  think: {
    mouth: { x: 670, y: 465, scale: 1 }, eyes: [{ x: 631, y: 336 }, { x: 746, y: 354 }],
    tilt: 8.9, skin: "#fcc49b", motion: "sway", blink: false, smile: 0.3,
  },
  warn: {
    mouth: { x: 699, y: 465, scale: 1 }, eyes: [{ x: 630, y: 349 }, { x: 747, y: 342 }],
    tilt: -3.5, skin: "#fec298", motion: "shake", blink: false, smile: 0,
  },
  shrug: {
    mouth: { x: 723, y: 452, scale: 1 }, eyes: [{ x: 631, y: 357 }, { x: 746, y: 334 }],
    tilt: -11.3, skin: "#fec49a", motion: "shrug", smile: 0.5,
  },
  happy: {
    mouth: { x: 704, y: 456, scale: 1.1 }, eyes: [{ x: 630, y: 351 }, { x: 747, y: 339 }],
    tilt: -5.6, skin: "#fec49e", motion: "bounce",
  },
  wave: {
    mouth: { x: 693, y: 458, scale: 1 }, eyes: [{ x: 630, y: 347 }, { x: 747, y: 342 }],
    tilt: -2.3, skin: "#fec7a3", motion: "sway",
  },
};

export const tuningOf = (pose: PoseName): Tuning => ({ ...BASE, ...(OVERRIDES[pose] ?? {}) });

/** Chưa có ảnh của pose nào thì dùng ảnh của pose này (đi theo chuỗi cho tới khi gặp ảnh có sẵn). */
export const FALLBACK: Record<PoseName, PoseName> = {
  neutral: "point",
  point: "palm",
  palm: "point",
  surprised: "palm",
  thumbs: "palm",
  think: "palm",
  warn: "surprised",
  shrug: "palm",
  happy: "thumbs",
  ok: "thumbs",
  wave: "point",
};

/** Các pose đang có ảnh trong public/poses (do scripts/scan-poses.mjs ghi ra poseFiles.json). */
export const AVAILABLE: Record<string, string> = poseFiles as Record<string, string>;

export const resolvePose = (pose: PoseName): PoseName => {
  let p: PoseName = pose;
  for (let i = 0; i < POSE_NAMES.length; i++) {
    if (AVAILABLE[p]) return p;
    p = FALLBACK[p];
  }
  return (Object.keys(AVAILABLE)[0] ?? "point") as PoseName;
};
