// Transcribe the voice with whisper.cpp (multilingual "small", Vietnamese).
// whisper.cpp must live in an ASCII-only path (Windows), so it is passed in as argv[2].
// Usage: node scripts/transcribe.mjs <whisperDir> <wav> <outJson>
import fs from "fs";
import { downloadWhisperModel, installWhisperCpp, transcribe } from "@remotion/install-whisper-cpp";

const [, , to, wav, outJson] = process.argv;
await installWhisperCpp({ to, version: "1.5.5" });
await downloadWhisperModel({ model: "small", folder: to });
const out = await transcribe({
  model: "small",
  whisperPath: to,
  whisperCppVersion: "1.5.5",
  inputPath: wav,
  tokenLevelTimestamps: true,
  language: "vi",
});
fs.writeFileSync(outJson, JSON.stringify(out, null, 1));
console.log("segments:", out.transcription.length);
