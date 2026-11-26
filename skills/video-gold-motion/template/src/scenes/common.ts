import { paraStart, phraseFrame } from "../lib";

export const LEAD = 6; // cảnh xuất hiện sớm hơn giọng đọc 6 frame

export const sceneStart = (p: number) => Math.max(0, paraStart(p) - LEAD);

/** q(phrase) = frame (tương đối trong cảnh) khi giọng đọc bắt đầu nói cụm từ đó. */
export const cues = (p: number) => {
  const st = sceneStart(p);
  return (phrase: string, nth = 0, offset = 0) => phraseFrame(p, phrase, nth) - st + offset;
};
