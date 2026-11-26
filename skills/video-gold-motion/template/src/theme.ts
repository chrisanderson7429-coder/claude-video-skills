import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

/** Font chữ đơn cách (link, code, nhãn nhỏ). Font chính Be Vietnam Pro được nạp trong components/motion/kit.tsx. */
export const MONO = loadMono("normal", { weights: ["500"], subsets: ["latin", "latin-ext", "vietnamese"] }).fontFamily;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
