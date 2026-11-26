import { loadFont as loadSans } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Video gốc dùng Instrument Sans + Instrument Serif Italic, nhưng hai font này không có bộ chữ tiếng Việt.
// Thay bằng cặp gần giống nhất có tiếng Việt: Hanken Grotesk + Newsreader Italic.
export const SANS = loadSans("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext", "vietnamese"] }).fontFamily;
export const SERIF = loadSerif("italic", { weights: ["500"], subsets: ["latin", "latin-ext", "vietnamese"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["500"], subsets: ["latin", "latin-ext", "vietnamese"] }).fontFamily;

export const C = {
  bg: "#EAF0EE",
  dot: "#D3DAD7",
  ink: "#151515",
  muted: "#8A857C",
  accent: "#0B6E6E",
  accentSoft: "#D6EAEA",
  card: "#FFFFFF",
  shadow: "#1A1A1A",
  dark: "#1E1E22",
  green: "#2E7D4F",
};

/** Làm tối/sáng một màu hex theo hệ số (âm = tối hơn). */
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k));
  return "#" + ch.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
};

/** Áp màu chủ đạo + màu nền do người dùng chọn (gọi ở đầu mỗi lần render). */
export const applyTheme = (accent: string, background: string) => {
  C.accent = accent;
  C.accentSoft = shade(accent, 0.82);
  C.bg = background;
  C.dot = shade(background, -0.09);
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
